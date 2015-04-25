var hypercolor=function(a){return this.init(a)};hypercolor.prototype={init:function(a){return this.values={r:0,g:0,b:0,h:0,s:0,v:0,hex:"#000000"},this.color(a),this},color:function(a){return void 0!=a?("string"==typeof a?(a.indexOf("#")>-1&&this.hex(a),a.indexOf("rgb")>-1&&this.rgb(a),a.indexOf("hsv")>-1&&this.hsv(a)):(void 0!=a.r&&this.rgb(a),void 0!=a.h&&this.hsv(a)),this):this.values},merge:function(a){return this.values=extend(this.values,a),this},hex:function(a){return void 0!=a&&"string"==typeof a?(this.merge({hex:a}).merge(this.hexToRgb(a)).merge(this.hexToHsv(a)),this):this.values.hex},rgb:function(a){if(void 0!=a){if("string"==typeof a){var b=a.substring(4,a.length-1).split(",");a={r:parseInt(b[0]),g:parseInt(b[1]),b:parseInt(b[2])}}return this.merge({hex:this.rgbToHex(a)}).merge(this.rgbToHsv(a)).merge(a),this}return{r:this.values.r,g:this.values.g,b:this.values.b}},hsv:function(a){if(void 0!=a){if("string"==typeof a){var b=a.substring(4,a.length-1).split(",");a={h:parseFloat(b[0]),s:parseFloat(b[1]),v:parseFloat(b[2])}}return this.merge({hex:this.hsvToHex(a)}).merge(this.hsvToRgb(a)).merge(a),this}return{h:this.values.h,s:this.values.s,v:this.values.v}},r:function(a){return void 0!=a?(this.rgb({r:a,g:this.values.g,b:this.values.b}),this):this.values.r},g:function(a){return void 0!=a?(this.rgb({r:this.values.r,g:a,b:this.values.b}),this):this.values.g},b:function(a){return void 0!=a?(this.rgb({r:this.values.r,g:this.values.g,b:a}),this):this.values.b},h:function(a){return void 0!=a?(this.hsv({h:a,s:this.values.s,v:this.values.v}),this):this.values.h},s:function(a){return void 0!=a?(this.hsv({h:this.values.h,s:a,v:this.values.v}),this):this.values.s},v:function(a){return void 0!=a?(this.hsv({h:this.values.h,s:this.values.s,v:a}),this):this.values.v},rgbString:function(){return"rgb("+this.values.r+","+this.values.g+","+this.values.b+")"},rgbaHalfString:function(){return"rgba("+this.values.r+","+this.values.g+","+this.values.b+","},hexToRgb:function(a){var b=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;a=a.replace(b,function(a,b,c,d){return b+b+c+c+d+d});var c=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);return c?{r:parseInt(c[1],16),g:parseInt(c[2],16),b:parseInt(c[3],16)}:null},hexToHsv:function(a){return this.rgbToHsv(this.hexToRgb(a))},rgbToHex:function(a){var b=function(a){var b=a.toString(16);return 1==b.length?"0"+b:b},c=a.r,d=a.g,e=a.b;return"#"+b(c)+b(d)+b(e)},hsvToHex:function(a){return this.rgbToHex(this.hsvToRgb(a))},rgbToHsv:function(a){var b=a.r,c=a.g,d=a.b;b/=255,c/=255,d/=255;var g,h,e=Math.max(b,c,d),f=Math.min(b,c,d),i=e,j=e-f;if(h=0==e?0:j/e,e==f)g=0;else{switch(e){case b:g=(c-d)/j+(d>c?6:0);break;case c:g=(d-b)/j+2;break;case d:g=(b-c)/j+4}g/=6}return{h:g,s:h,v:i}},hsvToRgb:function(a){var e,f,g,b=parseFloat(a.h),c=parseFloat(a.s),d=parseFloat(a.v),h=Math.floor(6*b),i=6*b-h,j=d*(1-c),k=d*(1-i*c),l=d*(1-(1-i)*c);switch(h%6){case 0:e=d,f=l,g=j;break;case 1:e=k,f=d,g=j;break;case 2:e=j,f=d,g=l;break;case 3:e=j,f=k,g=d;break;case 4:e=l,f=j,g=d;break;case 5:e=d,f=j,g=k}return{r:Math.round(255*e),g:Math.round(255*f),b:Math.round(255*g)}}};