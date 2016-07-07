/**
 * Created by npkapur on 6/23/16.
 */

var player;
var cursors;
var score = 0;
var scoreText;
var lasers;
var laserTime = 0;
var laser;
var lives;
var counter;
var starCounter = 0;
var Game = {
    preload: function() {
        game.load.image('background', 'assets/menu.png');
        game.load.spritesheet('cat', 'assets/newCats.png', 58*1.5, 48*1.5);
        game.load.image('laser', 'assets/Laser.png');
        game.load.spritesheet('mouse', 'assets/smallMice.png', 68*1.5, 44*1.5);
        game.load.spritesheet('rat', 'assets/rats.png', 290*.75, 210*.75);
        game.load.image('star', 'assets/Background_Star2.png');
        game.load.spritesheet('asteroid', 'assets/asteroids.png', 210*1.5, 100*1.5);
    },

    create: function () {
        // Start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add the background
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        // Add the cat to the board in the correct place
        player = game.add.sprite(game.world.width - 150, game.world.height - 150, 'cat');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        // Add the lasers as a group
        lasers = game.add.physicsGroup();
        lasers.createMultiple(32, 'laser', false);
        lasers.setAll('checkWorldBounds', true);
        lasers.setAll('outOfBoundsKill', true);

        // Add the mice and rats to the game as a group
        mice = game.add.group();
        mice.enableBody = true;

        rats = game.add.group();
        rats.enableBody = true;

        asteroids = game.add.group();
        asteroids.enableBody = true;

        stars = game.add.group();

        // Starting # of lives
        lives = 9;

        // Allow the user to input movement
        cursors = game.input.keyboard.createCursorKeys();
        // In addition to the arrow keys create the shift key as one that can be recognized
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SHIFT]);

        // Create a scoreboard
        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#FFF'});

        // Create a counter for generating mice and rats.  SHOULD MAYBE SWITCH LASERS TO THIS GENERATION
        counter = 1;
        player.animations.add('float');
        player.animations.play('float', 1.5, true);
    },

    update: function() {
        // Update the score and lives
        scoreText.text = "Score: " + score + "   Lives: " + lives;

        // If no buttons are pressed the player is not moving
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        // Move according to the presses of the buttons
        if (cursors.left.isDown) {
            player.body.velocity.x = -500;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 500;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y = -500;
        } else if (cursors.down.isDown) {
            player.body.velocity.y = 500;
        }
        if (cursors.left.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.x = -1500;
        }
        if (cursors.right.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.x = 1500;
        }
        if (cursors.up.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.y = -1500;
        }
        if (cursors.down.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.y = 1500;
        }

        // Continuously firing lasers according to this function
        this.fireLaser();

        // Check for any collisions between objects and send them to their functions accordingly.
        game.physics.arcade.overlap(lasers, mice, this.killMouse, null, this);
        game.physics.arcade.overlap(player, mice, this.loseLife, null, this);
        game.physics.arcade.overlap(lasers, rats, this.hitRat, null, this);
        game.physics.arcade.overlap(player, rats, this.ratCollide, null, this);
        game.physics.arcade.overlap(player, asteroids, this.asteroidHit, null, this);
        game.physics.arcade.overlap(lasers, asteroids, this.shootAsteroid, null, this);

        // Keep time moving
        counter += 1;

        // Generate rats and mice based on the counter
        if (counter % 50 == 0) {
            var mouse = mice.create(-100, Math.min(Math.random() * game.height, game.height - 100), 'mouse');
            mouse.body.velocity.x = 500;
            mouse.animations.add('attack');
            mouse.animations.play('attack', 1.5, true);
        }
        if (counter % 212 == 0) {
            var rat = rats.create(-100, Math.min(Math.random() * game.height, game.height - 200), 'rat');
            rat.life = 5;
            rat.body.velocity.x = 300;
            rat.immovable = true;
            rat.animations.add('attack');
            rat.animations.play('attack', 1.5, true);
        }
        if (counter % 315 == 0) {
            var asteroid = asteroids.create(-1000, Math.min(Math.random() * game.height, game.height - 200), 'asteroid');
            asteroid.body.velocity.x = 200;
            asteroid.immovable = true;
            asteroid.animations.add('fly');
            asteroid.animations.play('fly', 1.5, true);

        }
        for (var i = 22; i <= 62; i++) {
            if (starCounter % i == 0  & (starCounter+1) % (i+1) == 0) {
                stars.callAll('destroy');
                star1 = stars.create(500, 400, 'star');
                star2 = stars.create(600, 50, 'star');
                star3 = stars.create(100, 250, 'star');
                star4 = stars.create(900, 200, 'star');
                star1.alpha = m;
                star2.alpha = m;
                star3.alpha = m;
                star4.alpha = m;
                if (i < 42) {
                    m += 0.05;
                } else {
                    m -= 0.05;
                }
            }
        }
        for (var i = 82; i <= 122; i++) {
            if (starCounter % i == 0  & (starCounter+1) % (i+1) == 0) {
                stars.callAll('destroy');
                star1 = stars.create(126, 440, 'star');
                star2 = stars.create(886, 255, 'star');
                star1.alpha = l;
                star2.alpha = l;
                if (i < 102) {
                    l += 0.05;
                } else {
                    l -= 0.05;
                }
            }
        }
        for (var i = 142; i <= 182; i++) {
            if (starCounter % i == 0 & (starCounter + 1) % (i+1) == 0) {
                stars.callAll('destroy');
                star1 = stars.create(110, 170, 'star');
                star2 = stars.create(325, 70, 'star');
                star3 = stars.create(825, 120, 'star');
                star1.alpha = k;
                star2.alpha = k;
                star3.alpha = k;
                if (i < 162) {
                    k += 0.05;
                } else {
                    k -= 0.05;
                }
            }
        }
        for (var i = 200; i <= 240; i++) {
            if (starCounter % i == 0  & (starCounter+1) % (i+1) == 0) {
                stars.callAll('destroy');
                star1 = stars.create(60, 60, 'star');
                star2 = stars.create(450, 80, 'star');
                star3 = stars.create(800, 40, 'star');
                star4 = stars.create(170, 300, 'star');
                star5 = stars.create(600, 400, 'star');
                star6 = stars.create(850, 350, 'star');
                star1.alpha = j;
                star2.alpha = j;
                star3.alpha = j;
                star4.alpha = j;
                star5.alpha = j;
                star6.alpha = j;
                if (i < 220) {
                    j += 0.05;
                } else {
                    j -= 0.05;
                }
            }
        }
        if (starCounter > 250) {
            starCounter = 1;
            j = 0.05;
            k = 0.05;
            m = 0.05;
            l = 0.05;
        }
        starCounter++;
    },

    fireLaser: function() {
        if (game.time.time > laserTime) {
            laser = lasers.getFirstExists(false);

            if (laser) {
                laser.reset(player.x - 6, player.y + 10);
                laser.body.velocity.x = -700;
                laserTime = game.time.time + 250;
            }
        }
    },

    killMouse: function(laser, mouse) {
        mouse.kill();
        laser.kill();
        score += 1;
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
            score += 5;
        }
    },

    ratCollide: function(player, rat) {
        rat.kill();
        score -= 5;
        lives -= 1;
    },
    
    asteroidHit: function(player, asteroid) {
    	asteroid.kill();
    	score -= 10;
    	lives -= 1;
    },
    
    shootAsteroid: function(laser, asteroid) {
    	laser.kill();
    }
};
