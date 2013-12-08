( function( mw, $, kWidget ) {"use strict";

	mw.PluginManager.add( 'chromecast', mw.KBaseScreen.extend({
		
		defaultConfig: {
			"appId":"DB6462E9",
			"parent": "controlsContainer",
			"order": 71,
			"displayImportance": 'low',
			"align": "right",
			"showTooltip": true,
			"webDebugMode": false,
			"tempalte": null,
			"templatePath": 'chromecastStates.tmpl.html'
		},
		
		isDisabled: false,
		setup: function(){
			var _this = this;
			var onMediaStatusUpdate = function(e){
				console.log("onMediaStatusUpdate" + e);
			}

			var mediaCommandSuccessCallback = function(info, e){
				console.log(info);
				e.media = _this.currentMedia.media;
				_this.currentMedia = e;
			}
			// Player ready bindings: 
			this.bind('playerReady', function(){
				// Reset our items data
				_this.templateData = null;
			});
			this.bind('playing',function(){
				_this.isPlaying = true;
			});
			this.bind('pause',function(){
				_this.isPlaying = false;
			});

			
			this.initializeCastApi();
			


		},
		initializeCastApi:function(){
			var sessionRequest = new chrome.cast.SessionRequest(this.getConfig("appId")); // 'Castv2Player'
			var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
				this.sessionListener,
				this.receiverListener);

			chrome.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
		},
		onError:function(e){
			debugger;
			console.error(e);
		},
		onInitSuccess: function (){
			 debugger;
		},
		sessionListener: function(e){
			console.log(e);
		},
		receiverListener:function(e){
			console.log(e);
		},
		getComponent: function() {
			var _this = this;
			if( !this.$el ) {
				var $menu = $( '<ul />' );
				var $button = $( '<button />' )
								.addClass( 'btn chromecast-icon' )
								.attr('title', 'Chromecast')
								.click( function(e){
									_this.requestSession();
								});

				this.$el = $( '<div />' )
								.addClass( 'dropup' + this.getCssClass() )
								.append( $button, $menu );
			}
			return this.$el;
		},
		requestSession:function(){
			var _this = this;
			var  onRequestSessionSuccess = function(e){
				console.log(e);
				_this.session =e;
				debugger;
				 var videoSoruce =  _this.embedPlayer.getSource();
				_this.loadMedia(videoSoruce);

			}
			chrome.cast.requestSession(onRequestSessionSuccess, this.onLaunchError);
		},
		loadMedia:function(mediaSource) {
			var _this= this;
			var onMediaStatusUpdate = function(e){
				console.log("onMediaStatusUpdate" + e);
			}
			if (!this.session) {
				console.log("no session");
				return;
			}
			var currentMediaURL = mediaSource.src;
			console.log("loading..." + currentMediaURL);
			var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL);
			mediaInfo.contentType = 'video/mp4';
			var request = new chrome.cast.media.LoadRequest(mediaInfo);
			request.autoplay = false;
			request.currentTime = 0;
			debugger;
			if (this.isPlaying)  {
				request.currentTime = this.getPlayer().currentTime;
				_this.getPlayer().sendNotification('doPause');
			}
			var payload = {
				"title:" :"test",
				"thumb" : this.embedPlayer.poster
			};

			var json = {
				"payload" : payload
			};

			request.customData = json;


			var onLoadMediaSuccess = function(e){
				console.log("new media session ID:" + e.mediaSessionId);
				_this.currentMedia = e;
				_this.currentMedia.addListener(onMediaStatusUpdate);
				_this.mediaCurrentTime = _this.currentMedia.currentTime;
				//document.getElementById("casticon").src = 'images/cast_icon_active.png';
				_this.getPlayer().updatePosterHTML();

				_this.getPlayer().playerElement = new mw.PlayerElementCast();
				_this.getPlayer().playerElement.init(_this.currentMedia);
				_this.getPlayer().applyMediaElementBindings();
				if (_this.isPlaying){
					_this.getPlayer().sendNotification('doPlay');
				}
				debugger;
			}
			var onMediaError =function(e){
				console.error(e);

			}
			chrome.cast.media.loadMedia(this.session, request,
				onLoadMediaSuccess,
				onMediaError);

			},

			onLaunchError:function(e){
				console.error(e);
		},
		getBtn: function(){
			return this.getComponent().find( 'button' );
		},
		onEnable: function(){
			this.isDisabled = false;
			this.getBtn().removeClass( 'disabled' );
		},
		onDisable: function(){
			this.isDisabled = true;
			this.getComponent().removeClass( 'open' );
			this.getBtn().addClass( 'disabled' );
		}
	}));

} )( window.mw, window.jQuery, kWidget );