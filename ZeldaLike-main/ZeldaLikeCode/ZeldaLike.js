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
        this.scene.start('chambre', {startSpawn : true});
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
        this.changeLevel = false;
        this.changeLevelFront = false;
    }

    init(data){this.startSpawn = data.startSpawn, this.porteEntree=data.porteEntree, this.porteEntreeHaut = data.porteEntreeHaut};

    // PRELOAD ________________________________________________________________________________________

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/littleSister.png');
        //this.load.image('mob', 'assets/mob.png');
        //this.load.image('fond 1', 'assets/fond 1.png');

    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset1' , 'assets/InsideHouse.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map1', 'maison.json');

        this.load.image('fullLife', 'assets/FullLife.png');
        this.load.image('piece', 'assets/piece.png');
        this.load.image('poche', 'assets/poche.png');
    }



    //  CREATE ________________________________________________________________________________________
    create() {


        this.player;
        this.npc;
        this.cursorsUp;
        this.cursorsLeft;
        this.cursorsRight;
        this.cursorsDown;
        this.camera;




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
            "Maintenant que papa et maman sont sorti, tu vas jouer à mon petit jeu, j'ai créé pour toi un donjon dans la cave de la maison, à toi de t'y rendre !",
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
        
        this.add.image(55,40,'fullLife').setScale(2,2).setScrollFactor(0);
        this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
        this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
        this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);

        


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

        if (this.porteEntree == true){
            this.player = this.physics.add.sprite(621, 669, 'player');
            //this.player.setBounce(0.1);
            this.player.setCollideWorldBounds(true);
            this.porteEntree = false;
        }
        

        else if (this.startSpawn == true){
            this.player = this.physics.add.sprite(207, 730, 'player');
            //this.player.setBounce(0.1);
            this.player.setCollideWorldBounds(true);
            this.porteEntree = false;
        }

        else if (this.porteEntreeHaut == true){
            this.player = this.physics.add.sprite(768, 155, 'player');
            //this.player.setBounce(0.1);
            this.player.setCollideWorldBounds(true);
            this.porteEntreeHaut = false;
        }
        


        // Create NPC sprite and enable physics
        this.npc = this.physics.add.staticSprite(700, 450, 'npc');
        //npc.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        //this.mob = this.physics.add.sprite(300, 450, 'mob');
        //this.mob.setCollideWorldBounds(true);


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
        this.dialogueBox.fillRect(500, 750, 800, 100);
        this.dialogueText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
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
            this.camera.setDeadzone(50,50);
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
        this.changeLevel = true;
        this.scene.start('jardin', {porteHaut : true});
    }

    changedLevelFront(){
        this.changeLevelFront = true;
        this.scene.start('jardin', {porteBas : true});
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
                this.time.delayedCall(8000, function () {
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

    init(data){this.porteHaut=data.porteHaut, this.porteBas = data.porteBas, this.exitDonjon1 = data.exitDonjon1};
    
    //_____________________________________________________________________________________________________________

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/littleSister.png');
        this.load.image('mob', 'assets/mobBlob.png');
        this.load.image('fond 1', 'assets/fond 1.png');
        this.load.image('sword_x_left', 'assets/sword_x_left.png');
        this.load.image('sword_x_right', 'assets/sword_x_right.png');
        this.load.image('sword_y_up', 'assets/sword_y_up.png');
        this.load.image('sword_y_down', 'assets/sword_y_down.png');

    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset' , 'assets/tileset_ext_00.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map', 'ZeldaLikeMapV1.json');
        

        this.load.image('fullLife', 'assets/FullLife.png');
        this.load.image('piece', 'assets/piece.png');
        this.load.image('poche', 'assets/poche.png');
    }


    //_____________________________________________________________________________________________________________

    create() {


        this.player;
        this.npc;
        this.cursorsUp;
        this.cursorsLeft;
        this.cursorsRight;
        this.cursorsDown;
        this.faceLeft = false;
        this.faceRight = false;
        this.faceUp = false;
        this.faceDown = false;



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

        this.add.image(55,40,'fullLife').setScale(2,2).setScrollFactor(0);
        this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
        this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
        this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);
        this.attaque_sword_left = this.physics.add.sprite(0,0, 'sword_x_left');
        this.attaque_sword_right = this.physics.add.sprite(0,0, 'sword_x_right');
        this.attaque_sword_up = this.physics.add.sprite(0,0, 'sword_y_up');
        this.attaque_sword_down = this.physics.add.sprite(0,0, 'sword_y_down');


        



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
        console.log(this.porteHaut);
        if (this.porteHaut == true){
            console.log("ChangeLevelSimple");
            this.player = this.physics.add.sprite(1918, 1333, 'player');
            this.player.setCollideWorldBounds(true);
            this.changeLevel = false;
        }
        else if (this.porteBas == true){
            console.log("ChangeLevelFront");
            this.player = this.physics.add.sprite(1695, 2527, 'player');
            this.player.setCollideWorldBounds(true);
            this.changeLevelFront = false;
        }
        console.log(this.player);
        if (this.exitDonjon1 == true){
            console.log("ChangeLevelSimple");
            this.player = this.physics.add.sprite(2400, 1811, 'player');
            this.player.setCollideWorldBounds(true);
            this.changeLevel = false;
        }




        

        // Create NPC sprite and enable physics
        this.npc = this.physics.add.staticSprite(700, 450, 'npc');
        //npc.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        //this.mob = this.physics.add.sprite(300, 450, 'mob');
        //this.mob.setCollideWorldBounds(true);


        // Create cursors object for player movement
        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')

        // Create interact button
        this.interactButton = this.input.keyboard.addKey('E');


        // Create attack button
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);








        // Create dialogue box and text
        this.dialogueBox = this.add.graphics().setScrollFactor(0);
        this.dialogueBox.fillStyle(0x222222, 0.8);
        this.dialogueBox.fillRect(500, 750, 800, 100);
        this.dialogueText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
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

       

          

        
        this.camera = this.cameras.main.setSize(1920,1080);
        this.camera.startFollow(this.player);
        this.camera.setDeadzone(50,50);
        this.camera.setBounds(10,10,3200,3200);




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

        //Player moves
        if (this.cursorsLeft.isDown ) {
            this.player.setVelocityX(-260);
            this.player.anims.play('left', true);
            this.faceLeft = true;
            this.faceRight = false;
            this.faceUp = false;
            this.faceDown = false;
        }
        else if (this.cursorsRight.isDown) {
            this.player.setVelocityX(260);
            this.player.anims.play('right', true);
            this.faceLeft = false;
            this.faceRight = true;
            this.faceUp = false;
            this.faceDown = false;
        }
        else if (this.cursorsUp.isDown) {
            this.player.setVelocityY(-260);
            this.player.anims.play('up', true);
            this.faceLeft = false;
            this.faceRight = false;
            this.faceUp = true;
            this.faceDown = false;

        } else if (this.cursorsDown.isDown) {
            this.player.setVelocityY(260);
            this.player.anims.play('down', true);
            this.faceLeft = false;
            this.faceRight = false;
            this.faceUp = false;
            this.faceDown = true;
        }
        else {
            this.player.setVelocity(0);
            this.player.anims.play('idle', true);
        }


        // Player attack
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)){
            this.clean_sword();
            


            if (this.faceLeft == true) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.attaque_sword_left.x = (this.player.x - 32);
                this.attaque_sword_left.y = (this.player.y);
                this.time.delayedCall(300, () => {
                    this.attaque_sword_left.disableBody(true,true);
                })
                
            }
            else if (this.faceRight == true) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.attaque_sword_right.x = (this.player.x + 32);
                this.attaque_sword_right.y = (this.player.y);
                this.time.delayedCall(300, () => {
                    this.attaque_sword_right.disableBody(true,true);
                })
                
            }
            else if (this.faceUp == true) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.attaque_sword_up.x = (this.player.x);
                this.attaque_sword_up.y = (this.player.y - 32);
                this.time.delayedCall(300, () => {
                    this.attaque_sword_up.disableBody(true,true);
                })
              
            } 
            else if (this.faceDown == true) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.attaque_sword_down.x = (this.player.x);
                this.attaque_sword_down.y = (this.player.y + 32);
                this.time.delayedCall(300, () => {
                    this.attaque_sword_down.disableBody(true,true);
                })
                
            }
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

        // pour rentrer a l'interieur par le haut
        if (this.player.x > 1888 && this.player.x < 1951 && this.player.y > 1344 && this.player.y < 1375){
            this.changedLevel1();
        }

        //pour rentrer dans le donjon
        if (this.player.x > 2303 && this.player.x < 2367 && this.player.y > 1759 && this.player.y < 1855){
            this.changedLevel2();
        }

        // pour rentrer a l'interieur par le bas
        if (this.player.x > 1631 && this.player.x < 1759 && this.player.y > 2432 && this.player.y < 2495){
            this.changedLevel3();


        if (this.canAttack && this.attackButton.isDown) {
            this.checkCollision();
        }

        if (this.canSpeak && this.interactButton.isDown){
            this.checkSpeak();
        }


        


    }

    }
    //_____________________________________________________________________________________________________________


    //FONCTIONS

    // fais disparaître la zone de frappe après le coup
    clean_sword() {
        this.attaque_sword_left.enableBody(true, true);
        this.attaque_sword_right.enableBody(true, true);
        this.attaque_sword_up.enableBody(true, true);
        this.attaque_sword_down.enableBody(true, true);
        this.attaque_sword_left.visible = true;
        this.attaque_sword_right.visible = true;
        this.attaque_sword_up.visible = true;
        this.attaque_sword_down.visible = true;
    }

    // booléenne pour activer clean_sword
    if_clean_sword() {
        if (this.trigger_cleanSword == true) {
            this.trigger_cleanSword = false;
            return true
        }
        else {
            return false
        }
    }

    //Débloque l'attaque CaC
    delock_attaque() {
        this.player_block = false;
        this.trigger_cleanSword = true;
    }

    showDialogue(){
        // Show dialogue box and text
        
            this.dialogueBox.visible = true;
            this.dialogueText.setText(this.dialogue1[0]);
    
    }

    noneDialogue(){
        //Hide dialogue box when interact button is released
        this.dialogueBox.visible = false;
        this.dialogueText.setText('');
    }

    scenelevel2(){
        this.scene.start("level2");
    }


  
    changedLevel1(){
        
        
        this.scene.start('chambre', {porteEntreeHaut : true});

    
    }


    changedLevel2(){
        
        
        this.scene.start('donjon1', {entreeDonjon1:true});
    
    
    }

    changedLevel3(){
        
        
        this.scene.start('chambre', {porteEntree:true});
    

    }

    checkCollision(){
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


    checkSpeak(){
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

    init(data){this.entreeDonjon1=data.entreeDonjon1};


//_____________________________________________________________________________________________________________
    

    preload() {
        

    
        
    
    }

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/littleSister.png');
        this.load.image('mob', 'assets/mobBlob.png');

    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset2' , 'assets/tileset_donj_00.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map2', 'donjon1.json');
        

        this.load.image('fullLife', 'assets/FullLife.png');
        this.load.image('piece', 'assets/piece.png');
        this.load.image('poche', 'assets/poche.png');
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
    this.map2 = this.add.tilemap('map2');

    // TILED - load du tileset utilisé par la map dans Tiled
    this.tileset2 = this.map2.addTilesetImage('tileset_donj_00', 'tileset2');

    // TILED - load calque de tuiles utilisés dans Tiled
    this.solDonjon1 = this.map2.createLayer('solDonjon1', this.tileset2);
    this.murDonjon1 = this.map2.createLayer('murDonjon1', this.tileset2);
    this.murDonjon2 = this.map2.createLayer('murDonjon2', this.tileset2);

    
    this.murDonjon1.setCollisionByProperty({ estSolide: true }); 
    this.murDonjon2.setCollisionByProperty({ estSolide: true }); 

    this.add.image(55,40,'fullLife').setScale(2,2).setScrollFactor(0);
    this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
    this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
    this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);
    this.attaque_sword_left = this.physics.add.sprite(0,0, 'sword_x_left');
    this.attaque_sword_right = this.physics.add.sprite(0,0, 'sword_x_right');
    this.attaque_sword_up = this.physics.add.sprite(0,0, 'sword_y_up');
    this.attaque_sword_down = this.physics.add.sprite(0,0, 'sword_y_down');


    


    // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
    this.mob = this.physics.add.group();

    this.Mobs = this.map2.getObjectLayer('mobsDonjon1');
    this.Mobs.objects.forEach(Mobs => {
        this.Mobs_create = this.physics.add.sprite(Mobs.x + 16, Mobs.y + 16, 'mob');
        //this.monstre_create.anims.play('balise_animation_marche');
        this.mob.add(this.Mobs_create);
    });
    //this.mob.setVelocityY(-100);

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
    console.log(this.entreeDonjon1);
    if (this.entreeDonjon1 == true){
        console.log("ChangeLevelSimple");
        this.player = this.physics.add.sprite(1502, 282, 'player');
        this.player.setCollideWorldBounds(true);
        this.entreeDonjon1 = false;
    }
    console.log(this.player);




    

    // Create NPC sprite and enable physics
    this.npc = this.physics.add.staticSprite(700, 450, 'npc');
    //npc.setCollideWorldBounds(true);


    // Create cursors object for player movement
    this.cursorsUp = this.input.keyboard.addKey('Z');
    this.cursorsLeft = this.input.keyboard.addKey('Q')
    this.cursorsRight = this.input.keyboard.addKey('D')
    this.cursorsDown = this.input.keyboard.addKey('S')

    // Create interact button
    this.interactButton = this.input.keyboard.addKey('E');


    // Create attack button
     this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);








    // Create dialogue box and text
    this.dialogueBox = this.add.graphics().setScrollFactor(0);
    this.dialogueBox.fillStyle(0x222222, 0.8);
    this.dialogueBox.fillRect(500, 750, 800, 100);
    this.dialogueText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
    this.dialogueText.setWordWrapWidth(600);


    // Set up collision between player and npc
    //this.physics.add.collider(this.player, this.mob);
    this.physics.add.collider(this.player, this.npc);
    this.physics.add.collider(this.player, this.obstacleLayer)
    this.physics.add.collider(this.attaque_sword_left, this.mob);
    this.physics.add.collider(this.attaque_sword_right, this.mob);
    this.physics.add.collider(this.attaque_sword_up, this.mob);
    this.physics.add.collider(this.attaque_sword_down, this.mob);
    this.physics.add.collider(this.mob, this.attaque_sword, this.kill_mob, null, this);


    // Set up overlap between player and npc for interaction
    this.physics.add.overlap(this.player, this.npc, this.checkSpeak.bind(this));


    


    // Detecter la collision entre le bord du monde et le perso pour load la nouvelle map
    this.physics.world.setBoundsCollision(true, true, true, true);
   

      

    
    this.camera = this.cameras.main.setSize(1920,1080);
    this.camera.startFollow(this.player);
    this.camera.setDeadzone(50,50);
    this.camera.setBounds(10,10,3200,3200);




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
    //Player moves
    if (this.cursorsLeft.isDown ) {
        this.player.setVelocityX(-260);
        this.player.anims.play('left', true);
        this.faceLeft = true;
        this.faceRight = false;
        this.faceUp = false;
        this.faceDown = false;
    }
    else if (this.cursorsRight.isDown) {
        this.player.setVelocityX(260);
        this.player.anims.play('right', true);
        this.faceLeft = false;
        this.faceRight = true;
        this.faceUp = false;
        this.faceDown = false;
    }
    else if (this.cursorsUp.isDown) {
        this.player.setVelocityY(-260);
        this.player.anims.play('up', true);
        this.faceLeft = false;
        this.faceRight = false;
        this.faceUp = true;
        this.faceDown = false;

    } else if (this.cursorsDown.isDown) {
        this.player.setVelocityY(260);
        this.player.anims.play('down', true);
        this.faceLeft = false;
        this.faceRight = false;
        this.faceUp = false;
        this.faceDown = true;
    }
    else {
        this.player.setVelocity(0);
        this.player.anims.play('idle', true);
    }


    // Player attack
    if (Phaser.Input.Keyboard.JustDown(this.keySpace)){
        this.clean_sword();
        


        if (this.faceLeft == true) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.attaque_sword_left.x = (this.player.x - 32);
            this.attaque_sword_left.y = (this.player.y);
            this.time.delayedCall(300, () => {
                this.attaque_sword_left.disableBody(true,true);
            })
            
        }
        else if (this.faceRight == true) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.attaque_sword_right.x = (this.player.x + 32);
            this.attaque_sword_right.y = (this.player.y);
            this.time.delayedCall(300, () => {
                this.attaque_sword_right.disableBody(true,true);
            })
            
        }
        else if (this.faceUp == true) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.attaque_sword_up.x = (this.player.x);
            this.attaque_sword_up.y = (this.player.y - 32);
            this.time.delayedCall(300, () => {
                this.attaque_sword_up.disableBody(true,true);
            })
          
        } 
        else if (this.faceDown == true) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.attaque_sword_down.x = (this.player.x);
            this.attaque_sword_down.y = (this.player.y + 32);
            this.time.delayedCall(300, () => {
                this.attaque_sword_down.disableBody(true,true);
            })
            
        }
    }



  

    //Pour l'instant appuyer sur E fait apparaitre une phrase et lacher le bouton fait disparaitre la phrase. A CHANGER pour ne pas avoir a maintenir
    /*if (this.interactButton.isDown) {
        
    }
    else{
        this.noneDialogue();
    }
    
    */

    // sortir du donjon
    if (this.player.x > 1535 && this.player.x < 1600 && this.player.y > 222 && this.player.y < 350){
        this.exitDonjon1();
    }


    this.physics.overlap(this.attaque_sword_left, this.mob, () => {
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)){
            this.attackSword()
        }
    });

    if (this.canSpeak && this.interactButton.isDown){
        this.checkSpeak();
    }


    


    }   

    
    //_____________________________________________________________________________________________________________


    //FONCTIONS

    destroy(){
        this.mob.disableBody(true,true);
    }
    
    kill_mob(mob) {
        mob.destroy();
    }

    
    clean_sword() {
        this.attaque_sword_left.enableBody(true, true);
        this.attaque_sword_right.enableBody(true, true);
        this.attaque_sword_up.enableBody(true, true);
        this.attaque_sword_down.enableBody(true, true);
        this.attaque_sword_left.visible = true;
        this.attaque_sword_right.visible = true;
        this.attaque_sword_up.visible = true;
        this.attaque_sword_down.visible = true;
    }

    showDialogue(){
        // Show dialogue box and text
        
            this.dialogueBox.visible = true;
            this.dialogueText.setText(this.dialogue1[0]);

    }

    noneDialogue(){
        //Hide dialogue box when interact button is released
        this.dialogueBox.visible = false;
        this.dialogueText.setText('');
    }

    scenelevel2(){
        this.scene.start("level2");
    }



    exitDonjon1(){
        
        
        this.scene.start('jardin', {exitDonjon1 : true});


    }




    attackSword(){
                this.mob.destroy();
    }


    checkSpeak(){
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
