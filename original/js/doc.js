var doc=function(b,a){return this.init(b,a)};doc.prototype={difposX:0,difposY:0,handDragging:!1,zoomScale:1,selecting:!1,selectingDrag:!1,currentTool:"brush",init:function(b,a){this.setting=extend({docID:"docID"+b.idCount,name:"Untitled",width:800,height:600,backColor:"transparent"},a);b.idCount++;this.app=b;this.undoList=[];this.undoListLimit=2;this.undoListCursor=-1;this.layers=[];this.length=0;this.currentLayer=null;this.idLayerCount=0;this.pickering=this.painting=!1;this.cnvOver=this.docNode=this.prevMY=this.prevMX=null;this.selectArea={x:0,y:0,w:0,h:0,difX:0,difY:0};this.w2=this.setting.width/2;this.h2=this.setting.height/2;return this},start:function(b){this.docNode=b;this.selectRect=document.createElement("div");this.selectRect.className="select-rect";this.selectRect.style.display="none";this.docNode.appendChild(this.selectRect);this.cnvShowTop=document.createElement("canvas");this.cnvShowTop.width=this.setting.width;this.cnvShowTop.height=this.setting.height;this.cnvShowTop.className="cnv-top show";this.docNode.appendChild(this.cnvShowTop);this.cShowTop=this.cnvShowTop.getContext("2d");this.cnvShowCurrent=document.createElement("canvas");this.cnvShowCurrent.width=this.setting.width;this.cnvShowCurrent.height=this.setting.height;this.cnvShowCurrent.className="cnv-current show";this.docNode.appendChild(this.cnvShowCurrent);this.cShowCurrent=this.cnvShowCurrent.getContext("2d");this.cnvShowBottom=document.createElement("canvas");this.cnvShowBottom.width=this.setting.width;this.cnvShowBottom.height=this.setting.height;this.cnvShowBottom.className="cnv-bottom show";this.docNode.appendChild(this.cnvShowBottom);this.cShowBottom=this.cnvShowBottom.getContext("2d");this.cnvRenderer=document.createElement("canvas");this.cnvRenderer.width=this.setting.width;this.cnvRenderer.height=this.setting.height;this.cnvRenderer.className="cnv-renderer";this.docNode.appendChild(this.cnvRenderer);this.cRenderer=this.cnvRenderer.getContext("2d");this.cRenderer.save();this.cnvMask=document.createElement("canvas");this.cnvMask.width=this.setting.width;this.cnvMask.height=this.setting.height;this.cnvMask.className="cnv-mask";this.docNode.appendChild(this.cnvMask);this.cMask=this.cnvMask.getContext("2d");this.cnvExport=document.createElement("canvas");this.cnvExport.width=this.setting.width;this.cnvExport.height=this.setting.height;this.cnvExport.className="cnv-export";this.docNode.appendChild(this.cnvExport);this.cExport=this.cnvExport.getContext("2d");this.cnvToPicker=document.createElement("canvas");this.cnvToPicker.width=this.setting.width;this.cnvToPicker.height=this.setting.height;this.cnvToPicker.className="cnv-to-picker";this.docNode.appendChild(this.cnvToPicker);this.cToPicker=this.cnvToPicker.getContext("2d");this.addLayer();switch(this.setting.backColor){case "white":this.cRenderer.fillStyle="#FFFFFF";this.cRenderer.fillRect(0,0,this.setting.width,this.setting.height);this.rendererToImageDataLayer(!0).updateAllShow();break;case "black":this.cRenderer.fillStyle="#000000",this.cRenderer.fillRect(0,0,this.setting.width,this.setting.height),this.rendererToImageDataLayer(!0).updateAllShow()}this.setMouseEvents().setZoom(this.zoomScale);return this},addLayer:function(b){void 0==b&&(b={});var a=this.idLayerCount;document.createElement("canvas");b=extend({id:a,name:"Layer-"+a,opacity:100,visible:!0,blocked:!1,imagedata:null,clipped:!1,clipLayer:null},b);this.idLayerCount++;this.cRenderer.clearRect(0,0,this.setting.width,this.setting.height);b.imagedata=this.cRenderer.getImageData(0,0,this.setting.width,this.setting.height);0<this.length?this.layers.splice(this.currentLayer+1,0,b):this.layers.push(b);this.length++;app.ui.layerCtrl.addLayer(b);1<this.length?this.setCurrentLayer(this.currentLayer+1):this.setCurrentLayer(this.length-1);return this},rendererToImageDataLayer:function(b,a,c){void 0==a&&(a=this.currentLayer);b?this.layers[a].imagedata=this.cRenderer.getImageData(0,0,this.setting.width,this.setting.height):c?(this.cExport.putImageData(this.layers[a].imagedata,0,0),this.cRenderer.globalAlpha=this.layers[a].opacity/100,this.cRenderer.drawImage(this.cnvExport,0,0,this.setting.width,this.setting.height),this.cRenderer.globalAlpha=1):(this.cRenderer.putImageData(this.layers[a].imagedata,0,0),this.layers[a].clipped&&(this.cMask.putImageData(this.layers[this.layers[a].clipLayer].imagedata,0,0),this.cRenderer.globalCompositeOperation="destination-in",this.cRenderer.drawImage(this.cnvMask,0,0,this.setting.width,this.setting.height),this.cRenderer.globalCompositeOperation="source-over"));return this},mergeLayer:function(){0<this.currentLayer&&(this.rendererToImageDataLayer(!1,this.currentLayer-1).rendererToImageDataLayer(!1,this.currentLayer,!0).rendererToImageDataLayer(!0,this.currentLayer-1),this.removeLayer());return this},duplicateLayer:function(){var b=this.layers[this.currentLayer],a=b.name,c=a.indexOf(" (copy");if(-1<c){var d=1;-1<a.indexOf(" (copy-")&&(d=parseInt(a.substring(c+7,a.length-1))+1);a=a.substring(0,c+6)+"-"+d+")"}else a+=" (copy)";this.addLayer({name:a,opacity:b.opacity,visible:b.visible});this.rendererToImageDataLayer(!1,this.currentLayer-1).rendererToImageDataLayer(!0).updateAllShow();return this},toggleVisibleLayer:function(b){for(var a=0;a<this.length;a++)this.layers[a].id==b&&(this.layers[a].visible=this.layers[a].visible?!1:!0,this.updateAllShow(),app.ui.layerCtrl.setLayerStickPositions());return this},toggleClippedLayer:function(b){for(var a=1;a<this.length;a++)this.layers[a].id==b&&(this.layers[a].clipped=this.layers[a].clipped?!1:!0,this.updateAllShow(),app.ui.layerCtrl.setLayerStickPositions());return this},toggleBlockedLayer:function(b){for(var a=0;a<this.length;a++)this.layers[a].id==b&&(this.layers[a].blocked=this.layers[a].blocked?!1:!0,app.ui.layerCtrl.setLayerStickPositions());return this},setCurrentLayer:function(b,a){if(a)for(var c=0;c<this.length;c++)this.layers[c].id==b&&(this.currentLayer=c);else this.currentLayer=b;app.ui.layerCtrl.setLayerStickPositions();this.updateAllShow();return this},changeLayerPosition:function(b){if(b!=this.currentLayer){var a=this.layers[this.currentLayer];this.layers.splice(this.currentLayer,1);b<this.currentLayer&&b++;this.currentLayer=b;this.layers.splice(b,0,a);this.setCurrentLayer(this.currentLayer)}app.ui.layerCtrl.setLayerStickPositions();return this},setOpacityLayer:function(b){this.layers[this.currentLayer].opacity=b;this.updateAllShow();return this},removeLayer:function(){if(1<this.length){app.ui.layerCtrl.removeLayer(this.layers[this.currentLayer].id);this.layers.splice(this.currentLayer,1);this.length--;var b=this.currentLayer-1;0>b&&(b=0);this.setCurrentLayer(b);app.ui.layerCtrl.setLayerStickPositions()}},updateShowCurrent:function(){this.cShowCurrent.clearRect(0,0,this.setting.width,this.setting.height);this.layers[this.currentLayer].visible&&(this.cShowCurrent.globalAlpha=this.layers[this.currentLayer].opacity/100,this.cShowCurrent.drawImage(this.cnvRenderer,0,0,this.setting.width,this.setting.height));return this},updateAllShow:function(){this.cShowTop.clearRect(0,0,this.setting.width,this.setting.height);this.cShowBottom.clearRect(0,0,this.setting.width,this.setting.height);for(var b=0,a=0;a<this.length;a++)this.layers[a].clipped?0==a?this.layers[a].clipped=!1:this.layers[a].clipLayer=b:b=a,this.layers[a].visible&&(this.rendererToImageDataLayer(!1,a),this.layers[a].clipped&&(this.cMask.putImageData(this.layers[this.layers[a].clipLayer].imagedata,0,0),this.cRenderer.globalCompositeOperation="destination-in",this.cRenderer.drawImage(this.cnvMask,0,0,this.setting.width,this.setting.height),this.cRenderer.globalCompositeOperation="source-over"),a<this.currentLayer?(this.cShowBottom.globalAlpha=this.layers[a].opacity/100,this.cShowBottom.drawImage(this.cnvRenderer,0,0,this.setting.width,this.setting.height)):a>this.currentLayer&&(this.cShowTop.globalAlpha=this.layers[a].opacity/100,this.cShowTop.drawImage(this.cnvRenderer,0,0,this.setting.width,this.setting.height)));this.rendererToImageDataLayer(!1).updateShowCurrent();return this},updateExport:function(){this.cExport.clearRect(0,0,this.setting.width,this.setting.height);this.cExport.drawImage(this.cnvShowBottom,0,0,this.setting.width,this.setting.height);this.cExport.drawImage(this.cnvShowCurrent,0,0,this.setting.width,this.setting.height);this.cExport.drawImage(this.cnvShowTop,0,0,this.setting.width,this.setting.height);return this},updatePicker:function(){this.updateExport();this.cToPicker.fillStyle="#FFFFFF";this.cToPicker.fillRect(0,0,this.setting.width,this.setting.height);this.cToPicker.drawImage(this.cnvExport,0,0,this.setting.width,this.setting.height);return this},onMouseDown:function(b,a){this.currentTool=app.currentTool;"eraser"==this.currentTool&&(this.currentTool="brush");var c=a.mousePosX(b),d=a.mousePosY(b);switch(this.currentTool){case "brush":a.painting||!a.layers[a.currentLayer].visible||a.layers[a.currentLayer].blocked||(a.painting=!0,a.app.brush.update().draw(c,d));break;case "picker":a.pickering||(a.pickering=!0,a.updatePicker(),a.app.picker.setImageData(a.cToPicker,a.setting.width,a.setting.height).pick(c,d,b));break;case "hand":a.handDragging=!0;a.difposX=b.pageX-a.docNode.offsetLeft;a.difposY=b.pageY-a.docNode.offsetTop;break;case "select":c>a.selectArea.x&&c<a.selectArea.x+a.selectArea.w&&d>a.selectArea.y&&d<a.selectArea.y+a.selectArea.h?(a.selectArea.difX=c-a.selectArea.x,a.selectArea.difY=d-a.selectArea.y,a.selectingDrag=!0):(a.selectRect.style.display="block",a.selectRect.style.left=c+"px",a.selectRect.style.top=d+"px",a.selectRect.style.width="0px",a.selectRect.style.height="0px",a.selectArea.x=c,a.selectArea.y=d,a.selectArea.w=0,a.selectArea.h=0,a.selecting=!0)}return this},pixelCount:0,onMouseMove:function(b,a){var c=a.mousePosX(b),d=a.mousePosY(b);switch(this.currentTool){case "brush":if(a.painting){null==a.prevMX&&(a.prevMX=c);null==a.prevMY&&(a.prevMY=d);var f=c-a.prevMX,g=d-a.prevMY,e=Math.sqrt(f*f+g*g);a.pixelCount+=e;if(a.pixelCount>=a.app.brush.spacingPx){e=Math.round(e/a.app.brush.spacingPx);0!=e&&(f/=e,g/=e);for(var h=0;h<=e;h++)a.app.brush.draw(Math.round(c-f*h),Math.round(d-g*h));a.pixelCount=0}a.prevMX=c;a.prevMY=d}break;case "picker":a.pickering&&a.app.picker.pick(c,d,b);break;case "hand":a.handDragging&&(a.docNode.style.left=b.pageX-a.difposX+"px",a.docNode.style.top=b.pageY-a.difposY+"px");break;case "select":a.selecting&&(a.selectRect.style.width=c-a.selectArea.x+"px",a.selectRect.style.height=d-a.selectArea.y+"px",a.selectArea.w=c-a.selectArea.x,a.selectArea.h=d-a.selectArea.y),a.selectingDrag&&(a.selectArea.x=c-a.selectArea.difX,a.selectArea.y=d-a.selectArea.difY,a.selectRect.style.left=a.selectArea.x+"px",a.selectRect.style.top=a.selectArea.y+"px")}return this},onMouseUp:function(b,a){switch(this.currentTool){case "brush":a.painting&&(a.prevMX=null,a.prevMY=null,a.app.brush.dirtColor(),a.rendererToImageDataLayer(!0).updateAllShow());break;case "picker":a.pickering&&a.app.picker.setColor();break;case "select":if(a.selecting||a.selectingDrag)a.setSelection(),a.selecting=!1,a.selectingDrag=!1}a.painting=!1;a.pickering=!1;a.handDragging=!1;a.zooming=!1;return this},mousePosX:function(b){return Math.round(this.w2-1/this.zoomScale*(this.w2-(b.pageX-this.docNode.offsetLeft)))},mousePosY:function(b){return Math.round(this.h2-1/this.zoomScale*(this.h2-(b.pageY-this.docNode.offsetTop-52)))},setMouseEvents:function(){var b=this;this.docNode.addEventListener("mousedown",function(a){b.onMouseDown(a,b)},!1);this.docNode.addEventListener("mousemove",function(a){b.onMouseMove(a,b)},!1);document.body.addEventListener("mouseup",function(a){b.onMouseUp(a,b)},!1);return this},getWindowedZoom:function(){var b=document.getElementById("canvasShopBack").getBoundingClientRect(),a=1,c=b.height-52,d;b.width/(this.setting.width+40)<a&&(a=b.width/(this.setting.width+40));c/(this.setting.height+60)<a&&(a=c/(this.setting.height+60));d=a;1==a&&(a=b.width/(this.setting.width+10),c/(this.setting.height+20)<a&&(a=c/(this.setting.height+20)),d=a);return{zoomScale:d,left:(b.width-this.setting.width)/2,top:(c-this.setting.height)/2}},setZoom:function(b){void 0!=b?"scaled"==b?(b=this.getWindowedZoom(),this.zoomScale=b.zoomScale,this.docNode.style.left=b.left+"px",this.docNode.style.top=b.top+"px"):this.zoomScale=b:this.zoomScale=0<app.zoomDirection?this.zoomScale*app.zoomStep:this.zoomScale/app.zoomStep;this.zoomScale>app.maxZoom&&(this.zoomScale=app.maxZoom);this.zoomScale<app.minZoom&&(this.zoomScale=app.minZoom);this.docNode.style.transform="scale("+this.zoomScale+")";this.docNode.style.webkitTransform="scale("+this.zoomScale+")";this.docNode.style.mozTransform="scale("+this.zoomScale+")";app.ui.tools.slideZoom.update(100*this.zoomScale);return this},saveToUndo:function(){return this},undo:function(){},redo:function(){},exportDoc:function(){var b=document.getElementById("canvasShopExport"),a=document.getElementById("export-image-container"),c=document.createElement("img"),d=this.getWindowedZoom();a.innerHTML="";a.appendChild(c);this.updateExport();c.src=this.cnvExport.toDataURL("image/png");c.style.transform="scale("+d.zoomScale+")";c.style.webkitTransform="scale("+d.zoomScale+")";c.style.mozTransform="scale("+d.zoomScale+")";c.style.left=d.left+"px";c.style.top=d.top+"px";b.style.display="block";app.ui.blockLeave=!1;return this},setSelection:function(){this.cRenderer.restore();this.cRenderer.save();this.cRenderer.beginPath();0<this.selectArea.w&&0<this.selectArea.h?this.cRenderer.rect(this.selectArea.x,this.selectArea.y,this.selectArea.w,this.selectArea.h):(this.selectRect.style.display="none",this.cRenderer.rect(0,0,this.setting.width,this.setting.height));this.cRenderer.closePath();this.cRenderer.clip();return this}};