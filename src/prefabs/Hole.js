class Hole extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(){
        this.setOrigin(0.5).setScale(1);
        this.dominoe = this.scene.add.sprite(this.x, this.y, 'dominoe').setAlpha(0).setScale(1.25);
        this.placed = false;
    }


    update() {

    }

    dominote(){
        // put a dominoe over the hole
        this.dominoe.setAlpha(1);
        this.placed = true;
    }

    dedominote(){
        // get rid of the dominoe on the hole
        this.dominoe.setAlpha(0);
        this.placed = false;
    }

}