var telas = ["menu", "DorimeTela1", "DorimeGameOver","DorimeHowPlay", "DorimeWin"];

var larguraJogo = 800; //25
var alturaJogo = 600;//13 // 600

//var larguraJogo = 800; //25
//var alturaJogo = 416; //13

function menu() {
	
	var playBut;
	//var optBut;
	//var quitBut;
	var titulo;
	var howPlayBut;
	//var mus;
	
	this.preload = function () {
		
		//musica
		//game.load.audio("music","Dorime8-bits.mp3");
		
		//cor bg para testes
		//game.stage.backgroundColor = "#ffffff";
		
		
		//carrega o bg do menu
		game.load.image("fundoMenu", "menuBg.png");
		//carrega os botoes
		game.load.image("playButton", "playButton.png");
		//game.load.image("optionsButton", "optionsButton.png");
		//game.load.image("quitButton", "quitButton.png");
		game.load.image("howToPlayButton", "howToPlayButton.png");
		
		game.load.image("titulo", "upTheSewer.png");
		
		
	};
	
	this.create = function () {
		
		
		
		//posiciona a imagem do bg Menu
		game.add.tileSprite(0, 0, 800, 600, "fundoMenu");
		
		//posiciona texto titulo
		titulo = game.add.image(65,-190, "titulo"); //left: -100, -190 //center: 
		
		
		//atribui a variavel playBut a imagem do playButton e posiciona o botao
		playBut = game.add.image(260, 380, "playButton"); //left: 40, 380 //center: 
		playBut.scale.x = 0.9;
		playBut.scale.y = 0.9;
		//optBut = game.add.image(50, 200, "optionsButton");
		//quitBut = game.add.image(50, 500, "quitButton");
		howPlayBut = game.add.image(175, 480, "howToPlayButton"); //left: 50, 480 //center: 
		howPlayBut.scale.x = 1;
		howPlayBut.scale.y = 1;
		
		fadeIn();
		
		//permite input
		playBut.inputEnabled = true;
		//optBut.inputEnabled = true;
		//quitBut.inputEnabled = true;
		howPlayBut.inputEnabled = true;
		
		//altera cursor para "inputavel"
		playBut.input.useHandCursor = true;
		//optBut.input.useHandCursor = true;
		//quitBut.input.useHandCursor = true;
		howPlayBut.input.useHandCursor = true;
		
		//executa funcao quando receber input
		playBut.events.onInputDown.add(playButDown);
		howPlayBut.events.onInputDown.add(howPlayScene);
		///optBut.events.onInputDown.add();
		///quitBut.events.onInputDown.add();
		
		
		
	};
	
	this.update = function () {
		
	};
	
	function playButDown(){
		
		fadeOut();
		game.state.start("DorimeTela1");
		
	}
	
	function howPlayScene(){
		fadeOut();
		game.state.start("DorimeHowPlay");
	}
	
}
