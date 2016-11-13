var playerBullets = [];
var enemyBullets = [];

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
            this.sprite.src = "img/sprites/snowball.png";
        } else if (source.bullet_type === "tear") {
            this.sprite.src = "img/sprites/tears.png";
        } else if (source.bullet_type === "shovel") {
            this.sprite.src = "img/sprites/shovel.png";
        } else {
            this.sprite.src = "img/sprites/fireball.PNG";
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
        if (this.x+this.spdX < 0 || this.x+this.spdX > curroom.map.w-this.w) {
            this.removeMark = true;
        }
        if (this.y+this.spdY < 0 || this.y+this.spdY > curroom.map.h-this.h) {
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
            for (var e in curroom.enemies) {
                if (testcollisionrect(this,curroom.enemies[e])) {
                    curroom.enemies[e].hp -= this.dmg;
                    this.removeMark = true;
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