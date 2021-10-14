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
        
        // creating all the assets

        player = new Player(this, game.config.width/2, game.config.height*3/4, 'MC');
        player.init();

        this.ball = new Ball(this, game.config.width/2, game.config.height/2, 'laser').setAlpha(0);
        this.ball.init();
        
        this.holesGroup = this.add.group();
        for(let i = 0; i < 4; i++){
            let temp = new Hole(this, 200 + i*100, game.config.height/3, 'hole');
            temp.init();
            this.holesGroup.add(temp);
        }

        // spawning the slime monsters, tagging them as such
        this.monsterGroup = this.add.group();
        for(let i = 0; i < 2; i++){
            let temp = new Monster(this, 200 + i*100, game.config.height/3, 'gMonster');
            temp.init();
            temp.race = 'green';
            this.monsterGroup.add(temp);
        }

        // spawning the wolf monsters, tagging them as such
        for(let i = 2; i < 4; i++){
            let temp = new Monster(this, 200 + i*100, game.config.height/3, 'wolf');
            temp.init();
            temp.race = 'wolf';
            this.monsterGroup.add(temp);
        }
        this.monsterGroup.runChildUpdate = true;

        this.gTwins = 0;
        this.wTwins = 0;
        this.cTwins = 0;

        this.layer.add(this.holesGroup.getChildren());
        this.layer.add(this.ball);
        this.layer.add(player);
        this.layer.add(this.monsterGroup.getChildren());

        this.gameOver = 0;
        this.chimCount = 0;

        this.setColliders();
    }

    update(){
        // movement combos
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

        // shoot mechanic, respawns ball
        if(!this.ball.launched && pointer.leftButtonDown()){
            this.ball.launched = true;
            this.ball.setAlpha(1);
            this.physics.moveTo(this.ball, pointer.worldX, pointer.worldY, FAST);
            this.time.delayedCall(500, () => { 
                this.ball.setAlpha(0);
                this.ball.launched = false;
                this.ball.body.enable = true;
            });
        }

        // if at any point both twins are stunned, kill them
        if(this.gTwins == 2){
            this.gTwins = 0;
            this.monsterGroup.children.each(function(m) {
                if(m.race == 'green'){
                    m.destroy();
                }
            });
        }
        if(this.wTwins == 2){
            this.wTwins = 0;
            this.monsterGroup.children.each(function(m) {
                if(m.race == 'wolf'){
                    m.destroy();
                }
            });
        }
        if(this.cTwins == 2){
            this.cTwins = 0;
            this.chimCount = 0;
            this.monsterGroup.children.each(function(m) {
                if(m.race == 'greenwolf'){
                    m.destroy();
                }
            });
        }

        // if player places all 4 dominoes, end the game
        if(this.gameOver == 4){
            this.scene.start('demoScene');
        }
    }

    setColliders(){
        // if the player walks over holes, place a dominoe
        this.physics.add.overlap(player, this.holesGroup, (p, h) => {
            if(!h.placed){
                h.dominote();
                this.gameOver++;
                this.monsterGroup.children.each(function(m) {
                    if(!m.race == 'green'){
                        m.chasing = false;
                        m.break(h);
                    }
                });
            }
        });
        // if a monster walks over a hole, despawn the dominoe
        this.physics.add.overlap(this.monsterGroup, this.holesGroup, (m, h) => {
            if(h.placed){
                h.dedominote();
                this.gameOver--;
                this.monsterGroup.children.each(function(m) {
                    if(!m.race == 'green'){
                        m.chasing = true;
                    }
                });
            }
        });
        // shooting monsters
        this.physics.add.collider(this.ball, this.monsterGroup, (b, m) => {
            if(b.launched && !m.gotHit){
                // depending on the race, increment the number of ones stunned
                if(m.race == 'green'){
                    this.gTwins++;
                }
                else if(m.race == 'wolf'){
                    this.wTwins++;
                }
                else{
                    this.cTwins++;
                }
                // stun the monster
                m.gotHit = true;
                m.setVelocity(0);
                m.setAlpha(0.5);
                // if one monster of each type is stunned, spawn chimera
                if(this.gTwins == 1 && this.wTwins == 1){
                    if(this.chimCount < 2){
                        this.spawnChimera();
                    }
                }
                // un-stun the monster after a certain time, decrement number of ones stunned
                this.time.delayedCall(750, () => { 
                    m.setAlpha(1);
                    m.gotHit = false;
                    if(m.race == 'green'){
                        this.gTwins--;
                    }
                    else if(m.race == 'wolf'){
                        this.wTwins--;
                    }
                    else if(this.cTwins != 0){
                        this.cTwins--;
                    }
                });
            }
            b.setAlpha(0);
            b.body.enable = false;
        });
        // end the game if the player touches a monster
        this.physics.add.collider(this.monsterGroup, player, (m, p) => {
            this.gameOver = 4;
        });
    }

    // spawn chimera
    spawnChimera(){
        // spawn first sprite if first chimera, second if second one to spawn
        let name = 'chim1'
        if(this.chimCount % 2 == 0){
            name = 'chim2'
        }
        // make sure to tag it as proper race
        let temp = new Monster(this, game.config.width/2, game.config.height/3, name);
        temp.init();
        temp.race = 'greenwolf';
        this.monsterGroup.add(temp);
        this.chimCount++;
    }
}
