var swfobject=function(){function e(){if(!M){try{var e=k.getElementsByTagName("body")[0].appendChild(k.createElement("span"));e.parentNode.removeChild(e)}catch(t){return}M=!0;for(var e=O.length,n=0;e>n;n++)O[n]()}}function t(e){M?e():O[O.length]=e}function n(e){if(typeof L.addEventListener!=A)L.addEventListener("load",e,!1);else if(typeof k.addEventListener!=A)k.addEventListener("load",e,!1);else if(typeof L.attachEvent!=A)p(L,"onload",e);else if("function"==typeof L.onload){var t=L.onload;L.onload=function(){t(),e()}}else L.onload=e}function a(){var e=k.getElementsByTagName("body")[0],t=k.createElement(N);t.setAttribute("type",T);var n=e.appendChild(t);if(n){var a=0;!function(){if(typeof n.GetVariable!=A){var r=n.GetVariable("$version");r&&(r=r.split(" ")[1].split(","),R.pv=[parseInt(r[0],10),parseInt(r[1],10),parseInt(r[2],10)])}else if(10>a)return a++,void setTimeout(arguments.callee,10);e.removeChild(t),n=null,i()}()}else i()}function i(){var e=F.length;if(e>0)for(var t=0;e>t;t++){var n=F[t].id,a=F[t].callbackFn,i={success:!1,id:n};if(0<R.pv[0]){var c=u(n);if(c)if(!v(F[t].swfVersion)||R.wk&&312>R.wk)if(F[t].expressInstall&&o()){i={},i.data=F[t].expressInstall,i.width=c.getAttribute("width")||"0",i.height=c.getAttribute("height")||"0",c.getAttribute("class")&&(i.styleclass=c.getAttribute("class")),c.getAttribute("align")&&(i.align=c.getAttribute("align"));for(var d={},c=c.getElementsByTagName("param"),f=c.length,p=0;f>p;p++)"movie"!=c[p].getAttribute("name").toLowerCase()&&(d[c[p].getAttribute("name")]=c[p].getAttribute("value"));s(i,d,n,a)}else l(c),a&&a(i);else h(n,!0),a&&(i.success=!0,i.ref=r(n),a(i))}else h(n,!0),a&&((n=r(n))&&typeof n.SetVariable!=A&&(i.success=!0,i.ref=n),a(i))}}function r(e){var t=null;return(e=u(e))&&"OBJECT"==e.nodeName&&(typeof e.SetVariable!=A?t=e:(e=e.getElementsByTagName(N)[0])&&(t=e)),t}function o(){return!V&&v("6.0.65")&&(R.win||R.mac)&&!(R.wk&&312>R.wk)}function s(e,t,n,a){V=!0,b=a||null,E={success:!1,id:n};var i=u(n);i&&("OBJECT"==i.nodeName?(g=c(i),w=null):(g=i,w=n),e.id=I,(typeof e.width==A||!/%$/.test(e.width)&&310>parseInt(e.width,10))&&(e.width="310"),(typeof e.height==A||!/%$/.test(e.height)&&137>parseInt(e.height,10))&&(e.height="137"),k.title=k.title.slice(0,47)+" - Flash Player Installation",a=R.ie&&R.win?"ActiveX":"PlugIn",a="MMredirectURL="+L.location.toString().replace(/&/g,"%26")+"&MMplayerType="+a+"&MMdoctitle="+k.title,t.flashvars=typeof t.flashvars!=A?t.flashvars+("&"+a):a,R.ie&&R.win&&4!=i.readyState&&(a=k.createElement("div"),n+="SWFObjectNew",a.setAttribute("id",n),i.parentNode.insertBefore(a,i),i.style.display="none",function(){4==i.readyState?i.parentNode.removeChild(i):setTimeout(arguments.callee,10)}()),d(e,t,n))}function l(e){if(R.ie&&R.win&&4!=e.readyState){var t=k.createElement("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(c(e),t),e.style.display="none",function(){4==e.readyState?e.parentNode.removeChild(e):setTimeout(arguments.callee,10)}()}else e.parentNode.replaceChild(c(e),e)}function c(e){var t=k.createElement("div");if(R.win&&R.ie)t.innerHTML=e.innerHTML;else if((e=e.getElementsByTagName(N)[0])&&(e=e.childNodes))for(var n=e.length,a=0;n>a;a++)!(1==e[a].nodeType&&"PARAM"==e[a].nodeName)&&8!=e[a].nodeType&&t.appendChild(e[a].cloneNode(!0));return t}function d(e,t,n){var a,i=u(n);if(R.wk&&312>R.wk)return a;if(i)if(typeof e.id==A&&(e.id=n),R.ie&&R.win){var r,o="";for(r in e)e[r]!=Object.prototype[r]&&("data"==r.toLowerCase()?t.movie=e[r]:"styleclass"==r.toLowerCase()?o+=' class="'+e[r]+'"':"classid"!=r.toLowerCase()&&(o+=" "+r+'="'+e[r]+'"'));r="";for(var s in t)t[s]!=Object.prototype[s]&&(r+='<param name="'+s+'" value="'+t[s]+'" />');i.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+o+">"+r+"</object>",$[$.length]=e.id,a=u(e.id)}else{s=k.createElement(N),s.setAttribute("type",T);for(var l in e)e[l]!=Object.prototype[l]&&("styleclass"==l.toLowerCase()?s.setAttribute("class",e[l]):"classid"!=l.toLowerCase()&&s.setAttribute(l,e[l]));for(o in t)t[o]!=Object.prototype[o]&&"movie"!=o.toLowerCase()&&(e=s,r=o,l=t[o],n=k.createElement("param"),n.setAttribute("name",r),n.setAttribute("value",l),e.appendChild(n));i.parentNode.replaceChild(s,i),a=s}return a}function f(e){var t=u(e);t&&"OBJECT"==t.nodeName&&(R.ie&&R.win?(t.style.display="none",function(){if(4==t.readyState){var n=u(e);if(n){for(var a in n)"function"==typeof n[a]&&(n[a]=null);n.parentNode.removeChild(n)}}else setTimeout(arguments.callee,10)}()):t.parentNode.removeChild(t))}function u(e){var t=null;try{t=k.getElementById(e)}catch(n){}return t}function p(e,t,n){e.attachEvent(t,n),x[x.length]=[e,t,n]}function v(e){var t=R.pv,e=e.split(".");return e[0]=parseInt(e[0],10),e[1]=parseInt(e[1],10)||0,e[2]=parseInt(e[2],10)||0,t[0]>e[0]||t[0]==e[0]&&t[1]>e[1]||t[0]==e[0]&&t[1]==e[1]&&t[2]>=e[2]?!0:!1}function y(e,t,n,a){if(!R.ie||!R.mac){var i=k.getElementsByTagName("head")[0];i&&(n=n&&"string"==typeof n?n:"screen",a&&(S=C=null),C&&S==n||(a=k.createElement("style"),a.setAttribute("type","text/css"),a.setAttribute("media",n),C=i.appendChild(a),R.ie&&R.win&&typeof k.styleSheets!=A&&0<k.styleSheets.length&&(C=k.styleSheets[k.styleSheets.length-1]),S=n),R.ie&&R.win?C&&typeof C.addRule==N&&C.addRule(e,t):C&&typeof k.createTextNode!=A&&C.appendChild(k.createTextNode(e+" {"+t+"}")))}}function h(e,t){if(P){var n=t?"visible":"hidden";M&&u(e)?u(e).style.visibility=n:y("#"+e,"visibility:"+n)}}function m(e){return null!=/[\\\"<>\.;]/.exec(e)&&typeof encodeURIComponent!=A?encodeURIComponent(e):e}var g,w,b,E,C,S,A="undefined",N="object",T="application/x-shockwave-flash",I="SWFObjectExprInst",L=window,k=document,j=navigator,B=!1,O=[function(){B?a():i()}],F=[],$=[],x=[],M=!1,V=!1,P=!0,R=function(){var e=typeof k.getElementById!=A&&typeof k.getElementsByTagName!=A&&typeof k.createElement!=A,t=j.userAgent.toLowerCase(),n=j.platform.toLowerCase(),a=n?/win/.test(n):/win/.test(t),n=n?/mac/.test(n):/mac/.test(t),t=/webkit/.test(t)?parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,i=!1,r=[0,0,0],o=null;if(typeof j.plugins!=A&&typeof j.plugins["Shockwave Flash"]==N)!(o=j.plugins["Shockwave Flash"].description)||typeof j.mimeTypes!=A&&j.mimeTypes[T]&&!j.mimeTypes[T].enabledPlugin||(B=!0,i=!1,o=o.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),r[0]=parseInt(o.replace(/^(.*)\..*$/,"$1"),10),r[1]=parseInt(o.replace(/^.*\.(.*)\s.*$/,"$1"),10),r[2]=/[a-zA-Z]/.test(o)?parseInt(o.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof L.ActiveXObject!=A)try{var s=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");s&&(o=s.GetVariable("$version"))&&(i=!0,o=o.split(" ")[1].split(","),r=[parseInt(o[0],10),parseInt(o[1],10),parseInt(o[2],10)])}catch(l){}return{w3:e,pv:r,wk:t,ie:i,win:a,mac:n}}();return function(){R.w3&&((typeof k.readyState!=A&&"complete"==k.readyState||typeof k.readyState==A&&(k.getElementsByTagName("body")[0]||k.body))&&e(),M||(typeof k.addEventListener!=A&&k.addEventListener("DOMContentLoaded",e,!1),R.ie&&R.win&&(k.attachEvent("onreadystatechange",function(){"complete"==k.readyState&&(k.detachEvent("onreadystatechange",arguments.callee),e())}),L==top&&function(){if(!M){try{k.documentElement.doScroll("left")}catch(t){return void setTimeout(arguments.callee,0)}e()}}()),R.wk&&function(){M||(/loaded|complete/.test(k.readyState)?e():setTimeout(arguments.callee,0))}(),n(e)))}(),function(){R.ie&&R.win&&window.attachEvent("onunload",function(){for(var e=x.length,t=0;e>t;t++)x[t][0].detachEvent(x[t][1],x[t][2]);for(e=$.length,t=0;e>t;t++)f($[t]);for(var n in R)R[n]=null;R=null;for(var a in swfobject)swfobject[a]=null;swfobject=null})}(),{registerObject:function(e,t,n,a){if(R.w3&&e&&t){var i={};i.id=e,i.swfVersion=t,i.expressInstall=n,i.callbackFn=a,F[F.length]=i,h(e,!1)}else a&&a({success:!1,id:e})},getObjectById:function(e){return R.w3?r(e):void 0},embedSWF:function(e,n,a,i,r,l,c,f,u,p){var y={success:!1,id:n};R.w3&&!(R.wk&&312>R.wk)&&e&&n&&a&&i&&r?(h(n,!1),t(function(){a+="",i+="";var t={};if(u&&typeof u===N)for(var m in u)t[m]=u[m];if(t.data=e,t.width=a,t.height=i,m={},f&&typeof f===N)for(var g in f)m[g]=f[g];if(c&&typeof c===N)for(var w in c)m.flashvars=typeof m.flashvars!=A?m.flashvars+("&"+w+"="+c[w]):w+"="+c[w];if(v(r))g=d(t,m,n),t.id==n&&h(n,!0),y.success=!0,y.ref=g;else{if(l&&o())return t.data=l,void s(t,m,n,p);h(n,!0)}p&&p(y)})):p&&p(y)},switchOffAutoHideShow:function(){P=!1},ua:R,getFlashPlayerVersion:function(){return{major:R.pv[0],minor:R.pv[1],release:R.pv[2]}},hasFlashPlayerVersion:v,createSWF:function(e,t,n){return R.w3?d(e,t,n):void 0},showExpressInstall:function(e,t,n,a){R.w3&&o()&&s(e,t,n,a)},removeSWF:function(e){R.w3&&f(e)},createCSS:function(e,t,n,a){R.w3&&y(e,t,n,a)},addDomLoadEvent:t,addLoadEvent:n,getQueryParamValue:function(e){var t=k.location.search||k.location.hash;if(t){if(/\?/.test(t)&&(t=t.split("?")[1]),null==e)return m(t);for(var t=t.split("&"),n=0;n<t.length;n++)if(t[n].substring(0,t[n].indexOf("="))==e)return m(t[n].substring(t[n].indexOf("=")+1))}return""},expressInstallCallback:function(){if(V){var e=u(I);e&&g&&(e.parentNode.replaceChild(g,e),w&&(h(w,!0),R.ie&&R.win&&(g.style.display="block")),b&&b(E)),V=!1}}}}();