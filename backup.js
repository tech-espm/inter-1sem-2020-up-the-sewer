
function DorimeTela1() {
	//113
	var ESQ = 0;
	var DIR = 1;
	var TEMPO_PULO_MIN = 200;
	var TEMPO_PULO_MAX = 5000;
	var VEL_MAX = 500;
	var VEL_PULO_MIN = 500;
	var VEL_PULO_MAX = 2000;
	var GRAVIDADE = 2000;
	var ARRASTO = 0;
	
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
	

	
	this.preload = function () {
		
		//bgColor
		//game.stage.backgroundColor = "#006633";
		
		game.load.spritesheet("dude", "examples/assets/dude.png", 32, 48);
		
	};
	
	this.create = function () {
		
		//estilo
		var estilo = {
			font: "normal 16px Arial",
			fill: "#ffffff"
				
		};
		
		//Define as setas 
		setas = game.input.keyboard.createCursorKeys();
		
		teclaPulo = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		teclaPulo.onDown.add(iniciarCarregamento);
	
		
		//personagem
		dude = game.add.sprite(20, 100, "dude");
		game.physics.arcade.enable(dude);
		
		// Cria três animações chamadas "esquerda", "parado" e "direita"
		// para o sprite, com seus respectivos quadros, a uma velocidade
		// de 8 quadros por segundo, repetindo para sempre.
		dude.animations.add("esquerda", [0, 1, 2, 3], 8, true);
		dude.animations.add("parado", [4], 1, true);
		dude.animations.add("direita", [5, 6, 7, 8], 8, true);
		// Inicia a animação "parado".
		dude.animations.play("parado");
		
		// Previne que o sprite saia da tela.
		dude.body.collideWorldBounds = true;
		
		//gravidade
		dude.body.gravity.y = GRAVIDADE;
		
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		dude.body.bounce.x = 0.5;
		dude.body.bounce.y = 0;
		
		//Vel max horizontal
		dude.body.maxVelocity.x = VEL_MAX;
		// Configura o arrasto/desaceleração horizontal do sprite.
		dude.body.drag.x = ARRASTO;
		
		//timer def text
		timer = game.add.text(5, 5, "", estilo);

		

		
		//faz o input executar funcao
		
	
		
		//contador
		horaAnterior = game.time.now;
		milissegundosRestantes = 60000;
		

		
		pulando = false;
		ultimaDirecao = ESQ;
		
	};
	
	this.update = function () {
		
		// Atualiza quanto tempo se passou desde a última vez.
		var horaAtual = game.time.now;
		var deltaTime = horaAtual - horaAnterior;
		horaAnterior = horaAtual;
		    
		milissegundosRestantes = milissegundosRestantes - deltaTime;
		
		// O | 0 é para truncar o valor (remover a parte fracionária).
		timer.setText((milissegundosRestantes / 1000) | 0);
		
		
		processarPulo();
		

		
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
						dude.animations.play("esquerda");
						dude.body.velocity.x = -VEL_MAX;
					} else {
						//@@@ pulo dir
						dude.animations.play("direita");
						dude.body.velocity.x = VEL_MAX;
					}
				} else if (setas.left.isDown || setas.right.isDown) {
					pulando = true;
					
					if (delta > TEMPO_PULO_MAX) {
						delta = TEMPO_PULO_MAX;
					}
					dude.body.velocity.y = -(VEL_PULO_MIN + ((VEL_PULO_MAX - VEL_PULO_MIN) * ((delta - TEMPO_PULO_MIN) / (TEMPO_PULO_MAX - TEMPO_PULO_MIN))));
					if (setas.left.isDown) {
						//@@@ pulo esq
						dude.animations.play("esquerda");
						dude.body.velocity.x = -VEL_MAX;
					} else {
						//@@@ pulo dir
						dude.animations.play("direita");
						dude.body.velocity.x = VEL_MAX;
					}
				} else {
					// Para desativar a animação do carregamento
					dude.animations.play("parado");
				}
			}
			
		} else if (pulando) {
			
			if (dude.body.onFloor() || dude.body.touching.down) {
				dude.animations.play("parado");
				pulando = false;
				dude.body.velocity.x = 0;
				dude.body.velocity.y = 0;
			}
			
		} else {
			if (setas.left.isDown) {
				ultimaDirecao = ESQ;
				dude.body.velocity.x = -VEL_MAX;
				dude.animations.play("esquerda");
			} else {
				if (setas.right.isDown) {
					ultimaDirecao = DIR;
					dude.body.velocity.x = VEL_MAX;
					dude.animations.play("direita");
				} else {
					dude.body.velocity.x = 0;
					dude.animations.play("parado");
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
			// @@@ carregando
			dude.animations.play("parado");
			dude.body.velocity.x = 0;
			horaInicioCarga = game.time.now;
		}
		
	}
	


}	