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
        }
        
        if (curroom === rooms[7]) {
            characters.girlE.face = 0;
        }
        
        characters.carpet.x = -500;
        characters.carpet.y = -500;
        
        alpha = 80;
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
                    characters.deer.y = 130;
                }
            }
            if (testcollisionrect(this.fin,player)) {
                if (cursong && cursong != rooms[this.nextLV].musicstart) {
                    fadeOut(2000);
                }
                
                alphamethod = "out";
                alphaexecute = "load";
            } 
        }
    }
}

//ROOM CREATION
var rooms = [
    new Room(500,500,"img/bg/bedroom.png",characters.boyM,222,220,485,240,15,20,songs.welcomeHome,1,
        [[characters.girlE,250,220]],
        [[characters.boyM,"It's not safe out there...","","(Press [ENTER] to advance)"],
         [characters.girlE,"I'll only be to the market,","stop worrying about","everything so much!"],
         [characters.boyM,"I can't... I can't let anything","happen to you...",""],
         [characters.girlE,"I'll be fiiiiine!","See you in a little!","",[songs.welcomeHome,"fade"]],
         [characters.boyM,"...","","",[characters.girlE,"down",5,[characters.girlE,"right",40,[characters.girlE,"up",4,[characters.girlE,"right",5,"remove"]]]]],
         [characters.boyM,"I have to keep her safe...","","",[songs.sheHasLeft,"play wasd"]]],
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
         [characters.snowman,"If only there was a way","to break through...","",[player,"mouseL"]]],
        [ 
            new Enemy(490,62,46,80,"img/characters/static/door.png","img/characters/static/door.png",0,0,1,0,0,50,false),//door
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
         [characters.boyM,"Well, you need to go.","You're messing up","my front yard.",[songs.welcomeHome,"fade"]],
         [characters.snowmanmad,"I was here first!","","",[songs.cryingWithMyHeart,"play"]]],
        [
            new Enemy(320,125,27.5,45,"img/characters/dynamic/snowman_bad_1.png","img/characters/dynamic/snowman_bad_2.png",0,0,5,2,10,100,"snow"),//snowman
        ],
        [
            //no fixed_areas
        ]
    ),
    new Room(500,200,"img/bg/snow_2.png",characters.girlE,20,60,485,75,15,20,songs.greetingsMisterDeer,4,
        [[characters.deercry,360,130],[characters.deer,-500,-500],[characters.tree,80,140]],
        [[characters.deercry,"...Stupid...lights...","",""],
         [characters.girlE,"Hello!","",""],
         [characters.deercry,"Oh, hey.","",""],
         [characters.girlE,"I'm Emily.","What's your name?",""],
         [characters.deercry,"I am Chris Mas Eve, the deer.","",""],
         [characters.girlE,"It's nice to meet you, Chris.","Do you know how to","get to the market?"],
         [characters.deercry,"It's just a little further forward.","Could you help break me free?","My antlers are caught."],
         [characters.girlE,"Of course!","",""]],
        [
            new Enemy(360,130,58,59.3,"img/characters/static/lights_tree_1.PNG","img/characters/static/lights_tree_2.PNG",0,0,1,0,0,50,false),//lights_tree
        ],
        [
            //no fixed_areas
        ]
    ),
    new Room(500,200,"img/bg/snow_2.png",characters.boyM,20,60,485,75,15,20,songs.adventure,5,
        [[characters.tree,80,140]],
        [[characters.boyM,"Emily?","...","Emily?"],
         [characters.boyM,"Ack!","Who are you?",""],
         [characters.deercry,"My name's Chris Mas Eve.","",""],
         [characters.boyM,"Wow... you're just standing","here crying...","Alone."],
         [characters.deercry,"Hey!  Don't make fun of","me when you have no idea","what I've been through!"]],
        [
            new Enemy(360,125,51,56,"img/characters/dynamic/deer_2.PNG","img/characters/dynamic/deer_2.PNG",0,0,10,4,20,300,"tear"),//evildeer
        ],
        [
            //no fixed_areas
        ]
    ),
    new Room(500,200,"img/bg/snow_3.png",characters.girlE,20,60,485,65,15,20,songs.adventure,6,
        [[characters.gnomered,452,2.5],[characters.gnomeblue,452,117.5]],
        [[characters.girlE,"Oh yay! The market.","",""],
         [characters.gnomered,"Welcome to Gnome-Mart!","We have the best deals!",""],
         [characters.girlE,"I'm looking for some veggies.","",""],
         [characters.gnomeblue,"I'm sure you'll find","what you're looking for inside.",""]],
        [
            //noenemies
        ],
        [
            new Entity(480,0,20,45),//shoptop
            new Entity(480,100,20,100),//shopbottom 
        ]
    ),
    new Room(500,200,"img/bg/snow_3.png",characters.boyM,20,60,485,65,15,20,songs.adventure,7,
       [],
       [[characters.gnomered,"Welcome to Gnome-Mart!","Would you be interested in -",""],
        [characters.boyM,"Oh no.","More salespeople","trying to rip me off."],
        [characters.gnomeblue,"On the contrary,","our deals are far","from a rip-off."],
        [characters.gnomered,"Our customers save incredible","amounts of money from","shopping at Gnome-Mart!"],
        [characters.gnomeblue,"Other markets' savings","are gnome match for ours.",""],
        [characters.boyM,"Uh huh.","Now let me through.","I'm looking for someone."],
        [characters.gnomeredmad,"So you aren't going to","buy anything?",""],
        [characters.gnomebluemad,"Well, in that case,","get out of here.",""]],
        [
            new Enemy(452,2.5,26.8,45,"img/characters/dynamic/gnomered_1.PNG","img/characters/dynamic/gnomered_2.PNG",0,0,15,6,30,100,"shovel"),//gnomered
            new Enemy(452,117.5,26.8,45,"img/characters/dynamic/gnomeblue_1.PNG","img/characters/dynamic/gnomeblue_2.PNG",0,0,15,6,30,100,"shovel"),//gnomeblue
        ],
        [
            new Entity(480,0,20,45),//shoptop
            new Entity(480,100,20,100),//shopbottom 
        ]
    ),
    new Room(500,200,"img/bg/market.png",characters.boyM,30,80,15,92.5,15,20,songs.adventure,8,
        [[characters.girlE,420,80]],
        [[characters.boyM,"Emily!","",""],
         [characters.girlE,"Oh hi Matt!","Look they've got fresh","leeks and potatoes!"],
         [characters.boyM,"Emily, you've been","so reckless.","It's dangerous out here."],
         [characters.girlE,"No it's not!","",""],
         [characters.boyM,"Are you sure?","There were so many","dangers on the way."],
         [characters.girlE,"Of course I'm sure.","Look, I'll show you!","",[characters.girlE,"left",85,"remove"]],
	     [characters.boyM,"Wait!","",""]],
        [
            //no enemies
        ],
        [
            new Entity(0,0,500,65),//insidetop
            new Entity(0,130,500,70),//insidebottom 
        ]
    ),
    new Room(500,200,"img/bg/snow_3.png",characters.girlE,485,65,15,60,15,20,songs.adventure,9,
        [[characters.boyM,485,50],[characters.lumberjack,50,65]],
        [[characters.boyM,"Ugh, this guy is","in the way.","I'll take care of it."],
         [characters.girlE,"No, wait!","Let me try.",""],
	     [characters.girlE,"Hello, sir!","",""],
         [characters.lumberjack,"Hello, miss!","Unfortunately, this road","is old."],
	     [characters.lumberjack,"My truck is stuck in","a pothole.",""],
         [characters.girlE,"Mind if we help out?","I'll see what I can do.",""],
         [characters.lumberjack,"Thank you very much, miss.","",""],
         [characters.boyM,"Hey, that was a pretty good","idea. Looks like we're gonna","get through."]],
        [
            //enemies
        ],
        [
            //no fixed_areas
        ]
    ),
    new Room(500,200,"img/bg/snow_1.png",485,105,15,90,15,20,songs.adventure,0,
        [],
        [[characters.banker,"Ah, yes, Matt and Emily.","I've been waiting for you.",""],
         [characters.girlE,"Good afternoon, Mr. Banker.",""],
	    [characters.boyM,"What are you here for?","",""],
         [characters.banker,"It has come to my attention","that your debts are underpaid.",""],
	    [characters.boyM,"Yes, we just need a few","more weeks.",""],
         [characters.banker,"I don't think so.","",""]],
        [
            //banker enemy
        ],
        [
            //no fixed_areas
        ]
),
];
