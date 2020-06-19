
var alturaMax = 4000;
var tempo;

function DorimeTela1() {
	
	var ESQ = 0;
	var DIR = 1;
	var TEMPO_PULO_MIN = 250;
	var TEMPO_PULO_MAX = 3000;
	var VEL_MAX_X = 200;
	var VEL_MAX_Y = 1005;
	var VEL_PULO_MIN = 500;
	var VEL_PULO_MAX = 1500;
	var GRAVIDADE = 2000;
	var ARRASTO = 0;
	
	var deltaY;
	var yAtual;
	var yAnterior;
	
	var setas;
	var teclaPulo;
	var dude;
	var ultimaDirecao;
	var carregando, pulando;
	var horaInicioCarga;
	
	var timer;
	var win;
	var lose;
	var horaAnterior;
	var milissegundosRestantes;
	
	var map;
	var tileset;
	var tilsetPNG;
	var layer;
	var liquid;
	
	var eixo = 0;
	var snd;
	
	var spaceBarBut;
	var leftArrowBut;
	var rightArrowBut;
	
	//score
	
	
	var textTempo;
	
	
	this.preload = function () {
		
		//bgColor
		game.stage.backgroundColor = "#383838";
		
		//carrega o bg do jogo
		game.load.image("fundoJogo", "bgDorime.png");
		
		//game.load.spritesheet("dude", "examples/assets/dude.png", 32, 16);
		game.load.spritesheet("dorime", "dorimeSheet.png", 76, 128);
		game.load.spritesheet("dude", "dorimeHitbox.png", 50, 128);
	
		game.load.tilemap('level1', 'level1.json', null, Phaser.Tilemap.TILED_JSON);
	    
		game.load.image('TileMario', 'dorimeTile.png');
		
		game.load.audio("trackLoop","musica_jogo.mp3");
		
		//jump
		game.load.audio("jump","jump.mp3");
		
		game.load.image("spaceBarBut", "spaceBar.png");
		game.load.image("leftArrowBut", "leftArrow.png");
		game.load.image("rightArrowBut", "rightArrow.png");
		
		//gosma
		game.load.spritesheet("riverTest", "riverTest.png", 850, 1019);
		
		game.load.image("hitbox", "hitbox.png", 1094, 361);
		
		game.load.image("win", "win.png", 400, 800);
		
		
	};
	
	this.create = function () {
		tempo = 0;
		//estilo
		var estilo = {
			font: "normal 20px MedievalSharp",
			fill: "#ffffff"
				
		};
		
		fadeIn();
		//posiciona a imagem do bg Jogo
		game.add.tileSprite(0, 0, 800, 4000, "fundoJogo");
		
		winArea = game.add.sprite(388, 0, "win");
		winArea.scale.y = 0.16;
		winArea.scale.x = 0.030;
		winArea.alpha = 0;
		
		game.physics.arcade.enable(winArea);
		
		// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ MUSICA
		// o segundo parametro é a intensidade do som.
		snd = game.add.audio("trackLoop", 0.45); //0.5
		snd.loop = true;
		snd.play();
	
		sfx = game.add.audio("jump", 0.25);
		
		
		//Define as setas 
		setas = game.input.keyboard.createCursorKeys();
		
		teclaPulo = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		teclaPulo.onDown.add(iniciarCarregamento);
		
		
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   personagem
		dude = game.add.sprite(340, 3000, "dude"); // default 340, 3000 //testes: 340, 50 win
		dude.scale.x = 0.4;
		dude.scale.y = 0.4;
		dude.alpha = 0;
		
		
		dorime = game.add.sprite(490, 3000, "dorime");//490, 3000
		dorime.scale.x = 0.4;
		dorime.scale.y = 0.4;
		
		game.physics.arcade.enable(dude);
		
		// Cria três animações chamadas "esquerda", "parado" e "direita"
		// para o sprite, com seus respectivos quadros, a uma velocidade
		// de 8 quadros por segundo, repetindo para sempre.
		///dude.animations.add("esquerda", [0, 1, 2, 3], 8, true);
		dorime.animations.add("esquerda", [8,7, 6,5,4, 3, 2, 1], 12, true);
		dorime.animations.add("direita", [ 10, 11, 12, 13, 14, 15, 16], 12, true);
		dorime.animations.add("paradoDir", [9], 1, true);
		dorime.animations.add("paradoEsq", [8], 1, true);
		dorime.animations.add("agachadoEsq", [0], 1, true);
		dorime.animations.add("agachadoDir", [17], 1, true);
		///dude.animations.add("parado", [4], 1, true);
		///dude.animations.add("direita", [5, 6, 7, 8], 8, true);
		// Inicia a animação "parado".
		dorime.animations.play("paradoEsq");
		
		// Previne que o sprite saia da tela.
		dude.body.collideWorldBounds = true;
		
		
		//camera
		Phaser.Camera = function (game, id, x, y, width, height) {
			this.game = game;
			this.world = game.world;
			this.id = 0;
			
			game.camera.deadzone = new Phaser.Rectangle(600, 600, 3000, 3000);
			this.bounds = new Phaser.Rectangle(0, 3200, 600, 800);
			
			
		};
		
		//gravidade
		dude.body.gravity.y = GRAVIDADE;
		
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		dude.body.bounce.x = 10;
		dude.body.bounce.y = 0;
		
		//Vel max horizontal
		dude.body.maxVelocity.x = VEL_MAX_X;
		dude.body.maxVelocity.y = VEL_MAX_Y;
		// Configura o arrasto/desaceleração horizontal do sprite.
		dude.body.drag.x = ARRASTO;

		
		pulando = false;
		ultimaDirecao = DIR;
		
		map = game.add.tilemap('level1');
		map.addTilesetImage('TileMario');
		
		
		layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        
        //colission dos tiles
       
        map.setCollisionBetween(0, 6);
        
		//camera segue o dude
		game.camera.follow(dude);
	
		//tileset
		//bg.fixedToCamera = true;
		
		//hitbox do liquido
		hitbox = game.add.sprite(0, 3460, "hitbox");
		
		game.physics.arcade.enable(hitbox);
		
		// 460 de diff da hitbox:
		liquid = game.add.sprite(0, 3000, "riverTest");
		liquid.alpha = 1;
		liquid.scale.y = 1;
		liquid.scale.x = 1;
		liquid.animations.add("flow", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 7, true);
		//animacao  do liquido
		liquid.animations.play("flow");
		
		
		
		//"Buttons" sensitive
		spaceBarBut = game.add.image(350, 560, 'spaceBarBut');
		spaceBarBut.scale.x = 0.2;
		spaceBarBut.scale.y = 0.2;
		spaceBarBut.fixedToCamera = true;
		spaceBarBut.alpha = 0.4;
		
		rightArrowBut = game.add.image(460, 560, 'rightArrowBut');
		rightArrowBut.scale.x = 0.25;
		rightArrowBut.scale.y = 0.25;
		rightArrowBut.fixedToCamera = true;
		rightArrowBut.alpha = 0.4;
		
		leftArrowBut = game.add.image(315, 560, 'leftArrowBut');
		leftArrowBut.scale.x = 0.25;
		leftArrowBut.scale.y = 0.25;
		leftArrowBut.fixedToCamera = true;
		leftArrowBut.alpha = 0.4;
		
		
		yAnterior = game.time.now * dude.y;
		
		//Contador de tempo
		
		textTempo = game.add.text(10, 10, "0", estilo);
		game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
		textTempo.fixedToCamera = true;
		
		alturaMax = 3000;
		
	};
	
	this.update = function () {
		
		//a cada frame:
		// o liquido sobe
		liquid.y -= 0.3; //0.3 ou 0.25
		hitbox.y -= 0.3; //0.3 ou 0.25
		
		anchorHitbox();
	
		game.physics.arcade.overlap(dude, hitbox, Die);
		
		game.physics.arcade.overlap(dude, winArea, Win);
		//o dude colide com os tiles
		game.physics.arcade.collide(dude, layer);
		
		processarPulo();
		
		sensorButton();
		
		verifVariacaoY();
		
		attScore();
		
		//agachar mirando para o lado que vai pular
		if(teclaPulo.isDown && setas.left.isDown){
			dorime.animations.play("agachadoEsq");
			if(dude.body.onFloor()){
				dude.body.velocity.x = 0;
			}
		}
		else if(teclaPulo.isDown && setas.right.isDown){
			dorime.animations.play("agachadoDir");
			if(dude.body.onFloor()){
				dude.body.velocity.x = 0;
			}
		}
		
		
		//console.log(ultimaDirecao);
		
		
	};
	
	function processarPulo() {
		// Controle de movimentos simples. Se a seta esquerda estiver
		// pressionada, aplica uma aceleração negativa (esquerda) ao
		// o sprite. Se a seta direita estiver pressionada, aplica uma
		// aceleração positiva (direita) ao sprite. Se nenhuma tecla
		// estiver pressionada, remove a aceleração do sprite, deixando
		// que o arrasto/desaceleração (drag) pare o sprite.
		//
		// Além disso, define a animação correta do sprite dependendo
		// da seta que estiver pressionada.
 	if (carregando) {
			
			if (!teclaPulo.isDown) {
				carregando = false;
				
				var delta = game.time.now - horaInicioCarga;
				
				if (delta <= TEMPO_PULO_MIN) {
					pulando = true;
					
					dude.body.velocity.y = -VEL_PULO_MIN;
					if (ultimaDirecao == ESQ) {
						//@@@ pulo esq
						dorime.animations.play("esquerda");
						sfx.play();
						eixo = 1;
						dude.body.velocity.x = -VEL_MAX_X;
						
						
					} else if(ultimaDirecao == DIR) {
						//@@@ pulo dir
						sfx.play();
						dorime.animations.play("direita");
						eixo = 0;
						dude.body.velocity.x = VEL_MAX_X;
						
						
						
					}
				} else if (setas.left.isDown || setas.right.isDown) {
					pulando = true;
					
					if (delta > TEMPO_PULO_MAX) {
						delta = TEMPO_PULO_MAX;
					}
					dude.body.velocity.y = -(VEL_PULO_MIN + ((VEL_PULO_MAX - VEL_PULO_MIN) * ((delta - TEMPO_PULO_MIN) / (TEMPO_PULO_MAX - TEMPO_PULO_MIN))));
					if (setas.left.isDown) {
						//@@@ pulo esq
						sfx.play();
						dorime.animations.play("esquerda");
						ultimaDirecao = ESQ;
						eixo = 1;
						dude.body.velocity.x = -VEL_MAX_X;
						
					} else if(setas.right.isDown) {
						//@@@ pulo dir
						sfx.play();
						ultimaDirecao = DIR;
						dorime.animations.play("direita");
						eixo = 0;
						dude.body.velocity.x = VEL_MAX_X;
						
					}
				} else {
					// Para desativar a animação do carregamento
					if(ultimaDirecao == DIR) {
						dorime.animations.play("paradoDir");
						eixo = 0;
						
					} else if (ultimaDirecao == ESQ){
						dorime.animations.play("paradoEsq");
						eixo = 1;
						
					}
				}
			}
			
		} else if (pulando) {
			
			if (dude.body.onFloor() || dude.body.touching.down) {
				if(ultimaDirecao == DIR) {
					dorime.animations.play("paradoDir");
					eixo = 0;
					
				} else if (ultimaDirecao == ESQ){
					dorime.animations.play("paradoEsq");
					eixo = 1;
					
				};
				pulando = false;
				dude.body.velocity.x = 0;
				dude.body.velocity.y = 0;
			}
			
		} else {
			if (setas.left.isDown) {
				ultimaDirecao = ESQ;
				dude.body.velocity.x = -VEL_MAX_X;
				dorime.animations.play("esquerda");
				eixo = 1;
				
			} else if (setas.right.isDown) {
					ultimaDirecao = DIR;
					dude.body.velocity.x = VEL_MAX_X;
					dorime.animations.play("direita");
					eixo = 0;
					
			} else {
				dude.body.velocity.x = 0;
				if(ultimaDirecao == DIR) {
					dorime.animations.play("paradoDir");
					eixo = 0;
					
				} else if (ultimaDirecao == ESQ){
					dorime.animations.play("paradoEsq");
					eixo = 1;
					
				}
				
			}
		}
		
		// Poderíamos também alterar a animação do sprite não apenas com
		// base no teclado, mas com base em sua velocidade, ou uma combinação
		// de ambos! :)
	}
	
	function iniciarCarregamento() {
		
		// Pular significa aplicar a um sprite uma velocidade para cima
		// (negativa). Contudo, só podemos deixar que o jogador pule se
		// o sprite estiver sobre o chão. Se bem que... alguns jogos
		// deixam que o jogador pule mesmo no ar... ;)
		if (dude.body.onFloor() || dude.body.touching.down) {
			carregando = true;
			
			dude.body.velocity.x = 0;
			horaInicioCarga = game.time.now;
 		}
		
	}
	
	function updateCounter() {

    tempo++;

    textTempo.setText('' + tempo);

	}
	
	
	function verifVariacaoY(){
		
		yAtual = dude.y * game.time.now;
		
		deltaY = yAnterior - yAtual;
		
		if(dude.body.onFloor()){
			
			GRAVIDADE = 2000;
			dude.body.gravity.y = GRAVIDADE;
			////VEL_MAX_Y = 100000;
			////VEL_MAX_X = 200;
			
		
		}else if (deltaY >= 0 ){
			
			GRAVIDADE = 2000;
			dude.body.gravity.y = GRAVIDADE;
			////VEL_MAX_Y = 100000;
			////VEL_MAX_X = 200;
			
			
		}else if(deltaY < 0){
			
			GRAVIDADE = 1650;
			dude.body.gravity.y = GRAVIDADE;
			////VEL_MAX_Y = 2;
			////VEL_MAX_X = 2;
			
		} 
		
		yAnterior = yAtual;
		
	}
	
	

	
	
	
	
	function attScore(){
		alturaAtual = dude.y;
		if (alturaAtual < alturaMax){
			alturaMax = alturaAtual;
			//console.log(alturaMax);
		}
	}
	
	
	function sensorButton() {
		//detecta e mostra na tela por meio de alphas que botao foi apertado
		if (teclaPulo.isDown){
			spaceBarBut.alpha = 1;
		}else{
			spaceBarBut.alpha = 0.4;
		}
		
		if(setas.left.isDown){
			leftArrowBut.alpha = 1;
		}else{
			leftArrowBut.alpha = 0.4;
		}
		if(setas.right.isDown){
			rightArrowBut.alpha = 1;
		}else{
			rightArrowBut.alpha = 0.4;
		}
	}
		
	function Die() {
		dude.kill();
		dorime.kill();
		snd.stop();
		fadeOut();
		game.state.start("DorimeGameOver");
		if(alturaMax == 0){
			alturaMax += 15;
		}
		alturaMax = alturaMax * 0.7;
		console.log(alturaMax);
		
	}
	
	function Win() {
		dude.kill();
		dorime.kill();
		snd.stop();
		fadeOut();
		game.state.start("DorimeWin");
		alturaMax = 0;
		console.log(alturaMax);
		
	}
	
	function anchorHitbox(){
		// ESQUERDA
		if(eixo == 1){
			dorime.x = dude.x ;
			dorime.y = dude.y;
			dude.scale.x = 0.4;
		}
		// DIREITA
		else if (eixo == 0){
			dorime.x = dude.x - 10;
			dorime.y = dude.y;
			dude.scale.x = 0.4;
		}
		
	}
	


}	
