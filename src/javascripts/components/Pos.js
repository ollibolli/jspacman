//= require 'components/Component'

Pos.Extend(Component);
function Pos(entity,x,y){
    this.Super(entity);
    entity.addComponent(this);
    
    this._x =x;
    this._y =y;
    this._tile = Pos.calculateTile(this._x,this._y);
    this._tileChange = false;
    this._tileCenter = false;
}

//Pos.prototype = new Component();
//Pos.prototype.constructor = Pos;

Pos.prototype.getTile=function(){
    return this._tile;
};
Pos.prototype.getX = function(){
    return this._x;
};
Pos.prototype.setX = function(x){
    this._x=x;
    this._checkAndChangeTile();
};
Pos.prototype.setY = function(y){
    this._y=y;
    this._checkAndChangeTile();
};
Pos.prototype.getY = function(){
    return this._y;
};

Pos.prototype._checkAndChangeTile=function(){

    this._tileCenter = Pos.calculateCenterOfTile(this._x,this._y);

    var newTile = Pos.calculateTile(this._x,this._y);
    if (this._tile != newTile){
        if (0 <= newTile && newTile < TAILS){
            Game.tileHandler.moveEntity(this.getEntity(),this._tile,newTile); //TODO uggly.
            this._tile=newTile;
        } else {
            throw "Pos._checkAndChangeTile - Tile out of bounds";
        }
        this._tileChange = true;
    } else {
        this._tileChange = false;
    }
};

Pos.prototype.isTileChanged = function(){
    return this._tileChange;
};

Pos.prototype.isCenterOfTile = function(){
    return this._tileCenter;
};

Pos.calculateTile = function(x,y){
    return Math.floor((y)/BRICK_HEIGHT)*(GRID_WIDTH) + Math.floor((x)/BRICK_WIDTH);
};

Pos.calculateCenterOfTile = function(x,y){
    //TODO calculated value shoud be half of diameter
    var newY = (y-10)%BRICK_HEIGHT;
    var newX = (x-10)%BRICK_WIDTH;
    if (newY == 0 && newX == 0 ){
        return true;
    } else {
        return false;
    }
};


