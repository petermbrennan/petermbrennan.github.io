"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),EditFeaturedPropertiesWidget=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"photoValues",value:function(){return{url:{name:"gallery_photoX_url",type:"text"},alt_tag:{name:"gallery_photoX_alt_tag",type:"text"},title:{name:"gallery_photoX_link",type:"text"},caption:{name:"gallery_photoX_caption",type:"text"}}}}]),t}(EditGallery),fpw=new EditFeaturedPropertiesWidget,selectors={primary:".form-field_url .form-field-url input:text",maxHeight:'.gallery-image-max-height input[type="number"]',maxWidth:'.gallery-image-max-width input[type="number"]',hasMaxWidthMaxHeight:!0,defaultCroppingType:"fixed"};new G5ImageEditor(selectors,function(){fpw.renderPreview.apply(fpw)});