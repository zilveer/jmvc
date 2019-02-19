JMVC.extend('gmap', {
	initialize: function (cback, options) {
		// append main gmaps script,
		// make public the callback
		JMVC.W.cb = cback;
		var params = {callback : 'cb', v : '3.exp', key : '$gmaps_key$'};

		//FFfix
		JMVC.head.addStyle(JMVC.vars.extensions + 'vendors/google/gmap/gmap.css');
		
		//extend options with those passed
		params = JMVC.object.extend(params, options);
		
		JMVC.head.addScript('https://maps.google.com/maps/api/js' + JMVC.object.toQs(params));
		
	},
	
	mapme : function (address, cback) {
		var r;
		if (JMVC.util.isArray(address)) {
			cback(new google.maps.LatLng(address[0], address[1]));
		} else {
			JMVC.W.geo = JMVC.W.geo || new  google.maps.Geocoder();
			geo.geocode({address : address}, function(result, status){
				r = (status == 'OK') ? result[0].geometry.location : false;
				cback(r);
			});
		}
	},
	
	marker : function (map, latLngArr, content) {

		var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latLngArr[0], latLngArr[1]),
				map: map
			});

		if (typeof content !== 'undefined') {	
			google.maps.event.addListener(marker, 'click', function () {	
				var infowindow = new google.maps.InfoWindow({content: content});
				infowindow.open(map, marker);
			});
		}
	},

	animator : function (map, points) {
		//array of {location, speed, duration, *zoom, streetView:{heading: , pitch: ,zoom: } }
		var i = 0,
			j = 0,
			latlngs=[],
			points_length = points.length,
			that = this,
			mapType = map.getMapTypeId(),
			panorama = map.getStreetView(),
			t;
		//
		//
		function handleMapType(t) {
			(t !== mapType) && map.setMapTypeId(t ? t : mapType);
		}
		
		function loop() {
			
			j = (i - 1 + points_length) % points_length;
			

			function do_loop() {
				i = (i + 1) % points_length;
				loop();
			}
			//
			function move_heading(duration) {
				var ii = 0,
					top = 100,
					pov,
					heading = null;

				while (ii < duration * 10) {

					(function (yy){
						t = JMVC.W.setTimeout(

							function () {
								
								pov = panorama.getPov();
								heading = pov.heading;
								panorama.setPov({
									'heading' : heading + 0.1,
									'pitch' : pov.pitch,
									'zoom' : pov.zoom
								});
							},				
							yy * 100
						);
					})(ii);

					ii += 1;
				}
				heading = 0;
				
			}
			//
			

			

			JMVC.W.setTimeout(function () {
				//
				JMVC.W.clearTimeout(t);
				panorama.setVisible(false);

				
				//
				if (!JMVC.util.isSet(points[i].location) && points[i].zoom) {
					handleMapType(points[i].mapTypeId);
					map.setZoom(points[i].zoom);
					do_loop();
				} else if (points[i].streetView) {

					that.mapme(points[i].location, function (r) {
						panorama.setPosition(r);
						panorama.setPov({
							heading : points[i].streetView.heading,
							pitch : points[i].streetView.pitch || 0,
							zoom : points[i].streetView.zoom || 1
						});
						panorama.setVisible(true);
						move_heading(points[i].duration);
						do_loop();
					});
				} else {
					that.mapme(points[i].location, function (r) {
						handleMapType(points[i].mapTypeId);
						map.panTo(r);
						if (points[i].zoom) {
							map.setZoom(points[i].zoom);
						}
						do_loop();
					});
				}
			}, points[j].duration * 1000);
			
		}


		loop();
	}
});