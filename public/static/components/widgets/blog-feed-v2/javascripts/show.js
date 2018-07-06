"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var s=t[a];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,a,s){return a&&e(t.prototype,a),s&&e(t,s),t}}(),BlogFeedWidgetV2=function(){function e(t){_classCallCheck(this,e),this.configs=t,G5.fortAwesomeApi.registerWidget(this,"fortAwesomeLoaded"),$(".news-feed-single-post").length?this.setUpForSingleView():this.setUpForArticleList()}return _createClass(e,[{key:"setUpForSingleView",value:function(){var e=this;return new PostViewInitializer(this.configs),$(window).on("tagChange",function(t){return new ReturnToParentBlogPage(e.configs)})}},{key:"setUpForArticleList",value:function(){var e=this;return new BlogFeedInitializer(this.configs),window.addEventListener("popstate",function(t){return new BlogFeedInitializer(e.configs)}),$(window).on("tagChange",function(t){return new BlogFeedInitializer(e.configs)})}}]),e}(),PostViewInitializer=function(){function e(t){var a=this;_classCallCheck(this,e),this.configs=t;var s=this.buildFeedURL(),i=new BlogFeedSource(s);$(i).bind("feedReady",function(e){var t=i.feed;return new BlogPostBedazzler(a.configs,t)}),i.getFeed(),new BlogFeedWidthChecker(this.configs)}return _createClass(e,[{key:"buildFeedURL",value:function(){var e=void 0,t=this.configs.newsServiceDomain+"/locations/"+this.configs.locationURN+"/posts/"+this.article()+".json",a=sessionStorage.getItem("currentTag"),s=a?a:"all";return e=t+"?tag="+s}},{key:"article",value:function(){var e=window.location.href.split("/");return e.pop()}}]),e}(),BlogPostBedazzler=function(){function e(t,a){_classCallCheck(this,e),this.configs=t,this.feed=a,this.widget=$("#"+this.configs.widgetId),this.checkSession(),this.setBackLinkHref(),this.setBackLinkText(),this.setTagHrefs(),this.buildBottomLinks()}return _createClass(e,[{key:"setBackLinkHref",value:function(){var e=this.widget.find(".article-top a"),t=sessionStorage.getItem("currentTag"),a=null!=t?t:{tag:"all"},s=sessionStorage.getItem("currentArticlesPage"),i=null!=s?s:{page:"1"},n=this.parentUrl()+"/?tag="+a+"&page="+i;if(e)return e.attr("href",n)}},{key:"setBackLinkText",value:function(){var e=this.widget.find(".article-top a"),t=""===this.configs.returnToListText?"Return To Blog":this.configs.returnToListText;if("Return To Blog"!=t){var a=e.html().replace("Return To Blog",t);e.html(a)}return e.addClass("show")}},{key:"setTagHrefs",value:function(){var e=this.widget.find(".article-tag"),t=this;return e.each(function(e,a){var s=$(this).data("tag");return $(this).attr("href",t.parentUrl()+"/?tag="+s)})}},{key:"buildBottomLinks",value:function(){var e=""===this.configs.seeMoreNewsText?"See More News":this.configs.seeMoreNewsText,t=" "+this.addToAnyCode()+"     <div class='posts-nav'>     "+this.previousButton()+"     <a href='"+this.parentUrl()+"/' class='all-posts'>"+e+"</a>     "+this.nextButton()+"     </div> ";return this.widget.find(".news-feed-single-post").append(t)}},{key:"previousButton",value:function(){var e=this.feed.post.previous;return e?" <a href='"+this.pathForPost(e)+"' data-post-slug='"+e.title_slug+"' class='post-toggle previous-post'> <div class='post-nav-top'> <i class='fa fa-chevron-left'></i> <span>Previous</span> </div> <div> "+this.navImageMarkup(e)+" <div class='post-title'>"+e.title+"</div> <div class='post-date'>"+e.pretty_date+"</div> "+this.authorMarkup(e)+" </div> </a> ":""}},{key:"nextButton",value:function(){var e=this.feed.post.next;return e?" <a href='"+this.pathForPost(e)+"' data-post-slug='"+e.title_slug+"' class='post-toggle next-post'> <div class='post-nav-top'> <span>Next</span> <i class='fa fa-chevron-right'></i> </div> <div> "+this.navImageMarkup(e)+" <div class='post-title'>"+e.title+"</div> <div class='post-date'>"+e.pretty_date+"</div> "+this.authorMarkup(e)+" </div> </a> ":""}},{key:"navImageMarkup",value:function(e){var t="";if("true"===this.configs.displayPhotos){var a=void 0,s=e.image;""===s&&(s=this.configs.defaultImage),""!==s&&(a="<img src='"+s+"' "+CloudinaryHelper.responsiveImage(s)+" />"),a&&(t="<div class='post-image-wrapper'><div>"+a+"</div></div>")}return t}},{key:"authorMarkup",value:function(e){return""!==e.author?"<span class='author-divider'>|</span><span class='post-author'>by "+e.author+"</span>":""}},{key:"addToAnyCode",value:function(){return"true"===this.configs.shareButtons?" <div class='a2a_kit a2a_kit_size_32 a2a_default_style'> <a class='a2a_dd' href='https://www.addtoany.com/share'></a> <a class='a2a_button_facebook'></a> <a class='a2a_button_twitter'></a> <a class='a2a_button_google_plus'></a> </div> <script type='text/javascript' src='//static.addtoany.com/menu/page.js'></script> ":""}},{key:"pathForPost",value:function(e){return this.parentUrl()+"/"+e.title_slug}},{key:"parentUrl",value:function(){var e=window.location.href.split("/");return e.pop(),e.join("/")}},{key:"checkSession",value:function(){if(sessionStorage.getItem("currentTag")||sessionStorage.setItem("currentTag","all"),!sessionStorage.getItem("currentArticlesPage"))return sessionStorage.setItem("currentArticlesPage","1")}}]),e}(),BlogFeedInitializer=function(){function e(t){var a=this;_classCallCheck(this,e),this.configs=t;var s=this.buildFeedURL(),i=new BlogFeedSource(s);$(i).bind("feedReady",function(e){var t=void 0,s=i.feed;return new BlogFeedBuilder(a.configs,s),t=new BlogNav(a.configs,s).paginationListener()}),i.getFeed(),new BlogFeedWidthChecker(this.configs)}return _createClass(e,[{key:"buildFeedURL",value:function(){var e=void 0,t=new QueryParameter("tag").value();t&&(window.currentTag=t);var a=new QueryParameter("page").value(),s=this.configs.newsServiceDomain+"/locations/"+this.configs.locationURN+"/blog_feed.json",i=parseInt(this.configs.numberOfPosts);isNaN(i)&&(i=20);var n=t?t:"all",r=a?a:"1";return sessionStorage.setItem("currentTag",n),sessionStorage.setItem("currentArticlesPage",r),e=s+"?tag="+n+"&page="+r+"&per_page="+i}}]),e}(),BlogFeedBuilder=function(){function e(t,a){_classCallCheck(this,e),this.configs=t,this.widget=$("#"+this.configs.widgetId),this.feed=a.posts,(new SharedBlogHelpers).clearAllPosts(),this.populateFeed(),this.buildPaginationLinks(a.meta)}return _createClass(e,[{key:"populateFeed",value:function(){for(var e=[],t=0;t<this.feed.length;t++){var a=this.feed[t];e.push("<div class='news-feed-post'> "+this.toggleMarkup(a,t)+" "+this.detailsMarkup(a)+" "+this.bottomToggles(a,t)+" </div>")}return this.widget.append(e.join(""))}},{key:"pathForPost",value:function(e){return(new SharedBlogHelpers).pathForPost(e)}},{key:"toggleMarkup",value:function(e,t){var a="<a class='post-toggle' href='"+this.pathForPost(e)+"'>",s=a;return"true"===this.configs.displayPhotos&&(s+=""!==e.image?"  <img src='"+e.image+"' "+CloudinaryHelper.responsiveImage(e.image)+" />":"  <img src='"+this.configs.defaultImage+"' "+CloudinaryHelper.responsiveImage(this.configs.defaultImage)+" />"),s+="</a>",s+=a,""!==e.title&&(s+="  <h1 class='post-title'>"+e.title+"</h1>"),s+="</a>"}},{key:"detailsMarkup",value:function(e){var t=void 0;return""!==e.title&&(t="<span class='post-date'>"+e.pretty_date+"</span>"),""!==e.author&&(t+="<span>|</span><span class='post-author'>by "+e.author+"</span>"),t+="<div class='post-description'>"+e.description+"</div>"}},{key:"bottomToggles",value:function(e,t){return"<a class='post-toggle toggle-button' href='"+this.pathForPost(e)+"'>Read More</a>"}},{key:"validPagesForPagination",value:function(e){return[1,e.total_pages,e.page,e.page-2,e.page-1,e.page+1,e.page+2]}},{key:"buildPageLinkOrElipsis",value:function(e,t){for(var a=1,s=e.total_pages,i=1<=s;i?a<=s:a>=s;i?a++:a--){var n=a===e.page?"active-page":"",r=a===e.total_pages?"last":"";this.validPagesForPagination(e).includes(a)?t.push("<a href='#' class='pagination-button page-button "+n+" "+r+"' data-page-number='"+a+"' data-tag='"+e.tag+"'>"+a+"</a>"):" ... "!==t[t.length-1]&&t.push(" ... ")}return t}},{key:"buildNextOrPreviousLinks",value:function(e,t){var a=void 0;return a="next"===t?["next",e.page+1,"fa-chevron-right","Next Page"]:["prev",e.page-1,"fa-chevron-left","Previous Page"],"<a href='#' class='page-button pagination-button pagination-text "+a[0]+"' data-page-number='"+a[1]+"' data-tag='"+e.tag+"'><i class='fa "+a[2]+"'></i> <span class='previous-next'>"+a[3]+"</span></a>"}},{key:"buildPaginationLinks",value:function(e){var t=[];if(e.total_pages>1){1!==e.page&&t.push(this.buildNextOrPreviousLinks(e,"prev")),t=this.buildPageLinkOrElipsis(e,t),e.page!==e.total_pages&&t.push(this.buildNextOrPreviousLinks(e,"next"));var a="<div class='blog-pagination'> "+t.join("")+" </div>";return $(".blog-feed-v2").append(a),$(a).insertAfter("#news-feed-top")}}}]),e}(),BlogNav=function(){function e(t,a){_classCallCheck(this,e),this.configs=t,this.feed=a,this.widget=$("#"+this.configs.widgetId),this.paginationListener}return _createClass(e,[{key:"paginationListener",value:function(){var e=this;return this.widget.find(".pagination-button").click(function(t){var a=$(t.currentTarget),s=a.data("page-number"),i=a.data("tag");return e.updateUrl([["tag",i],["page",s]]),e.scrollAction(),new BlogFeedInitializer(e.configs),window.noEvent(t)})}},{key:"updateUrl",value:function(e){for(var t=window.location.pathname,a=[],s=0;s<e.length;s++){var i=e[s];i[0]&&i[1]&&a.push(i[0]+"="+i[1])}var n=a.length?"?"+a.join("&"):"";return window.history.pushState({},"",""+t+n)}},{key:"scrollAction",value:function(){var e=$(this.widget).offset().top;return window.scrollTo(0,e)}}]),e}(),SharedBlogHelpers=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"pathForPost",value:function(e){var t=window.location.pathname;return"/"!==t.substr(t.length-1)&&(t+="/"),t+=e.title_slug}},{key:"clearAllPosts",value:function(){return $(".blog-loading, .news-feed-post, .blog-pagination").remove()}}]),e}(),QueryParameter=function(){function e(t){_classCallCheck(this,e),this.param=t}return _createClass(e,[{key:"value",value:function(){var e=this.param.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]"),t=new RegExp("[\\?&]"+e+"=([^&#]*)"),a=t.exec(location.search);return null!==a&&decodeURIComponent(a[1].replace(/\+/g," "))}}]),e}(),ReturnToParentBlogPage=function(){function e(t){_classCallCheck(this,e),this.configs=t,this.setTagInSession(),this.backToParent()}return _createClass(e,[{key:"setTagInSession",value:function(){return this.newTag=new QueryParameter("tag").value(),sessionStorage.setItem("currentTag",this.newTag),sessionStorage.setItem("currentArticlesPage","1")}},{key:"backToParent",value:function(){var e=window.location.href.split("/");return e.pop(),window.location=e.join("/")+"?tag="+this.newTag+"&page=1"}}]),e}(),BlogFeedWidthChecker=function(){function e(t){var a=this;_classCallCheck(this,e),this.configs=t,this.widget=$("#"+this.configs.widgetId),this.applyWidthClasses(),$(window).resize(function(){return a.applyWidthClasses()})}return _createClass(e,[{key:"applyWidthClasses",value:function(){return this.widget.width()<=460?this.widget.removeClass("wide").addClass("narrow"):this.widget.removeClass("narrow").addClass("wide")}}]),e}(),BlogFeedSource=function(){function e(t){_classCallCheck(this,e),this.url=t}return _createClass(e,[{key:"getFeed",value:function(){return this.feedFromStorage()?$(this).trigger("feedReady"):this.fetch()}},{key:"fetch",value:function(){var e=this;return $.ajax({url:this.url,dataType:"json",success:function(t,a,s){return e.feed=t,e.storeFeed(),$(e).trigger("feedReady")},error:function(e,t,a){}})}},{key:"feedFromStorage",value:function(){try{return this.feed=JSON.parse(sessionStorage.getItem(this.url))}catch(e){return null}}},{key:"storeFeed",value:function(){try{return sessionStorage.setItem(this.url,JSON.stringify(this.feed))}catch(e){return null}}}]),e}();G5.loadWidgetConfigs(".blog-feed-v2 .config",BlogFeedWidgetV2);