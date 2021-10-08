class Demo extends Phaser.Scene {
    constructor() {
        super('demoScene');
    }

    create() {
        this.add.sprite(0, 0, 'bg').setOrigin(0).setScale(7.5);
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

        this.monsterGroup = this.add.group();
        for(let i = 0; i < 2; i++){
            let temp = new Monster(this, 200 + i*100, game.config.height/3, 'gMonster');
            temp.init();
            temp.green = true;
            this.monsterGroup.add(temp);
        }
        for(let i = 2; i < 4; i++){
            let temp = new Monster(this, 200 + i*100, game.config.height/3, 'rMonster');
            temp.init();
            this.monsterGroup.add(temp);
        }
        this.monsterGroup.runChildUpdate = true;
        this.gTwins = 0;
        this.rTwins = 0;

        this.layer.add(this.holesGroup.getChildren());
        this.layer.add(this.ball);
        this.layer.add(player);
        this.layer.add(this.monsterGroup.getChildren());

        this.gameOver = 0;

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

        if(pointer.leftButtonDown()){
            this.ball.launched = true;
            this.ball.setAlpha(1);
            this.physics.moveTo(this.ball, pointer.worldX, pointer.worldY, FAST);
            this.time.delayedCall(500, () => { 
                this.ball.setAlpha(0);
                this.ball.launched = false;
            });
        }

        if(this.gTwins == 2){
            this.monsterGroup.children.each(function(m) {
                if(m.green){
                    m.destroy();
                }
            });
        }
        else if(this.rTwins == 2){
            this.monsterGroup.children.each(function(m) {
                if(!m.green){
                    m.destroy();
                }
            });
        }

        if(this.gameOver == 4){
            this.scene.start('demoScene');
        }
    }

    setColliders(){
        this.physics.add.overlap(player, this.holesGroup, (p, h) => {
            if(!h.placed){
                h.dominote();
                this.gameOver++;
            }
        });

        this.physics.add.overlap(this.monsterGroup, this.holesGroup, (m, h) => {
            if(h.placed){
                h.dedominote();
                this.gameOver--;
            }
        });

        this.physics.add.collider(this.ball, this.monsterGroup, (b, m) => {
            if(b.launched){
                if(m.green){
                    this.gTwins++;
                }
                else{
                    this.rTwins++;
                }
                m.gotHit = true;
                m.setVelocity(0);
                m.setAlpha(0.5);
                this.time.delayedCall(1000, () => { 
                    m.setAlpha(1);
                    m.gotHit = false;
                    if(m.green){
                        this.gTwins--;
                    }
                    else{
                        this.rTwins--;
                    }
                });
            }
            b.launched = false;
        });

        this.physics.add.collider(this.monsterGroup, player, (m, p) => {
            this.gameOver = 4;
        });
    }
}
