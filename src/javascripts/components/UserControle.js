//= require 'components/Component'
//= require 'Keyboard'
//= require 'components/Collision'

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
