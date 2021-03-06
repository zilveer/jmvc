/* eslint-disable new-cap */
JMVC.controllers.google = function () {
    'use strict';
    this.action_index = function () {
        JMVC.events.loadify(1000);
        JMVC.require('plotter/plotter', 'core/obj/bucket/bucket');
        JMVC.head.meta('generator', 'jmvc resident in your machine');
        JMVC.head.addStyle(JMVC.vars.baseurl + '/media/css/logoogle.css');

        JMVC.head.title('Google logo plotted');

        var M = Math,
            v = JMVC.getView('vacuum'),
            that = this,
            oldOne = this.get('new'),
            G, o1, o2, g, l, e,
            newlogo,
            scale = parseFloat(JMVC.p.scale, 10) || 1,
            animate = true,
            _speed = 1,
            a, i, T1, T2, nums, bucket, t, tInner, tInner2, c, s, dotsize, maxsize,
            aberrate = that.get('aberrate'),
            flash = that.get('flash'),
            active = true,
            initialized = false;

        document.body.style.paddingTop = '100px';
        document.body.style.fontFamily = 'Verdana';

        v.set({
            'style': 'font-family:Verdana;margin:0 auto;width:538px;height:190px;position:relative;' +
                (that.get('back') ? ';background-image:url(' + JMVC.vars.baseurl + '/media/img/' + (oldOne ? 'google' : 'googlenew') + '.png);' : ''),
            'content': '&nbsp;',
            'id': 'extralogo'
        });

        /* JMVC.p.real && JMVC.head.lib('jsapi'); */

        v.render(plot);
        function plot () {
            newlogo = JMVC.dom.find('#extralogo');
            JMVC.dom.addClass(newlogo, 'respfixed');
            newlogo.innerHTML = '';

            if (oldOne) {
                G = new JMVC.plotter.symbol('G', 72, 67);
                o1 = new JMVC.plotter.symbol('o1', 185, 90);
                o2 = new JMVC.plotter.symbol('o2', 283, 90);
                g = new JMVC.plotter.symbol('g', 330, 40);
                l = new JMVC.plotter.symbol('l', 437, 64);
                e = new JMVC.plotter.symbol('e', 460, 48);

                G.arc(3, 0, 76, 68, M.PI / 27, 14 * M.PI / 30, 35)
                    .line(12, 67, 53, 58, 3)
                    .line(53, 58, 53, 23, 3)
                    .line(53, 23, 59, 16, 0)
                    .line(59, 16, 18, 16, 4)
                    .line(18, 16, 12, 22, 0)
                    .line(12, 22, 34, 22, 2)
                    .line(34, 22, 34, 54, 3)
                    .arc(3, 0, 62, 54, -M.PI / 24, -5 * M.PI / 8, 33, M.PI / 3)
                    .line(46, -48, 36, -37, 1);

                o1.arc(0, 0, 45, 45, M.PI / 20, 0, 40)
                    .arc(0, 0, 28, 38, M.PI / 16, 0, 32)
                    .rotate(-M.PI / 12);

                o2.clone(o1);

                g.arc(45, 38, 20, 26, M.PI / 8, 0, 16, -M.PI / 8)
                    .arc(45, 38, 36, 32, M.PI / 10, M.PI / 2 + M.PI / 12, 9)
                    .arc(45, 38, 36, 32, -M.PI / 10, M.PI / 3, 7)
                    .line(44, 6, 86, 6, 3)
                    .line(80, 12, 80, 12)
                    .arc(45, 116, 30, 21, M.PI / 8, 0, 14)
                    .arc(43, 117, 43, 29, M.PI / 10, 0 + M.PI / 12, 15, -M.PI / 20)
                    .arc(80, 72, 23, 14, -M.PI / 6, M.PI, 3)
                    .arc(80, 72, 38, 24, -M.PI / 10, M.PI, 3)
                    .line(62, 97, 72, 110, 1)
                    .arc(43, 107, 43, 29, -M.PI / 10, 0, 3);

                l.line(-12, -60, 16, -60, 2)
                    .line(16, -60, 10, -54, 0)
                    .line(10, -54, 10, 60, 12)
                    .line(10, 60, 21, 62, 1)
                    .line(21, 62, 17, 66, 0)
                    .line(17, 66, -15, 66, 3)
                    .line(-15, 66, -9, 60, 0)
                    .line(-9, 60, -9, -52, 12)
                    .line(-9, -52, -18, -52, 0);

                e.line(16, 36, 52, 22, 3)
                    .line(18, 44, 67, 23, 4)
                    .arc(41, 44, 42, 44, -M.PI / 14, 0, 23, -M.PI / 5)
                    .arc(53, 41, 34, 36, -M.PI / 14, M.PI, 10, -M.PI / 10)
                    .arc(43, 41, 24, 36, -M.PI / 10, -M.PI / 5, 7, -M.PI / 10);
            } else {
                G = new JMVC.plotter.symbol('G', 67, 68);
                o1 = new JMVC.plotter.symbol('o1', 186, 93);
                o2 = new JMVC.plotter.symbol('o2', 282, 93);
                g = new JMVC.plotter.symbol('g', 377, 92);
                l = new JMVC.plotter.symbol('l', 430, 4);
                e = new JMVC.plotter.symbol('e', 498, 93);

                G.arc(0, 0, 67, 71, M.PI / 25, -M.PI / 50, 45)
                    .arc(0, 0, 50, 52, M.PI / 25, M.PI / 12, 42)
                    .line(48, -50, 36, -38, 2)
                    .line(65, -5, 2, -5, 8)
                    .line(2, -5, 2, 12, 2)
                    .line(2, 12, 42, 12, 6);

                o1.arc(0, 0, 44, 44, M.PI / 20, 0, 40)
                    .arc(0, 0, 26, 26, M.PI / 16, 0, 32);

                o2.clone(o1);

                g.arc(0, 0, 24, 28, M.PI / 12, 0, 25)
                    .arc(-5, 0, 40, 44, M.PI / 18, M.PI / 4, 28)
                    .line(23, -32, 23, -41, 1)
                    .line(23, -41, 40, -41, 2)
                    .line(40, -41, 40, 44, 10)
                    .arc(-2, 40, 42, 44, M.PI / 18, M.PI / 12, 14)
                    .line(-40, 58, -24, 52, 2)
                    .arc(-1, 40, 24, 28, M.PI / 13, M.PI / 12, 10)
                    .line(23, 36, 23, 42, 0);

                l.line(0, 0, 0, 130, 20)
                    .line(0, 130, 18, 130, 2)
                    .line(18, 130, 18, 0, 20)
                    .line(18, 0, 0, 0, 2);

                e.arc(0, 0, 42, 46, M.PI / 16, M.PI / 4, 29, -M.PI / 12)
                    .arc(0, 0, 22, 28, -M.PI / 10, -M.PI / 4, 8)
                    .arc(2, 0, 24, 28, M.PI / 10, M.PI / 5, 7)
                    .line(-20, 12, 33, -9, 6)
                    .line(-16, -5, 14, -16, 4)
                    .line(23, 13, 33, 21, 1);
            }

            G.plot(newlogo, scale);
            o1.plot(newlogo, scale);
            o2.plot(newlogo, scale);
            g.plot(newlogo, scale);
            l.plot(newlogo, scale);
            e.plot(newlogo, scale);

            if (animate) {
                a = newlogo.childNodes;
                i = 1;
                T1 = 50;
                T2 = _speed;
                dotsize = aberrate ? 4 : 6;
                maxsize = 300;
                nums = JMVC.util.range(1, a.length - 1);
                bucket = new JMVC.bucket.create(nums);

                t = window.setInterval(function () {
                    if (!active) return;
                    var trg;
                    if (flash) {
                        trg = i;
                    } else {
                        if (!bucket.hasMore()) {
                            if (aberrate) {
                                dotsize = (dotsize < maxsize) ? dotsize + 2 : maxsize;
                            }
                            bucket.recover();
                        }
                        trg = bucket.next() || 1;
                    }

                    try {
                        c = a.item(trg).style.color;
                        s = a.item(trg).style.fontSize;
                    } catch (e) { }

                    tInner = window.setTimeout(
                        function (t1) {
                            if (!active) return;
                            try {
                                a.item(t1).style.color = 'white';
                                a.item(t1).style.fontSize = aberrate ? dotsize * 2 + 'px' : '10px';
                                a.item(t1).style.zIndex = 200;
                                tInner2 = window.setTimeout(
                                    function (t2) {
                                        if (!active) return;
                                        try {
                                            a.item(t2).style.color = c;
                                            a.item(t2).style.fontSize = dotsize + 'px';
                                            a.item(t1).style.zIndex = 1;
                                        } catch (e) { }
                                    }, T1, t1
                                );
                            } catch (e) { }
                        }, 0, trg
                    );
                    if (flash) {
                        i = (i + 1) % (a.length);
                        i = i || 1;
                    }
                }, T2);
            }
            !initialized && init();
        }

        // use the Widgzard to render quick links
        //
        function init () {
            initialized = true;
            JMVC.core.widgzard.render({
                target: JMVC.WDB,
                content: [{
                    style: { position: 'absolute', top: '10px', left: '10px', lineHeight: '18px', color: '#777', padding: '10px' },
                    content: [{
                        tag: 'form',
                        wid: 'form',
                        content: [{
                            tag: 'ul',
                            content: [{
                                tag: 'li',
                                data: {
                                    id: JMVC.util.uniqueid + ''
                                },
                                content: [{
                                    tag: 'label',
                                    style: { width: '100px', textAlign: 'right', paddingRight: '10px', display: 'inline-block' },
                                    html: 'effect',
                                    cb: function () {
                                        var self = this,
                                            $elf = self.node;
                                        JMVC.dom.attr($elf, 'for', self.parent.data.id);
                                        self.done();
                                    }
                                }, {
                                    tag: 'select',
                                    style: {
                                        backgroundColor: 'black',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '18px'
                                    },
                                    content: [{
                                        tag: 'option',
                                        attrs: { value: 'appear' },
                                        html: 'appear'
                                    }, {
                                        tag: 'option',
                                        attrs: { value: 'aberrate' },
                                        html: 'aberrate'
                                    }, {
                                        tag: 'option',
                                        attrs: { value: 'flash' },
                                        html: 'flash'
                                    }],
                                    cb: function () {
                                        var self = this,
                                            $elf = self.node;
                                        JMVC.events.on($elf, 'change', function () {
                                            switch ($elf.value) {
                                            case 'appear':
                                                aberrate = false;
                                                flash = false;
                                                break;
                                            case 'flash':
                                                aberrate = false;
                                                flash = true;
                                                break;
                                            case 'aberrate':
                                                aberrate = true;
                                                flash = false;
                                                break;
                                            }
                                            $elf.blur();
                                            active = false;
                                            clearInterval(t);
                                            clearTimeout(tInner);
                                            clearTimeout(tInner2);

                                            JMVC.events.delay(plot, 100);
                                            active = true;
                                        });
                                        self.done();
                                    }
                                }]
                            }, {
                                tag: 'li',
                                data: {
                                    id: JMVC.util.uniqueid + ''
                                },
                                content: [{
                                    tag: 'label',
                                    style: { width: '100px', textAlign: 'right', paddingRight: '10px', display: 'inline-block' },
                                    html: 'old logo',
                                    cb: function () {
                                        var self = this,
                                            $elf = self.node;
                                        JMVC.dom.attr($elf, 'for', self.parent.data.id);
                                        self.done();
                                    }
                                }, {
                                    tag: 'input',
                                    attrs: { type: 'checkbox' },
                                    cb: function () {
                                        var self = this,
                                            $elf = self.node;
                                        JMVC.dom.attr($elf, 'id', self.parent.data.id);

                                        JMVC.events.on($elf, 'change', function () {
                                            active = false;
                                            clearInterval(t);
                                            clearTimeout(tInner);
                                            clearTimeout(tInner2);
                                            oldOne = !!$elf.checked;
                                            JMVC.events.delay(plot, 100);
                                            active = true;
                                        });
                                        self.done();
                                    }

                                }]
                            }, {
                                tag: 'li',
                                content: [{
                                    tag: 'label',
                                    html: 'speed',
                                    style: { width: '100px', textAlign: 'right', paddingRight: '10px', display: 'inline-block' }
                                }, {
                                    tag: 'input',
                                    attrs: { type: 'range', min: 1, max: 10, value: 1, step: 1 },
                                    style: { backgroundColor: 'black' },
                                    cb: function () {
                                        var self = this,
                                            $elf = self.node;
                                        JMVC.events.on($elf, 'input', function () {
                                            self.getNode('speedValue').node.innerHTML = 10 - $elf.value + 1;
                                            _speed = $elf.value;
                                        });
                                        JMVC.events.on($elf, 'change', function () {
                                            active = false;
                                            clearInterval(t);
                                            clearTimeout(tInner);
                                            clearTimeout(tInner2);
                                            JMVC.events.delay(plot, 100);
                                            active = true;
                                        });
                                        self.done();
                                    }
                                }, {
                                    tag: 'span',
                                    wid: 'speedValue',
                                    html: 10 - _speed + 1
                                }]
                            }]

                        }]
                    }]

                }]
            });
        }
    };
};
