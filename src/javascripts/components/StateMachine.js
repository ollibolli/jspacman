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

