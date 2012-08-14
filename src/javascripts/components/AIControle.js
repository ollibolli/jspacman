//= require 'components/Component'

AIControle.Extend(Component);

function AIControle(entity, startingDirection,pathfind,collision){
	if (!(entity instanceof Entity)) throw new Error('STORERROR');
	this.Super(entity); 
    this._direction = startingDirection;
    this._target;
    this._pathfind = pathfind;
    this._collision = collision;
} ;

AIControle.prototype.update = function(){
    var collisionObj;
    that = this.getEntity()._components;
    if (that.Moveable.isCenterOfTile()){
        //check if the new Tile have turnig options if random them.
        this._pathfind(function(){
            that.Moveable.move(this._direction);
        });

    } else {
        collisionObj= this.checkMovementCollisions(this._direction);
        if (!collisionObj.collision){
            that.Moveable.move(this._direction);
        } else {
            if(this._isMovementThouCollision(collisionObj)){
                that.Moveable.move(this._direction);
            }else {
                this._pathfind(function(){
                    this.getEntityComponents().Moveable.move(this._direction);
                });
            };
        };
    };
};

AIControle.prototype.move=function (dir){
    that = this.getEntityComponents();
    switch (dir){
        case Dir.RIGHT: that.Moveable.moveRight(); break;
        case Dir.DOWN: that.Moveable.moveDown(); break;
        case Dir.UP: that.Moveable.moveUp(); break;
        case Dir.LEFT: that.Moveable.moveLeft(); break;
        default: throw "AIControle.move - Dir out of bounds";
    }
};

AIControle.prototype.getTarget=function(){
    if (this._target==undefined){
        var entities= Game.entityHandler.entities;
        for(var i=0;i < entities.length ; i++){
            if ('UserControle' in entities[i]) {
                this._target = entities[i];
            };
        };
    };
    return this._target;
};

AIControle.prototype._isMovementThouCollision = function(collisionObj){
    that = this.getEntityComponents();
    var move = true;
    var hitUser = false;
    for (var i in collisionObj.entities) {
        if(collisionObj.entities[i].hasOwnProperty('UserControle')){     //TODO Fix this ugly
            if (!hitUser){
                this._collision(that,'UserControle');
                //that.trigger('UserCollition');
                hitUser = true;
            }
            move = true;
        }else if (collisionObj.entities[i].hasOwnProperty("Wall")){       
            return false;
        }else if (collisionObj.entities[i].hasOwnProperty('AIControle')){
            return false;
        }else if (collisionObj.entities[i].hasOwnProperty('Point')){
            move = true;
        }
    }
    return move;
}

AIControle.prototype.checkMovementCollisions = function (dir){
    that = this.getEntityComponents();
    var collisionObj;
    switch (dir){
        case Dir.RIGHT: 
			collisionObj = that.Collision.detect(Dir.RIGHT); 
			break;
        case Dir.DOWN: 
			collisionObj = that.Collision.detect(Dir.DOWN);  
			break;
        case Dir.UP: 
			collisionObj = that.Collision.detect(Dir.UP);  
			break;
        case Dir.LEFT: 
			collisionObj = that.Collision.detect(Dir.LEFT);    
			break;
        default: throw new Error ("AIControle.checkMovementCollisions - Dir out of bounds "+ log(dir) + "!");
    }
    return collisionObj;
};



AIControle.prototype._getClosestDirToTarget = function(availableDirs,target){
    var distToTarget = 9999999999999999999999999;
    var dir = undefined;
    var newDistToTarget;
    for (var index=0;index < availableDirs.length;index++){
        switch (availableDirs[index]){
            case Dir.UP :
                newDistToTarget = this._distToTargetIn2(0,+Math.round(BRICK_WIDTH/2),target);
                if (distToTarget > newDistToTarget){
                    distToTarget = newDistToTarget;
                    dir = Dir.UP;
                }
                break;
            case Dir.DOWN :
                if (distToTarget > this._distToTargetIn2(0,-Math.round(BRICK_WIDTH/2),target)){
                    distToTarget = this._distToTargetIn2(0,-Math.round(BRICK_WIDTH/2),target);
                    dir = Dir.DOWN;
                }
                break;
            case Dir.LEFT :
                if (distToTarget > this._distToTargetIn2(Math.round(BRICK_WIDTH/2),0,target)){
                    distToTarget = this._distToTargetIn2(Math.round(BRICK_WIDTH/2),0,target);
                    dir = Dir.LEFT;
                }
                break;
            case Dir.RIGHT :
                if (distToTarget > this._distToTargetIn2(-Math.round(BRICK_WIDTH/2),0,target)){
                    distToTarget = this._distToTargetIn2(-Math.round(BRICK_WIDTH/2),0,target);
                    dir = Dir.RIGHT;
                }
                break;
        }
    }
    return dir;
}

/**
 * Distance to target a valid entity. 
 * @return dist to target in square.  
 */
AIControle.prototype._distToTargetIn2 = function(xOffset,yOffset,target){
    if (isNaN(xOffset) || isNaN(yOffset)) throw new Error("AIControle._distToTarget - parameter not a valid number");
	if (!target) throw new Error("AIControle._distToTarget - no target" + getPrototypeStringOf(target));
	var that = this.getEntityComponents();
    var targetPos ={};
    targetPos.x=target.Pos.getX();
    targetPos.y=target.Pos.getY();
    var deltaX = Math.abs(targetPos.x - that.Pos.getX()+xOffset);
    var deltaY = Math.abs(targetPos.y - that.Pos.getY()+yOffset);//Math.round(BRICK_WIDTH/2));
    return (deltaX*deltaX)+(deltaY*deltaY);
};

AIControle.prototype._getAvailableMovementDirections = function(currentDir){
    var availableDirs = [];
    var that = this.getEntityComponents();
    for (var ic=0 ;ic < 4 ;ic++){
        if (ic+currentDir !== 3 ){
            var collisionObj = this.checkMovementCollisions(ic);
            if (!collisionObj.collision){
                availableDirs.push(ic);
            } else { //If user standing there it is a collition but it a available path!
                if(that.AIControle._isMovementThouCollision(collisionObj)){
                   availableDirs.push(ic);
                }
            }
        }
    }
    return uniqueArray(availableDirs);
};

AIControle.collisionConsecvences = {};
AIControle.collisionConsecvences.chase = function(){
    document.getElementById('messageArea').textContent="Game Over";
    Game.stop();
};

AIControle.collisionConsecvences.scared = function(){
    var that= this.getEntityComponents();
    that.Point.collect();
    that.StateMachine.callState(that,"ghostCollected");
};

AIControle.collisionConsecvences.ghostCollected = function(){
};

AIControle.pathfinding = {};
AIControle.pathfinding.randDirection = function(callback){
    var dir = this._direction;
    var ret;
    var availableDirs =  this._getAvailableMovementDirections(dir);
    if (availableDirs.length >= 1){
        ret = availableDirs[Math.floor(Math.random()*availableDirs.length)];
        //this._direction = ret;
        this._direction = ret;
    } else {
        this._direction = 3 - dir;
    }
    if(callback instanceof Function){
        callback.call(this);
    }
};

AIControle.pathfinding.agressive = function(callback){
    var dir = this._direction;
    var availableDirs = this._getAvailableMovementDirections(dir);

    // Set default target to UserControle if target not sett
    if (this._target==undefined){
        var entities= Game.entityHandler.entities;
        for(var i=0;i < entities.length ; i++){
            if ('UserControle' in entities[i]) {
                this._target = entities[i];
            }
        };
    };
    //cal diff of choises
    if (availableDirs.length >= 1){
        this._direction = this._getClosestDirToTarget(availableDirs,this._target);
    } else {
        this._direction =  3-dir;
    };

    if(callback instanceof Function){
        callback.call(this);
    }

};

AIControle.pathfinding.semiAgressive = function(callback){
    var dir = this._direction;

    function getMiddleTile(ent1,ent2,availableDirs){
        var direkt;
        var pos1= {};
        var pos2= {};
        var retPos={};
        pos1.x = ent1.Pos.getX();
        pos1.y = ent1.Pos.getY();
        pos2.x = ent2.Pos.getX();
        pos2.y = ent2.Pos.getY();
        retPos.x=pos1.x + Math.round((pos2.x-pos1.x)/2);
        retPos.y=pos1.y + Math.round((pos2.y-pos1.y)/2);
        var temporaryEntity= new Entity("tempEntity");
        temporaryEntity.addComponent(new Pos(retPos.x ,retPos.y));
        direkt = this._getClosestDirToTarget(availableDirs,temporaryEntity);

        return direkt;
    };

    var availableDirs = this._getAvailableMovementDirections(dir);
    if (this._additionalTarget==undefined){
        //TODO inte så snyggt hur den får det additional target. hårdkådat
        this._additionalTarget= Game.entityHandler.getEntityByName("ghost3");
        if (this._additionalTarget == undefined){
            throw "AIControle.semiAgressive - diddent find additional target";
        }
    };
    // TODO gör en funktion och bryt ut (dupplicerad kod)
    if (this._target===undefined){
        var entities= Game.entityHandler.entities;
        for(var i=0;i < entities.length ; i++){
            if ('UserControle' in entities[i]) {
                this._target = entities[i];
            };
        };
    };

    if (availableDirs.length >= 1){
        dir = getMiddleTile.call(this,this._target,this._additionalTarget,availableDirs);
        this._direction = dir;
    } else {
        this._direction = 3-dir;
    };
    if(callback instanceof Function){
        callback.call(this);
    }

};

AIControle.pathfinding.agressiveToRandom = function(callback){
    var dir = this._direction;
    var bricksToChangeBehavior = 10;
    var availableDirs =this._getAvailableMovementDirections(dir);
    var ret = dir;
    var distanceWhenChangeBehavior = (BRICK_WIDTH*BRICK_HEIGHT*bricksToChangeBehavior)

    if (this._target==undefined){
        var entities= Game.entityHandler.entities;
        for(var i=0;i < entities.length ; i++){
            if ('UserControle' in entities[i]) {
                this._target = entities[i];
            };
        };
    };

    if (availableDirs.length >= 1){
        if (this._distToTargetIn2(0,0,this._target) >  distanceWhenChangeBehavior){
            ret =  this._getClosestDirToTarget(availableDirs,this._target);
        } else {
            ret = availableDirs[Math.floor(Math.random()*availableDirs.length)];
        }
    } else {
        ret = 3-dir;
    };
    this._direction = ret;

    if(callback instanceof Function){
        callback.call(this);
    }

};

AIControle.pathfinding.center = function(callback){
    var dir = this._direction
    var temporaryEntity= new Entity("tempEntity");
    temporaryEntity.addComponent(new Pos(13*BRICK_WIDTH,17*BRICK_HEIGHT));
    var availableDirs = this._getAvailableMovementDirections(dir);
    if (availableDirs.length < 1) {
        availableDirs = [this._direction];
    }
    this._direction = this._getClosestDirToTarget(availableDirs,temporaryEntity);
    if(callback instanceof Function){
        callback.call(this);
    }

};

AIControle.pathfinding.scared = function(callback){
    var dir = this._direction;
    var temporaryEntity= new Entity("tempEntity");

    var availableDirs = this._getAvailableMovementDirections(that,dir);

    if (availableDirs.length >= 1){
        this._direction = this._getClosestDirToTarget(availableDirs,this._target);
    } else {
        this._direction = 3-dir;
    };

    if(callback instanceof Function){
        callback.call(this);
    }
};

AIControle.pathfinding.scatter = function(callback){
    var dir = this._direction;
    var availableDirs =  this._getAvailableMovementDirections(dir);
    availableDirs.push(3-dir);
    this._direction = availableDirs[Math.floor(Math.random()*availableDirs.length)];

    if(callback instanceof Function){
        callback.call(this);
    }

};