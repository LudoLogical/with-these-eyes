//ALPHA VARS SETUP
var alpha = 0;
var alphamethod = "in";
var alphaexecute = "";

//HANDLE FADE IN/OUT AND EFFECTS IN ROOM TRANSITIONS
var doAlpha = function() { // max alpha is 60 (1.5 sec)
    //INCREMENT ALPHA
    if (alphamethod === "in" && alpha > 0) {
        alpha -= 1;
    } else if (alphamethod === "out" && alpha < 60) {
        alpha += 1;
    }
    
    //HANDLE EFFECTS
    if (alpha === 60 && alphamethod === "out" && alphaexecute === "load") {
        for (var c in curroom.character_imp) {
            curroom.character_imp[c][0].x = -500;
            curroom.character_imp[c][0].y = -500;
        }
        alphamethod = "in";
        alphaexecute = "play";
        rooms[curroom.nextLV].begin();
    } else if (alpha === 0 && alphamethod === "in" && alphaexecute === "play") {
        cursong = curroom.musicstart;
        fadeIn(cursong,2000);
        doDialogue(curroom.dialoguestart);
        alphaexecute = "";
    }
    
    //DRAW ALPHA (MUST BE LAST THING DRAWN BY MAIN)
    ctx.save();
    ctx.globalAlpha = alpha/60;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.restore()
};

//PREFORM ACTION FROM DODIALOGUE
var doAction = function(actorlist) {
    //[character/object, action to perform, time to perform, action after performed]
    //[song, action to perform]
    if (actorlist[1] === "left" || actorlist[1] === "right" || actorlist[1] === "up" || actorlist[1] === "down" || actorlist[1] === "stay") {
        actorlist[0].movedir = actorlist[1];
        actorlist[0].movecount = actorlist[2];
        actorlist[0].afteraction = actorlist[3];
        textlock = true;
    } else if (actorlist[1] === "play") {
        fadeIn(actorlist[0],2000);
    } else if (actorlist[1] === "fade") {
        fadeOut(2000);
    } else if (actorlist[1] === "play wasd") {
        fadeIn(actorlist[0],2000);
        //READY WASD (UPDATED FROM FALSE)
        wasd = {
            w: new Entity(player.x+1,player.y-25,20,20,"img/controls/w.png"),
            a: new Entity(player.x-30,player.y+12.5,20,20,"img/controls/a.png"),
            s: new Entity(player.x+1,player.y+50,20,20,"img/controls/s.png"),
            d: new Entity(player.x+32,player.y+12.5,20,20,"img/controls/d.png"),
        };
    } else if (actorlist[1] === "mouseL") {
        //READY MOUSEL (UPDATED FROM FALSE)
        mouse_l = new Entity(player.x+5.5,player.y-35,18,30,"img/controls/leftmouse_1.png",true);
    }
}

//RESOLUTION AFTER DODIALOGUE ACTIONS
var resolveAction = function(actor) {
    if (actor.afteraction === "remove") {
        actor.x = -500;
        actor.y = -500;
        actor.afteraction = "";
        textlock = false;
    } else if (actor.afteraction[1]) {
        doAction(actor.afteraction);
    }
}

//FADE MUSIC OUT
var fadeOut = function(time) { //time in ms
    $(cursong.audio).animate({volume: 0},time);
}

//FADE MUSIC IN
var fadeIn = function(newsong,time) { //newsong is songs.songName
    cursong = newsong;
    cursong.audio.play();
    $(cursong.audio).animate({volume: musicVol/10},time);
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

//PLAY SFX
var doSFX = function(effect) { //effect is sfx.effectName
    effect.audio.currentTime = 0;
    effect.audio.play();
}

//DO VOLUME ADJUSTMENTS
var volumeAdjust = function() {
    if (cursong) {
       cursong.audio.volume = musicVol/10; 
    }
    for (var ss in sfx) {
        sfx[ss].audio.volume = sfx[ss].maxvolume * (sfxVol/10);
    }
}