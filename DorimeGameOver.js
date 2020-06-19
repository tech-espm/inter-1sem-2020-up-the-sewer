function DorimeGameOver() {
	
	this.preload = function () {
		
		game.stage.backgroundColor = "#000000";
		//carrega o bg do gameover
		//game.load.image("gameOver", "gameOver.png");
		game.load.image("retryBut", "retryButton.png");
		game.load.image("menuBut", "menuButton.png");
		game.load.image("fundoGameOver", "dorimeGameOver.png");
		
	};
	
	this.create = function () {
		var estilo = {
			font: "normal 20px MedievalSharp",
			fill: "#ffffff"
				
		};
		
		var estilo1 = {
			font: "normal MedievalSharp",
			fill: "#ffffff",
			fontSize: "32px"
				
		};
		
		game.add.tileSprite(0, 0, 800, 600, "fundoGameOver");
		resultado = game.add.text(10, 570, "Tempo Sobrevivido: "+ tempo+"s" , estilo);
		resultadoAltura = game.add.text(10, 550, "Altura Restante: "+ Math.round(alturaMax)+"cm" , estilo);
		textoGameOVer = game.add.text(260, 300, "A Peste te alcançou.", estilo1);
		
		fadeIn();
		
		//bg = game.add.tileSprite(100, 100, 318, 159, "gameOver");
		//bg.scale.x = 2;
		//bg.scale.y = 2;
		
		resBut = game.add.image(257, 330, "retryBut"); //10, 470
		resBut.scale.x = .9;
		resBut.scale.y = .9;
		
		menuBut = game.add.image(280, 420, "menuBut"); //560, 470
		menuBut.scale.x = .75;
		menuBut.scale.y = .75;
		
		resBut.inputEnabled = true;
		menuBut.inputEnabled = true;

		
		//altera cursor para "inputavel"
		resBut.input.useHandCursor = true;
		menuBut.input.useHandCursor = true;
		
		//executa funcao quando receber input
		resBut.events.onInputDown.add(restart);
		menuBut.events.onInputDown.add(menuReturn);
		
		
	};
	
	this.update = function () {
		
	};
	
	function restart(){
		fadeOut();
		game.state.start("DorimeTela1");
	}
	
	function menuReturn(){
		fadeOut();
		game.state.start("menu");
	}
	
}
