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

//DOCUMENT FUNCTIONS SETUP
document.onkeydown = function (e) {
    if (e.keyCode === 87) { //w
        wpress = true;
    } else if (e.keyCode === 65) { //a
        apress = true;
        if (writing === false) {
            lastpress = "a";
        }
    } else if (e.keyCode === 83) { //s
        spress = true;
    } else if (e.keyCode === 68) { //d
        dpress = true;
        if (writing === false) {
            lastpress = "d";
        }
    } else if (e.keyCode === 13) { //enter
        enterpress = true;
    }

    if ((e.keyCode === 87 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68) && writing === false) {
        moved = true;
    }
};

//MOVE VAR RESET
document.onkeyup = function (e) {
    //This is basically an extended if else function. Use break after every action.
    //Switch just matches e.keyCode to every case. If it finds a case, it will
    //Execute the following code block. If switch encounters break within that code
    //block, it will end the switch statement.
    switch(e.keyCode){
        case 87:
            wpress=true;
            break;
        case 65:
            apress=true;
            break;
        case 83:
            spress=true;
            break;
        case 68:
            dpress=true;
            break;
        case 13:
            enterpress=false;
            break;
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

document.onclick = function(mouse) {
    if (!writing&&gameStart&&player.hp>0) {
        player.doAttack();
        console.log(player.aimangle);
    }
};
