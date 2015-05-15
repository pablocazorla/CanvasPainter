// UI
var ui = function(){
	return this.init(parent);
};
ui.prototype = {
	showingModal : false,
	docNodes : [],
	tabs : [],
	length : 0,
	currentDocID : null,
	blockLeave : false,
	palets : [],
	init : function(parent){
		this.container = document.getElementById('canvasShopBack');
		return this;
	},
	getWindowSize : function(){
		var b = this.container.getBoundingClientRect();
		return [b.width,b.height];
	},
	start : function(){
		var self = this;
		this.color = new colorCtrl('#000000');
		this.layerCtrl = new layerCtrl();
		this.brushCtrl = new brushCtrl();
		this.brushCtrl.setDefaultPresets();
		this.tools = new toolsCtrl();
		this.filters = new filtersCtrl();
		this.paletColor = new palet({id:'palet-color',onToogle : function(){self.color.updateSliders()}});
		this.palets.push(this.paletColor);
		this.paletLayer = new palet({id:'palet-layers'});
		this.palets.push(this.paletLayer);
		this.paletBrush = new palet({id:'palet-brush',onToogle : function(){self.brushCtrl.update()}});
		this.palets.push(this.paletBrush);
		this.paletTools = new palet({id:'palet-tools'});
		this.palets.push(this.paletTools);

		this.setEvents().startPresentation();	
		return this;
	},
	startPresentation : function(){
		this.presentation = this.getById('presentation');
		this.presentationBack = this.getById('canvasPresentation');
		this.presentationLoader = this.getById('loader-presentation');
		var self = this;
		setTimeout(function(){
			self.presentation.style.opacity = 0;
			self.presentationLoader.style.visibility = 'hidden';
			setTimeout(function(){
				self.presentation.style.display = 'none';
				self.presentation.style.opacity = '1';
				self.presentationBack.style.display = 'none';
				self.onClick('presentation-img',function(){
					self.presentation.style.display = 'none';
				});
				setTimeout(function(){
					self.getById('modal-start').style.opacity = '1';
				},250);
			},800);
		},2000);
	

		//				this.presentation.style.display = 'none';
		//			this.presentationBack.style.display = 'none';

		return this;
	},
	beforeOut : function(){  
    	
	},
	browserIncompatible : function(){
		this.getById('presentation').style.display = 'none';
		this.getById('browserIncompatible').style.display = 'block';
		return this;
	},
	show : function(idElement){
		this.getById(idElement).style.display = 'block';
		return this;
	},
	hide : function(idElement){
		this.getById(idElement).style.display = 'none';
		return this;
	},
	
	getById : function(idElement){
		if(typeof idElement == 'string'){
			return document.getElementById(idElement);
		}else{
			return idElement;
		}		
	},
	onClick : function(idElement,callback){
		this.getById(idElement).addEventListener('click', callback,false);
		return this;
	},
	setEvents : function(){
		var self = this;
		window.onbeforeunload = function(){
			if (self.blockLeave) return "You have images without export. Do you want to exit?";
		};


		this.onClick('new-start',function(){self.toggleModalNew(true);self.getById('modal-start').style.display = 'none';});

		this.onClick('btn-new',function(){self.toggleModalNew(true);self.getById('modal-start').style.display = 'none';});
		this.onClick('btn-close-doc',function(){
			if(self.length > 0)	self.toggleModalClose(true);
		});
		this.onClick('btn-export',function(){
			if(self.length > 0)	app.currentDoc.exportDoc();
		});
		this.onClick('close-exporter',function(){
			self.getById('canvasShopExport').style.display = 'none';
			self.blockLeave = true;
		});
		this.onClick('btn-about',function(){
			self.presentation.style.display = 'block';
		});
		this.onClick('cancel-new',function(){self.toggleModalNew(false);});
		this.onClick('ok-new',function(){
			self.toggleModalNew(false);
			var opt = {},
				n = self.getById('modal-new-input-name').value,
				w = parseInt(self.getById('modal-new-input-width').value),
				h = parseInt(self.getById('modal-new-input-height').value),
				selBackColor = self.getById('modal-new-background'),
				b = selBackColor.options[selBackColor.selectedIndex].value;
			if(typeof n == 'string' && n != '')	opt.name = n;
			if(!isNaN(w)) opt.width = w;
			if(!isNaN(h)) opt.height = h;
			opt.backColor = b;
			app.createDocument(opt);
		});
		this.onClick('cancel-close',function(){self.toggleModalClose(false);});
		this.onClick('ok-close',function(){			
			app.deleteDocument();
			self.toggleModalClose(false);
		});
		this.onClick('btn-show-color',function(){self.paletColor.toogle(true);});
		this.onClick('btn-show-layers',function(){self.paletLayer.toogle(true);});
		this.onClick('btn-show-brush',function(){self.paletBrush.toogle(true);});
		this.onClick('btn-show-tools',function(){self.paletTools.toogle(true);});

		this.onClick('btn-undo',function(){app.currentDoc.undo();});
		this.onClick('btn-redo',function(){app.currentDoc.redo();});

		return this;
	},
	toogleUndo : function(flag){
		if(flag){
			this.getById('btn-undo').className = '';
		}else{
			this.getById('btn-undo').className = 'disable';
		}
		return this;
	},
	toogleRedo : function(flag){
		if(flag){
			this.getById('btn-redo').className = '';
		}else{
			this.getById('btn-redo').className = 'disable';
		}
		return this;
	},
	toggleModalNew : function(flag){
		if(flag && !this.showingModal){
			this.getById('modal-new-input-name').value = 'Untitled-'+app.idCount;			
			this.show('modal-new').show('modal-dimmer');
			this.showingModal = true;
		}
		if(!flag && this.showingModal){
			this.hide('modal-new').hide('modal-dimmer');
			this.showingModal = false;
		}		
	},
	toggleModalClose : function(flag){
		if(flag && !this.showingModal){
			this.show('modal-close').show('modal-dimmer');
			this.showingModal = true;
		}
		if(!flag && this.showingModal){
			this.hide('modal-close').hide('modal-dimmer');
			this.showingModal = false;
		}		
	},
	renderDocument : function(doc){
		// DocNode
		var docNode = document.createElement('div');			
		docNode.className = 'doc-canvas';
		docNode.id = 'node-'+doc.setting.docID;
		docNode.style.width = doc.setting.width+'px';
		docNode.style.height = doc.setting.height+'px';
		
		var b = this.getWindowSize(),
				initialScale = 1;
				b[1] -= 52;				
		if(b[0]/(doc.setting.width+40) < initialScale) initialScale = b[0]/(doc.setting.width+40);
		if(b[1]/(doc.setting.height+60) < initialScale) initialScale = b[1]/(doc.setting.height+60);		
		doc.zoomScale = initialScale;		
		docNode.style.left = (b[0]-doc.setting.width)/2 +'px';
		docNode.style.top = (b[1]-doc.setting.height)/2 +'px';	 	
	 	this.getById('doc-container').appendChild(docNode);	 	

	 	// Tab
		var	tab = document.createElement('li');
		tab.id = 'tab-'+doc.setting.docID;
		this.setTabTitle(tab,doc);
	 	this.getById('document-list').appendChild(tab);	 	
	 	this.getById('document-list-title').innerHTML = 'Documents ('+(this.length+1)+')';
	 	this.getById('document-list-title-content').className = '';
	 	var self = this;
		this.onClick(tab,function(){app.setCurrentDoc(this.id.substr(4));});
		
		// Layers
		this.layerCtrl.createLayerDoc(doc);
		this.layerCtrl.toggleEnabledLayers(true);
		this.layerCtrl.sliderOpacityLayer.toggleEnabled(true);

		// Collections
		this.docNodes.push(docNode);		
		this.tabs.push(tab);
	 	this.length++;	 	
	 	this.currentDocID = doc.setting.docID;
	 	
	 	// Interfaz
	 	this.getById('zoom-buttons').className = 'header-section';
	 	this.getById('btn-export').className = '';
	 	this.getById('btn-close-doc').className = '';
	 	this.blockLeave = true;
	 	this.filters.toogleEnabled(true);

	 	doc.start(docNode);
	 	
	},
	setTabTitle : function(tab,doc){
		var tabTitle = doc.setting.name+' - ('+doc.setting.width+'x'+doc.setting.height+'px)';
		tab.title = tabTitle;
		if(tabTitle.length>37){tabTitle = tabTitle.substring(0,35)+'...';}
	 	tab.innerHTML = tabTitle;
	},
	eraseDocument : function(docID){
		var indexToRemove = -1;	
		for(var i = 0;i < this.length;i++){
			if(this.docNodes[i].id == 'node-'+docID){
				indexToRemove = i;
			}
		}
		this.docNodes.splice(indexToRemove,1);
		this.layerCtrl.removeLayerDoc(indexToRemove,docID);
		this.tabs.splice(indexToRemove,1);
		this.getById('doc-container').removeChild(this.getById('node-'+docID));		
		this.getById('document-list').removeChild(this.getById('tab-'+docID));
		this.getById('document-list-title').innerHTML = 'Documents ('+(this.length-1)+')';		
		this.length--;
		if(this.length <= 0){
			this.getById('document-list-title-content').className = 'disable';			
			this.layerCtrl.toggleEnabledLayers(false);
			this.layerCtrl.sliderOpacityLayer.toggleEnabled(false);
			this.tools.slideZoom.toggleEnabled(false);
			this.getById('zoom-buttons').className = 'header-section disable';
			this.getById('btn-export').className = 'disable';
	 		this.getById('btn-close-doc').className = 'disable';
	 		this.filters.toogleEnabled(false);
	 		this.blockLeave = false;
		}
	},
	setCurrentDoc : function(docID){		
		this.currentDocID = docID;
		for(var i=0;i<this.length;i++){
			if(this.docNodes[i].id == 'node-'+docID){
				this.show(this.docNodes[i]);
				this.show(this.layerCtrl.layerForDocs[i]);
				this.tabs[i].className = 'current';
			}else{
				this.hide(this.docNodes[i]);
				this.hide(this.layerCtrl.layerForDocs[i]);
				this.tabs[i].className = '';
			}		
		}
		this.layerCtrl.sliderOpacityLayer.update(app.currentDoc.layers[app.currentDoc.currentLayer].opacity);		
		this.tools.slideZoom.toggleEnabled(true);
		this.tools.slideZoom.update(app.currentDoc.zoomScale*100);		
	}
};