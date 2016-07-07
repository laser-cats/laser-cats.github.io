var HighScore = {
    preload: function() {
        game.load.image('menu', 'assets/menu.png');
        game.load.image('star', 'assets/Background_Star2.png');
        game.load.spritesheet('cat', 'assets/BigCat.png', 260, 210);
    },

    create: function() {
        game.add.tileSprite(0,0, game.width, game.height, 'menu');
        game.add.text(280, 300, "NEW HIGH SCORE", {fontSize: '48px', fill: "#FFF", align: "center"});
        game.add.text(335, 360, " Press ENTER to Play Again", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(335, 390, "Press SPACE for Main Menu", {fontSize: '24px', fill: "#FFF", align: "center"});

        cat = game.add.sprite(game.world.width / 2 - 140, game.world.height / 2 - 200, 'cat');
        cat.animations.add('float');
        cat.animations.play('float', 1, true);
    },

    update: function() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            game.state.start('Game');
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Menu');
        }
    }
};