class CareersWidget {
  constructor(configs) {
                        // Used for responsive design
    Object.assign(this, {SMALL: 480, LARGE: 980, XLARGE: 1170, configs});
    G5.fortAwesomeApi.registerWidget(this, 'fortAwesomeLoaded');

    // URL encode search params to send to api proxy
    this.clientName = encodeURIComponent(`"${this.configs.clientName}"`);
    this.channel = encodeURIComponent(this.configs.channel);

    // Store widget and ID
    this.widgetId = this.configs.widgetId;
    this.widget = $(`#${this.widgetId}`);

    // Store page url
    this.path = location.protocol + '//' + location.host + location.pathname + '?page=';

    // Set start param based on current page
    this.start = this.startPage(this.currentPage());

    // Store variable client name option
    this.clientNameVar = this.configs.clientNameVar;

    // Strip ascii characters from output
    this.clientNameStr = decodeURI(this.clientName).replace(/"/g, '');

    // Used for making back/forward browser buttons to work with ajax requests
    this.popped = ('state' in window.history && window.history.state !== null);
    this.initialURL = location.href;

    // Layout function
    this.setResize();
    this.showWidget();

    // collect all of the posts that are listed and build the widget.
    this.collectPosts().then(({posts, totalResults}) => {
      this.addPosts(posts, totalResults);
      this.bindSortingEvent();
    });
  }

  async collectPosts() {
    //build the first API request URL
    let url = this.buildSearchURLs(1)[0];

    let { posts, totalResults } = await this.requestPosts(url);

    //if the number of posts we were returned is less than the total number of posts, make more requests
    if (posts.length < totalResults) {
      var URLs = this.buildSearchURLs(totalResults);
      URLs.pop(); //remove the first URL - we already requested those posts

      while ( url = URLs.pop() ) { // don't want to 429 the proxy/indeed API so this timeout is here
        await new Promise(resolve => setTimeout(() => { resolve(); }, 750));
        posts.push(...((await this.requestPosts(url)).posts));
      }
    }
    return { posts, totalResults };
  }

  async requestPosts(url) {
    var response = await fetch(url);
    var { results: posts, totalResults } = await response.json();
    return { posts, totalResults };
  }

  addPosts(posts, totalResults) {

    if (posts && posts.length) {
      //add a formatted date attr to the posts
      posts = this.createPostsFormattedDate(posts);
      this.posts = this.sortPosts(posts, this.configs.sortBy); //initial sort of posts

      // if strict Client Name match is enforced, remove all other posts from final array
      this.verifyPosts(posts);

      this.buildMarkup(this.currentPage());

      // set totalResults to the actual number of posts for correct pagination
      totalResults = posts.length;
      this.simplePagination(totalResults);
    } else {
      this.searchFailed('No posts found');
    }
  }

  verifyPosts(posts) {
    // create array of company names from all posts
    var companyNames = posts.map(p => p.company.toLowerCase());
    var uniqCompanyNames = [...new Set(companyNames)];
    var totalCompanyNames = companyNames.length;
    var clientName = this.clientNameStr.toLowerCase();

    // create final post set based on strict or variable client name match
    for (let i = totalCompanyNames - 1; i >= 0; i--) {
      var companyName = companyNames[i];

      if ((companyName != clientName && this.clientNameVar === "false") || (!companyNames[i].includes(clientName) && this.clientNameVar === "true")) {
         companyNames.splice(i, 1);
         posts.splice(i, 1);
      }
    }
  }

  sortPosts(posts, sortBy, ascending=true) {
    return posts.sort((p1, p2) => {
      let p1Val = p1[sortBy], p2Val = p2[sortBy];

      if (p1Val < p2Val) return ascending ? -1 : 1;
      if (p1Val > p2Val) return ascending ? 1 : -1;
      return 0;
    });
  }

  createPostsFormattedDate(posts) {
    return posts.map(p => {
      let date = new Date(p.date);

      return Object.assign(p, {date: date.getTime(),
                               formattedDate: moment(date).format('MM/DD/YYYY'),
                               stateCity: p.state+p.city});
    });
  }

  searchFailed() {
    console.error('There was an error fetching post results', ...arguments);
    this.errorMessage('No job listings were found');
  }

  buildSearchURLs(numberOfPosts) {
    var URLs = [],
        indeedApi = this.configs.indeedApi + '?format=json&',
        APILimit = 25; // not by choice, this is the maximum number of posts we can get at once.
    // the number of requests we need to get all of the posts
    let requestsNeeded = Math.ceil(numberOfPosts / APILimit);

    for (; requestsNeeded ; requestsNeeded--) {
      let searchParams = `publisher=${this.configs.publisherId}&q=company:${this.clientName}&chnl=${this.channel}&limit=${APILimit}&start=${(requestsNeeded-1)*APILimit}&v=2&highlight=0`,
          encodedURI = encodeURIComponent(indeedApi + searchParams),
          apiUrl = this.configs.apiProxy + encodedURI;
      URLs.push(apiUrl);
    }
    return URLs;
  }

  errorMessage(message) {
    message = message || "We're having trouble displaying the job listings. Please try again later";
    this.widget.find('.posts').append(`<li class="post error">${message}</li>`);
  }

  // Calcualte start number for api call
  startPage(pageNumber) {
    return (pageNumber - 1) * this.configs.pageLimit;
  }

  // Pagination plugin, jquery.simplePagination.min.js
  simplePagination(totalResults) {

    // Create pagination wrapper
    this.widget.append('<div class="careers-pagination"></div>');

    this.widget.find('.careers-pagination').pagination({
      items: totalResults,
      itemsOnPage: this.configs.pageLimit,
      currentPage: this.currentPage(),
      edges: 1,
      prevText: "&laquo;",
      nextText: "&raquo;",
      hrefTextPrefix: this.path,
      onPageClick: (pageNumber, e)=>{
        if (e) e.preventDefault();
        // On click of pagination link
        this.paginationPageClick(pageNumber);
      },
      onInit: ()=>{
        // Keeps browser back/forward buttons working with our ajax
        this.historyHandler();
      }
    });
  }

  paginationPageClick(pageNumber) {
    // If user clicks on a page number link, stop page reload
    // The page input field (ellipses) does not return an event

    this.scrollToWidget();
    var start = this.startPage(pageNumber),
        newUrl = this.path + pageNumber;

    this.buildMarkup(pageNumber);
    // If history API is supported, store the current page number
    if (history.pushState) {
      history.pushState({page: pageNumber}, newUrl, newUrl);
    }
  }

  currentPage() {
    return parseInt(this.getUrlParameter("page")) || 1;
  }

  // Keeps browser back/forward buttons working with ajax
  historyHandler() {
    $(window).on('popstate', (e)=> {
      let initialPop = !this.popped && location.href === this.initialURL;
      this.popped = true;

      if (initialPop) {
        this.widget.find('.careers-pagination').pagination('drawPage', this.currentPage());
        return;
      };

      this.scrollToWidget();

      // Grab the previous page number from the pushState
      var pageNumber = e.originalEvent.state === null ? 1 : e.originalEvent.state.page;

      this.buildMarkup(pageNumber);
      // Update current pagination link state
      this.widget.find('.careers-pagination').pagination('drawPage', pageNumber);
    });
  }

  buildMarkup(currentPage) {

    // get the posts for the current page
    var { pageLimit:itemsPerPage, clientName } = this.configs;

    let posts = this.posts.slice((currentPage-1) * itemsPerPage, currentPage*itemsPerPage);

    if (posts.length > 0) {
      var firstPost = posts[0];
      var company = firstPost["company"];
      var filterByConfig = this.clientNameVar === "false" ? company.toLowerCase() === clientName.toLowerCase() : company;
      var filtered = posts.filter(p => filterByConfig);
      var markupArray = filtered.length > 0 ? filtered.map(p => this.postTemplate(p)) : [];
    }

    this.widget.find('.posts').html(markupArray.join(""));

    // Begin Firefox fix for svg icons ----
    var localPath = window.location.href;

    if (window.location.hash){
      localPath = localPath.replace(window.location.hash, '')
    }

    $.each(this.widget.find('use'), function() {
      $(this).attr('xlink:href', localPath + $(this).attr('xlink:href'));
    });
    // ---- End Firefox fix
  }

  postTemplate(post) {
    return `<li class="post">
                    <div class="post-posted post-item">
                      <h4>${post.formattedDate}</h4>
                    </div>
                    <div class="post-info post-item">
                      <h4 class="post-org post-item">
                        <span>${post.company}</span>
                      </h4>
                      <h4 class="post-title post-item"><a href="${post.url}" target="_blank">${post.jobtitle}</a></h4>
                      <h4 class="post-location post-item">
                        <span>
                          <span>${post.city}</span>, <span>${post.state}</span>
                        </span>
                      </h4>
                      <p class="post-description post-item">${post.snippet}</p>
                    </div>
                    <div class="post-actions post-item">
                      <a href="${post.url}" class="post-btn btn" target="_blank">
                      <svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${this.widgetId}-icon" /></svg>
                      View Job Post</a>
                    </div>
                  </li>`;
  }

  setResize() {
    $(window).smartresize(() => this.resize());
    this.resize();
  }

  resize() {
    this.widget.toggleClass('careers-small', this.widget.width() >= this.SMALL);
    this.widget.toggleClass('careers-large', this.widget.width() >= this.LARGE);
    this.widget.toggleClass('careers-xlarge', this.widget.width() >= this.XLARGE);
  }

  showWidget() {
    this.widget.find('.careers-wrapper').fadeIn('slow');
  }

  bindSortingEvent() {
    this.widget.find('[data-sort]').click((e)=>{

      var $column = $(e.currentTarget);

      if (!$column.hasClass('active')) {
        this.widget.find('.careers-pagination').pagination('selectPage', 1);
        this.widget.find('[data-sort]').removeClass('active ascending descending');
        $column.addClass('active');
        this.widget.find('[data-sort] .fa').removeClass('fa-chevron-up fa-chevron-down').addClass('fa-chevron-right');
        this.widget.find('.active .fa').removeClass('fa-chevron-right fa-chevron-up').addClass('fa-chevron-down');
      } else {
        $column.toggleClass('descending');
        if ($column.hasClass('descending')) {
          this.widget.find('.active .fa').removeClass('fa-chevron-right fa-chevron-down').addClass('fa-chevron-up');
        } else {
          this.widget.find('.active .fa').removeClass('fa-chevron-right fa-chevron-up').addClass('fa-chevron-down');
        }
      }

      this.posts = this.sortPosts(this.posts, $column.data('sort'), !$column.hasClass('descending'));
      this.buildMarkup(this.currentPage());
    });

    this.widget.find(`[data-sort=${this.configs.sortBy}]`).addClass('active');
  }

  // Scroll to top of widget
  scrollToWidget() {
    $('html, body').animate({
      scrollTop: this.widget.offset().top - 50
    }, 500);
  }

  // Grabs the value of given url param
  getUrlParameter(name) {
    var url = window.location.href,
        results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);

    return results ? results[1] : undefined;
  }
}


G5.loadWidgetConfigs('.careers .config', CareersWidget)
