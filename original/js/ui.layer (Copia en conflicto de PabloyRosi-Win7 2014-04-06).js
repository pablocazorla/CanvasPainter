// LayerCtrl
var layerCtrl = function(){
	return this.init();
}
layerCtrl.prototype = {
	layerForDocs : [],	
	enabledLayers : false,
	heightStick : 26,
	init : function(){
		// Init opacity slider
		var self = this;
		this.sliderOpacityLayer = new slider({
			parent : getById('layer-top-tools'),
			id : 'slider-layer-opacity',
			title : 'Opacity (%)',
			titleOver : 'The opacity of the layer',
			startDisable : true,
			initVal : 100,
			callback : function(){
				app.currentDoc.setOpacityLayer(self.sliderOpacityLayer.val);
			}
		});		
		onClick('palet-tool-new-layer',function(){if(self.enabledLayers){app.currentDoc.addLayer();}});
		onClick('palet-duplicate-layer',function(){if(self.enabledLayers){app.currentDoc.duplicateLayer();}});
		onClick('palet-merge-layer',function(){if(self.enabledLayers){app.currentDoc.mergeLayer();}});
		onClick('palet-tool-remove-layer',function(){if(self.enabledLayers){app.currentDoc.removeLayer();}});

		return this;		
	},
	createLayerDoc : function(doc){
		var layerForDoc = document.createElement('div');
		layerForDoc.className = 'layer-for-doc';
		layerForDoc.id = 'lfd-'+doc.setting.docID;
		getById('layer-container').appendChild(layerForDoc);
		this.layerForDocs.push(layerForDoc);

		var layerDragIndicator = document.createElement('div');
		layerDragIndicator.className = 'layer-drag-indicator';
		layerForDoc.appendChild(layerDragIndicator);

		return this;
	},
	removeLayerDoc : function(indexToRemove,docID){
		this.layerForDocs.splice(indexToRemove,1);
		getById('layer-container').removeChild(getById('lfd-'+docID));
		return this;
	},
	addLayer : function(newLayer){
		var layerStick = document.createElement('div'),
			layerEye = document.createElement('span'),
			layerTitle = document.createElement('span');
			
		layerStick.className = 'layer-stick';
		layerStick.id = 'lay-'+newLayer.id+'-'+app.currentDoc.setting.docID;
		
		layerEye.className = 'layer-stick-eye';
		layerTitle.className = 'layer-stick-title';
		layerTitle.innerHTML = newLayer.name;			
		
		var container = getById('lfd-'+ app.currentDoc.setting.docID);	
		container.appendChild(layerStick);
		
		layerStick.appendChild(layerEye);
		layerStick.appendChild(layerTitle);

		this.setEventSticks(layerStick,layerEye,layerTitle,container);
		
		
		this.setLayerStickPositions();
		return this;
	},
	toggleEnabledLayers : function(flag){
		if(flag && !this.enabledLayers){
			getById('layer-bottom-tools').className = '';
			this.enabledLayers = true;	
		}
		if(!flag && this.enabledLayers){
			getById('layer-bottom-tools').className = 'disable';
			this.enabledLayers = false;
		}		
		return this;
	},
	toggleVisibleLayer : function(idLayer,flag){
		if(flag){
			getById('lay-'+idLayer+'-'+app.currentDoc.setting.docID).childNodes[0].className = 'layer-stick-eye';
		}else{
			getById('lay-'+idLayer+'-'+app.currentDoc.setting.docID).childNodes[0].className = 'layer-stick-eye closed';
		}
		return this;
	},	
	setCurrentLayer : function(layer){
		try{getById('lfd-'+app.currentDoc.setting.docID).getElementsByClassName('layer-stick current')[0].className = 'layer-stick';}catch(e){}		
		getById('lay-'+layer.id+'-'+app.currentDoc.setting.docID).className = 'layer-stick current';
		this.sliderOpacityLayer.update(layer.opacity);
		return this;
	},
	downLayer : function(idLayerDown,idLayer){
		this.setLayerStickPositions();
		return this;
	},
	upLayer : function(idLayerUp,idLayer){		
		this.setLayerStickPositions();
		return this;
	},
	removeLayer : function(idLayer){		
		getById('lfd-'+app.currentDoc.setting.docID).removeChild(getById('lay-'+idLayer+'-'+app.currentDoc.setting.docID));		
		return this;
	},
	setLayerStickPositions : function(){
		var num = 0;
		for(var i = app.currentDoc.length - 1;i>=0;i--){
			getById('lay-'+app.currentDoc.layers[i].id+'-'+app.currentDoc.setting.docID).style.top = this.heightStick * num +'px';
			num++;
		}
		num++;
		getById('lfd-'+app.currentDoc.setting.docID).style.height = this.heightStick * num +'px';
		return this;
	},
	setEventSticks : function(layerStick,layerEye,layerTitle,container){


		var self = this,
			layerID = layerStick.id.split('-')[1],
			dragging = false,
			moving = false,
			top = 0,
			topGoto = 0,
			dY = 0,
			endIndex = 0,
			layerDragIndicator = container.getElementsByClassName('layer-drag-indicator')[0],
			len = app.currentDoc.length,
			onMouseDown = function(e){
				app.currentDoc.setCurrentLayer(layerID,true);				
				dY = e.pageY - parseInt(window.getComputedStyle(layerStick).getPropertyValue('top'));
				layerStick.className = 'layer-stick current dragging';
				dragging = true;
			},
			onMouseMove = function(e){
				if(dragging){
					moving = true;
					top =  e.pageY - dY;
					layerStick.style.top = top + 'px';
					topGoto = Math.round(top/self.heightStick);
					layerDragIndicator.style.top = (topGoto * self.heightStick) + 'px';
					endIndex = app.currentDoc.length - 1 - topGoto;				
				}
			},
			onMouseUp = function(){
				if(dragging){
					dragging = false;					
					layerStick.className = 'layer-stick current';
					layerDragIndicator.style.top = '-5px';
				}
				if(moving){
					moving = false;
					
						app.currentDoc.changeLayerPosition(endIndex);
					
				}
			};




		onClick(layerEye,function(){
			app.currentDoc.toggleVisibleLayer(layerID);
		});

		layerTitle.addEventListener('mousedown', function(e){onMouseDown(e);},false);
		document.body.addEventListener('mousemove', function(e){onMouseMove(e);},false);
		document.body.addEventListener('mouseup', function(e){onMouseUp();},false);	

		





		return this;
	}

}