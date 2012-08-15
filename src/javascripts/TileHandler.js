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
