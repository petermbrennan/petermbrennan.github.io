/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * Because there weren’t enough autocomplete scripts in the world? Because I’m completely insane and have NIH syndrome? Probably both. :P
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 */


(function () {

var _ = function (input, o) {
	var me = this;

	// Setup

	this.input = $(input);
	this.input.setAttribute("autocomplete", "off");
	this.input.setAttribute("aria-autocomplete", "list");

	o = o || {};

	configure.call(this, {
		minChars: 0,
		maxItems: 10,
		autoFirst: false,
		filter: _.FILTER_CONTAINS,
		sort: _.SORT_BYLENGTH,
		item: function (text, input) {
			return $.create("li", {
				innerHTML: text.replace(RegExp($.regExpEscape(input.trim()), "gi"), "<strong>$&</strong>"),
				"aria-selected": "false"
			});
		},
		replace: function (text) {
			this.input.value = text;
		}
	}, o);

	this.index = -1;

	// Create necessary elements

	this.container = $.create("div", {
		className: "awesomplete",
		around: input
	});

	this.ul = $.create("ul", {
		hidden: "",
		inside: this.container
	});

	this.status = $.create("span", {
		className: "visually-hidden",
		role: "status",
		"aria-live": "assertive",
		"aria-relevant": "additions",
		inside: this.container
	});

	// Bind events

	$.bind(this.input, {
		"input": this.evaluate.bind(this),
		"blur": this.close.bind(this),
		"keydown": function(evt) {
			var c = evt.keyCode;

			// If the dropdown `ul` is in view, then act on keydown for the following keys:
			// Enter / Esc / Up / Down
			if(me.opened) {
				if (c === 13 && me.selected) { // Enter
					evt.preventDefault();
					me.select();
				}
				else if (c === 27) { // Esc
					me.close();
				}
				else if (c === 38 || c === 40) { // Down/Up arrow
					evt.preventDefault();
					me[c === 38? "previous" : "next"]();
				}
			}
		}
	});

	$.bind(this.input.form, {"submit": this.close.bind(this)});

	$.bind(this.ul, {"mousedown": function(evt) {
		var li = evt.target;

		if (li !== this) {

			while (li && !/li/i.test(li.nodeName)) {
				li = li.parentNode;
			}

			if (li) {
				me.select(li);
			}
		}
	}});

	if (this.input.hasAttribute("list")) {
		this.list = "#" + input.getAttribute("list");
		input.removeAttribute("list");
	}
	else {
		this.list = this.input.getAttribute("data-list") || o.list || [];
	}

	_.all.push(this);
};

_.prototype = {
	set list(list) {
		if (Array.isArray(list)) {
			this._list = list;
		}
		else if (typeof list === "string" && list.indexOf(",") > -1) {
				this._list = list.split(/\s*,\s*/);
		}
		else { // Element or CSS selector
			list = $(list);

			if (list && list.children) {
				this._list = slice.apply(list.children).map(function (el) {
					return el.textContent.trim();
				});
			}
		}

		if (document.activeElement === this.input) {
			this.evaluate();
		}
	},

	get selected() {
		return this.index > -1;
	},

	get opened() {
		return this.ul && this.ul.getAttribute("hidden") == null;
	},

	close: function () {
		this.ul.setAttribute("hidden", "");
		this.index = -1;

		$.fire(this.input, "awesomplete-close");
	},

	open: function () {
		this.ul.removeAttribute("hidden");

		if (this.autoFirst && this.index === -1) {
			this.goto(0);
		}

		$.fire(this.input, "awesomplete-open");
	},

	next: function () {
		var count = this.ul.children.length;

		this.goto(this.index < count - 1? this.index + 1 : -1);
	},

	previous: function () {
		var count = this.ul.children.length;

		this.goto(this.selected? this.index - 1 : count - 1);
	},

	// Should not be used, highlights specific item without any checks!
	goto: function (i) {
		var lis = this.ul.children;

		if (this.selected) {
			lis[this.index].setAttribute("aria-selected", "false");
		}

		this.index = i;

		if (i > -1 && lis.length > 0) {
			lis[i].setAttribute("aria-selected", "true");
			this.status.textContent = lis[i].textContent;
		}

		$.fire(this.input, "awesomplete-highlight");
	},

	select: function (selected) {
		selected = selected || this.ul.children[this.index];

		if (selected) {
			var prevented;

			$.fire(this.input, "awesomplete-select", {
				text: selected.textContent,
				preventDefault: function () {
					prevented = true;
				}
			});

			if (!prevented) {
				this.replace(selected.textContent);
				this.close();
				$.fire(this.input, "awesomplete-selectcomplete");
			}
		}
	},

	evaluate: function() {
		var me = this;
		var value = this.input.value;

		if (value.length >= this.minChars && this._list.length > 0) {
			this.index = -1;
			// Populate list with options that match
			this.ul.innerHTML = "";

			this._list
				.filter(function(item) {
					return me.filter(item, value);
				})
				.sort(this.sort)
				.every(function(text, i) {
					me.ul.appendChild(me.item(text, value));

					return i < me.maxItems - 1;
				});

			if (this.ul.children.length === 0) {
				this.close();
			} else {
				this.open();
			}
		}
		else {
			this.close();
		}
	}
};

// Static methods/properties

_.all = [];

_.FILTER_CONTAINS = function (text, input) {
	return RegExp($.regExpEscape(input.trim()), "i").test(text);
};

_.FILTER_STARTSWITH = function (text, input) {
	return RegExp("^" + $.regExpEscape(input.trim()), "i").test(text);
};

_.SORT_BYLENGTH = function (a, b) {
	if (a.length !== b.length) {
		return a.length - b.length;
	}

	return a < b? -1 : 1;
};

// Private functions

function configure(properties, o) {
	for (var i in properties) {
		var initial = properties[i],
		    attrValue = this.input.getAttribute("data-" + i.toLowerCase());

		if (typeof initial === "number") {
			this[i] = parseInt(attrValue);
		}
		else if (initial === false) { // Boolean options must be false by default anyway
			this[i] = attrValue !== null;
		}
		else if (initial instanceof Function) {
			this[i] = null;
		}
		else {
			this[i] = attrValue;
		}

		if (!this[i] && this[i] !== 0) {
			this[i] = (i in o)? o[i] : initial;
		}
	}
}

// Helpers

var slice = Array.prototype.slice;

function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

function $$(expr, con) {
	return slice.call((con || document).querySelectorAll(expr));
}

$.create = function(tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$(val).appendChild(element);
		}
		else if (i === "around") {
			var ref = $(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		}
		else if (i in element) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

$.bind = function(element, o) {
	if (element) {
		for (var event in o) {
			var callback = o[event];

			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

$.fire = function(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true );

	for (var j in properties) {
		evt[j] = properties[j];
	}

	target.dispatchEvent(evt);
};

$.regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

// Initialization

function init() {
	$$("input.awesomplete").forEach(function (input) {
		new _(input);
	});
}

// Are we in a browser? Check for Document constructor
if (typeof Document !== 'undefined') {
	// DOM already loaded?
	if (document.readyState !== "loading") {
		init();
	}
	else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", init);
	}
}

_.$ = $;
_.$$ = $$;

// Make sure to export Awesomplete on self when in a browser
if (typeof self !== 'undefined') {
	self.Awesomplete = _;
}

// Expose Awesomplete as a CJS module
if (typeof exports === 'object') {
	module.exports = _;
}

return _;

}());
'use strict';

document.addEventListener('DOMContentLoaded', function() {

  var input = document.getElementById('g5h_client_selector_mini');
  if(input === null){
    return;
  }
  new Awesomplete(input, { list: document.querySelector('#clients') });
  input.addEventListener('awesomplete-selectcomplete', function() {
    switch_client(document.getElementById('g5h_client_selector_mini'));
  }, false);
});

function switch_client(selector) {
  var client_selection_url = selector.getAttribute('data-client-selection-url');
  var selected_text = selector.value;
  var selected_element = document.querySelectorAll('#clients li[name="' + selected_text + '"]')[0];
  var selected_urn = selected_element.getAttribute('value');
  window.location = client_selection_url.replace(':client_urn', selected_urn);
}
;
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  [].forEach.call(document.querySelectorAll('.g5-header-menu-trigger'), function(el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      vanilla.toggle(document.querySelectorAll('.g5-header-menu')[0]);
      var g5_header_menu_trigger = document.querySelectorAll('.g5-header-menu-trigger');
      vanilla.toggle(g5_header_menu_trigger[0]);
      vanilla.toggle(g5_header_menu_trigger[1]);
      vanilla.hide(document.getElementById('notification-bar'));
      vanilla.hide(el);
      return false;
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  [].forEach.call(document.querySelectorAll('.g5-header-users-top-menu'), function(el) {
    el.addEventListener('click', function () {
      var subMenues = document.querySelectorAll('.g5-header-users-top-menu .sub-item');
      if (subMenues){
        for(var i in subMenues) {
          if (subMenues.hasOwnProperty(i)) {
            vanilla.toggle(subMenues[i]);
          }
        }
      }
      return false;
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  [].forEach.call(document.querySelectorAll('.g5-header-users-top-menu-assume-sub-item'), function(el) {
    el.addEventListener('click', function () {
      var assumeDialog = document.getElementById('g5-header-users-modal-dialog');
      vanilla.toggle(assumeDialog);
      return false;
    });
  });
});
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var notification_link = document.getElementById('notification-link');
  if(notification_link === null){
    return;
  }
  notification_link.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    vanilla.toggle(document.getElementById('notification-bar'));
    vanilla.hide(document.querySelectorAll('.g5-header-menu')[0]);
    vanilla.show(document.querySelectorAll('.g5-header-open')[0]);
    vanilla.hide(document.querySelectorAll('.g5-header-closed')[0]);
    return false;
  });
  load_notifications();
});

function empty_row() {
  return '<div class="notification" role="alert">'+
    '<div class="notification-text">'+
    '<strong><span class="notification-badge">!</span></strong>'+
    'You do not have any unread notifications at this time'+
    '</div>'+
    '</div>';
}

function notification_row (notification) {
  var div = document.createElement('div');
  div.id = notification.id;
  div.className = 'notification';
  div.innerHTML = '<div class="notification-text">'+
    '<strong><span class="notification-badge">!</span></strong>'+
    notification.description +
    '</div>'+
    '<a href="' + G5Header.dashboard_notifications_view_url + '?id=' + notification.id + '">'+
    '<i class="icon-play"></i>'+
    '</a>';
  return div;
}

function load_notifications() {
  var selector = document.getElementById('notifications_container');
  if (G5Header.notifications_url) {
    var request = new XMLHttpRequest();
    request.open('GET', G5Header.notifications_url + '.json?page=1&per_page=3&read=0', true);

    request.onload = function() {
      var json = JSON.parse(request.responseText);
      if(json.notifications.length === 0){
        selector.innerHTML = empty_row();
        return;
      }
      json.notifications.forEach(function(notification) {
        selector.appendChild(notification_row(notification));
      });
    };
    request.send();
  }
}
;
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('g5-header-users-search-input');
  var searchButton = document.getElementById('g5-header-users-search-button');

  if (searchInput){
    searchInput.addEventListener('keyup', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setTimeout(function() {
        var searchQuery = document.getElementById('g5-header-users-search-input').value
        searchUsers(searchQuery);
      }, 600);

      return false;
    });
  }
  if (searchButton) {
    searchButton.addEventListener('click', function (event) {
      var searchQuery = document.getElementById('g5-header-users-search-input').value
      event.preventDefault();
      event.stopPropagation();
      searchUsers(searchQuery);
    });
  }
});

function emptyRow() {
  return 'No Users Found';
}

function userTrRow(user) {
  var tr = document.createElement('tr');
  var tdFirstName = document.createElement('td');
  tdFirstName.setAttribute('class', 'g5-header-user-search-row left width-30');

  var tdLastName = document.createElement('td');
  tdLastName.setAttribute('class', 'g5-header-user-search-row left width-30');

  var tdEmail = document.createElement('td');
  tdEmail.setAttribute('class', 'g5-header-user-search-row left width-30');

  var tdLink = document.createElement('td');
  tdLink.setAttribute('class', 'g5-header-user-search-row right width-10');

  tdFirstName.appendChild(document.createTextNode(blankWhenNull(user['first_name'])));
  tdLastName.appendChild(document.createTextNode(blankWhenNull(user['last_name'])));
  tdEmail.appendChild(document.createTextNode(blankWhenNull(user['email'])));

  var anchor = document.createElement('a');
  anchor.setAttribute('href', '/g5_header/users/' + blankWhenNull(user['uid']) + '/impersonate');

  var icon = document.createElement('i');
  icon.setAttribute('class', 'icon-eye-open');
  icon.setAttribute('title', 'Assume User')
  anchor.appendChild(icon);
  tdLink.appendChild(anchor);

  tr.appendChild(tdFirstName);
  tr.appendChild(tdLastName);
  tr.appendChild(tdEmail);
  tr.appendChild(tdLink);
  return tr
}

function searchUsers(newSearchQuery) {
  var searchQuery = document.getElementById('g5-header-users-search-input').value;
  if (searchQuery.length <= 2) { return; }
  if (searchQuery !== newSearchQuery || searchQuery == null  || searchQuery == "") { return; }

  var request = new XMLHttpRequest();
  request.open('GET', '/g5_header/users/search.json?query=' + newSearchQuery, true);
  request.onload = function() {
    var selector = document.getElementById('g5-header-users-search-table');
    var json = JSON.parse(request.responseText);
    if(json.users.length === 0){
      selector.innerHTML = emptyRow();
      return;
    } else {
      removeAllChildren(selector);
      json.users.forEach(function(user) {
        var tr = userTrRow(user);
        selector.appendChild(tr)
      });
    }
  };
  request.send();
}

function removeAllChildren(theParent){
    while(theParent.hasChildNodes()){
      theParent.removeChild(theParent.firstChild);
    }
}

function blankWhenNull(property){
  if((typeof property === 'undefined') || (property === 'null') || (property == null)) {
    return '';
  }
  return property;
}
;
'use strict';

var vanilla = {
  show: function (element) {
    element.style.display = 'block';
  },

  hide: function (element) {
    element.style.display = 'none';
  },

  toggle: function (element) {
    if(element.style.display == 'block'){
      this.hide(element);
    } else {
      this.show(element);
    }
  }
};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.


