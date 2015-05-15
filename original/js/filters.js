// Filters
var filters = function(){
	return this.init();
};
filters.prototype = {	
	imagedata : null,
	layer : null,
	doc : null,
	length : 0,
	w : 0,
	h : 0,
	init : function(){
		this.processingModal = document.getElementById('modal-processing');
		return this;
	},
	update : function(){
		this.doc = app.currentDoc;
		this.layer = app.currentDoc.layers[app.currentDoc.currentLayer];
		this.data = app.currentDoc.layers[app.currentDoc.currentLayer].imagedata.data;
		this.length = app.currentDoc.layers[app.currentDoc.currentLayer].imagedata.data.length;
		this.w = app.currentDoc.setting.width;
		this.h = app.currentDoc.setting.width;
		return this;
	},
	bucle : function(callback){
		for(var i = 0;i<this.length;i+=4){
			callback(i);
		}
		return this;
	},
	invert : function(){
		this.procesing(true);
		var self = this;
		setTimeout(function(){
			self.update().bucle(function(i){
				self.data[i] = Math.abs(self.data[i]-255);
				self.data[i+1] = Math.abs(self.data[i+1]-255);
				self.data[i+2] = Math.abs(self.data[i+2]-255);
			}).updateImage();
		},50);		
		return this;
	},
	updateImage : function(){
		this.layer.imagedata.data = this.data;
		this.doc.rendererToImageDataLayer(false).updateShowCurrent();
		this.procesing(false);
		return this;
	},
	procesing : function(flag){
		if(flag){
			this.processingModal.style.display = 'block';
		}else{
			this.processingModal.style.display = 'none';
		}
		return this;
	}
};