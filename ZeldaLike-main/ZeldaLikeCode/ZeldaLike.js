class Menu extends Phaser.Scene {
    
    constructor(){
        super("Menu");
        this.start;
        this.boutonStart; // déclarer la variable ici
        this.startSpawn = false;
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
        this.firstSpawn();
    }

    firstSpawn(){
        this.player = this.physics.add.sprite(267, 714, 'player');
        //this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.startSpawn = false;
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
        this.changeLevel = false;
        this.changeLevelPorteAvant = false;
    }

    // PRELOAD ________________________________________________________________________________________

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



    //  CREATE ________________________________________________________________________________________
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


        
// BUGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
        
        // Create player sprite and enable physics
        if (this.changeLevel1 = false){
            this.firstSpawn();
        }

        else if (this.changeLevel1 = true){
            this.secondSpawn();
        }
        


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





    //UPDATE _____________________________________________________________________________________________________________
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
        } 
        else if (this.cursorsDown.isDown) {
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

// Creation de porte Y = ligne horizontale a dépasser et les deux X deux limites pour zoner un carrer dans lequel entrer
        if (this.player.y < 126 && this.player.x > 735 && this.player.x < 800){
            this.changedLevel();
        }

        if (this.player.y > 700 && this.player.x > 600 && this.player.x < 650){
            this.changedLevelFront();
        }




        //if (this.player.y < 126 && this.player.x > 735 && this.player.x < 800){
            //this.changedLevel();
        //}
        //if (this.canAttack && this.attackButton.isDown) {
            //this.checkCollision();
        //}

        if (this.canSpeak && this.interactButton.isDown){
            this.checkSpeak();
        }


    }

    //FONCTIONS

    secondSpawn() {
        this.player = this.physics.add.sprite(768, 137, 'player');
        //this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.changeLevel = false;
    }


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


  
    changedLevel(){
        this.scene.start('jardin');
        this.changeLevel = true;
    }

    changedLevelFront(){
        this.scene.start('jardin');
        this.changeLevelFront = true;
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






//_____________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________



// SCENE DEHORS


//_____________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________










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


    //_____________________________________________________________________________________________________________

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


    //_____________________________________________________________________________________________________________

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


        

        
        // Create player sprite and enable physics
        // Look if which door we pass
        
        if (this.changeLevel = true){
            this.player = this.physics.add.sprite(1918, 1333, 'player');
            this.player.setCollideWorldBounds(true);
            this.changeLevel = false;
        }

        else if (this.changeLevelFront = true){
            this.player = this.physics.add.sprite(1695, 2527, 'player');
            this.player.setCollideWorldBounds(true);
            this.changeLevelFront = false;
        }




        

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




    //_____________________________________________________________________________________________________________

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


        if (this.player.x > 1888 && this.player.x < 1951 && this.player.y > 1344 && this.player.y < 1375){
            this.changedLevel1();
        }
        if (this.player.x > 2303 && this.player.x < 2367 && this.player.y > 1759 && this.player.y < 1855){
            this.changedLevel2();
        }
        if (this.canAttack && this.attackButton.isDown) {
            this.checkCollision();
        }

        if (this.canSpeak && this.interactButton.isDown){
            this.checkSpeak();
        }


    }


    //_____________________________________________________________________________________________________________


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


  
    changedLevel1(){
        
        
        this.scene.start('chambre');
    
        // Créer un nouveau joueur dans le nouveau niveau
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);
        this.changeLevel1 = true;
    
    
        // Mettre à jour la caméra pour suivre le joueur dans le nouveau niveau
        this.cameras.main.startFollow(this.player);
    
    }


    changedLevel2(){
        
        
        this.scene.start('donjon1');
    
        // Créer un nouveau joueur dans le nouveau niveau
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);
        this.changeLevel2 = true;
    
    
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









//_____________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________



//SCENE DONJON 1



//_____________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________








class level2 extends Phaser.Scene {



    constructor() {
        super("donjon1");
        this.angleMob = 0;
        this.visionRange = 200;
        this.modeAggro = false;
        this.canAttack = true;
        this.canSpeak = true;
        this.camera;
    }



//_____________________________________________________________________________________________________________
    

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        //this.load.image('npc', 'assets/npc.png');
        this.load.image('mob', 'assets/mob.png');
        //this.load.image('fond 1', 'assets/fond 1.png');

    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset2' , 'assets/tileset_ext_00.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map2', 'donjon1.json');
    }



//_____________________________________________________________________________________________________________


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
        this.dialogue3 = [
            "Bravo tu as vaincu le boss !",
        ];
        this.dialogue4 = [
            "Maintenant rends toi au deuxieme donjon !",
        ];
        this.randomIndex;
        this.dialogues;
        this.randomIndex;
        

    
        // TILED - load la map
        this.map2 = this.add.tilemap('map2');

        // TILED - load du tileset utilisé par la map dans Tiled
        this.tileset2 = this.map2.addTilesetImage('tileset_ext_00', 'tileset2');

        // TILED - load calque de tuiles utilisés dans Tiled
        this.solDonjon1 = this.map2.createLayer('solDonjon1', this.tileset2);
        this.murDonjon1 = this.map2.createLayer('murDonjon1', this.tileset2);
        this.murDonjon2 = this.map2.createLayer('murDonjon2', this.tileset2);

        this.murDonjon1.setCollisionByProperty({ estSolide: true });
        this.murDonjon2.setCollisionByProperty({ estSolide: true });  

        


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
        // Look if which door we pass
        if (this.changeLevel2 = true){
            this.player = this.physics.add.sprite(1213, 348, 'player');
            this.player.setCollideWorldBounds(true);
            this.changeLevel2 = false;
        }


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
              this.changedLevel();
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




    //_____________________________________________________________________________________________________________


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


        //Pour l'instant appuyer sur E fait apparaitre une phrase et lacher le bouton fait disparaitre la phrase. A CHANGER pour ne pas avoir a maintenir
        /*if (this.interactButton.isDown) {
            
        }
        else{
            this.noneDialogue();
        }
        
        */


        //if (this.player.y <= 30){
            //this.changedLevel();
        //}

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


  
    /*changeLevel(){
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
    */

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
