//= require 'components/Component'

Moveable.Extend(Component);
function Moveable(entity,speed){
    this.Super(entity)
    this.dependencies = ["Pos"];
    this._speed= speed;
    this.direction =0;
    this._y = entity._components.Pos.getY()*100;
    this._x = entity._components.Pos.getX()*100;
};

Moveable.prototype.moveUp = function() {
    this._calculateAndSetPosY(-this._speed);
};
Moveable.prototype.moveLeft = function() {
    this._calculateAndSetPosX(-this._speed);
};

Moveable.prototype.moveRight = function() {
    this._calculateAndSetPosX(this._speed);
};
Moveable.prototype.moveDown = function() {
    this._calculateAndSetPosY(this._speed);
};

Moveable.prototype.setX = function(x) {
    this._x=x*100;
    this._calculateAndSetPosX(0);
};
Moveable.prototype.setY = function(y) {
    this.y=y*100;
    this._calculateAndSetPosY(0);
};
Moveable.prototype.getX = function(){
    if(!this._x){
        this._x= this.getEntityComponents().Pos.getX()*100;
    }
    return this._x/100;
};

Moveable.prototype.getY = function(){
    if(!this._y){
        this._y= this.getEntityComponents().Pos.getY()*100;
    }
   return this._y/100;
};

Moveable.prototype.move=function (dir){
    switch (dir){
        case Dir.RIGHT: this.moveRight(); break;
        case Dir.DOWN: this.moveDown(); break;
        case Dir.UP: this.moveUp(); break;
        case Dir.LEFT: this.moveLeft(); break;

        default: throw new Error("Moveable.move - Dir out of bounds - "+dir + "Entity: " +this.getEntityComponents().name);
    };
};

Moveable.prototype._calculateAndSetPosY = function(delta){
    this._y = this._y+delta;
    var y=Math.round(this._y/100);
    if( 0 <= y && y < SCENE_HEIGHT) {
         this.getEntityComponents().Pos.setY(y); 
    } else throw new Error('Moveable._calculateAndSetPosY - position y out of bounds');
};

Moveable.prototype._calculateAndSetPosX = function(delta){
    this._x = this._x+delta;
    var x=Math.round(this._x/100);
    if( 0 <= x && x < SCENE_WIDTH) {
        this.getEntityComponents().Pos.setX(x);
    }else throw new Error('Moveable._calculateAndSetPosX - position x out of bounds');
};

Moveable.prototype.getSpeed = function(){
    return this._speed/100;
};

Moveable.prototype.isCenterOfTile = function (){
    var halfspeed= this._speed/2;
    var bH = BRICK_HEIGHT*100;
    var bW = BRICK_WIDTH*100;
    var newY = (this._y-(bH/2-halfspeed))%(bH);
    var newX = (this._x-(bW/2-halfspeed))%(bW);
    if ( roundNumber4(newY) < this._speed && roundNumber4(newX) < this._speed ){
        return true;
    } else {
        return false;
    }
};
