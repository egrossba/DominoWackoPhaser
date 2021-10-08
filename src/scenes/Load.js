class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // take care of all of our asset loading now
        this.load.image('clayball', 'clayball.png');
        this.load.image('bunny', 'bunny.png');
        this.load.image('reticle', 'reticle.png');
        this.load.image('bounceBoard', 'Board-01.png');
        this.load.image('deadBoard', 'Board-02.png');
        this.load.image('hole', 'hole.png');
        this.load.image('gMonster', 'GreenMonster.png');
        this.load.image('rMonster', 'RedMonster.png');
        this.load.image('bg', 'bg.png');
    }

    create() {
        this.input.setDefaultCursor('url(assets/reticle.png), pointer');
        this.cameras.main.fadeIn(1000);

        this.scene.start('demoScene');
    }
}