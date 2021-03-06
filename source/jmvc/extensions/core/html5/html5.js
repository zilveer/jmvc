// type : LIB
//

JMVC.extend('html5', {
    init: function () {
        'use strict';
        JMVC.html5._ = {
            mimemap: {
                ogv: 'ogg'
            }
        };
    },

    video: function (options) {
        'use strict';
        if (!('src' in options)) throw new Error('No src passed for video');

        var video,
            attrs = {
                video: {},
                source: {}
            };
        // 'type' in options && (attrs.source.type = 'video/' + (JMVC.html5._.mimemap[options.type] || options.type));
        attrs.source.type = 'video/' + ('type' in options ? (JMVC.html5._.mimemap[options.type] || options.type) : 'ogg');
        attrs.source.src = options.src;
        if (options.controls) {
            attrs.video.controls = 'controls';
        }
        if (options.autoplay) {
            attrs.video.autoplay = 'autoplay';
        }
        if (options.loop) {
            attrs.video.loop = 'loop';
        }
        attrs.video.width = options.width || 800;
        attrs.video.height = options.height || 600;

        video = JMVC.dom.create('video', attrs.video);

        // append inner source tag
        JMVC.dom.add(video, 'source', attrs.source);

        return video;
    },

    audio: function (options) {
        'use strict';
        if (!('src' in options)) throw new Error('No src passed for video');

        var audio,
            attrs = {
                audio: {},
                source: {}
            },
            addSource = true;
        // 'type' in options && (attrs.source.type = 'video/' + (JMVC.html5._.mimemap[options.type] || options.type));

        attrs.source.type = 'audio/' + ('type' in options ? (JMVC.html5._.mimemap[options.type] || options.type) : 'ogg');

        attrs.audio.controls = options.controls ? 'controls' : '';
        attrs.audio.autoplay = options.autoplay ? 'autoplay' : '';

        switch (options.type) {
        case 'ogg':
        case 'ogv':
            attrs.audio.src = options.src;
            addSource = false;
            break;
        case 'wav':
            attrs.source.src = options.src;
            break;
        }
        audio = JMVC.dom.create('audio', attrs.audio);
        // append inner source tag
        addSource && JMVC.dom.add(audio, 'source', attrs.source);
        return audio;
    },
    progress: function (progress, attr) {
        'use strict';
        attr = attr || {};
        if (!('max' in attr)) { attr.max = 100; }
        return '<progress ' + JMVC.object.toAttr(attr) + ' value="' + progress + '"></progress>';
    },
    geolocation: function (posCB, errCB) {
        'use strict';
        posCB = posCB || function () { };
        errCB = errCB || function () { };
        navigator.geolocation.getCurrentPosition(posCB, errCB);
    }
});
