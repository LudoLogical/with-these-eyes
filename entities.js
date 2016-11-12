//ENTITIES SETUP
class Entity {
    constructor(x,y,w,h,sprite) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sprite = new Image();
        this.sprite.src = sprite;
    }
    draw() {
        ctx.drawImage(this.sprite,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
    }
    update() {
        this.draw();
    }
}

//ENEMY SETUP
class Enemy extends Entity {
    constructor(x,y,w,h,sprite,spd,atk,dmg) {
        super(x,y,w,h,sprite);
        this.spd = spd;
        this.atk = atk; //contact
        this.dmg = dmg; //bullet
    }
}

//CHARACTER SETUP
class Character extends Entity {
    constructor(x,y,w,h,spriteleft,spriteright,spritespeak,spd) {
        super(x,y,w,h);
        this.movedir = "";
        this.movecount = 0;
        this.afteraction = "";
        this.face = "l";
        this.spd = spd;
        this.spriteleft = new Image();
        this.spriteleft.src = spriteleft;
        this.spriteright = new Image();
        this.spriteright.src = spriteright;
        this.spritespeak = new Image();
        this.spritespeak.src = spritespeak;
    }
    updatePos() {
        if (this.movecount > 0) {
            if (this.movedir === "up") {
                this.y -= this.spd;
            } else if (this.movedir === "down") {
                this.y += this.spd;
            } else if (this.movedir === "left") {
                this.x -= this.spd;
                this.face = "l";
            } else if (this.movedir === "right") {
                this.x += this.spd;
                this.face = "r";
            }
            this.movecount --;
        } else {
            resolveAction(this);
        }
        
    }
    draw() {
        if (this.face === "l") {
            ctx.drawImage(this.spriteleft,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
        } else if (this.face === "r") {
            ctx.drawImage(this.spriteright,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
        }
    }
    update() {
        this.updatePos();
        this.draw();
    }
}

//PLAYER SETUP
class Player extends Character {
    constructor(x,y,w,h,spriteleft,spriteright,spritespeak,spd) {
        super(x,y,w,h,spriteleft,spriteright,spritespeak,spd);
        this.hp = 50;
        this.power = 100;
        this.xp = 0;
        this.gold = 0;
        this.lv = 1;
        this.aimangle = 0;
        this.dmg = 1;
    }
    doAttack() {
        var id = Math.random();
        playerBullets[id] = new Bullet(player,10,10,"img/test/test_entity.png","plyr",80,4); //80f = 2 sec
        console.log(playerBullets);
    }
    testmobility() {
        var canMove = true;
        for (var f in curroom.fixed_areas) {
            if (testcollisionrect(player,curroom.fixed_areas[f])) {
                canMove = false;
            }
        }
        return canMove;
    }
    updatePos() {
        if (wpress && this.y >= this.spd) {
            this.y -= this.spd;
            if (this.testmobility() === false) {
                this.y += this.spd;
            }
        }
        if (apress && this.x >= this.spd) {
            this.x -= this.spd;
            if (this.testmobility() === false) {
                this.x += this.spd;
            }
        }
        if (spress && this.y <= curroom.map.h-this.spd-player.h) {
            this.y += this.spd;
            if (this.testmobility() === false) {
                this.y -= this.spd;
            }
        }
        if (dpress && this.x <= curroom.map.w-this.spd-player.w) {
            this.x += this.spd;
            if (this.testmobility() === false) {
                this.x -= this.spd;
            }
        }
    }
    draw() {
        if (lastpress === "a") {
            ctx.drawImage(this.spriteleft,ctx.canvas.width / 2 - player.w / 2, ctx.canvas.height / 2 - player.h / 2, player.w, player.h);
        } else if (lastpress === "d") {
            ctx.drawImage(this.spriteright,ctx.canvas.width / 2 - player.w / 2, ctx.canvas.height / 2 - player.h / 2, player.w, player.h);
        }
    }
    update() {
        if (writing === false) {
            this.updatePos();
        }
        this.draw();
    }
}

//ENTITY CREATION
var player = new Player(215,220,33,45,"img/sprites/boy_left.png","img/sprites/boy_right.png","img/sprites/boy_speak.png",5);
var characters = {
    boyM: new Character(-500,-500,33,45,"img/sprites/boy_left.png","img/sprites/boy_right.png","img/sprites/boy_speak.png",5),
    girlE: new Character(252,220,33,45,"img/sprites/girl_left.png","img/sprites/girl_right.png","img/sprites/girl_speak.png",5),
    door: new Character(-500,-500,40,80,"img/sprites/door_action.png","img/sprites/door_action.png","img/sprites/door_speak.png",0),
};
var wasd = {
    w: new Entity(player.x+1.5,player.y-35,30,30,"img/controls/w.png"),
    a: new Entity(player.x-35,player.y+7.5,30,30,"img/controls/a.png"),
    s: new Entity(player.x+1.5,player.y+50,30,30,"img/controls/s.png"),
    d: new Entity(player.x+38,player.y+7.5,30,30,"img/controls/d.png"),
};