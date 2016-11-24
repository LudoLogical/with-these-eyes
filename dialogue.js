//GENERAL VARS
var towrite = [];
var written = ["","",""];
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
            line_animID = [0,0];
            written = ["","",""];
            if (towrite[writingID + 1]) {
                writingID ++;
                spamcatch = 7;
                if (towrite[writingID][4]) {
                    doAction(towrite[writingID][4]);
                }
            } else {
                writing = false;
                towrite = [];
                writingID = 0;
            }
        } else if (line_animID[0] != 2 || written[2].length < towrite[writingID][3].length) {
            if (line_animID[0] != 2 && written[line_animID[0]].length >= towrite[writingID][line_animID[0]+1].length) {
                line_animID[0] ++;
                line_animID[1] = 0;
            }
            if (towrite[writingID][line_animID[0]+1] != "") {
                written[line_animID[0]] = written[line_animID[0]] + towrite[writingID][line_animID[0]+1][line_animID[1]];
            }
            line_animID[1] ++;
        }
    } else if (alltext) {
        writing = true;
        towrite = alltext;
    }
};

//PREFORM ACTION FROM DODIALOGUE
var doAction = function(actorlist) {
    //[character/object, action to perform, time to perform, action after performed]
    if (actorlist[1] === "left" || actorlist[1] === "right" || actorlist[1] === "up" || actorlist[1] === "down") {
        actorlist[0].movedir = actorlist[1];
        actorlist[0].movecount = actorlist[2];
        actorlist[0].afteraction = actorlist[3];
        textlock = true;
    } else if (actorlist[1] === "play") {
        fadeIn(actorlist[0],2000);
    } else if (actorlist[1] === "fade") {
        fadeOut(2000);
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