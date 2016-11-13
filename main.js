//GENERAL VARS
var ctx = document.getElementById("ctx").getContext("2d");
var gameStart = false;

//GENERAL FUNCTIONS SETUP
var testcollisionrect = function(a,b) {
    return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.h + a.y > b.y;
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
                delete curroom.enemies[e];
            }
        }
        
        //UPDATE PLAYER
        player.update();
        
        //DRAW USER INTERFACE
        drawUI();
        
        //DRAW DIRECTIONAL KEYS IF NOT LEARNED
        if (moved === false && writing === false) {
            for (var b in wasd) {
                wasd[b].update();
            }
        }
    }
    
    //DRAW TEXT BOX, STOP CONSISTANT ENTER COMMANDS, CHECK LOCKED ADVANCEMENT
    doDialogue();
    spamcatch --;
    textlock = false;
    for (var a in characters) {
        if (characters[a].movecount != 0) {
            textlock = true;
        }
    }
    
    //HANDLE MUSIC INFO FADE OUT
    doRepeatMusic();
    
    //CHECK FOR LEVEL ADVANCEMENT
    if (curroom) {
        curroom.checkFinish();
    }
};

//EXCECUTE MAIN LOOP
setInterval(main,25); //40 fps

//NOTES:
//FOR VARS USED: A,B,C,D,E,F,G,S