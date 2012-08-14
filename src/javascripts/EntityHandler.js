//=require 'TileHandler'
//=require 'Entity'
//=require 'Base'

EntityHandler.Extend(Base);

function EntityHandler () { 
    this.Super();
    this.entities = new Array();
}	
	
EntityHandler.prototype.add = function(entity) {
    if (entity instanceof Entity){
        this.entities.push(entity);
        if(entity.hasOwnProperty('Pos')){
            this.addEntityOnTile(entity.Pos.getTile(),entity);
        }
    };
};

EntityHandler.prototype.removeLast = function() {
	    return this.entities.pop();
};
	
EntityHandler.prototype.remove = function(entity) {
	    Game.tileHandler.removeEntity(entity,entity.Pos.getTile());
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








