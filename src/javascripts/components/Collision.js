//= require 'components/Component'
//= require 'components/Pos'

Collision.Extend(Component);

function Collision(entity,entityDiameter){
    this.Super(entity);
    if(entityDiameter){
        this.diameter = entityDiameter;
    }else{
        throw "Collision.constructor - No entityDiameter Parameter";
    }
    this.dependencies = ["Pos"];
};

Collision.prototype.detect = function(direction){
    var that = this.getEntityComponents();
    var collObj = {collision:false,entities:[]}
    if (that.hasOwnProperty('Moveable')){ //TODO UGLY
        if (direction != undefined){
            var speed = that.Moveable.getSpeed();
            var x = that.Moveable.getX();
            var y = that.Moveable.getY();
            var radio1 = this.diameter/2-1; //plussvärde
            var radio2 = this.diameter/2; //minusvärde
            switch (direction){
                case Dir.UP :
                    collObj = this._getCollisionObjFromPos(x+radio1,          y-radio2-speed,            collObj);
                    collObj = this._getCollisionObjFromPos(x-radio2,          y-radio2-speed,            collObj);
                    break;
                case Dir.DOWN :
                    collObj = this._getCollisionObjFromPos(x+radio1,          y+radio1+speed,            collObj);
                    collObj = this._getCollisionObjFromPos(x-radio2,          y+radio1+speed,            collObj);
                    break;
                case Dir.RIGHT:
                    collObj = this._getCollisionObjFromPos(x+radio1+speed,    y+radio1,                  collObj);
                    collObj = this._getCollisionObjFromPos(x+radio1+speed,    y-radio2,                  collObj);
                    break;
                case Dir.LEFT :
                    collObj = this._getCollisionObjFromPos(x-radio2-speed,    y+radio1,                  collObj);
                    collObj = this._getCollisionObjFromPos(x-radio2-speed,    y-radio2,                  collObj);
                    break;
                default :
                    throw new Error ("Collision.detect - Dir out of bound "+ direction.toString());
            };
        } else {  //use entitys own position;
            collObj = this._getCollisionObjFromPos(that.Pos.getX(),that.Pos.getY(),collObj);
        }
        collObj.entities = uniqueArray(collObj.entities);
        return collObj;

    }else {
        throw new Error("Collision.detect Dependency Error");
    }
};

Collision.prototype._getEntitiesOnTile= function(x,y){
    if (isNaN(x) || isNaN(y)) throw new Error("Collision._getEntitiesOnTile - Parametrer missing or wrong type");

    var newTile= Pos.calculateTile(Math.round(x),Math.round(y));
    var tileEntities = Game.tileHandler.getEntitesOnTile(newTile); //TODO UGLY 
    var collisionEntities = [];
	for (var i in tileEntities){
		if (tileEntities[i] == undefined ) log('Collision.getEntitiesOnTile',tileEntities);
        if (tileEntities[i].getComponents().hasOwnProperty('Collision')){
            if (!(tileEntities[i].getComponents().Collision == this.getEntityComponents().Collision)){
                collisionEntities.push(tileEntities[i]);
            }
        }
    }
    if (collisionEntities.length < 1){
        return undefined;
    } else {
        return collisionEntities;
    }
};

Collision.prototype._getCollisionObjFromPos = function (x,y,collObj){
    var entities;
    if( x && y && collObj){
        if (entities = this._getEntitiesOnTile(x,y)) {
            collObj.collision = true;
            for (var i in entities){
                collObj.entities.push(entities[i]);
            }
        };
        return collObj;
    } else {
        throw "Collision._getCollisionObjFromPos - Parametrer missing or wrong type";
    }
};