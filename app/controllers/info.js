JMVC.controllers.info = function () {
	this.action_index = function () {
		JMVC.events.loadify(500);
		JMVC.require(
			'core/codeview/script'
			,'core/responsive/basic'
			,'vendors/google/analytics'
			,'core/sniffer'
			,'core/mobile'
			,'core/dim'
			,'core/css'
			,'vendors/github/forkme'
		);
		var main  = JMVC.getView('home/info'),
			readme = JMVC.getView('home/readme'),
			features = JMVC.getView('home/features'),
			doc_tpl = JMVC.getView('api/doctpl'),
			info_intro = JMVC.getView('home/info_intro'),
			infoutro = JMVC.getView('home/infoutro'),
			doc = JMVC.getModel('api/function'),
			backtotop = '<a href="#top">go to top &uparrow;</a>',
			ret='',
			toplinks = [],
			_toplinks = {
				intro : "Introduction",
				req : "Requirements",
				started : "Get started",
				howiw : "How it works",
				features : "Features",
				urlstruc : "Url structure",
				samples : "Samples",
				api : "Api",
				coredoc : "Core doc",
				extdoc : "Extension doc",
				testsuite : "Test suite",
				why : "Why"
			},
			h = '',
			f,
			k, k2, t,
			len, l2,
			tmp;

		for (t in _toplinks) {
			toplinks.push('<a href="#' + t + '" class="round4">' + _toplinks[t] + '</a>');
		}

		JMVC.head.addstyle(JMVC.vars.baseurl + '/media/css/info.css', true);// parsed

		//favicon
		JMVC.head.favicon("/media/favicon.ico");


		features.set({
			'fr' : '<b class="index">&#9758;</b>',
			'clearer' : '<br class="clearer" />',
			'backtotop' : backtotop
		});

		readme.set({
			'api': '{{infoutro}}',
			'githublink' : 'https://github.com/fedeghe/jmvc',
			'legend': '<b>*</b> : mandatory parameter',
			'backtotop' : backtotop,
			'toplinks' : toplinks.join(' ~ ')
		});
		info_intro.set({
			'review' : JMVC.vars.review,
			'version' : JMVC.vars.version,
			'last_modified' : JMVC.vars.last_modified,
			'gmt' : 'GMT+' + -(new Date().getTimezoneOffset() / 60),
			'backtotop' : backtotop
		});
		infoutro.set({
			'backtotop' : backtotop
		});

		main.parse().render(function(){

			JMVC.head.lastmodified();

			JMVC.responsive.onChange(
					function (w) {
						if (w < 960) {
							//JMVC.dom.addClass(JMVC.WD.body, 'mini');
							JMVC.responsive.allow('mobi')
						} else {
							//JMVC.dom.removeClass(JMVC.WD.body, 'mini');
							JMVC.responsive.allow('dskt')
						}
					}
				);


			JMVC.github.forkme('fedeghe');
			JMVC.mobile.topHide();
			JMVC.head.title('JMVC :: info');
		});
	};
};