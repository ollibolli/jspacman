//= require 'Entity'
//= require 'Base'


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
Component.prototype.handleEvent = function(event) {
	throw new NotImplementedError('handleEvent Not Implemented');
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