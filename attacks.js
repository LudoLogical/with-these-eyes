var playerBullets = [];
var enemyBullets = [];

class Bullet extends Entity {
    constructor(source,w,h,sprite,type,dur,spd) {
        super(source.x,source.y,w,h,sprite);
        this.type = type;
        this.dur = dur;
        this.removeMark = false;
        var angle = source.aimangle;
        this.spdX = Math.cos(angle)*(spd); //these values can be negative as they are; only use +spd
        this.spdY = Math.sin(angle)*(spd); //removed from sample code to measure only in radians
        this.dmg = source.dmg;
        this.x -= (this.w/2);
        this.y -= (this.h/2);
        if (type === "plyr") {
            this.x += (player.w/2);
            this.y += (player.h/2);
        } else if (type === "enmy") {
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
        this.updatePos();
        this.draw();
        this.dur--;
        if (this.dur <= 0) {
            this.removeMark = true;
        }
    }
}