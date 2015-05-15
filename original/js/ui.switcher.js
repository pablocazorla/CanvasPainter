// SLIDER
var switcher = function(opt){
	return this.init(opt);
}
switcher.prototype = {
	init : function(opt){
		this.setting = extend({
			parent : null,
			id : null,
			startStatus : false,
			offTitle : 'No',
			onTitle : 'Yes',
			title : '',
			titleOver : null,
			startDisable : false,
			callback : function(){}
		},opt);
		
		this.classSwitcher = 'switcher';
		this.classStatus = '';
		this.st = this.setting.startStatus;

		this.enabled = true;		
		
		this.render();
		return this;
	},
	render : function(){		
		this.s = document.createElement('div');
		this.s.className = this.classSwitcher;

		if(this.setting.id != null) this.s.id = this.setting.id; 


		if(this.setting.title != ''){
			this.title = document.createElement('div');
			this.title.className = 'switcher-title';
			this.title.innerHTML = this.setting.title;
			this.classSwitcher += ' with-title';
			this.s.className = this.classSwitcher;
		}

		this.sContent = document.createElement('div');
		this.sContent.className = 'switcher-content';

		this.sContentKey = document.createElement('div');
		this.sContentKey.className = 'switcher-key';

		this.sContentNo = document.createElement('div');
		this.sContentNo.innerHTML = this.setting.offTitle;
		this.sContentNo.className = 'switcher-content-option no';

		this.sContentYes = document.createElement('div');
		this.sContentYes.innerHTML = this.setting.onTitle;
		this.sContentYes.className = 'switcher-content-option yes';

		this.setting.parent.appendChild(this.s);		
		if(this.setting.title != '') this.s.appendChild(this.title);
		this.s.appendChild(this.sContent);
		
		
		this.sContent.appendChild(this.sContentNo);
		this.sContent.appendChild(this.sContentYes);
		this.sContent.appendChild(this.sContentKey);

		if(this.setting.startDisable) this.toogleEnabled(false);
		if(this.setting.titleOver!=null){this.s.title = this.setting.titleOver}
		
		var self = this;
		this.sContent.addEventListener('click', function(){self.switchStatus();},false);		

	},	
	status : function(flag){
		if(flag != undefined){
			if((flag && !this.st)||(!flag && this.st)){
				this.switchStatus();
			}
			return this;
		}else{
			return this.st;
		}		
	},
	switchStatus : function(){
		if(this.enabled){
			this.classStatus = '';
			if(this.st){
				this.st = false;
			}else{
				this.classStatus = ' on';
				this.st = true;
			}
			this.s.className = this.classSwitcher + this.classStatus;
			this.setting.callback();
		}
		return this;
	},
	toogleEnabled : function(flag){
		if(flag && !this.enabled){
			this.enabled = true;
			this.s.className = this.classSwitcher + this.classStatus;
		}
		if(!flag && this.enabled){
			this.enabled = false;
			this.s.className = this.classSwitcher + this.classStatus + ' disable';
		}
		return this;
	}

}