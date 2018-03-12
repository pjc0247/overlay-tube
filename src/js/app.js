const remote = require('electron').remote;
const clipboard = require('electron').clipboard;

var player = null;
var currentVideoId = null;
var lastAppliedClipboardText = null;

function closeApp() {
    var window = remote.getCurrentWindow();
    window.close();
}
function showRecommendedVideos() {
    $("#recommended-video").addClass("visible");
}
function hideRecommendedVideos() {
    $("#recommended-video").removeClass("visible");
}
function showSidebar() {
    $("#sidebar").addClass("visible");
    $("#sidebar-back").addClass("visible");
}
function hideSidebar() {
    $("#sidebar").removeClass("visible");
    $("#sidebar-back").removeClass("visible");
}
function showInputUrlDialog() {
    Metro.dialog.open('#dialog-input-url');

    let clipboardUrl = clipboard.readText();
    let res = /v=([a-zA-Z0-9\-]+)/.exec(clipboardUrl);

    if (res != null && res.length == 0)
        $("#input-url").val("");
    else
        $("#input-url").val(clipboardUrl);
}
function showSettingDialog() {
    Metro.dialog.open('#dialog-setting');
}
function openUrl(){
    let url = $("#input-url").val();
    let videoId = /v=([a-zA-Z0-9\-]+)/.exec(url)[1];

    loadVideo(videoId);
}

function checkClipboardAndPlay() {
    let clipboardUrl = clipboard.readText();
    if (lastAppliedClipboardText == clipboardUrl)
        return;

    let res = /v=([a-zA-Z0-9\-_]+)/.exec(clipboardUrl);
    
    if (res == null) return;

    if (res.length >= 1)
    if (currentVideoId != res[1])
        loadVideo(res[1]);

    lastAppliedClipboardText = clipboardUrl;
}

function onOpacityChange(val) {
    less.modifyVars({
        '@opacity': val * 0.01
    });
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube', {
        height: '360',
        width: '640',
        videoId: getConfig("last_video_id", 'M7lc1UVf-VE'),
        playerVars: {rel: 0, showinfo: 0},
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerReady(event) {
    event.target.playVideo();

    setTimeout(function(){
        $("#splash").addClass("hidden");
    }, 1000);
}
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING)
        $("#video-title").html(player.getVideoData().title);
}

function start() {
  gapi.client.init({
    'apiKey': 'AIzaSyBvmYBTcuply1MrT9icS6Lkc0njnLYeIhY',
    'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
    //'clientId': 'AIzaSyBvmYBTcuply1MrT9icS6Lkc0njnLYeIhY.apps.googleusercontent.com',
    //'scope': 'profile',
  });
};

function loadVideo(id) {
    setConfig("last_video_id", id);

    currentVideoId = id;
    player.loadVideoById({'videoId': id});

    var request = gapi.client.youtube.search.list({
        type: 'video',
        part: 'snippet',
        relatedToVideoId: id
    });
    request.execute(function(response) {
        console.log(response);
        var str = JSON.stringify(response.result);
        console.log(str);

        let videoContainer = $("#recommended-video");
        //videoContainer.empty();

        let items = response.result.items;
        for (let i=0;i<items.length;i++) {
            let item = items[i];

            $("#r" + (i+1)).html("<img src=\"" + item.snippet.thumbnails.medium.url +
                "\" onclick=loadVideo(\"" + item.id.videoId + "\");" +
                " />");
            //videoContainer.append("<img src=\"" + item.snippet.thumbnails.medium.url + "\" />");
        }
        //response.result;
    });
}

gapi.load('client', start);


setInterval(checkClipboardAndPlay, 1000);
