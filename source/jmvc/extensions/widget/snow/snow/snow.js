JMVC.head.addStyle(JMVC.vars.baseurl + '/app/extensions/widget/snow/snow.css', true);

JMVC.require('core/screen/screen');
//
JMVC.extend('snow', {
    vars: {
        flakes: [],
        l: 0,
        trg: null
    },
    start: function (trg, opts) {
        JMVC.snow.vars.trg = JMVC.dom.find(trg);
        JMVC.css.style(JMVC.snow.vars.trg, 'position', 'relative');
        JMVC.snow.vars.l = (opts && opts.length) || 100;

        var bodysize = JMVC.screen.bodySize(),
            i = 0;

        function Flake () {
            var left = JMVC.util.rand(0, bodysize[0] - 20),
                top = JMVC.util.rand(0, bodysize[1] - 20),
                opa = JMVC.util.rand(3, 8) / 10;
            this.s = JMVC.util.rand(5, 40);
            this.node = JMVC.dom.create(
                'span',
                {
                    'class': 'flake',
                    'style': 'line-height:' + this.s + 'px;height:' + this.s + 'px;font-size:' + this.s + 'px;top:' + top + 'px;left:' + left + 'px;opacity:' + opa
                },
                '&bull;'
            );
            this.amplitude = JMVC.util.rand(0.1, 2) * 0.5;
            this.speed = 0.5 + Math.random() * 0.5;
            this.length = JMVC.util.rand(10, 20);
            this.cursor = 0;
        }

        function getFlake () {
            var f = new Flake();
            JMVC.snow.vars.flakes.push(f);
            JMVC.dom.append(JMVC.snow.vars.trg, f.node);
        }

        function loop () {
            var newr = [],
                i = 0, r,
                l = JMVC.snow.vars.flakes.length;
            for (null; i < l; i += 1) {
                r = move(JMVC.snow.vars.flakes[i]);
                r && newr.push(JMVC.snow.vars.flakes[i]);
            }
            JMVC.snow.vars.flakes = newr;
        }

        function move (e) {
            var el = e.node,
                top = JMVC.num.getFloat(JMVC.css.style(el, 'top')),
                left = JMVC.num.getFloat(JMVC.css.style(el, 'left'));

            // get back
            if (top > bodysize[1] - 60) {
                top = 0;
            }

            left = left + e.amplitude * Math.sin(top / e.length);

            if (left > bodysize[0] - 60) {
                e.node.style.display = 'none';
            } else {
                e.node.style.display = 'block';
            }
            JMVC.css.style(el, { 'top': (top + e.speed) + 'px', 'left': left + 'px' });
            return true;
        }

        for (null; i < JMVC.snow.vars.l; i += 1) {
            getFlake();
        }
        window.setInterval(function () { loop(); }, 10);
    }
});
