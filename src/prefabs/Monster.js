class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(){
        this.setOrigin(0.5).setScale(0.75);
        this.body.setImmovable(true);
        this.gotHit = false;
        this.chasing = true;
        this.race = '';
    }


    update() {
        // if(!this.gotHit && this.chasing){
        //     this.scene.physics.moveTo(this, player.x, player.y, SLOW);
        // }
    }

    break(hole){
        this.scene.physics.moveTo(this, hole.x, hole.y, SLOW);
    }

}