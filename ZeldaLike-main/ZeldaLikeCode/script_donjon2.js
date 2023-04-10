export class donjon2 extends Phaser.Scene {



    constructor() {
        super("donjon2");
        this.angleMob = 0;
        this.visionRange = 200;
        this.modeAggro = false;
        this.canAttack = true;
        this.canSpeak = true;
        this.camera;
    }

    init(data){this.porteSerre=data.porteSerre, his.pvs = this.registry.get("playerHealth");
    console.log(this.pvs);
    };


//_____________________________________________________________________________________________________________
    


    preload() {
        this.load.spritesheet('player', 'assets/player.png',
        { frameWidth: 36, frameHeight: 50 });
        this.load.image('npc', 'assets/littleSister.png');
        this.load.image('basMob', 'assets/mobBlob.png');
        this.load.image('flyMob', 'assets/flyingMob.png');
        this.load.image('pot', 'assets/pot.png');
        this.load.image('lance_pierre', 'assets/lance_pierre.png');
        this.load.image('epee', 'assets/woodenSword.png');
        this.load.image('clef', 'assets/clef.png');
        this.load.image('boss', 'assets/boss1.png');
    // TILED - preload du tileset utilisé par Tiled pour créer la map
        this.load.image('tileset3' , 'assets/tileset_greenhouse_00.png');
        
    // TILED - preload du fichier json où se trouve la map créée sur Tiled
        this.load.tilemapTiledJSON('map3', 'serre.json');
        

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
    this.pieceCount = this.registry.get("nbPieces");
    this.pieceCountText;
    this.hasKey = false; // Indique si le joueur a récupéré la clé
    this.doorOpen = false; // Indique si la porte est ouverte
    this.projectiles;
    this.cailloux;
    this.mobAttackInterval;
    this.mobAttackTimer;
    this.timeElapsed;
    this.health;
    this.attack_lp = false;

    this.mobAttackInterval = 2000;
    this.mobAttackTimer = 0;

    //var mob;
    this.mob;
    this.mob1;
    this.Mobs;
    this.Mobs1;
    this.pot;
    this.epee;
    this.key;

    //var dialogue
    this.dialogue1 = [
        "Valeureux sauveur ! Te voilà dans ta derniere quête ! Il faut que tu sauves les habitants de Serreland, vite !",
    ];
    this.dialogue2 = [
        "Juste... Essaie de ne rien casser sinon maman va venir me disputer...",
    ];
    this.randomIndex;
    this.dialogues;
    this.randomIndex;
    


    // TILED - load la map
    this.map3 = this.add.tilemap('map3');

    // TILED - load du tileset utilisé par la map dans Tiled
    this.tileset3 = this.map3.addTilesetImage('tileset_greenhouse_00', 'tileset3');

    // TILED - load calque de tuiles utilisés dans Tiled
    this.solSerre = this.map3.createLayer('solSerre', this.tileset3);
    this.murSerre = this.map3.createLayer('murSerre', this.tileset3);

    
    this.murSerre.setCollisionByProperty({ estSolide: true });
      


    // UI
    this.add.image(55,105,'piece').setScale(2,2).setScrollFactor(0);
    this.add.image(55,170,'poche').setScale(2,2).setScrollFactor(0);
    this.add.image(55,245,'poche').setScale(2,2).setScrollFactor(0);
    this.uiLife = this.add.sprite(55, 40, "fullLife").setScrollFactor(0);


    this.attaque_sword_left = this.physics.add.sprite(0,0, 'sword_x_left');
    this.attaque_sword_right = this.physics.add.sprite(0,0, 'sword_x_right');
    this.attaque_sword_up = this.physics.add.sprite(0,0, 'sword_y_up');
    this.attaque_sword_down = this.physics.add.sprite(0,0, 'sword_y_down');


    

    
    // TILED - load calque objet utilisés dans Tiled (Pour les pots cassables)
    this.pot = this.physics.add.group();

    this.pots = this.map3.getObjectLayer('pots');
    this.pots.objects.forEach(pots => {
        this.pots_create = this.physics.add.sprite(pots.x + 2, pots.y + 16, 'pot');
        this.pots_create.setImmovable(true);
        this.pots.x = 0;
        this.pots.y = 0;
        //this.monstre_create.anims.play('balise_animation_marche');
        this.pot.add(this.pots_create);
    });

    // mettre la mécanique a prendre
    this.lance_pierre = this.physics.add.group();

    this.lp = this.map3.getObjectLayer('lance_pierre');
    this.lp.objects.forEach(lp => {
        this.lp_create = this.physics.add.sprite(lp.x, lp.y, 'lance_pierre');
        this.lp_create.setImmovable(true);
        //this.monstre_create.anims.play('balise_animation_marche');
        this.lance_pierre.add(this.lp_create);
    });




    // CREATION MOB GAUCHE DROITE
    this.mob = this.physics.add.group();
   this.projectiles = this.physics.add.group();
   
   this.Mobs = this.map3.getObjectLayer('rightMob');
   this.Mobs.objects.forEach((Mobs) => {
       const Mobs_create = this.physics.add.sprite(Mobs.x + 16, Mobs.y + 16, 'basMob');
       this.tweens.add({
           targets: Mobs_create,
           x: Mobs.x + 206,
           duration: 1500,
           yoyo: true,
           repeat: -1
       });
       this.mob.add(Mobs_create);
   
       const timer = this.time.addEvent({
           delay: 1500,
           callback: () => {
               const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, Mobs_create.x, Mobs_create.y);
               if (distance <= 300) {
                   Mobs_create.fireProjectile();
               }
           },
           loop: true
       });
   
       Mobs_create.fireProjectile = () => {
           const projectile = this.projectiles.create(Mobs_create.x, Mobs_create.y, 'projectile');
           const angle = Phaser.Math.Angle.Between(Mobs_create.x, Mobs_create.y, this.player.x, this.player.y);
           projectile.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
   
           this.time.delayedCall(2000, function () {
               projectile.destroy();
           }, [], this);
       }
   });
  
   // CREATION MOB HAUT BAS
   this.mob1 = this.physics.add.group();
   this.projectiles = this.physics.add.group();
   
   this.Mobs1 = this.map3.getObjectLayer('upMob');
   this.Mobs1.objects.forEach((Mobs1) => {
       const Mobs_create1 = this.physics.add.sprite(Mobs1.x + 16, Mobs1.y + 16, 'basMob');
       this.tweens.add({
           targets: Mobs_create1,
           y: Mobs1.y + 206,
           duration: 1500,
           yoyo: true,
           repeat: -1
       });
       this.mob1.add(Mobs_create1);
   
       const timer = this.time.addEvent({
           delay: 1500,
           callback: () => {
               const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, Mobs_create1.x, Mobs_create1.y);
               if (distance <= 300) {
                   Mobs_create1.fireProjectile();
               }
           },
           loop: true
       });
   
       Mobs_create1.fireProjectile = () => {
           const projectile = this.projectiles.create(Mobs_create1.x, Mobs_create1.y, 'projectile');
           const angle = Phaser.Math.Angle.Between(Mobs_create1.x, Mobs_create1.y, this.player.x, this.player.y);
           projectile.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
   
           this.time.delayedCall(2000, function () {
               projectile.destroy();
           }, [], this);
       }
   });



   // this.boss = this.physics.add.sprite(1569, 767, 'boss');

    // Create NPC sprite and enable physics
    this.npc = this.physics.add.staticSprite(650, 420, 'npc');


    // Ajouter un groupe pour les projectiles du boss
    this.projectiles = this.physics.add.group();


    // Définir les propriétés du boss
    this.bossSpeed = 10;
    this.bossAttackInterval = 2000;
    this.bossAttackTimer = 0;

    // Create cursors object for player movement
    this.cursorsUp = this.input.keyboard.addKey('Z');
    this.cursorsLeft = this.input.keyboard.addKey('Q')
    this.cursorsRight = this.input.keyboard.addKey('D')
    this.cursorsDown = this.input.keyboard.addKey('S')

    // Create interact button
    this.interactButton = this.input.keyboard.addKey('E');
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);



    // Create attack button
     this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
     this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);



    // Create player sprite and enable physics
    // Look if which door we pass
    console.log(this.porteSerre);
    if (this.porteSerre == true){
        console.log("ChangeLevelSimple");
        this.player = this.physics.add.sprite(62, 829, 'player');
        this.player.setCollideWorldBounds(true);
        this.porteSerre = false;
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
    this.physics.add.collider(this.player, this.murSerre);
    
    //this.physics.add.collider(this.mob, this.attaque_sword, this.kill_mob, null, this);
    this.physics.add.collider(this.player, this.mob, this.pertePvs, null, this);
    this.physics.add.collider(this.player, this.mob1, this.pertePvs, null, this);
    this.physics.add.collider(this.player, this.loot);
    this.physics.add.collider(this.player, this.pot);
    this.physics.add.collider(this.pot, this.murSerre);
    this.physics.add.collider(this.mob, this.murSerre);
    this.physics.add.collider(this.projectiles, this.murSerre);
    this.physics.add.collider(this.projectiles, this.pot);
    this.physics.add.collider(this.mob, this.lance_pierre, this.recupLp, null, this);  

    // Set up overlap between player and npc for interaction
    this.physics.add.overlap(this.player, this.npc, this.checkSpeak.bind(this));

    // Attaque (touche entre epee et mob pour les tuer)
   /* this.physics.add.overlap(this.attaque_sword_left, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.mob, this.hitMonster, null, this);

    this.physics.add.overlap(this.attaque_sword_left, this.mob1, this.hitMonster1, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.mob1, this.hitMonster, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.mob1, this.hitMonster1, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.mob1, this.hitMonster1, null, this);

    this.physics.add.overlap(this.cailloux, this.mob, this.hitMonster, null, this);
    this.physics.add.overlap(this.cailloux, this.mob1, this.hitMonster1, null, this);
/*
    // Attaque contre le boss
    this.physics.add.overlap(this.attaque_sword_left, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.boss, this.hitBoss, null, this);
    this.physics.add.overlap(this.cailloux, this.boss, this.hitBoss, null, this);
*/
    // Coup epee contre pot pour detruire
    this.physics.add.overlap(this.attaque_sword_left, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.attaque_sword_right, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.attaque_sword_up, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.attaque_sword_down, this.pot, this.hitPot, null, this);
    this.physics.add.overlap(this.player, this.lance_pierre, this.recupLp, null, this);
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

    this.hauteur = this.map3.createLayer('haut', this.tileset3);


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


    this.input.keyboard.on('keydown-A', () => {
        // Vérification que le joueur a la capacité de lancer un projectile
        if (this.attack_lp == true) {
            // Création d'un nouveau projectile autour du joueur
            this.cailloux = this.physics.add.sprite(this.player.x, this.player.y, 'projectile');
            
            // Définition de la vitesse du projectile en fonction du dernier côté vers lequel le joueur a marché
            if (this.faceLeft == true) {
                this.cailloux.setVelocityX(-500);
            }  else if (this.faceRight == true) {
                this.cailloux.setVelocityX(500);
            } else if (this.faceUp == true) {
                this.cailloux.setVelocityY(-500);
            } else if (this.faceDown == true) {
                this.cailloux.setVelocityY(500);
            }
            
            // Suppression du projectile après un certain temps
            const temps_de_vie = 1000;
            this.time.delayedCall(temps_de_vie, () => {
                this.cailloux.destroy();
            });
        }
    });


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

  /*  
    // Définir un délai minimum entre les mouvements du boss (en millisecondes)
    const minMoveDelay = 6000;

    if (this.player.x >1425 && this.player.y < 1066)
        this.physics.moveToObject(this.boss, this.player, 50);

     // Attaques régulières du boss
     if (time > this.bossAttackTimer + this.bossAttackInterval) {
         this.bossAttackTimer = time;
         this.fireProjectileBoss();
    }

*/

}
    //_____________________________________________________________________________________________________________


    //FONCTIONS

    /*
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


    fireProjectileBoss() {
        // Ajouter un projectile qui va vers le joueur
        var projectile = this.projectiles.create(this.boss.x, this.boss.y, 'projectile');
        var angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
        projectile.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);

        // Détruire le projectile après 3 secondes
        this.time.delayedCall(1500, function () {
            projectile.destroy();
        }, [], this);
    }

*/
    fireProjectile() {
        // Ajouter un projectile qui va vers le joueur
        var projectile = this.projectiles.create(this.Mob1.x, this.Mob1.y, 'projectile');
        var angle = Phaser.Math.Angle.Between(this.Mob1.x, this.Mob1.y, this.player.x, this.player.y);
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
        if (this.pvs == 3){
            this.fullLife.visible = true;
            this.midLife.visible = false;
            this.lowLife.visible = false;
        }
        if (this.pvs == 2){
            this.fullLife.visible = false;
            this.midLife.visible = true;
            this.lowLife.visible = false;
        }
        if (this.pvs == 1){
            this.fullLife.visible = false;
            this.midLife.visible = false;
            this.lowLife.visible = true;
        }
        setTimeout(() => {
            player.clearTint(); // Remettre la teinte du sprite à sa couleur d'origine
            player.body.enable = true; // Réactiver la physique du joueur
        }, 2000); 
    }

    
    hitMonster(attaque_sword, mob) {
        if (attaque_sword == true);
            this.x = this.mob.x;
            this.y = this.mob.y;
            this.mob.disableBody(true, true);
            this.attaque_sword.disableBody(true, true);
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

    hitMonster1(attaque_sword, mob) {
        if (attaque_sword == true);
            this.x = this.mob1.x;
            this.y = this.mob1.y;
            this.mob1.disableBody(true, true);
            this.attaque_sword.disableBody(true, true);
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

    recupLp(player, lance_pierre) {
        lance_pierre.disableBody(true, true);
        this.attack_lp = true;
        console.log ("C'est ok, c'est bat, c'est in")
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
        
        this.scene.start('Jardin', {exitDonjon1 : true});

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