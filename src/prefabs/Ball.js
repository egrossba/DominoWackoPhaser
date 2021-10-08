class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(){
        this.setOrigin(0.5).setScale(0.4);
        this.body.useDamping = true;
        this.body.setCollideWorldBounds();
        this.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        this.launched = false;
    }


    update() {
        if(!this.launched){
            this.x = player.x;
            this.y = player.y;
        }
    }

}