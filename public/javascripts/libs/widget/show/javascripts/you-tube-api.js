class YouTubeApi extends ApiManager {
  apiName(){
    return 'youtubeapi';
  }
  apiScript(){
    return '//www.youtube.com/player_api';
  }
  prependScript(){
    return false;
  }
};

window.onYouTubePlayerReady = function(){
  G5.youTubeApi.doneLoading();
};

window.onYouTubeIframeAPIReady = function(){
  G5.youTubeApi.doneLoading();
};

G5.youTubeApi = new YouTubeApi();
