/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Start Here: Get widget configs, build
// initial view, and set up click listener
// ******************************************

class MiniBlogFeedWidget {
  constructor(configs){
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    const feedURL = `${this.configs.newsServiceDomain}/locations/${this.configs.locationURN}/news_feed.json`;
    const feedSource = new MiniBlogFeedSource(feedURL);
    $(feedSource).bind("feedReady", event => {
      return new MiniBlogFeedLinkBuilder(this.configs, feedSource.feed, this.widget);
  } );

    feedSource.getFeed();
    new MiniBlogFeedWidthChecker(this.widget);
  }
}

// Build out markup for posts links
// ******************************************

class MiniBlogFeedLinkBuilder {
  constructor(configs, feed, widget) {
    this.configs = configs;
    this.feed = feed;
    this.widget = widget;
    this.populateFeed();
  }

  populateFeed() {
    let postCount = parseInt(this.configs.numberOfPosts);
    if (isNaN(postCount)) { postCount = 3; }

    const websitePosts = this.feed.slice(0, postCount);
    const markup = [];
    const sMNText = this.configs.seeMoreNewsText === "" ? "See More News" : this.configs.seeMoreNewsText;

    let blogPageLink = this.configs.newsPagePath;
    blogPageLink = blogPageLink[blogPageLink.length-1] === '/' ? blogPageLink.slice(0, blogPageLink.length-1) : blogPageLink;
    blogPageLink += this.configs.usesStaticPages === "true" ? '/' : '?article=';
    for (let index = 0; index < websitePosts.length; index++) {
      const post = websitePosts[index];
      const link = blogPageLink + post.title_slug;
      markup.push( `<div class='news-item-preview'> \
        ${this.imageMarkup(post)} \
        <a href=${link}><h3 class='post-title'>${post.title}</h3></a> \
        ${this.postDetails(post)} \
        <div class='post-description'>${post.description}</div> \
        <a class='news-item-link' href=${link} data-post-index='${index}'> \
        Read More<span class='nav-bling'> ></span> \
        </a> \
        </div>` );
    }

    markup.push(` <div class='all-news'> \
      <a class='all-news-link' href='${this.configs.newsPagePath}'> \
      ${sMNText}<span class='nav-bling'> ></span> \
      </a> \
      </div> `);

    return this.widget.append(markup.join(''));
  }

  postDetails(post) {
    let markup =  " <div class='post-details'>";
    markup += `<span class='post-date'>${post.pretty_date}</span>`;
    if (post.author !== "") { markup += `<span class='divider'> | </span><span class='post-author'>by ${post.author}</span>`; }
    return markup += "</div>";
  }

  imageMarkup(post) {
    let markup = "";
    if (this.configs.displayPhotos === "true") {
      let imageElement;
      let { image } = post;
      if (image === "") { image = this.configs.defaultImage; }
      if (image !== "") { imageElement = `<img src='${image}' srcset='${image}' />`; }
      if (imageElement) { markup = `<div class='post-image-wrapper'><div>${imageElement}</div></div>`; }
    }
    return markup;
  }
}

// Get news feed from service or session storage
// *********************************************

class MiniBlogFeedSource {
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

// Pseudo Media Query
// ******************************************

class MiniBlogFeedWidthChecker {
  constructor(widget) {
    this.widget = widget;
    this.applyWidthClasses();
    $( window ).resize(() => {
      return this.applyWidthClasses();
    });
  }

  applyWidthClasses() {
    const width = $(window).width();
    if (width <= 590) {
      return this.widget.removeClass("wide").addClass("narrow");
    } else {
      return this.widget.removeClass("narrow").addClass("wide");
    }
  }
}

G5.loadWidgetConfigs('.mini-blog-feed .config', MiniBlogFeedWidget);
