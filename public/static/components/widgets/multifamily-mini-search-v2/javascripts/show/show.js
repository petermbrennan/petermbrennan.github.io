class MultifamilyMiniSearchV2Widget {
  constructor(configs){
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    this.primarySearch();
  }

  primarySearch() {
    return $.ajax({
      url: `${this.configs.serviceURL}/api/v1/client_location_data/${this.configs.clientURN}`,
      dataType: 'json',
      success: data => {
        this.setCountry(data.countries);
        data.states.sort((a, b) => a.name_abbr < b.name_abbr ? -1 : 1);
        data.cities.sort((a, b) => a.name < b.name ? -1 : 1);
        new corpSearchMarkupBuilder(data, this.configs);
        if (this.configs.useUniversalSearch === "true") {
          this.universalSearch(data);
          this.typeAheadChange();
          this.keyUp();
          this.widget.find('.search-fields').css({'overflow':'visible'});
          this.widget.find('.searh-input').css({'padding':'0.5em 1em'});
          this.widget.find('.search-form').css({'height': '200px'})
        } else {
          this.widget.find('.mf-search-go-button.default-submit-button').on('click', () => new searchSubmittal(data, this.configs));
        }
      }
    });
  }

  setCountry(countries){
    let stateSelect = this.widget.find('select.mf-search-states.default-select');
    let stateSelectOption = stateSelect.find("option").first();
    let searchInput = this.widget.find('.mf-search-input');
    if (countries.length === 1 && countries[0].name == "CA"){
      stateSelectOption.text('Province');
      searchInput.attr('placeholder', 'Search by City, Province, or Postal Code');
    } else if (countries.length === 2){
      stateSelectOption.text('State or Province');
      searchInput.attr('placeholder', 'Search by City, State/Province, or Zip/Postal Code');
    } else {
      searchInput.attr('placeholder', 'Search by City, State, or Zip');
    }
  }

  createHref(params) {
    let queryString = `//${window.location.host + this.configs.corpSearchPage}`;
    queryString += params.length ? `#/locations?amenities=${params.join('')}` : '';
    this.widget.find('.mf-search-go-button.default-submit-button').on('click', () => {
      window.location = queryString;
    });
  }

  universalSearch(data) {
    this.states = data.states;
    this.cities = data.cities;
    this.postalCodes = data.postal_codes;
    this.brandedNames = data.branded_names;
    this.searchCriteria = {};

    let typeaheadData = [];
    //build 'city, state' search
    for (let state of data.states) {
      typeaheadData.push({loc: state.name});
      this.searchCriteria[state.name] = 'state';
      for (var cityId of state.cities) {
        let cityById = data.cities.filter(city => city.id === cityId);
        let city = cityById[0].name;
        var cityState = `${city}, ${state.name}`;
        this.searchCriteria[cityState] = 'city state';
        typeaheadData.push({loc: cityState});
      }
    }
    for (var area of this.postalCodes) {
      this.searchCriteria[area.postal_code] = 'postal code';
      typeaheadData.push({loc: area.postal_code, code: area.postal_code});
    }
    for (var loc of this.brandedNames) {
      this.searchCriteria[loc.name] = 'branded name';
      typeaheadData.push({loc: loc.name, name: loc.name});
    }

    let options = {
      autoselect: true,
      minLength: 1,
      highlight: true
    };

    let locations = new Bloodhound({
      local: typeaheadData,
      identify(obj) {
        return obj.loc;
      },
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('loc'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    data = {
      name: 'typeaheadData',
      source(q, sync) {
        if (q === '') { return sync(locations.local); } else { return locations.search(q, sync); }
      },
      display: 'loc',
      limit: 100
    };
    this.createHref([]);
    this.widget.find('.mf-search-input').typeahead(options, data);
  }

  typeAheadChange() {
    this.widget.find('.mf-search-input').on('typeahead:selected typeahead:autocompleted typeahead:cursorchange typeahead:close', e => {
      this.typeaheadCurrentVal = e.target.value;

      var params = [],
          input = $(e.currentTarget).typeahead('val'),
          typeOfInput = this.searchCriteria[$(e.currentTarget).typeahead('val')];

      switch (typeOfInput) {
        case 'state':
          var state = (this.states.filter(state => state.name === input))[0].name_abbr;
          params.push(`&state=${escape(state)}`);
          break;
        case 'city state':
          var city = (this.cities.filter((city)=>{
            return input.includes(city.name);
          }))[0].name;
          var state = (this.states.filter((state)=>{
            return input.includes(state.name);
          }))[0].name_abbr;
          params.push(`&state=${escape(state)}`,`&city=${escape(city)}`);
          break;
        case 'postal code':
          params.push(`&postalCode=${escape(input)}`);
          break;
        case 'branded name':
          var name = (this.brandedNames.filter((loc)=>{
            return loc.name === input;
          }))[0].name;
          params.push(`&brandedName=${escape(name)}`);
          break;
        default:
      }
      this.createHref(params);
    });
  }

  keyUp() {
    return this.widget.find('.mf-search-input').on('keyup', e => {
      let dropdownMenu = this.widget.find('.mf-search-input').siblings('.tt-menu'),
          suggestions = dropdownMenu.find('.tt-suggestion');

      //User input does not match any typeahead suggestions.
      if (suggestions.length === 0) { 
        if (e.which === 13){
          this.widget.find('.mf-search-go-button').click(); //implicit submit after enter press
        }
        return false;
      }

      // Enter press 13 = enter
      if (e.which === 13) {
        if (this.typeaheadCurrentVal) {
          }else{
          suggestions.first().click();
        }
        this.widget.find('.mf-search-go-button').click(); //implicit submit after enter press
      }

      // Escape press 27 = escape
      if (e.which === 27) {
        this.widget.find('.mf-search-input').blur();
        this.widget.find('.mf-search-input').typeahead('val', '');
        this.createHref([]);
      }
    });
  }
}  // end of MultifamilyMiniSearchV2Widget

// Define city/state selects and set up listener for when state changes
class corpSearchMarkupBuilder {
  constructor(data, configs) {
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    let stateSelect = this.widget.find('select.mf-search-states.default-select');
    let citySelect = this.widget.find('select.mf-search-cities.default-select');
    let optionsArray = []
    data.states.forEach(x => optionsArray.push({name: x.name_abbr, id: x.id}));
    new optionsBuilder(optionsArray, stateSelect);

    stateSelect.change(() => new citySelectUpdater(data, stateSelect, citySelect));
  }
}

// Listening for a state change to repopulate the city dropdown
class citySelectUpdater {
  constructor(data, stateSelect, citySelect) {
    // reset the values in the city select
    citySelect.html("<option value=''>City</option>");
    // get the currently selected state
    let selectedState = stateSelect.val();
    // build an array of currently relevant cities
    let relevantCities = data.cities.filter(city => city.state_id === parseInt(selectedState,10));
    // update the select options
    new optionsBuilder(relevantCities, citySelect);
  }
}

// Pass a select element and a list of options to fill it in with
class optionsBuilder {
  constructor(options, element) {
    let markup = options.reduce((memo,option) => {
      return `${memo}<option value='${option.id}'>${option.name}</option>`
    }, '');
    element.append(markup);
  }
}

class searchSubmittal {
  constructor(data, configs) {
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    let selectedState = this.widget.find('select.mf-search-states.default-select').val();
    let selectedCity = this.widget.find('select.mf-search-cities.default-select').val() || this.widget.find('select.mf-search-cities.default-select').data().id;

    let stateObject = data.states.filter(state => state.id === parseInt(selectedState,10));
    let stateParam = typeof(stateObject[0]) !== "undefined" ? `&state=${stateObject[0].name_abbr}` : "";

    let cityObject = data.cities.filter(city => city.id === parseInt(selectedCity,10));
    let cityParam = typeof(cityObject[0]) !== "undefined" ? `&city=${cityObject[0].name}` : "";

    let queryString = `#/locations?page=1${stateParam}${cityParam}`;
    window.location = `//${window.location.host}${this.configs.corpSearchPage}${queryString}`;
  }
}


G5.loadWidgetConfigs('.multifamily-mini-search-v2 .config', MultifamilyMiniSearchV2Widget);
