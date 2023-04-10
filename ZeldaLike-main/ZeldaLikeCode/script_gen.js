import {menu} from "./script_menu.js"
import {chambre} from "./script_chambre.js"
import {Jardin} from "./script_jardin.js"
import {donjon1} from "./script_donjon1.js"
import {donjon2} from "./script_donjon2.js";


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
    input:{gamepad:true},
    scene: [menu, chambre, Jardin, donjon1, donjon2],
};

new Phaser.Game(config);
