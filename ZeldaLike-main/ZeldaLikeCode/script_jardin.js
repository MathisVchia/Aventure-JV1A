export class Jardin extends Phaser.Scene {

    constructor() {
        super("Jardin");
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
        this.piece;
        this.pieceCount = this.registry.get("nbPieces");
        this.pieceCountText;
        this.pvs = this.registry.get("playerHealth");



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


        //Nombre de Pieces
        this.pieceCountText = this.add.text(85, 85, this.pieceCountText, { fontSize: '32px', fill: '#FFF' }).setScrollFactor(0);

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

        // pour passer du bas vers le potager
        if (this.player.x > 500 && this.player.x < 600 && this.player.y > 2270 && this.player.y < 2300){
            this.changedLevel4();
        }

        // pour passer du bas vers le potager
        if (this.player.x > 450 && this.player.x < 640 && this.player.y > 1625 && this.player.y < 1665){
            this.changedLevel5();
        }

        // pour passer du bas vers le potager
        if (this.player.x > 885 && this.player.x < 930 && this.player.y > 255 && this.player.y < 416){
            this.changedLevel6();
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
        this.scene.start("donjon1");
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

    changedLevel4(){
        
        
        this.player.x = 550;
        this.player.y = 1600;
    

    }

    changedLevel5(){
        
        
        this.player.x = 544;
        this.player.y = 2321;
    

    }

    changedLevel6(){

        this.scene.start('donjon2', {porteSerre:true});        

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
