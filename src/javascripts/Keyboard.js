(function(){
	if (window.attachEvent){
   		window.attachEvent('onkeyup', Keyboard.onKeyup);
   		window.attachEvent('onkeydown', Keyboard.onKeydown);
	}else {
   		window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
   		window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);	
	}
})();

var Keyboard = {
    _pressed: {},
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    ESC : 27,
    S : 83,
    P : 80,
    R : 82

}

Keyboard.isDown = function(keyCode) {
	return Keyboard._pressed[keyCode];
};

Keyboard.onKeydown = function(event) {
	Keyboard._pressed[event.keyCode] = true;
};

Keyboard.onKeyup = function(event) {
	delete Keyboard._pressed[event.keyCode];
}
    
Keyboard.executeOnceWhenPressed = function(keycode,callback){
	//add listener
	window.addEventListener('keyup', function (event) { 
		if (event.keyCode == keycode){
			if(callback instanceof Function){
        		//execute callback
        		callback.call(this);
        		//remove listener when key pressed so it is invocked only once 
        		this.removeEventListener('keyup',arguments.callee,false);
    		}
    	}
	}, false);
}

Keyboard.toggleWhenPressed = function(keycode,callback1,callback2){
	//Closure variable;
	var firstCallback = true; 
	var eventExecute = function(event){
		if (event.keyCode == keycode){
			if (firstCallback){
				callback1.call(this);
				firstCallback= false;		
			}else{
				callback2.call(this);
				firstCallback = true;
			}
		}
	}
	window.addEventListener('keyup',eventExecute,false);	
}