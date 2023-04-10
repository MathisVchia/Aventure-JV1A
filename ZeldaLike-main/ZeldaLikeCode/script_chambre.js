
export class chambre extends Phaser.Scene {

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

    init(data){this.startSpawn = data.startSpawn, this.porteEntree=data.porteEntree, this.porteEntreeHaut = data.porteEntreeHaut
    };

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
        this.piece;
        this.pieceCount = 0;
        this.pieceCountText;
        this.pvs = 3;


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
       /* 
        this.uiLife = this.add.sprite(55,40,'fullLife').setScale(2,2).setScrollFactor(0);
        
        this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
        this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
        this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);
        */
        
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
                this.registry.set("pieceCount", this.pieceCount);
                this.loot.destroy();
        
        
            });

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
        this.scene.start("Jardin");
    }


  
    changedLevel(){
        this.changeLevel = true;
        this.scene.start('Jardin', {porteHaut : true});
    }

    changedLevelFront(){
        this.changeLevelFront = true;
        this.scene.start('Jardin', {porteBas : true});
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



}