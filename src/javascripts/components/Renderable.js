//= require 'components/Component'
//= require	'components/Pos'

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
