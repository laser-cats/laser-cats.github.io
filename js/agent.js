var player, lasers, mice, rats, sumU, x, score, prevScore, maxLasers, maxMice;
var maxRats, data_array, numDeadMice, numDeadRats, player_mid_x, player_mid_y;
var nrow, ncol, tile_w, tile_h, F, currState, prevState, currFeat, prevFeat;
var index1, index2, reward, thetaMax, action;
var gamma = 0.8;
var zai_init = 0.0;
var a_init = 0.01;
var b_init = 0.01;
var c_init = 0.01;
var theta_vec = Array.apply(null, Array(17)).map(Number.prototype.valueOf, 0);
var zai_vec = [];
for(var i=0; i<2301; i++) {
    zai_vec[i] = Array.apply(null, Array(17)).map(Number.prototype.valueOf,zai_init);
}
var a_vec = [];
for(i=0; i<2301; i++) {
    a_vec[i] = Array.apply(null, Array(17)).map(Number.prototype.valueOf,a_init);
}
var b_vec = [];
for(i=0; i<2301; i++) {
    b_vec[i] = Array.apply(null, Array(17)).map(Number.prototype.valueOf,b_init);
}
var c_vec = [];
for(i=0; i<2301; i++) {
    c_vec[i] = Array.apply(null, Array(17)).map(Number.prototype.valueOf, c_init);
}

var Agent = {
    preload: function() {
        game.load.image('background', 'assets/menu.png');
        game.load.spritesheet('cat', 'assets/littleCat.png', 58*1.5, 48*1.5);
        game.load.image('laser', 'assets/Laser.png');
        game.load.spritesheet('mouse', 'assets/smallMice.png', 68*1.5, 44*1.5);
        game.load.spritesheet('rat', 'assets/rats.png', 290*.75, 210*.75);
        game.load.image('star', 'assets/Background_Star2.png');
        game.load.audio('music', ['assets/sounds/music.ogg', 'assets/sounds/music.mp3']);
        game.load.audio('shoot', ['assets/sounds/shoot_laser.ogg', 'assets/sounds/shoot_laser.wav']);
    },

    create: function() {
        music = game.add.audio('music');
        music.loop = true;
        music.play();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        player = game.add.sprite(game.world.width - 150, game.world.height - 150, 'cat');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        lasers = game.add.physicsGroup();
        lasers.createMultiple(30, 'laser', false);
        lasers.setAll('checkWorldBounds', true);
        lasers.setAll('outOfBoundsKill', true);

        mice = game.add.physicsGroup();
        mice.createMultiple(30, 'mouse', false);
        mice.setAll('checkWorldBounds', true);
        mice.setAll('outOfBoundsKill', true);

        rats = game.add.physicsGroup();
        rats.createMultiple(30, 'rat', false);
        rats.setAll('checkWorldBounds', true);
        rats.setAll('outOfBoundsKill', true);

        stars = game.add.group();
        stars.createMultiple(8, 'star', false);

        lives = 99999;
        score = 0;
        prevScore = 0;


        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#FFF'});
        counter = 1;
        player.animations.add('float');
        player.animations.play('float', 1.5, true);
    },

    update: function() {
        scoreText.text = "Score: " + score + "   Lives: " + lives;

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (counter > 1) {
            prevState = currState;
            prevFeat = currFeat;
            index1 = index2;
        }

        currState = Agent.getPositions(player, mice.children, rats.children, lasers.children);
        currFeat = Agent.getFeatures(currState);
        index2 = currFeat.indexOf(1);

        if (counter > 1) {
            var zai1 = zai_vec[index1][action];
            var c1 = c_vec[index1][action];
            var a1 = a_vec[index1][action];
            var b1 = b_vec[index1][action];
            // Find the action that leads to highest expected reward
            // console.log(index2)
            var a_max = Math.max.apply(null, zai_vec[index2]);
            // console.log(zai_vec[index2])
            // console.log(a_max);
            var a_opt = zai_vec[index2].indexOf(a_max);
            //Find values of hyperparameters for R_s'
            var zai2 = zai_vec[index2][a_opt];
            var c2 = c_vec[index2][a_opt];
            var b2 = b_vec[index2][a_opt];
            var a2 = a_vec[index2][a_opt];

            // Compute E[r + gamma*R_s'] and E[(r + gamma*R_s')^2]
            var er = zai2; // E[R]
            var m1 = reward + gamma*er;

            //Update posteriors of the old state-action pair
            zai_vec[index1][action] = (c1*zai1 + m1)/(c1 + 1);
            c_vec[index1][action] = c1 + 1;
            a_vec[index1][action] = a1 + 0.5;
            b_vec[index1][action] = b1 + c1*Math.pow(m1 - zai1,2)/(2*(c1 + 1));

            // Use Q-Sampling to choose action
            for(var i=0; i < 17; i++){
                //Extract the hyperparameters for action i at state index2
                var zai = zai_vec[index2][i];
                var c = c_vec[index2][i];
                var a = a_vec[index2][i];
                var b = b_vec[index2][i];
                // First sample w from Ga(a,b), where b is rate
                var w = gammaRand(a, 1.0/b);
                var theta = normalRand(zai, 1/(c*w));
                // Store the mean for action i
                theta_vec[i] = theta;
            }
        }
        Game.fireLaser();
        if ((currState[2] == null) && (currState[4] == null)){
            if (Math.random() < 0.9){
                this.genMouse();
            }
            else{
                this.genRat();
            }
        }

        game.physics.arcade.overlap(lasers, mice, this.killMouse, null, this);
        game.physics.arcade.overlap(player, mice, this.loseLife, null, this);
        game.physics.arcade.overlap(lasers, rats, this.hitRat, null, this);
        game.physics.arcade.overlap(player, rats, this.ratCollide, null, this);

        for (i = 2; i < currState.length; i++) {
            if (currState[i] > 990) {
                score -= 3;
            }
        }

        thetaMax = Math.max.apply(null, theta_vec);
        action = theta_vec.indexOf(thetaMax);
        reward = score - prevScore;


        // Move Up
        if (action == 0){
            player.body.velocity.y = -500;
        }
        // Move Up-Right
        if (action == 1){
            player.body.velocity.y = -500;
            player.body.velocity.x = 500;
        }
        // Move Right
        if (action == 2){
            player.body.velocity.x = 500;
        }
        // Move Down-Right
        if (action == 3){
            player.body.velocity.y = 500;
            player.body.velocity.x = 500;
        }
        // Move Down
        if (action == 4){
            player.body.velocity.y = 500;
        }
        // Move Down-Left
        if (action == 5){
            player.body.velocity.y = 500;
            player.body.velocity.x = -500;
        }
        // Move Left
        if (action == 6){
            player.body.velocity.x = -500;
        }
        //Move Left-Up
        if (action == 7){
            player.body.velocity.y = -500;
            player.body.velocity.x = -500;
        }
        // Move Plus shift
        // Move Up
        if (action == 8){
            player.body.velocity.y = -1000;
        }
        // Move Up-Right
        if (action == 9){
            player.body.velocity.y = -1000;
            player.body.velocity.x = 1000;
        }
        // Move Right
        if (action == 10){
            player.body.velocity.x = 1000;
        }
        // Move Down-Right
        if (action == 11){
            player.body.velocity.y = 1000;
            player.body.velocity.x = 1000;
        }
        // Move Down
        if (action == 12){
            player.body.velocity.y = 1000;
        }
        // Move Down-Left
        if (action == 13){
            player.body.velocity.y = 1000;
            player.body.velocity.x = -1000;
        }
        // Move Left
        if (action == 14){
            player.body.velocity.x = -1000;
        }
        //Move Left-Up
        if (action == 15){
            player.body.velocity.y = -1000;
            player.body.velocity.x = -1000;
        }
        // If action is 16 do nothing

        counter++;
        prevScore = score;
    },

    fireLaser: function() {
        if (game.time.time > laserTime) {
            laser = lasers.getFirstExists(false);

            if (laser) {
                laser.reset(player.x - 6, player.y + 10);
                laser.body.velocity.x = -1050;
                laserTime = game.time.time + 250;
            }
        }
    },

    genMouse: function() {
        mouse = mice.getFirstExists(false);

        if (mouse) {
            mouse.reset(0, Math.min(Math.random()*game.height, game.height - 100), 'mouse');
            mouse.body.velocity.x = 500;
            mouse.animations.add('attack');
            mouse.animations.play('attack', 1.5, true);
        }
    },

    genRat: function() {
        rat = rats.getFirstExists(false);

        if (rat) {
            rat.reset(0, Math.min(Math.random()*game.height, game.height - 200), 'rat');
            rat.body.velocity.x = 300;
            rat.life = 5;
            rat.immovable = true;
            rat.animations.add('attack');
            rat.animations.play('attack', 1.5, true);
        }
    },

    killMouse: function(laser, mouse) {
        mouse.kill();
        laser.kill();
        score += Math.round((1000 - player.x)/100);
    },

    loseLife: function(player, mouse) {
        mouse.kill();
        score -= 5;
        lives -= 1;
    },

    hitRat: function(laser, rat) {
        rat.life -= 1;
        laser.kill();
        if (rat.life == 0) {
            rat.kill();
            score += Math.round(4 + (1000 - player.x)/100);
        }
    },

    ratCollide: function(player, rat) {
        rat.kill();
        score -= 5;
        lives -= 1;
    },

    getPositions: function(player, mice, rats, lasers) {
        maxLasers = Math.ceil(game.width/(Math.abs(lasers.velocity)*(250/game.width)));
        maxMice = 1;
        maxRats = 1;

        data_array = [];
        data_array.push(player.position.x, player.position.y);
        numDeadMice = 0;
        numDeadRats = 0;

        for (var i = 0; i < mice.length; i++) {
            if (mice[i].alive == true){
                data_array.push(mice[i].position.x, mice[i].position.y);
            }
            else{
                numDeadMice += 1;
            }
        }

        for (i = mice.length - numDeadMice; i < maxMice; i++) {
            data_array.push(null, null);
        }

        for (i = 0; i < rats.length; i++) {
            if(rats[i].alive == true){
                data_array.push(rats[i].position.x, rats[i].position.y);
            }
            else{
                numDeadRats += 1;
            }
        }

        for (i = rats.length - numDeadRats; i < maxRats; i++) {
            data_array.push(null, null);
        }

        for (i = 0; i < lasers.length; i++) {
            data_array.push(lasers[i].position.x, lasers[i].position.y);
        }

        for (i = rats.length; i < maxLasers; i++) {
            data_array.push(null, null);
        }
        return data_array;
    },

    getFeatures: function(pos) {
        player_mid_x = pos[0] + 95;
        player_mid_y = pos[1] + 85;
        tile_w = 40;
        tile_h = 25;
        nrow = 46;
        ncol = 50;
        F = Array.apply(null, Array(nrow*ncol + 1)).map(Number.prototype.valueOf,0);
        maxMice = 1;
        if(pos[2] || pos[2*maxMice+2]) {
            var max = Math.max(pos[2],pos[2*maxMice+2]);
            if (max == pos[2]){
                var mouseX = pos[2];
                var mouseY = pos[3];
            }
            else{
                mouseX = pos[2*maxMice+2];
                mouseY = pos[2*maxMice+3];
            }
            var mouse_mid_x = mouseX + 51;
            var mouse_mid_y = mouseY + 44;
            var xDist = player_mid_x - mouse_mid_x;
            var yDist = player_mid_y - mouse_mid_y;
            var xCoord = Math.floor(xDist / tile_w);
            var yCoord = Math.floor(yDist / tile_h);
            var xCoord1 = xCoord + ncol / 2;
            var yCoord1 = yCoord + nrow / 2;
            F[yCoord1 * ncol + xCoord1] = 1;
        } else {
            F[nrow*ncol] = 1;
        }
        //console.log(F.indexOf(1));
        return F;
    }
};

//THE NORMAL AND GAMMA RANDOM NUMBER GENERATORS FOR AI

var normalRand = function (mu, sig) {
    var u = [];
    for (var i = 0, n = 12; i < n; i++) {
        u.push(Math.random())
    }
    sumU = u.reduce(function (a, b) {
        return a + b;
    });
    x = sig * (sumU - 6) + mu;
    return x;
};


var gammaRand = function (shape, scale) {
    if (shape >= 1.0) {
        var d = shape - 1.0 / 3.0;
        var c = 1.0 / Math.sqrt(9.0 * d);
        while (true) {
            var x = normalRand(0, 1);
            var v = 1.0 + c * x;
            while (v <= 0.0) {
                x = normalRand(0, 1);
                v = 1.0 + c * x;
            }
            v = v * v * v;
            var u = Math.random();
            var xsq = x * x;
            if (u < 1.0 - .0331 * xsq * xsq || Math.log(u) < 0.5 * xsq + d * (1.0 - v + Math.log(v))) {
                return scale * d * v;
            }
        }
    } else {
        var g = gammaRand(shape + 1.0, 1.0);
        var w = Math.random();
        return scale * g * Math.pow(w, 1.0 / shape);
    }
};

