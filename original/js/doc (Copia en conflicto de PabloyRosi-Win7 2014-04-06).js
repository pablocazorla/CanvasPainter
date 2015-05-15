// DOC
var doc = function(parent,opt){
	return this.init(parent,opt);
};
doc.prototype = {
	difposX : 0,
	difposY : 0,
	handDragging : false,
	zoomScale : 1,
	selecting : false,
	selectingDrag : false,
	currentTool : 'brush',
	init : function(parent,opt){
		this.setting = extend({
			docID : 'docID'+parent.idCount,
			name : 'Untitled',
			width : 800,
			height : 600,
			backColor : 'transparent'
		},opt);
		parent.idCount++;
		
		this.app = parent;
		
		this.undoList = [];		
		this.undoListLimit = 2;
		this.undoListCursor = -1;
		this.layers = [];
		this.length = 0;
		this.currentLayer = null;
		this.idLayerCount = 0;
						
		this.painting = false;
		this.pickering = false;
		this.prevMX = null;
		this.prevMY = null;
		
		this.docNode = null;
		this.cnvOver = null;
		this.selectArea = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
			difX : 0,
			difY : 0
		};

		
		this.w2 = this.setting.width/2;
		this.h2 = this.setting.height/2;
	
		return this;
	},
	start : function(docNode){
		this.docNode = docNode;

		this.selectRect = document.createElement('div');
		this.selectRect.className = 'select-rect';
		this.selectRect.style.display = 'none';
		this.docNode.appendChild(this.selectRect);

		// CNV SHOW 
		this.cnvShowTop = document.createElement('canvas');		
		this.cnvShowTop.width = this.setting.width;
		this.cnvShowTop.height = this.setting.height;
		this.cnvShowTop.className = 'cnv-top show';		
		this.docNode.appendChild(this.cnvShowTop);		
		this.cShowTop = this.cnvShowTop.getContext('2d');

		this.cnvShowCurrent = document.createElement('canvas');		
		this.cnvShowCurrent.width = this.setting.width;
		this.cnvShowCurrent.height = this.setting.height;
		this.cnvShowCurrent.className = 'cnv-current show';		
		this.docNode.appendChild(this.cnvShowCurrent);		
		this.cShowCurrent = this.cnvShowCurrent.getContext('2d');

		this.cnvShowBottom = document.createElement('canvas');		
		this.cnvShowBottom.width = this.setting.width;
		this.cnvShowBottom.height = this.setting.height;
		this.cnvShowBottom.className = 'cnv-bottom show';		
		this.docNode.appendChild(this.cnvShowBottom);		
		this.cShowBottom = this.cnvShowBottom.getContext('2d');
		
		// CNV OTHER
		this.cnvRenderer = document.createElement('canvas');		
		this.cnvRenderer.width = this.setting.width;
		this.cnvRenderer.height = this.setting.height;
		this.cnvRenderer.className = 'cnv-renderer';		
		this.docNode.appendChild(this.cnvRenderer);		
		this.cRenderer = this.cnvRenderer.getContext('2d');

		this.cRenderer.save();

		this.cnvMask = document.createElement('canvas');		
		this.cnvMask.width = this.setting.width;
		this.cnvMask.height = this.setting.height;
		this.cnvMask.className = 'cnv-mask';		
		this.docNode.appendChild(this.cnvMask);		
		this.cMask = this.cnvMask.getContext('2d');

		this.cnvExport = document.createElement('canvas');		
		this.cnvExport.width = this.setting.width;
		this.cnvExport.height = this.setting.height;
		this.cnvExport.className = 'cnv-export';
		this.docNode.appendChild(this.cnvExport);
		this.cExport = this.cnvExport.getContext('2d');

		this.cnvToPicker = document.createElement('canvas');		
		this.cnvToPicker.width = this.setting.width;
		this.cnvToPicker.height = this.setting.height;
		this.cnvToPicker.className = 'cnv-to-picker';	
		this.docNode.appendChild(this.cnvToPicker);
		this.cToPicker = this.cnvToPicker.getContext('2d');

		this.addLayer();

		switch(this.setting.backColor){
			case 'white':
				this.cRenderer.fillStyle = '#FFFFFF';
				this.cRenderer.fillRect(0,0,this.setting.width,this.setting.height);
				this.rendererToImageDataLayer(true).updateAllShow();
				break;
			case 'black':
				this.cRenderer.fillStyle = '#000000';
				this.cRenderer.fillRect(0,0,this.setting.width,this.setting.height);
				this.rendererToImageDataLayer(true).updateAllShow();	
				break;
			default: //
				break;
		}
		
		this.setMouseEvents().setZoom(this.zoomScale);
		return this;
	},
	addLayer : function(custom){
		if(custom==undefined) var custom = {};
		// create the node canvas
		var numID = this.idLayerCount,
			nodeCanvas = document.createElement('canvas'),
			// and the obj layer.
			newLayer = extend({
				id : numID,
				name : 'Layer-'+numID,
				opacity : 100,
				visible : true,
				imagedata : null,
				clipped : false,
				clipLayer : null
			},custom);			
		this.idLayerCount++;
		
		this.cRenderer.clearRect(0,0,this.setting.width, this.setting.height);
		newLayer.imagedata = this.cRenderer.getImageData(0, 0, this.setting.width, this.setting.height);
		// add the layer to collection
		if(this.length > 0){
			this.layers.splice(this.currentLayer+1,0,newLayer);
		}else{
			this.layers.push(newLayer);
		}		
		this.length++;
		
		// update ui
		app.ui.layerCtrl.addLayer(newLayer);

		if(this.length > 1){
			this.setCurrentLayer(this.currentLayer+1);
		}else{
			this.setCurrentLayer(this.length - 1);
		}		
		
		return this;
	},
	rendererToImageDataLayer : function(flag,num,adding){
		if(num == undefined) num = this.currentLayer;
		if(flag){
			this.layers[num].imagedata = this.cRenderer.getImageData(0, 0, this.setting.width, this.setting.height);
		}else{
			if(adding){
				this.cExport.putImageData(this.layers[num].imagedata, 0, 0);
				this.cRenderer.globalAlpha = this.layers[num].opacity/100;
				this.cRenderer.drawImage(this.cnvExport, 0, 0, this.setting.width, this.setting.height);
				this.cRenderer.globalAlpha = 1;
			}else{				
				this.cRenderer.putImageData (this.layers[num].imagedata, 0, 0);
				if(this.layers[num].clipped){
					this.cMask.putImageData(this.layers[this.layers[num].clipLayer].imagedata, 0, 0);
					this.cRenderer.globalCompositeOperation = "destination-in";
					this.cRenderer.drawImage(this.cnvMask, 0, 0, this.setting.width, this.setting.height);
					this.cRenderer.globalCompositeOperation = "source-over";
				}
			}			
		}		
		return this;
	},
	mergeLayer : function(){
		if(this.currentLayer>0){			
			this.rendererToImageDataLayer(false,this.currentLayer-1).rendererToImageDataLayer(false,this.currentLayer,true).rendererToImageDataLayer(true,this.currentLayer-1);
			this.removeLayer();
		}
		return this;
	},
	duplicateLayer : function(){
		var origLayer = this.layers[this.currentLayer],
			newName = origLayer.name,
			indexCopy = newName.indexOf(' (copy');
		if(indexCopy>-1){
			var numCopy = 1;
			if(newName.indexOf(' (copy-')>-1){
				numCopy = parseInt(newName.substring(indexCopy+7,newName.length-1))+1;
			}
			newName = newName.substring(0,indexCopy+6)+'-'+numCopy+')';
		}else{
			newName = newName+' (copy)';
		}
		this.addLayer({
			name : newName,
			opacity : origLayer.opacity,
			visible : origLayer.visible
		});

		this.rendererToImageDataLayer(false,this.currentLayer-1).rendererToImageDataLayer(true).updateAllShow();
		return this;
	},
	toggleVisibleLayer : function(idLayer){
		for(var i = 0; i < this.length;i++){
			if(this.layers[i].id == idLayer){
				if(this.layers[i].visible){
					this.layers[i].visible = false;
				}else{
					this.layers[i].visible = true;
				}
				this.updateAllShow();
				app.ui.layerCtrl.toggleVisibleLayer(idLayer,this.layers[i].visible);
			}
		}
		return this;
	},
	setCurrentLayer : function(num, isID){		
		if(isID){
			for(var i = 0; i < this.length;i++){
				if(this.layers[i].id == num) this.currentLayer = i;
			}
		}else{
			this.currentLayer = num;
		}	
		app.ui.layerCtrl.setCurrentLayer(this.layers[this.currentLayer]);
		this.updateAllShow();
		//this.setSelection();
		return this;
	},
	changeLayerPosition : function(endIndex){
		if(endIndex != this.currentLayer){
			var layerToMove = this.layers[this.currentLayer];
			this.layers.splice(this.currentLayer,1);
			if(endIndex < this.currentLayer) endIndex++;
			this.currentLayer = endIndex;
			this.layers.splice(endIndex,0,layerToMove);
			
			this.setCurrentLayer(this.currentLayer);			
		}
		app.ui.layerCtrl.setLayerStickPositions();
		return this;
	},
	setOpacityLayer : function(val){
		this.layers[this.currentLayer].opacity = val;
		this.updateAllShow();
		return this;
	},
	removeLayer : function(){
		if(this.length > 1){			
			app.ui.layerCtrl.removeLayer(this.layers[this.currentLayer].id);
			this.layers.splice(this.currentLayer,1);
			this.length--;
			var num = this.currentLayer - 1;
			if(num < 0) num = 0;
			this.setCurrentLayer(num);
			app.ui.layerCtrl.setLayerStickPositions();
		}
	},
	updateShowCurrent : function(){
		this.cShowCurrent.clearRect(0,0,this.setting.width, this.setting.height);
		if(this.layers[this.currentLayer].visible){
			this.cShowCurrent.globalAlpha = this.layers[this.currentLayer].opacity/100;
			this.cShowCurrent.drawImage(this.cnvRenderer, 0, 0, this.setting.width, this.setting.height);
		}
		return this;
	},
	updateAllShow : function(){
		this.cShowTop.clearRect(0,0,this.setting.width, this.setting.height);
		this.cShowBottom.clearRect(0,0,this.setting.width, this.setting.height);
		var clipLayerBottom = 0;
		for(var i = 0;i<this.length;i++){

			if(this.layers[i].clipped){
				this.layers[i].clipLayer = clipLayerBottom;
			}else{
				clipLayerBottom = i;
			}

			if(this.layers[i].visible){
				this.rendererToImageDataLayer(false,i);
				if(this.layers[i].clipped){
					this.cMask.putImageData(this.layers[this.layers[i].clipLayer].imagedata, 0, 0);
					this.cRenderer.globalCompositeOperation = "destination-in";
					this.cRenderer.drawImage(this.cnvMask, 0, 0, this.setting.width, this.setting.height);
					this.cRenderer.globalCompositeOperation = "source-over";
				}
				
				if(i<this.currentLayer){
					this.cShowBottom.globalAlpha = this.layers[i].opacity/100;
					this.cShowBottom.drawImage(this.cnvRenderer, 0, 0, this.setting.width, this.setting.height);
				}else if(i>this.currentLayer){
					this.cShowTop.globalAlpha = this.layers[i].opacity/100;
					this.cShowTop.drawImage(this.cnvRenderer, 0, 0, this.setting.width, this.setting.height);
				}
			}
		}		
		this.rendererToImageDataLayer(false).updateShowCurrent();
		return this;
	},
	updateExport : function(){
		this.cExport.clearRect(0,0,this.setting.width, this.setting.height);
		this.cExport.drawImage(this.cnvShowBottom, 0, 0, this.setting.width, this.setting.height);
		this.cExport.drawImage(this.cnvShowCurrent, 0, 0, this.setting.width, this.setting.height);
		this.cExport.drawImage(this.cnvShowTop, 0, 0, this.setting.width, this.setting.height);
		return this;
	},
	updatePicker : function(){
		this.updateExport();
		this.cToPicker.fillStyle = '#FFFFFF';
		this.cToPicker.fillRect(0,0,this.setting.width, this.setting.height);
		this.cToPicker.drawImage(this.cnvExport, 0, 0, this.setting.width, this.setting.height);
		return this;
	},	
	onMouseDown : function(e,self){		
		this.currentTool = app.currentTool;
		if(this.currentTool == 'eraser') this.currentTool = 'brush';
		var mx = self.mousePosX(e),
			my = self.mousePosY(e);

		switch(this.currentTool){
			case 'brush':
				if(!self.painting && self.layers[self.currentLayer].visible){
					self.painting = true;
					self.app.brush.update().draw(mx,my);
				}
				break;
			case 'picker':
				if(!self.pickering){
					self.pickering = true;
					self.updatePicker();	
					self.app.picker.setImageData(self.cToPicker,self.setting.width,self.setting.height).pick(mx,my,e);
				}
				break;
			case 'hand':
				self.handDragging = true;
				self.difposX = e.pageX - self.docNode.offsetLeft;
				self.difposY = e.pageY - self.docNode.offsetTop;				
				break;
			case 'select':
				if( mx > self.selectArea.x && mx < (self.selectArea.x+self.selectArea.w) && my > self.selectArea.y && my < (self.selectArea.y+self.selectArea.h)){
					self.selectArea.difX = mx - self.selectArea.x;
					self.selectArea.difY = my - self.selectArea.y;
					self.selectingDrag = true;
				}else{	
					self.selectRect.style.display = 'block';
					self.selectRect.style.left = mx+'px';
					self.selectRect.style.top = my+'px';
					self.selectRect.style.width = '0px';
					self.selectRect.style.height = '0px';
					self.selectArea.x = mx;
					self.selectArea.y = my;
					self.selectArea.w = 0;
					self.selectArea.h = 0;
					self.selecting = true;
				}
				
				break;
			default://
				break;
		}	
		
		return this;
	},
	pixelCount : 0,
	onMouseMove : function(e,self){
		var mx = self.mousePosX(e),
			my = self.mousePosY(e);

		switch(this.currentTool){
			case 'brush':
				if(self.painting){					
					if(self.prevMX == null) self.prevMX = mx;
					if(self.prevMY == null) self.prevMY = my;			
					var segmentX = (mx - self.prevMX),
						segmentY = (my - self.prevMY),
						segment = Math.sqrt(segmentX*segmentX + segmentY*segmentY);				
					self.pixelCount += segment;			
					
					if(self.pixelCount >= self.app.brush.spacingPx){
						var countStep = Math.round(segment/self.app.brush.spacingPx);				
						if(countStep != 0){
							var sX = segmentX/countStep,
								sY = segmentY/countStep;
						}else{
							var sX = segmentX,
								sY = segmentY;
						}			
						for(var i = 0; i <= countStep;i++){					
							self.app.brush.draw(Math.round(mx - sX*i),Math.round(my - sY*i));
						}
						self.pixelCount = 0;				
					}			
						
					self.prevMX = mx;
					self.prevMY = my;
				}
				break;
			case 'picker':
				if(self.pickering){			
					self.app.picker.pick(mx,my,e);
				}
				break;
			case 'hand':
				if(self.handDragging){			
					self.docNode.style.left = e.pageX - self.difposX + 'px';					
					self.docNode.style.top = e.pageY - self.difposY + 'px';
				}
				break;
			case 'select':
				if(self.selecting){
					self.selectRect.style.width = (mx-self.selectArea.x)+'px';
					self.selectRect.style.height = (my-self.selectArea.y)+'px';
					self.selectArea.w = (mx-self.selectArea.x);
					self.selectArea.h = (my-self.selectArea.y);
				}
				if(self.selectingDrag){
					self.selectArea.x = mx - self.selectArea.difX;
					self.selectArea.y = my - self.selectArea.difY;
					self.selectRect.style.left = self.selectArea.x+'px';
					self.selectRect.style.top = self.selectArea.y+'px';
				}				
				break;
			default://
				break;
		}

		return this;
	},
	onMouseUp : function(e,self){
		switch(this.currentTool){
			case 'brush':
				if(self.painting){
					
					self.prevMX = null;
					self.prevMY = null;
					self.app.brush.dirtColor();
					self.rendererToImageDataLayer(true).updateAllShow();
				}
				break;
			case 'picker':
				if(self.pickering){
					self.app.picker.setColor();
				}
				break;
			case 'hand':
				//
				break;			
			case 'select':
				if(self.selecting || self.selectingDrag){
					self.setSelection();
					self.selecting = false;
					self.selectingDrag = false;
				}
				break;	
			default://
				break;
		}
		self.painting = false;
		self.pickering = false;
		self.handDragging = false;
		self.zooming = false;
		return this;
	},
	mousePosX : function(e){
		return  Math.round(this.w2 - ((1/this.zoomScale)*(this.w2-(e.pageX - this.docNode.offsetLeft))));
	},
	mousePosY : function(e){		
		return  Math.round(this.h2 - ((1/this.zoomScale)*(this.h2-(e.pageY - this.docNode.offsetTop - 52))));
	},
	setMouseEvents : function(){
		var self = this;
		this.docNode.addEventListener('mousedown', function(e){self.onMouseDown(e,self);},false);
		this.docNode.addEventListener('mousemove', function(e){self.onMouseMove(e,self);},false);
		document.body.addEventListener('mouseup', function(e){self.onMouseUp(e,self);},false);			
		return this;
	},
	getWindowedZoom :function(){
		var b = document.getElementById('canvasShopBack').getBoundingClientRect(),
			initialScale = 1,	
			bHeight = b.height - 52,
			zs,le,to;		
		if(b.width/(this.setting.width+40) < initialScale) initialScale = b.width/(this.setting.width+40);
		if(bHeight/(this.setting.height+60) < initialScale) initialScale = bHeight/(this.setting.height+60);
		zs = initialScale;

		if(initialScale == 1){
			initialScale = b.width/(this.setting.width+10);
			if(bHeight/(this.setting.height+20) < initialScale) initialScale = bHeight/(this.setting.height+20);
			zs = initialScale;
		}
		le = (b.width-this.setting.width)/2;
		to = (bHeight-this.setting.height)/2;

		return {'zoomScale':zs,'left':le,'top':to};
	},
	setZoom : function(val){
		if(val != undefined){
			if(val == 'scaled'){
				var sca = this.getWindowedZoom();

				this.zoomScale = sca.zoomScale;
				this.docNode.style.left = sca.left +'px';
				this.docNode.style.top = sca.top +'px';

			}else{
				this.zoomScale = val;
			}
		}else{
			if(app.zoomDirection>0){
				this.zoomScale *= app.zoomStep;
			}else{
				this.zoomScale /= app.zoomStep;
			}
		}
		if(this.zoomScale > app.maxZoom) this.zoomScale = app.maxZoom;
		if(this.zoomScale < app.minZoom) this.zoomScale = app.minZoom;
		
		this.docNode.style.transform = 'scale('+this.zoomScale+')';
		this.docNode.style.webkitTransform = 'scale('+this.zoomScale+')';
		this.docNode.style.mozTransform = 'scale('+this.zoomScale+')';
		
		app.ui.tools.slideZoom.update(this.zoomScale*100);
		return this;
	},
	saveToUndo : function(){
		/*var l = this.undoList.length;
		if((l-this.undoListCursor)>1){
			this.undoList.splice(this.undoListCursor+1);
		}

		if(l >= this.undoListLimit){
			this.undoList.splice(0,1);
			this.undoListCursor--;
		}
		var newImg = new Image();
		newImg.src = this.layers[this.currentLayer].node.toDataURL("image/png");
		this.undoList.push([this.layers[this.currentLayer].id,newImg]);		
		this.undoListCursor++;
		app.ui.toogleUndo(true).toogleRedo(false);*/
		return this;
	},
	undo : function(){		
		/*if(this.undoListCursor>=1){
			this.undoListCursor--;
			var undoStep = this.undoList[this.undoListCursor];
			for(var i = 0; i< this.length;i++){
				if(this.layers[i].id == undoStep[0]){
					this.layers[i].c.clearRect(0,0,this.setting.width, this.setting.height);				
					this.layers[i].c.drawImage(undoStep[1], 0, 0, this.setting.width, this.setting.height);
					app.ui.toogleUndo(false).toogleRedo(true);
				}
			}
		}*/
	},
	redo : function(){
		/*if((this.undoList.length-this.undoListCursor)>1){
			this.undoListCursor++;
			var undoStep = this.undoList[this.undoListCursor];
			for(var i = 0; i< this.length;i++){
				if(this.layers[i].id == undoStep[0]){
					this.layers[i].c.clearRect(0,0,this.setting.width, this.setting.height);				
					this.layers[i].c.drawImage(undoStep[1], 0, 0, this.setting.width, this.setting.height);
					app.ui.toogleUndo(true).toogleRedo(false);
				}
			}
		}*/
	},
	exportDoc : function(){
	
		var exporter = document.getElementById('canvasShopExport'),
			exporterCont = document.getElementById('export-image-container'),
			img = document.createElement('img'),
			coord = this.getWindowedZoom();

		exporterCont.innerHTML = '';
		exporterCont.appendChild(img);
		this.updateExport();
		img.src = this.cnvExport.toDataURL('image/png');
		img.style.transform = 'scale('+coord.zoomScale+')';
		img.style.webkitTransform = 'scale('+coord.zoomScale+')';
		img.style.mozTransform = 'scale('+coord.zoomScale+')';
		img.style.left = coord.left +'px';
		img.style.top = coord.top +'px';
		//document.getElementsByTagName('title')[0].innerHTML = this.setting.name;

		exporter.style.display = 'block';

		app.ui.blockLeave = false;

		return this;
	},
	setSelection : function(){
		this.cRenderer.restore();
		this.cRenderer.save();
		this.cRenderer.beginPath();
		if(this.selectArea.w > 0 && this.selectArea.h > 0){
			this.cRenderer.rect(this.selectArea.x, this.selectArea.y, this.selectArea.w, this.selectArea.h);			
		}else{
			this.selectRect.style.display = 'none';			
			this.cRenderer.rect(0, 0, this.setting.width, this.setting.height);						
		}
		this.cRenderer.closePath();
		this.cRenderer.clip();
		return this;
	}
};