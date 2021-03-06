JMVC.controllers.arguments2array = function () {
    this.action_index = function () {
        JMVC.events.loadify(1000);
        this.render(function test () {
            'use strict';
            var JT = JMVC.test,
                // size = 1E4,
                s = (function (i) {
                    return [i, i * 2, i - 1, i * i];
                })(Math.random()),
                // i = 0,
                times = 1,
                res = [],
                utility = {};

            JT.initialize();
            JT.startAll();
            JT.describe(`
Test arguments 2 array:<br/>
Simply pass a pseudorandom small array of numbers to a function (${times} times for precision purposes),<br/> use different approaches to convert arguments into an array and compare execution times
`);

            function _1 () {
                return [].slice.call(arguments, 0);
            }
            function _2 () {
                var args = [];
                args.push.apply(args, arguments);
                return args;
            }
            function _3 () {
                var args = [],
                    i = 0,
                    l = arguments.length;
                for (null; i < l; i++) {
                    args.push(arguments[i]);
                }
                return args;
            }
            function _4 () {
                var args = [],
                    i = 0,
                    l = arguments.length;
                for (null; i < l; i++) {
                    args[i] = arguments[i];
                }
                return args;
            }

            /**
             * utility functions for storing and then being able to check results
             */
            utility = {
                run: function (fun, n) {
                    return function () {
                        res[n] = fun.apply(null, arguments);
                    };
                },
                doTest: function (label, fun, n) {
                    JT.hr();
                    JT.message(label);
                    JT.code(fun.toString());
                    JT.testTime(label, this.run(fun, n), times, s);
                },
                check: function () {
                    var r = true,
                        i = 0,
                        len = res.length - 1;
                    for (null; i < len; i++) {
                        r = r && JSON.stringify(res[i]) === JSON.stringify(res[i + 1]);
                    }
                    return r;
                }
            };

            utility.doTest('one', _1, 0);
            utility.doTest('two', _2, 1);
            utility.doTest('three', _3, 2);
            utility.doTest('four', _4, 3);
            JT.testValue('check results matches', utility.check, true);
            JT.timeSummary();
            JT.finishAll();
        });
    };
};
