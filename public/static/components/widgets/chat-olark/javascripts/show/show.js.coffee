$(document).ready ->
  chatConfigs = new ChatOlarkConfigs
  chatObj = chatConfigs.configs.length

  $.each chatConfigs.configs, (idx, config)->
    new ChatOlarkWidget(config)

  if chatObj > 1
    console.log( 'Uh oh, ' + chatObj + ' olark chat objects exist.' )

class ChatOlarkConfigs
  constructor: () ->
    olarkConfigs = $('.chat-olark-config')
    @configs = $.map olarkConfigs, (config)->
      JSON.parse($(config).html())

class ChatOlarkWidget
  constructor: (config) ->
    @widget = config.widgetId
    @olarkId = config.olarkClientId
    @isMobile = config.olarkMobile

    @appendToBody()
    @initResize()

  olarkChat: (@olarkId) ->
    """
    <script data-cfasync="false" type='text/javascript'>/*<![CDATA[*/window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){
    f[z]=function(){
    (a.s=a.s||[]).push(arguments)};var a=f[z]._={
    },q=c.methods.length;while(q--){(function(n){f[z][n]=function(){
    f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={
    0:+new Date};a.P=function(u){
    a.p[u]=new Date-a.p[0]};function s(){
    a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){
    hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){
    return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){
    b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{
    b.contentWindow[g].open()}catch(w){
    c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{
    var t=b.contentWindow[g];t.write(p());t.close()}catch(x){
    b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({
    loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
    /* custom configuration goes here (www.olark.com/documentation) */
    olark.identify('#{@olarkId}');/*]]>*/</script><noscript><a href="https://www.olark.com/site/" + "#{@olarkId}" + "/contact" title="Contact us" target="_blank">Questions? Feedback?</a> powered by <a href="http://www.olark.com?welcome" title="Olark live chat software">Olark live chat software</a></noscript>
    """

  appendToBody:() ->
    $('body').append(@olarkChat(@olarkId))
    @chatLoaded()

  chatLoaded:(config) ->
    olark 'api.chat.onReady', =>
      $(window).trigger('chatLoaded', [@widget])

  mobileSetting:(config) ->
    if @olarkId.length > 0 && @isMobile == 'no'
      if @minSmall() == true then olark('api.box.show') else olark('api.box.hide')

  minSmall:() ->
    if (Modernizr.mq("(min-width: 737px)"))
      return true

  initResize: ->
    $(window).on 'resize orientationchange', =>
      @mobileSetting()
    @mobileSetting()