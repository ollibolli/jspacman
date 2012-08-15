/**
 * Ollibolli javascript inheritence
 * The goal of this is to create a simple prototyping and maintain the prototype chain.  
 * Using the javascript constructor function as the constructor and not breaking the prototype chain
 * by copying functions. And be able to verify constructor parameters in the constructor function. 
 *
 * 
 * 
 * Big contributor is Juan Mendes (http://js-bits.blogspot.se/);
 */


/**
 * This is the core function for Ollibolli javascript Inheritence
 * By copying the prototype of the prototyping object to a surrogate Constructor function and using the 
 * new on that prevent using the constructor function. 
 *   
 */
Function.prototype.Extend = function(parent){	
	eval('var surrogateConstructor = function '+ parent.name + '(){}');	
	surrogateConstructor.prototype = parent.prototype;

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

	
	this.prototype = new surrogateConstructor();
	this.prototype.constructor = this;

	/* adding 

	/**
	* A function equal to super. Use only in constructor Functions
 	* Important to always call Super in the extended constructor function. 
 	* By calling Super, every constructor in the prototype chain is applied on the new object 
 	*/
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
	
	/*
	 * @return String
	 */
	this.prototype.toString = function toString(){
		return '[object '+this.getType+' ]';
	}
	
	this.prototype.toType = (function toType(global) {
	  return function(obj) {
	    if (obj === global) {
	      return "global";
	    }
	    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	  }
	})(this);

	this.prototype.getInstanceOf = function getInstanceOf(){
		return getPrototypeStringOf(this);
	};

};


																														 
function getPrototypeStringOf(obj) {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((obj).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
}


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


//--------------IMAGE PRELOADER
// http://www.webreference.com/programming/javascript/gr/column3
function ImagePreloader(images, callBack){
    this._callBack = callBack;
    this._loaded = 0;
    this._processed = 0;
    this.images = new Array();
    this._numOfImages = images.length;
    // for each image, call preload()
    for ( var i = 0; i < images.length; i++ )
        this.preload(images[i]);
};

ImagePreloader.prototype.preload = function(image){
    // create new Image object and add to array

    var image = new Image;
    this.images.push(image);
    // set up event handlers for the Image object
    image.onload = ImagePreloader.prototype.onload;
    image.onerror = ImagePreloader.prototype.onerror;
    image.onabort = ImagePreloader.prototype.onabort;
    // assign pointer back to this.
    image.imagePreloader = this;
    image.loaded = false;
    // assign the .src property of the Image object
    image.src = image;
};

ImagePreloader.prototype.onComplete = function(){
    this._processed++;
    if ( this._processed == this._numOfImages )
    {
        this._callBack(this.sounds, this._loaded);
    }
};

ImagePreloader.prototype.onload = function(){
    this.loaded = true;
    this.imagePreloader._loaded++;
    this.imagePreloader.onComplete();
}

ImagePreloader.prototype.onerror = function(){
    this.error = true;
    this.imagePreloader.onComplete();
};

ImagePreloader.prototype.onabort = function()
{
    this.abort = true;
    this.imagePreloader.onComplete();
};

//-----------------KEY helper object---------

function roundNumber4(num) {
    return  Math.round(num*10000/10000);
};

var Dir = {
    UP:2,
    LEFT:0,
    RIGHT:3,
    DOWN:1
};

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;

};

var beep = function(src){
    var beeps= [
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src),
        new buzz.sound(src)
    ];
    var i=0;

    return {
        play:function(){
            beeps[i].play();
            i++;
            if (i > 9) i=0 ;
        }
    }
};

function uniqueArray(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for ( x = 0; x < origLen; x++ ) {
        found = undefined;
        for ( y = 0; y < newArr.length; y++ ) {
            if ( origArr[x] === newArr[y] ) {
                found = true;
                break;
            }
        }
        if ( !found) newArr.push( origArr[x] );
    }
    return newArr;
}

