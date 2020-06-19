function DorimeWin() {
	
	this.preload = function () {
		game.stage.backgroundColor = "#ffffff";
		
		game.load.image("menuBut", "menuButton.png");
		game.load.image("fundoWin", "dorimeWinScene.png");
	};
	
	this.create = function () {
		var estilo = {
			font: "normal 20px MedievalSharp",
			fill: "#ffffff"
				
		};
		
		game.add.tileSprite(0, 0, 800, 600, "fundoWin");
		
		menuBut = game.add.image(640, 520, "menuBut"); //esq: 640 //dir 10
		
		menuBut.scale.x = .5;
		menuBut.scale.y = .5;
		
		menuBut.inputEnabled = true;
		
		menuBut.input.useHandCursor = true;
		menuBut.events.onInputDown.add(menuReturn);
		
		resultado = game.add.text(70, 135, "Você escapou da Praga em "+tempo+" segundos." , estilo);
		
		
		fadeIn();
	};
	
	this.update = function () {
		
	};
	
	function menuReturn(){
		fadeOut();
		game.state.start("menu");
	}
}
