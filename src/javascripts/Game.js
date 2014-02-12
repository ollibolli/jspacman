//= require 'Entity'
//= require 'EntityHandler' 
//= require 'TileHandler'
//= require 'components/Pos'
//= require 'components/Renderable'
//= require 'components/Collision'
//=	require 'components/AIControle'
//=	require 'components/Wall'
//=	require 'components/Point'
//=	require 'components/UserControle'
//=	require 'components/StateMachine'
//=	require 'components/Sound'
//=	require 'components/Moveable'


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