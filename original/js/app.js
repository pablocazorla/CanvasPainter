var cs=function(){return this.init()};cs.prototype={idCount:0,docs:[],length:0,currentDoc:null,forecolor:null,currentTool:"brush",zoomDirection:1,zoomStep:1.2,maxZoom:5,minZoom:.01,init:function(){this.brush=new brush;this.picker=new picker;this.filters=new filters;this.ui=new ui(this);this.forecolor=new hypercolor;return this},start:function(){var a=navigator.userAgent.toLowerCase(),b=!1;-1<a.indexOf("webkit")&&(b=!0);-1<a.indexOf("gecko")&&(b=!0);-1<a.indexOf("trident")&&(-1<a.indexOf("msie 10")||-1<a.indexOf("msie 11"))&&(b=!0);b?this.ui.start():this.ui.browserIncompatible();return this},createDocument:function(a){a=new doc(this,a);this.docs.push(a);this.length++;this.currentDoc=a;this.ui.renderDocument(a);this.setCurrentDoc(a.setting.docID);return this},setCurrentDoc:function(a){this.currentDoc=this.getDocByID(a);this.ui.setCurrentDoc(a);this.brush.update();return this},deleteDocument:function(){for(var a=-1,b=0;b<this.length;b++)this.docs[b].setting.docID==this.currentDoc.setting.docID&&(a=b);this.docs.splice(a,1);this.length--;this.ui.eraseDocument(this.currentDoc.setting.docID);0<this.length?this.setCurrentDoc(this.docs[0].setting.docID):this.currentDoc=null},getDocByID:function(a){for(var b=0;b<this.length;b++)if(this.docs[b].setting.docID==a)return this.docs[b]},setCurrentTool:function(a){this.currentTool=a;getById("doc-container").className=a}};window.onload=function(){app=new cs;app.start()};