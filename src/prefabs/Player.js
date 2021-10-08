class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(){
        this.setOrigin(0.5).setScale(0.1);
        this.body.allowGravity = false;
        this.body.setCollideWorldBounds();
        this.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        this.isMoving = false;
        this.isDashing = false;
        this.dashes = 2;
        this.hasBall = false;
        this.launched = false;
        this.invuln = false;
        this.gotHit = false;
    }


    update() {

        // Move side to side
        if(!this.isDashing){
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
        }

        // aim
        this.rotation = Phaser.Math.TAU + Phaser.Math.Angle.Between(this.x, this.y, 
            pointer.worldX, pointer.worldY);

        // Dash

        // Check and execute combo (need to check if touching)
        if(validCombo && this.dashes > 0 && Phaser.Input.Keyboard.JustDown(spacebar)){
            this.isDashing = true;
            if(wCombo){
                this.setVelocity(0, -DASH_VELOCITY);
            }
            else if(sCombo){
                this.setVelocity(0, DASH_VELOCITY);
            }
            else if(aCombo){
                this.setVelocity(-DASH_VELOCITY, 0);
            }
            else if(dCombo){
                this.setVelocity(DASH_VELOCITY, 0);
            }
            else if(wdCombo){
                this.setVelocity(DIAG_DASH, -DIAG_DASH);
            }
            else if(waCombo){
                this.setVelocity(-DIAG_DASH, -DIAG_DASH);
            }
            else if(sdCombo){
                this.setVelocity(DIAG_DASH, DIAG_DASH);
            }
            else if(saCombo){
                this.setVelocity(-DIAG_DASH, DIAG_DASH);
            }
            this.scene.time.delayedCall(DASH_TIME + DASH_TIME*!this.hasBall, () => { 
                this.setVelocity(0);
                //this.dashes--;
            });
            this.scene.time.delayedCall(DASH_TIME + DASH_TIME*!this.hasBall + 200, () => { 
                this.isDashing = false;
            });
        }

        // Invuln on throw
        if(this.launched == true){
            this.hasBall = false;
            this.scene.time.delayedCall(300, () => { 
                this.launched = false;
            });
        }
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
