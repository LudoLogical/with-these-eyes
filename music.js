//AUDIO SETUP
class Song {
    constructor(src,resetTime) {
        this.audio = new Audio(src);
        this.audio.volume = 0;
        this.resetTime = resetTime;
    }
}

//AUDIO CREATION
var songs = { // volume 0.2 original mp3 // volume 1 beepbox wav
    adventure: new Song("songs/adventure.wav",44.3),
    cryingWithMyHeart: new Song("songs/crying_with_my_heart.wav",20.1),
    greetingsMisterDeer: new Song("songs/greetings_mister_deer.wav",12.6),
    sheHasLeft: new Song("songs/she_has_left.wav",27.35),
    welcomeHome: new Song("songs/welcome_home.wav",20.1),
};

//ADDITIONAL VARS
var cursong = false;
var cursongcount = 0;

//FADE MUSIC OUT
var fadeOut = function(time) { //time in ms
    $(cursong.audio).animate({volume: 0},time);
}

//FADE MUSIC IN
var fadeIn = function(newsong,time) { //newsong is songs.songName
    cursong = newsong;
    cursong.audio.play();
    $(cursong.audio).animate({volume: 1},time);
}

//REPEAT TRACKS ON LOOP WITH ZERO DELAY
var doRepeatMusic = function() {
    if (cursong) {
        if (cursong.audio.currentTime >= cursong.resetTime) {
            cursong.audio.currentTime = 0;
        }
    }
}

//TURN OFF ALL MUSIC, RESET ALL CURRENT TIMES
var resetAllMusic = function() {
    for (var s in songs) {
        songs[s].audio.pause();
        songs[s].audio.currentTime = 0;
        songs[s].counter = 0;
    }
}