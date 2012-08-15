//= require 'components/Component'

function Wall(){
	this.dependencies = ["Pos"];
};

Wall.prototype= new Component();
Wall.prototype.constructor= Wall;