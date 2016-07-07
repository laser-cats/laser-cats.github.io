var Credits = {
    preload: function() {
        game.load.image('menu', 'assets/menu.png');
    },

    create: function() {
        game.add.tileSprite(0,0, game.width, game.height, 'menu');
        game.add.text(150, 0, "Presented by laber-labs.com", {fontSize: '48px', fill: "#FFF", align: "center"});
        game.add.text(345, 80, "Nicholas Kapur", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 120, "Maria Jahja", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 160, "Marshall Wang", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 200, "Eric Rose", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 240, "Graphics by: Lisa Wong", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 280, "Tutelage by: Eric Laber", {fontSize: '24px', fill: "#FFF", align: "center"});
        game.add.text(345, 320, "Press SPACEBAR for Menu", {fontSize: '24px', fill: "#FFF", align: "center"});
    },

    update: function() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Menu');
        }
    }
};