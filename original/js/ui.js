var ui=function(){return this.init(parent)};ui.prototype={showingModal:!1,docNodes:[],tabs:[],length:0,currentDocID:null,blockLeave:!1,palets:[],init:function(){return this.container=document.getElementById("canvasShopBack"),this},getWindowSize:function(){var a=this.container.getBoundingClientRect();return[a.width,a.height]},start:function(){var a=this;return this.color=new colorCtrl("#000000"),this.layerCtrl=new layerCtrl,this.brushCtrl=new brushCtrl,this.brushCtrl.setDefaultPresets(),this.tools=new toolsCtrl,this.filters=new filtersCtrl,this.paletColor=new palet({id:"palet-color",onToogle:function(){a.color.updateSliders()}}),this.palets.push(this.paletColor),this.paletLayer=new palet({id:"palet-layers"}),this.palets.push(this.paletLayer),this.paletBrush=new palet({id:"palet-brush",onToogle:function(){a.brushCtrl.update()}}),this.palets.push(this.paletBrush),this.paletTools=new palet({id:"palet-tools"}),this.palets.push(this.paletTools),this.setEvents().startPresentation(),this},startPresentation:function(){this.presentation=this.getById("presentation"),this.presentationBack=this.getById("canvasPresentation"),this.presentationLoader=this.getById("loader-presentation");var a=this;return setTimeout(function(){a.presentation.style.opacity=0,a.presentationLoader.style.visibility="hidden",setTimeout(function(){a.presentation.style.display="none",a.presentation.style.opacity="1",a.presentationBack.style.display="none",a.onClick("presentation-img",function(){a.presentation.style.display="none"}),setTimeout(function(){a.getById("modal-start").style.opacity="1"},250)},800)},2e3),this},beforeOut:function(){},browserIncompatible:function(){return this.getById("presentation").style.display="none",this.getById("browserIncompatible").style.display="block",this},show:function(a){return this.getById(a).style.display="block",this},hide:function(a){return this.getById(a).style.display="none",this},getById:function(a){return"string"==typeof a?document.getElementById(a):a},onClick:function(a,b){return this.getById(a).addEventListener("click",b,!1),this},setEvents:function(){var a=this;return window.onbeforeunload=function(){return a.blockLeave?"You have images without export. Do you want to exit?":void 0},this.onClick("new-start",function(){a.toggleModalNew(!0),a.getById("modal-start").style.display="none"}),this.onClick("btn-new",function(){a.toggleModalNew(!0),a.getById("modal-start").style.display="none"}),this.onClick("btn-close-doc",function(){a.length>0&&a.toggleModalClose(!0)}),this.onClick("btn-export",function(){a.length>0&&app.currentDoc.exportDoc()}),this.onClick("close-exporter",function(){a.getById("canvasShopExport").style.display="none",a.blockLeave=!0}),this.onClick("btn-about",function(){a.presentation.style.display="block"}),this.onClick("cancel-new",function(){a.toggleModalNew(!1)}),this.onClick("ok-new",function(){a.toggleModalNew(!1);var b={},c=a.getById("modal-new-input-name").value,d=parseInt(a.getById("modal-new-input-width").value),e=parseInt(a.getById("modal-new-input-height").value),f=a.getById("modal-new-background"),g=f.options[f.selectedIndex].value;"string"==typeof c&&""!=c&&(b.name=c),isNaN(d)||(b.width=d),isNaN(e)||(b.height=e),b.backColor=g,app.createDocument(b)}),this.onClick("cancel-close",function(){a.toggleModalClose(!1)}),this.onClick("ok-close",function(){app.deleteDocument(),a.toggleModalClose(!1)}),this.onClick("btn-show-color",function(){a.paletColor.toogle(!0)}),this.onClick("btn-show-layers",function(){a.paletLayer.toogle(!0)}),this.onClick("btn-show-brush",function(){a.paletBrush.toogle(!0)}),this.onClick("btn-show-tools",function(){a.paletTools.toogle(!0)}),this.onClick("btn-undo",function(){app.currentDoc.undo()}),this.onClick("btn-redo",function(){app.currentDoc.redo()}),this},toogleUndo:function(a){return this.getById("btn-undo").className=a?"":"disable",this},toogleRedo:function(a){return this.getById("btn-redo").className=a?"":"disable",this},toggleModalNew:function(a){a&&!this.showingModal&&(this.getById("modal-new-input-name").value="Untitled-"+app.idCount,this.show("modal-new").show("modal-dimmer"),this.showingModal=!0),!a&&this.showingModal&&(this.hide("modal-new").hide("modal-dimmer"),this.showingModal=!1)},toggleModalClose:function(a){a&&!this.showingModal&&(this.show("modal-close").show("modal-dimmer"),this.showingModal=!0),!a&&this.showingModal&&(this.hide("modal-close").hide("modal-dimmer"),this.showingModal=!1)},renderDocument:function(a){var b=document.createElement("div");b.className="doc-canvas",b.id="node-"+a.setting.docID,b.style.width=a.setting.width+"px",b.style.height=a.setting.height+"px";var c=this.getWindowSize(),d=1;c[1]-=52,c[0]/(a.setting.width+40)<d&&(d=c[0]/(a.setting.width+40)),c[1]/(a.setting.height+60)<d&&(d=c[1]/(a.setting.height+60)),a.zoomScale=d,b.style.left=(c[0]-a.setting.width)/2+"px",b.style.top=(c[1]-a.setting.height)/2+"px",this.getById("doc-container").appendChild(b);var e=document.createElement("li");e.id="tab-"+a.setting.docID,this.setTabTitle(e,a),this.getById("document-list").appendChild(e),this.getById("document-list-title").innerHTML="Documents ("+(this.length+1)+")",this.getById("document-list-title-content").className="",this.onClick(e,function(){app.setCurrentDoc(this.id.substr(4))}),this.layerCtrl.createLayerDoc(a),this.layerCtrl.toggleEnabledLayers(!0),this.layerCtrl.sliderOpacityLayer.toggleEnabled(!0),this.docNodes.push(b),this.tabs.push(e),this.length++,this.currentDocID=a.setting.docID,this.getById("zoom-buttons").className="header-section",this.getById("btn-export").className="",this.getById("btn-close-doc").className="",this.blockLeave=!0,this.filters.toogleEnabled(!0),a.start(b)},setTabTitle:function(a,b){var c=b.setting.name+" - ("+b.setting.width+"x"+b.setting.height+"px)";a.title=c,c.length>37&&(c=c.substring(0,35)+"..."),a.innerHTML=c},eraseDocument:function(a){for(var b=-1,c=0;c<this.length;c++)this.docNodes[c].id=="node-"+a&&(b=c);this.docNodes.splice(b,1),this.layerCtrl.removeLayerDoc(b,a),this.tabs.splice(b,1),this.getById("doc-container").removeChild(this.getById("node-"+a)),this.getById("document-list").removeChild(this.getById("tab-"+a)),this.getById("document-list-title").innerHTML="Documents ("+(this.length-1)+")",this.length--,this.length<=0&&(this.getById("document-list-title-content").className="disable",this.layerCtrl.toggleEnabledLayers(!1),this.layerCtrl.sliderOpacityLayer.toggleEnabled(!1),this.tools.slideZoom.toggleEnabled(!1),this.getById("zoom-buttons").className="header-section disable",this.getById("btn-export").className="disable",this.getById("btn-close-doc").className="disable",this.filters.toogleEnabled(!1),this.blockLeave=!1)},setCurrentDoc:function(a){this.currentDocID=a;for(var b=0;b<this.length;b++)this.docNodes[b].id=="node-"+a?(this.show(this.docNodes[b]),this.show(this.layerCtrl.layerForDocs[b]),this.tabs[b].className="current"):(this.hide(this.docNodes[b]),this.hide(this.layerCtrl.layerForDocs[b]),this.tabs[b].className="");this.layerCtrl.sliderOpacityLayer.update(app.currentDoc.layers[app.currentDoc.currentLayer].opacity),this.tools.slideZoom.toggleEnabled(!0),this.tools.slideZoom.update(100*app.currentDoc.zoomScale)}};