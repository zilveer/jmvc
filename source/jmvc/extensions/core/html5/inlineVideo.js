JMVC.extend('html5', function () {
    var spinnerClass = 'fa fa-spinner fa-pulse',
        loadedClass = 'fa fa-play-circle',
        replayClass = 'fa fa-refresh',
        mobile = (function () {
            var ua = navigator.userAgent || navigator.vendor || window.opera;
            // eslint-disable-next-line no-useless-escape
            return /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
        })(),
        evLoaded = mobile ? 'canplaythrough' : 'loadeddata';

    function InlineVideo (v) {
        var sources,
            self = this,
            i, l;
        // v.load();

        this.size = {
            height: v.clientHeight,
            width: v.clientWidth
        };
        this.video = v;
        sources = [].slice.call(this.video.getElementsByTagName('source'), 0);
        this.audio = document.createElement('audio');
        this.audio.setAttribute('preload', 'preload');
        this.video.setAttribute('preload', 'preload');
        this.video.setAttribute('muted', 'muted');
        this.cnv = document.createElement('canvas');
        this.cnv.style.width = this.size.width + 'px';
        this.cnv.style.height = this.size.height + 'px';
        this.cnv.setAttribute('width', this.size.width);
        this.cnv.setAttribute('height', this.size.height);
        this.cnv.style.webkitFilter = 'brightness(0.5)';
        this.ctx = this.cnv.getContext('2d');

        this.parent = v.parentNode;
        this.container = document.createElement('div');
        this.container.style.display = 'inline-block';
        this.container.style.width = this.size.width + 'px';
        this.container.style.height = this.size.height + 'px';
        this.container.style.position = 'relative';

        this.a_mp4 = document.createElement('source');
        this.a_mp4.setAttribute('type', 'audio/mp4');
        this.a_webm = document.createElement('source');
        this.a_webm.setAttribute('type', 'audio/webm');

        // sources
        //
        for (i = 0, l = sources.length; i < l; i++) {
            switch (sources[i].type) {
            case 'video/mp4':
                this.a_mp4.setAttribute('src', sources[i].src);
                break;
            case 'video/webm':
                this.a_webm.setAttribute('src', sources[i].src);
                break;
            }
        }

        this.actionButton = document.createElement('span');
        this.actionButton.className = spinnerClass;

        this.actionButton.style.height = this.actionButton.style.width = this.size.width / 5 + 'px';
        this.actionButton.style.position = 'absolute';
        this.actionButton.style.left = (this.size.width - this.size.width / 5) / 2 + 'px';
        this.actionButton.style.top = (this.size.height - this.size.width / 5) / 2 + 'px';
        this.actionButton.style.fontSize = this.size.width / 5 + 'px';
        this.actionButton.style.pointerEvents = 'none';
        this.actionButton.style.color = 'black';
        this.actionButton.style.cursor = 'pointer';
        this.actionButton.style.textShadow = '0px 0px 5px #fff';

        this.rushPlay = v.hasAttribute('autoplay');
        this.playing = false;
        this.audioLoaded = false;
        this.videoLoaded = false;

        this.readyToPlay = false;

        this.video.style.display = 'none';
        this.audio.style.display = 'none';

        // append
        this.audio.appendChild(this.a_mp4);
        this.audio.appendChild(this.a_webm);
        this.container.appendChild(this.audio);
        this.container.appendChild(this.cnv);
        this.container.appendChild(this.actionButton);
        this.parent.appendChild(this.container);

        self.ctx.drawImage(v, 0, 0, self.size.width, self.size.height);

        function videoIsLoaded () {
            // self.ctx.drawImage(self.video, 0, 0, self.size.width, self.size.height);
            self.video.currentTime = 0;
            self.videoLoaded = true;
            self._synchCheck();
            return true;
        }
        function audioIsLoaded () {
            self.audioLoaded = true;
            self._synchCheck();
            return true;
        }

        (this.video.readyState === 4 && videoIsLoaded()) ||
        this.video.addEventListener(evLoaded, videoIsLoaded, false);

        (this.audio.readyState === 4 && audioIsLoaded()) ||
        this.audio.addEventListener(evLoaded, audioIsLoaded, false);
        this.audio.load();
        // NOT HERE
        // this.video.load();
    }

    InlineVideo.prototype = {
        _synchCheck: function () {
            if (this.videoLoaded && this.audioLoaded) {
                this._readyToPlay();
                this.video.currentTime = 0;
                this.readyToPlay = true;
            }
        },

        _readyToPlay: function (again) {
            var self = this;
            this.cnv.style.cursor = 'pointer';
            this.cnv.style.webkitFilter = 'brightness(0.5)';
            again = again || false;
            this.actionButton.className = again ? replayClass : loadedClass;
            if (again) {
                this.audio.pause();
                this.actionButton.style.display = 'block';
            }
            this.audio.currentTime = 0;
            this.video.currentTime = 0;
            this.cnv.addEventListener('click', function () {
                !self.playing && self._doPlay();
            }, false);
            this.checkHaveToPlay();
            return true;
        },

        _doPlay: function () {
            this.cnv.style.cursor = 'default';
            this.playing = true;

            this.cnv.style.webkitFilter = 'brightness(1)';

            this.actionButton.style.display = 'none';
            this.video.style.display = 'none';
            this.audio.currentTime = 0;
            this.video.currentTime = 0;

            this.startedAudio = false;
            this._loop();
            if (!this.startedAudio) {
                this.startedAudio = true;
                this.audio.play();
            }
            // this.cnv.removeEventListener('click', function (){self._doPlay();}, false);
        },

        _loop: function () {
            var lastTime = Date.now(),
                framesPerSecond = 25,
                self = this;
            this.startedAudio = false;

            if (!this.video.muted) {
                this.audio.currentTime = this.video.currentTime;
            }
            (function calle () {
                // lastTime = Date.now()
                if (self.playing) {
                    var time = Date.now(),
                        elapsed = (time - lastTime) / 1000,
                        currentTime = (Math.round(parseFloat(self.video.currentTime) * 10000) / 10000),
                        duration = (Math.round(parseFloat(self.video.duration) * 10000) / 10000);

                    if (elapsed >= ((1000 / framesPerSecond) / 1000)) {
                        self.video.currentTime = self.video.currentTime + elapsed;
                        // self.ctx.drawImage(self.video, 0, 0);
                        self.ctx.drawImage(self.video, 0, 0, self.size.width, self.size.height);
                        lastTime = time;
                    }
                    if (currentTime >= duration) {
                        self.playing = false;
                        self.rushPlay = false;
                        console.log('ENDED: currentTime: ' + currentTime + ' duration: ' + self.video.duration);
                        self._readyToPlay(true);
                        return;
                    }
                } else {
                    lastTime = Date.now();
                    console.debug(self.playing);
                }
                requestAnimationFrame(calle);
            })();
        },
        checkHaveToPlay: function () {
            this.rushPlay && this._doPlay();
        },
        // PUBLIC
        //
        play: function () {
            this.playing = true;
            this.rushPlay = true;
            this.readyToPlay && this._doPlay();
        },
        pause: function () {
            this.playing = false;
            this.audio.pause();
            this.audio.currentTime = this.video.currentTime;
        },
        resume: function () {
            this.audio.currentTime = this.video.currentTime;
            this.audio.play();
            this.playing = true;
        },
        seekTo: function (t) {
            t = t || 0;
            this.video.currentTime = t;
            this.audio.currentTime = t;
        },
        mute: function () {
            this.audio.pause();
            this.muted = true;
        },
        unmute: function () {
            this.audio.currentTime = this.video.currentTime;
            this.audio.play();
            this.muted = false;
        }
    };

    return {
        inlineVideo: function (v) {
            var ilv = new InlineVideo(v);
            return {
                play: function () { ilv.play(); },
                resume: function () { ilv.resume(); },
                pause: function () { ilv.pause(); },
                seekTo: function (t) { ilv.seekTo(t); },
                mute: function () { ilv.mute(); },
                unmute: function () { ilv.unmute(); },
                canvas: ilv.cnv,
                video: ilv.video
            };
        }
    };
});
