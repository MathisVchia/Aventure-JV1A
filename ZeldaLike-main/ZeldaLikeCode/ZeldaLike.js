class Menu extends Phaser.Scene {
    
    constructor(){
        super("Menu");
        this.start;
        this.boutonStart; // déclarer la variable ici
    }

    preload(){
        this.load.image('MenuFond', 'assets/MenuFond.png');
        this.load.image('BoutonStart', 'assets/BoutonStart.png');
    }

    create(){
        // ajouter l'image de fond
        this.add.image(0, 0, 'MenuFond').setOrigin(0, 0);

        
        // créer le bouton "BoutonStart" et l'ajouter à la scène
        this.boutonStart = this.add.image(200, 400, 'BoutonStart').setOrigin(0, 0);

        // ajouter l'interaction avec le bouton ici
        this.boutonStart.setInteractive();
        this.boutonStart.on('pointerdown', () => {
            this.startGame();
        });

        
    }

    startGame(){
        this.scene.start('chambre');
    }
}








// SCENE INTERIEUR






class Inside extends Phaser.Scene {

    constructor() {
        super("chambre");
        this.angleMob = 0;
        this.visionRange = 200;
        this.modeAggro = false;
        this.canAttack = true;
        this.canSpeak = true;
        this.camera;
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/npc.png');
        //this.load.image('mob', 'assets/mob.png');
        //this.load.image('fond 1', 'assets/fond 1.png');

    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset1' , 'assets/InsideHouse.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map1', 'maison.json');
    }

    create() {


        this.player;
        this.npc;
        this.cursorsUp;
        this.cursorsLeft;
        this.cursorsRight;
        this.cursorsDown;



        //var mob;
        //this.mob;

        //var texte
        //this.attackTxt = [
          //  "Tu attaques !"
        //];
       // this.attack = this.attackTxt[this.randomIndex];
       // this.visible;


        //var dialogue
        this.dialogue1 = [
            "Ah tu es enfin réveillé ! Je t'attendais !",
        ];
        this.dialogue2 = [
            "Maintenant que papa et maman s'ont sorti, tu vas jouer à mon petit jeu, j'ai créé pour toi un donjon dans la cave de la maison, à toi de t'y rendre !",
        ];
        this.randomIndex;
        this.dialogues;
        this.randomIndex;
        

    
        // TILED - load la map
        this.map1 = this.add.tilemap('map1');

        // TILED - load du tileset utilisé par la map dans Tiled
        this.tileset1 = this.map1.addTilesetImage('insideHouse', 'tileset1');

        // TILED - load calque de tuiles utilisés dans Tiled
        this.sol = this.map1.createLayer('solMaison', this.tileset1);
        this.decors = this.map1.createLayer('murMaison', this.tileset1);
        this.porte = this.map1.createLayer('porteMaison', this.tileset1);
        this.decorations = this.map1.createLayer('decorsMaison', this.tileset1);

        this.decors.setCollisionByProperty({ estSolide: true }); 

        


        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
            // this.nomDuMonstre = this.physics.add.group();
            // this.nomDuMonstre_Layer = this.nomDeLaVariableMap.getObjectLayer(' nomDuCalqueObjetDansTiled ');
            // this.nomDuMonstre_Layer.objects.forEach(nomDuMonstre_Layer => {
                //this.monstre_create = this.physics.add.sprite(nomDuMonstre_Layer.x + 16, nomDuMonstre_Layer.y + 16, 'mob' (=> c'est la balise que tu as mis dans le preload pour l'image de ton monstre));
                //this.monstre_create.anims.play('balise_animation_marche');
                //this.nomDuMonstre.add(this.monstre_create);
            //)};

        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
          // this.nomDuMonstre = this.physics.add.group();
          // this.nomDuMonstre_Layer = this.nomDeLaVariableMap.getObjectLayer(' nomDuCalqueObjetDansTiled ');
          // this.nomDuMonstre_Layer.objects.forEach(nomDuMonstre_Layer => {
                //this.monstre_create = this.physics.add.sprite(nomDuMonstre_Layer.x + 16, nomDuMonstre_Layer.y + 16, 'mob' (=> c'est la balise que tu as mis dans le preload pour l'image de ton monstre));
                //this.monstre_create.anims.play('balise_animation_marche');
                //this.nomDuMonstre.add(this.monstre_create);
            //)};


        // Integration du background
        //this.add.image(0, 0, 'fond 1').setOrigin(0, 0);

        
        // Create player sprite and enable physics
        this.player = this.physics.add.sprite(500, 850, 'player');
        //this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        this.npc = this.physics.add.staticSprite(700, 450, 'npc');
        //npc.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        this.mob = this.physics.add.sprite(300, 450, 'mob');
        this.mob.setCollideWorldBounds(true);


        // Create cursors object for player movement
        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')

        // Create interact button
        this.interactButton = this.input.keyboard.addKey('E');


        // Create attack button
        //this.attackButton = this.input.keyboard.addKey('SPACE');








        // Create dialogue box and text
        this.dialogueBox = this.add.graphics().setScrollFactor(0);
        this.dialogueBox.fillStyle(0x222222, 0.8);
        this.dialogueBox.fillRect(50, 50, 700, 100);
        this.dialogueText = this.add.text(100, 70, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
        this.dialogueText.setWordWrapWidth(600);


        // Set up collision between player and npc
        this.physics.add.collider(this.player, this.mob);
        this.physics.add.collider(this.player, this.npc);
        this.physics.add.collider(this.player, this.decors)


        // Set up overlap between player and npc for interaction
        this.physics.add.overlap(this.player, this.npc, this.checkSpeak.bind(this));


        // Set up overlap between player and mob for attack
        this.physics.add.overlap(this.player, this.mob, this.checkCollision.bind(this), this.showAttack);


        // Detecter la collision entre le bord du monde et le perso pour load la nouvelle map
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.on('worldbounds', (body) => {
            if (body.blocked.right) {
              this.changeLevel();
            }
          });




        this.camera = this.cameras.main.setSize(1920,1080);


        this.camera.startFollow(this.player);
            this.camera.setDeadzone(100,100);
            this.camera.setBounds(0,0,3200,3200);




        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {start : 0 , end : 0}),
            frameRate: 20,
            repeat:-1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        
        



    }






    update() {
        // Player movement
        if (this.cursorsLeft.isDown) {
            this.player.setVelocityX(-260);
            this.player.anims.play('left', true);
        }
        else if (this.cursorsRight.isDown) {
            this.player.setVelocityX(260);
            this.player.anims.play('right', true);
        }
        else if (this.cursorsUp.isDown) {
            this.player.setVelocityY(-260);
            this.player.anims.play('up', true);
        } else if (this.cursorsDown.isDown) {
            this.player.setVelocityY(260);
            this.player.anims.play('down', true);
        }
        else {
            this.player.setVelocity(0);
            this.player.anims.play('idle', true);
        }


        //if (this.player.y <= 50) {
            //this.scenelevel2();
        //};

        //Pour l'instant appuyer sur E fait apparaitre une phrase et lacher le bouton fait disparaitre la phrase. A CHANGER pour ne pas avoir a maintenir
        /*if (this.interactButton.isDown) {
            
        }
        else{
            this.noneDialogue();
        }
        
*/


        if (this.player.y <= 30){
            this.changeLevel();
        }

        //if (this.canAttack && this.attackButton.isDown) {
            //this.checkCollision();
        //}

        if (this.canSpeak && this.interactButton.isDown){
            this.checkSpeak();
        }


    }

    //FONCTIONS
    showDialogue() {
        // Show dialogue box and text
        
            this.dialogueBox.visible = true;
            this.dialogueText.setText(this.dialogue1[0]);
    
    }

    noneDialogue() {
        //Hide dialogue box when interact button is released
        this.dialogueBox.visible = false;
        this.dialogueText.setText('');
    }

    scenelevel2() {
        this.scene.start("jardin");
    }


  
    changeLevel(){
        this.player.destroy();
        this.npc.destroy();
        this.mob.destroy();
        
        this.scene.start('jardin');
    
        // Créer un nouveau joueur dans le nouveau niveau
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);
    
    
        // Mettre à jour la caméra pour suivre le joueur dans le nouveau niveau
        this.cameras.main.startFollow(this.player);
    
    }

    checkCollision() {
        this.physics.overlap(this.player, this.mob, () => {
            if (this.canAttack) {
                this.dialogueText.setText(this.attackTxt);
                this.mob.visible = false;
                this.canAttack = false;
            }
        }, null, this);

        this.physics.world.collide(this.player, this.mob, () => {
            this.canAttack = true;
        }, null, this);
    }


    checkSpeak() {
            this.canSpeak = false;
            this.dialogueBox.visible = true;
            this.dialogueText.setText(this.dialogue1[0]);
            this.time.delayedCall(3000, function () {
                this.canSpeak = true;
                this.dialogueText.setText(this.dialogue2[0]);
                this.time.delayedCall(5000, function () {
                    this.canSpeak = true;
                    this.dialogueText.setText(this.dialogue2[0]);
                    this.dialogueBox.visible = false;
                    this.dialogueText.setText('');
                }, [], this);
            }, [], this);

        this.physics.world.collide(this.player, this.npc, () => {
            this.canSpeak = true;
        }, null, this);

        
    }
    

}










// SCENE DEHORS













class ZeldaLike extends Phaser.Scene {

    constructor() {
        super("jardin");
        this.angleMob = 0;
        this.visionRange = 200;
        this.modeAggro = false;
        this.canAttack = true;
        this.canSpeak = true;
        this.camera;
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/npc.png');
        this.load.image('mob', 'assets/mob.png');
        this.load.image('fond 1', 'assets/fond 1.png');

    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset' , 'assets/tileset_ext_00.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map', 'ZeldaLikeMapV1.json');
    }

    create() {


        this.player;
        this.npc;
        this.cursorsUp;
        this.cursorsLeft;
        this.cursorsRight;
        this.cursorsDown;



        //var mob;
        this.mob;

        //var texte
        this.attackTxt = [
            "Tu attaques !"
        ];
        this.attack = this.attackTxt[this.randomIndex];
        this.visible;


        //var dialogue
        this.dialogue1 = [
            "Ah tu es enfin là!",
        ];
        this.dialogue2 = [
            "Je t'attendais",
        ];
        this.randomIndex;
        this.dialogues;
        this.randomIndex;
        

    
        // TILED - load la map
        this.map = this.add.tilemap('map');

        // TILED - load du tileset utilisé par la map dans Tiled
        this.tileset = this.map.addTilesetImage('tileset_ext_00', 'tileset');

        // TILED - load calque de tuiles utilisés dans Tiled
        this.solLayer = this.map.createLayer('sol', this.tileset);
        this.decorsLayer = this.map.createLayer('decoration', this.tileset);
        this.obstacleLayer = this.map.createLayer('obstacle', this.tileset);

        this.obstacleLayer.setCollisionByProperty({ estSolide: true }); 

        


        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
            // this.nomDuMonstre = this.physics.add.group();
            // this.nomDuMonstre_Layer = this.nomDeLaVariableMap.getObjectLayer(' nomDuCalqueObjetDansTiled ');
            // this.nomDuMonstre_Layer.objects.forEach(nomDuMonstre_Layer => {
                //this.monstre_create = this.physics.add.sprite(nomDuMonstre_Layer.x + 16, nomDuMonstre_Layer.y + 16, 'mob' (=> c'est la balise que tu as mis dans le preload pour l'image de ton monstre));
                //this.monstre_create.anims.play('balise_animation_marche');
                //this.nomDuMonstre.add(this.monstre_create);
            //)};

        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
          // this.nomDuMonstre = this.physics.add.group();
          // this.nomDuMonstre_Layer = this.nomDeLaVariableMap.getObjectLayer(' nomDuCalqueObjetDansTiled ');
          // this.nomDuMonstre_Layer.objects.forEach(nomDuMonstre_Layer => {
                //this.monstre_create = this.physics.add.sprite(nomDuMonstre_Layer.x + 16, nomDuMonstre_Layer.y + 16, 'mob' (=> c'est la balise que tu as mis dans le preload pour l'image de ton monstre));
                //this.monstre_create.anims.play('balise_animation_marche');
                //this.nomDuMonstre.add(this.monstre_create);
            //)};


        // Integration du background
        //this.add.image(0, 0, 'fond 1').setOrigin(0, 0);

        
        // Create player sprite and enable physics
        this.player = this.physics.add.sprite(500, 1150, 'player');
        this.player.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        this.npc = this.physics.add.staticSprite(700, 450, 'npc');
        //npc.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        this.mob = this.physics.add.sprite(300, 450, 'mob');
        this.mob.setCollideWorldBounds(true);


        // Create cursors object for player movement
        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')

        // Create interact button
        this.interactButton = this.input.keyboard.addKey('E');


        // Create attack button
        this.attackButton = this.input.keyboard.addKey('SPACE');








        // Create dialogue box and text
        this.dialogueBox = this.add.graphics().setScrollFactor(0);
        this.dialogueBox.fillStyle(0x222222, 0.8);
        this.dialogueBox.fillRect(50, 50, 700, 100);
        this.dialogueText = this.add.text(100, 70, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
        this.dialogueText.setWordWrapWidth(600);


        // Set up collision between player and npc
        this.physics.add.collider(this.player, this.mob);
        this.physics.add.collider(this.player, this.npc);
        this.physics.add.collider(this.player, this.obstacleLayer)


        // Set up overlap between player and npc for interaction
        this.physics.add.overlap(this.player, this.mob, this.checkSpeak.bind(this));


        // Set up overlap between player and mob for attack
        this.physics.add.overlap(this.player, this.mob, this.checkCollision.bind(this), this.showAttack);


        // Detecter la collision entre le bord du monde et le perso pour load la nouvelle map
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.on('worldbounds', (body) => {
            if (body.blocked.right) {
              this.changeLevel();
            }
          });




        this.camera = this.cameras.main.setSize(1920,1080);


        this.camera.startFollow(this.player);
            this.camera.setDeadzone(100,100);
            this.camera.setBounds(0,0,3200,3200);




        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {start : 0 , end : 0}),
            frameRate: 20,
            repeat:-1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        
        this.hauteurLayer = this.map.createLayer('hauteur', this.tileset);



    }






    update() {
        // Player movement
            if (this.cursorsLeft.isDown) {
                this.player.setVelocityX(-260);
                this.player.anims.play('left', true);
            }
            else if (this.cursorsRight.isDown) {
                this.player.setVelocityX(260);
                this.player.anims.play('right', true);
            }
            else if (this.cursorsUp.isDown) {
                this.player.setVelocityY(-260);
                this.player.anims.play('up', true);
            } else if (this.cursorsDown.isDown) {
                this.player.setVelocityY(260);
                this.player.anims.play('down', true);
            }
            else {
                this.player.setVelocity(0);
                this.player.anims.play('idle', true);
            }


        if (this.player.y <= 50) {
            this.scenelevel2();
        };

        //Pour l'instant appuyer sur E fait apparaitre une phrase et lacher le bouton fait disparaitre la phrase. A CHANGER pour ne pas avoir a maintenir
        /*if (this.interactButton.isDown) {
            
        }
        else{
            this.noneDialogue();
        }
        
        */


        if (this.player.y <= 30){
            this.changeLevel();
        }

        if (this.canAttack && this.attackButton.isDown) {
            this.checkCollision();
        }

        if (this.canSpeak && this.interactButton.isDown){
            this.checkSpeak();
        }


    }

    //FONCTIONS
    showDialogue() {
        // Show dialogue box and text
        
            this.dialogueBox.visible = true;
            this.dialogueText.setText(this.dialogue1[0]);
    
    }

    noneDialogue() {
        //Hide dialogue box when interact button is released
        this.dialogueBox.visible = false;
        this.dialogueText.setText('');
    }

    scenelevel2() {
        this.scene.start("level2");
    }


  
    changeLevel(){
        this.player.destroy();
        this.npc.destroy();
        this.mob.destroy();
        
        this.scene.start('level2');
    
        // Créer un nouveau joueur dans le nouveau niveau
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);
    
    
        // Mettre à jour la caméra pour suivre le joueur dans le nouveau niveau
        this.cameras.main.startFollow(this.player);
    
    }

    checkCollision() {
        this.physics.overlap(this.player, this.mob, () => {
            if (this.canAttack) {
                this.dialogueText.setText(this.attackTxt);
                this.mob.visible = false;
                this.canAttack = false;
            }
        }, null, this);

        this.physics.world.collide(this.player, this.mob, () => {
            this.canAttack = true;
        }, null, this);
    }


    checkSpeak() {
            this.canSpeak = false;
            this.dialogueBox.visible = true;
            this.dialogueText.setText(this.dialogue1[0]);
            this.time.delayedCall(3000, function () {
                this.canSpeak = true;
                this.dialogueText.setText(this.dialogue2[0]);
                this.time.delayedCall(5000, function () {
                    this.canSpeak = true;
                    this.dialogueText.setText(this.dialogue2[0]);
                    this.dialogueBox.visible = false;
                    this.dialogueText.setText('');
                }, [], this);
            }, [], this);

        this.physics.world.collide(this.player, this.mob, () => {
            this.canSpeak = true;
        }, null, this);

        
    }
    

}












//SCENE DONJON 1











class level2 extends Phaser.Scene {
    constructor() {
        super("level2");
    }

    init(data) { this.position = this.data.positionZeldaLike; }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('fond 2', 'assets/fond 2.png');
    }

    create() {
        // Integration du background
        this.add.image(0, 0, 'fond 2').setOrigin(0, 0);


        // Create player sprite and enable physics
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        //npc = this.physics.add.staticSprite(700, 450, 'npc');
        //npc.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        //mob = this.physics.add.sprite(300, 450, 'mob');
        //mob.setCollideWorldBounds(true);


        // Create cursors object for player movement
        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')






        // Create interact button
        //interactButton = this.input.keyboard.addKey('E');


        // Create attack button
        //attackButton = this.input.keyboard.addKey('SPACE');

    }

    update() {
        // Player movement
        if (this.cursorsLeft.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursorsRight.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursorsUp.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursorsDown.isDown) {
            this.player.setVelocityY(160);
        }
        else {
            this.player.setVelocityY(0);
        }



    }
}



var config = {
    type: Phaser.AUTO,
    width: 3200,
    height: 3200,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    pixelArt:true,
    scene: [Menu, Inside, ZeldaLike, level2],
};

new Phaser.Game(config);
