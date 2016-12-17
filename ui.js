//DO TITLE SCREEN
var doTitleScreen = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px 'Muli'";
    ctx.textAlign = "center";
    ctx.fillText("With These Eyes",ctx.canvas.width/2,80);
    ctx.fillStyle = "grey";
    ctx.font = "20px 'Muli'";
    ctx.fillText("When Two Paths Meet.",ctx.canvas.width/2,110);
    ctx.fillText("[Press Enter to begin]",ctx.canvas.width/2,ctx.canvas.height-45);
    ctx.textAlign = "start";
    if (enterpress && alpha === 0) {
        //START THE FIRST ROOM
        rooms[0].begin();
        spamcatch = 7;
        gameStart = true;
        alphaexecute = "play";
    }
}

//WRITE GAMEOVER SCREEN
var doGameOverScreen = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px 'Muli'";
    ctx.textAlign = "center";
    ctx.fillText("Game Over...",ctx.canvas.width/2,80);
    ctx.fillStyle = "grey";
    ctx.font = "20px 'Muli'";
    ctx.fillText("They fell then and there, and it was finished.",ctx.canvas.width/2,110);
    ctx.fillText("[Press Enter to reload]",ctx.canvas.width/2,ctx.canvas.height-45);
    ctx.textAlign = "start";
    if (enterpress && player.hp === 0) {
        location.reload();
    }
}

//DRAW STATS
var drawUI = function() {
    //BG
    ctx.fillStyle = "#0B0A07";
    ctx.strokeStyle = "#373634";
    ctx.fillRect(ctx.canvas.width-210,10,200,100);
    ctx.strokeRect(ctx.canvas.width-210,10,200,100);
    
    //PLAYAS
    ctx.fillStyle = "white";
    ctx.font = "20px 'Muli'";
    if (curroom.playas === characters.boyM) {
        ctx.fillText("Matt | Lv. " + player.lv,ctx.canvas.width-200,35);
    } else {
        ctx.fillText("Emily | Lv. " + player.lv,ctx.canvas.width-200,35);
    }
    
    //HEALTH
    ctx.fillStyle = "#ffb3b3";
    ctx.fillRect(ctx.canvas.width-172,50,150,9);
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red"
    ctx.strokeRect(ctx.canvas.width-172,50,150,9);
    if (player.hp > 0) { ctx.fillRect(ctx.canvas.width-172,50,player.hp*(3/player.lv),9); }
    ctx.fillStyle = "white";
    ctx.font = "15px 'Muli'";
    ctx.fillText("HP",ctx.canvas.width-200,60);
    
    //POWER // MANA // ENERGY
    if (curroom.playas === characters.boyM) {
        var filltot = "#78c0e0";
        var fillact = "#1e90ff";
        var txt = "MP";
    } else if (curroom.playas === characters.girlE) {
        var filltot = "#f770c4";
        var fillact = "#f433ab";
        var txt = "EP";
    }
    ctx.fillStyle = filltot;
    ctx.fillRect(ctx.canvas.width-172,70,150,9);
    ctx.fillStyle = fillact;
    ctx.strokeStyle = fillact;
    ctx.strokeRect(ctx.canvas.width-172,70,150,9);
    if (player.power > 0) { ctx.fillRect(ctx.canvas.width-172,70,player.power*1.5,9); }
    ctx.fillStyle = "white";
    ctx.font = "15px 'Muli'";
    ctx.fillText(txt,ctx.canvas.width-200,80);
    
    //XP
    ctx.fillStyle = "lightyellow";
    ctx.fillRect(ctx.canvas.width-172,90,150,9);
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(ctx.canvas.width-172,90,150,9);
    ctx.fillRect(ctx.canvas.width-172,90,(player.xp*1.5)/player.lv,9);
    ctx.fillStyle = "white";
    ctx.font = "15px 'Muli'";
    ctx.fillText("XP",ctx.canvas.width-200,100);
}

/*#f433ab
#f65bbb
#f770c4
#1e90ff
#0eb1d2
#78c0e0*/