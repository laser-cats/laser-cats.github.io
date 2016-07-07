/**
 * Created by npkapur on 6/28/16.
 */
var stars;
var star1, star2, star3, star4, star5, star6;
var counter = 1;
var j = 0.05;
var k = 0.05;
var l = 0.05;
var m = 0.05;
var cat;
var Menu = {
    preload: function() {
        game.load.image('menu', 'assets/menu.png');
        game.load.image('star', 'assets/Background_Star2.png');
        game.load.spritesheet('cat', 'assets/BigCat.png', 260*1.05, 210);
    },

    create: function() {
        game.add.tileSprite(0,0, game.width, game.height, 'menu');
        game.add.text(340, 300, "LASERCATS", {fontSize: '48px', fill: "#FFF", align: "center"});
        game.add.text(365, 360, "Press ENTER to Play", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 390, "Press SPACE for Learner", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 420, " Press SHIFT for Credits", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(335, 450, "Press ESCAPE for Controls", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(0, 0, "Presented by laber-labs.com", {fontSize: '24px', fill: "#FFF", align: "center"});
        stars = game.add.group();
        cat = game.add.sprite(game.world.width / 2 - 140, game.world.height / 2 - 200, 'cat');
        cat.animations.add('float');
        cat.animations.play('float', 1, true);
    },

    update: function() {
        counter += 1;
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            game.state.start('Game');
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Agent');
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            game.state.start('Credits');
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
            game.state.start('Instructions');
        }
        for (var i = 22; i <= 62; i++) {
            if (counter % i == 0  && (counter+1) % (i+1) == 0) {
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
        for (i = 82; i <= 122; i++) {
            if (counter % i == 0  && (counter+1) % (i+1) == 0) {
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
        for (i = 142; i <= 182; i++) {
            if (counter % i == 0 && (counter + 1) % (i+1) == 0) {
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
        for (i = 200; i <= 240; i++) {
            if (counter % i == 0  && (counter+1) % (i+1) == 0) {
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
        if (counter > 250) {
            counter = 1;
            j = 0.05;
            k = 0.05;
            m = 0.05;
            l = 0.05;
        }
    }
};
