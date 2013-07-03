JMVC.controllers.tabs = function () {
	this.one = function () {
		JMVC.require('responsive/basic','tabs', 'sniffer');

		var index = JMVC.getView('index'),
			tab = new JMVC.tabs.tab('v'),
			tab2 = new JMVC.tabs.tab('v'),
			ids;

		JMVC.responsive.onChange(
			function (w) {
				if (w < 800) {
					//JMVC.dom.addClass(JMVC.WD.body, 'mini');
					JMVC.responsive.allow('mobi')
				} else {
					//JMVC.dom.removeClass(JMVC.WD.body, 'mini');
					JMVC.responsive.allow('dskt')
				} 

			}
		);
		

		index.set_from_url('i_say', 'No one');
		//
		tab.add('Basic', 'Contenuto di prova1<br/><br/><br/><br/><br/><br/>kk');
		tab.add('Logo', '<iframe width="100%" height="300px" frameborder="0" src="' + JMVC.vars.baseurl + '/test/logo"></iframe> ');
		tab.add('view', '{{sv goal=`mygoal`}}<br/><br/><br/>');
		 //
		tab2.add('Direct2', 'Contenuto di prova2');
		tab2.add('Param view', '{{sv goal=`mygoal`}}');
		tab2.add('Prova Flag', '<iframe width="100%" height="600px" frameborder="0" src="' + JMVC.vars.baseurl + '/test/flag"></iframe> ');
		//
		index.render({cback : function () {
			ids = tab.render('cent', 'ciccio');
			JMVC.dom.add(JMVC.dom.find('#cent'), 'br', {'style' : 'line-height:30px'});
			tab2.render(ids[2], 'ciccio2');
			
		}});
	};
}