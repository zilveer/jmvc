JMVC.head.addstyle(JMVC.vars.baseurl + '/app/extensions/widget/snow/snow.css', true);

JMVC.require('core/css');

//
JMVC.extend('snow', {
	'vars' : {
		flakes : [],
		l : 0,
		trg : null
	},
	'init' : function () {
		
		
		
	},
	
	'start' : function (trg, opts) {
		
		
		JMVC.snow.vars.trg = JMVC.dom.find(trg);
		JMVC.css.style(JMVC.snow.vars.trg, 'position', 'relative');
		JMVC.snow.vars.l = opts && opts.length || 100;
		
		var bodysize = JMVC.dim.bodySize();
		
		
		function Flake () {
			var left = JMVC.util.rand(0, bodysize[0]-20),
				top = JMVC.util.rand(0, bodysize[1]-20);
			this.s = JMVC.util.rand(5,40);
			this.node = JMVC.dom.create('span', {'class':'flake', 'style':'line-height:'+this.s+'px;height:'+this.s+'px;font-size:'+this.s+'px;top:'+top+'px;left:'+left+'px;'}, '&bull;');
			this.amplitude = JMVC.util.rand(1, 3) *0.5;
			this.speed = 0.5 + Math.random();
			
			this.length = JMVC.util.rand(10, 20);
			this.cursor = 0;
		}
		
		
		
		
		function getFlake() {
			//var s = JMVC.util.rand(5,40),
			//	f = JMVC.dom.create('span', {'class':'flake', 'style':'line-height:'+s+'px;height:'+s+'px;font-size:'+s+'px;left:'+JMVC.util.rand(0,bodysize[0]-20)+'px'}, '&bull;');
			
			var f = new Flake();
			
			
			JMVC.snow.vars.flakes.push(f);
			JMVC.dom.append(JMVC.snow.vars.trg, f.node);
		}
		
		
		
		
		function loop() {
			var newr = [];
			for(var i = 0, l = JMVC.snow.vars.flakes.length; i < l; i += 1) {
				var r = move(JMVC.snow.vars.flakes[i]);
				if (r) {
					newr.push(JMVC.snow.vars.flakes[i]);
				}
				
			}
			JMVC.snow.vars.flakes = newr;
		}
		function move(e) {
			var el = e.node,
				top = JMVC.num.getFloat(JMVC.css.style(el, 'top')),
				left = JMVC.num.getFloat(JMVC.css.style(el ,'left'));
			
			if(top > bodysize[1]-60){
				top = 0;
				//JMVC.dom.remove(el);
				//return false;
			}
			
			left = left + e.amplitude * Math.sin(top/e.length);
			
			if(left > bodysize[0] -60){
				e.node.style.display = 'none';
			} else {
				e.node.style.display = 'block';
			} 
			
		   
		    // JMVC.debug(JMVC.dom.parent(el));
			//console.debug(top, left);
			JMVC.css.style(el,{'top': (top + e.speed)+'px', 'left': left+ 'px'});
			
			return true;
		}
		
		
		
		for(var i = 0; i < JMVC.snow.vars.l; i += 1){
			getFlake();
		}
		window.setInterval(function(){loop();}, 10);
		
	}
});

