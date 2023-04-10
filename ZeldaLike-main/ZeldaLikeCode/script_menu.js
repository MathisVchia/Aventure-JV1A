export class menu extends Phaser.Scene {
    
    constructor(){
        super("menu");
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

    upload(){

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