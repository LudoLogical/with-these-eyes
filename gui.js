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
    ctx.fillText("Headphones recommended.",ctx.canvas.width/2,110);
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

//DO PAUSE SCREEN
var doPauseScreen = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px 'Muli'";
    ctx.textAlign = "center";
    ctx.fillText("Game Paused",ctx.canvas.width/2,80);
    ctx.fillStyle = "grey";
    ctx.font = "20px 'Muli'";
    ctx.fillText("Options and restbit.",ctx.canvas.width/2,110);
    ctx.fillText("[Press Enter to close]",ctx.canvas.width/2,ctx.canvas.height-45);
    ctx.textAlign = "start";
    ctx.fillText("Music volume: ",ctx.canvas.width/2 - 200,250);
    ctx.fillText("SFX volume: ",ctx.canvas.width/2 - 200,280);
    ctx.fillText("Dialogue speed: ",ctx.canvas.width/2 - 200,310);
    ctx.textAlign = "end";
    ctx.fillStyle ="white";
    ctx.fillText(musicVol*10 + "%",ctx.canvas.width/2 + 150,250);
    ctx.fillText(sfxVol*10 + "%",ctx.canvas.width/2 + 150,280);
    switch(talkSpd) {
        case 1:
            ctx.fillText("Fast",ctx.canvas.width/2 + 150,310);
            break;
        case 2:
            ctx.fillText("Medium",ctx.canvas.width/2 + 150,310);
            break;
        case 3:
            ctx.fillText("Slow",ctx.canvas.width/2 + 150,310);
            break;
        default:
            ctx.fillText("ERROR",ctx.canvas.width/2 + 150,310);
            console.log("ERR: TALKSPD NOT ACCEPTABLE.");
            break;
    }
    ctx.fillStyle = "green";
    ctx.fillRect(ctx.canvas.width/2 + 155,250-17.5,20,20);
    ctx.fillRect(ctx.canvas.width/2 + 155,280-17.5,20,20);
    ctx.fillRect(ctx.canvas.width/2 + 155,310-17.5,20,20);
    ctx.fillStyle = "red";
    ctx.fillRect(ctx.canvas.width/2 + 180,250-17.5,20,20);
    ctx.fillRect(ctx.canvas.width/2 + 180,280-17.5,20,20);
    ctx.fillRect(ctx.canvas.width/2 + 180,310-17.5,20,20);
    ctx.textAlign = "start";
    if (enterpress && spamcatch < 1) {
        paused = false;
    }
}

//DIALOGUE VARS
var towrite = [];
var written = ["","",""];
var spacer = 0;
var line_animID = [0,0]; //line,letter
var writing = false;
var writingID = 0;
var spamcatch = 0;
var textlock = false;
var cont = new Image();
cont.src = "img/controls/cont.png";

//DISPLAY DIALOGUE ON SCREEN
var doDialogue = function(alltext) {
    if (writing === true) {
        //DRAW DIALOGUE
        ctx.fillStyle = "#0B0A07";
        ctx.fillRect(ctx.canvas.width/2 - 200,ctx.canvas.height - 125,400,100);
        ctx.strokeStyle = "#373634";
        ctx.strokeRect(ctx.canvas.width/2 - 200,ctx.canvas.height - 125,400,100);
        ctx.fillStyle = "white";
        ctx.fillRect(ctx.canvas.width/2 - 200 + 12.5,ctx.canvas.height - 125 + 12.5,75,75);
        ctx.drawImage(towrite[writingID][0].spritespeak,ctx.canvas.width/2 - 200 + 12.5,ctx.canvas.height - 125 + 12.5,75,75);
        ctx.font = "20px 'Muli'";
        ctx.fillText(written[0],ctx.canvas.width/2 - 100,ctx.canvas.height-93);
        ctx.fillText(written[1],ctx.canvas.width/2 - 100,ctx.canvas.height-68);
        ctx.fillText(written[2],ctx.canvas.width/2 - 100,ctx.canvas.height-43);
        if (textlock === false && line_animID[0] === 2  && written[2].length === towrite[writingID][3].length) {
            ctx.drawImage(cont,ctx.canvas.width/2 + 200 + 12.5,ctx.canvas.height - 90,30,30);
        }
        
        //CHECK FOR ADVANCE OR FINISH
        if (enterpress && spamcatch < 1 && textlock === false && line_animID[0] === 2  && written[2].length === towrite[writingID][3].length) {
            //BEGIN NEXT SECTION OF DIALOGUE IF DONE SCROLLING AND ENTER AND NOT MOVING CHARACTERS
            line_animID = [0,0];
            written = ["","",""];
            if (towrite[writingID + 1]) {
                //RUN IF THERE'S MORE DIALOGUE TO WRITE
                writingID ++;
                spamcatch = 7;
                if (towrite[writingID][4]) {
                    //TO ACTION HANDLER
                    doAction(towrite[writingID][4]);
                }
            } else {
                //IF WRITING IS DONE
                writing = false;
                towrite = [];
                writingID = 0;
            }
        } else if (line_animID[0] != 2 || written[2].length < towrite[writingID][3].length) { //IF STILL SCROLLING TEXT ON
            if (line_animID[0] != 2 && written[line_animID[0]].length >= towrite[writingID][line_animID[0]+1].length) { //ADVANCE SCROLLING LINE
                line_animID[0] ++;
                line_animID[1] = 0;
            }
            if (towrite[writingID][line_animID[0]+1] != "" && spacer <= 0) { //ADD LETTER
                written[line_animID[0]] = written[line_animID[0]] + towrite[writingID][line_animID[0]+1][line_animID[1]];
                if (written[line_animID[0]][line_animID[1]] != " " && written[line_animID[0]][line_animID[1]] != "." && written[line_animID[0]][line_animID[1]] != "!" && written[line_animID[0]][line_animID[1]] != "?") {
                    doSFX(towrite[writingID][0].speak);
                }
                line_animID[1] ++;
                spacer = talkSpd;
            }
        }
    } else if (alltext) { //RECEIVE INPUT
        writing = true;
        towrite = alltext;
    }
    //DECREASE SPACER (SLOWS SCROLLING)
    spacer --;
};