JMVC.extend('scheduler', {
	create : function () {
		var scheduler = function (){
				this.events = {};
			},
			task = function (date, cb) {
				this.ev = null;
				this.type = null;
				this.cb = cb;
				this.date = date;
				this.uid = JMVC.util.uniqueid;
				this.active = true;
			};

		task.prototype = {
			init : function () {
				var self = this,
					now = new Date(),
					sets = {
						s : typeof self.date.s === 'number',
						i : typeof self.date.i === 'number',
						h : typeof self.date.h === 'number',
						d : typeof self.date.d === 'number',
						m : typeof self.date.m === 'number',
						y : typeof self.date.y === 'number',
						every : self.date.every
					},
					func = JMVC.util.isTypeOf(self.cb, 'function') ? self.cb : function () {alert('no function booked'); },
					millis_event_abs = 0,	// milliseconds of the new event from epoch
					millis_now_abs = 0,		// milliseconds of now from epoch
					millis_remaining = 0;	// time remaining in milliseconds
				
				self.type = sets.every ? 'Interval' : 'Timeout';

				now.setYear(sets.y ? self.date.y : now.getFullYear());
				now.setMonth(sets.m ? self.date.m /*-1*/ : now.getMonth());
				now.setDate(sets.d ? self.date.d : now.getDate());
				now.setHours(sets.h ? self.date.h : now.getHours());
				now.setMinutes(sets.i ? self.date.i : now.getMinutes());
				now.setSeconds(sets.s ? self.date.s : now.getSeconds());
				
				
				millis_event_abs = now.getTime();		// milliseconds of the new event from epoch
				millis_now_abs = new Date().getTime();	// milliseconds of now from epoch
				millis_remaining = millis_event_abs - millis_now_abs;// time remaining in milliseconds

				
				if (millis_remaining < 0) {
					JMVC.debug('ERROR: it seems futile to book an event in the past!');
					return false;
				}
				//JMVC.debug(sets.every);
				self.ev = sets.every ?
					window.setInterval(function () {self.active && func(new Date()); }, ~~(sets.every))
					:
					window.setTimeout(function () {self.active && func(new Date()); }, millis_remaining);
			},
			dismiss : function () {
				var self = this;
				try {
					window['clear' + this.type](self.ev);
				} catch(e){console.debug(e); }
			},
			del : function () {this.dismiss(); },
			enable : function () {this.active = 1; },
			disable : function () {this.active = 0; },
		};

		scheduler.prototype = {
			add : function (date, cb) {
				var e = new task(date, cb);
				if (e) {
					e.init();
					this.events[e.uid] = e;
					return e.uid;
				}
				return false;
			},
			del : function (id) {
				if (id in this.events) {
					this.events[id].dismiss();
					this.events[id] = null;
				}
			},
			delall : function () {
				var that = this,
					i;
				for (i in that.events) {
					this.events[i].dismiss();
					this.events[i] = null;
				}
			},
			resume : function () {
				for (var i in this.events) {
					this.events[i].enable();
				}
			},
			pause : function () {
				for (var i in this.events) {
					this.events[i].disable();
				}
			},
			list : function () {return this.events; },
			get : function (id) {return id in this.events ? this.events[id] : false; }
		};
		return new scheduler;
	}
});