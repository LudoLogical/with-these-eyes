//AUDIO VARS
var cursong = false;
var cureffect = false;
var cursongcount = 0;

//MUSIC SETUP
class Song {
    constructor(src,resetTime) {
        this.audio = new Audio(src);
        this.audio.volume = 0;
        this.resetTime = resetTime;
    }
}

//STX SETUP
class Sound {
    constructor(src,volume) {
        this.audio = new Audio(src);
        this.audio.volume = volume;
        this.maxvolume = volume;
    }
}

//ENTITIES SETUP
class Entity {
    constructor(x,y,w,h,sprite,track) { //sprite can also be used for alty in small collisions
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        if (isNaN(sprite) && sprite) {
            this.sprite = new Image();
            this.sprite.src = sprite;
        } else {
            this.alty = sprite;
        }
        this.track = track;
    }
    draw() {
        ctx.drawImage(this.sprite,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
    }
    update() {
        if (this.track) {
            this.x = player.x+5.5;
            this.y = player.y-35;
        }
        this.draw();
    }
}

//DIRECTENTITY SETUP (OVERRIDE DRAW FOR ABSOLUTE POS)
class Direct extends Entity {
    constructor(x,y,w,h,sprite) {
        super(x,y,w,h);
        this.sprite = new Image();
        this.sprite.src = sprite;
    }
    draw() {
        ctx.drawImage(this.sprite,this.x,this.y,this.w,this.h);
    }
}

//BULLET VARS
var playerBullets = [];
var enemyBullets = [];

//BULLET SETUP
class Bullet extends Entity {
    constructor(source,w,h,type,dur,spd,dmg) {
        super(source.x,source.y,w,h);
        this.sprite = new Image();
        this.type = type;
        this.dur = dur;
        this.removeMark = false;
        var angle = source.aimangle;
        this.spdX = Math.cos(angle)*(spd); //these values can be negative as they are; only use +spd
        this.spdY = Math.sin(angle)*(spd); //removed from sample code to measure only in radians
        this.dmg = source.dmg;
        this.x -= (this.w/2);
        this.y -= (this.h/2);
        this.x += (source.w/2);
        this.y += (source.h/2);
        if (source.bullet_type === "snow") {
            this.sprite.src = "img/bullets/snowball.png";
        } else if (source.bullet_type === "tear") {
            this.sprite.src = "img/bullets/tears.png";
        } else if (source.bullet_type === "shovel") {
            this.sprite.src = "img/bullets/shovel.png";
        } else {
            this.sprite.src = "img/bullets/fireball.png";
        }
    }
    testmobility() {
        var canMove = true;
        for (var f in curroom.fixed_areas) {
            if (testcollisionrect(this,curroom.fixed_areas[f])) {
                canMove = false;
            }
        }
        return canMove;
    }
    updatePos() {
        //CAN NOT BOUNCE OFF EDGES OF MAP
        if (this.x+this.spdX < 0 || this.x+this.spdX > curroom.map.w-this.w+5) { //to allow door to be hit
            this.removeMark = true;
        }
        if (this.y+this.spdY < 0 || this.y+this.spdY > curroom.map.h-this.h+5) { //to allow door to be hit
            this.removeMark = true;
        }
        
        //UPDATE POS
        this.x += this.spdX;
        this.y += this.spdY;
        
        //BULLETS CAN NOT MOVE THROUGH FIXED_AREAS
        if (this.testmobility() === false) {
            this.x -= this.spd;
            this.y -= this.spd;
            this.removeMark = true;
        }
    }
    update() {
        if (this.type === "plyr") {
            for (var e in curobjs) {
                if (curobjs[e] instanceof Enemy) {
                    if (testcollisionrect(this,curobjs[e])) {
                        curobjs[e].hp -= this.dmg;
                        this.removeMark = true;
                    }
                }
            }
        } else if (this.type === "enmy") {
            if (testcollisionrect(this,player)) {
                player.hp -= this.dmg;
                this.removeMark = true;
            }
        }
        this.updatePos();
        this.draw();
        this.dur--;
        if (this.dur <= 0) {
            this.removeMark = true;
        }
    }
}

//ENEMY SETUP
class Enemy extends Entity {
    constructor(x,y,w,h,standY,spritenorm,spriteanim,spdX,spdY,hp,atk,dmg,xp,bullet_type) {
        super(x,y,w,h);
        this.standY = standY;
        this.spritenorm = new Image();
        this.spriteanim = new Image();
        this.spritenorm.src = spritenorm;
        this.spriteanim.src = spriteanim;
        this.track = "norm";
        this.animcount = 15;
        this.spdX = spdX;
        this.spdY = spdY;
        this.hp = hp;
        this.atk = atk; //contact
        this.dmg = dmg; //bullet
        this.actcount = 80;
        this.aimangle = 0;
        this.xp = xp;
        this.bullet_type = bullet_type;
        this.removeMark = false;
    }
    doAttackCheck() {
        if (this.actcount <= 0 && writing === false && this.bullet_type) {
            this.actcount = 80;
            //TRIG TO CALCULATE SPEEDS IN COMPONENT DIRECTIONS
            var dy = (player.y + (player.h/2))-(this.y + (this.h/2));
            var dx = (player.x + (player.w/2))-(this.x + (this.w/2));
            this.aimangle = Math.atan2(dy,dx);
            enemyBullets.push(new Bullet(this,8,8,"enmy",60,6,this.dmg)); //60f = 1.5 sec
        }
        this.actcount--;
    }
    anim_check() {
        if (this.animcount <= 0) {
            if (this.track === "norm") {
                this.track = "anim";
            } else {
               this.track = "norm";
            }
            this.animcount = 15;
        }
        this.animcount--;
        
    }
    updatePos() {
        if (this.x <= 0 || this.x >= curroom.map.w - this.w) {
            this.spdX = -this.spdX;
            this.spdY = -this.spdY;
        }
        this.x += this.spdX;
        this.y += this.spdY;
    }
    draw() {
        if (this.track === "norm") {
            ctx.drawImage(this.spritenorm,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
        } else {
            ctx.drawImage(this.spriteanim,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
        }
    }
    update() {
        if (this.hp <= 0) {
            this.removeMark = true;
        }
        this.doAttackCheck();
        this.anim_check();
        this.updatePos();
        this.draw();
    }
}

//CHARACTER SETUP
class Character extends Entity {
    constructor(x,y,w,h,standY,passable,spd,spriteleft,spriteright,spritespeak,spriteleft_anim,spriteright_anim,speak) {
        super(x,y,w,h);
        this.standY = standY;
        this.passable = passable;
        this.movedir = "";
        this.movecount = 0;
        this.afteraction = "";
        this.face = 0; //0-left, 1-right
        this.spd = spd;
        this.norm = [new Image(), new Image()];
        this.anim = [new Image(), new Image()];
        this.track = "norm";
        if (spriteright === "same") {
            spriteright = spriteleft;
        }
        if (spriteright_anim === "same") {
            spriteright_anim = spriteleft_anim;
        }
        this.norm[0].src = spriteleft;
        this.norm[1].src = spriteright;
        if (spriteleft_anim && spriteright_anim) {
            this.anim[0].src = spriteleft_anim;
            this.anim[1].src = spriteright_anim;
        } else {
            this.anim[0].src = spriteleft;
            this.anim[1].src = spriteright;
        }
        if (spritespeak != "none") {
            this.spritespeak = new Image();
            this.spritespeak.src = spritespeak;
        }
        this.animcount = 15;
        this.speak = speak;
    }
    anim_check() {
        if (this.animcount <= 0) {
            if (this.track === "norm") {
                this.track = "anim";
            } else {
               this.track = "norm";
            }
            this.animcount = 15;
        }
        this.animcount--;
        
    }
    updatePos() {
        if (this.movecount > 0) {
            if (this.movedir === "up") {
                this.y -= this.spd;
            } else if (this.movedir === "down") {
                this.y += this.spd;
            } else if (this.movedir === "left") {
                this.x -= this.spd;
                this.face = 0;
            } else if (this.movedir === "right") {
                this.x += this.spd;
                this.face = 1;
            }
            this.movecount --;
        } else if (this.afteraction != "") {
            resolveAction(this);
        }
        
    }
    draw() {
        if (this.track === "norm") {
            if (this.face === 0) {
                ctx.drawImage(this.norm[0],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            } else if (this.face === 1) {
                ctx.drawImage(this.norm[1],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            }
        } else {
            if (this.face === 0) {
                ctx.drawImage(this.anim[0],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            } else if (this.face === 1) {
                ctx.drawImage(this.anim[1],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            }
        }
        
    }
    update() {
        this.anim_check();
        this.updatePos();
        this.draw();
    }
}

//PLAYER SETUP
class Player extends Character {
    constructor(x,y,w,h,standY,passable,spriteleft,spriteright,spritespeak,spd,spriteleft_anim,spriteright_anim) {
        super(x,y,w,h,standY,passable,spriteleft,spriteright,spritespeak,spd,spriteleft_anim,spriteright_anim);
        this.hp = 50;
        this.maxhp = 50;
        this.power = 100;
        this.maxpower = 100;
        this.xp = 0; //levelup = 100xp * curlevel
        this.gold = 0;
        this.lv = 1;
        this.aimangle = 0;
        this.dmg = 1;
    }
    doAttack() {
        this.power -= 50;
        playerBullets.push(new Bullet(this,8,8,"plyr",60,6,this.dmg)); //60f = 1.5 sec
    }
    testmobility() {
        var canMove = true;
        for (var f in curroom.fixed_areas) {
            if (curroom.fixed_areas[f].alty && this.y+this.h > curroom.fixed_areas[f].y+curroom.fixed_areas[f].h) {
                if (testcollisionrect(this,curroom.fixed_areas[f],"line")) {
                    canMove = false;
                }
            } else if (testcollisionrect(this,curroom.fixed_areas[f])) {
                canMove = false;
            }
        }
        for (var g in curobjs) {
            if (curobjs[g] instanceof Enemy) {
                if (curobjs[g].spdX === 0 && curobjs[g].spdY === 0) {
                    if (testcollisionrect(this,curobjs[g],"perspective")) {
                        canMove = false;
                    }
                } 
            } else if (curobjs[g] instanceof Character) {
                if (testcollisionrect(this,curobjs[g],"perspective") && curobjs[g].passable === false) {
                    canMove = false;
                }
            }
        }
        if (alpha != 0) {
            canMove = false;
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
        if (spress && this.y <= curroom.map.h-this.spd-this.h) {
            this.y += this.spd;
            if (this.testmobility() === false) {
                this.y -= this.spd;
            }
        }
        if (dpress && this.x <= curroom.map.w-this.spd-this.w) {
            this.x += this.spd;
            if (this.testmobility() === false) {
                this.x -= this.spd;
            }
        }
    }
    draw() {
        if (this.track === "norm") {
            if (lastpress === "a") {
                ctx.drawImage(this.norm[0],ctx.canvas.width / 2 - this.w / 2, ctx.canvas.height / 2 - this.h / 2, this.w, this.h);
            } else if (lastpress === "d") {
                ctx.drawImage(this.norm[1],ctx.canvas.width / 2 - this.w / 2, ctx.canvas.height / 2 - this.h / 2, this.w, this.h);
            }
        } else {
            if (lastpress === "a") {
                ctx.drawImage(this.anim[0],ctx.canvas.width / 2 - this.w / 2, ctx.canvas.height / 2 - this.h / 2, this.w, this.h);
            } else if (lastpress === "d") {
                ctx.drawImage(this.anim[1],ctx.canvas.width / 2 - this.w / 2, ctx.canvas.height / 2 - this.h / 2, this.w, this.h);
            }
        }
    }
    update() {
        if (this.xp >= this.lv*100) {
            this.xp -= this.lv*100;
            this.lv ++;
            this.maxhp += 50;
            this.maxpower += 50;
            this.hp = this.maxhp;
            this.power = this.maxpower;
            this.dmg ++;
        }
        this.anim_check();
        if (writing === false) {
            this.updatePos();
        }
        this.draw();
        if (this.power < this.maxpower) {
            this.power ++;
        }
    }
}

//MAP SETUP
class Map extends Entity {
    constructor(w,h,sprite) {
        super(0,0,w,h,sprite);
    }
    draw() {
        ctx.drawImage(this.sprite,(ctx.canvas.width / 2 - player.w / 2) - player.x,(ctx.canvas.height / 2 - player.h / 2) - player.y,this.w,this.h);
    }
}

//ROOM VARS
var curroom = false;
var curobjs = [];

//ROOM SETUP
class Room {
    constructor(w,h,mapsprite,playas,playerx,playery,finx,finy,finw,finh,musicstart,nextLV,character_imp,dialoguestart,enemies,fixed_areas) {
        this.map = new Map(w,h,mapsprite);
        this.playas = playas;
        this.playerx = playerx;
        this.playery = playery;
        this.fin = new Entity(finx,finy,finw,finh);
        this.fin.standY = 0;
        this.musicstart = musicstart;
        this.nextLV = nextLV;
        this.character_imp = character_imp;
        this.dialoguestart = dialoguestart;
        this.enemies = enemies;
        this.fixed_areas = fixed_areas;
    }
    setPlayerInfo() {
        player.norm[0] = this.playas.norm[0];
        player.norm[1] = this.playas.norm[1];
        player.anim[0] = this.playas.anim[0];
        player.anim[1] = this.playas.anim[1];
        player.spritespeak = this.playas.spritespeak;
        player.x = this.playerx;
        player.y = this.playery;
        player.w = this.playas.w;
        player.h = this.playas.h;
        // opt. width and height adjustments for characters
    }
    begin() {
        curroom = this;
        
        this.setPlayerInfo();
        for (var c in this.character_imp) {
            this.character_imp[c][0].x = this.character_imp[c][1];
            this.character_imp[c][0].y = this.character_imp[c][2];
            curobjs.push(this.character_imp[c][0]);
        }
        
        if (curroom === rooms[7]) {
            characters.girlE.face = 0;
        }
        
        for (var en in this.enemies) {
            curobjs.push(this.enemies[en])
        }
        
        curobjs.push(player);
        
        characters.carpet.x = -500;
        characters.carpet.y = -500;
        
        alpha = 60;
    }
    checkFinish() {
        var areEnemies = false;
        for (var j in curobjs) {
            if (curobjs[j] instanceof Enemy) {
                areEnemies = true;
            }
        }
        if (!areEnemies) {
            if (characters.carpet.x === -500) {
                characters.carpet.x = this.fin.x-15;
                characters.carpet.y = this.fin.y-12.5;
                if (curroom === rooms[3]) {
                    characters.deercry.x = -500;
                    characters.deercry.y = -500;
                    characters.deer.x = 360;
                    characters.deer.y = 130;
                }
            }
            if (testcollisionrect(this.fin,player,"perspective")) {
                if (cursong && cursong != rooms[this.nextLV].musicstart) {
                    fadeOut(2000);
                }
                
                alphamethod = "out";
                alphaexecute = "load";
            } 
        }
    }
}