		
JMVC.controllers.implement = function() {

	this.action_index = function(){
				
		this.render(false,function test(){
			"use strict";
			
			JMVC.test.initialize(true);
			JMVC.test.startAll();
			JMVC.test.message('<strong>really dummy tests</strong>');

			
			function Person(n){this.name = n; }
			Person.prototype.talk = function(){alert(this.name + ' says `foo`'); }
			Person.prototype.wc = function(){alert('my name is ' + this.name.length + ' char long'); }
			Person.prototype.eat = function(){alert(this.name + ' eats `foo`'); }


			JMVC.test.code('function Person(n) {\n'+
				'		this.name = n;\n' + 
				'	};\n'+
				'	Person.prototype.talk = function(){\n'+
				'		alert(this.name + \' says `foo`\');\n'+
				'	}\n'+
				'	Person.prototype.wc = function(){\n'+
				'		alert(\'my name is \' + this.name.length + \' char long\');\n'+
				'	}\n'+
				'	Person.prototype.eat = function(){\n'+
				'		alert(this.name + \' eats `foo`\');\n'+
				'	}\n'
			);
			
			JMVC.test.testValue(
				'Person implement ["talk", "wc, "eat"]',
				function () {return JMVC.implement(Person, ['talk', 'wc', 'eat']);},
				true
			);
			JMVC.test.testValue(
				'Person do not implement ["walk", "wc, "eat"]',
				function () {return JMVC.implement(Person, ['walk', 'wc', 'eat']);},
				false
			);


			JMVC.test.describe('Check it using a JMVC.Interface instance');
			JMVC.test.code('var interfacePASS = new JMVC.interface(["talk", "eat"]),\n'+
				'interfaceFAIL = new JMVC.interface(["foo", "nope"]);\n' + 
				'//now check\n' +
				'interfacePASS.check(Person);\n'+
				'interfaceFAIL.check(Person);\n'
			);
			var interfacePASS = new JMVC.Interface(['talk', 'eat']),
				interfaceFAIL = new JMVC.Interface(['foo', 'nope']);
			
			JMVC.test.testValue(
				'interfacePASS.check(Person)',
				function () {return interfacePASS.check(Person);},
				true
			);
			JMVC.test.testValue(
				'interfaceFAIL.check(Person)',
				function () {return interfaceFAIL.check(Person);},
				false
			);

			
			JMVC.test.finishAll();
		});
	};
};
