JMVC.controllers.modal = function() {

	this.index = function(){

		JMVC.require('widget/modal/modal', 'event_scroll','test');

		JMVC.events.loadify(1000);

		this.render(false,function test(){
			"use strict";

			JMVC.test.initialize(true);

			JMVC.test.startAll();
			
			JMVC.test.describe(JMVC.util.str_repeat('<br />', 20) + '<input type="button" id="openmodal" value="Open modal" style="cursor:pointer" />' + JMVC.util.str_repeat('<br />', 40));
			//JMVC.test.describe('<input type="button" id="openmodal" value="Open modal" style="cursor:pointer" />');

			JMVC.events.bind(JMVC.dom.find('#openmodal'), 'click', function () {
				var t = JMVC.dom.create('span', {}, 'Here is some content');
				JMVC.modal.open(t, 'Titolo del modal', 200, 80, {bgcolor:'#777', shadow : true});
			});

			JMVC.test.finishAll();
		});
	}
};
