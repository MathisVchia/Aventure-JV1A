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

//______________________________________________________________________________________________________________________________________________________________________________________________________
//______________________________________________________________________________________________________________________________________________________________________________________________________

// SCENE INTERIEUR

//______________________________________________________________________________________________________________________________________________________________________________________________________
//______________________________________________________________________________________________________________________________________________________________________________________________________

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

    // PRELOAD______________________________________________________________________________________________________________________________________________________________________________________________________

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

        this.load.image('fullLife', 'assets/fullLife.png');
        this.load.image('midLife', 'assets/midLife.png');
        this.load.image('lowLife', 'assets/lowLife.png');
        this.load.image('piece', 'assets/piece.png');
        this.load.image('poche', 'assets/poche.png');
    }



    //  CREATE ______________________________________________________________________________________________________________________________________________________________________________________________________
    create() {


        this.player;
        this.npc;
        this.cursorsUp;
        this.cursorsLeft;
        this.cursorsRight;
        this.cursorsDown;
        this.camera;
        this.health;


        //var dialogue
        this.dialogue1 = [
            "Bon, vu que maman et papa sont parti pour ton anniversaire, je t'ai préparé un petit truc !",
        ];
        this.dialogue2 = [
            "Si tu veux jouer avec moi, il faut aller au sous-sol ! Apparemment, un terrible méchant menace de tout casser !",
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
        
        this.uiLife = this.add.sprite(55,40,'fullLife').setScale(2,2).setScrollFactor(0);
        
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

        // Create cursors object for player movement
        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')

        // Create interact button
        this.interactButton = this.input.keyboard.addKey('E');

        // Create dialogue box and text
        this.dialogueBox = this.add.graphics().setScrollFactor(0);
        this.dialogueBox.fillStyle(0x222222, 0.8);
        this.dialogueBox.fillRect(500, 750, 800, 100);
        this.dialogueText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
        this.dialogueText.setWordWrapWidth(600);

        // Set up collision between player and npc
        this.physics.add.collider(this.player, this.mob);
        this.physics.add.collider(this.player, this.npc);
        this.physics.add.collider(this.player, this.decors);


        // Set up overlap between player and npc for interaction
        this.physics.add.overlap(this.player, this.npc, this.checkSpeak.bind(this));


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

   //UPDATE______________________________________________________________________________________________________________________________________________________________________________________________________
    update() {
        console.log(this.player.x, this.player.y)
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

        if (this.interactButton.isDown){
            this.checkSpeak();
        }

    }

    //FONCTIONS


    pertePvs(player){
        this.pvs -= 1;
        console.log (this.pvs)
        player.setTint(0xff0000); // Changer la teinte du sprite en rouge
        player.body.enable = false; // Désactiver la physique du joueur
        this.registry.set("playerHealth", this.pvs);
        setTimeout(() => {
            player.clearTint(); // Remettre la teinte du sprite à sa couleur d'origine
            player.body.enable = true; // Réactiver la physique du joueur
        }, 2000); 
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
        this.changeLevel = true;
        this.scene.start('jardin', {porteHaut : true});
    }

    changedLevelFront(){
        this.changeLevelFront = true;
        this.scene.start('jardin', {porteBas : true});
    }
    



    checkSpeak() {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
        if (distance < 50) { // la distance de déclenchement du dialogue
            if (!this.dialogueBox.visible) { // affiche le dialogue si la boîte de dialogue n'est pas déjà visible
                this.dialogueBox.visible = true;
                this.dialogueText.setText(this.dialogue1[0]);
                this.time.delayedCall(3000, function () {
                    this.dialogueText.setText(this.dialogue2[0]);
                    this.time.delayedCall(8000, function () {
                        this.dialogueBox.visible = false;
                        this.dialogueText.setText('');
                    }, [], this);
                }, [], this);
            }
        } else {
            this.dialogueBox.visible = false;
            this.dialogueText.setText('');
        }
    

    }

}



//______________________________________________________________________________________________________________________________________________________________________________________________________
//______________________________________________________________________________________________________________________________________________________________________________________________________



// SCENE DEHORS


//______________________________________________________________________________________________________________________________________________________________________________________________________
//______________________________________________________________________________________________________________________________________________________________________________________________________



class ZeldaLike extends Phaser.Scene {

    constructor() {
        super("jardin");
        this.angleMob = 0;
        this.visionRange = 200;
        this.modeAggro = false;
        this.canAttack = true;
        this.canSpeak = true;
        this.camera;
        this.canTrade = true;
    }

    init(data){this.porteHaut=data.porteHaut, this.porteBas = data.porteBas, this.exitDonjon1 = data.exitDonjon1};
    
//______________________________________________________________________________________________________________________________________________________________________________________________________

    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/littleSister.png');
        this.load.image('mob', 'assets/mobBlob.png');
        this.load.image('fond 1', 'assets/fond 1.png');
        this.load.image('pot', 'assets/pot.png');
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
        this.load.image('fullLife', 'assets/fullLife.png');
        this.load.image('midLife', 'assets/midLife.png');
        this.load.image('lowLife', 'assets/lowLife.png');
        
    }


//______________________________________________________________________________________________________________________________________________________________________________________________________

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
        this.controlOff = false;
        this.tradeSentence1 = false;
        this.health;
        this.pvs = 3;



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
        this.trade1 = [
            "Bienvenu à la boutique !"
        ];
        this.trade2 = [
            "En échange de 5 boutons, je veux bien te donner 10 cailloux !"
        ];
        this.nbBouton = [
            5
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

        this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
        this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
        this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);
        this.uiLife = this.add.sprite(55, 40, "fullLife").setScrollFactor(0);
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


        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
        this.mobU = this.physics.add.group();

        this.mobUp = this.map.getObjectLayer('mobUp');
        this.mobUp.objects.forEach(mobUp => {
            this.mobUp_create = this.physics.add.sprite(mobUp.x + 16, mobUp.y + 16, 'mob');
            //this.monstre_create.anims.play('balise_animation_marche');
            this.tweens.add({
                targets: this.mobUp_create,
                y: mobUp.y - 86, // Aller à une position de 100 pixels plus haut
                duration: 3000, // Pendant une durée de 1 seconde
                yoyo: true, // Revenir à la position initiale après l'animation
                repeat: -1 // Répéter en boucle
            });
            this.mobU.add(this.mobUp_create);
        });


        this.mobR = this.physics.add.group();

        this.mobRight = this.map.getObjectLayer('mobRight');
        this.mobRight.objects.forEach(mobRight => {
            this.mobRight_create = this.physics.add.sprite(mobRight.x + 16, mobRight.y + 16, 'mob');
            //this.monstre_create.anims.play('balise_animation_marche');
            this.tweens.add({
                targets: this.mobRight_create,
                x: mobRight.x +100, // Aller à une position de 100 pixels plus haut
                duration: 3000, // Pendant une durée de 1 seconde
                yoyo: true, // Revenir à la position initiale après l'animation
                repeat: -1 // Répéter en boucle
            });
            this.mobR.add(this.mobRight_create);
        });


        

        
        // Create player sprite and enable physics
        // Look if which door we pass
        console.log(this.porteHaut);
        if (this.porteHaut == true){
            console.log("ChangeLevelSimple");
            this.player = this.physics.add.sprite(1918, 1300, 'player');
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
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


        // Create dialogue box and text
        this.dialogueBox = this.add.graphics().setScrollFactor(0);
        this.dialogueBox.fillStyle(0x222222, 0.8);
        this.dialogueBox.fillRect(500, 750, 800, 100);
        this.dialogueText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
        this.dialogueText.setWordWrapWidth(600);

        // Create trade box and texte
        this.tradeBox = this.add.graphics().setScrollFactor(0);
        this.tradeBox.fillStyle(0x222222, 0.8);
        this.tradeBox.fillRect(500, 750, 800, 100);
        this.tradeText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
        this.tradeText.setWordWrapWidth(600);

        
        this.boutonText = this.add.text(200, 200, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
        this.boutonText.setWordWrapWidth(600);


        // Set up collision between player and npc
        this.physics.add.collider(this.player, this.mob);
        this.physics.add.collider(this.player, this.npc);
        this.physics.add.collider(this.player, this.obstacleLayer);

        this.physics.add.collider(this.mobU, this.npc);
        this.physics.add.collider(this.mobU, this.obstacleLayer);
        
        this.physics.add.collider(this.mobR, this.npc);
        this.physics.add.collider(this.mobR, this.obstacleLayer);

        this.physics.add.collider(this.player, this.mobU, this.pertePvs, null, this);
        this.physics.add.collider(this.player, this.mobR, this.pertePvs, null, this);


        // Set up overlap between player and npc for interaction
        this.physics.add.overlap(this.player, this.mob, this.checkSpeak.bind(this));

        this.physics.add.overlap(this.attaque_sword_left, this.mobU, this.hitMonsterU, null, this);
        this.physics.add.overlap(this.attaque_sword_right, this.mobU, this.hitMonsterU, null, this);
        this.physics.add.overlap(this.attaque_sword_up, this.mobU, this.hitMonsterU, null, this);
        this.physics.add.overlap(this.attaque_sword_down, this.mobU, this.hitMonsterU, null, this);

        this.physics.add.overlap(this.attaque_sword_left, this.mobR, this.hitMonsterR, null, this);
        this.physics.add.overlap(this.attaque_sword_right, this.mobR, this.hitMonsterR, null, this);
        this.physics.add.overlap(this.attaque_sword_up, this.mobR, this.hitMonsterR, null, this);
        this.physics.add.overlap(this.attaque_sword_down, this.mobR, this.hitMonsterR, null, this);


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


    //___________________________________________________________________________________________________________________________________________________________________________________________________________________________________

    update() {
        console.log(this.player.x, this.player.y)

        //Player moves
        if (this.cursorsLeft.isDown ) {
            if (this.controlOff == false){
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
                this.faceLeft = true;
                this.faceRight = false;
                this.faceUp = false;
                this.faceDown = false;
            }
        }
        else if (this.cursorsRight.isDown) {
            if (this.controlOff == false){
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
                this.faceLeft = false;
                this.faceRight = true;
                this.faceUp = false;
                this.faceDown = false;
            }
        }
        else if (this.cursorsUp.isDown) {
            if (this.controlOff == false){
                this.player.setVelocityY(-160);
                this.player.anims.play('up', true);
                this.faceLeft = false;
                this.faceRight = false;
                this.faceUp = true;
                this.faceDown = false;
            }
        
        } else if (this.cursorsDown.isDown) {
            if (this.controlOff == false){
                this.player.setVelocityY(160);
                this.player.anims.play('down', true);
                this.faceLeft = false;
                this.faceRight = false;
                this.faceUp = false;
                this.faceDown = true;
        }
    }
        else {
            this.player.setVelocity(0);
            this.player.anims.play('idle', true);
        }


        // Player attack
        if (this.attaque_sword == true){
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
        }


        if (this.pvs == 3){
            this.uiLife.setTexture("fullLife")
        }
        if (this.pvs == 2){
            this.uiLife.setTexture("midLife")
        }
        if (this.pvs == 1){
            this.uiLife.setTexture("lowLife")
        }

        // pour rentrer a l'interieur par le haut
        if (this.player.x > 1888 && this.player.x < 1951 && this.player.y > 1305 && this.player.y < 1375){
            this.changedLevel1();
        }

        //pour rentrer dans le donjon
        if (this.player.x > 2303 && this.player.x < 2367 && this.player.y > 1759 && this.player.y < 1855){
            this.changedLevel2();
        }

        // pour rentrer a l'interieur par le bas
        if (this.player.x > 1631 && this.player.x < 1759 && this.player.y > 2432 && this.player.y < 2495){
            this.changedLevel3();
        }

    // TENTATIVE DE TRADE
      //  if (this.player.x > 2425 && this.player.x < 2545 && this.player.y > 2060 && this.player.y < 2125 ){
           // console.log("skjdfsdfdfhjdf")
              //  this.trade();
               // this.tradeSentence1 = true;
            //}
}

    
//___________________________________________________________________________________________________________________________________________________________________________________________________


    //FONCTIONS

    pertePvs(player){
        this.pvs -= 1;
        console.log (this.pvs)
        player.setTint(0xff0000); // Changer la teinte du sprite en rouge
        player.body.enable = false; // Désactiver la physique du joueur
        this.registry.set("playerHealth", this.pvs);
        setTimeout(() => {
            player.clearTint(); // Remettre la teinte du sprite à sa couleur d'origine
            player.body.enable = true; // Réactiver la physique du joueur
     }, 2000); 
    }

    hitMonsterU(attaque_sword, mobU) {
        if (attaque_sword == true);
            this.x = mobU.x;
            this.y = mobU.y;
            mobU.disableBody(true, true);
            attaque_sword.disableBody(true, true);
            // Faire apparaitre un sprite à l'emplacement de la mort de l'ennemi
            this.loot = this.physics.add.sprite(this.x, this.y, 'piece');
            // Gérer la collision entre le joueur et la pièce
            this.physics.add.overlap(this.player, this.loot, () => {
                console.log ("la touché la touché, la touché la touché")
                    
            // Incrémenter le compteur de pièces
                this.pieceCount += 1;
                this.pieceCountText.setText(this.pieceCount);
                this.loot.destroy();
        
        
            });

    }

    hitMonsterR(attaque_sword, mobR) {
        if (attaque_sword == true);
            this.x = mobR.x;
            this.y = mobR.y;
            mobR.disableBody(true, true);
            attaque_sword.disableBody(true, true);
            // Faire apparaitre un sprite à l'emplacement de la mort de l'ennemi
            this.loot = this.physics.add.sprite(this.x, this.y, 'piece');
            // Gérer la collision entre le joueur et la pièce
            this.physics.add.overlap(this.player, this.loot, () => {
                console.log ("la touché la touché, la touché la touché")
                    
            // Incrémenter le compteur de pièces
                this.pieceCount += 1;
                this.pieceCountText.setText(this.pieceCount);
                this.loot.destroy();
        
        
            });

    }

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

    nbBouton(){
        this.boutonText.setText(this.nbBouton);
    }


    // Tentative de trade de la monnaie
    /*trade(){
        this.controlOff = true;
        if (this.tradeSentence1 ==  true){
            this.tradeBox.visible = true;
            this.tradeText.setText(this.trade1[0]);
            if (Phaser.Input.Keyboard.JustDown(this.keyEnter)){
                this.tradeText.setText(this.trade2[0]);
                if (Phaser.Input.Keyboard.JustDown(this.keySpace)){
                    this.nbBouton -= 5;
                    this.nbCailloux += 10;
                    this.canTrade = true;
                    this.tradeBox.visible = false;
                    this.tradeText.setText('');
                    this.controlOff = false;
                };
                if (Phaser.Input.Keyboard.JustDown(this.keyEnter)){
                    this.tradeBox.visible = false;
                    this.tradeText.setText('');
                    this.controlOff = false;
                };
            };

        };
    */
}



//_____________________________________________________________________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________________________________________________________________



//SCENE DONJON 1



//_____________________________________________________________________________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________________________________________________________________________



class level2 extends Phaser.Scene {



    constructor() {
        super("donjon1");
        this.angleMob = 0;
        this.visionRange = 200;
        this.modeAggro = false;
        this.canAttack = true;
        this.canSpeak = true;
        this.camera;
        this.bossHits = 0;
    }

    init(data){this.entreeDonjon1=data.entreeDonjon1};


//_____________________________________________________________________________________________________________
    


    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/littleSister.png');
        this.load.image('mob', 'assets/mobBlob.png');
        this.load.image('pot', 'assets/pot.png');
        this.load.image('epee', 'assets/woodenSword.png');
        this.load.image('clef', 'assets/clef.png');
        this.load.image('boss', 'assets/boss1.png');
    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset2' , 'assets/tileset_donj_00.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map2', 'donjon1.json');
        

        this.load.image('fullLife', 'assets/fullLife.png');
        this.load.image('midLife', 'assets/midLife.png');
        this.load.image('lowLife', 'assets/lowLife.png');
        this.load.image('piece', 'assets/piece.png');
        this.load.image('poche', 'assets/poche.png');
        this.load.image('projectile', 'assets/projectiles.png');
    }



//_____________________________________________________________________________________________________________


create() {


    this.player;
    this.npc;
    this.cursorsUp;
    this.cursorsLeft;
    this.cursorsRight;
    this.cursorsDown;
    this.pvs = this.registry.get("playerHealth");
    this.x;
    this.y;
    this.loot;
    this.piece;
    this.pieceCount = 0;
    this.pieceCountText;
    this.attack_sword = false;
    this.hasKey = false; // Indique si le joueur a récupéré la clé
    this.doorOpen = false; // Indique si la porte est ouverte
    this.projectiles;
    this.boss;
    this.bossSpeed;
    this.bossAttackInterval;
    this.bossAttackTimer;
    this.timeElapsed;
    this.health;
    this.bossBattu = false;



    //var mob;
    this.mob;
    this.pot;
    this.epee;
    this.key;

    //var texte
    this.attackTxt = [
        "Tu attaques !"
    ];
    this.attack = this.attackTxt[this.randomIndex];
    this.visible;


    //var dialogue
    this.dialogue1 = [
        "Bienvenu... dans le donjon de la mort ! J'ai piqué des cartons à papa et maman pour te faire des épreuves, j'espère que ça te plaira !",
    ];
    this.dialogue2 = [
        "Reviens une fois que tu as battu le terrible méchant du sous-sol... euh du donjon !",
    ];
    this.dialogue3 = [
        "Tu as battu le méchant ? Trop bien ! Maintenant, il faut que tu ailles vite sauver les pauvres habitants de Serreland ! Vite !"
    ]
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
    this.door = this.map2.createLayer('porte', this.tileset2);

    
    this.murDonjon1.setCollisionByProperty({ estSolide: true }); 
    this.murDonjon2.setCollisionByProperty({ estSolide: true });
    this.door.setCollisionByProperty({ estSolide: true }); 


    // UI
    this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
    this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
    this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);
    this.uiLife = this.add.sprite(55, 40, "fullLife").setScrollFactor(0);


    this.attaque_sword_left = this.physics.add.sprite(0,0, 'sword_x_left');
    this.attaque_sword_right = this.physics.add.sprite(0,0, 'sword_x_right');
    this.attaque_sword_up = this.physics.add.sprite(0,0, 'sword_y_up');
    this.attaque_sword_down = this.physics.add.sprite(0,0, 'sword_y_down');


    this.boss = this.physics.add.sprite(700, 1600, 'boss');


    


    // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
    this.mob = this.physics.add.group();

    this.Mobs = this.map2.getObjectLayer('mobsDonjon1');
    this.Mobs.objects.forEach(Mobs => {
        this.Mobs_create = this.physics.add.sprite(Mobs.x + 16, Mobs.y + 16, 'mob');
        //this.monstre_create.anims.play('balise_animation_marche');
        this.tweens.add({
            targets: this.Mobs_create,
            y: Mobs.y - 116, // Aller à une position de 100 pixels plus haut
            duration: 2000, // Pendant une durée de 1 seconde
            yoyo: true, // Revenir à la position initiale après l'animation
            repeat: -1 // Répéter en boucle
        });
        this.mob.add(this.Mobs_create);
    });
    //this.mob.setVelocityY(-100);

    
    // TILED - load calque objet utilisés dans Tiled (Pour les pots cassables)
    this.pot = this.physics.add.group();

    this.pots = this.map2.getObjectLayer('CassableDonjon1');
    this.pots.objects.forEach(pots => {
        this.pots_create = this.physics.add.sprite(pots.x + 2, pots.y + 16, 'pot');
        this.pots_create.setImmovable(true);
        //this.monstre_create.anims.play('balise_animation_marche');
        this.pot.add(this.pots_create);
    });

    // mettre la mécanique a prendre
    this.epee = this.physics.add.group();

    this.epees = this.map2.getObjectLayer('Mecanique');
    this.epees.objects.forEach(epees => {
        this.epees_create = this.physics.add.sprite(epees.x, epees.y, 'epee');
        this.epees_create.setImmovable(true);
        //this.monstre_create.anims.play('balise_animation_marche');
        this.epee.add(this.epees_create);
    });

    // mettre la mécanique a prendre
    this.key = this.physics.add.group();

    this.keys = this.map2.getObjectLayer('Key');
    this.keys.objects.forEach(keys => {
        this.keys_create = this.physics.add.sprite(keys.x, keys.y, 'clef');
        this.keys_create.setImmovable(true);
        //this.monstre_create.anims.play('balise_animation_marche');
        this.key.add(this.keys_create);
    });

    

    // Create NPC sprite and enable physics
    this.npc = this.physics.add.staticSprite(650, 420, 'npc');


    // Ajouter un groupe pour les projectiles du boss
    this.projectiles = this.physics.add.group();

    // Définir les propriétés du boss
    this.boss.health = 4; // Le boss doit être frappé 4 fois pour être vaincu
    this.bossSpeed = 10;
    this.bossAttackInterval = 2000;
    this.bossAttackTimer = 0;

    // Ajouter un chronomètre pour le temps écoulé depuis la dernière attaque du boss
    this.timeElapsed = 0;


    // Create cursors object for player movement
    this.cursorsUp = this.input.keyboard.addKey('Z');
    this.cursorsLeft = this.input.keyboard.addKey('Q')
    this.cursorsRight = this.input.keyboard.addKey('D')
    this.cursorsDown = this.input.keyboard.addKey('S')

    // Create interact button
    this.interactButton = this.input.keyboard.addKey('E');



    // Create attack button
     this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);



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


    // Create dialogue box and text
    this.dialogueBox = this.add.graphics().setScrollFactor(0);
    this.dialogueBox.fillStyle(0x222222, 0.8);
    this.dialogueBox.fillRect(500, 750, 800, 100);
    this.dialogueText = this.add.text(550, 750, '', { font: '24px Arial', fill: '#ffffff' }).setScrollFactor(0);
    this.dialogueText.setWordWrapWidth(600);

    this.pieceCountText = this.add.text(85, 85, this.pieceCountText, { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);


    // Set up collision between player and npc
    //this.physics.add.collider(this.player, this.mob);
    this.physics.add.collider(this.player, this.npc);
    this.physics.add.collider(this.player, this.murDonjon1);
    this.physics.add.collider(this.player, this.murDonjon2);
    this.physics.add.collider(this.player, this.door);
    this.physics.add.collider(this.attaque_sword_left, this.mob);
    this.physics.add.collider(this.attaque_sword_right, this.mob);
    this.physics.add.collider(this.attaque_sword_up, this.mob);
    this.physics.add.collider(this.attaque_sword_down, this.mob);
    this.physics.add.collider(this.mob, this.attaque_sword, this.kill_mob, null, this);
    this.physics.add.collider(this.player, this.mob, this.pertePvs, null, this);
    this.physics.add.collider(this.player, this.loot);
    this.physics.add.collider(this.player, this.pot);
    this.physics.add.collider(this.pot, this.murDonjon1);
    this.physics.add.collider(this.pot, this.murDonjon2);
    this.physics.add.collider(this.mob, this.murDonjon1);
    this.physics.add.collider(this.mob, this.murDonjon2);
    this.physics.add.collider(this.player, this.door, this.hitDoor, null, this);
    


    // Set up overlap between player and npc for interaction
    this.physics.add.overlap(this.player, this.npc, this.checkSpeak.bind(this));

    // Attaque (touche entre epee et mob pour les tuer)
    this.physics.add.overlap(this.attaque_sword_left, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.mob, this.hitMonster, null, this);

    // Attaque contre le boss
    this.physics.add.overlap(this.attaque_sword_left, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.boss, this.hitBoss, null, this);

    // Coup epee contre pot pour detruire
    this.physics.add.overlap(this.attaque_sword_left, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.player, this.epee, this.recupMeca, null, this);
    this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
    this.physics.add.overlap(this.player, this.projectiles, this.hitPlayer, null, this);
    

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


//__________________________________________________________________________________________________________________________________________________________________________

update(time, delta) {

    console.log(this.player.y)
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
    if (this.attack_sword == true){
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
                if (this.attaque_sword_down)
                this.time.delayedCall(300, () => {
                    this.attaque_sword_down.disableBody(true,true);
                })
                
            }
        }
    }


    // sortir du donjon
    if (this.player.x > 1535 && this.player.x < 1600 && this.player.y > 222 && this.player.y < 350){
        this.exitDonjon1();
    }




    if (Phaser.Input.Keyboard.JustDown(this.interactButton)){
        this.checkSpeak();
    }

    if (this.pvs == 3){
        this.uiLife.setTexture("fullLife")
    }
    if (this.pvs == 2){
        this.uiLife.setTexture("midLife")
    }
    if (this.pvs == 1){
        this.uiLife.setTexture("lowLife")
    }



    // Définir un délai minimum entre les mouvements du boss (en millisecondes)
    const minMoveDelay = 6000;

    if (this.player.y >= 1200)
        this.physics.moveToObject(this.boss, this.player, 50);

     // Attaques régulières du boss
     if (time > this.bossAttackTimer + this.bossAttackInterval) {
         this.bossAttackTimer = time;
         this.fireProjectile();
     }

    }   

    
    //_____________________________________________________________________________________________________________


    //FONCTIONS

    fireProjectile() {
        // Ajouter un projectile qui va vers le joueur
        var projectile = this.projectiles.create(this.boss.x, this.boss.y, 'projectile');
        var angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
        projectile.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);

        // Détruire le projectile après 3 secondes
        this.time.delayedCall(1500, function () {
            projectile.destroy();
        }, [], this);
    }
    

    hitPlayer(player, projectile, pvs) {
        // Retirer un point de vie au joueur et détruire le projectile
        pvs -= 1;
        console.log ("Tu perds de la vie")
        player.setTint(0xff0000); // Changer la teinte du sprite en rouge
        player.body.enable = false; // Désactiver la physique du joueur
        this.registry.set("playerHealth", pvs);
        setTimeout(() => {
            player.clearTint(); // Remettre la teinte du sprite à sa couleur d'origine
            player.body.enable = true; // Réactiver la physique du joueur
        }, 1000); 
        projectile.disableBody(true,true);
    }


    hitBoss(player, boss) {
        // Ajouter un coup au compteur et retirer un point de vie au boss
        boss.health--;
        boss.setTint(0xff0000);
        console.log(boss.health)
        if (boss.health === 0) {
            boss.disableBody(true, true);
            this.bossBattu = true;
          }
        }

    hitDoor(player, door) {
            if (this.hasKey == true){
            door.disableBody(true, true);
            //door.disableBody(true, true);
            door.destroy();
            }
        
    }

    collectKey(player, key) {
        key.disableBody(true, true);
        this.hasKey = true;
    }

    pertePvs(player){
        this.pvs -= 1;
        console.log (this.pvs)
        player.setTint(0xff0000); // Changer la teinte du sprite en rouge
        player.body.enable = false; // Désactiver la physique du joueur
        this.registry.set("playerHealth", this.pvs);
        setTimeout(() => {
            player.clearTint(); // Remettre la teinte du sprite à sa couleur d'origine
            player.body.enable = true; // Réactiver la physique du joueur
        }, 2000); 
    }

    
    hitMonster(attaque_sword, mob) {
        if (attaque_sword == true);
            this.x = mob.x;
            this.y = mob.y;
            mob.disableBody(true, true);
            attaque_sword.disableBody(true, true);
            // Faire apparaitre un sprite à l'emplacement de la mort de l'ennemi
            this.loot = this.physics.add.sprite(this.x, this.y, 'piece');
            // Gérer la collision entre le joueur et la pièce
            this.physics.add.overlap(this.player, this.loot, () => {
                console.log ("la touché la touché, la touché la touché")
                    
            // Incrémenter le compteur de pièces
                this.pieceCount += 1;
                this.pieceCountText.setText(this.pieceCount);
                this.loot.destroy();
        
        
            });

    }


    hitPot(attaque_sword, pot) {
        if (attaque_sword == true);
            this.x = pot.x;
            this.y = pot.y;
            pot.disableBody(true, true);
            attaque_sword.disableBody(true, true);
        }

    recupMeca(player, epee) {
        epee.disableBody(true, true);
        this.attack_sword = true;

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


    checkSpeak() {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
        if (distance < 50) { // la distance de déclenchement du dialogue
            if (!this.dialogueBox.visible) { // affiche le dialogue si la boîte de dialogue n'est pas déjà visible
                this.dialogueBox.visible = true;
                if (this.bossBattu == false){
                    this.dialogueText.setText(this.dialogue1[0]);
                    this.time.delayedCall(3000, function () {
                        this.dialogueText.setText(this.dialogue2[0]);
                        this.time.delayedCall(3000, function () {
                            this.dialogueBox.visible = false;
                            this.dialogueText.setText('');
                        }, [], this);
                    }, [], this);
                };
                if (this.bossBattu == true){
                    this.dialogueText.setText(this.dialogue3[0]);
                    this.time.delayedCall(8000, function () {
                        this.dialogueBox.visible = false;
                        this.dialogueText.setText('');
                    }, [], this);
                };
            } else {
                this.dialogueBox.visible = false;
                this.dialogueText.setText('');
            }
    
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
