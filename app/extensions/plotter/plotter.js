JMVC.extend('plotter', {
	
	letter : function (letter, top, left, character) {
		
		var mod,
			that = this;
			
		this.arr = [];
		this['char'] = character || '&bull;';
		this.left = left;
		this.top = top;
		
		mod = {
			adddot : function (x, y) {that.arr.push([x, y]); },
			addarc : function (centerx, centery, radiusx, radiusy, radstep, radfrom, howmany, rad) {
				var i = 0,
					x,
					y,
					iarr = [],
					l;
				while (howmany) {
					x = radiusx * Math.cos(radfrom + i * radstep);
					y = radiusy * Math.sin(radfrom + i * radstep);
					i += 1;
					iarr.push([x, y]);
					howmany -= 1;
				}

				if (rad) {
					JMVC.each(iarr, function (elem ,indx) {
						x = elem[0];
						y = elem[1];
						elem[0] = x * Math.cos(rad) - y * Math.sin(rad);
						elem[1] = x * Math.sin(rad) + y * Math.cos(rad);
					});
				}
				JMVC.each(iarr, function (elem, indx) {
					elem[0] = elem[0] + centerx;
					elem[1] = elem[1] + centery;
				});
				that.arr = that.arr.concat(iarr);
			},
			beizer : function (x1, y1,  x2, y2,  x3, y3,  x4, y4,  hm) {
				var B1 = function (t) {return t * t * t; },
					B2 = function (t) {return 3 * t * t * (1 - t); },
					B3 = function (t) {return 3 * t * (1 - t) * (1 - t); },
					B4 = function (t) {return (1 - t) * (1 - t) * (1 - t); },
					percent = 0,
					step = 1 / (hm || 10);
				
				for (null; percent <= 1; percent += step) {
					that.arr.push([
						x1 * B1(percent) + x2 * B2(percent) + x3 * B3(percent) + x4 * B4(percent),
						y1 * B1(percent) + y2 * B2(percent) + y3 * B3(percent) + y4 * B4(percent)
					]);
				}
			},
			addline : function (x1, y1, x2, y2, howmany) {
				var hm = howmany + 1,
					distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)),
					tx = (x2 - x1) / hm,
					ty = (y2 - y1) / hm,
					i = 1;
				that.arr.push([x1, y1]);
				while (howmany) {
					that.arr.push([x1 + tx * i, y1 + ty * i]);
					i += 1;
					howmany -= 1;
				}
				that.arr.push([x2, y2]);
			},
			plot : function (node, positions, character, top, left) {
				//JMVC.each(positions, function (el, i) {
				for (var i = 0, l = positions.length; i < l; i ++) {
					JMVC.gra.plotarr(node, positions[i], i, character, top, left);
				}
				//});
			},
			plotarr : function (node, positions, letter, character, top, left, scale) {
				var i = 0,
					l = positions.length,
					tmp;
				typeof scale == 'undefined' && (scale = 1);
				
				//JMVC.each(positions, function (el) {
				for (null; i < l; i++) {
					tmp = JMVC.dom.create('span', {
							'class' : 'point ' + letter,
							'style' : JMVC.string.replaceall(
								'top:%top%px;left:%left%px',
								{
									top : ~~ (positions[i][0] + top) * scale,
									left : ~~(positions[i][1] + left) * scale
								}
							)
						}, character);
					JMVC.dom.append(node, tmp);
				}
				//});
			},
			rotate : function (rad) {
				var x, y;

				JMVC.each(that.arr, function (el ,i) {
					x = el[0];
					y = el[1];
					el[0] = x * Math.cos(rad) - y * Math.sin(rad);
					el[1] = x * Math.sin(rad) + y * Math.cos(rad);
				});
			},
			clone : function (inst) {
				that.arr = Array.prototype.slice.call(inst.arr, 0);
			}
		};
		this.dot = function (x, y) {mod.adddot(x, y); };
		this.arc = function (cx, cy, rx, ry, rstep, rfrom, hm, rad) {mod.addarc(cx, cy, rx, ry, rstep, rfrom, hm, rad); };
		this.beizer = function (x1,y1, x2,y2, x3,y3, x4,y4, points) {mod.beizer(x1, y1, x2, y2, x3, y3, x4, y4, points); };
		this.line = function (x1, y1, x2, y2, p) {mod.addline(x1, y1, x2, y2, p); };
		this.plot = function (node ,scale) {mod.plotarr(node, this.arr, letter, this['char'], this.top, this.left, scale); };
		this.rotate = function (rad) {mod.rotate(rad); };
		this.clone = function (inst) {mod.clone(inst); };
		this.setChar = function (c) {this['char'] = c; };
	}
});
