
// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if(this.console){
    	var msg = Array.prototype.slice.call(arguments);
    	msg.push(arguments.callee); 
        console.log( Array.prototype.slice.call(arguments) );
    }
};

// Simple innheritence 
/**
 * Parameters Extended object, constructor, values.
 */
/*Function.prototype.Extend = function(parent){	
	eval('var surrogateConstructor = function '+ parent.name + '(){}');	
	surrogateConstructor.prototype = parent.prototype;
	this.prototype = new surrogateConstructor();
	this.prototype.constructor = this;
	this.prototype.Super = function Super(){
		if (typeof Super.caller == "function" 
			&& Super.caller.prototype 
			&& Super.caller.prototype.Super.toString() == Super.toString()
		){
			Super.caller.initSuper(this,arguments)
		} else {
			throw new Error("Super called from non constructor function");
		}
	}
	this.initSuper = function initSuper(obj,argument){
		// initSuper.caller == Super 
		if (typeof initSuper.caller === "function" 
			&& initSuper.caller.prototype 
			&& initSuper.caller.toString() == this.prototype.Super.toString()
		){
			parent.apply(obj,argument);
		} else {
			throw new Error('initSuper not called from Super');
		}
	}
	
	this.prototype.instanceOf = function toInstanceOf() {
    	var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((this).constructor.toString());
		return (results && results.length > 1) ? results[1] : "";
	};
};


Base = function Base(){
	log ('base', this);
};

Base.Extend(Object );

Base.prototype.toString = function (){
	return "[object "+ this.getInstanceOf() +"]";
}

First.Extend(Base);
function First(name){
	this.Super();
	if ( !name ) throw new Error('Expected a Name parameter');
	this._name1 = name;
}

First.prototype.getName1 = function getName1(){
	return this._name1;
};

//------------------------
Second.Extend(First);
function Second(name1,name2){
	if (!name1 || !name2) throw new Error('Prameter error');
	this.Super(name1);
	this._name2 = name2;
}

Second.prototype.getName2 = function getName2(){
	return this._name2
}

//----------------------------
Third.Extend(Second);
function Third(name){
	if (!name) throw new Error('Third construt');
	this.Super(name,'svensson');
	this.kompis = 'daniel';
}

t = new Third('Olle');*/

Function.prototype.extend = function extend(proto) {    
	var superCtor = this;
    var superProto = typeof this.prototype === 'object' ? this.prototype : Object.prototype;   
	var constructor = proto.constructor;
    
    if (!proto.hasOwnProperty('constructor')) {
        constructor = function(){this.Super()};
    }    
		
	if (typeof superProto.Super !== 'function'){
		superProto.Super = function Super(){
			if (typeof Super.caller == "function" 
				&& Super.caller.prototype 
				&& Super.caller.prototype.Super.toString() == Super.toString()
			){
				Super.caller.initSuper(this,arguments)
			} else {
				throw new Error("Super called from non constructor function");
			}
		}
	}
	if (typeof Object.create !== "function" ){
		eval('var surrogateCtor = function '+superCtor.name+'() {}');
    	// var surrogateCtor = function '+this.name+'() {}
    	surrogateCtor.prototype = superProto;
    	constructor.prototype = new surrogateCtor();
	} else {
		var descriptors = {};
    	for (var prop in proto) {
        	if (proto.hasOwnProperty(prop)) {
            	descriptors[prop] = Object.getOwnPropertyDescriptor(proto, prop);
        	}
    	}
    	constructor.prototype = Object.create(superProto, descriptors);
	}
	
	function toString(){
		return '[object '+constructor.getName()+']'
	}

	function initSuper(obj,argument){
		// initSuper.caller == Super 
		if (typeof initSuper.caller === "function" 
			&& initSuper.caller.prototype 
			&& initSuper.caller.toString() == proto.Super.toString()
		){
			superCtor.apply(obj,argument);
		} else {
			throw new Error('initSuper not called from Super');
		}
	}
	
    return constructor;
};

Function.prototype.getName = function getName(){
	if (this.name) {
		return this.name
	}else {
	    var funcNameRegex = /function (.{1,})\(/;
    	var results = (funcNameRegex).exec((this).toString());
    	return (results && results.length > 1) ? results[1] : "";
	}
}


p = Object.extend({constructor : function Package(){ this.Super() }});

p.Animal = Object.extend({
	constructor : function Animal(name){
		this.Super();
		if (typeof name !=='string' ) throw new TypeError('Undefined parameter or wrong type');
		this.name = name;
	},
	sayName : function sayName(){
		return this.name 
	}
});

p.Mammal = p.Animal.extend({
	constructor : function Mammal(name , age){
		this.Super(name);
		if (typeof age !=='number') throw TypeError(this.toString() +'expected number');
		this.age = age;
	},
	sayAge : function sayAge(){
		return this.age 
	}
});

p.Dog = p.Mammal.extend({
	constructor: function Dog () {
		this.Super();
	}
});

function assertError(callback, msg){
	try {
		callback.call(this);
		throw "fail";
	} catch (err){
		if (err instanceof Error){
			console.log(err.message);
		} else {
			throw new Error(msg);
		}
	}
};

function assertEquals(expec , actual, msg ){
	if (! expect == actual ) throw new Error(msg + ' : Fail expected <' + expec.toString() + '> actualy <'+ actual.toString() +'>');
}	

function assertTrue(assert, msg){
	if (! assert) throw new Error(msg); 
	console.log('assertTrue :'+msg);	
}

function assertFalse(assert, msg){
	if (assert) throw new Error(msg); 
	console.log('assertFalse :'+msg);	
}

assertError(function (){
	n = new p.Mammal();
},'test empty consreuctor');

assertError(function(){
	n = new p.Mammal('per');	
},'test empty consreuctor');

m = new p.Mammal('jan',23);

assertTrue (m instanceof p.Mammal,'instance of Mammal');
assertTrue (m instanceof p.Animal,'instance of Animal');
assertTrue (m instanceof Object,'instance of Object');
assertTrue (typeof m.Super == 'function','Has super');
assertFalse (m.hasOwnProperty('Super'),'m.hasOwnProperty(Super)');
