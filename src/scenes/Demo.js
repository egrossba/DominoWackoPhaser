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

        this.ball = new Ball(this, game.config.width/2, game.config.height/2, 'clayball').setAlpha(0);
        this.ball.init();
        
        this.holesGroup = this.add.group();
        for(let i = 0; i < 4; i++){
            let temp = new Hole(this, 200 + i*100, game.config.height/3, 'hole');
            temp.init();
            this.holesGroup.add(temp);
        }

        this.monster = new Monster(this, game.config.width/3, game.config.height/3, 'gMonster');
        this.monster.init();

        this.layer.add(this.holesGroup.getChildren());
        this.layer.add(this.ball);
        this.layer.add(player);
        this.layer.add(this.monster);

        this.setColliders();
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

        if(!this.monster.gotHit){
            this.physics.moveTo(this.monster, player.x, player.y, SLOW);
        }

        if(pointer.leftButtonDown()){
            this.ball.launched = true;
            this.ball.setAlpha(1);
            this.physics.moveTo(this.ball, pointer.worldX, pointer.worldY, FAST);
            this.time.delayedCall(500, () => { 
                this.ball.setAlpha(0);
                this.ball.launched = false;
            });
        }
    }

    setColliders(){
        this.physics.add.overlap(player, this.holesGroup, (p, h) => {
            h.dominote();
        });

        this.physics.add.overlap(this.monster, this.holesGroup, (m, h) => {
            h.dedominote();
        });

        this.physics.add.collider(this.ball, this.monster, (b, m) => {
            if(b.launched){
                m.gotHit = true;
                m.setVelocity(0);
                m.setTint(0xFF7878);
            }
            
            this.time.delayedCall(1000, () => { 
                m.clearTint();
                m.gotHit = false;
            });
        });
    }
}
