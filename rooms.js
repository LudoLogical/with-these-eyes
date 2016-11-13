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
    constructor(w,h,mapsprite,playas,playerx,playery,finx,finy,finw,finh,musicstart,nextLV,character_imp,dialoguestart,enemies,fixed_areas) {
        this.map = new Map(w,h,mapsprite);
        this.playas = playas;
        this.playerx = playerx;
        this.playery = playery;
        this.fin = new Entity(finx,finy,finw,finh);
        this.musicstart = musicstart;
        this.nextLV = nextLV;
        this.character_imp = character_imp;
        this.dialoguestart = dialoguestart;
        this.enemies = enemies;
        this.fixed_areas = fixed_areas;
    }
    setPlayerInfo(x,y) {
        player.norm[0] = this.playas.norm[0];
        player.norm[1] = this.playas.norm[1];
        player.anim[0] = this.playas.anim[0];
        player.anim[1] = this.playas.anim[1];
        player.spritespeak = this.playas.spritespeak;
        player.x = x;
        player.y = y;
    }
    begin() {
        curroom = this;
        if (!cursong) {
            cursong = this.musicstart;
            fadeIn(cursong,2000);
        }
        if (cursong && cursong != this.musicstart) {
            fadeOut(2000); 
            cursong = this.musicstart;
            fadeIn(cursong,2000);
        }
        this.setPlayerInfo(this.playerx,this.playery);
        for (var c in this.character_imp) {
            this.character_imp[c][0].x = this.character_imp[c][1];
            this.character_imp[c][0].y = this.character_imp[c][2];
            
        }
        
        characters.carpet.x = -500;
        characters.carpet.y = -500;
        doDialogue(this.dialoguestart);
    }
    checkFinish() {
        if (this.enemies.length === 0) {
            if (characters.carpet.x === -500) {
                characters.carpet.x = this.fin.x-15;
                characters.carpet.y = this.fin.y-12.5;
                if (curroom === rooms[3]) {
                    characters.deercry.x = -500;
                    characters.deercry.y = -500;
                    characters.deer.x = 360;
                    characters.deer.y = 135;
                }
            }
            if (testcollisionrect(this.fin,player)) {
                for (var c in this.character_imp) {
                    this.character_imp[c][0].x = -500;
                    this.character_imp[c][0].y = -500;
                }
                rooms[this.nextLV].begin();
            } 
        }
    }
}

var rooms = [
    new Room(500,500,"img/bg/bedroom.png",characters.boyM,215,220,485,240,15,20,songs.welcomeHome,1,
        [[characters.girlE,252,220]],
        [[characters.boyM,"It's not safe out there...","","(Press [ENTER] to advance)"],
         [characters.girlE,"I'll only be to the market,","stop worrying about","everything so much!"],
         [characters.boyM,"I can't... I can't let anything","happen to you...",""],
         [characters.girlE,"I'll be fiiiiine!","See you in a little!","",[songs.welcomeHome,"fade"]],
         [characters.boyM,"...","","",[characters.girlE,"down",5,[characters.girlE,"right",40,[characters.girlE,"up",4,[characters.girlE,"right",5,"remove"]]]]],
         [characters.boyM,"I have to keep her safe...","","",[songs.sheHasLeft,"play"]]],
        [ 
            //noenemies
        ],
        [
            new Entity(165,205,30,30),//standleft
            new Entity(305,205,35,30),//standright
        ]
    ),
    new Room(500,200,"img/bg/snow_1.png",characters.girlE,20,90,485,105,15,20,songs.adventure,2,
        [[characters.snowman,320,125],[characters.christmastree,120,15]],
        [[characters.girlE,"Let's go get some food!","",""],
         [characters.snowman,"Hello Miss!","",""],
         [characters.girlE,"Wow, a talking snowman!","What's your name?",""],
         [characters.snowman,"I'm Florence.","",""],
         [characters.girlE,"My name is Emily.","Do you know how to","get to the market?"],
         [characters.snowman,"Just pass through that door.","",""],
         [characters.girlE,"Thanks!","Wait a sec...","I don't have a key."],
         [characters.snowman,"If only there was a way","to break through...",""],
         [characters.girlE,"(Left mouse button to fire)","",""]],
        [ 
            new Enemy(460,75,40,80,"img/sprites/door_action.png","img/sprites/door_action.png",0,0,1,1,1,7000),//door
        ],
        [
            //no fixed_areas
        ]
    ),
    new Room(500,200,"img/bg/snow_1.png",characters.boyM,20,90,485,105,15,20,songs.adventure,3,
        [[characters.christmastree,120,15]],
        [[characters.boyM,"Emily, come back!","",""],
         [characters.boyM,"Hey, who are you?","",""],
         [characters.snowman,"I'm Florence.","Nice to meet you!",""],
         [characters.boyM,"I'm Matt.","What are you doing","outside my house?"],
         [characters.snowman,"I was built here.","I can't move.",""],
         [characters.boyM,"Well, you need to go.","You're messing up","my front yard."],
         [characters.snowman,"I was here first!","",""]],
        [
            new Enemy(320,125,27.5,45,"img/sprites/snowman_bad_1.png","img/sprites/snowman_bad_2.png",0,0,1,1,1,100,true),//snowman
        ],
        [
            //no fixed_areas
        ]
    ),
    new Room(500,200,"img/bg/snow_2.png",characters.girlE,20,60,485,75,15,20,songs.adventure,0,
        [[characters.deercry,360,135],[characters.deer,-500,-500],[characters.tree,80,140]],
        [[characters.deercry,"...Stupid...lights...","",""],
         [characters.girlE,"Hello!","",""],
         [characters.deercry,"Oh, hey.","",""],
         [characters.girlE,"I'm Emily.","What's your name?",""],
         [characters.deercry,"I am Chris Mas Eve, the deer.","",""],
         [characters.girlE,"It's nice to meet you, Chris.","Do you know how to","get to the market?"],
         [characters.deercry,"It's just a little further forward.","Could you help break me free?","My antlers are caught."],
         [characters.girlE,"Of course!","",""]],
        [
            new Enemy(360,125,60,60,"img/sprites/lights_tree_1.PNG","img/sprites/lights_tree_2.PNG",0,0,1,1,1,100,false),//lights_tree
        ],
        [
            //no fixed_areas
        ]
    ),
];
