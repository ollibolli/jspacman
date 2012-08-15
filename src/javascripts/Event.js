function Event(type){
    if (isNumeric(type)){
        this.type = type;
    } else {
        throw new Error ("No name Parameter");
    }
};

Event.UPDATE = 0;
Event.RENDER = 1;
Event.STATECHANGE = 2;
Event.COLLISION = 3;