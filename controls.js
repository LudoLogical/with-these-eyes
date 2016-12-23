//DEFINE CANVAS (FIRST FILE TO LOAD)
var ctx = document.getElementById("ctx").getContext("2d");

//GENERAL VARS
var wpress = false;
var apress = false;
var spress = false;
var dpress = false;
var mX = 0;
var mY = 0;
var lastpress = "d";
var enterpress = false;
var moved = false;
var clicked = false;

//DOCUMENT FUNCTIONS SETUP
document.onkeydown = function (e) {
    switch(e.keyCode) {
        case 87: //w
            wpress = true;
            break;
        case 65: //a
            apress = true;
            if (writing === false && alpha === 0) { lastpress = "a"; }
            break;
        case 83: //s
            spress = true;
            break;
        case 68: //d
            dpress = true;
            if (writing === false && alpha === 0) { lastpress = "d"; }
            break;
        case 13: //enter
            enterpress = true;
            break;
        case 80: //p
            paused = true;
        default: break;
    }
    
    if ((e.keyCode === 87 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) && writing === false) {
        moved = true;
    }
};

//MOVE VAR RESET
document.onkeyup = function (e) {
    switch(e.keyCode) {
        case 87: //w
            wpress = false;
            break;
        case 65: //a
            apress = false;
            if (writing === false && alpha === 0) { lastpress = "a"; }
            break;
        case 83: //s
            spress = false;
            break;
        case 68: //d
            dpress = false;
            if (writing === false && alpha === 0) { lastpress = "d"; }
            break;
        case 13: //enter
            enterpress = false;
            break;
        case 80: //p
            //pause
        default: break;
    }
};

//ATTACK HANDLING AND MOUSE TRACKING
document.onmousemove = function(mouse) {
    mX = mouse.clientX - document.getElementById("ctx").getBoundingClientRect().left;
    mY = mouse.clientY - document.getElementById("ctx").getBoundingClientRect().top;
    var angX = mX - (ctx.canvas.width/2);
    var angY = mY - (ctx.canvas.height/2);
    player.aimangle = Math.atan2(angY,angX); //removed from sample WoU code to measure only in radians
    
};
document.onclick = function(mouse) { //ctx.canvas.width/2 + 155,250-17.5,20,20
    if (paused) {
        var mouse = {x:mX,y:mY,w:0,h:0};
        if (testcollisionrect(mouse,toggles.plus1) && musicVol < 10) {
            musicVol ++;
        } else if (testcollisionrect(mouse,toggles.plus2) && sfxVol < 10) {
            sfxVol ++;
        } else if (testcollisionrect(mouse,toggles.plus3) && talkSpd > 1) {
            talkSpd --;
        } else if (testcollisionrect(mouse,toggles.minus1) && musicVol > 0) {
            musicVol --;
        } else if (testcollisionrect(mouse,toggles.minus2) && sfxVol > 0) {
            sfxVol --;
        } else if (testcollisionrect(mouse,toggles.minus3) && talkSpd < 3) {
            talkSpd ++;
        }
        volumeAdjust();
    } else if (writing === false && gameStart && player.hp > 0 && player.power >= 50 && alpha === 0) {
        player.doAttack();
        doSFX(sfx.player_fire);
        clicked = true;
    }
}