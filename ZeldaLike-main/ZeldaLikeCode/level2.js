Level2


class Level2 extends Phaser.Scene {

    constructor() {
      super({ key: 'level2' });
    }
  
    preload() {
      this.load.image('player', 'assets/player.png');
      this.load.image('npc', 'assets/npc.png');
      this.load.image('mob', 'assets/mob.png');
      this.load.image('background', 'assets/fond 2.png');
    }
  


    create() {
     // Integration du background
     this.add.image(0,0, 'fond 1').setOrigin(0, 0);
     // Create player sprite and enable physics
     player = this.physics.add.sprite(100, 450, 'player');
     player.setCollideWorldBounds(true);

     // Create NPC sprite and enable physics
     npc = this.physics.add.staticSprite(700, 450, 'npc');
     //npc.setCollideWorldBounds(true);

     // Create NPC sprite and enable physics
     mob = this.physics.add.sprite(300, 450, 'mob');
     mob.setCollideWorldBounds(true);

     // Create cursors object for player movement
     cursorsUp = this.input.keyboard.addKey('Z');
     cursorsLeft = this.input.keyboard.addKey('Q')
     cursorsRight = this.input.keyboard.addKey('D')
     cursorsDown = this.input.keyboard.addKey('S')

     // Create interact button
     interactButton = this.input.keyboard.addKey('E');

     // Create attack button
     attackButton = this.input.keyboard.addKey('SPACE');

     // Create dialogue box and text
     dialogueBox = this.add.graphics();
     dialogueBox.fillStyle(0x222222, 0.8);
     dialogueBox.fillRect(50, 50, 700, 100);
     dialogueText = this.add.text(100, 70, '', { font: '24px Arial', fill: '#ffffff' });
     dialogueText.setWordWrapWidth(600);

     // Set up collision between player and npc
     this.physics.add.collider(player, mob);
     //this.physics.add.collider(player, npc);

     
     // Set up overlap between player and npc for interaction
     this.physics.add.overlap(player, npc, showDialogue);

     // Set up overlap between player and mob for attack
     this.physics.add.overlap(player, mob, showAttack);

     // Detecter la collision entre le bord du monde et le perso pour load la nouvelle map
     this.physics.world.setBoundsCollision(true, true, true, true);
     this.physics.world.on('worldbounds', function(body) {
         if (body.gameObject === player && body.blocked.right) {
             changeLevel.call(this);
         }
     }, this);


 }






    update() {
     // Player movement
     if (cursorsLeft.isDown) {
         player.setVelocityX(-160);
     } else if (cursorsRight.isDown) {
         player.setVelocityX(160);
     } else {
         player.setVelocityX(0);
     }
     
     if (cursorsUp.isDown) {
         player.setVelocityY(-160);
     } else if (cursorsDown.isDown) {
         player.setVelocityY(160);
     } 
     else {
         player.setVelocityY(0);
     }

     // Player jumping
     if (cursorsUp.isDown && player.body.touching.down) {
         player.setVelocityY(-330);
     }

     // Hide dialogue box when interact button is released
     if (Phaser.Input.Keyboard.JustUp(interactButton)) {
         dialogueBox.visible = false;
         dialogueText.setText('');
     }
 }
      /*// Ajouter un détecteur de collision avec les bords du monde pour charger le niveau suivant
      this.physics.world.setBoundsCollision(true, true, true, true);
      this.physics.world.on('worldbounds', function(body) {
        if (body.gameObject === player && body.blocked.right) {
          this.scene.start('Level3');
        }
      }, this);*/
    }
