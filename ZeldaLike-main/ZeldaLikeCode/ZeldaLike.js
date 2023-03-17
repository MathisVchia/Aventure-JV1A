    var game = new Phaser.Game(config);

    var player;
    var npc;
    var mob;
    var cursorsUp;
    var cursorsLeft;
    var cursorsRight;
    var cursorsDown;


class ZeldaLike extends Phaser.Scene{

    constructor(){
        super("chambre");
    }

    preload(){
        this.load.image('player', 'assets/player.png');
        this.load.image('npc', 'assets/npc.png');
        this.load.image('mob', 'assets/mob.png');
        this.load.image('fond 1', 'assets/fond 1.png');
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
        this.interactButton = this.input.keyboard.addKey('E');


        // Create attack button
        this.attackButton = this.input.keyboard.addKey('SPACE');








        // Create dialogue box and text
        this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x222222, 0.8);
        this.dialogueBox.fillRect(50, 50, 700, 100);
        this.dialogueText = this.add.text(100, 70, '', { font: '24px Arial', fill: '#ffffff' });
        this.dialogueText.setWordWrapWidth(600);


        // Set up collision between player and npc
        this.physics.add.collider(player, mob);
        //this.physics.add.collider(player, npc);

        
        // Set up overlap between player and npc for interaction
        this.physics.add.overlap(player, npc, this.showDialogue);


        // Set up overlap between player and mob for attack
        this.physics.add.overlap(player, mob, this.showAttack);


        // Detecter la collision entre le bord du monde et le perso pour load la nouvelle map
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.on('worldbounds', function(body) {
            if (body.blocked.right) {
                this.changeLevel();
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


        if (player.y <= 50){
            this.scenelevel2();
        };
    }

    scenelevel2(){
        this.scene.start("level2")
    }
    
}
        /*// Hide dialogue box when interact button is released
        if (Phaser.Input.Keyboard.JustUp(interactButton)) {
            dialogueBox.visible = false;
            dialogueText.setText('');
        }
    }

    showAttack(){
        // Generate sentence attack
        var attackTxt = [
            "Tu attaques !"
        ];
        // var attack = attackTxt[randomIndex];

        // Show the sentence when attack is true
        if (Phaser.Input.Keyboard.JustUp(attackButton)) {
            dialogueBox.visible = true;
            dialogueText.setText(attackTxt);
            mob.visible = false;
        }
    }
    showDialogue() {
        // Generate a random dialogue
        var dialogue = [
            "Ah tu es enfin là!",
        ];
        //var randomIndex = Math.floor(Math.random() * dialogues.length);
        //var dialogue = dialogues[randomIndex];

        // Show dialogue box and text
        if (Phaser.Input.Keyboard.JustUp(interactButton)) {
            dialogueBox.visible = true;
            dialogueText.setText(dialogue);

        }
    }

    // Faire en sorte que tout despawn pour changer de niveau

    changeLevel(){
        this.player.destroy();
        this.npc.destroy();
        this.mob.destroy();

        if (player.setCollideWorldBounds(true)){
                //this.scene.stop();
                this.scene.start('level2');
            }

        // Créer un nouveau joueur dans le nouveau niveau
        player = this.physics.add.sprite(100, 450, 'player');
        player.setCollideWorldBounds(true);
            

        // Mettre à jour la caméra pour suivre le joueur dans le nouveau niveau
        this.cameras.main.startFollow(player);

        }
 */







class level2 extends Phaser.Scene{
    constructor(){
        super("level2");
    }

    init(data){this.position=data.positionZeldaLike;}

    preload(){
        this.load.image('player', 'assets/player.png');
        this.load.image('fond 2', 'assets/fond 2.png');
    }

    create(){
        // Integration du background
        this.add.image(0,0, 'fond 2').setOrigin(0, 0);


        // Create player sprite and enable physics
        player = this.physics.add.sprite(100, 450, 'player');
        player.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        //npc = this.physics.add.staticSprite(700, 450, 'npc');
        //npc.setCollideWorldBounds(true);


        // Create NPC sprite and enable physics
        //mob = this.physics.add.sprite(300, 450, 'mob');
        //mob.setCollideWorldBounds(true);


        // Create cursors object for player movement
        cursorsUp = this.input.keyboard.addKey('Z');
        cursorsLeft = this.input.keyboard.addKey('Q')
        cursorsRight = this.input.keyboard.addKey('D')
        cursorsDown = this.input.keyboard.addKey('S')






        // Create interact button
        //interactButton = this.input.keyboard.addKey('E');


        // Create attack button
        //attackButton = this.input.keyboard.addKey('SPACE');

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


        if (player.y <= 50){
            this.scenelevel2();
        };

        

}
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ZeldaLike,level2],
};

new Phaser.Game(config);