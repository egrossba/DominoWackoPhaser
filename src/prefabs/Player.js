class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(){
        this.setOrigin(0.5).setScale(0.75);
        this.body.allowGravity = false;
        this.body.setCollideWorldBounds();
        this.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        this.isMoving = false;
        this.hasBall = false;
        this.launched = false;
        this.invuln = false;
        this.gotHit = false;
    }


    update() {

        // Move side to side
        if(wCombo){
            this.setVelocity(0, -VELOCITY);
        }
        else if(sCombo){
            this.setVelocity(0, VELOCITY);
        }
        else if(aCombo){
            this.setVelocity(-VELOCITY, 0);
        }
        else if(dCombo){
            this.setVelocity(VELOCITY, 0);
        }
        else if(wdCombo){
            this.setVelocity(DIAG_VEL, -DIAG_VEL);
        }
        else if(waCombo){
            this.setVelocity(-DIAG_VEL, -DIAG_VEL);
        }
        else if(sdCombo){
            this.setVelocity(DIAG_VEL, DIAG_VEL);
        }
        else if(saCombo){
            this.setVelocity(-DIAG_VEL, DIAG_VEL);
        }
        else{
            this.setVelocity(0);
        }

        // aim
        this.rotation = Phaser.Math.TAU + Phaser.Math.Angle.Between(this.x, this.y, 
            pointer.worldX, pointer.worldY);

    }

    takeHit(){
        if(!this.launched && !this.gotHit && !this.invuln){
            this.scene.cameras.main.shake(100, 0.015);
            this.setAlpha(0.5);
            this.setTint(0xFF7878);
            this.gotHit = true;
            this.scene.time.delayedCall(1000, () => { 
                this.setAlpha(1);
                this.clearTint();
                this.gotHit = false;
            });
        }
    }
}
