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