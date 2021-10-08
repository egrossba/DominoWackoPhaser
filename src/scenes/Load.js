class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // take care of all of our asset loading now
        this.load.image('laser', 'laser.png');
        this.load.image('MC', 'MC.png');
        this.load.image('reticle', 'reticle.png');
        this.load.image('dominoe', 'dominoe.png');
        this.load.image('hole', 'hole.png');
        this.load.image('gMonster', 'GreenMonster.png');
        this.load.image('wolf', 'wolf.png');
        this.load.image('chim1', 'chimera.png');
        this.load.image('chim2', 'chimera2.png');
        this.load.image('bg', 'bg.png');
    }

    create() {
        this.input.setDefaultCursor('url(assets/reticle.png), pointer');
        this.cameras.main.fadeIn(1000);

        this.scene.start('demoScene');
    }
}