class SocialFeedWidget {
  constructor(configs){
    this.configs = configs;
    this.widget = $('#'+this.configs.widgetId);
    this.setupStringPolyfill();
    this.setupSocialFeeds();
  }

  setupStringPolyfill(){
    //polyfill for includes(es2015)
    if (!String.prototype.includes) {
      String.prototype.includes = function() {'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
      };
    }
  }

  feedsList(){
    let list = [];
    list[this.configs.facebook_position-1] = FacebookFeed;
    list[this.configs.twitter_position-1] = TwitterFeed;
    list[this.configs.blog_position-1] = BlogFeed;
    list[this.configs.google_position-1] = GoogleFeed;
    list[this.configs.instagram_position-1] = InstagramFeed;
    return list;
  }

  setupSocialFeeds(){
    this.feeds = [];
    this.feedsList().forEach((feed)=>{
      let f = new feed(this.configs, this.widget);
      f.fetch();
      this.feeds.push(f);
    });
  }
}

// GENERAL UTILITIES
// *******************

class Feed {
  constructor(configs, widget, type) {
    this.configs = configs;
    this.widget = widget;
    this.type = type;
    this.tab = null;
  }

  fetch(){
    if (this.showFeed()){
      this.loadFeed();
      this.updateFeed();
    }
  }

  loadFeed(){
    return $.ajax({
      url: this.url(),
      dataType: 'json',
      success: (data) => {
        this.success(data);
      },
      error: (xhr) => {
        this.error(xhr.responseText);
      }
    });
  }

  updateFeed(data=null){
    this.buildTab();
    this.buildContent(data);
    this.buildListener();
  }

  showFeed(){
    return this.showFeedToggle() && this.validFeedId();
  }

  success(data){
    if (data.length > 0) {
      this.updateFeed(data);
    }
  }

  error(msg){
    if (msg.length) {
      this.updateFeed(msg);
    }
  }

  validFeedId(){
    return this.feedId().length > 1;
  }

  showFeedToggle(){
    return this.configs[`${this.type}_toggle`] === true;
  }

  buildTab(){
    if (this.tab) { return; }
    let href = `#${this.type}-feed`;
    let title = this.type.charAt(0).toUpperCase() + this.type.slice(1);
    let pos = 'data-position="'+this.configs[`${this.type}_position`]+'"';
    let tab = $(`<a class='feed-switch feed-switch-${this.type}' href='${href}' title='Show ${title} Feed' ${pos}>${this.icon()}</a>`);
    this.appendTab(tab);
  }

  appendTab(tab){
    let tabIdx = tab.data('position');
    let feedSwitcher = this.widget.find('.feed-switcher');
    let appendAfter = null;
    feedSwitcher.find('.feed-switch').each((idx, e)=>{
      let t = $(e);
      if (t.data('position') < tabIdx){
        appendAfter = t;
      }
    });
    appendAfter ? appendAfter.after(tab) : feedSwitcher.prepend(tab);
    this.tab = tab;
  }

  buildContent(data=null){
    let content = this.loadingIcon();
    let link = "";
    if (data){
      content = (typeof(data) === "String") ?  data : this.feedList(data);
      link = this.feedLink();
    }
    if (this.block) {
      this.block.find('.feed').html(content);
      this.block.find('.feed-link').html(link)
    } else {
      this.block = $(`<div class='${this.type}-social-feed feed-section' style='display: none;'>
                       <ul class='h-feed feed'>${content}</ul>
                       <span class='feed-link'>${link}</span>
                     </div>`);
      this.widget.append(this.block);
    }
  }

  buildItem(){
    return "";
  }

  buildListener(){
    if (this.listener) { return; }

    this.listener = this.tab.on('click', (e)=>{
      this.widget.find('.feed-switch').removeClass('active');
      $(e.currentTarget).addClass('active');
      this.widget.find('.feed-section').css('display', 'none');
      this.block.css('display', 'block');
      return false;
    });

    if (this.widget.find('.feed-switcher a').length === 1) {
      this.tab.addClass('active');
      this.block.css('display', 'block');
    }
  }

  loadingIcon(){
    return `<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>`;
  }

  // ABSTRACT FUNCTIONS
  // *******************

  feedLink(){
    return "";
  }

  feedList(data){
    return "";
  }

  url(){
    return "";
  }

  feedId(){
    return "";
  }

  icon(){
    return "";
  }

}

// BLOG FEED UTILITIES
// *******************

class BlogFeed extends Feed {
  constructor(configs, widget) {
    super(configs, widget, 'blog');
    this.atom = this.configs.feed_url.includes('atom');
  }

  url(){
    let q = encodeURIComponent(`select * from xml where url = '${this.configs.feed_url}'`);
    return `//query.yahooapis.com/v1/public/yql?format=json&q=${q}`;
  }

  success(data){
    if (data){
      let atomUrl = this.configs.feed_url.includes('atom');
      if (atomUrl) { // Atom blog
        this.blogRootUrl = data.query.results.feed.link[0].href;
      } else { // RSS blog
        this.blogRootUrl = data.query.results.rss.channel.link;
      };
      super.success(this.contentFinder(data));
    }
  }

  icon(){
    return `<svg version='1.1' id='Layer_2' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='30px' height='30px' viewBox='0 0 200 200' enable-background='new 0 0 200 200' xml:space='preserve'>
       <path stroke-width='40' d='M0,22'/>
       <path stroke-width='40' d='M111,196.48C111,136.52,61.354,88,0,88'/>
       <path stroke-width='40' d='M181,196.48'/>
       <circle cx='27.5' cy='169.5' r='24.5'/>
       <path stroke-width='40' d='M181,196.48C181,100.039,100.045,22,0,22'/>
     </svg>`;
  }

  contentFinder(data){
    let results = data.query.results;
    if (!results) { return ""; }
    try {
      return (this.atom) ? results.feed.entry : results.rss.channel.item; //atom or rss
    } catch(e) {
      return "";
    }
  }

  // Validates proper URL. Mash-up of regexes found here: https://mathiasbynens.be/demo/url-regex
  isURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }

  feedList(data){
    let list = [];
    let filteredData = data.slice(0, this.configs.entries_to_show);
    filteredData.forEach((item) => {
      list.push(this.feedItem(item));
    });
    return list.join('');
  }

  feedLink(){
    if (this.isURL(this.blogRootUrl)) {
      return `<a class='btn' href='${this.blogRootUrl}' target='_blank'>Read All</a>`;
    }
    return "";
  }

  feedItem(item){
    let link =         this.atom ? item.content.base    : item.link;
    let title =        this.atom ? item.title.content   : item.title;
    let description =  this.atom ? item.summary.content : item.description;
    let author =       this.atom ? item.author.name     : item.author || item.creator;

    let feedEntry = '<li class="h-entry hentry">';
    let innerText = `<a class='p-name entry-title u-url' href='${link}' target='_blank'>
                       <span>${title}</span>
                     </a><br>`;
    if (this.configs.show_entry_summary && description.length) {
      innerText += `<p class='p-summary summary'>${description}</p>`;
    }
    if (this.configs.show_entry_author && author.length) {
      innerText += `<p class='p-author author'>Posted By: ${author}</p>`;
    }
    feedEntry += `${innerText}</li>`;
    return feedEntry;
  }

  validFeedId(){
    return this.feedId().length > 10;
  }

  feedId(){
    return this.configs.feed_url;
  }

  showFeedToggle(){
    return this.configs[`${this.type}_feed_toggle`] === true;
  }
}


//TWITTER UTILITIES
// *******************
class TwitterFeed extends Feed {
  constructor(configs, widget) {
    super(configs, widget, 'twitter');
  }

  url(){
    return `//g5-social-feed-service.herokuapp.com/twitter-feed/${this.configs.twitter_username}`;
  }

  icon(){
    return `<svg enable-background='new 0 0 512 512' height='40' style='max-width:100%; max-height:100%;' version='1.1' viewBox='0 0 512 512' width='40' x='0px' xmlns='http://www.w3.org/2000/svg' y='0px'>
        <path alt='twitter' class='social-feed-icon twitter-social-feed-icon' d='M462,128.223c-15.158,6.724-31.449,11.269-48.547,13.31c17.449-10.461,30.854-27.025,37.164-46.764 c-16.333,9.687-34.422,16.721-53.676,20.511c-15.418-16.428-37.386-26.691-61.698-26.691c-54.56,0-94.668,50.916-82.337,103.787 c-70.25-3.524-132.534-37.177-174.223-88.314c-22.142,37.983-11.485,87.691,26.158,112.85c-13.854-0.438-26.891-4.241-38.285-10.574 c-0.917,39.162,27.146,75.781,67.795,83.949c-11.896,3.237-24.926,3.978-38.17,1.447c10.754,33.58,41.972,58.018,78.96,58.699 C139.604,378.282,94.846,390.721,50,385.436c37.406,23.982,81.837,37.977,129.571,37.977c156.932,0,245.595-132.551,240.251-251.435 C436.339,160.061,450.668,145.174,462,128.223z'>
        </path>
      </svg>`
  }

  feedList(data){
    var list = [];
    let filteredData = data.slice(0, this.configs.tweet_count);
    filteredData.forEach((item) => {
      list.push(this.feedItem(item));
    });
    return list.join('');
  }

  feedItem(item) {
    var avatar = this.configs.display_avatar ? `<span class='post-thumb'><img src='${item.user.profile_image_url_https.replace("_normal", "")}'></span>` : "";
    return `<li>
              ${avatar}
              <div><a href='https://twitter.com/${item.user.screen_name}' class='tweet-name author-name' target='_blank'> ${item.user.screen_name} says:</a></div>
              <span class='tweet-text'>${item.text}</span>
            </li>`;
  }

  feedLink(){
    return `<a class='btn' href='http://www.twitter.com/${this.configs.twitter_username}' href='#' target='_blank'>Read All</a>`;
  }

  feedId(){
    return this.configs.twitter_username;
  }
}

// FACEBOOK UTILITIES
// *******************

class FacebookFeed extends Feed {
  constructor(configs, widget) {
    super(configs, widget, 'facebook');
  }

  url(){
    return `//g5-social-feed-service.herokuapp.com/facebook-feed.json?facebook_page_id=${this.configs.facebook_page_id}`;
  }

  icon(){
    return `<svg enable-background='new 0 0 512 512' height='40' style='max-width:100%; max-height:100%;' version='1.1' viewBox='0 0 512 512' width='40' x='0px' xmlns='http://www.w3.org/2000/svg' y='0px'>
         <path alt='facebook' class='social-feed-icon facebook-social-feed-icon' d='M204.067,184.692h-43.144v70.426h43.144V462h82.965V254.238h57.882l6.162-69.546h-64.044 c0,0,0-25.97,0-39.615c0-16.398,3.302-22.89,19.147-22.89c12.766,0,44.896,0,44.896,0V50c0,0-47.326,0-57.441,0 c-61.734,0-89.567,27.179-89.567,79.231C204.067,174.566,204.067,184.692,204.067,184.692z'>
         </path>
       </svg>`;
  }

  success(data) {
    if (data.hasOwnProperty('data')) {
      super.updateFeed(data.data);
    }
  }

  feedList(data){
    var list = [];
    var cleanFeed = [];
    data.forEach((post) => {
      if (post.message !== undefined){
        cleanFeed.push(post);
      }
    });

    let filteredData = cleanFeed.slice(0, this.configs.facebook_post_limit);
    filteredData.forEach((post) => {
      list.push(this.feedItem(post));
    });
    return list.join('');
  }

  feedLink(){
    return `<a class='btn' href='https://www.facebook.com/${this.configs.facebook_page_id}' href='#' target='_blank'>Read All</a>`;
  }

  feedItem(item) {
    let msgLength = 300;
    let avatar = this.configs.display_avatar && item.picture ? `<span class='post-thumb'><img src='${item.picture}'></span>` : "";
    let msg = item.message;
    let postMessage = msg;
    let linkString = item.id.split("_");
    let page = (linkString[0]);
    let post = (linkString[1]);
    let link = `https://www.facebook.com/${page}/posts/${post}`;

    if(msg.length > msgLength) {
      msg = msg.substring(0,msgLength);
      postMessage = `${msg}...<br><a href='${link}' target="_blank">Read More</a>`;
    }

    return `<li>
              ${avatar}
              <div class='facebook-name tweet-name author-name'><a href='http://facebook.com/${item.from.id}' class='author-name' target='_blank'>${item.from.name} said:</a></div>
              <div class='facebook-post'>${postMessage}</div>
            </li>`;
  }

  feedId(){
    return this.configs.facebook_page_id;
  }
}

// GOOGLE+ UTILITIES
// *******************

class GoogleFeed extends Feed {
  constructor(configs, widget) {
    super(configs, widget, 'google');
  }

  url(){
    return `//g5-social-feed-service.herokuapp.com/google-plus-feed/${this.configs.google_plus_page_id}`;
  }

  icon(){
    return `<svg enable-background='new 0 0 512 512' height='40' style='max-width:100%; max-height:100%;' version='1.1' viewBox='0 0 512 512' width='40' x='0px' xmlns='http://www.w3.org/2000/svg' y='0px'>
         <path alt='google' class='social-feed-icon google-social-feed-icon' d='M462,141.347h-54.621v54.622h-27.311v-54.622h-54.622v-27.311h54.622V59.416h27.311v54.621H462V141.347z M307.583,367.26  c0,40.943-37.384,90.787-131.434,90.787C107.365,458.047,50,428.379,50,378.478c0-38.514,24.383-88.511,138.323-88.511 c-16.922-13.792-21.075-33.077-10.733-53.959c-66.714,0-100.879-39.222-100.879-89.023c0-48.731,36.242-93.032,110.15-93.032 c18.66,0,118.398,0,118.398,0l-26.457,27.77h-31.079c21.925,12.562,33.586,38.433,33.586,66.949 c0,26.175-14.413,47.375-34.983,63.279c-36.503,28.222-27.158,43.98,11.087,71.872C295.121,312.074,307.583,333.882,307.583,367.26 z M233.738,150.453c-5.506-41.905-32.806-76.284-64.704-77.243c-31.909-0.949-53.309,31.119-47.798,73.035 c5.509,41.905,35.834,71.178,67.749,72.139C220.882,219.333,239.242,192.363,233.738,150.453z M266.631,371.463 c0-34.466-31.441-67.317-84.192-67.317c-47.542-0.523-87.832,30.042-87.832,65.471c0,36.154,34.335,66.25,81.879,66.25 C237.267,435.866,266.631,407.617,266.631,371.463z'>
         </path>
       </svg>`;
  }

  feedList(data){
    var list = [];
    let filteredData = data.filter((obj)=>{
      let scopedObj = obj.attributes.object;
      return (scopedObj.content.length || scopedObj.attachments);
    });
    filteredData = filteredData.slice(0, this.configs.google_plus_post_limit);
    filteredData.forEach((item) => {
      list.push(this.feedItem(item.attributes));
    });
    return list.join('');
  }

  feedLink(){
    return `<a class='btn' href='https://plus.google.com/${this.configs.google_plus_page_id}' href='#' target='_blank'>Read All</a>`;
  }

  feedItem(item) {
    let avatar = this.configs.display_avatar ? `<span class='post-thumb'><img src='${item.actor.image.url}'></span>` : "";
    let content = this.feedItemContent(item);
    let markup = `<li>
                   ${avatar}
                   <div class='google-name author-name'><a href='${item.actor.url}' class='author-name' target='_blank'>${item.actor.displayName} said:</a></div>
                   <div class='google-post'>${content}</div>
                  </li>`;
    return content ? markup : "";
  }

  feedItemContent(item){
    if (item.object.content) { return item.object.content; }
    else if (item.object.attachments) { return item.object.attachments[0].content; }
    else { return false; }
  }

  feedId(){
    return this.configs.google_plus_page_id;
  }
}

// INSTAGRAM UTILITIES
// *******************

class InstagramFeed extends Feed {
  constructor(configs, widget) {
    super(configs, widget, 'instagram');
  }

  url(){
    return `//g5-social-feed-service.herokuapp.com/instagram-feed.json?instagram_id=${this.configs.instagram_user_id}&instagram_number_of_photos=${this.configs.instagram_number_of_photos}`;
  }

  icon(){
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" enable-background='new 0 0 512 512'   viewBox='0 0 1000 1000' height='40' width='40' x='0px' y='0px'>
              <path alt="instagram" class="social-feed-icon instagram-social-feed-icon" d="m504 917 q-139 0 -199 -2.5t-98 -17.5q-70 -26 -97 -98q-14 -36 -16.5 -96t-2.5 -199t2.5 -199t17.5 -98q26 -70 98 -97q36 -14 96 -16.5t199 -2.5t199 2.5t93.5 15.5t61.5 41t41 61.5t15.5 93.5t2.5 199t-2.5 199t-17.5 98q-26 70 -98 97q-36 14 -96 16.5t-199 2.5zm-453 -36q76 116 243 124q69 3 210 3t210 -3q110 -5 183 -60q34 -24 55.5 -57t29.5 -54q20 -52 23 -120.5t3 -209.5t-3 -209.5t-21.5 -116.5t-62 -91.5t-91.5 -62t-116.5 -21.5t-209.5 -3t-210 3q-167 8 -243 124q-43 67 -48 169q-3 67 -3 208t3 210q5 100 48 167zm453 -118q107 0 183 -76t76 -183t-76 -183t-183 -76t-183 76t-76 183t76 183t183 76zm0 -427q70 0 119 49t49 119t-49 119t-119 49t-119 -49t-49 -119t49 -119t119 -49zm226.5 0m-25.05 -96c0 -31.52992 25.53924 -57.06916 57.06916 -57.06916c31.52992 0 57.06916 25.53924 57.06916 57.06916c0 31.52992 -25.53924 57.06916 -57.06916 57.06916c-31.52992 0 -57.06916 -25.53924 -57.06916 -57.06916z"></path>
            </svg>`;
  }

  success(data) {
    if (data.hasOwnProperty('data')) {
      super.updateFeed(data.data);
    }
  }

  feedList(data){
    var list = [];
    data.forEach((post) => {
      list.push(this.feedItem(post));
    });
    return list.join('');
  }

  feedLink(){
    return `<a class='btn' href='https://www.instagram.com/${this.configs.instagram_user_name}' href='#' target='_blank'>Read All</a>`;
  }

  feedItem(item) {
    let avatar =  `<a href='${item.link}' target='_blank'> <img src='${item.images.thumbnail.url}'></a>`;
    return `<li class="instagram_images">
              ${avatar}
            </li>`;
  }

  feedId(){
    return this.configs.instagram_user_id;
  }
}

G5.loadWidgetConfigs(".social-feed .config", SocialFeedWidget);
