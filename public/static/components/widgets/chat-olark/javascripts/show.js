(function(){var t,n;$(document).ready(function(){var e,o;if(e=new t,o=e.configs.length,$.each(e.configs,function(t,e){return new n(e)}),o>1)return console.log("Uh oh, "+o+" olark chat objects exist.")}),t=function(){function t(){var t;t=$(".chat-olark-config"),this.configs=$.map(t,function(t){return JSON.parse($(t).html())})}return t}(),n=function(){function t(t){this.widget=t.widgetId,this.olarkId=t.olarkClientId,this.isMobile=t.olarkMobile,this.appendToBody(),this.initResize()}return t.prototype.olarkChat=function(t){return this.olarkId=t,'<script data-cfasync="false" type=\'text/javascript\'>/*<![CDATA[*/window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){\nf[z]=function(){\n(a.s=a.s||[]).push(arguments)};var a=f[z]._={\n},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){\nf[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={\n0:+new Date};a.P=function(u){\na.p[u]=new Date-a.p[0]};function s(){\na.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){\nhd="head";return["<",hd,"></",hd,"><",i,\' onl\' + \'oad="var d=\',g,";d.getElementsByTagName(\'head\')[0].",j,"(d.",h,"(\'script\')).",k,"=\'",l,"//",a.l,"\'",\'"\',"></",i,">"].join("")}var i="body",m=d[i];if(!m){\nreturn setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){\nb.src="javascript:false"}b.allowTransparency="true";v[j](b);try{\nb.contentWindow[g].open()}catch(w){\nc[e]=d[e];o="javascript:var d="+g+".open();d.domain=\'"+d.domain+"\';";b[k]=o+"void(0);"}try{\nvar t=b.contentWindow[g];t.write(p());t.close()}catch(x){\nb[k]=o+\'d.write("\'+p().replace(/"/g,String.fromCharCode(92)+\'"\')+\'");d.close();\'}a.P(2)};ld()};nt()})({\nloader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});\n/* custom configuration goes here (www.olark.com/documentation) */\nolark.identify(\''+this.olarkId+'\');/*]]>*/</script><noscript><a href="https://www.olark.com/site/" + "'+this.olarkId+'" + "/contact" title="Contact us" target="_blank">Questions? Feedback?</a> powered by <a href="http://www.olark.com?welcome" title="Olark live chat software">Olark live chat software</a></noscript>'},t.prototype.appendToBody=function(){return $("body").append(this.olarkChat(this.olarkId)),this.chatLoaded()},t.prototype.chatLoaded=function(t){return olark("api.chat.onReady",function(t){return function(){return $(window).trigger("chatLoaded",[t.widget])}}(this))},t.prototype.mobileSetting=function(t){if(this.olarkId.length>0&&"no"===this.isMobile)return this.minSmall()===!0?olark("api.box.show"):olark("api.box.hide")},t.prototype.minSmall=function(){if(Modernizr.mq("(min-width: 737px)"))return!0},t.prototype.initResize=function(){return $(window).on("resize orientationchange",function(t){return function(){return t.mobileSetting()}}(this)),this.mobileSetting()},t}()}).call(this);