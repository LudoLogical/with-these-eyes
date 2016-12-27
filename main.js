//GENERAL VARS
var gameStart = false;
var paused = false;

//GENERAL FUNCTIONS SETUP
var testcollisionrect = function(a,b,override) {
    
    //**lines** the player can not cross with their feet (i.e. bedframe)
    if (override === "line") {
        return a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.alty + b.h &&
        a.h + a.y > b.alty;
        
    //2.5d perspective uses alternate check for curobj characters
    } else if (override === "perspective") {
        return a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y+a.standY < b.y + b.h && //+standY and then -standY for 2nd half
        a.h + a.y > b.y+b.standY; //+standY and then -standY for 1st half
        
    } else {
        return a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.h + a.y > b.y;
    }
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
    } else if (paused) {
        doPauseScreen();
        //HANDLE MUSIC INFO FADE OUT
        doRepeatMusic();
    } else {
        //UPDATE MAP
        curroom.map.update();
        
        //UPDATE CARPET
        characters.carpet.update();
        
        //UPDATE BULLETS
        for (var d in playerBullets) {
            playerBullets[d].update();
            if (playerBullets[d].removeMark) {
                playerBullets.splice(d,1);
                doSFX(sfx.hit);
            }
        }
        for (var g in enemyBullets) {
            enemyBullets[g].update();
            if (enemyBullets[g].removeMark) {
                enemyBullets.splice(g,1);
                doSFX(sfx.hit);
            }
        }
        
        //SORT CUROBJS IN ORDER BASED ON Y POSITION
        curobjs.sort(function(a,b) {
            if (a.y+a.h < b.y+b.h) { //WE'RE COMPARING THEIR FEET
                return -1;
            }
            if (a.y+a.h > b.y+b.h) { //WE'RE COMPARING THEIR FEET
                return 1;
            }
            return 0; //IF SAME NUMBER
        });
        
        //UPDATE ALL OTHER ACTIVE OBJECTS
        for (var o in curobjs) {
            curobjs[o].update();
            if (curobjs[o] instanceof Enemy) {
                var dummy = {
                    x: curobjs[o].x-5,
                    y: curobjs[o].y-5,
                    w: curobjs[o].w+10,
                    h: curobjs[o].h+10,
                    standY: curobjs[o].standY,
                }
                if (testcollisionrect(player,dummy,"perspective")) {
                    player.hp -= curobjs[o].atk;
                    console.log(player.hp)
                }
                if (curobjs[o].removeMark) {
                    player.xp += curobjs[o].xp;
                    doSFX(sfx.destroyed);
                    curobjs.splice(o,1);
                }
            }
        }
        
        //DRAW USER INTERFACE
        drawUI();
        
        //DRAW DIRECTIONAL KEYS AND MOUSE IF NOT LEARNED
        if (moved === false && writing === false && gameStart === true && wasd) {
            for (var b in wasd) {
                wasd[b].update();
            }
        }
        
        if (clicked === false && writing === false && gameStart === true && mouse_l) {
            mouse_l.update();
        }
        
        //DODIALOGUE
        doDialogue();
        //HANDLE MUSIC INFO FADE OUT
        doRepeatMusic();
        //CHECK FOR LEVEL ADVANCEMENT
        if (curroom) {
            curroom.checkFinish();
        }
        //HANDLES FADE IN/OUT AND RELATED ADVANCEMENT FEATURES
        doAlpha();
    }
    
    //STOP CONSISTANT ERROR COMMANDS
    spamcatch --;
};

//EXCECUTE MAIN LOOP
setInterval(main,25); //40 fps

//NOTES:
//FOR VARS USED: A,B,C,D,E,F,G,S