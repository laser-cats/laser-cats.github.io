var Instructions = {
    preload: function() {
        game.load.image('menu', 'assets/menu.png');
    },

    create: function() {
        game.add.tileSprite(0,0, game.width, game.height, 'menu');
        //game.add.text(150, 0, "Presented by laber-labs.com", {fontSize: '48px', fill: "#FFF", align: "center"});
        game.add.text(100, 30, "Press the arrows to move", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(100, 100, "Press shift to double your speed", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(100, 170, "If you catch a shooting star, press spacebar for a single asteroid blaster", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(100, 240, "Score more points by hitting mice when you are farther left", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(100, 310, "Press ENTER to Start", {fontSize: '24px', fill: "#FFF", align: "center"});
    },

    update: function() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            game.state.start('Game');
        }
    }
};