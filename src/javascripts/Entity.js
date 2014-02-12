//= require 'Base'

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