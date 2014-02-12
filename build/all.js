/**
 * Ollibolli javascript inheritence
 * The goal of this is to create a simple prototyping and maintain the prototype chain.  
 * Using the javascript constructor function as the constructor and not breaking the prototype chain
 * by copying functions. And be able to verify constructor parameters in the constructor function. 
 *
 * 
 * 
 * Big contributor is Juan Mendes (http://js-bits.blogspot.se/);
 */


/**
 * This is the core function for Ollibolli javascript Inheritence
 * By copying the prototype of the prototyping object to a surrogate Constructor function and using the 
 * new on that prevent using the constructor function. 
 *   
 */

Function.prototype.Extend = function(parent){	
	eval('var surrogateConstructor = function '+ parent.name + '(){}');	
	surrogateConstructor.prototype = parent.prototype;

	this.initSuper = function initSuper(obj,argument){
		// initSuper.caller == Super 
		if (typeof initSuper.caller === "function" 
			&& initSuper.caller.prototype 
			&& initSuper.caller.toString() == this.prototype.Super.toString()
		){
			parent.apply(obj,argument);
		} else {
			throw new Error('initSuper not called from Super');
		}
	}	

	
	this.prototype = new surrogateConstructor();
	this.prototype.constructor = this;

	/* adding 

	/**
	* A function equal to super. Use only in constructor Functions
 	* Important to always call Super in the extended constructor function. 
 	* By calling Super, every constructor in the prototype chain is applied on the new object 
 	*/
	this.prototype.Super = function Super(){
		if (typeof Super.caller == "function" 
			&& Super.caller.prototype 
			&& Super.caller.prototype.Super.toString() == Super.toString()
		){
			Super.caller.initSuper(this,arguments)
		} else {
			throw new Error("Super called from non constructor function");
		}
	}
	
	/*
	 * @return String
	 */
	this.prototype.toString = function toString(){
		return '[object '+this.getType+' ]';
	}
	
	this.prototype.toType = (function toType(global) {
	  return function(obj) {
	    if (obj === global) {
	      return "global";
	    }
	    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	  }
	})(this);

	this.prototype.getInstanceOf = function getInstanceOf(){
		return getPrototypeStringOf(this);
	};

};


																														 
function getPrototypeStringOf(obj) {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((obj).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
}


// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if(this.console){
    	var msg = Array.prototype.slice.call(arguments);
    	msg.push(arguments.callee); 
        console.log( Array.prototype.slice.call(arguments) );
    }
};


//--------------IMAGE PRELOADER
// http://www.webreference.com/programming/javascript/gr/column3
function ImagePreloader(images, callBack){
    this._callBack = callBack;
    this._loaded = 0;
    this._processed = 0;
    this.images = new Array();
    this._numOfImages = images.length;
    // for each image, call preload()
    for ( var i = 0; i < images.length; i++ )
        this.preload(images[i]);
};

ImagePreloader.prototype.preload = function(image){
    // create new Image object and add to array

    var image = new Image;
    this.images.push(image);
    // set up event handlers for the Image object
    image.onload = ImagePreloader.prototype.onload;
    image.onerror = ImagePreloader.prototype.onerror;
    image.onabort = ImagePreloader.prototype.onabort;
    // assign pointer back to this.
    image.imagePreloader = this;
    image.loaded = false;
    // assign the .src property of the Image object
    image.src = image;
};

ImagePreloader.prototype.onComplete = function(){
    this._processed++;
    if ( this._processed == this._numOfImages )
    {
        this._callBack(this.sounds, this._loaded);
    }
};

ImagePreloader.prototype.onload = function(){
    this.loaded = true;
    this.imagePreloader._loaded++;
    this.imagePreloader.onComplete();
}

ImagePreloader.prototype.onerror = function(){
    this.error = true;
    this.imagePreloader.onComplete();
};

ImagePreloader.prototype.onabort = function()
{
    this.abort = true;
    this.imagePreloader.onComplete();
};

//-----------------KEY helper object---------

function roundNumber4(num) {
    return  Math.round(num*10000/10000);
};

var Dir = {
    UP:2,
    LEFT:0,
    RIGHT:3,
    DOWN:1
};

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;

};

var beep = function(src){
    var beeps= [
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src)
    ];
    var i=0;

    return {
        play:function(){
            beeps[i].play();
            i++;
            if (i > 9) i=0 ;
        }
    }
};

function uniqueArray(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for ( x = 0; x < origLen; x++ ) {
        found = undefined;
        for ( y = 0; y < newArr.length; y++ ) {
            if ( origArr[x] === newArr[y] ) {
                found = true;
                break;
            }
        }
        if ( !found) newArr.push( origArr[x] );
    }
    return newArr;
}

;

/**
 * Object father off all 
 */


Base.Extend(Object);
function Base(){};

Base.prototype.getInstanceOfName = function (){
	var funcNameRegex = /function (.{1,})\(/;
	var results = (funcNameRegex).exec((this).constructor.toString());
	return (results && results.length > 1) ? results[1] : "";
}
;

Entity.Extend(Base);

function Entity(name){
	if (!name) throw new Error ("No name Parameter");
    this.Super();
    this.name = name;
    this._components = {};
}

Entity.prototype.addComponent = function(component){
    if (component instanceof Component){
        //check if entity has dependent components
        if (component.hasEntityDependentComponents(this)){
	        component.setEntity(this);
	        this._components[getPrototypeStringOf(component)] = component;
        }else throw new Error (this.name + " missing dependent component "+component.dependencies);
    } else throw new EvalError (component.toString +" is not a component");

};

Entity.prototype.removeComponent = function(componentType){
    var component;
    if (this._components.hasOwnProperty(componentType)){
        component = this._components[componentType];
        delete this._components[componentType];
    }
    return component;
};

Entity.prototype.update = function(){
    if (this._components.hasOwnProperty('AIControle')){
        this._components.AIControle.update();
    }
    if (this._components.hasOwnProperty('UserControle')){
        this._components.UserControle.update();
    }
    if (this._components.hasOwnProperty('Sound')){
        this._components.Sound.update();
    }
};

Entity.prototype.trigger = function(event){
	if (! event instanceof Event) throw new EvalError('Entity.trigger - not valid Event');
	for (member in this._components){
		member.handleEvent(event);
	}
};

Entity.prototype.handleEvent = function(event){
	this.trigger(event);			
};

Entity.prototype.getComponents = function(){
	return this._components;			
};

Entity.prototype.draw = function(){
};
function TileHandler(){
    this.tiles = (function(){
        var tiles = [];
        for (var i=0;i < (GRID_HEIGHT*GRID_WIDTH);i++){
            tiles.push([]);
        }
        return tiles;
    })();
}

TileHandler.prototype.addEntityOnTile = function(tileIndex,entity){
    if (! entity instanceof Entity ) throw new Error('Wrong parameters - expected numeric,Entity');
	if (entity === undefined) throw new Error('Entity undefined'); 
	this.tiles[tileIndex].push(entity);
};

TileHandler.prototype.getEntitesOnTile = function(tileIndex){
    return this.tiles[tileIndex];

};

TileHandler.prototype.moveEntity= function (entity,fromTileIndex,toTileIndex){
    var _entity = this.removeEntity(entity,fromTileIndex);
    if (_entity){
        this.addEntityOnTile(toTileIndex , _entity);
    } //else throw "TileHandler.moveEntity - no "+that.name+" in tile " +fromTileIndex ;
};

TileHandler.prototype.removeEntity= function (entity,fromTileIndex){
    if (entity instanceof Entity) {
    	if ( ! isNaN(fromTileIndex)){ 
   		   	var _entity;
		   	var entities = this.getEntitesOnTile(fromTileIndex);
			for (var ix in entities){
	        	if (entities[ix].name == entity.name ){
	           		_entity = entities.splice(ix,1);
	        	}
	    	}
    		if (_entity === undefined) throw new Error('tilehandler.removeEntity - entity not in tile : logic error');
    	}else throw new Error('Not a valid tile Index : '+fromTileIndex ); 
    } else throw new Error('Not a valid Entity'); 
    return _entity[0];
};




EntityHandler.Extend(Base);

function EntityHandler () { 
    this.Super();
    this.entities = new Array();
}	
	
EntityHandler.prototype.add = function(entity) {
    if (entity instanceof Entity){
        this.entities.push(entity);
        if(entity.getComponents().hasOwnProperty('Pos')){
            Game.tileHandler.addEntityOnTile(entity.getComponents().Pos.getTile(),entity);
        }
    };
};

EntityHandler.prototype.removeLast = function() {
	    return this.entities.pop();
};
	
EntityHandler.prototype.remove = function(entity) {
	    Game.tileHandler.removeEntity(entity,entity.getComponents().Pos.getTile());
	    for (var i = 0 ;i < this.entities.length; i++){
	        if (this.entities[i] == entity ){
	            this.entities.splice(i,1);
	        }
	    }
};
EntityHandler.prototype.updateMovable = function(){
    var entities= this.entities;
    for(var i=0;i < entities.length ; i++){
        if (entities[i]._components.hasOwnProperty('Moveable')) {
            entities[i].update();
        }
    };
};

EntityHandler.prototype.drawRenderable = function() {
	var entities = this.entities;
	for(var i = 0; i < entities.length; i++) {
		if(entities[i]._components != undefined) {
			if('Renderable' in entities[i]._components) {
				entities[i]._components.Renderable.render(entities[i]._components.Pos);
			}
		} 
	}
};

EntityHandler.prototype.update = function(){
	    var entities= this.entities;
	    for(var i=0;i < entities.length ; i++){
	        entities[i].update();
		}
};

EntityHandler.prototype.trigger = function(event){
	if (event instanceof Event) {
	    var entities= this.entities;
	    for(var i=0;i < entities.length ; i++){
	        entities[i].handleEvent(event);
		}
	} else{throw Error('Entityhandler.trigger - Not a valid event');};
};

EntityHandler.prototype.getEntityByName = function(name){
    var entities= this.entities;
    for(var i=0;i < entities.length ; i++){
        if (entities[i].name==name) {
            return entities[i];
        }
    }
    return null;
};

EntityHandler.prototype.getEntitiesByComponent = function(component){
    var entities= this.entities;
    var entArray=[];
    for(var i=0;i < entities.length ; i++){
        if (entities[i].hasOwnProperty(component)){
            entArray.push(entities[i]);
        }
    }
    if(entArray.length < 1){
        return null;
    } else {
        return entArray;
    }
};    












function Component() {
	this.Super();
	this.dependencies = null;
	this._entity = null;		
}

Component.Extend(Base);

Component.prototype.getEntity = function () {
		return this._entity;
	};
	
Component.prototype.setEntity = function setEntity(entity) {
		if( entity instanceof Entity) {
			if(this.hasEntityDependentComponents(entity)) {
				this._entity = entity;
			} else { throw new Error('Entity missing one of dependent component ' + this.dependencies.toString() + ' for ' + this.getClass());}
		} else {throw new TypeError('Not a entity');}
	};


// Implement this
Component.prototype.getEntityComponents = function() {
    return this._entity._components;
};


/**
 * @param entity - of class Entity
 */
Component.prototype.hasEntityDependentComponents = function(entity) {
	if(!entity instanceof Entity)
		throw EvalError('Not an instance of Entity');
	if(this.dependencies) {
		for(var i=0;i < this.dependencies.length;i++) {
			if(!entity._components.hasOwnProperty(this.dependencies[i])) {
				return false;
			}
		}
		return true;
	}
	return true;
};

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





function Renderable(canvasContext,renderFunction){
    if (typeof renderFunction !== "function" || !canvasContext) throw new Error('Wrong parameters in constructor');
    this.dependencies=["Pos"];
    //TODO test for right type of argument
    this._cContext=canvasContext;
    this.render = renderFunction;
    this._effect = function(){};
};

Renderable.prototype = new Component("Renderable");
Renderable.prototype.constructor = Renderable;


Renderable.prototype.update = function(){
    this._effect();
};


Renderable.effects = {}
Renderable.effects.warning = function(){
    setTimeout(function(obj){
        obj.render= Renderable.presentation.scaredGhostEnd;
    },SCARED_TIME-800,this);
};


/*      RENDERS     */
Renderable.presentation = {};

Renderable.presentation.wall =function(pos) {
    this._cContext.fillStyle = "rgb(0,0,0)";
    this._cContext.fillRect(pos.getX(),pos.getY(),BRICK_WIDTH,BRICK_HEIGHT);
    this._cContext.fillStyle = "rgb(100,100,100)";
    this._cContext.fillRect(pos.getX()+3,pos.getY()+3,BRICK_WIDTH-6,BRICK_HEIGHT-6);
};
Renderable.presentation.floor = function(pos){
    this._cContext.fillStyle = "rgb(0,0,0)";
    this._cContext.fillRect(pos.getX(),pos.getY(),BRICK_WIDTH,BRICK_HEIGHT);
};

Renderable.presentation.score = function(pos){
    this._cContext.fillStyle    = "#aaa";
    this._cContext.font         = "20px sans-serif";
    this._cContext.textBaseline = "top";
    this._cContext.fillText  (Point.score, 20,20);
};

Renderable.presentation.packman = function(pos){
    //TODO CALCULATE CENTER OF FIG
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 13, 0, 2 * Math.PI, false);
    this._cContext.fillStyle = "#0ff";
    this._cContext.fill();
};

Renderable.presentation.ghost1 = function(pos){
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 13, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = "#f00";
    this._cContext.fill();
};

Renderable.presentation.ghost2 = function(pos){
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 13, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = "#0f0";
    this._cContext.fill();
};

Renderable.presentation.ghost3 = function(pos){
//   this._cContext.fillStyle = "rgb(0,0,255)";
//   this._cContext.fillRect(pos.getX()-10,pos.getY()-10,BRICK_WIDTH,BRICK_HEIGHT);
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 13, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = "#00f";
    this._cContext.fill();
};

Renderable.presentation.ghost4 = function(pos){
//   this._cContext.fillStyle = "rgb(0,0,255)";
//   this._cContext.fillRect(pos.getX()-10,pos.getY()-10,BRICK_WIDTH,BRICK_HEIGHT);
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 13, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = "#ff0";
    this._cContext.fill();
};

Renderable.presentation.scaredGhost = function(pos){
    this._cContext.fillStyle = this._stateChangeWarning();


    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 13, 0, 2 * Math.PI, false);

    this._cContext.fill();
};

Renderable.prototype._stateChangeWarning = function(){
    var fillStyle;
    var time =(new Date).getTime();
    if (!this._startTime){
        this._startTime=time;
    }
    if ((time > this._startTime+SCARED_TIME-100)){
        fillStyle = "#f6a";
        delete this._startTime;
    }else if (time >this._startTime+SCARED_TIME-200) {
        fillStyle = "#56a";
    } else if (time >this._startTime+SCARED_TIME-400){
        fillStyle = "#f6a";
    } else if (time >this._startTime+SCARED_TIME-600){
        fillStyle = "#56a";
    } else if (time >this._startTime+SCARED_TIME-800){
        fillStyle = "#f6a";
    } else {
        fillStyle = "#56a";
    }
    return fillStyle;
}

Renderable.presentation.ghostCollected = function(pos){
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 5, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = this._stateChangeWarning();
    this._cContext.fill();
};

Renderable.presentation.dot = function(pos){
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 3, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = "#fff";
    this._cContext.fill();
};

Renderable.presentation.bigDot = function(pos){
    this._cContext.beginPath();
    this._cContext.arc(pos.getX(), pos.getY(), 9, 0, 2 * Math.PI, false);

    this._cContext.fillStyle = "#fff";
    this._cContext.fill();
};



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

AIControle.Extend(Component);

function AIControle(entity, startingDirection,pathfind,collision,target){
	if (!(entity instanceof Entity)) throw new Error('STORERROR');
	this.Super(entity); 
    this._direction = startingDirection;
    this._target = target;
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
    var that = this.getEntityComponents();
    var move = true;
    var hitUser = false;
    for (var i in collisionObj.entities) {
        if(collisionObj.entities[i].getComponents().hasOwnProperty('UserControle')){     //TODO Fix this ugly
            if (!hitUser){
                this._collision(that,'UserControle');
                Game.stop();
                //alert('Game over');
                hitUser = true;
            }
            move = true;
        }else if (collisionObj.entities[i].getComponents().hasOwnProperty("Wall")){
            return false;
        }else if (collisionObj.entities[i].getComponents().hasOwnProperty('AIControle')){
            return false;
        }else if (collisionObj.entities[i].getComponents().hasOwnProperty('Point')){
            move = true;
        }
    }
    return move;
}

AIControle.prototype.checkMovementCollisions = function (dir){
    var that = this.getEntityComponents();
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
	if (!target) throw new Error("AIControle._distToTarget - no target");
	var that = this.getEntityComponents();
    var targetPos ={};
    targetPos.x=target.getComponents().Pos.getX();
    targetPos.y=target.getComponents().Pos.getY();
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
        pos1.x = ent1.getComponents().Pos.getX();
        pos1.y = ent1.getComponents().Pos.getY();
        pos2.x = ent2.getComponents().Pos.getX();
        pos2.y = ent2.getComponents().Pos.getY();
        retPos.x=pos1.x + Math.round((pos2.x-pos1.x)/2);
        retPos.y=pos1.y + Math.round((pos2.y-pos1.y)/2);
        var temporaryEntity= new Entity("tempEntity");
        temporaryEntity.addComponent(new Pos(temporaryEntity,retPos.x ,retPos.y));
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

function Wall(){
	this.dependencies = ["Pos"];
};

Wall.prototype= new Component();
Wall.prototype.constructor= Wall;
function Point(value,collectCallback,addToNumberOfPoints){
    this.dependencies = ["Pos"];
    this._value = value;
    this.collect = collectCallback;
    if (!Point.numberOfPoints){
        Point.numberOfPoints =0;
    }
    if (addToNumberOfPoints){
        Point.numberOfPoints++;
    };
    this._i = 0;
}

Point.prototype= new Component("Point");
Point.prototype.constructor= Point;
Point.prototype.getValue = function(){
  return this._value;
};

Point.score=0;
Point.numberOfPoints=0;

Point.collectActions={}
Point.collectActions._testScore = function(that){
    if (!Point.score){
        Point.score=0;
    }

    Point.score += this._value;
    Point.numberOfPoints--;
    Game.entityHandler.remove(that);
    if (Point.numberOfPoints <=0){
        document.getElementById('messageArea').textContent="CONGRATULATIONS --- YOU WIN --- Press S to restart";
        Game.stop();
    }

};

Point.collectActions.dot= function(that){
    Point.collectActions._testScore.call(this,that);
    Game.sounds.beep.play();
};

Point.collectActions.bigDot= function(that){
    Point.collectActions._testScore.call(this,that);
    if (StateMachine){
        StateMachine.changeState("scared","chase",SCARED_TIME);
    }
    Game.sounds.beep.play();
};

Point.collectActions.nulled = function(that,i){

};


Point.collectActions.ghost = function(i){
    var that = this.getEntityComponents(); 
    var timeHandler;
    var ghostScoreEntity = new Entity(that.name+"point");
    var x = new Number(that.Pos.getX());
    var y = new Number(that.Pos.getY());
    Point.score += this._value;
    ghostScoreEntity.addComponent(new Pos(x,y));
    ghostScoreEntity.addComponent(new Renderable(Game.context,function (pos){
            if (!this._presentation_score){
                this._presentation_score=0;
            }
            this._presentation_score ++;
            this._cContext.fillStyle    = "#fff";
            this._cContext.font         = "20px sans-serif";
            this._cContext.textBaseline = "top";
            this._cContext.fillText("1000",that.Pos.getX(),that.Pos.getY()-this._presentation_score );
    }));
    Game.entityHandler.add(ghostScoreEntity);
    timeHandler = setTimeout(function(){
        Game.entityHandler.remove(ghostScoreEntity);
    },2000);
};
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
;




function UserControle(entity) {
    if (entity instanceof Entity){
	    this.dependencies = ["Moveable","Collision"];
	    this._direction = 0;
	    this._collision  = UserControle.collisionConsecvences.chase;
	    this.setEntity(entity);
	} else {
		throw new TypeError('UserControle - Not a entity')
	}
}

UserControle.Extend(Component)

UserControle.prototype.handleEvent = function(event){
	if (event instanceof Event){
		switch (event.type) {
			case event.UPDATE :
//				this.update();
				log('User update');
				break;
			case event.KEYBOARD :
				log('User keyboard');
				break;
			case event.RENDER :
//				this.render();
				break;
			case event.COLLISION :
				log('Collision');
				this._collision;	
		}	
	}	
}

UserControle.prototype.update = function() {
    var setDir = function(dir){
        if (this.getEntityComponents().Moveable.isCenterOfTile() ){
            var bool= this._isMovementThouCollision(dir);
            if(bool){
                this._direction = dir;
            }
        } else{
            if (3-this._direction==dir){
                this._direction = dir;
            }
        }
    };

    if (Keyboard.isDown(Keyboard.UP)) {
        setDir.call(this,Dir.UP);
    }

    if (Keyboard.isDown(Keyboard.LEFT)){
        setDir.call(this,Dir.LEFT);
    }

    if (Keyboard.isDown(Keyboard.DOWN)){
        setDir.call(this,Dir.DOWN);
    }
    if (Keyboard.isDown(Keyboard.RIGHT)) {
        setDir.call(this,Dir.RIGHT);
    }

    this._checkAndCollectPoints();
    this._checkCollisionAndMove(this._direction);

};

UserControle.prototype._checkCollisionAndMove = function (dir){
    if(this._isMovementThouCollision(dir)){
        this.getEntityComponents().Moveable.move(dir);
    }

};

UserControle.prototype._isMovementThouCollision = function (dir){
    var that = this.getEntityComponents();
    var collisionObj = that.Collision.detect(dir);
    var move = false;
    if (!collisionObj.collision){
        move=true;
    } else {
        for (var i in collisionObj.entities) {
            if (collisionObj.entities[i].getComponents().hasOwnProperty("Wall")){ //TODO UGLY
                move = false;
            } else {
                this._collision(collisionObj);
                move=true;
            }

        }
    }
    return move;
};

UserControle.prototype._checkAndCollectPoints = function(){
    var that = this.getEntityComponents();
    if (that.Moveable.isCenterOfTile()){
        var collisionObj= that.Collision.detect(undefined);
        if (collisionObj.collision){
            for (var i in collisionObj.entities) {
                if (collisionObj.entities[i].getComponents().hasOwnProperty("Point")){ //TODO ugly hardcoded
                    collisionObj.entities[i].getComponents().Point.collect(collisionObj.entities[i]);
                    return;
                }
            }
        }
    }

};

UserControle.collisionConsecvences = {};
UserControle.collisionConsecvences.scared = function(collisionObj){
    if(collisionObj.entities[0].getComponents().hasOwnProperty('AIControle')){
        collisionObj.entities[0].getComponents().AIControle._collision(collisionObj.entities[0]);
    }
};

UserControle.collisionConsecvences.chase = function(collisionObj){
     if(collisionObj.entities[0].getComponents().hasOwnProperty('AIControle')){
         document.getElementById('messageArea').textContent="Game Over";
         Game.stop();
     }
};
function StateMachine(changeSet){
    //this.init.call(this);
    this.dependencies;
    this._states = {};
    this._state ;
    if (!changeSet) throw new Error ("Missing Parameter - changeset obj");
    this._changeComponent = changeSet ;
};


StateMachine.prototype = new Component();
StateMachine.prototype.constructor  = StateMachine;

StateMachine.prototype.addState = function(name,components){
    if (name && components){
        this._states[name]=components;
    }else{
        throw new Error("Statemachine.addState - Missing Parameter");
    }
};

StateMachine.prototype.callState= function(entity,state){
    //If this is called recursive dont do this
    if (this._states.hasOwnProperty(state)){
        this._state=state;
    } else throw Error("StateMachine.callState - State "+state+" not found");
    if (this.hasEntityDependentComponents(entity)){
        if (this._states.hasOwnProperty(state)){
            var stateObj=this._states[state];  // the function to swop to in this state
            var changeComponent = this._changeComponent; //the path to the functions
            //mapp changeComponentWith stateObj
            for (var ix in stateObj){
                if (ix){
                    if (changeComponent.hasOwnProperty(ix)){
                        var splitHerarki = changeComponent[ix].split(".");
                        entity[splitHerarki[0]][splitHerarki[1]]=stateObj[ix];
                    };
                }
            }
        } else throw Error("StateMachine.callState - Missing state")
    } else throw ReferenceError("StateMachine.callState - Missing Dependencies "+that.dependencies );
};

StateMachine.changeState = function(state,backToState,time){  // this choud be an event
    this._state = state;
    StateMachine.entities = Game.entityHandler.getEntitiesByComponent("StateMachine");
    for(var i in StateMachine.entities){
        var entityWithSM = StateMachine.entities[i];
        entityWithSM.StateMachine.callState(entityWithSM,state);
        
    }
    Game.entityHandler.update(); //TODO why this?
    if (backToState && time){
        if (this._stateTimeoutHandler){
            clearInterval(this._stateTimeoutHandler);
        }
        this._stateTimeoutHandler = setTimeout(function(){
            StateMachine.changeState(backToState);

        },time);
    }
};


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















var Game = {
    fps:20,
    width: undefined,
    height: undefined,
    score: 0
};


(function() {
	var run = false;
    var loops = 0;
    var skipTicks = 1000 / Game.fps;
    var maxFrameSkip = 10;
	var startTime;
	var requestAnimationFrame = window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		function(callback) {
			return window.setTimeout(callback, 1000 / 60);
		};

	var cancelRequestAnimationFrame = window.cancelRequestAnimationFrame || 
		window.webkitCancelRequestAnimationFrame || 
		window.mozCancelRequestAnimationFrame || 
		window.oCancelRequestAnimationFrame || 
		window.msCancelRequestAnimationFrame ||
		function(id) {
			window.clearTimeout(id);
		};

	Game._onEachFrame = function(callback) {
		run=true;
		startTime = (new Date).getTime();
		log('run',run);
		//create a recursive funct ion
		var _cb = function() {
			callback();
			//check if clouser value is set to run
			if(run) {
				requestAnimationFrame(_cb);
			} 
		}
		//trigging the recursive function
		_cb();
	};
	
	Game._clearEachFrame = function() {
		run = false;
		log('run',run);
	};

    Game.run = function() {
        loops = 0;
        while ((new Date).getTime() > startTime && loops < maxFrameSkip) {
            Game.update();
	        Game.draw();
            startTime += skipTicks;
            loops++;
        }
    };

})();


Game.start = function(){
    Game.entityHandler.update();
    Game._onEachFrame(Game.run);
}

Game.draw = function() {
    Game.context.clearRect ( 0 , 0 , SCENE_WIDTH , SCENE_HEIGHT );
	Game.entityHandler.drawRenderable();
};

Game.update= function(){
    Game.entityHandler.updateMovable();
    Game.entityHandler.update();
};

Game.stop = function(){
    Game._clearEachFrame(Game.thread);
    buzz.all().pause();
};

Game.reset= function(){
    Game.stop();
    delete Game.tileHandler;
    delete Game.entityHandler;
    Game.entityHandler = new EntityHandler();
    Game.tileHandler = new TileHandler();
    Game._loadScene(SCENE);
    Game._loadEntitys();
    //Game.entityHandler.drawRenderble();
}

/**
 * Intizialize 
 */
Game.init = function(width,height,element,callback) {
    Game.canvas = document.createElement("canvas");
    Game.context = Game.canvas.getContext("2d");
    Game.canvas.width =  Game.width = width;
    Game.canvas.height = Game.height = height;
    element.appendChild(Game.canvas);
    Game.entityHandler = new EntityHandler();
    Game.tileHandler = new TileHandler();
    Game.entityHandler.drawRenderable();
    events = {}
    events.update = new Event(Event.UPDATE);
    events.draw = new Event(Event.RENDER);
};


///////////

Game._loadScene = function(gameScene){

    var addWall = function(x,y,diameter){
        var e1 = new Entity("wall:"+x+","+y+":");
        e1.addComponent(new Pos(e1,x*BRICK_WIDTH,y*BRICK_HEIGHT));
        e1.addComponent(new Renderable(Game.context, Renderable.presentation.wall));
        e1.addComponent(new Wall());
        e1.addComponent(new Collision(e1,20));
        
        Game.entityHandler.add(e1);
    };

    var addFloor = function (x,y){
        var e1 = new Entity("floor:"+x+","+y+":");
        e1.addComponent(new Pos(e1,x*BRICK_WIDTH,y*BRICK_HEIGHT));
        e1.addComponent(new Renderable(Game.context, Renderable.presentation.floor));
        Game.entityHandler.add(e1);
    };

    var addDot= function(x,y){
        var e1 = new Entity("dot:"+x+","+y+":");
        e1.addComponent((new Pos(e1,(x*BRICK_WIDTH)+Math.round(BRICK_WIDTH/2),(y*BRICK_HEIGHT)+Math.round(BRICK_HEIGHT/2))));
        e1.addComponent(new Point(10,Point.collectActions.dot,true));
        e1.addComponent(new Renderable(Game.context, Renderable.presentation.dot));
        e1.addComponent(new Collision(e1,10));
        Game.entityHandler.add(e1);
    };

    var addBigDot = function(x,y){
        var e1 = new Entity("bigDot:"+x+","+y+":");
        e1.addComponent((new Pos(e1,(x*BRICK_WIDTH)+Math.round(BRICK_WIDTH/2),(y*BRICK_HEIGHT)+Math.round(BRICK_HEIGHT/2))));
        e1.addComponent(new Point(50,Point.collectActions.bigDot,true));
        e1.addComponent(new Renderable(Game.context, Renderable.presentation.bigDot));
        e1.addComponent(new Collision(e1,10));

        Game.entityHandler.add(e1);
    };


    for (var j in gameScene){
        for(var i in gameScene[j]){
            var brick = gameScene[j][i];
            switch (brick){
                //case 0: addFloor(i,j); break;
                case 1: addWall(i,j); break;
                case 2: addDot(i,j); break;
                case 3: addBigDot(i,j); break;
            }
        }
    };

};

Game._loadEntitys= function(){
    /*var e1 = new Entity("Sound");
    e1.addComponent(new Sound());
    var stateMachine = new StateMachine({sound:"Sound._sound"});
    stateMachine.addState("scared",{sound:Sound.sounds.scared});
    stateMachine.addState("chase",{sound:Sound.sounds.chase});
    e1.addComponent(stateMachine);
    Game.entityHandler.add(e1);*/

    var e1 = new Entity("Score");
    e1.addComponent(new Pos(e1,10,10));
    e1.addComponent(new Renderable(Game.context,Renderable.presentation.score));
    Game.entityHandler.add(e1);

/*    var e1 = new Entity("Player");
    e1.addComponent(new Pos(e1,14*BRICK_WIDTH,25*BRICK_HEIGHT));
    e1.addComponent(new Renderable(Game.context, Renderable.presentation.packman));
    e1.addComponent(new Collision(e1,20));
    e1.addComponent(new Moveable(e1,200));
    e1.addComponent(new UserControle(e1));
    var sM =new StateMachine({collision:"UserControle._collision"});
    sM.addState("scared",{collision:UserControle.collisionConsecvences.scared});
    sM.addState("chase",{collision:UserControle.collisionConsecvences.chase});
    e1.addComponent(sM); */
    var player = new Entity('Player');
    new Pos(player,14*BRICK_WIDTH,25*BRICK_HEIGHT+10);
    player.addComponent(new Renderable(Game.context,Renderable.presentation.packman));
    player.addComponent(new Collision(player,20));
    player.addComponent(new Moveable(player,200));
    player.addComponent(new UserControle(player));
    var sM =new StateMachine({collision:"UserControle._collision"});
    sM.addState("scared",{collision:UserControle.collisionConsecvences.scared});
    sM.addState("chase",{collision:UserControle.collisionConsecvences.chase});
    player.addComponent(sM);
    Game.entityHandler.add(player);

    var addGhost = function(name,x,y,render,path,speed,chaseTarget,scaredTarget){
        var e1 = new Entity(name);
        new Pos(e1,x*BRICK_WIDTH,y*BRICK_HEIGHT);
        e1.addComponent(new Renderable(Game.context,render));
        e1.addComponent(new Collision(e1,20));
        e1.addComponent(new Moveable(e1,speed));
        e1.addComponent(new AIControle(e1,Dir.DOWN, path, AIControle.collisionConsecvences.chase,chaseTarget));
        e1.addComponent(new Point(1000,Point.collectActions.ghost));
        var stateMachine = new StateMachine({
            pathfind    :"AIControle._pathfind",
            collision   :"AIControle._collision",
            presentation:"Renderable.render",
            target      :"AIControle._target",
            point       :"Point.collect",
            effect      :"Renderable._effect"

        });
        stateMachine.addState("chase",{
            pathfind    :path,
            presentation:render,
            collision   :AIControle.collisionConsecvences.chase,
            target      :chaseTarget
        });
        stateMachine.addState("scared",{
            pathfind    :AIControle.pathfinding.scared,
            presentation:Renderable.presentation.scaredGhost,
            collision   :AIControle.collisionConsecvences.scared,
            target      :scaredTarget,
            point       :Point.collectActions.ghost,
            effect      :Renderable.effects.warning
        });
        stateMachine.addState("ghostCollected",{
            pathfind    :AIControle.pathfinding.center,
            presentation:Renderable.presentation.ghostCollected,
            collision   :AIControle.collisionConsecvences.ghostCollected,
            point       :Point.collectActions.nulled
        });

        e1.addComponent(stateMachine);

        Game.entityHandler.add(e1);
    };

    var e2 = new Entity("target1");
    e2.addComponent(new Pos(e1,2*20,2*20));
    addGhost("ghost1",13,17,Renderable.presentation.ghost1,AIControle.pathfinding.semiAgressive,160,e1,e2);
    var e2 = new Entity("target2");
    e2.addComponent(new Pos(e1,27*20,2*20));
    addGhost("ghost2",14,17,Renderable.presentation.ghost2,AIControle.pathfinding.randDirection,160,e1,e2);
    var e2 = new Entity("target3");
    e2.addComponent(new Pos(e1,2*20,34*20));
    addGhost("ghost3",14,14,Renderable.presentation.ghost3,AIControle.pathfinding.agressive,160,e1,e2);
    var e2 = new Entity("target4");
    e2.addComponent(new Pos(e1,27*20,34*20));
    addGhost("ghost4",15,17,Renderable.presentation.ghost4,AIControle.pathfinding.agressiveToRandom,160,e1,e2);
};
// ----------------------------------------------------------------------------
// Buzz, a Javascript HTML5 Audio library
// v 1.0.4 beta
// Licensed under the MIT license.
// http://buzz.jaysalvat.com/
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files ( the "Software" ), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------

var buzz = {
    defaults: {
        autoplay: false,
        duration: 5000,
        formats: [],
        loop: false,
        placeholder: '--',
        preload: 'metadata',
        volume: 80
    },
    types: {
        'mp3': 'audio/mpeg',
        'ogg': 'audio/ogg',
        'wav': 'audio/wav',
        'aac': 'audio/aac',
        'm4a': 'audio/x-m4a'
    },
    sounds: [],
    el: document.createElement( 'audio' ),

    sound: function( src, options ) {
        var options = options || {},
            pid = 0,
            events = [],
            eventsOnce = {},
            supported = buzz.isSupported();

        // publics
        this.load = function() {
            if ( !supported ) return this;

            this.sound.load();
            return this;
        }

        this.play = function() {
            if ( !supported ) return this;

            this.sound.play();
            return this;
        }

        this.togglePlay = function() {
            if ( !supported ) return this;

            if ( this.sound.paused ) {
                this.sound.play();
            } else {
                this.sound.pause();
            }
            return this;
        }

        this.pause = function() {
            if ( !supported ) return this;

            this.sound.pause();
            return this;
        }

        this.isPaused = function() {
            if ( !supported ) return null;

            return this.sound.paused;
        }

        this.stop = function() {
            if ( !supported  ) return this;

            this.setTime( this.getDuration() );
            this.sound.pause();
            return this;
        }

        this.isEnded = function() {
            if ( !supported ) return null;

            return this.sound.ended;
        }

        this.loop = function() {
            if ( !supported ) return this;

            this.sound.loop = 'loop';
            this.bind( 'ended.buzzloop', function() {
                this.currentTime = 0;
                this.play();
            });
            return this;
        }

        this.unloop = function() {
            if ( !supported ) return this;

            this.sound.removeAttribute( 'loop' );
            this.unbind( 'ended.buzzloop' );
            return this;
        }

        this.mute = function() {
            if ( !supported ) return this;

            this.sound.muted = true;
            return this;
        }

        this.unmute = function() {
            if ( !supported ) return this;

            this.sound.muted = false;
            return this;
        }

        this.toggleMute = function() {
            if ( !supported ) return this;

            this.sound.muted = !this.sound.muted;
            return this;
        }

        this.isMuted = function() {
            if ( !supported ) return null;

            return this.sound.muted;
        }

        this.setVolume = function( volume ) {
            if ( !supported ) return this;

            if ( volume < 0 ) volume = 0;
            if ( volume > 100 ) volume = 100;
            this.volume = volume;
            this.sound.volume = volume / 100;
            return this;
        },
        this.getVolume = function() {
            if ( !supported ) return this;

            return this.volume;
        }

        this.increaseVolume = function( value ) {
            return this.setVolume( this.volume + ( value || 1 ) );
        }

        this.decreaseVolume = function( value ) {
            return this.setVolume( this.volume - ( value || 1 ) );
        }

        this.setTime = function( time ) {
            if ( !supported ) return this;

            this.whenReady( function() {
                this.sound.currentTime = time;
            });
            return this;
        }

        this.getTime = function() {
            if ( !supported ) return null;

            var time = Math.round( this.sound.currentTime * 100 ) / 100;
            return isNaN( time ) ? buzz.defaults.placeholder : time;
        }

        this.setPercent = function( percent ) {
            if ( !supported ) return this;

            return this.setTime( buzz.fromPercent( percent, this.sound.duration ) );
        }

        this.getPercent = function() {
            if ( !supported ) return null;

			var percent = Math.round( buzz.toPercent( this.sound.currentTime, this.sound.duration ) );
            return isNaN( percent ) ? buzz.defaults.placeholder : percent;
        }

        this.setSpeed = function( duration ) {
			if ( !supported ) return this;

            this.sound.playbackRate = duration;
        }

        this.getSpeed = function() {
			if ( !supported ) return null;

            return this.sound.playbackRate;
        }

        this.getDuration = function() {
            if ( !supported ) return null;

            var duration = Math.round( this.sound.duration * 100 ) / 100;
            return isNaN( duration ) ? buzz.defaults.placeholder : duration;
        }

        this.getPlayed = function() {
			if ( !supported ) return null;

            return timerangeToArray( this.sound.played );
        }

        this.getBuffered = function() {
			if ( !supported ) return null;

            return timerangeToArray( this.sound.buffered );
        }

        this.getSeekable = function() {
			if ( !supported ) return null;

            return timerangeToArray( this.sound.seekable );
        }

        this.getErrorCode = function() {
            if ( supported && this.sound.error ) {
                return this.sound.error.code;
            }
            return 0;
        }

        this.getErrorMessage = function() {
			if ( !supported ) return null;

            switch( this.getErrorCode() ) {
                case 1:
                    return 'MEDIA_ERR_ABORTED';
                case 2:
                    return 'MEDIA_ERR_NETWORK';
                case 3:
                    return 'MEDIA_ERR_DECODE';
                case 4:
                    return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
                default:
                    return null;
            }
        }

        this.getStateCode = function() {
			if ( !supported ) return null;

            return this.sound.readyState;
        }

        this.getStateMessage = function() {
			if ( !supported ) return null;

            switch( this.getStateCode() ) {
                case 0:
                    return 'HAVE_NOTHING';
                case 1:
                    return 'HAVE_METADATA';
                case 2:
                    return 'HAVE_CURRENT_DATA';
                case 3:
                    return 'HAVE_FUTURE_DATA';
                case 4:
                    return 'HAVE_ENOUGH_DATA';
                default:
                    return null;
            }
        }

        this.getNetworkStateCode = function() {
			if ( !supported ) return null;

            return this.sound.networkState;
        }

        this.getNetworkStateMessage = function() {
			if ( !supported ) return null;

            switch( this.getNetworkStateCode() ) {
                case 0:
                    return 'NETWORK_EMPTY';
                case 1:
                    return 'NETWORK_IDLE';
                case 2:
                    return 'NETWORK_LOADING';
                case 3:
                    return 'NETWORK_NO_SOURCE';
                default:
                    return null;
            }
        }

        this.set = function( key, value ) {
            if ( !supported ) return this;

            this.sound[ key ] = value;
            return this;
        }

        this.get = function( key ) {
            if ( !supported ) return null;

            return key ? this.sound[ key ] : this.sound;
        }

        this.bind = function( types, func ) {
            if ( !supported ) return this;

            var that = this,
                types = types.split( ' ' ),
				efunc = function( e ) { func.call( that, e ) };

            for( var t = 0; t < types.length; t++ ) {
                var type = types[ t ],
                    idx = type;
				    type = idx.split( '.' )[ 0 ];

                    events.push( { idx: idx, func: efunc } );
                    this.sound.addEventListener( type, efunc, true );
            }
            return this;
        }

        this.unbind = function( types ) {
            if ( !supported ) return this;

            var types = types.split( ' ' );

            for( var t = 0; t < types.length; t++ ) {
                var idx = types[ t ];
				    type = idx.split( '.' )[ 0 ];

                for( var i = 0; i < events.length; i++ ) {
                    var namespace = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( namespace[ 1 ] && namespace[ 1 ] == idx.replace( '.', '' ) ) ) {
				        this.sound.removeEventListener( type, events[ i ].func, true );
                        delete events[ i ];
                    }
                }
            }
            return this;
        }

        this.bindOnce = function( type, func ) {
            if ( !supported ) return this;

            var that = this;

            eventsOnce[ pid++ ] = false;
            this.bind( pid + type, function() {
               if ( !eventsOnce[ pid ] ) {
                   eventsOnce[ pid ] = true;
                   func.call( that );
               }
               that.unbind( pid + type );
            });
        }

        this.trigger = function( types ) {
            if ( !supported ) return this;

            var types = types.split( ' ' );

            for( var t = 0; t < types.length; t++ ) {
                var idx = types[ t ];

                for( var i = 0; i < events.length; i++ ) {
                    var eventType = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( eventType[ 0 ] && eventType[ 0 ] == idx.replace( '.', '' ) ) ) {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent( eventType[ 0 ], false, true );
                        this.sound.dispatchEvent( evt );
                    }
                }
            }
            return this;
        }

        this.fadeTo = function( to, duration, callback ) {
			if ( !supported ) return this;

            if ( duration instanceof Function ) {
                callback = duration;
                duration = buzz.defaults.duration;
            } else {
                duration = duration || buzz.defaults.duration;
            }

            var from = this.volume,
				delay = duration / Math.abs( from - to ),
                that = this;
            this.play();

            function doFade() {
                setTimeout( function() {
                    if ( from < to && that.volume < to ) {
                        that.setVolume( that.volume += 1 );
                        doFade();
                    } else if ( from > to && that.volume > to ) {
                        that.setVolume( that.volume -= 1 );
                        doFade();
                    } else if ( callback instanceof Function ) {
                        callback.apply( that );
                    }
                }, delay );
            }
            this.whenReady( function() {
                doFade();
            });

			return this;
        }

        this.fadeIn = function( duration, callback ) {
			if ( !supported ) return this;

            return this.setVolume(0).fadeTo( 100, duration, callback );
        }

        this.fadeOut = function( duration, callback ) {
			if ( !supported ) return this;

            return this.fadeTo( 0, duration, callback );
        }

        this.fadeWith = function( sound, duration ) {
			if ( !supported ) return this;

            this.fadeOut( duration, function() {
                this.stop();
            });

            sound.play().fadeIn( duration );

			return this;
        }

        this.whenReady = function( func ) {
            if ( !supported ) return null;

            var that = this;
            if ( this.sound.readyState == 0 ) {
                this.bind( 'canplay.buzzwhenready', function() {
                    func.call( that );
                });
            } else {
                func.call( that );
            }
        }

        // privates
        function timerangeToArray( timeRange ) {
            var array = [],
                length = timeRange.length - 1;

            for( var i = 0; i <= length; i++ ) {
                array.push({
                    start: timeRange.start( length ),
                    end: timeRange.end( length )
                });
            }
            return array;
        }

        function getExt( filename ) {
            return filename.split('.').pop();
        }
        
        function addSource( sound, src ) {
            var source = document.createElement( 'source' );
            source.src = src;
            if ( buzz.types[ getExt( src ) ] ) {
                source.type = buzz.types[ getExt( src ) ];
            }
            sound.appendChild( source );
        }

        // init
        if ( supported ) {		
			
            for( i in buzz.defaults ) {
                options[ i ] = options[ i ] || buzz.defaults[ i ];
            }

            this.sound = document.createElement( 'audio' );

            if ( src instanceof Array ) {
                for( var i in src ) {
                    addSource( this.sound, src[ i ] );
                }
            } else if ( options.formats.length ) {
                for( var i in options.formats ) {
                    addSource( this.sound, src + '.' + options.formats[ i ] );
                }
            } else {
                addSource( this.sound, src );
            }

            if ( options.loop ) {
                this.loop();
            }

            if ( options.autoplay ) {
                this.sound.autoplay = 'autoplay';
            }

            if ( options.preload === true ) {
                this.sound.preload = 'auto';
            } else if ( options.preload === false ) {
                this.sound.preload = 'none';
            } else {
                this.sound.preload = options.preload;
            }

            this.setVolume( options.volume );

            buzz.sounds.push( this );
        }
    },

    group: function( sounds ) {
        var sounds = argsToArray( sounds, arguments );

        // publics
        this.getSounds = function() {
            return sounds;
        }

        this.add = function( soundArray ) {
            var soundArray = argsToArray( soundArray, arguments );
            for( var a = 0; a < soundArray.length; a++ ) {
                for( var i = 0; i < sounds.length; i++ ) {
                    sounds.push( soundArray[ a ] );
                }
            }
        }

        this.remove = function( soundArray ) {
            var soundArray = argsToArray( soundArray, arguments );
            for( var a = 0; a < soundArray.length; a++ ) {
                for( var i = 0; i < sounds.length; i++ ) {
                    if ( sounds[ i ] == soundArray[ a ] ) {
                        delete sounds[ i ];
                        break;
                    }
                }
            }
        }

        this.load = function() {
            fn( 'load' );
            return this;
        }

        this.play = function() {
            fn( 'play' );
            return this;
        }

        this.togglePlay = function( ) {
            fn( 'togglePlay' );
            return this;
        }

        this.pause = function( time ) {
            fn( 'pause', time );
            return this;
        }

        this.stop = function() {
            fn( 'stop' );
            return this;
        }

        this.mute = function() {
            fn( 'mute' );
            return this;
        }

        this.unmute = function() {
            fn( 'unmute' );
            return this;
        }

        this.toggleMute = function() {
            fn( 'toggleMute' );
            return this;
        }

        this.setVolume = function( volume ) {
            fn( 'setVolume', volume );
            return this;
        }

        this.increaseVolume = function( value ) {
            fn( 'increaseVolume', value );
            return this;
        }

        this.decreaseVolume = function( value ) {
            fn( 'decreaseVolume', value );
            return this;
        }

        this.loop = function() {
            fn( 'loop' );
            return this;
        }

        this.unloop = function() {
            fn( 'unloop' );
            return this;
        }

        this.setTime = function( time ) {
            fn( 'setTime', time );
            return this;
        }

        this.setduration = function( duration ) {
            fn( 'setduration', duration );
            return this;
        }

        this.set = function( key, value ) {
            fn( 'set', key, value );
            return this;
        }

        this.bind = function( type, func ) {
            fn( 'bind', type, func );
            return this;
        }

        this.unbind = function( type ) {
            fn( 'unbind', type );
            return this;
        }

        this.bindOnce = function( type, func ) {
            fn( 'bindOnce', type, func );
            return this;
        }

        this.trigger = function( type ) {
            fn( 'trigger', type );
            return this;
        }

        this.fade = function( from, to, duration, callback ) {
            fn( 'fade', from, to, duration, callback );
            return this;
        }

        this.fadeIn = function( duration, callback ) {
            fn( 'fadeIn', duration, callback );
            return this;
        }

        this.fadeOut = function( duration, callback ) {
            fn( 'fadeOut', duration, callback );
            return this;
        }

        // privates
        function fn() {
            var args = argsToArray( null, arguments ),
                func = args.shift();

            for( var i = 0; i < sounds.length; i++ ) {
                sounds[ i ][ func ].apply( sounds[ i ], args );
            }
        }

        function argsToArray( array, args ) {
            return ( array instanceof Array ) ? array : Array.prototype.slice.call( args );
        }
    },

    all: function() {
      return new buzz.group( buzz.sounds );
    },

    isSupported: function() {
        return !!this.el.canPlayType;
    },

    isOGGSupported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/ogg; codecs="vorbis"' );
    },

    isWAVSupported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/wav; codecs="1"' );
    },

    isMP3Supported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/mpeg;' );
    },

    isAACSupported: function() {
        return !!this.el.canPlayType && ( this.el.canPlayType( 'audio/x-m4a;' ) || this.el.canPlayType( 'audio/aac;' ) );
    },

    toTimer: function( time, withHours ) {
        h = Math.floor( time / 3600 );
        h = isNaN( h ) ? '--' : ( h >= 10 ) ? h : '0' + h;
        m = withHours ? Math.floor( time / 60 % 60 ) : Math.floor( time / 60 );
        m = isNaN( m ) ? '--' : ( m >= 10 ) ? m : '0' + m;
        s = Math.floor( time % 60 );
        s = isNaN( s ) ? '--' : ( s >= 10 ) ? s : '0' + s;
        return withHours ? h + ':' + m + ':' + s : m + ':' + s;
    },

    fromTimer: function( time ) {
        var splits = time.toString().split( ':' );
        if ( splits && splits.length == 3 ) {
            time = ( parseInt( splits[ 0 ] ) * 3600 ) + ( parseInt(splits[ 1 ] ) * 60 ) + parseInt( splits[ 2 ] );
        }
        if ( splits && splits.length == 2 ) {
            time = ( parseInt( splits[ 0 ] ) * 60 ) + parseInt( splits[ 1 ] );
        }
        return time;
    },

    toPercent: function( value, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );

		return Math.round( ( ( value * 100 ) / total ) * r ) / r;
    },

    fromPercent: function( percent, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );

        return  Math.round( ( ( total / 100 ) * percent ) * r ) / r;
    }
}
;
var BRICK_WIDTH = 20;
var BRICK_HEIGHT = 20;
var GRID_WIDTH = 28;
var GRID_HEIGHT = 36;
var SCENE_WIDTH = BRICK_WIDTH * GRID_WIDTH;
var SCENE_HEIGHT = BRICK_HEIGHT * GRID_HEIGHT;
var TAILS = GRID_HEIGHT * GRID_WIDTH;
var SCARED_TIME = 7000;

var SCENE = [
        //   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
        [0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ],    //2
        [1 ,1 ,1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ],    //1
        [1, 2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ,1, 2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1, 2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 3 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1, 2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,3 ,1 ],    //2
        [1, 2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2, 2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 2 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ],    //2
        [1, 1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ],    //2
        [0, 0 ,0 ,0 ,0 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,1 ,2 ,1 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,1 ,2 ,1 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,1 ,2 ,1 ,1 ,0 ,1 ,1 ,1 ,0 ,0 ,1 ,1 ,1 ,0 ,1 ,1 ,2 ,1 ,0 ,0 ,0 ,0 ,0 ],    //2
        [1, 1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ],    //2
        [1, 0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,1 ],    //2
        [1, 1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ],    //2
        [0, 0 ,0 ,0 ,0 ,1 ,2 ,1 ,1 ,0 ,1 ,0 ,1 ,1 ,1 ,1 ,0 ,1 ,0 ,1 ,1 ,2 ,1 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,1 ,2 ,1 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,1 ,2 ,1 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,1 ,2 ,1 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,1 ,2 ,1 ,0 ,0 ,0 ,0 ,0 ],    //2
        [1, 1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,0 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ],    //2
        [1, 2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 3 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,3 ,1 ],    //2
        [1, 1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ],    //2
        [1, 1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ],    //2
        [1, 2 ,2 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,1 ,1 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ,1 ,2 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,2 ,1 ],    //2
        [1, 2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,1 ],    //2
        [1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ],    //2
        [0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ],    //2
        [0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ]    //2
    ];







 Game.sounds = {};
 Game.sounds.chase = new buzz.sound("build/sounds/Sound1",{formats:["ogg","mp3"]});
 Game.sounds.scared = new buzz.sound("build/sounds/Sound2",{formats:["ogg","mp3"]});
 Game.sounds.beep =  new beep("build/sounds/beep.wav");



window.onload = function() {
	var gameArea = document.getElementById('gameArea');
	Game.init(SCENE_WIDTH, SCENE_HEIGHT, gameArea);
	Game._loadScene(SCENE);
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
