class Demo extends Phaser.Scene {
    constructor() {
        super('demoScene');
    }

    create() {
        this.input.mouse.disableContextMenu();
        this.layer = this.add.layer();

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    
        player = new Player(this, game.config.width/2, game.config.height/2, 'bunny');
        player.init();
        this.layer.add(player);

        this.ball = new Ball(this, game.config.width/2, game.config.height/2, 'clayball').setAlpha(0);
        this.ball.init();
        this.layer.add(this.ball);
    }

    update(){
        // combos
        wCombo = keyW.isDown && !keyA.isDown && !keyD.isDown && !keyS.isDown;
        sCombo = !keyW.isDown && !keyA.isDown && !keyD.isDown && keyS.isDown;
        aCombo = !keyW.isDown && keyA.isDown && !keyD.isDown && !keyS.isDown;
        dCombo = !keyW.isDown && !keyA.isDown && keyD.isDown && !keyS.isDown;
        wdCombo = keyW.isDown && !keyA.isDown && keyD.isDown && !keyS.isDown;
        waCombo = keyW.isDown && keyA.isDown && !keyD.isDown && !keyS.isDown;
        sdCombo = !keyW.isDown && !keyA.isDown && keyD.isDown && keyS.isDown;
        saCombo = !keyW.isDown && keyA.isDown && !keyD.isDown && keyS.isDown;
        validCombo = wCombo || sCombo || aCombo || dCombo || wdCombo || waCombo || sdCombo || saCombo;

        // move player
        player.update();
        this.ball.update();

        if(pointer.leftButtonDown()){
            this.ball.x = player.x;
            this.ball.y = player.y;
            this.ball.setAlpha(1);
            this.physics.moveTo(this.ball, pointer.worldX, pointer.worldY, FAST);
            this.time.delayedCall(500, () => { 
                this.ball.setAlpha(0);
            });
        }
    }
}
