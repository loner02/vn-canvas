///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";
require(["lib/howler.min"]);

///////////////////////////////////////////////////////////////////////////////
// Local Helpers
///////////////////////////////////////////////////////////////////////////////
require(["app/vncanvas-base"], function() {
	// Helper function to pause audio during device pause
    Helper.pauseAudio = (() => {
        if (!Stage.isCordova) {
            Howler.mute(true);
        }
        else {
            for (let s in Stage.sounds) {
                if (Stage.sounds.hasOwnProperty(s)) {
                    for (let [key, sound] of Stage.sounds[s]) {
                        if (!sound.isPaused) {
                            sound.silence(); //sound.pause();
                            sound.devPaused = true;
                        }
                    }
                }
            } 
        }
    });
	// Helper function to resume audio after device pause
    Helper.resumeAudio = (() => {
        if (!Stage.isCordova) {
            Howler.mute(false);
        }
        else {
            for (let s in Stage.sounds) {
                if (Stage.sounds.hasOwnProperty(s)) {
                    for (let [key, sound] of Stage.sounds[s]) {
                        if (sound.devPaused) {
                            sound.devPaused = false;
                            sound.play();
                        }
                    }
                }
            } 
        }
    });
    Helper.processAudio = ((obj, src, param) => {
        let sndsrc = '', tag = '', k = '', s = null;
        if (typeof src == 'string') {
            sndsrc = Helper.parseArg(src);
            for (let [key, sound] of obj) {
                if (key.includes(sndsrc)) { 
                    k = key; s = sound;
                    break;
                }
            }
        }
        else {  // assume [tag, file, start, duration]
            tag = src[0];
            sndsrc = Helper.parseArg(src[1]);
            // search tag
            for (let [key, sound] of obj) {
                if (key.includes(tag)) { 
                    k = key; s = sound;
                    break;
                }
            }
        }
        if (s) {
            switch (param.action) {
                case 'stop':
                    s.stop(false); break;
                case 'pause':
                    s.pause(); break;
                case 'rewind':
                    s.rewind(); break;
                case 'remove':
                    //if (param.bgs || param.se || param.bgm) {
                        s.stop(true);
                        s.free();
                        obj.delete(k);
                    //}
                    break;
                case 'mute':
                    s.silence(); break;
                case 'play':
                default:
                    if (param.se || param.voice)
                        s.repeat = (param.repeat>0) ? param.repeat : 0;
                    else
                        s.repeat = -1;
                    s.delay = (param.delay>0) ? param.delay : 0;
                    if (param.adjust) s.adjust = param.adjust;
                    if (param.rate) s.rate = Math.max(0.5,Math.min(4.0,param.rate));
                    s.isStopping = false;
                    s.play();
                    break;
            }
        }
        else {
            let sndformat = (param.format) ? param.format : Config.audioFormat;
            s = new Sounds(sndsrc, sndformat);
            if (s.src != null) {
                if (param.bgm || param.voice) {
                    for (let [key, sound] of obj) {
                        sound.stop(true);
                        if (sound.tag == '') {
                            sound.free();
                            obj.delete(key);
                        }
                    }
                }
                if (param.se || param.voice)
                    s.repeat = (param.repeat > 0) ? param.repeat : 0;
                else
                    s.repeat = -1;
                s.delay = (param.delay > 0) ? param.delay : 0;
                s.mute = Helper.findVar('_mute_audio');  // initialize muted property
                if (param.adjust) s.adjust = param.adjust;
                if (param.rate) s.rate = Math.max(0.5,Math.min(4.0,param.rate));
                if (param.stereo) s.stereo = Math.max(-1.0, Math.min(1.0,param.stereo));
                s.type = (param.bgm ? 'bgm' :
                         (param.bgs ? 'bgs' :
                         (param.se ? 'se' : 'voice')));
                if ((param.se || param.voice) && (tag!='')) {
                    s._tag = tag;
                    s.audio._sprite[tag] = [src[2]*1000, src[3]*1000];
                    obj.set(tag, s);
                }
                else
                    obj.set(sndsrc, s);
                // start audio if ready and not started
                if (s.initd && !s.playing && !s.isPaused && !s.isStopping)
                    s.play();
            }
        }
    });
});

///////////////////////////////////////////////////////////////////////////////
// Audio/Video elements
///////////////////////////////////////////////////////////////////////////////
// audio - plays a sound
function audio(param) {
	/*
		To conserve memory:
		BGM - only one stored at a time; on new bgm, previous is removed
		BGS - can have multiple bgs playing; use "remove" to clear
		SE - can have multiple se; use "remove" to clear
	*/
	if (!Stage.isCordova) {
        //check if browser can play audio
        if ((typeof AudioContext === 'undefined') &&
            (typeof webkidAudioContext === 'undefined') &&
            (!document.createElement('audio').canPlayType)) 
                return;
    }
	
	if (param.bgm)
		Helper.processAudio (Stage.sounds.bgm, param.bgm, param);
	if (param.bgs)
		Helper.processAudio (Stage.sounds.bgs, param.bgs, param);
	if (param.se)
        Helper.processAudio (Stage.sounds.se, param.se, param);
    if (param.voice)    // the only reason to call this is to remove audio
        Helper.processAudio (Stage.sounds.vc, param.voice, param);
}
// video - plays a video (cutscene, etc.)
function video(param) {
	if (!document.createElement('video').canPlayType) return;
	
	let mimeType = {"mp4": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"m4v": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"ogg": 'video/ogg; codecs="theora, vorbis"',
					"ogv": 'video/ogg; codecs="theora, vorbis"',
					"webm": 'video/webm; codecs="vp8, vorbis"',
					"webmv": 'video/webm; codecs="vp8, vorbis"'};
                    
    let source = Helper.parseArg(param.src);
	let v = new Movie();
	let videoformat = (param.format) ? param.format : Config.movieFormat;
	for (let i in videoformat) {
		if (v.movie.canPlayType(mimeType[videoformat[i]]) != '') {
			source = source + '.' + videoformat[i];
			break;
		}
	}	

    v.load(source);
    Stage.videos.set(v.src, v);
}

///////////////////////////////////////////////////////////////////////////////
// Sounds class
///////////////////////////////////////////////////////////////////////////////
class Sounds {
    constructor(src, format) {
        this.initd = false;
        this.src = null;
        this.devPaused = false;	// device initiated pause
        this._repeat = -1;
        this._delay = 0;
        this.isStopping = false;
        this.isPaused = false;
        this._volume = Config.volumeAudio;
        this._adjust = 0;        
        this._rate = 1;
        this._stereo = 0;
        this._tag = '';

        if (!Stage.isCordova) {
            let srcarr = new Array();
            format.forEach(f => { srcarr.push(`${src}.${f}`); });
            // TODO: multiple Sounds, single Howl?
            //this.audio = this.getHowl(src);
            //if (!this.audio) {
                this.audio = new Howl({
                    src:srcarr,
                    format:format,
                });
            //}
            this.src = this.audio._src;
            // BUG: if the audio is already in cache, howler 'load' event won't fire
            //      and hence this.play() won't be called
            this.isLoaded((loaded) => {
                this.initd = true;
                if (!loaded && !this.isPaused && !this.isStopping)
                    this.play();
            });
            this.audio.on('end', () => {
                //console.log(`[HOWL]: end: ${this.src}`);
                if (this._repeat > 0) {
                    this.play();
                    this._repeat--;
                }
                else if (this._repeat < 0) {
                    this.play();
                }
                else {
                    this.isPaused = true;
                }
            });
        }
        else {
            try {
                // TODO: what about other platforms?
                // TODO: check if Cordova/mobile can play
                // For now, assume can play type
                this.src = `${src}.${format[0]}`;
                if (Config.devPlatform == "Android") {
                    if (this.src.includes("android_asset"))
                        this.src = "/android_asset/www/" + this.src;
                    console.log("Audio file: " + this.src);
                }
                this.audio = new Media(this.src,
                    () => {console.log("Sounds.Play():Audio Success");},
                    (err) => {console.log("Sounds.Play():Audio Error: " + err);},
                    (status) => {
                        console.log("Sounds.Play():Status: " + status);
                        if (!this.isPaused) {
                            if (status == Media.MEDIA_STOPPED) {
                                //console.log("Sounds.Play():repeat: " + that.repeat);
                                if (this._repeat > 0) {
                                    this.play(false);
                                    this._repeat--;
                                }
                                else if (this._repeat < 0) {
                                    this.play(false);
                                }
                                else {
                                    this.isPaused = true;
                                }
                            }
                        }
                    }
                );                
                if (!this.isPaused) {
                    if (this._delay > 0) {
                        setTimeout(() => {
                            if (!this.isPaused && !this.isStopping)
                                this.audio.play();
                        }, this._delay*1000);
                    }
                    else
                        this.audio.play();
                }
                this.initd = true;
            }
            catch (e) {
                this.audio = null;
                this.src = null;
            }
        }
    }
    set repeat (val) { this._repeat = val; }
    set delay (val) { this._delay = val; }
    set adjust (val) { this._adjust = val; }
    set rate (val) { this._rate = val; }
    set stereo (val) { this._stereo = val; }
    set mute (val=false) { 
        if (this.audio != null) {
            if (!Stage.isCordova)
                this.audio.mute(val);
            else {
                if (mute)
                    this.audio.setVolume(0);
                else
                    this.audio.setVolume(this._volume + this._adjust);
            }
        }
    }
    set volume (val) {
        if (this.audio != null) {
            if (!Stage.isCordova)
                this.audio.volume(val);
            else
                this.audio.setVolume(val);
        }
    }
    get playing() {
        if (!Stage.isCordova)
            return this.audio.playing();
        else {
            // TODO: cordova status for playing
        }
    }
    get tag() {
        return this._tag;
    }
    getHowl(src) {
        for (let h of Howler._howls) {
            if (h._src.includes(src) && (h._state == 'loaded'))
                return h;
        }
        return null;
    }
    isLoaded(callback) {
        let loaded = false;
        for (let h of Howler._howls) {
            if ((h._src == this.src) && (h._state == 'loaded')) {
                loaded = true;
                callback(loaded);
                break;
            }
        }
        if (!loaded) {
            this.audio.on('load', () => {
                console.log(`[HOWL]: loading: ${this.src}`);
                callback(loaded);
            });
        }
    }
    play() {
        if (!this.initd) return;
        if (this.audio && this.src) {
            if (!Stage.isCordova) {
                this.audio.volume(Math.min(1, this._volume + this._adjust));
                if (!this.audio._sprite) this.audio.rate(this._rate);
                this.audio.stereo(this._stereo);
            }
            else {
                this._volume = Config.volumeAudio + this._adjust
                this.audio.setVolume(this._volume);
            }
            // for BGM and BGS, a re-play on a playing sound will have no effect
            // for SE, a re-play will cause multiple instances of play, useful for repetitive sfx
            if (!this.devPaused) {
                if (!this.playing || (this.type == 'se')) {
                    this.isPaused = false;
                    if (this._delay > 0) {
                        setTimeout(() => {
                            if (!this.isPaused && !this.isStopping)
                                (this._tag!='')?this.audio.play(this._tag):this.audio.play();
                        }, this._delay*1000);
                    }
                    else
                        (this._tag!='')?this.audio.play(this._tag):this.audio.play();
                }
                this.audio.mute(false);
            }
        }
    }
    stop(immediate) {
        if (this.audio && this.initd) {
            if (immediate || (this._volume<=0)) {
                this.isStopping = false;
                this.isPaused = true;
                this.audio.stop();
            }
            else {
                if (!Stage.isCordova) {
                    if (!this.isStopping) {
                        this.audio.fade(this._volume+this._adjust,0,3000);
                        this.audio.once('fade', (id) => { this._volume=0; });
                    }
                }
                else {
                    this._volume = Math.max(0, this._volume+this._adjust-Math.max(0.01, this._volume/4));
                    this.audio.setVolume(this._volume);
                }
                this.isStopping = true;
            }
        }
    }
    pause() {
        if (this.audio && this.initd) {
            this.audio.pause();
            this.isPaused = true;
        }
    }
    seek(pos) { // WebGL changed: pos in 0.0-1.0
        if (this.audio && this.initd) {
            if (!Stage.isCordova)
                this.audio.seek(pos*this.audio.duration());
            else
                this.audio.seekTo(pos*this.audio.getDuration());
        }
    }
    rewind() {
        this.seek(0);
    }
    silence() {
        if (this.audio && this.initd) {
            if (!Stage.isCordova)
                this.audio.mute(true);
            else
                this.audio.setVolume(0);
        }
    }
    free() {
        if (!Stage.isCordova)
            this.audio.unload();
        else
            this.audio.release();
    }
}
///////////////////////////////////////////////////////////////////////////////
// Movie class
///////////////////////////////////////////////////////////////////////////////
class Movie {
    constructor() {
        this.initd = false;
        this.src = null;
        this.movie = document.createElement('video');
        this.isStopping = false;
        this.pos = new Vector2d(0,0);
        //this.parent = 0;
        this.redraw = false;
        
        this.glSprite = new PIXI.Sprite();
        this.glSubScene = Stage.glSubScene[5];
        this.glSubScene.addChild(this.glSprite);
    }
    load(src) {
        this.src = src;
        Stage.pause = true;
        Stage.glManager.addQueue([this.src], true, 
            (resources, init) => {
                this.glSprite.texture = PIXI.Texture.fromVideo(resources[this.src].data);
                this.movie = resources[this.src].data;
                //this.movie.autoplay = false;
                
                let aspectratio = this.glSprite.width/this.glSprite.height;
                this.glSprite.anchor.set(0.5, 0.5);
                this.glSprite.position.set(Stage.canvas.width>>1, Stage.canvas.height>>1);
                this.glSprite.width = Config.movieSize * Stage.canvas.width;
                this.glSprite.height = this.glSprite.width/aspectratio;
                Helper.addEvent(this.movie, 'ended', () => {
                    this.isStopping = true;
                }, false);
                //Helper.addEvent(this.movie, 'loadeddata', () => {
                //    Stage.pause = false;
                //}, false);
            }
        );
    }
    play() {
        if (this.initd) return;
        this.initd = true;
        this.movie.autoplay = true;
        this.movie.volume = Config.volumeVideo;        
        this.redraw = true;
    }
    stop(init=false) {
        if (this.movie && this.initd) {
            this.movie.pause();
            this.movie = null;
            this.glSprite.destroy();

            this.redraw = false;
            Stage.pause = false;
        }
    }
    mute(mute) {
        if (this.movie)
            this.movie.muted = mute;
    }
    Draw() {
        if (!this.initd) return false;
        if (!this.redraw) return false;
        this.glSprite.visible = true;
        // return true to redraw while video is playing
        return true;
    }
}