function DorimeHowPlay() {
	var backBut;
	
	this.preload = function () {
		game.load.image("backButton", "backButton.png");
		game.load.image("howPlay", "howToPlayScene.png");
	};
	
	this.create = function () {
		
		
		game.add.tileSprite(0, 0, 800, 600, "howPlay");
		
		backBut = game.add.image(660, 530, "backButton");
		backBut.scale.x = 0.23;
		backBut.scale.y = 0.23;
		//permite input
		backBut.inputEnabled = true;
		
		
		//altera cursor para "inputavel"
		backBut.input.useHandCursor = true;
		
		//executa funcao quando receber input
		backBut.events.onInputDown.add(backMenu);
		fadeIn();
	};
	
	this.update = function () {
		
	};
	
	function backMenu(){
		fadeOut();
		game.state.start("menu");
	}
}
