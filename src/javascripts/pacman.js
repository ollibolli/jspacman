//= require 'utils'
//= require 'Game'
//= require 'buzz'
//=	require 'constants'



/*Game.sounds = {};
 Game.sounds.chase = new buzz.sound("resources/sounds/Sound1",{formats:["ogg","mp3"]});
 Game.sounds.scared = new buzz.sound("resources/sounds/Sound2",{formats:["ogg","mp3"]});
 Game.sounds.beep =  new beep("resources/sounds/beep.wav");

 */

window.onload = function() {
	var gameArea = document.getElementById('gameArea');
	Game.init(SCENE_WIDTH, SCENE_HEIGHT, gameArea);
	//Game._loadScene(SCENE);
	Game._loadEntitys();
	Game.entityHandler.drawRenderable();
	document.getElementById('messageArea').textContent = "Press S to start";
	Keyboard.executeOnceWhenPressed(Keyboard.S, function() {
		//start game loop
		Game.start();

		Keyboard.toggleWhenPressed(Keyboard.P, function() {
			Game.stop();
		}, function() {
			Game.start();
		});
		Keyboard.executeOnceWhenPressed(Keyboard.R);
		Keyboard.executeOnceWhenPressed(Keyboard.ESC, function() {
			Game.stop();
		});
	});
};
