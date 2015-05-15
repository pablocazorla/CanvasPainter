// APP CANVASSHOP
var cs = function(){
	return this.init();
}
cs.prototype = {
	idCount : 0,
	docs : [],
	length : 0,
	currentDoc : null,
	forecolor : null,
	currentTool : 'brush',
	zoomDirection : 1,
	zoomStep : 1.2,
	maxZoom : 5,
	minZoom : 0.01,
	init : function(){
		this.brush = new brush();
		this.picker = new picker();
		this.filters = new filters();
		this.ui = new ui(this);

		this.forecolor = new hypercolor();

		return this;
	},
	start : function(){
		var nav = navigator.userAgent.toLowerCase(),
			compatible = false;
		if(nav.indexOf('webkit')>-1) compatible = true;
		if(nav.indexOf('gecko')>-1) compatible = true;
		if(nav.indexOf('trident')>-1){
			if(nav.indexOf('msie 10')>-1 || nav.indexOf('msie 11')>-1){
				compatible = true;
			}			
		} 
		if(compatible){
			this.ui.start();
		}else{
			this.ui.browserIncompatible();
		}
		
		return this;
	},
	createDocument : function(opt){		
		var newDoc = new doc(this,opt);
		this.docs.push(newDoc);					
		this.length++;
		this.currentDoc = newDoc;
		this.ui.renderDocument(newDoc);
		this.setCurrentDoc(newDoc.setting.docID);
		return this;
	},
	setCurrentDoc : function(docID){
		this.currentDoc = this.getDocByID(docID);
		this.ui.setCurrentDoc(docID);
		this.brush.update();
		return this;
	},
	deleteDocument : function(){
		var indexCurrent = -1
		for(var i = 0;i<this.length;i++){
			if(this.docs[i].setting.docID == this.currentDoc.setting.docID){
				indexCurrent = i;
			}
		}
		this.docs.splice(indexCurrent,1);
		this.length--;
		this.ui.eraseDocument(this.currentDoc.setting.docID);	
		if(this.length > 0){
			this.setCurrentDoc(this.docs[0].setting.docID)
		}else{
			this.currentDoc = null;
		}
	},
	getDocByID : function(docID){
		for(var i = 0;i<this.length;i++){
			if(this.docs[i].setting.docID == docID){
				return this.docs[i];
			}
		}
	},
	setCurrentTool : function(toolName){
		this.currentTool = toolName;
		getById('doc-container').className = toolName;
	}
};

window.onload = function(){
	app = new cs();
	app.start();
};




