const remote = require('electron').remote;
const clipboard = require('electron').clipboard;

var player = null;

function closeApp() {
    var window = remote.getCurrentWindow();
    window.close();
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

    if (res.length == 0)
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
    //'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    'scope': 'profile',
  });
};

function loadVideo(id) {
    setConfig("last_video_id", id);

    player.loadVideoById({'videoId': id});

    var request = gapi.client.youtube.search.list({
        type: 'video',
        part: 'snippet',
        relatedToVideoId: '3HsvJT2twOE'
    });
    request.execute(function(response) {
        var str = JSON.stringify(response.result);
        console.log(str);
    });
}

gapi.load('client', start);
