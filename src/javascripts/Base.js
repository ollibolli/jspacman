
/**
 * Object father off all 
 */

Base.Extend(Object);
function Base(){};

Base.prototype.getInstanceOfName = function (){
	var funcNameRegex = /function (.{1,})\(/;
	var results = (funcNameRegex).exec((this).constructor.toString());
	return (results && results.length > 1) ? results[1] : "";
}