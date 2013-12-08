( function( mw, $ ) {"use strict";

// Class defined in resources/class/class.js
	mw.PlayerElementCast = mw.PlayerElement.extend({
		jsReadyFunName: 'elementJsReadyFunc',
		playerElement: null,
		currentTime: 0,
		duration: 0,
		paused: true,
		muted: false,
		volume: 1,
		id: null,
		readyState: 0,
		disabled: false,
		//counter for listneres function names, in case we want to subscribe more than one func to the same kdp notification
		listenerCounter: 0,
		targetObj: null,
		currentMedia:null,
		stepTime:1,
		intervalId:null,
		linkedPlayer:true,
		/**
		 * initialize the class, creates flash embed
		 * @param containerId container for the flash embed
		 * @param playerId id of the object to create
		 * @param elementFlashvars additional flashvars to pass to the flash object
		 * @param target target class to run subscribed functions on
		 * @param readyCallback to run when player is ready
		 * @returns {*}
		 */
		init: function( currentMedia ){
			if (currentMedia){
				var _this = this;
				this.currentMedia = currentMedia;
				this.duration = currentMedia.media.duration;
			}

			return this;
		},

		play: function(){
			var _this = this;
			var onMediaStatusUpdate = function(e){
				console.log("onMediaStatusUpdate" + e);
				_this.currentTime = e.currentTime;
				if (!_this.intervalId ){
					_this.intervalId =  setInterval(function(){
						if(!_this.paused)
						_this.currentTime = _this.currentTime + 0.1;

					},100)
				}
			};
			var mediaCommandSuccessCallback = function(info,e){
				console.log(info);
				e.media = _this.currentMedia.media;
				_this.currentMedia = e;
				_this.paused = false;
				$( _this ).trigger( 'playing' );


			};
			if (_this.currentMedia) {
				_this.currentMedia.play(null,
					mediaCommandSuccessCallback.bind(this,"playing started for " + _this.currentMedia.sessionId),
					_this.onError);
				_this.currentMedia.addListener(onMediaStatusUpdate);
			}
		},
		pause: function(){

			var onMediaStatusUpdate = function(e){
				console.log("onMediaStatusUpdate" + e);

			};
			var mediaCommandSuccessCallback = function(info,e){
				console.log(info);
				e.media = _this.currentMedia.media;
				_this.currentMedia = e;
				_this.paused = true;
				clearInterval(_this.intervalId);
				_this.intervalId = null;
			};
			var _this = this;
			if (_this.currentMedia) {
				_this.currentMedia.pause(null,
					mediaCommandSuccessCallback.bind(this,"playing started for " + _this.currentMedia.sessionId),
					_this.onError);
				_this.currentMedia.addListener(onMediaStatusUpdate);
			}
		},
		seek: function( val ){
			this.sendNotification( 'doSeek', val );
			$( this ).trigger( 'seeking' );
		},
		load: function(){
			if ( this.playerElement ) {
				this.sendNotification('changeMedia', {'entryUrl': this.src}) ;
			} else {
				$( this ).bind('playerJsReady', function(){
					this.sendNotification('changeMedia', {'entryUrl': this.src}) ;
				});
			}
		},
		changeVolume: function( volume ){
			this.sendNotification( 'changeVolume', volume );
		},
		sendNotification: function ( noteName, value ) {
			if ( this.playerElement && !this.disabled ) {
				this.playerElement.sendNotification( noteName, value ) ;
			}
		},
		setKDPAttribute: function( obj, property, value ) {
			if ( this.playerElement && !this.disabled ) {
				this.playerElement.setKDPAttribute( obj, property, value );
			}
		},
		addJsListener: function( eventName, methodName ) {
			if ( this.playerElement ) {
				this.bindPlayerFunction( eventName, methodName );
			}
		},
		getCurrentTime: function() {
			if ( this.playerElement ) {
				return this.playerElement.getCurrentTime();
			}
			return null;
		},
		/**
		 * add js listener for the given callback. Creates generic methodName and adds it to this playerElement
		 * @param callback to call
		 * @param eventName notification name to listen for
		 */
		subscribe: function ( callback, eventName ) {
			if ( this.playerElement ) {
				var methodName = eventName + this.listenerCounter;
				this.listenerCounter++;
				this.targetObj[methodName] = callback;

				this.bindPlayerFunction( eventName, methodName );
			}

		},
		/**
		 * Bind a Player Function,
		 *
		 * Build a global callback to bind to "this" player instance:
		 *
		 * @param {String}
		 *			flash binding name
		 * @param {String}
		 *			function callback name
		 *
		 *@param {object}
		 * 		target object to call the listening func from
		 */
		bindPlayerFunction : function(bindName, methodName, target) {
		},
		onUpdatePlayhead : function ( playheadVal ) {
			this.currentTime = playheadVal;
		},
		onPause : function() {
			this.paused = true;
			//TODO trigger event?
		},
		onPlay : function() {
			this.paused = false;
			$( this ).trigger( 'playing' );
		},
		onDurationChange : function( data, id ) {
			this.duration = data.newValue;
			$( this ).trigger( 'loadedmetadata' );
		},
		onClipDone : function() {
			$( this ).trigger( 'ended' );
		},
		onPlayerSeekEnd: function() {
			$( this ).trigger( 'seeked' );
		},
		onAlert : function ( data, id ) {
			//TODO?
		},
		onMute: function () {
			this.muted = true;
		},
		onUnMute: function () {
			this.muted = false;
		},
		onVolumeChanged: function ( data ) {
			this.volume = data.newVolume;
			$( this).trigger( 'volumechange' );
		}
	});

} )( window.mw, jQuery );

