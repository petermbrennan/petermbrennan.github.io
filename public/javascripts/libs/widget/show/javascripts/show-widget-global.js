if (typeof(window.G5) === 'undefined'){
  window.G5 = {};
}

G5.isPreview = $('body').hasClass('preview');

G5.loadWidgetConfigs = function(configTag, widgetClass) {
  let loader = new WidgetLoader(configTag, widgetClass);
  return loader.load();
};

class WidgetLoader {
  constructor(configTag, widgetClass){
    this.configTag = configTag;
    this.widgetClass = widgetClass;
  }

  load(){
    let configElems = $(this.configTag);
    if (configElems.length){
      return $.map(configElems, (config)=>{
        let configJson = JSON.parse($(config).html());
        return new this.widgetClass(configJson);
      });
    }
    return [];
  }
};

class ApiManager {
  constructor(){
    this.initialize();
  }

  initialize(){
    this.injected = false;
    this.loaded = false;
    this.widgets = [];
  }

  load(){
    this.loadScript();
    this.injected = true;
  }

  loadScript(){
    this.addScript(this.apiScript(), this.apiName());
  }

  addScript(scriptSrc, scriptName){
    if (!this.injected && !this.hasScript(scriptSrc, scriptName)){
      let script = $("<script type='text/javascript' src='"+scriptSrc+"' class='js-"+scriptName+"'></script>");
      if (this.prependScript()){
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script[0], firstScriptTag);
      } else {
        $('body').append(script);
      }
    }
  }

  hasScript(scriptSrc, scriptName){
    return scriptSrc.length &&
      ($("script.js-"+scriptName).length ||
       $("script[src='"+scriptSrc+"']").length)
  }

  registerWidget(widget, callback){
    if (this.widgets === undefined){
      this.initialize();
    }
    if (!this.loaded){
      this.widgets.push({
        widget: widget,
        callback: callback
      });
      this.load();
      return true;
    } else {
      return widget[callback]();
    }
  }

  doneLoading(){
    this.loaded = true;
    $.each(this.widgets, function(idx, hash){
      let widget = hash['widget'];
      let callback = hash['callback'];
      return widget[callback]();
    });
  }

  apiName(){
    return ''; // override this in subclasses
  }

  apiScript(){
    return ''; // override this in subclasses
  }

  prependScript(){
    return false;
  }
};

if (typeof(window.noEvent) === 'undefined'){
  window.noEvent = function(e){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}

/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.1 - 2013-10-17
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2013 Jason Moon (@JSONMOON)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function($){if(!$.support.cors&&$.ajaxTransport&&window.XDomainRequest){var n=/^https?:\/\//i;var o=/^get|post$/i;var p=new RegExp('^'+location.protocol,'i');var q=/text\/html/i;var r=/\/json/i;var s=/\/xml/i;$.ajaxTransport('* text html xml json',function(i,j,k){if(i.crossDomain&&i.async&&o.test(i.type)&&n.test(i.url)&&p.test(i.url)){var l=null;var m=(j.dataType||'').toLowerCase();return{send:function(f,g){l=new XDomainRequest();if(/^\d+$/.test(j.timeout)){l.timeout=j.timeout}l.ontimeout=function(){g(500,'timeout')};l.onload=function(){var a='Content-Length: '+l.responseText.length+'\r\nContent-Type: '+l.contentType;var b={code:200,message:'success'};var c={text:l.responseText};try{if(m==='html'||q.test(l.contentType)){c.html=l.responseText}else if(m==='json'||(m!=='text'&&r.test(l.contentType))){try{c.json=$.parseJSON(l.responseText)}catch(e){b.code=500;b.message='parseerror'}}else if(m==='xml'||(m!=='text'&&s.test(l.contentType))){var d=new ActiveXObject('Microsoft.XMLDOM');d.async=false;try{d.loadXML(l.responseText)}catch(e){d=undefined}if(!d||!d.documentElement||d.getElementsByTagName('parsererror').length){b.code=500;b.message='parseerror';throw'Invalid XML: '+l.responseText;}c.xml=d}}catch(parseMessage){throw parseMessage;}finally{g(b.code,b.message,c,a)}};l.onprogress=function(){};l.onerror=function(){g(500,'error',{text:l.responseText})};var h='';if(j.data){h=($.type(j.data)==='string')?j.data:$.param(j.data)}l.open(i.type,i.url);l.send(h)},abort:function(){if(l){l.abort()}}}}})}})(jQuery);

// Sets resize handler that does not trigger a billion times
// http://bit.ly/1dNb8HD

(function($, sr) {
  var debounce = function(func, threshold, execAsap) {
    var timeout;
    return function() {
      var obj = this;
      if (timeout) {
        clearTimeout(timeout);
      } else {
        if (execAsap) {
          func.apply(obj);
        }
      }
      timeout = setTimeout(function() {
        if (!execAsap) {
          func.apply(obj);
        }
        timeout = null;
      }, threshold || 100);
    };
  };
  jQuery.fn[sr] = function(fn) {
    if (fn) {
      return this.bind("resize", debounce(fn));
    } else {
      return this.trigger(sr);
    }
  };
})(jQuery, "smartresize");

// Add native assign function to Object for old browsers

if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

String.prototype.reverse = function () { // reverse a string
    return this.split('').reverse().join('');
};

String.prototype.replaceLast = function (what, replacement) { // replace the last occurance of something in a string with something else
    return this.reverse().replace(new RegExp(what.reverse()), replacement.reverse()).reverse();
};


/*
   Global helper to integrate cloudinary with widgets that build their HTML dynamically
   srcsetBuilder:
      `<img src="url" ${CloudinaryHelper.responsiveImage(url)}>`
*/

class CloudinaryHelper {
  static responsiveImage(imageUrl, minWidth=350, steps=5) {
    var { width, height } = this.originalDimensions(imageUrl);

    if ( !(width || height) || (width < 500 || height < 200) ) return '';

    let breakPoints = this.calculateBreakPoints(width, minWidth, steps);

    let srcset = this.srcset(imageUrl, {width, height}, breakPoints);

    let sizes = this.sizes(breakPoints);

    return `srcset='${srcset}' sizes='${sizes}'`;
  }

  static srcset(imageUrl, { width:OrigWidth, height:OrigHeight }, breakPoints) {

    var sources = [];

    var originalWidthParam = `w_${OrigWidth}`, originalHeightParam = `h_${OrigHeight}`;

    breakPoints.forEach((bp) => {
      var width = bp;

      var height = Math.ceil((bp / OrigWidth) * OrigHeight);

      var breakingImageURL = imageUrl.replaceLast(originalWidthParam, `w_${width}`).replaceLast(originalHeightParam, `h_${height}`);

      sources.push(`${breakingImageURL} ${bp}w`);
    });

    return sources.join(", ");
  }

  static sizes(breakPoints) {
    return breakPoints.map(bp => `(min-width: ${bp}px) ${bp}px`).join(", ");
  }

  static calculateBreakPoints(maxWidth, minWidth, steps) {

    // breaking points should be incremented between the maximum(original height) and minimum
    var breakPointRange = maxWidth - minWidth,
        stepSize = breakPointRange / (steps - 1),
        breakPoints = [];

    for (var s = 0; s < steps; s++) {
      breakPoints.push(Math.ceil(maxWidth - (stepSize * s)));
    }

    return breakPoints;
  }

  static originalDimensions(imageUrl) {
    var cloudinaryWidthParam  = imageUrl.match(/w_\d{3,4}/),
        cloudinaryHeightParam = imageUrl.match(/h_\d{3,4}/);


    return { // if the url has a custom width / height return that, else return 0;
      width: cloudinaryWidthParam ? parseInt(cloudinaryWidthParam[0].match(/\d{3,4}/)[0]) : 0,
      height: cloudinaryHeightParam ? parseInt(cloudinaryHeightParam[0].match(/\d{3,4}/)[0]) : 0
    };
  }
}


(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);
