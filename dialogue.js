//GENERAL VARS
var towrite = [];
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
        ctx.fillText(towrite[writingID][1],ctx.canvas.width/2 - 100,ctx.canvas.height-93);
        ctx.fillText(towrite[writingID][2],ctx.canvas.width/2 - 100,ctx.canvas.height-68);
        ctx.fillText(towrite[writingID][3],ctx.canvas.width/2 - 100,ctx.canvas.height-43);
        ctx.drawImage(cont,ctx.canvas.width/2 + 200 + 12.5,ctx.canvas.height - 100,30,50);
        
        //CHECK FOR ADVANCE OR FINISH
        if (enterpress && spamcatch < 1 && textlock === false) {
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
    } else if (actor.afteraction[1]) {
        doAction(actor.afteraction);
    }
}