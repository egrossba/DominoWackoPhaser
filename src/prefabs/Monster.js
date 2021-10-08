class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(){
        this.setOrigin(0.5).setScale(0.75);
        this.body.setImmovable(true).setCollideWorldBounds(true);
        this.gotHit = false;
        this.chasing = true;
        this.race = '';
        this.move();
    }


    update() {
        if(this.x < 200 || this.x > game.config.width - 200 
            || this.y < 100 || this.y > game.config.width*2/3
            || this.body.velocity.x == 0){
            this.move();
        }
    }

    move(){
        if(!this.gotHit && this.chasing){
            this.scene.physics.moveTo(this, Phaser.Math.Between(200, game.config.width - 200), Phaser.Math.Between(100, game.config.height*2/3), SLOW);
        }
    }

    break(hole){
        this.scene.physics.moveTo(this, hole.x, hole.y, SLOW);
    }

}