//GENERAL VARS
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
                    if (towrite[writingID][0] === characters.boyM) {
                        doSFX(sfx.boy_talk);
                    } else if (towrite[writingID][0] === characters.girlE) {
                        doSFX(sfx.girl_talk);
                    } else if (towrite[writingID][0] === characters.snowman || towrite[writingID][0] === characters.snowmanmad) {
                        doSFX(sfx.snowman_talk);
                    }
                }
                line_animID[1] ++;
                spacer = 2;
            }
        }
    } else if (alltext) { //RECEIVE INPUT
        writing = true;
        towrite = alltext;
    }
    //DECREASE SPACER (SLOWS SCROLLING)
    spacer --;
};