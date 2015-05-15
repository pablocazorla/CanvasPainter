// UTILS
// Only for debugging:
var log = function(exp){
		console.log(exp);
	},
	extend = function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	},
	cloneObj = function(obj) {
	    if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
	},
	insertAfter = function(referenceNode, newNode) {
	    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	},
	getById = function(idElement){
		if(typeof idElement == 'string'){
			return document.getElementById(idElement);
		}else{
			return idElement;
		}		
	},
	onClick = function(idElement,callback){
		getById(idElement).addEventListener('click', callback,false);
	};