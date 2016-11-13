//ROOM VAR SETUP
var curroom = false;

//MAP SETUP
class Map extends Entity {
    constructor(w,h,sprite) {
        super(0,0,w,h,sprite);
    }
    draw() {
        ctx.drawImage(this.sprite,(ctx.canvas.width / 2 - player.w / 2) - player.x,(ctx.canvas.height / 2 - player.h / 2) - player.y,this.w,this.h);
    }
}

//ROOM SETUP
class Room {
    constructor(w,h,mapsprite,playas,playerx,playery,finx,finy,finw,finh,musicstart,nextLV,dialoguestart,enemies,fixed_areas) {
        this.map = new Map(w,h,mapsprite);
        this.playas = playas;
        this.playerx = playerx;
        this.playery = playery;
        this.fin = new Entity(finx,finy,finw,finh);
        this.musicstart = musicstart;
        this.nextLV = nextLV;
        this.dialoguestart = dialoguestart;
        this.enemies = enemies;
        this.fixed_areas = fixed_areas;
    }
    setPlayerInfo(x,y) {
        player.spriteleft = this.playas.spriteleft;
        player.spriteright = this.playas.spriteright;
        player.spritespeak = this.playas.spritespeak;
        player.x = x;
        player.y = y;
    }
    begin() {
        curroom = this;
        if (cursong && cursong != this.musicstart) {
            fadeOut(2000); 
            cursong = this.musicstart;
            fadeIn(cursong,2000);
        }
        this.setPlayerInfo(this.playerx,this.playery);
        doDialogue(this.dialoguestart);
    }
    checkFinish() {
        if (testcollisionrect(this.fin,player)) {
            rooms[this.nextLV].begin();
        }
    }
}

var rooms = [
    new Room(500,500,"img/bg/bedroom_rev1.png",characters.boyM,215,220,485,240,15,20,songs.welcomeHome,1,
        [[characters.boyM,"It's not safe out there...","","(Press [ENTER] to advance)"],
         [characters.girlE,"I'll only be to the market,","stop worrying about","everything so much!"],
         [characters.boyM,"I can't... I can't let anything","happen to you...",""],
         [characters.girlE,"I'll be fiiiiine!","See you in a little!","",[songs.welcomeHome,"fade"]],
         [characters.boyM,"...","","",[characters.girlE,"down",5,[characters.girlE,"right",40,[characters.girlE,"up",3,[characters.girlE,"right",5,"remove"]]]]],
         [characters.boyM,"I have to keep her safe...","","",[songs.sheHasLeft,"play"]]],
        { 
            //noenemies
        },
        {
            standleft: new Entity(165,205,30,30),
            standright: new Entity(305,205,35,30),
        }
    ),
    new Room(500,200,"img/bg/snow-tut-1.png",characters.girlE,75,80,485,90,15,20,songs.adventure,0,
        [[characters.girlE,"Let's go get some food!","",""],
         [characters.door,"(The door can't move, but","somehow attacks you","anyway.)"],
         [characters.girlE,"It's a battle then... Let's go!","",""]],
        { 
            door: new Enemy(460,60,40,80,"img/sprites/door_action.png",0,0,1,1,1,7000),
        },
        {
            snow1: new Entity(115,20,40,35),
            snow2: new Entity(380,150,20,20),
        }
    ),
    /*new Room(r_w,r_h,"thing.png",characters.girlE,x,y,fx,fy,fw,fh,songs.adventure,0,
        [[characters.girlE,"Let's go get some food!","",""],
         [characters.door,"(The door can't move, but","somehow attacks you","anyway.)"],
         [characters.girlE,"It's a battle then... Let's go!","",""]],
        { 
            door: new Enemy(460,60,40,80,"img/sprites/door_action.png",0,0,1,1,1),
        },
        {
            snow1: new Entity(115,20,40,35),
            snow2: new Entity(380,150,20,20),
        }
    ),*/
];