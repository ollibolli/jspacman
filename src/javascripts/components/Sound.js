//= require 'components/Component'

function Sound(){
    this._sound = Sound.sounds.chase;
}

Sound.prototype= new Component("Sound");
Sound.prototype.constructor = Sound;

Sound.prototype.update= function(){
    this._sound();
};
Sound.sounds = {}
Sound.sounds.scared = function(){
    buzz.all().pause();
    Game.sounds.scared.play();
    
};
Sound.sounds.chase = function(){
    buzz.all().pause();
    Game.sounds.chase.loop();
    Game.sounds.chase.play();
};
