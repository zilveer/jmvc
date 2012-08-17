/* 
 JMVC Javascript module
Version: 0.5
Date : 15-06-2012
Copyright (c) 2008, Federico Ghedina <fedeghe@gmail.com>
All rights reserved.

This code is distributed under the terms of the BSD licence

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions
	and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of
	conditions and the following disclaimer in the documentation and/or other materials provided
	with the distribution.
* The names of the contributors to this file may not be used to endorse or promote products
	derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
(function (W) {
	//
	// this is due !!! :D 
	//
	'use strict';
	//
	var JMVC = window.JMVC = (
		function () {
			//	
			// returning object, will be JMVC
			var $jmvc,
				WD = W.document,
				WDL = WD.location,
				//
				jmvc_dev_url = WDL.protocol + '//www.jmvc.dev',
				jmvc_prod_url = WDL.protocol + '//www.jmvc.org',
				//
				// set here your crazy ones
				url_allowed_extensions = ['html', 'htm', 'jsp', 'php', 'js', 'jmvc', 'j', 'mvc', 'fg'],
				//
				jmvc_version = 1.6,
				jmvc_review = 1,
				//
				//
				// literal to contain url mvc components
				dispatched,
				prototipize,
				//
				// MVC objects constructors
				Controller,
				Model,
				View,
				//
				// for Observer
				Event,
				//
				// modules to load always, none
				Modules = [],
				//
				// hooks
				hooks = {},
				jmvc_default = {
					controller : 'index',
					action : 'index'
				},
				//
				// get initial time
				time_begin = new Date();
			//
			//
			//
			//
			// basic eval
			function jmvc_eval(r) {window.eval(r); }
			//
			// for basic dummy inheritance
			function jmvc_basic_inherit(Child, Parent) {Child.prototype = new Parent(); }
			//for models
			function jmvc_model_inherit(m){
				m.prototype.get = Model.prototype.get;
				m.prototype.set = Model.prototype.set;
				m.prototype.del = Model.prototype.del;
				m.prototype.vars = Model.prototype.vars;
				m.prototype.reset = Model.prototype.reset;
				m.prototype.constructor = Model.prototype.constructor;
			}
			//
			// for extending with modules
			function jmvc_extend(t, obj) {
				var i, trg = t.replace(/\//, '_');
				//var trg = arguments[0];		
				if (!$jmvc[trg]) {
					$jmvc[trg] = {};
				}
				//var arr_func_obj = arguments[1] || {};
				for (i in obj) {
					// $jmvc won`t let You override; do NOT check with hasOwnProperty
					// && typeof arr_func_obj[i] === 'function'
					if (typeof $jmvc[trg][i] === 'undefined') {
						$jmvc[trg][i] = obj[i];
					}
				}
				//maybe init, in case call it
				if (typeof $jmvc[trg].init === 'function') {
					$jmvc[trg].init();
					//$jmvc[trg].init.call($jmvc);
				}
			}
			//
			// ensure ucfirst controller name
			function jmvc_normalize(n) {
				return n.charAt(0).toUpperCase() + n.substr(1).toLowerCase();
			}
			////
			//
			// hook utility
			function jmvc_check_hook(hookname, param) {
				if (hooks[hookname]) {
					hooks[hookname].apply(null, param);
				}
			}
			//
			//
			//
			//
			// instance new view content or eval a model or controller
			function jmvc_get(path, type, name, params) {
				//
				var ret = false, o;
				if (type === 'view' && typeof $jmvc.views[name] === 'function') {
					ret = $jmvc.views[name];
				} else if (type === 'model' && typeof $jmvc.models[name] === 'function') {
					o = new $jmvc.models[name]();
					o.vars = {};
					ret = o;
				} else {
					$jmvc.io.get(
						path,
						function cback(res) {
							switch (type) {
							case 'view':
								$jmvc.views[name] = new View(res);
								ret =  $jmvc.views[name];
								break;
							case 'controller':
								res = res.replace(/^(\s*)\/\/(.*)[\n]/g, '/*$1*/\n');
								jmvc_eval(res);
								jmvc_basic_inherit($jmvc[type + 's'][name], Controller);
								break;
							case 'model':
								jmvc_eval(res);
								//jmvc_basic_inherit($jmvc[type + 's'][name], Model);
								jmvc_model_inherit($jmvc[type + 's'][name]);
								o = new $jmvc.models[name]();
								if (params) {
									$jmvc.models[name].apply(o, params);
								}
								o.vars = {};
								ret = o;
								break;
							}
						}
					);
				}
				return ret;
			}
			//
			//
			// type can be only 'view' or 'model'
			function jmvc_factory_method(type, name, params) {
				// using namespace ?
				var pieces = name.split('/'), path = false, path_absolute =  $jmvc.vars.baseurl + '/app/' + type + 's/';
				if (pieces.length > 1) {
					name = pieces.pop();
					path = pieces.join('/');
				}
				path_absolute += (path ? path + '/' : "") + name;
				//
				switch (type) {
				case 'view':
					path_absolute += '.html';
					break;
				case 'model':
				case 'controller':
					path_absolute += '.js';
					break;
				default:
					type = false;
					break;
				}
				//
				if (!type) {return false; }
				// ajax get script content and return it
				return jmvc_get(path_absolute, type, name, params);
			}
			//
			//
			//
			//
			//
			//
			// render function
			function jmvc_render(cback) {
				//
				var ctrl, i;
				// "import" the controller (eval ajax code)
				$jmvc.factory('controller', $jmvc.c);
				// if the constructor has been evalued correctly
				if ($jmvc.controllers[$jmvc.c]) {
					// grant basic ineritance from parent Controller
					jmvc_basic_inherit($jmvc.controllers[$jmvc.c], Controller);
					// make an instance
					ctrl = new $jmvc.controllers[$jmvc.c]();
					// store it
					$jmvc.controllers[$jmvc.c] = ctrl;
					// manage routes
					if (ctrl.jmvc_routes) {
						$jmvc.a = ctrl.jmvc_routes[$jmvc.a] || $jmvc.a;
					}
					// parameters are set to controller
					for (i in $jmvc.p) {
						if ($jmvc.p.hasOwnProperty(i)) {
							ctrl.set(i, decodeURI($jmvc.p[i]));
						}
					}
					// call action
					if (ctrl[$jmvc.a] && typeof ctrl[$jmvc.a] === 'function') {
						ctrl[$jmvc.a]();
					} else {
						if ($jmvc.a.toLowerCase() !== jmvc_default.action) {
							WDL.href = '/404/msg/act/' + $jmvc.a;
						}
					}
				} else {
					if ($jmvc.c.toLowerCase() !== jmvc_default.controller) {
						WDL.href = '/404/msg/cnt/' + $jmvc.c;
					}
				}
				if(cback && typeof cback == 'function'){
					cback.call($jmvc);
				}
			}
			//
			//
			//
			// this is the only external snippet embedded in $jmvc
			function jmvc_tpl(cont) {
				// MIT licence
				// based on the work of John Resig
				// thank you John
				// http://ejohn.org/blog/javascript-micro-templating/
				return (cont.match(/\<%/)) ?
						(function (str) {
							var fn = new Function('obj',
								"var p=[]; p.push('" +
								str.replace(/[\r\t\n]/g, " ")
								.split("<%").join("\t")
								.replace(/((^|%>)[^\t]*)'/g, "$1\r")
								.replace(/\t=(.*?)%>/g, "',$1,'")
								.split("\t").join("');")
								.split("%>").join("p.push('")
								.split("\r").join("\\'") + "');  return p.join('');"
								);
							return fn(str);
						})(cont) : cont;
			}
			//
			//
			// This function get a content and substitute jmvc.vars
			// and direct view placeholders like {{viewname .... }}
			// returns parsed content
			function jmvc_parse(content) {
				//
				jmvc_check_hook('onBeforeParse', [content]); // hook
				var cont = content, // the view content
					RX = {
						patt : "{{(.[^\\}]*)}}", // for hunting view placeholders
						pattpar : "\\s(.[A-z]*)=`(.[^/`]*)`", // for getting explicit params passed within view placeholders
						pattvar : "\\$(.[^\\$}]*)\\$", // for variables
						viewname : "^(.[A-z]*)\\s" // for getting only the viewname
					},
					res, // results of view hunt 
					//resvar, // variables found ##unused
					myview, // the view instance
					tmp1,
					tmp2, // two temporary variables for regexp results
					i = 0,
					j,
					//t,##unused
					k, // some loop counters
					limit = 100, // recursion limit for replacement
					viewname, // only the view name
					orig, // original content of {{}} stored for final replacement
					register, // to store inner variables found in the placeholder
					go_ahead = true; //flag
				//
				//
				while (i < limit) {
					i += 1;
					res = new RegExp(RX.patt, 'gm').exec(cont);
					if (res) {
						viewname = orig = res[1];
						register = false;
						//
						// got params within ?
						if (new RegExp(RX.pattpar, 'gm').test(res[1])) {
							// register becomes an object and flags result for later check
							register = {};
							//
							// get only the view name, ingoring parameters
							tmp2  = (new RegExp(RX.viewname)).exec(res[1]);
							viewname = tmp2[1];
							//
							tmp2 = res[1];
							while (go_ahead) {
								// this is exactly pattpar but if I use it does not work
								tmp1 = (new RegExp(RX.pattpar, 'gm')).exec(tmp2);
								//
								if (tmp1) {
									// add to temporary register
									register[tmp1[1]] = tmp1[2];
									tmp2 = tmp2.replace(' ' + tmp1[1] + '=`' + tmp1[2] + '`', "");
								} else {
									go_ahead = false;
								}
							}
						}
						// if not loaded give an alert
						if (!$jmvc.views[viewname]) {
							// here the view is requested but not explicitly loaded with the $jmvc.getView method.
							// You should use that method, and you'll do for sure if You mean to use View's variable
							// but if You just load a view as a simple chunk with {{myview}} placeholder inside another one
							// then $jmvc will load it automatically (take care to not loop, parsing stops after 100 replacements)
							/*
								alert('`'+viewname+'` view not loaded.\nUse Factory in the controller to get it. \n\njmvc will'+
									' load it for you but variables are\n lost and will not be replaced.');
							*/
							$jmvc.factory('view', viewname);
						}
						myview = $jmvc.views[viewname];
						//
						// in case there are some vars in placeholder
						// register will hold values obtained above
						// and we give'em to the view, the parse method
						// will do the rest
						if (register !== false) {
							for (k in register) {
								if (register.hasOwnProperty(k)) {
									myview.set(k, register[k]);
								}
							}
						}
						//
						// before view substitution,
						// look for variables, these have to be set with set method on view instance,
						// (and that cannot be done using {{viewname}} placeholder )
						while (true) {
							tmp1 = new RegExp(RX.pattvar, 'gm').exec(myview.content);
							if (tmp1) {
								myview.content = myview.content.replace('$' + tmp1[1] + '$', myview.get(tmp1[1]));
							} else {
								break;
							}
						}
						// now the whole view
						cont = cont.replace('{{' + orig + '}}', myview.content);
					} else {
						break;
					}
				}
				//
				// now $jmvc.vars parse
				for (j in $jmvc.vars) {
					if ($jmvc.vars.hasOwnProperty(j)) {
						cont = cont.replace(new RegExp("\\$" + j + "\\$", 'g'), $jmvc.vars[j]);
					}
				}
				//
				// use script on template function
				cont = jmvc_tpl(cont);
				//
				jmvc_check_hook('onAfterParse', [cont]);
				//
				return cont;
			}
			//
			//
			//
			//
			//
			//
			// setter unsetter $jmvc vars
			function jmvc_set(name, content) {
				$jmvc.vars[name] = content;
			}
			function jmvc_del(name) {
				if ($jmvc.vars[name]) {
					delete $jmvc.vars[name];
				}
			}
			// require
			function jmvc_require() {
				var i = 0,
					l = arguments.length;
				for (null; i < l; i += 1) {
					if (!$jmvc.extensions[arguments[i]]) {
						$jmvc.io.get(
							'/app/extensions/' + arguments[i] + '.js',
							function (jres) { jmvc_eval(jres); }
						);
						$jmvc.extensions[arguments[i]] = arguments[i];
					}
				}
			}
			//
			// hooking
			function jmvc_hook(obj, force) {
				var allowed = ['onBeforeRender', 'onAfterRender', 'onBeforeParse', 'onAfterParse'],
					f = 0;
				//
				for (f in obj) {
					if (obj.hasOwnProperty(f)) {
						try {
							if ($jmvc.util.inArray(allowed, f) > 0 || force) {
								hooks[f] = obj[f];
							} else {
								throw {
									message : 'EXCEPTION : You`re trying to hook unallowed function "' + f + '"'
								};
							}
						} catch (e) {
							alert(e.message);
						}
					}
				}
			}
			//
			// ninja
			function jmvc_debug() {
				try {
					console.log.apply(console, arguments);
				} catch (e1) {
					try {
						opera.postError.apply(opera, arguments);
					} catch (e2) {
						alert(Array.prototype.join.call(arguments, " "));
					}
				}
			}

			
			
			Event = function (sender) {
				this._sender = sender;
				this._listeners = [];
			};

			Event.prototype = {
				attach : function (listener) {
					this._listeners.push(listener);
				},
				notify : function (args) {
					for (var i = 0; i < this._listeners.length; i += 1) {
						this._listeners[i](this._sender, args);
					}
				}
			};
			
			//
			//
			//
			//
			//
			// ***********
			// CONTROLLER 
			// ***********
			// 
			// parent controller
			Controller = function () {};
			//
			// for storing url vars 
			Controller.prototype.vars = {};
			Controller.prototype.jmvc_routes = {};
			Controller.prototype.index = function () {
				alert('Default index action');
			};
			Controller.prototype.addRoutes = function (name, val){
				if(typeof name === 'string' ){
					this.jmvc_routes[name] = val;
				}
				if(typeof name === 'object' ){
					for(var j in name){this.addRoutes(j, name[j]); }
				}
			};
			Controller.prototype.relocate = function (uri, ms) {
				W.setTimeout(
					function () {
						WDL.href = String(uri);
					},
					~~(1 * ms) || 0
				);
			};
			Controller.prototype.render = function (content, cback) {
				var tmp_v = new View(content);
				tmp_v.render(typeof cback === 'function' ? {cback : cback} : null);
				return this;
			};
			Controller.prototype.reset = function () {
				this.vars = {};
				return this;
			};
			//
			//
			//
			// ******
			// MODEL
			// ******
			Model = function () {};
			Model.prototype.vars = {};
			Model.prototype.reset = function () {
				this.vars = {};
				return this;
			};
			Model.prototype.constructor = 'model';
			//
			//
			//
			// ********
			// * VIEW *
			// ********
			// 
			// directly instantiated assinging content
			View = function (cnt) {
				// original content
				this.ocontent = cnt || 'content';
				this.content = cnt || 'content';
				this.vars = {'baseurl' : $jmvc.vars.baseurl};
			};
			//
			//
			// meat to receive a model, all $name$
			// placeholders in the view content
			// will be replaced with the model
			// variable value if exists
			View.prototype.parse = function (obj) {
				var j;
				if (obj) {
					for (j in obj.vars) {
						if (obj.vars.hasOwnProperty(j)) {
							this.content = this.content.replace('$' + j + '$', obj.get(j));
						}
					}
				}
				// now jmvc parse vars
				for (j in $jmvc.vars) {
					if ($jmvc.vars.hasOwnProperty(j)) {
						this.content = this.content.replace('$' + j + '$', $jmvc.vars[j]);
					}
				}
				// allow chain
				return this;
			};
			//
			// reset content to orginal (unparsed) value
			// and reset all vars
			View.prototype.reset = function () {
				this.content = this.ocontent;
				this.vars = {};
				// allow chain
				return this;
			};
			//
			View.prototype.set_from_url = function (vname, alt) {
				this.set(String(vname), $jmvc.controllers[$jmvc.c].get(vname) || (alt || 'unset'));
				// allow chain
				return this;
			};
			//
			// render the view parsing for variable&view placeholders
			View.prototype.render = function (pars) {
				//call before render
				$jmvc.events.startrender();
				//
				var arg = pars || {},
					// maybe a callback is passed
					cback = arg.cback || false,
					// and maybe some args must be passed to the callback
					argz = arg.argz || null,
					//
					// You may specify a string with an id,
					// that's where the content will be loaded,
					// note that here dom is not loaded so you
					// cannot pass an element
					target = arg.target || false,
					// for binding this context in the callback
					that = this,
					// the view content
					cont = that.content,
					// for variables
					pattvar = new RegExp("\\$(.[^\\$}]*)\\$", 'gm'),
					// variables found
					resvar,
					// a loop temporary variable
					t;
				// parse for other views or $jmvc.vars
				cont = jmvc_parse(cont);
				//
				// look for / substitute  vars
				// in the view (these belongs to the view)
				while (true) {
					resvar = pattvar.exec(cont);
					if (resvar) {
						t = this.get(resvar[1]);
						cont = cont.replace('$' + resvar[1] + '$', t);
					} else {
						break;
					}
				}
				//
				that.content = cont;
				//
				// books rendering in body or elsewhere, on load
				$jmvc.events.bind(W, 'load', function () {
					//
					var trg = (typeof target === 'string' && WD.getElementById(target)) ? WD.getElementById(target) : WD.body;
					$jmvc.dom.html(trg, that.content);
					$jmvc.vars.rendertime = (new Date()).getTime() - time_begin.getTime();
					// may be a callback? 
					if (cback) {cback.apply(this, !!argz ? argz : []); }
					//trigger end of render
					$jmvc.events.endrender();
				});
				// allow chain
				return this;
			};
			//
			//
			//
			// getter, setter and "deleter" for mvc classes
			View.prototype.get = Model.prototype.get = Controller.prototype.get = function (n) {
				return (!!this.vars[n]) ? this.vars[n] : false;
			};
			View.prototype.set = Model.prototype.set = Controller.prototype.set = function (vname, vval, force) {
				var i;
				switch (typeof vname) {
				case 'string':
					if (!this.vars[vname] || force) {this.vars[vname] = vval; }
					break;
				case 'object':
					for (i in vname) {
						if (vname.hasOwnProperty(i) && (!this.vars[i] || vval || force)) {
							this.vars[i] = vname[i];
						}
					}
					break;
				}
				return this;
			};
			View.prototype.del = Model.prototype.del = Controller.prototype.del = function (n) {
				if (!!this.vars[n]) {delete this.vars[n]; }
			};
			
			
			
			prototipize = function(el, obj){
				for (var p in obj){
					el.prototype[p] = obj[p];
				}
			};
			
			//
			//
			//
			//
			//
			//			
			// Dispatch url getting controller, action and parameters
			//			
			dispatched = (function dispatch() {
				var	mid = {
						url : WDL.protocol + '//' + WDL.hostname + WDL.pathname + WDL.search,
						proto : WDL.protocol,
						host : WDL.hostname,
						path : WDL.pathname,
						hash : WDL.search
					},
					//url = mid,
					//
					// adjust extensions
					els = mid.path.replace(new RegExp('\\.' + url_allowed_extensions.join('|\\.'), 'gm'), "").substr(1).split('/'),
					controller = false,
					action = false,
					params = {},
					lab_val,
					ret,
					i,
					src,
					len = 0;
				//
				//
				//
				//
				if (WDL.hostname === 'localhost') {
					els.shift();
				}
				controller = els.shift() || jmvc_default.controller;
				action = els.shift() || jmvc_default.action;
				len = els.length;
				//
				// now if els has non zero size, these are extra path params
				for (i = 0; i + 1 < len; i += 2) {
					params[els[i]] = els[i + 1];
				}
				//
				// even hash for GET params
				if (mid.hash !== "") {
					// splitting an empty string give an array with one empty string
					els = mid.hash.substr(1).split('&');
					//
					for (i = 0, len = els.length; i < len; i += 1) {
						lab_val = els[i].split('=');
						// do not override extra path params
						if (!params[lab_val[0]]) {params[lab_val[0]] = lab_val[1]; }
					}
				}
				//
				//
				ret = {
					controller : controller.replace(/\//g, ""),
					action : action.replace(/\//g, ""),
					params : params,
					baseurl : WDL.protocol + '//' + WDL.hostname
				};
				
				ret.controller = jmvc_normalize(ret.controller);
				return ret;
			})();
			//
			//
			//
			//
			//
			//			
			// returnning literal
			//			
			$jmvc = {
				c : dispatched.controller || jmvc_default.controller,
				a : dispatched.action || jmvc_default.action,
				p : dispatched.params || {},
				controllers : {},
				models : {},
				views : {},
				vars : {
					baseurl:	dispatched.baseurl,
					devurl :	jmvc_dev_url,
					produrl :	jmvc_prod_url,
					version : jmvc_version,
					review :  jmvc_review,
					last_modified : WD.lastModified,
					rendertime : 0,
					retina : window.devicePixelRatio > 1
				},
				set :	jmvc_set,
				del : jmvc_del,
				require : jmvc_require,
				extensions : {},
				//garbage collector
				gc : function () {var i = 0; l = arguments.length; for (null; i < l; i += 1){arguments[i] = null; }},
				gco : function (o) {for (var p in o){if (o.hasOwnProperty(p)){o.p = null;}} o = null; },
				//
				hook : jmvc_hook,
				checkhook : jmvc_check_hook,
				//
				render:	jmvc_render,
				factory:	jmvc_factory_method,
				extend : jmvc_extend,
				modules : Modules,
				//
				prototipize : prototipize,
				Event : Event,
				//
				parse : jmvc_parse,
				//
				jeval : jmvc_eval,
				//
				debug : jmvc_debug,
				//
				getView : function (n) {return jmvc_factory_method('view', n); },
				getModel : function (n, params) {return jmvc_factory_method('model', n, params); },
				//getController :	function(n) {return jmvc_factory_method('controller', n); }
				//
				getNum : function(str){return parseInt(str,10);},
				getFloat : function(str){return parseFloat(str,10);}
			};
			//
			//
			// ok... spent some bytes to make it AMDfriendly...but is not the solution :D
			//if (typeof define === "function" && define.amd && define.amd.JMVC) {define("JMVC", [], function () {return $jmvc; });}
			//
			
			//
			// here we are $jmvc is DONE
			//
			//clean up
			
			$jmvc.gc(jmvc_dev_url,jmvc_prod_url,url_allowed_extensions,
					jmvc_version,jmvc_review,dispatched,prototipize,
					Controller,Model,View,Event,Modules,hooks,
					jmvc_default,time_begin);
			
			//
			//
			return $jmvc;
		}
	)(),i,l;
	//console.debug('JMVC');
	//
	//
	//
	//
	//
	//
	//
	//
	//
	// now enhanche JMVC with some basic utility functions;
	// big part of all these functions are necessary ...so do not try to move them in Modules
	//
	/******************
	 * #
	 * #  AJAX
	 * #
	 */
	JMVC.io = (function () {
		var getxhr,
			ajcall,
			post,
			get,
			getJson,
			getXML;
		getxhr = function () {
			var xhr,
				IEfuckIds = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'],
				i = 0,
				len = IEfuckIds.length;
			//
			try {
				xhr = new XMLHttpRequest();
			} catch (e1) {
				for (null; i < len; i += 1) {
					try {
						xhr = new ActiveXObject(IEfuckIds[i]);
					} catch (e2) {JMVC.debug('No way to initialize hxr'); }
				}
			}
			JMVC.gc(IEfuckIds,i,len);
			return xhr;
		};
		ajcall = function (uri, options) {
			var xhr = getxhr(),
				method = (options && options.method) || 'POST',
				cback = (options && options.cback),
				cb_opened = (options && options.opened) || function () {},
				cb_loading = (options && options.loading) || function () {},
				cb_error = (options && options.error) || function(){},
				cb_abort = (options && options.error) || function(){},
				sync = (options && options.sync),
				data = (options && options.data) || {},
				type = (options && options.type),
				cache = (options && options.cache !== undefined) ? options.cache : true,
				targetType = (type === 'xml') ?  'responseXML' : 'responseText',
				timeout = (options && options.timeout) || 3000,
				complete = false,
				ret = false,
				state = false;
			//
			//prepare data, caring of cache
			if (!cache) {data.C = JMVC.util.now(); }
			data = JMVC.util.obj2qs(data).substr(1);
			//
			xhr.onreadystatechange = function () {
				
				if(state == xhr.readyState){return false;}
				state = xhr.readyState;
				//JMVC.debug('called '+uri + ' ('+xhr.readyState+')');
				if (xhr.readyState === "complete" || (xhr.readyState === 4 && xhr.status === 200)) {
					complete = true;
					if (cback) {cback((targetType==='responseXML') ?  xhr[targetType].childNodes[0] : xhr[targetType]); }
					ret = xhr[targetType];
					delete xhr['onreadystatechange'];
					
				//	JMVC.debug('out '+uri);
					//window.setTimeout(function(){xhr=null;},50);
					//JMVC.gc(method,cback,cb_opened,cb_loading,cb_error,sync,data,type,cache,targetType,timeout,complete);
					JMVC.gco(xhr);
					return ret;
				} else if (xhr.readyState === 3) {
					cb_loading();
				} else if (xhr.readyState === 2) {
					cb_opened();
				} else if (xhr.readyState === 1) {
					//JMVC.debug('onecall '+ uri);
					switch (method) {
					case 'POST':
						try {
							xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//							if (xhr.overrideMimeType) {xhr.setRequestHeader("Connection", "close");} //Refused to set unsafe header "Connection" on chrome
							xhr.send(data || true);
						} catch (e1) {}
						break;
					case 'GET':
						try {
							switch (type) {
							case 'xml':
								if (xhr.overrriveMimeType) {xhr.overridemimetype('text/xml'); }
								break;
							case 'json':
								xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
								break;
							}
							xhr.send(null);
						} catch (e2) {}
						break;
					}
				}
			};
			//
			xhr.onerror = function () {if (cb_error) {cb_error.apply(null, arguments); } };
			xhr.onabort = function () {if (cb_abort) {cb_abort.apply(null, arguments); } };
			//
			//open request
			xhr.open(method, (method === 'GET') ? (uri + ((data) ? '?' + data : "")) : uri, sync);
			//
			W.setTimeout(function () {if (!complete) {xhr.abort(); } }, timeout);
			//
			try {
				return(targetType==='responseXML') ?  xhr[targetType].childNodes[0] : xhr[targetType];
			} catch (e3) {}
			return false;
		};
		//
		post = function (uri, cback, sync, data, cache) {
			return ajcall(uri, {cback : cback, method : 'POST', sync : sync, data : data, cache : cache});
		};
		//
		get = function (uri, cback, sync, data, cache) {
			return ajcall(uri, {cback : cback, method : 'GET', sync : sync, data : data, cache : cache});
		};
		getJson = function (uri, cback, data) {
			var r = ajcall(uri, {type : 'json', sync : false, cback : cback, data : data});
			return (W.JSON && W.JSON.parse) ? JSON.parse(r) : JMVC.jeval('(' + r + ')');
		};
		getXML = function (uri, cback) {
			return ajcall(uri, {method : 'GET', sync : false, type : 'xml', cback : cback || function(){}});
		};
		//
		return {
			get : get,
			post : post,
			getXML : getXML,
			getJson : getJson
		};
	})();
	//
	//
	//
	//
	//
	/******************
	 * #
	 * #  some utility functions
	 * #
	 */
	JMVC.util = {
		isSet : function (e) {
			return typeof e !== 'undefined';
		},
		defined : function (e) {
			return typeof e !== 'undefined';
		},
		inArray : function (arr, myvar) {
			var res = -1,
				i = 0,
				len = arr.length;
			for (null; i < len; i += 1) {
				if (myvar === arr[i]) {
					res = i;
					break;
				}
			}
			return res;
		},
		in_object : function(obj ,field){
			return (typeof obj==='object' && obj[field]);
		},
		isArray : function (o) {
			return Object.prototype.toString.call(o) === '[object Array]';
		},
		isTypeOf : function (el, type) {
			return typeof el === type;
		},
		getType : function (el) {
			return typeof el;
		},
		padme : function (val, el, pos, lngt) {
			var len = lngt || 2;
			while ((String(val)).length < len) {
				switch (pos) {
				case 'pre':
					val = String(el + val);
					break;
				case 'post':
					val = String(val + el);
					break;
				}
			}
			return val;
		},
		rand : function (min, max) {
			return min +  ~~(Math.random() * (max - min + 1));
		},
		
		
		
		replaceall : function (tpl, o, pre, post) {
			var Op = pre || '%',
				pO = post || '%',
				reg = new RegExp(Op + '([A-z]*)' + pO, 'g'),
				str;
			return tpl.replace(reg, function (str, $1) {
				return o[$1];
			});
		},
		obj2attr : function (o) {
			var ret = '',
				i;
			for (i in o) {
				if (o.hasOwnProperty(i)) {
					ret += ' ' + i + '"' + o[i] + '"';
				}
			}
			return ret;
		},
		obj2qs : function (o) {
			var ret = '',
				i;
			for (i in o) {
				if (o.hasOwnProperty(i)) {
					ret += String((ret ? '&' : '?') + i + '=' + encodeURI(o[i]));
				}
			}
			return ret;
		},
		rad2deg : function (r) {
			return 180 * r / Math.PI;
		},
		deg2rad : function (d) {
			return Math.PI * d / 180;
		},
		//funzione di iterazione
		each : function (that, fn) {
			var i = 0,
				len = that.length;
			for (null; i < len; i += 1) {
				if (that[i]) {
					that[i] = fn.call(that, that[i]);
				}
			}
			return that;
		},
		reload : function () {
			var n = document.location.href;
			document.location.href = n;//do not cause wierd alert
		},
		now : function () {
			return (new Date()).getTime();
		},
		json2css : function (json) {
			var out = '',
				i;
			for (i in json) {
				if (json.hasOwnProperty(i)) {
					out += i + '{' + json[i] + '}' + "\n";
				}
			}
			return out;
		},
		array_clone : function (arr) {
			return arr.slice(0);
		},
		range : function(start, end){
			var ret = [];
			while (end - start + 1) {
				ret.push((start += 1) -1 ); 
			}
			return ret;
		}

		
	};
	//
	//
	//
	//
	//
	//
	/******************
	 * #
	 * #  Basic dom functions
	 * #
	 */
	JMVC.dom = {
		body : function () {
			return document.body;
		},
		append : function (where, what) {
			where.appendChild(what);
		},
		addClass : function (el, addingClass) {
			var now = this.attr(el, 'class'),
				spacer = (now !== '') ? ' ' : "";
			this.attr(el, 'class', now + spacer + addingClass);
		},
		//legge e scrive attributi
		attr : function (elem, name, value) {
			//
			if (elem.nodeType === 3 || elem.nodeType === 8) {return 'undefined'; }
			//
			// Make sure that avalid name was provided 
			if (!name || name.constructor !== String) {return ""; }
			// Figure out if the name is one of the weird naming cases 
			//name = {'for': 'htmlFor', 'class': 'className'}[name] || name; 
			//
			// If the user is setting a value, also 
			if (typeof value !== 'undefined') {
				// Set the quick way first 
				//
				elem[{'for': 'htmlFor', 'class': 'className'}[name] || name] = value;
				// If we can, use setAttribute 
				//
				if (elem.setAttribute) {
					elem.setAttribute(name, value);
				}
			}
			// Return the value of the attribute
			if (typeof value === 'undefined') {
				return elem[name] || elem.getAttribute(name) || "";
			} else {
				return elem;
			}
		},
		//prepend : function(where, what){var f = this;},
		create : function (tag, attrs, inner) {
			if (!tag) {alert('no tag'); return; }
			var node = document.createElement(tag),
				att;
			attrs = attrs || {};
			for (att in attrs) {
				if (attrs.hasOwnProperty(att)) {
					node.setAttribute(String(att),  String(attrs[att]));
				}
			}
			if (typeof inner !== 'undefined') {
				this.html(node, inner);
			}
			return node;
		},
		/* create and append */
		add : function (where, tag, attrs, inner) {
			var n = this.create(tag, attrs, inner);
			this.append(where, n);
			return n;
		},
		html : function (el, html) {
			if (!el) {return this; }
			var t = "";
			//alert(el);
			if (typeof html !== 'undefined') {
				if (el) {
					try {
						el.innerHTML = String(html);
					} catch (e) {}
				}
				return this;
			} else {
				t = (el.nodeType === 1) ? el.innerHTML : el;
			}
			return t.trim();
		},
		find : function (sel) {
			return document.getElementById(sel);
		},
		//ha un attributo?
		hasAttribute : function (el, name) {
			return el.getAttribute(name) !== null;
		},
		hasClass : function (el, classname) {
			return el.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
		},
		insertBefore : function (node, referenceNode) {
			var p = referenceNode.parentNode;
			p.insertBefore(node, referenceNode);
			return node;
		},
		insertAfter : function (node, referenceNode) {
			var p = referenceNode.parentNode;
			p.insertBefore(node, referenceNode.nextSibling);
			return node;
		},
		nthchild : function (node, num, types) {
			var childs = node.childNodes,
				// filtered	
				tagChilds = [],
				// original length
				len = childs.length,
				// a counter
				i = 0,
				// elements filtered, default keeps only Element Node
				type2consider = types || ['TEXT_NODE'];
				// clean text ones
			while (len) {
				if (JMVC.util.inArray(type2consider, this.nodeTypeString(childs[i]))) {
					tagChilds.push(childs[i]);
					i += 1;
				}
				len -= 1;
			}
			len = tagChilds.length;
			//
			return (num < len) ? tagChilds[num] : false;
		},
		nodeTypeString : function (node) {
			var types = ['ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE'];
			return types[node.nodeType - 1];
		},
		preloadImage : function (src) {
			var i = new Image();
			i.src = src;
			return i;
		},
		parent : function (node) {
			return node.parentNode;
		},
		prepend : function (where, what) {
			var c = where.childNodes[0];
			where.insertBefore(what, c);
			return what;
		},
		remove : function (el) {
			var parent = el.parentNode;
			parent.removeChild(el);
			return parent;
		},
		removeAttribute : function (el, valore) {
			el.removeAttribute(valore);
			return el;
		},
		removeClass : function (el, cls) {
			if (this.hasClass(el, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				el.className = el.className.replace(reg, ' ');
			}
			return this;
		},
		switchClass : function (el, oldclass, newclass) {
			if (this.hasClass(el, oldclass)) {
				this.removeClass(el, oldclass);
			}
			if (!this.hasClass(el, newclass)) {
				this.addClass(el, newclass);
			}
			return el;
		}
	};
	//
	//
	//
	//
	//
	/******************
	 * #
	 * #  Basic event functions
	 * #
	 */
	JMVC.events = {
		bindings : {},
		onedone : false,
		Estart : [],
		Eend : [],
		bind : function (el, tipo, fun) {
			if (W.addEventListener) {
				el.addEventListener(tipo, fun, false);
			} else if (W.attachEvent) {
				var f = function () {fun.call(el, W.event); };
				el.attachEvent('on' + tipo, f);
			} else {
				el['on' + tipo] = function () {fun.call(el, W.event); };
			}
			if (!this.bindings[el]) {this.bindings[el] = {}; }
			this.bindings[el][tipo] = fun;
		},
		unbind : function (el, tipo) {
			if (el === null) {return; }
			if (el.removeEventListener) {
				el.removeEventListener(tipo, this.bindings[el][tipo], false);
			} else if (el.detachEvent) {
				el.detachEvent("on" + tipo, this.bindings[el][tipo]);
			}
			delete this.bindings[el][tipo];
		},
		one : function (what, type, fn) {
			var newf = function () {
				if (!this.onedone) {fn(); }
				this.onedone = true;
			};
			this.bind(what, type, newf);
		},
		ready : function (func) {
			return this.bind(W, 'load', func);
		},
		preventDefault : function(e){
			if (e.preventDefault){
				e.preventDefault();
			} else{
				e.returnValue = false;
			}
		},
		eventTarget : function (e) {
			var targetElement = (typeof e.target !== "undefined") ? e.target : e.srcElement; 
			while (targetElement.nodeType == 3 && targetElement.parentNode != null){
				targetElement = targetElement.parentNode;
			}
			return targetElement; 
		},
		start : function (f) {
			this.Estart.push(f);
		},
		end : function (f) {
			this.Eend.push(f);
		},
		startrender : function () {
			var i = 0,
				l = this.Estart.length;
			for (null; i < l; i += 1) {
				this.Estart[i]();
			}
		},
		endrender : function () {
			var i = 0,
				l = this.Eend.length;
			for (null; i < l; i += 1) {
				this.Eend[i]();
			}
		},
		delay : function (f, t) {
			window.setTimeout(f, t);
		},
		loadify : function (ms) {
			JMVC.events.start(function () {
				//otherwise some browser hangs (opera)
				JMVC.events.delay(function(){
					document.body.style.opacity = 0;
					document.body.style.filter = 'alpha(opacity=0)';
				}, 0);
			});
			JMVC.events.end(function () {
				var i = 0,
					step = 0.05,
					top = 1;
				while (i <= 1) {
					window.setTimeout(function (j) {
						document.body.style.opacity = j;
						document.body.style.filter = 'alpha(opacity=' + (j*100) + ')';
					}, ms * i, i + step);
					i += step;
				}
			});
		}
	};
	//
	//
	//
	//
	//
	//
	/******************
	 * #
	 * #  Basic functions fuseful for head section
	 * #
	 */
	JMVC.head = {
		addscript: function (src, parse, explicit) {
			//
			var script,
				head,
				tmp,
				that = this,
				postmode = true,
				async = true,
				script_content;
			if (parse) {
				if (explicit) {
					//script_content = JMVC.parse(src/* in this case is mean to be the content */);
					script_content = JMVC.parse(src, true);
					script = JMVC.dom.create('script', {type : 'text/javascript'}, script_content);
					head = that.element;
					head.appendChild(script);
				} else {
					/* get css content, async */
					tmp = JMVC.io.get(src, function (script_content) {
						script_content = JMVC.parse(script_content, true);
						script = JMVC.dom.create('script', {type : 'text/javascript'}, script_content);
						head = that.element;
						head.appendChild(script);
					}, postmode, async);
				}
			} else {
				script = (explicit) ? JMVC.dom.create('script', {type : 'text/javascript'}, src) : JMVC.dom.create('script', {type : 'text/javascript', src : src}, ' ');
				head = this.element;
				head.appendChild(script);
			}
		},
		addstyle : function (src, parse, explicit) {
			var style,
				head,
				tmp,
				that = this,
				postmode = true,
				sync = false,
				rules,
				csscontent;
			if (parse) {
				if (explicit) {
					/* in this case src is meant to be the content */
					csscontent = JMVC.parse(src, true);
					//
					head = that.element;
					style = document.createElement('style');
					rules = document.createTextNode(String(csscontent));
					//
					style.type = 'text/css';
					if (style.styleSheet) {
						style.styleSheet.cssText = rules.nodeValue;
					} else {
						style.appendChild(rules);
					}
					head.appendChild(style);
				} else {
					/* get css content, async */
					tmp = JMVC.io.get(src, function (csscontent) {
						csscontent = JMVC.parse(csscontent, true);
						head = that.element;
						style = document.createElement('style');
						rules = document.createTextNode(String(csscontent));
						//
						style.type = 'text/css';
						if (style.styleSheet) {
							style.styleSheet.cssText = rules.nodeValue;
						} else {
							style.appendChild(rules);
						}
						head.appendChild(style);
						//
					}, postmode, sync);
				}
			} else {
				style = JMVC.dom.create('link', {type : 'text/css', rel : 'stylesheet', href : src});
				head = this.element;
				head.appendChild(style);
			}
		},
		//
		title : function (t) {
			if (!t) {return document.title; }
			document.title = t;
			return true;
		},
		//
		meta : function (name, value) {
			//get last meta if exists
			var meta = this.element.getElementsByTagName('meta'),
				newmeta = JMVC.dom.create('meta', {name : name, content : value}),
				len = meta.length;
			if (len) {
				JMVC.dom.insertAfter(newmeta, meta.item(len - 1));
			} else {
				this.element.appendChild(newmeta);
			}
		},
		//
		element : document.getElementsByTagName('head').item(0)
	};
	//
	//
	//
	//
	//
	//
	// before rendering, load requested extensions (must be set in the
	// Modules var and the file must be in the extensions folder)
	if (JMVC.modules.length > 0) {
		i = 0;
		l = JMVC.modules.length;
		for (null; i < l; i += 1) {
			JMVC.io.get(
				'/app/extensions/' + JMVC.modules[i] + '.js',
				function (res) {
					JMVC.jeval(res);
				}
			);
		}
	}
	//
	//
	//
	//	 
	//	EXPOSE ?
	//	by default JMVC is not exposed but could be useful
	//	to use it from console or elsewhere
	//	use exp=true in querystring to expose
	//	or remove comment from the next line
	//
	//	W.JMVC = JMVC;
	//
	//	###  hooray ... RENDER 
	JMVC.render();
	
})(this);
