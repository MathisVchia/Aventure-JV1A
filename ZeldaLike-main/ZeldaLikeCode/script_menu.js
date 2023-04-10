export class menu extends Phaser.Scene {
    
    constructor(){
        super("menu");
        this.start;
        this.boutonStart; // déclarer la variable ici
        this.startSpawn = false;
    }

    preload(){
        this.load.image('MenuFond', 'assets/logo ats.png');
    }

    create(){

        // ajouter l'image de fond
        this.menu = this.add.image(0, 0, 'MenuFond').setOrigin(0, 0);


        // ajouter l'interaction avec le bouton ici
        this.menu.setInteractive();
        this.menu.on('pointerdown', () => {
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