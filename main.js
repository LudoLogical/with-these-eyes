//GENERAL VARS
var ctx = document.getElementById("ctx").getContext("2d");
var gameStart = false;
var alpha = 80;
var alphamethod = "in";
var alphaexecute = "";

//GENERAL FUNCTIONS SETUP
var testcollisionrect = function(a,b) {
    return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.h + a.y > b.y;
};

//HANDLE FADE IN/OUT AND EFFECTS IN ROOM TRANSITIONS
var doAlpha = function() { // max alpha is 80 (2 sec)
    //INCREMENT ALPHA
    if (alphamethod === "in" && alpha > 0) {
        alpha -= 1;
    } else if (alphamethod === "out" && alpha < 80) {
        alpha += 1;
    }
    
    //HANDLE EFFECTS
    if (alpha === 80 && alphamethod === "out" && alphaexecute === "load") {
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
    ctx.globalAlpha = alpha/80;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.restore()
};

//MAIN UPDATE LOOP
var main = function () {
    //CLEAR RECT
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    
    if (!gameStart) {
        doTitleScreen();
    } else if (player.hp <= 0) {
        doGameOverScreen();
        fadeOut(2000);
    } else {
        //UPDATE MAP
        curroom.map.update();
        
        //UPDATE BULLETS
        for (var d in playerBullets) {
            playerBullets[d].update();
            if (playerBullets[d].removeMark) {
                playerBullets.splice(d,1);
            }
        }
        for (var g in enemyBullets) {
            enemyBullets[g].update();
            if (enemyBullets[g].removeMark) {
                enemyBullets.splice(g,1);
            }
        }
        
        //UPDATE CHARACTERS
        for (var c in characters) {
            characters[c].update();
        }
        
        //UPDATE ENTITIES, TEST COLLISIONS
        for (var e in curroom.enemies) {
            curroom.enemies[e].update();
            if (testcollisionrect(player,curroom.enemies[e])) {
                player.hp -= curroom.enemies[e].atk;
            }
            if (curroom.enemies[e].removeMark) {
                player.xp += curroom.enemies[e].xp;
                curroom.enemies.splice(e,1);
            }
        }
        
        //UPDATE PLAYER
        player.update();
        
        //DRAW USER INTERFACE
        drawUI();
        
        //DRAW DIRECTIONAL KEYS IF NOT LEARNED
        if (moved === false && writing === false && gameStart === true && wasd) {
            for (var b in wasd) {
                wasd[b].update();
            }
        }
        
        if (clicked === false && writing === false && gameStart === true && mouse_l) {
            mouse_l.update();
        }
    }
    
    //DRAW TEXT BOX, STOP CONSISTANT ENTER COMMANDS, HANDLE DIALOGUE
    doDialogue();
    spamcatch --;
    
    //HANDLE MUSIC INFO FADE OUT
    doRepeatMusic();
    
    //CHECK FOR LEVEL ADVANCEMENT
    if (curroom) {
        curroom.checkFinish();
    }
    
    //HANDLES FADE IN/OUT AND RELATED ADVANCEMENT FEATURES
    doAlpha();
    
};

//EXCECUTE MAIN LOOP
setInterval(main,25); //40 fps

//NOTES:
//FOR VARS USED: A,B,C,D,E,F,G,S