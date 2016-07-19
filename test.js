/**
 * Created by npkapur on 6/23/16.
 */
var mice;
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
var rats;
var asteroids;
var shootingStars, bigLaser, big;
var mouse;
var rat;
var asteroid;
var shootingStar;
var pos;
var music;
var shoot;
var star1, star2, star3, star4, star5, star6, star7, star8;
var starSet = 1;
var starInc = true;
var hit = false;
var hitCounter = 0;
var run = 0;
var highScore = -1000000000000;
var asteroidBlaster = false;
//var sumU;
var Game = {
    preload: function() {
        game.load.image('background', 'assets/menu.png');
        game.load.spritesheet('cat', 'assets/newCats.png', 58*1.6, 48*1.5);
        game.load.image('laser', 'assets/Laser.png');
        game.load.spritesheet('mouse', 'assets/smallMice.png', 68*1.5, 44*1.5);
        game.load.spritesheet('rat', 'assets/rats.png', 290*.75, 210*.75);
        game.load.image('star', 'assets/Background_Star2.png');
        game.load.image('bigLaser', 'assets/bigLaser.png');
        game.load.spritesheet('asteroid', 'assets/asteroids.png', 210*1.5, 100*1.5);
        game.load.spritesheet('shootingStar', 'assets/shootingStar.png', 105, 60);
        game.load.audio('music', ['assets/sounds/music.ogg', 'assets/sounds/music.mp3']);
        game.load.audio('shoot', ['assets/sounds/shoot_laser.ogg', 'assets/sounds/shoot_laser.wav']);
    },

    create: function () {
        music = game.add.audio('music');
        shoot = game.add.audio('shoot');
        music.loop = true;
        music.play();

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

        asteroids = game.add.physicsGroup();
        asteroids.createMultiple(30, 'asteroid', false);
        asteroids.setAll('checkWorldBounds', true);
        asteroids.setAll('outOfBoundsKill', true);

        shootingStars = game.add.physicsGroup();
        shootingStars.createMultiple(10, 'shootingStar', false);
        shootingStars.setAll('checkWorldBounds', true);
        shootingStars.setAll('outOfBoundsKill', true);

        bigLaser = game.add.physicsGroup();
        bigLaser.createMultiple(2, 'bigLaser', false);
        bigLaser.setAll('checkWorldBounds', true);
        bigLaser.setAll('outOfBoundsKill', true);

        stars = game.add.group();
        stars.createMultiple(8, 'star', false);

        // Starting # of lives
        lives = 9;
        score = 0;

        // Allow the user to input movement
        cursors = game.input.keyboard.createCursorKeys();
        // In addition to the arrow keys create the shift key as one that can be recognized
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SHIFT]);

        // Create a scoreboard
        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#FFF'});

        // Create a counter for generating mice and rats.  SHOULD MAYBE SWITCH LASERS TO THIS GENERATION
        counter = 1;
        player.animations.add('float', [0, 2], 1.5, true);
        player.animations.add('hit', [1, 3], 1.5, false);
        player.animations.play('float');

        //  Load the High Score 
	highScore = Game.getCookie("Hscore");
        if (highScore == "") {
	  highScore = -99999999
	}	
    },

    update: function() {
        if (lives <= 0 && score > highScore) {
        	run++;
          highScore = score; 
	  Game.setCookie("Hscore", highScore, 30);	
	    game.state.start('HighScore');
        } else if (lives <= 0) {
            run++;
            game.state.start('GameOver');
        }
           
   
     if (highScore == -99999999) {
	      // Update the score and lives
            scoreText.text = "Score: " + score + "   Lives: " + lives;
	 } else {
	       scoreText.text = "Score: " + score + "   Lives: " + lives + " High Score: " + Game.getCookie("Hscore"); 
	 }

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
            player.body.velocity.x = -1000;
        }
        if (cursors.right.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.x = 1000;
        }
        if (cursors.up.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.y = -1000;
        }
        if (cursors.down.isDown && game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            player.body.velocity.y = 1000;
        }

        // Continuously firing lasers according to this function
        Game.fireLaser();

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if (asteroidBlaster) {
                asteroidBlaster = false;
                Game.blastAsteroid();
            }
        }

        // Check for any collisions between objects and send them to their functions accordingly.
        game.physics.arcade.overlap(lasers, mice, this.killMouse, null, this);
        game.physics.arcade.overlap(lasers, rats, this.hitRat, null, this);
        game.physics.arcade.overlap(lasers, asteroids, this.shootAsteroid, null, this);
        game.physics.arcade.overlap(player, shootingStars, this.shotByStar, null, this);
        game.physics.arcade.overlap(lasers, shootingStars, this.shootStar, null, this);
        game.physics.arcade.overlap(bigLaser, mice, this.bigHitMouse, null, this);
        game.physics.arcade.overlap(bigLaser, rats, this.bigHitRat, null, this);
        game.physics.arcade.overlap(bigLaser, asteroids, this.bigHitAsteroid, null, this);
        // Keep time moving
        counter += 1;
        starCounter += 1;

        // Generate rats and mice based on the counter
        Game.genMouse();
        Game.genRat();
        Game.genAsteroid();
        Game.genShootingStar();
        Game.genStars();
        if (counter % 2 == 0) {
            Game.starBright();
        }

        pos = Game.getPositions(player, mice.children, rats.children, lasers.children);
        for (var i = 2; i < pos.length; i++) {
            if (pos[i] > 990) {
                score -= 3;
            }
        }

        if (!hit) {
            hitCounter = 0;
            player.animations.play('float');
            game.physics.arcade.overlap(player, mice, this.loseLife, null, this);
            game.physics.arcade.overlap(player, rats, this.ratCollide, null, this);
            game.physics.arcade.overlap(player, asteroids, this.asteroidHit, null, this);
        } else {
            hitCounter++;
            if (hitCounter == 5) {
                player.animations.play('float');
            } else if (hitCounter == 10) {
                player.animations.play('hit');
            } else if (hitCounter == 15) {
                player.animations.play('float');
            }
            if (hitCounter == 30) {
                hit = false;
            }
        }

    },


    setCookie: function(cname,cvalue,exdays) {
	    var d = new Date();
	     d.setTime(d.getTime() + (exdays*24*60*60*1000));
	     var expires = "expires=" + d.toGMTString();
		        document.cookie = cname+"="+cvalue+"; "+expires;
  },


    getCookie: function(cname) {
	     var name = cname + "=";
	     var ca = document.cookie.split(';');
	     for(var i=0; i<ca.length; i++) {
			 var c = ca[i];
		         while (c.charAt(0)==' ') {
	                          c = c.substring(1);
			  }
		         if (c.indexOf(name) == 0) {
			        return  c.substring(name.length, c.length);
			  }
	       }
		          return "";
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

    blastAsteroid: function() {
        big = bigLaser.getFirstExists(false);

        if (big) {
            big.reset(player.x - 6, player.y + 10);
            big.body.velocity.x = -1050;
        }
    },

    bigHitMouse: function(big, mouse) {
        mouse.kill();
        shoot.play();
        score += Math.round((1000 - player.x)/100);
    },

    bigHitRat: function(big, rat) {
        rat.kill();
        shoot.play();
        score += Math.round(4 + (1000 - player.x)/100);
    },

    bigHitAsteroid: function(big, asteroid) {
        asteroid.kill();
        shoot.play();
        score += 10;
    },

    killMouse: function(laser, mouse) {
        mouse.kill();
        laser.kill();
        shoot.play();
        score += Math.round((1000 - player.x)/100);
    },

    loseLife: function(player, mouse) {
        mouse.kill();
        score -= 5;
        lives -= 1;
        player.animations.play('hit');
        hit = true;
    },

    hitRat: function(laser, rat) {
        rat.life -= 1;
        laser.kill();
        if (rat.life <= 0) {
            shoot.play();
            rat.kill();
            score += Math.round(4 + (1000 - player.x)/100);
        }
    },

    ratCollide: function(player, rat) {
        rat.kill();
        score -= 5;
        lives -= 1;
        player.animations.play('hit');
        hit = true;
    },

    asteroidHit: function(player, asteroid) {
        asteroid.kill();
        score -= 10;
        lives -= 1;
        player.animations.play('hit');
        hit = true;
    },

    shootAsteroid: function(laser) {
        laser.kill();
    },

    shotByStar: function(player, shootingStar) {
        shootingStar.kill();
        score += 2;
        asteroidBlaster = true;
    },

    shootStar: function(laser) {
        laser.kill()
    },

    genMouse: function() {
        if (counter % 50 == 0) {
            mouse = mice.getFirstExists(false);

            if (mouse) {
                mouse.reset(-100, Math.min(Math.random()*game.height, game.height - 100), 'mouse');
                mouse.body.velocity.x = 500;
                mouse.animations.add('attack');
                mouse.animations.play('attack', 1.5, true);
            }
        }
    },

    genRat: function() {
        if (counter % 212 == 0) {
            rat = rats.getFirstExists(false);

            if (rat) {
                rat.reset(-100, Math.min(Math.random()*game.height, game.height - 200), 'rat');
                rat.body.velocity.x = 300;
                rat.life = 4;
                rat.immovable = true;
                rat.animations.add('attack');
                rat.animations.play('attack', 1.5, true);
            }
        }
    },

    genAsteroid: function() {
        if (counter % 615 == 0) {
            asteroid = asteroids.getFirstExists(false);

            if (asteroid) {
                asteroid.reset(-300, Math.min(Math.random()*game.height, game.height - 200), 'asteroid');
                asteroid.body.velocity.x = 200;
                asteroid.immovable = true;
                asteroid.animations.add('fly');
                asteroid.animations.play('fly', 1.5, true);
            }
        }
    },

    genShootingStar: function() {
        if (counter % 1007 == 0) {
            shootingStar = shootingStars.getFirstExists(false);

            if (shootingStar) {
                shootingStar.reset(-100, Math.min(Math.random()*game.height, game.height - 100), 'shootingStar');
                shootingStar.body.velocity.x = 1000;
                shootingStar.body.velocity.y = 50;
                shootingStar.immovable = true;
                shootingStar.animations.add('fly');
                shootingStar.animations.play('fly', 2, true);
            }
        }
    },

    getPositions: function(player, mice, rats) {
        var data_array = [];
        data_array.push(player.position.x, player.position.y);
        for (var i = 0; i < mice.length; i++) {
            if (mice[i].alive == true) {
                data_array.push(mice[i].position.x, mice[i].position.y);
            }
        }
        for (i = 0; i < rats.length; i++) {
            if (rats[i].alive == true) {
                data_array.push(rats[i].position.x, rats[i].position.y);
            }
        }
        return data_array;
    },

    starBright: function() {
        if(star1 && star2 && star3 && star4 && star5 && star6 && star7 && star8) {
            if (Math.abs(star8.alpha - 1.0) < 0.01) {
                starInc = false;
            }
            if (starInc) {
                //console.log("starInc: " + star1.alpha);
                star1.alpha += 0.05;
                star2.alpha += 0.05;
                star3.alpha += 0.05;
                star4.alpha += 0.05;
                star5.alpha += 0.05;
                star6.alpha += 0.05;
                star7.alpha += 0.05;
                star8.alpha += 0.05;
            } else {
                //console.log("starDec: " + star1.alpha);
                star1.alpha -= 0.1;
                star2.alpha -= 0.1;
                star3.alpha -= 0.1;
                star4.alpha -= 0.1;
                star5.alpha -= 0.1;
                star6.alpha -= 0.1;
                star7.alpha -= 0.1;
                star8.alpha -= 0.1;
            }
        }
    },

    genStars: function() {
        if (starCounter % 50 == 0) {
            //console.log(starSet % 4);
            if (starSet % 4 == 0) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(62.5, 62.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(312.5, 187.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(562.5, 62.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(812.5, 187.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(187.5, 312.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(437.5, 437.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(687.5, 312.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(937.5, 437.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            } else if (starSet % 4 == 1) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(187.5, 187.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(437.5, 62.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(687.5, 187.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(937.5, 62.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(62.5, 437.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(312.5, 312.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(562.5, 437.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(812.5, 312.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            } else if (starSet % 4 == 2) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(187.5, 62.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(437.5, 187.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(687.5, 62.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(937.5, 187.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(62.5, 312.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(312.5, 437.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(562.5, 312.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(812.5, 437.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            } else if (starSet % 4 == 3) {
                star1 = stars.getFirstExists(false);
                if (star1) {
                    star1.reset(62.5, 187.5, 'star');
                    star1.alpha = 0.1;
                }
                star2 = stars.getFirstExists(false);
                if (star2) {
                    star2.reset(312.5, 62.5, 'star');
                    star2.alpha = 0.1;
                }
                star3 = stars.getFirstExists(false);
                if (star3) {
                    star3.reset(562.5, 187.5, 'star');
                    star3.alpha = 0.1;
                }
                star4 = stars.getFirstExists(false);
                if (star4) {
                    star4.reset(812.5, 62.5, 'star');
                    star4.alpha = 0.1;
                }
                star5 = stars.getFirstExists(false);
                if (star5) {
                    star5.reset(187.5, 437.5, 'star');
                    star5.alpha = 0.1;
                }
                star6 = stars.getFirstExists(false);
                if (star6) {
                    star6.reset(437.5, 312.5, 'star');
                    star6.alpha = 0.1;
                }
                star7 = stars.getFirstExists(false);
                if (star7) {
                    star7.reset(687.5, 437.5, 'star');
                    star7.alpha = 0.1;
                }
                star8 = stars.getFirstExists(false);
                if (star8) {
                    star8.reset(937.5, 312.5, 'star');
                    star8.alpha = 0.1;
                }
                starSet++;
                starInc = true;
            }
        } else if (starCounter == 99) {
            starCounter = 0;
            stars.callAll('kill');
        }
    }
};
