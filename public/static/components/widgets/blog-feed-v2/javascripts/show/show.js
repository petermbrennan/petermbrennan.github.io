// INITIAL SETUP: setUpForArticleList populates
// list of relevant post summaries on the parent
// blog page. setUpForSingleView populates the
// next/prev/return links based on the last
// tag the user selected.
// ******************************************

class BlogFeedWidgetV2 {
  constructor(configs){
    this.configs = configs;
    G5.fortAwesomeApi.registerWidget(this, 'fortAwesomeLoaded');
    if ($('.news-feed-single-post').length) {
      this.setUpForSingleView();
    } else {
      this.setUpForArticleList();
    }
  }

  setUpForSingleView() {
    new PostViewInitializer(this.configs);

    // This event gets fired by the News Tags Widget
    return $(window).on('tagChange', e => {
      return new ReturnToParentBlogPage(this.configs);
    });
  }

  setUpForArticleList() {
    new BlogFeedInitializer(this.configs);

    window.addEventListener('popstate', e => {
      return new BlogFeedInitializer(this.configs);
    });

    // This event gets fired by the News Tags Widget
    return $(window).on('tagChange', e => {
      return new BlogFeedInitializer(this.configs);
    });
  }
}

// PostViewInitializer is triggered if this
// is a single article view.
// ******************************************

class PostViewInitializer {
  constructor(configs) {
    this.configs = configs;
    const feedURL = this.buildFeedURL();
    const feedSource = new BlogFeedSource(feedURL);
    $(feedSource).bind("feedReady", event => {
      const { feed } = feedSource;
      return new BlogPostBedazzler(this.configs, feed);
    });

    feedSource.getFeed();
    new BlogFeedWidthChecker(this.configs);
  }

  buildFeedURL() {
    let fullURL;
    const baseURL = `${this.configs.newsServiceDomain}/locations/${this.configs.locationURN}/posts/${this.article()}.json`;
    const selectedTag = sessionStorage.getItem('currentTag');
    const tag = selectedTag ? selectedTag : "all";

    return fullURL = `${baseURL}?tag=${tag}`;
  }

  article() {
    const urlBits = window.location.href.split("/");
    return urlBits.pop();
  }
}

// Set up navigation links associated with
// current article and selected tag
// ******************************************

class BlogPostBedazzler {
  constructor(configs, feed) {
    this.configs = configs;
    this.feed = feed;
    this.widget = $(`#${this.configs.widgetId}`);
    this.checkSession();
    this.setBackLinkHref();
    this.setBackLinkText();
    this.setTagHrefs();
    this.buildBottomLinks();
  }

  setBackLinkHref() {
    const backLink = this.widget.find('.article-top a');

    const tag = sessionStorage.getItem('currentTag');
    const currentTag = tag != null ? tag : {tag : "all"};

    const page = sessionStorage.getItem('currentArticlesPage');
    const lastSelectedPage = page != null ? page : {page : "1"};

    const backUrl = `${this.parentUrl()}/?tag=${currentTag}&page=${lastSelectedPage}`;

    if (backLink) { return backLink.attr('href', backUrl); }
  }

  setBackLinkText() {
    const backLink = this.widget.find('.article-top a');
    const linkText = this.configs.returnToListText === "" ? "Return To Blog" : this.configs.returnToListText;
    if (linkText != "Return To Blog") {
      const newLinkText = backLink.html().replace("Return To Blog", linkText);
      backLink.html(newLinkText);
    }
    return backLink.addClass("show");
  }

  setTagHrefs() {
    const tags = this.widget.find('.article-tag');
    const that = this;
    return tags.each(function(index, value) {
      const tag = $(this).data('tag');
      return $(this).attr('href', `${that.parentUrl()}/?tag=${tag}`);
    });
  }

  buildBottomLinks() {
    const sMNText = this.configs.seeMoreNewsText === "" ? "See More News" : this.configs.seeMoreNewsText;
    const navMarkup = ` ${this.addToAnyCode()} \
    <div class='posts-nav'> \
    ${this.previousButton()} \
    <a href='${this.parentUrl()}/' class='all-posts'>${sMNText}</a> \
    ${this.nextButton()} \
    </div> `;

    return this.widget.find('.news-feed-single-post').append(navMarkup);
  }

  previousButton() {
    const { previous } = this.feed.post;

    if (previous) {
      return ` <a href='${this.pathForPost(previous)}' data-post-slug='${previous.title_slug}' class='post-toggle previous-post'> \
<div class='post-nav-top'> \
<i class='fa fa-chevron-left'></i> <span>Previous</span> \
</div> \
<div> \
${this.navImageMarkup(previous)} \
<div class='post-title'>${previous.title}</div> \
<div class='post-date'>${previous.pretty_date}</div> \
${this.authorMarkup(previous)} \
</div> \
</a> `;
    } else {
      return "";
    }
  }

  nextButton() {
    const { next } = this.feed.post;

    if (next) {
      return ` <a href='${this.pathForPost(next)}' data-post-slug='${next.title_slug}' class='post-toggle next-post'> \
<div class='post-nav-top'> \
<span>Next</span> <i class='fa fa-chevron-right'></i> \
</div> \
<div> \
${this.navImageMarkup(next)} \
<div class='post-title'>${next.title}</div> \
<div class='post-date'>${next.pretty_date}</div> \
${this.authorMarkup(next)} \
</div> \
</a> `;
    } else {
      return "";
    }
  }

  navImageMarkup(post) {
    let markup = "";
    if (this.configs.displayPhotos === "true") {
      let imageElement;
      let { image } = post;
      if (image === "") { image = this.configs.defaultImage; }
      if (image !== "") { imageElement = `<img src='${image}' ${CloudinaryHelper.responsiveImage(image)} />`; }
      if (imageElement) { markup = `<div class='post-image-wrapper'><div>${imageElement}</div></div>`; }
    }

    return markup;
  }

  authorMarkup(post) {
    if (post.author !== "") {
      return `<span class='author-divider'>|</span><span class='post-author'>by ${post.author}</span>`;
    } else {
      return "";
    }
  }

  addToAnyCode() {
    if (this.configs.shareButtons === "true") {
      return ` <div class='a2a_kit a2a_kit_size_32 a2a_default_style'> \
<a class='a2a_dd' href='https://www.addtoany.com/share'></a> \
<a class='a2a_button_facebook'></a> \
<a class='a2a_button_twitter'></a> \
<a class='a2a_button_google_plus'></a> \
</div> \
<script type='text/javascript' src='//static.addtoany.com/menu/page.js'></script> `;
    } else {
      return "";
    }
  }

  pathForPost(post){
    return `${this.parentUrl()}/${post.title_slug}`;
  }

  parentUrl() {
    const urlBits = window.location.href.split("/");
    urlBits.pop();
    return urlBits.join("/");
  }

  checkSession() {
    if (!sessionStorage.getItem('currentTag')) {
      sessionStorage.setItem('currentTag', "all");
    }

    if (!sessionStorage.getItem('currentArticlesPage')) {
      return sessionStorage.setItem('currentArticlesPage', "1");
    }
  }
}


// BlogFeedInitializer is triggered when no
// article has been selected.
// ******************************************

class BlogFeedInitializer {
  constructor(configs) {
    this.configs = configs;
    const feedURL = this.buildFeedURL();
    const feedSource = new BlogFeedSource(feedURL);
    $(feedSource).bind("feedReady", event => {
      let blogNav;
      const { feed } = feedSource;
      new BlogFeedBuilder(this.configs, feed);
      return blogNav = new BlogNav(this.configs, feed).paginationListener();
    });

    feedSource.getFeed();
    new BlogFeedWidthChecker(this.configs);
  }

  buildFeedURL() {
    let fullURL;
    const selectedTag = new QueryParameter("tag").value();
    if (selectedTag) { window.currentTag = selectedTag; }
    const selectedPage = new QueryParameter("page").value();

    const baseURL = `${this.configs.newsServiceDomain}/locations/${this.configs.locationURN}/blog_feed.json`;
    let perPage = parseInt(this.configs.numberOfPosts);
    if (isNaN(perPage)) { perPage = 20; }

    const tag = selectedTag ? selectedTag : "all";
    const page = selectedPage ? selectedPage : "1";

    sessionStorage.setItem('currentTag', tag);
    sessionStorage.setItem('currentArticlesPage', page);

    return fullURL = `${baseURL}?tag=${tag}&page=${page}&per_page=${perPage}`;
  }
}


// Build out markup for initial list of posts
// ******************************************

class BlogFeedBuilder {
  constructor(configs, feed) {
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    this.feed = feed.posts;
    new SharedBlogHelpers().clearAllPosts();
    this.populateFeed();
    this.buildPaginationLinks(feed.meta);
  }

  populateFeed() {
    const markup = [];

    for (let index = 0; index < this.feed.length; index++) {
      const post = this.feed[index];
      markup.push( `<div class='news-feed-post'> \
${this.toggleMarkup(post, index)} \
${this.detailsMarkup(post)} \
${this.bottomToggles(post, index)} \
</div>` );
    }

    return this.widget.append(markup.join(''));
  }

  pathForPost(post){
    return new SharedBlogHelpers().pathForPost(post);
  }

  toggleMarkup(post, index) {
    const linkTag = `<a class='post-toggle' href='${this.pathForPost(post)}'>`;
    let toggle  = linkTag;
    if (this.configs.displayPhotos === "true") {
      if (post.image !== "") {
        toggle += `  <img src='${post.image}' ${CloudinaryHelper.responsiveImage(post.image)} />`;
      } else {
        toggle += `  <img src='${this.configs.defaultImage}' ${CloudinaryHelper.responsiveImage(this.configs.defaultImage)} />`;
      }
    }
    toggle += "</a>";
    toggle += linkTag;
    if (post.title !== "") { toggle += `  <h1 class='post-title'>${post.title}</h1>`; }
    toggle += "</a>";
    return toggle;
  }


  detailsMarkup(post) {
    let details;
    if (post.title !== "") { details  = `<span class='post-date'>${post.pretty_date}</span>`; }
    if (post.author !== "") { details += `<span>|</span><span class='post-author'>by ${post.author}</span>`; }
    details += `<div class='post-description'>${post.description}</div>`;
    return details;
  }

  bottomToggles(post, index) {
    return `<a class='post-toggle toggle-button' href='${this.pathForPost(post)}'>Read More</a>`;
  }

  validPagesForPagination(meta) {
    return [1, meta.total_pages, meta.page, meta.page - 2,meta.page - 1,meta.page + 1,meta.page + 2];
  }

  buildPageLinkOrElipsis(meta, pageButtons) {
    for (let page = 1, end = meta.total_pages, asc = 1 <= end; asc ? page <= end : page >= end; asc ? page++ : page--) {
      const active = page === meta.page ? "active-page" : "";
      const lastPage = page === (meta.total_pages) ? "last" : "";
      // show the first, last, current page, and current page + or - 2, otherwise show ellipsis
      if (!this.validPagesForPagination(meta).includes(page)) {
        if (pageButtons[pageButtons.length - 1]  !== " ... ") { pageButtons.push(" ... "); }
        continue;
      }
      pageButtons.push(`<a href='#' class='pagination-button page-button ${active} ${lastPage}' data-page-number='${page}' data-tag='${meta.tag}'>${page}</a>`);
    }
    return pageButtons;
  }

  buildNextOrPreviousLinks(meta, nextOrPrev) {
    let arr;
    if (nextOrPrev === 'next') {
      arr = ['next', meta.page + 1, 'fa-chevron-right', 'Next Page'];
    } else {
      arr = ['prev', meta.page - 1, 'fa-chevron-left', 'Previous Page'];
    }
    return `<a href='#' class='page-button pagination-button pagination-text ${arr[0]}' data-page-number='${arr[1]}' data-tag='${meta.tag}'><i class='fa ${arr[2]}'></i> <span class='previous-next'>${arr[3]}</span></a>`;
  }

  buildPaginationLinks(meta) {
    let pageButtons = [];
    if (meta.total_pages > 1) {
      if (meta.page !== 1) {
        pageButtons.push(this.buildNextOrPreviousLinks(meta, 'prev'));
      }
      pageButtons = this.buildPageLinkOrElipsis(meta, pageButtons);
      if (meta.page !== meta.total_pages) {
        pageButtons.push(this.buildNextOrPreviousLinks(meta, 'next'));
      }
      const paginationMarkup = `<div class='blog-pagination'> \
${pageButtons.join('')} \
</div>`;

      $('.blog-feed-v2').append(paginationMarkup);
      return $(paginationMarkup).insertAfter('#news-feed-top');
    }
  }
}

// Listen for tag or page changes
// ******************************************

class BlogNav {
  constructor(configs, feed) {
    this.configs = configs;
    this.feed = feed;
    this.widget = $(`#${this.configs.widgetId}`);
    this.paginationListener;
  }

  paginationListener() {
    return this.widget.find('.pagination-button').click(e=> {
      const btn = $(e.currentTarget);
      const page = btn.data("page-number");
      const tag = btn.data("tag");
      this.updateUrl([["tag",tag], ["page",page]]);
      this.scrollAction();
      new BlogFeedInitializer(this.configs);
      return window.noEvent(e);
    });
  }

  updateUrl(params) {
    const currentPath = window.location.pathname;
    const queryParams = [];
    for (let index = 0; index < params.length; index++) {
      const param = params[index];
      if (param[0] && param[1]) { queryParams.push(`${param[0]}=${param[1]}`); }
    }

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : "";

    return window.history.pushState({},"", `${currentPath}${queryString}`);
  }

  scrollAction() {
    const elementOffset = $(this.widget).offset().top;
    return window.scrollTo(0, elementOffset);
  }
}

// Helpers shared across multiple classes
// ******************************************

class SharedBlogHelpers {
  pathForPost(post) {
    let pagePath = window.location.pathname;
    if (pagePath.substr(pagePath.length - 1) !== "/") { pagePath += "/"; }
    pagePath += post.title_slug;
    return pagePath;
  }

  clearAllPosts() {
    return $('.blog-loading, .news-feed-post, .blog-pagination').remove();
  }
}


// Find a query param if it exists
// ******************************************

class QueryParameter {
  constructor(param) {
    this.param = param;
  }

  value() {
    const name = this.param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    if (results === null) {
      return false;
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }
}


// When a tag change comes from another widget
// and this is a single article view, we need
// to bump back to the parent blog page.
// ******************************************

class ReturnToParentBlogPage {
  constructor(configs) {
    this.configs = configs;
    this.setTagInSession();
    this.backToParent();
  }

  setTagInSession() {
    this.newTag = new QueryParameter("tag").value();
    sessionStorage.setItem('currentTag', this.newTag);
    return sessionStorage.setItem('currentArticlesPage', "1");
  }

  backToParent() {
    const urlBits = window.location.href.split("/");
    urlBits.pop();
    return window.location = `${urlBits.join('/')}?tag=${this.newTag}&page=1`;
  }
}

// Pseudo Media Query
// ******************************************

class BlogFeedWidthChecker {
  constructor(configs) {
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    this.applyWidthClasses();
    $(window).resize(() => {
      return this.applyWidthClasses();
    });
  }

  applyWidthClasses() {
    if (this.widget.width() <= 460) {
      return this.widget.removeClass("wide").addClass("narrow");
    } else {
      return this.widget.removeClass("narrow").addClass("wide");
    }
  }
}

// Get news feed from service or session storage
// *********************************************

class BlogFeedSource {
  constructor(url) {
    this.url = url;
  }

  getFeed() {
    if (this.feedFromStorage()) {
      return $(this).trigger("feedReady");
    } else {
      return this.fetch();
    }
  }

  fetch() {
    return $.ajax({
      url: this.url,
      dataType: 'json',
      success: (data, status, xhr) => {
        this.feed = data;
        this.storeFeed();
        return $(this).trigger("feedReady");
      },
      error: (xhr, status, error) => {}
    });
  }

  feedFromStorage() {
    try {
      return this.feed = JSON.parse(sessionStorage.getItem(this.url));
    } catch (error) {
      return null;
    }
  }

  storeFeed() {
    try {
      return sessionStorage.setItem(this.url, JSON.stringify(this.feed));
    } catch (error) {
      return null;
    }
  }
}



G5.loadWidgetConfigs('.blog-feed-v2 .config', BlogFeedWidgetV2);
