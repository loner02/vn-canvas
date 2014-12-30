///////////////////////////////////////////////////////////////////////////////
// Directives
///////////////////////////////////////////////////////////////////////////////
"use strict";

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
	if (!document.createElement('audio').canPlayType) return;
	
	if (param.bgm)
		Helper.processAudio (Stage.sounds[0], param.bgm, param);
	if (param.bgs)
		Helper.processAudio (Stage.sounds[1], param.bgs, param);
	if (param.se)
		Helper.processAudio (Stage.sounds[2], param.se, param);
}
// video - plays a video (cutscene, etc.)
function video(param) {
	if (!document.createElement('video').canPlayType) return;
	
	var mimeType = {"mp4": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"m4v": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					"ogg": 'video/ogg; codecs="theora, vorbis"',
					"ogv": 'video/ogg; codecs="theora, vorbis"',
					"webm": 'video/webm; codecs="vp8, vorbis"',
					"webmv": 'video/webm; codecs="vp8, vorbis"'};
	var v = new Movie();
	v.src = null;
	var videoformat = (param.format) ? param.format : Config.movieFormat;
	for (var i in videoformat) {
		if (v.movie.canPlayType(mimeType[videoformat[i]]) != '') {
			v.src = Helper.parseArg(param.src) + '.' + videoformat[i];
			break;
		}
	}	
	Stage.videos.push(v);
	Stage.pause = true;
	v = null;
}

function Sounds() {
	this.initd = false;
	this.src = 0;
	this.audio = new Audio();
	this.repeat = -1;
	this.delay = 0;
	this.isStopping = false;
	this.isPaused = false;
}
Sounds.prototype.Play = function(init) {
	var that = this;
	if (init && this.initd) return;
	if ((this.audio != null) &&
		(this.src != null)) {
		if (init) {
			this.audio.src = this.src;
			Helper.addEvent(this.audio, 'ended', function(e) {
				if (that.repeat > 0) {
					that.Play(false);
					that.repeat--;
				}
				else if (that.repeat < 0) {
					that.Play(false);
				}
				else {
					that.isPaused = true;
				}
			}, false);
			this.audio.volume = Config.volumeAudio;
			if (!this.isPaused) {
				if (this.delay > 0)
					setTimeout(function() {
						if (!that.isPaused && !that.isStopping)
							that.audio.play();
					}, this.delay * 1000);
				else
					this.audio.play();
			}
			this.initd = true;
		}
		else {
			this.audio.volume = Config.volumeAudio;
			this.isPaused = false;
			if (this.delay > 0)
				setTimeout(function() {
					if (!that.isPaused && !that.isStopping)
						that.audio.play();
				}, this.delay * 1000);
			else
				this.audio.play();
		}
	}
}
Sounds.prototype.Stop = function(immediate) {
	if ((this.audio != null) &&	(this.initd)) {
		this.isStopping = true;
		if ((immediate) || (this.audio.volume <= 0)) {
			this.audio.pause();
			this.audio.currentTime = 0;
			this.isStopping = false;
			this.isPaused = true;
		}
		else {
			this.audio.volume = Math.max(0, this.audio.volume-Math.max(0.01, this.audio.volume/4));
		}
	}
}
Sounds.prototype.Pause = function() {
	if ((this.audio != null) && (this.initd)) {
		this.audio.pause();
		this.isPaused = true;
	}
}
Sounds.prototype.Seek = function(pos) {
	if ((this.audio != null) && (this.initd)) {
		this.audio.currentTime = pos;
	}
}
Sounds.prototype.Rewind = function() {
	if ((this.audio != null) &&	(this.initd)) {
		this.audio.currentTime = 0;
	}
}
Sounds.prototype.Mute = function(mute) {
	if (this.audio != null) {
		this.audio.muted = mute;
	}
}
function Movie() {
	this.initd = false;
	this.src = 0;
	this.movie = document.createElement('video');
	this.isStopping = false;
	this.pos = new Vector2d(0,0);
	this.parent = 0;
}
Movie.prototype.Play = function() {
	var that = this;
	if (this.initd)	return;
	if ((this.movie != null) && 
		(this.src != null)) {
		Helper.addEvent(this.movie, 'ended', function(){
			that.isStopping = true;
		}, false);
		if (!Config.movieOnCanvas) {
			Helper.addEvent(this.movie, 'mouseup', function(e) {
				if (e.which != 1) return;
				that.isStopping = true;
			}, false);
			Helper.addEvent(this.movie, 'touchend', function(e) {
				e.preventDefault();
				that.isStopping = true;
			}, false);

			this.pos.vx = Stage.canvas.offsetLeft;
			this.pos.vy = Stage.canvas.offsetTop;
		}
		this.movie.src = this.src;
		this.movie.width = Config.movieSize * Stage.canvas.width;
		this.movie.height = Config.movieSize * Stage.canvas.height;
		this.pos.vx += (Stage.canvas.width - this.movie.width)>>1; 
		this.pos.vy += (Stage.canvas.height - this.movie.height)>>1; 

		this.initd = true;
		this.movie.autoplay = true;
		this.movie.volume = Config.volumeVideo;
		if (!Config.movieOnCanvas) {
			this.movie.setAttribute('style', 'position:absolute; left:'+this.pos.vx+'px; top:'+this.pos.vy+'px');
			this.parent = Stage.canvas.parentElement;
			this.parent.appendChild(this.movie);
		}
	}
}
Movie.prototype.Stop = function(init) {
	if ((this.movie != null) && (this.initd)) {
		this.movie.pause();
		if (!Config.movieOnCanvas)
			this.parent.removeChild(this.movie);
		this.movie = null;
		Stage.pause = false;
	}
}
Movie.prototype.Mute = function(mute) {
	if (this.movie != null) {
		this.movie.muted = mute;
	}
}
