mw.loader.implement("MD5", function($) {
	window.MD5 = function(string) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}
		function AddUnsigned(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}
		function F(x, y, z) {
			return (x & y) | ((~x) & z);
		}
		function G(x, y, z) {
			return (x & z) | (y & (~z));
		}
		function H(x, y, z) {
			return (x ^ y ^ z);
		}
		function I(x, y, z) {
			return (y ^ (x | (~z)));
		}
		function FF(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function GG(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function HH(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function II(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		};

		function WordToHex(lValue) {
			var WordToHexValue = "",
				WordToHexValue_temp = "",
				lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
			}
			return WordToHexValue;
		};

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		};
		var x = Array();
		var k, AA, BB, CC, DD, a, b, c, d;
		var S11 = 7,
			S12 = 12,
			S13 = 17,
			S14 = 22;
		var S21 = 5,
			S22 = 9,
			S23 = 14,
			S24 = 20;
		var S31 = 4,
			S32 = 11,
			S33 = 16,
			S34 = 23;
		var S41 = 6,
			S42 = 10,
			S43 = 15,
			S44 = 21;
		string = Utf8Encode(string);
		x = ConvertToWordArray(string);
		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;
		for (k = 0; k < x.length; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = AddUnsigned(a, AA);
			b = AddUnsigned(b, BB);
			c = AddUnsigned(c, CC);
			d = AddUnsigned(d, DD);
		}
		var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
		return temp.toLowerCase();
	};;
}, {}, {});
mw.loader.implement("acCheck", function($) {
	(function(mw, $) {
		"use strict";
		var acCheck = function(embedPlayer) {
			var ac = embedPlayer.kalturaAccessControl;
			var acStatus = kWidgetSupport.getAccessControlStatus(ac, embedPlayer);
			if (acStatus !== true) {
				embedPlayer.setError(acStatus);
				return;
			}
		};
		mw.addKalturaConfCheck(function(embedPlayer, callback) {
			if (embedPlayer.kalturaAccessControl) {
				acCheck(embedPlayer);
			}
			callback();
		});
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("acPreview", function($) {
	(function(mw, $) {
		"use strict";
		var acPreview = function(embedPlayer) {
			function acEndPreview() {
				mw.log('KWidgetSupport:: acEndPreview >');
				$(embedPlayer).trigger('KalturaSupport_FreePreviewEnd');
				mw.log('KWidgetSupport:: KalturaSupport_FreePreviewEnd set onDoneInterfaceFlag = false');
				embedPlayer.onDoneInterfaceFlag = false;
				var closeAcMessage = function() {
					$(embedPlayer).unbind('.acpreview');
					embedPlayer.controlBuilder.closeMenuOverlay();
					embedPlayer.onClipDone();
				};
				$(embedPlayer).bind('onChangeMedia.acpreview', closeAcMessage);
				if (embedPlayer.getKalturaConfig('', 'disableAlerts') !== true) {
					embedPlayer.controlBuilder.displayMenuOverlay($('<div />').append($('<h3 />').append(embedPlayer.getKalturaMsg('FREE_PREVIEW_END_TITLE')), $('<span />').text(embedPlayer.getKalturaMsg('FREE_PREVIEW_END')), $('<br />'), $('<br />'), $('<button />').attr({
						'type': "button"
					}).addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only").append($('<span />').addClass("ui-button-text").text('Ok').css('margin', '10')).click(closeAcMessage)), closeAcMessage);
				}
			};
			$(embedPlayer).unbind('.acPreview');
			var ac = embedPlayer.kalturaAccessControl;
			if (ac.isAdmin === false && ac.isSessionRestricted === true && ac.previewLength && ac.previewLength != -1) {
				$(embedPlayer).bind('postEnded.acPreview', function() {
					acEndPreview(embedPlayer);
				});
				$(embedPlayer).bind('monitorEvent.acPreview', function() {
					if (embedPlayer.currentTime >= ac.previewLength) {
						embedPlayer.stop();
						if (mw.isIOS()) {
							embedPlayer.getPlayerElement().webkitExitFullScreen();
						}
						acEndPreview(embedPlayer);
					}
				});
			}
		};
		mw.addKalturaConfCheck(function(embedPlayer, callback) {
			if (embedPlayer.kalturaAccessControl) {
				acPreview(embedPlayer);
			}
			callback();
		});
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("base64_encode", function($) {
	window['base64_encode'] = function(data) {
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			enc = "",
			tmp_arr = [];
		if (!data) {
			return data;
		}
		data = utf8_encode(data + '');
		do {
			o1 = data.charCodeAt(i++);
			o2 = data.charCodeAt(i++);
			o3 = data.charCodeAt(i++);
			bits = o1 << 16 | o2 << 8 | o3;
			h1 = bits >> 18 & 0x3f;
			h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;
			tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
		} while (i < data.length);
		enc = tmp_arr.join('');
		var r = data.length % 3;
		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	};;
}, {}, {});
mw.loader.implement("controlbarLayout", function($) {
	(function(mw, $) {
		"use strict";
		var controlbarLayout = function(embedPlayer) {
			var disabled = [];
			var $uiConf = embedPlayer.$uiConf;
			if (embedPlayer.getKalturaConfig('ControllerScreenHolder') && embedPlayer.getKalturaConfig('ControllerScreenHolder').visible === false) {
				embedPlayer.controls = false;
			}
			if (!$uiConf.find('#playBtnControllerScreen').length) {}
			if (!$uiConf.find('Timer').length && ($.browser.msie && parseInt($.browser.version) >= 9)) {
				disabled.push('timeDisplay');
			}
			if (!$uiConf.find('#scrubberContainer').length) {}
			if (!$uiConf.find('VolumeBar').length) {
				disabled.push('volumeControl');
			}
			if (!$uiConf.find('#fullScreenBtnControllerScreen').length) {
				disabled.push('fullscreen');
			}
			if (!$uiConf.find('#onVideoPlayBtnStartScreen').length) {
				disabled.push('playButtonLarge');
			}
			if (mw.getConfig("EmbedPlayer.EnableFlavorSelector") === false) {
				disabled.push('sourceSwitch');
			} else {
				if (!embedPlayer.isPluginEnabled('flavorComboControllerScreen')) {
					disabled.push('sourceSwitch');
				}
			}
			$(embedPlayer).bind('updateFeatureSupportEvent', function(e, supports) {
				for (var i = 0; i < disabled.length; i++) {
					var comm = disabled[i];
					supports[comm] = false;
				}
			});
			$(embedPlayer).bind('addControlBarComponent', function(event, controlBuilder) {
				if (!embedPlayer.getKalturaConfig('shareBtnControllerScreen', 'kClick')) {
					delete controlBuilder.optionMenuItems['share'];
				}
			});
		};
		mw.addKalturaConfCheck(function(embedPlayer, callback) {
			controlbarLayout(embedPlayer);
			callback();
		});
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("faderPlugin", function($) {
	(function(mw, $) {
		"use strict";
		var faderPlugin = function(embedPlayer) {
			var target = embedPlayer.getRawKalturaConfig('fader', 'target');
			if (target == "{controllersVbox}" || target == "{controlsHolder}" || target == "{controllerVertical}") {
				embedPlayer.overlaycontrols = true;
			} else {
				embedPlayer.overlaycontrols = false;
			}
		};
		mw.addKalturaConfCheck(function(embedPlayer, callback) {
			faderPlugin(embedPlayer);
			callback();
		});
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("fullScreenApi", function($) {
	(function() {
		var fullScreenApi = {
			supportsFullScreen: false,
			isFullScreen: function() {
				return false;
			},
			requestFullScreen: function() {},
			cancelFullScreen: function() {},
			fullScreenEventName: '',
			prefix: ''
		}, browserPrefixes = 'webkit moz o ms khtml'.split(' ');
		if (typeof document.cancelFullScreen != 'undefined') {
			fullScreenApi.supportsFullScreen = true;
		} else {
			for (var i = 0, il = browserPrefixes.length; i < il; i++) {
				fullScreenApi.prefix = browserPrefixes[i];
				if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
					fullScreenApi.supportsFullScreen = true;
					break;
				}
			}
		}
		if (fullScreenApi.supportsFullScreen) {
			fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
			fullScreenApi.isFullScreen = function(doc) {
				if (!doc) {
					doc = document;
				}
				switch (this.prefix) {
					case '':
						return doc.fullScreen;
					case 'webkit':
						return doc.webkitIsFullScreen;
					default:
						return doc[this.prefix + 'FullScreen'];
				}
			}
			fullScreenApi.requestFullScreen = function(el) {
				return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
			}
			fullScreenApi.cancelFullScreen = function(el, doc) {
				if (!doc) {
					doc = document;
				}
				return (this.prefix === '') ? doc.cancelFullScreen() : doc[this.prefix + 'CancelFullScreen']();
			}
		}
		if (typeof jQuery != 'undefined') {
			jQuery.fn.requestFullScreen = function() {
				return this.each(function() {
					var el = jQuery(this);
					if (fullScreenApi.supportsFullScreen) {
						fullScreenApi.requestFullScreen(el);
					}
				});
			};
		}
		window.fullScreenApi = fullScreenApi;
	})();;
}, {}, {});
mw.loader.implement("iScroll", function($) {
	(function() {
		var m = Math,
			vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : 'opera' in window ? 'O' : '',
			has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
			hasTouch = 'ontouchstart' in window,
			hasTransform = vendor + 'Transform' in document.documentElement.style,
			isAndroid = (/android/gi).test(navigator.appVersion),
			isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
			isPlaybook = (/playbook/gi).test(navigator.appVersion),
			hasTransitionEnd = isIDevice || isPlaybook,
			nextFrame = (function() {
				return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
					return setTimeout(callback, 1);
				}
			})(),
			cancelFrame = (function() {
				return window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
			})(),
			RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			START_EV = hasTouch ? 'touchstart' : 'mousedown',
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
			END_EV = hasTouch ? 'touchend' : 'mouseup',
			CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
			WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',
			trnOpen = 'translate' + (has3d ? '3d(' : '('),
			trnClose = has3d ? ',0)' : ')',
			iScroll = function(el, options) {
				var that = this,
					doc = document,
					i;
				that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
				that.wrapper.style.overflow = 'hidden';
				that.scroller = that.wrapper.children[0];
				that.options = {
					hScroll: true,
					vScroll: true,
					x: 0,
					y: 0,
					bounce: true,
					bounceLock: false,
					momentum: true,
					lockDirection: true,
					useTransform: true,
					useTransition: false,
					topOffset: 0,
					checkDOMChanges: false,
					hScrollbar: true,
					vScrollbar: true,
					fixedScrollbar: isAndroid,
					hideScrollbar: isIDevice,
					fadeScrollbar: isIDevice && has3d,
					scrollbarClass: '',
					zoom: false,
					zoomMin: 1,
					zoomMax: 4,
					doubleTapZoom: 2,
					wheelAction: 'scroll',
					snap: false,
					snapThreshold: 1,
					onRefresh: null,
					onBeforeScrollStart: function(e) {
						e.preventDefault();
					},
					onScrollStart: null,
					onBeforeScrollMove: null,
					onScrollMove: null,
					onBeforeScrollEnd: null,
					onScrollEnd: null,
					onTouchEnd: null,
					onDestroy: null,
					onZoomStart: null,
					onZoom: null,
					onZoomEnd: null
				};
				if (that.zoom && isAndroid) {
					trnOpen = 'translate(';
					trnClose = ')';
				}
				for (i in options) that.options[i] = options[i];
				that.x = that.options.x;
				that.y = that.options.y;
				that.options.useTransform = hasTransform ? that.options.useTransform : false;
				that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
				that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
				that.options.zoom = that.options.useTransform && that.options.zoom;
				that.options.useTransition = hasTransitionEnd && that.options.useTransition;
				that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
				that.scroller.style[vendor + 'TransitionDuration'] = '0';
				that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
				if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
				if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;
				else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';
				if (that.options.useTransition) that.options.fixedScrollbar = true;
				that.refresh();
				that._bind(RESIZE_EV, window);
				that._bind(START_EV);
				if (!hasTouch) {
					that._bind('mouseout', that.wrapper);
					that._bind(WHEEL_EV);
				}
				if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function() {
					that._checkDOMChanges();
				}, 500);
			};
		iScroll.prototype = {
			enabled: true,
			x: 0,
			y: 0,
			steps: [],
			scale: 1,
			currPageX: 0,
			currPageY: 0,
			pagesX: [],
			pagesY: [],
			aniTime: null,
			wheelZoomCount: 0,
			handleEvent: function(e) {
				var that = this;
				switch (e.type) {
					case START_EV:
						if (!hasTouch && e.button !== 0) return;
						that._start(e);
						break;
					case MOVE_EV:
						that._move(e);
						break;
					case END_EV:
					case CANCEL_EV:
						that._end(e);
						break;
					case RESIZE_EV:
						that._resize();
						break;
					case WHEEL_EV:
						that._wheel(e);
						break;
					case 'mouseout':
						that._mouseout(e);
						break;
					case 'webkitTransitionEnd':
						that._transitionEnd(e);
						break;
				}
			},
			_checkDOMChanges: function() {
				if (this.moved || this.zoomed || this.animating || (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;
				this.refresh();
			},
			_scrollbar: function(dir) {
				var that = this,
					doc = document,
					bar;
				if (!that[dir + 'Scrollbar']) {
					if (that[dir + 'ScrollbarWrapper']) {
						if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';
						that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
						that[dir + 'ScrollbarWrapper'] = null;
						that[dir + 'ScrollbarIndicator'] = null;
					}
					return;
				}
				if (!that[dir + 'ScrollbarWrapper']) {
					bar = doc.createElement('div');
					if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
					else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');
					bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');
					that.wrapper.appendChild(bar);
					that[dir + 'ScrollbarWrapper'] = bar;
					bar = doc.createElement('div');
					if (!that.options.scrollbarClass) {
						bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';
					}
					bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;
					if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';
					that[dir + 'ScrollbarWrapper'].appendChild(bar);
					that[dir + 'ScrollbarIndicator'] = bar;
				}
				if (dir == 'h') {
					that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
					that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
					that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
					that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
					that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
				} else {
					that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
					that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
					that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
					that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
					that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
				}
				that._scrollbarPos(dir, true);
			},
			_resize: function() {
				var that = this;
				setTimeout(function() {
					that.refresh();
				}, isAndroid ? 200 : 0);
			},
			_pos: function(x, y) {
				x = this.hScroll ? x : 0;
				y = this.vScroll ? y : 0;
				if (this.options.useTransform) {
					this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
				} else {
					x = m.round(x);
					y = m.round(y);
					this.scroller.style.left = x + 'px';
					this.scroller.style.top = y + 'px';
				}
				this.x = x;
				this.y = y;
				this._scrollbarPos('h');
				this._scrollbarPos('v');
			},
			_scrollbarPos: function(dir, hidden) {
				var that = this,
					pos = dir == 'h' ? that.x : that.y,
					size;
				if (!that[dir + 'Scrollbar']) return;
				pos = that[dir + 'ScrollbarProp'] * pos;
				if (pos < 0) {
					if (!that.options.fixedScrollbar) {
						size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
						if (size < 8) size = 8;
						that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
					}
					pos = 0;
				} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
					if (!that.options.fixedScrollbar) {
						size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
						if (size < 8) size = 8;
						that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
						pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
					} else {
						pos = that[dir + 'ScrollbarMaxScroll'];
					}
				}
				that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';
				that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
				that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
			},
			_start: function(e) {
				var that = this,
					point = hasTouch ? e.touches[0] : e,
					matrix, x, y, c1, c2;
				if (!that.enabled) return;
				if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);
				if (that.options.useTransition || that.options.zoom) that._transitionTime(0);
				that.moved = false;
				that.animating = false;
				that.zoomed = false;
				that.distX = 0;
				that.distY = 0;
				that.absDistX = 0;
				that.absDistY = 0;
				that.dirX = 0;
				that.dirY = 0;
				if (that.options.zoom && hasTouch && e.touches.length > 1) {
					c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
					c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
					that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);
					that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
					that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				}
				if (that.options.momentum) {
					if (that.options.useTransform) {
						matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
						x = matrix[4] * 1;
						y = matrix[5] * 1;
					} else {
						x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
						y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
					}
					if (x != that.x || y != that.y) {
						if (that.options.useTransition) that._unbind('webkitTransitionEnd');
						else cancelFrame(that.aniTime);
						that.steps = [];
						that._pos(x, y);
					}
				}
				that.absStartX = that.x;
				that.absStartY = that.y;
				that.startX = that.x;
				that.startY = that.y;
				that.pointX = point.pageX;
				that.pointY = point.pageY;
				that.startTime = e.timeStamp || Date.now();
				if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);
				that._bind(MOVE_EV);
				that._bind(END_EV);
				that._bind(CANCEL_EV);
			},
			_move: function(e) {
				var that = this,
					point = hasTouch ? e.touches[0] : e,
					deltaX = point.pageX - that.pointX,
					deltaY = point.pageY - that.pointY,
					newX = that.x + deltaX,
					newY = that.y + deltaY,
					c1, c2, scale, timestamp = e.timeStamp || Date.now();
				if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);
				if (that.options.zoom && hasTouch && e.touches.length > 1) {
					c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
					c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
					that.touchesDist = m.sqrt(c1 * c1 + c2 * c2);
					that.zoomed = true;
					scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;
					if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
					else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);
					that.lastScale = scale / this.scale;
					newX = this.originX - this.originX * that.lastScale + this.x, newY = this.originY - this.originY * that.lastScale + this.y;
					this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';
					if (that.options.onZoom) that.options.onZoom.call(that, e);
					return;
				}
				that.pointX = point.pageX;
				that.pointY = point.pageY;
				if (newX > 0 || newX < that.maxScrollX) {
					newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
				}
				if (newY > that.minScrollY || newY < that.maxScrollY) {
					newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
				}
				if (that.absDistX < 6 && that.absDistY < 6) {
					that.distX += deltaX;
					that.distY += deltaY;
					that.absDistX = m.abs(that.distX);
					that.absDistY = m.abs(that.distY);
					return;
				}
				if (that.options.lockDirection) {
					if (that.absDistX > that.absDistY + 5) {
						newY = that.y;
						deltaY = 0;
					} else if (that.absDistY > that.absDistX + 5) {
						newX = that.x;
						deltaX = 0;
					}
				}
				that.moved = true;
				that._pos(newX, newY);
				that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
				that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
				if (timestamp - that.startTime > 300) {
					that.startTime = timestamp;
					that.startX = that.x;
					that.startY = that.y;
				}
				if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
			},
			_end: function(e) {
				if (hasTouch && e.touches.length != 0) return;
				var that = this,
					point = hasTouch ? e.changedTouches[0] : e,
					target, ev, momentumX = {
						dist: 0,
						time: 0
					}, momentumY = {
						dist: 0,
						time: 0
					}, duration = (e.timeStamp || Date.now()) - that.startTime,
					newPosX = that.x,
					newPosY = that.y,
					distX, distY, newDuration, snap, scale;
				that._unbind(MOVE_EV);
				that._unbind(END_EV);
				that._unbind(CANCEL_EV);
				if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);
				if (that.zoomed) {
					scale = that.scale * that.lastScale;
					scale = Math.max(that.options.zoomMin, scale);
					scale = Math.min(that.options.zoomMax, scale);
					that.lastScale = scale / that.scale;
					that.scale = scale;
					that.x = that.originX - that.originX * that.lastScale + that.x;
					that.y = that.originY - that.originY * that.lastScale + that.y;
					that.scroller.style[vendor + 'TransitionDuration'] = '200ms';
					that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';
					that.zoomed = false;
					that.refresh();
					if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
					return;
				}
				if (!that.moved) {
					if (hasTouch) {
						if (that.doubleTapTimer && that.options.zoom) {
							clearTimeout(that.doubleTapTimer);
							that.doubleTapTimer = null;
							if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
							that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
							if (that.options.onZoomEnd) {
								setTimeout(function() {
									that.options.onZoomEnd.call(that, e);
								}, 200);
							}
						} else {
							that.doubleTapTimer = setTimeout(function() {
								that.doubleTapTimer = null;
								target = point.target;
								while (target.nodeType != 1) target = target.parentNode;
								if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
									ev = document.createEvent('MouseEvents');
									ev.initMouseEvent('click', true, true, e.view, 1, point.screenX, point.screenY, point.clientX, point.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
									ev._fake = true;
									target.dispatchEvent(ev);
								}
							}, that.options.zoom ? 250 : 0);
						}
					}
					that._resetPos(200);
					if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
					return;
				}
				if (duration < 300 && that.options.momentum) {
					momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
					momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;
					newPosX = that.x + momentumX.dist;
					newPosY = that.y + momentumY.dist;
					if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = {
						dist: 0,
						time: 0
					};
					if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = {
						dist: 0,
						time: 0
					};
				}
				if (momentumX.dist || momentumY.dist) {
					newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);
					if (that.options.snap) {
						distX = newPosX - that.absStartX;
						distY = newPosY - that.absStartY;
						if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) {
							that.scrollTo(that.absStartX, that.absStartY, 200);
						} else {
							snap = that._snap(newPosX, newPosY);
							newPosX = snap.x;
							newPosY = snap.y;
							newDuration = m.max(snap.time, newDuration);
						}
					}
					that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);
					if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
					return;
				}
				if (that.options.snap) {
					distX = newPosX - that.absStartX;
					distY = newPosY - that.absStartY;
					if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
					else {
						snap = that._snap(that.x, that.y);
						if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
					}
					if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
					return;
				}
				that._resetPos(200);
				if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			},
			_resetPos: function(time) {
				var that = this,
					resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
					resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;
				if (resetX == that.x && resetY == that.y) {
					if (that.moved) {
						that.moved = false;
						if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
					}
					if (that.hScrollbar && that.options.hideScrollbar) {
						if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
						that.hScrollbarWrapper.style.opacity = '0';
					}
					if (that.vScrollbar && that.options.hideScrollbar) {
						if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
						that.vScrollbarWrapper.style.opacity = '0';
					}
					return;
				}
				that.scrollTo(resetX, resetY, time || 0);
			},
			_wheel: function(e) {
				var that = this,
					wheelDeltaX, wheelDeltaY, deltaX, deltaY, deltaScale;
				if ('wheelDeltaX' in e) {
					wheelDeltaX = e.wheelDeltaX / 12;
					wheelDeltaY = e.wheelDeltaY / 12;
				} else if ('detail' in e) {
					wheelDeltaX = wheelDeltaY = -e.detail * 3;
				} else {
					wheelDeltaX = wheelDeltaY = -e.wheelDelta;
				}
				if (that.options.wheelAction == 'zoom') {
					deltaScale = that.scale * Math.pow(2, 1 / 3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
					if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
					if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
					if (deltaScale != that.scale) {
						if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
						that.wheelZoomCount++;
						that.zoom(e.pageX, e.pageY, deltaScale, 400);
						setTimeout(function() {
							that.wheelZoomCount--;
							if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
						}, 400);
					}
					return;
				}
				deltaX = that.x + wheelDeltaX;
				deltaY = that.y + wheelDeltaY;
				if (deltaX > 0) deltaX = 0;
				else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;
				if (deltaY > that.minScrollY) deltaY = that.minScrollY;
				else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
				that.scrollTo(deltaX, deltaY, 0);
			},
			_mouseout: function(e) {
				var t = e.relatedTarget;
				if (!t) {
					this._end(e);
					return;
				}
				while (t = t.parentNode) if (t == this.wrapper) return;
				this._end(e);
			},
			_transitionEnd: function(e) {
				var that = this;
				if (e.target != that.scroller) return;
				that._unbind('webkitTransitionEnd');
				that._startAni();
			},
			_startAni: function() {
				var that = this,
					startX = that.x,
					startY = that.y,
					startTime = Date.now(),
					step, easeOut, animate;
				if (that.animating) return;
				if (!that.steps.length) {
					that._resetPos(400);
					return;
				}
				step = that.steps.shift();
				if (step.x == startX && step.y == startY) step.time = 0;
				that.animating = true;
				that.moved = true;
				if (that.options.useTransition) {
					that._transitionTime(step.time);
					that._pos(step.x, step.y);
					that.animating = false;
					if (step.time) that._bind('webkitTransitionEnd');
					else that._resetPos(0);
					return;
				}
				animate = function() {
					var now = Date.now(),
						newX, newY;
					if (now >= startTime + step.time) {
						that._pos(step.x, step.y);
						that.animating = false;
						if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);
						that._startAni();
						return;
					}
					now = (now - startTime) / step.time - 1;
					easeOut = m.sqrt(1 - now * now);
					newX = (step.x - startX) * easeOut + startX;
					newY = (step.y - startY) * easeOut + startY;
					that._pos(newX, newY);
					if (that.animating) that.aniTime = nextFrame(animate);
				};
				animate();
			},
			_transitionTime: function(time) {
				time += 'ms';
				this.scroller.style[vendor + 'TransitionDuration'] = time;
				if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
				if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
			},
			_momentum: function(dist, time, maxDistUpper, maxDistLower, size) {
				var deceleration = 0.0006,
					speed = m.abs(dist) / time,
					newDist = (speed * speed) / (2 * deceleration),
					newTime = 0,
					outsideDist = 0;
				if (dist > 0 && newDist > maxDistUpper) {
					outsideDist = size / (6 / (newDist / speed * deceleration));
					maxDistUpper = maxDistUpper + outsideDist;
					speed = speed * maxDistUpper / newDist;
					newDist = maxDistUpper;
				} else if (dist < 0 && newDist > maxDistLower) {
					outsideDist = size / (6 / (newDist / speed * deceleration));
					maxDistLower = maxDistLower + outsideDist;
					speed = speed * maxDistLower / newDist;
					newDist = maxDistLower;
				}
				newDist = newDist * (dist < 0 ? -1 : 1);
				newTime = speed / deceleration;
				return {
					dist: newDist,
					time: m.round(newTime)
				};
			},
			_offset: function(el) {
				var left = -el.offsetLeft,
					top = -el.offsetTop;
				while (el = el.offsetParent) {
					left -= el.offsetLeft;
					top -= el.offsetTop;
				}
				if (el != this.wrapper) {
					left *= this.scale;
					top *= this.scale;
				}
				return {
					left: left,
					top: top
				};
			},
			_snap: function(x, y) {
				var that = this,
					i, l, page, time, sizeX, sizeY;
				page = that.pagesX.length - 1;
				for (i = 0, l = that.pagesX.length; i < l; i++) {
					if (x >= that.pagesX[i]) {
						page = i;
						break;
					}
				}
				if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
				x = that.pagesX[page];
				sizeX = m.abs(x - that.pagesX[that.currPageX]);
				sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
				that.currPageX = page;
				page = that.pagesY.length - 1;
				for (i = 0; i < page; i++) {
					if (y >= that.pagesY[i]) {
						page = i;
						break;
					}
				}
				if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
				y = that.pagesY[page];
				sizeY = m.abs(y - that.pagesY[that.currPageY]);
				sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
				that.currPageY = page;
				time = m.round(m.max(sizeX, sizeY)) || 200;
				return {
					x: x,
					y: y,
					time: time
				};
			},
			_bind: function(type, el, bubble) {
				(el || this.scroller).addEventListener(type, this, !! bubble);
			},
			_unbind: function(type, el, bubble) {
				(el || this.scroller).removeEventListener(type, this, !! bubble);
			},
			destroy: function() {
				var that = this;
				that.scroller.style[vendor + 'Transform'] = '';
				that.hScrollbar = false;
				that.vScrollbar = false;
				that._scrollbar('h');
				that._scrollbar('v');
				that._unbind(RESIZE_EV, window);
				that._unbind(START_EV);
				that._unbind(MOVE_EV);
				that._unbind(END_EV);
				that._unbind(CANCEL_EV);
				if (that.options.hasTouch) {
					that._unbind('mouseout', that.wrapper);
					that._unbind(WHEEL_EV);
				}
				if (that.options.useTransition) that._unbind('webkitTransitionEnd');
				if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
				if (that.options.onDestroy) that.options.onDestroy.call(that);
			},
			refresh: function() {
				var that = this,
					offset, i, l, els, pos = 0,
					page = 0;
				if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
				that.wrapperW = that.wrapper.clientWidth || 1;
				that.wrapperH = that.wrapper.clientHeight || 1;
				that.minScrollY = -that.options.topOffset || 0;
				that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
				that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
				that.maxScrollX = that.wrapperW - that.scrollerW;
				that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
				that.dirX = 0;
				that.dirY = 0;
				if (that.options.onRefresh) that.options.onRefresh.call(that);
				that.hScroll = that.options.hScroll && that.maxScrollX < 0;
				that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);
				that.hScrollbar = that.hScroll && that.options.hScrollbar;
				that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;
				offset = that._offset(that.wrapper);
				that.wrapperOffsetLeft = -offset.left;
				that.wrapperOffsetTop = -offset.top;
				if (typeof that.options.snap == 'string') {
					that.pagesX = [];
					that.pagesY = [];
					els = that.scroller.querySelectorAll(that.options.snap);
					for (i = 0, l = els.length; i < l; i++) {
						pos = that._offset(els[i]);
						pos.left += that.wrapperOffsetLeft;
						pos.top += that.wrapperOffsetTop;
						that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
						that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
					}
				} else if (that.options.snap) {
					that.pagesX = [];
					while (pos >= that.maxScrollX) {
						that.pagesX[page] = pos;
						pos = pos - that.wrapperW;
						page++;
					}
					if (that.maxScrollX % that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length - 1] + that.pagesX[that.pagesX.length - 1];
					pos = 0;
					page = 0;
					that.pagesY = [];
					while (pos >= that.maxScrollY) {
						that.pagesY[page] = pos;
						pos = pos - that.wrapperH;
						page++;
					}
					if (that.maxScrollY % that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length - 1] + that.pagesY[that.pagesY.length - 1];
				}
				that._scrollbar('h');
				that._scrollbar('v');
				if (!that.zoomed) {
					that.scroller.style[vendor + 'TransitionDuration'] = '0';
					that._resetPos(200);
				}
			},
			scrollTo: function(x, y, time, relative) {
				var that = this,
					step = x,
					i, l;
				that.stop();
				if (!step.length) step = [{
					x: x,
					y: y,
					time: time,
					relative: relative
				}];
				for (i = 0, l = step.length; i < l; i++) {
					if (step[i].relative) {
						step[i].x = that.x - step[i].x;
						step[i].y = that.y - step[i].y;
					}
					that.steps.push({
						x: step[i].x,
						y: step[i].y,
						time: step[i].time || 0
					});
				}
				that._startAni();
			},
			scrollToElement: function(el, time) {
				var that = this,
					pos;
				el = el.nodeType ? el : that.scroller.querySelector(el);
				if (!el) return;
				pos = that._offset(el);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
				pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
				time = time === undefined ? m.max(m.abs(pos.left) * 2, m.abs(pos.top) * 2) : time;
				that.scrollTo(pos.left, pos.top, time);
			},
			scrollToPage: function(pageX, pageY, time) {
				var that = this,
					x, y;
				if (that.options.onScrollStart) that.options.onScrollStart.call(that);
				if (that.options.snap) {
					pageX = pageX == 'next' ? that.currPageX + 1 : pageX == 'prev' ? that.currPageX - 1 : pageX;
					pageY = pageY == 'next' ? that.currPageY + 1 : pageY == 'prev' ? that.currPageY - 1 : pageY;
					pageX = pageX < 0 ? 0 : pageX > that.pagesX.length - 1 ? that.pagesX.length - 1 : pageX;
					pageY = pageY < 0 ? 0 : pageY > that.pagesY.length - 1 ? that.pagesY.length - 1 : pageY;
					that.currPageX = pageX;
					that.currPageY = pageY;
					x = that.pagesX[pageX];
					y = that.pagesY[pageY];
				} else {
					x = -that.wrapperW * pageX;
					y = -that.wrapperH * pageY;
					if (x < that.maxScrollX) x = that.maxScrollX;
					if (y < that.maxScrollY) y = that.maxScrollY;
				}
				that.scrollTo(x, y, time || 400);
			},
			disable: function() {
				this.stop();
				this._resetPos(0);
				this.enabled = false;
				this._unbind(MOVE_EV);
				this._unbind(END_EV);
				this._unbind(CANCEL_EV);
			},
			enable: function() {
				this.enabled = true;
			},
			stop: function() {
				if (this.options.useTransition) this._unbind('webkitTransitionEnd');
				else cancelFrame(this.aniTime);
				this.steps = [];
				this.moved = false;
				this.animating = false;
			},
			zoom: function(x, y, scale, time) {
				var that = this,
					relScale = scale / that.scale;
				if (!that.options.useTransform) return;
				that.zoomed = true;
				time = time === undefined ? 200 : time;
				x = x - that.wrapperOffsetLeft - that.x;
				y = y - that.wrapperOffsetTop - that.y;
				that.x = x - x * relScale + that.x;
				that.y = y - y * relScale + that.y;
				that.scale = scale;
				that.refresh();
				that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
				that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;
				that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
				that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
				that.zoomed = false;
			},
			isReady: function() {
				return !this.moved && !this.zoomed && !this.animating;
			}
		};
		if (typeof exports !== 'undefined') exports.iScroll = iScroll;
		else window.iScroll = iScroll;
	})();;
}, {}, {});
mw.loader.implement("liveStreamPlugin", function($) {
	(function(mw, $) {
		"use strict";
		mw.addKalturaConfCheck(function(embedPlayer, callback) {
			if (embedPlayer.isLive()) {
				var liveStreamPlugin = {
					bindPostFix: '.liveStream',
					firstPlay: false,
					liveStreamStatusInterval: 30,
					defaultDVRWindow: 30 * 60,
					minDVRTime: 30,
					minDVRReached: false,
					vidStartTime: null,
					clockStartTime: null,
					lastTimeDisplayed: 0,
					init: function(embedPlayer) {
						this.log("Init");
						this.embedPlayer = embedPlayer;
						this.addLiveStreamStatusMonitor();
						this.addLiveStreamStatus();
						if (this.isDVR()) {
							this.dvrWindow = embedPlayer.evaluate('{mediaProxy.entry.dvrWindow}') * 60;
							if (!this.dvrWindow) {
								this.dvrWindow = this.defaultDVRWindow;
							}
							this.addScrubber();
							this.addTimeDisplay();
							this.addBackToLiveButton();
						}
						this.addPlayerBindings();
						this.extendApi();
					},
					isDVR: function() {
						return this.embedPlayer.evaluate('{mediaProxy.entry.dvrStatus}');
					},
					addPlayerBindings: function() {
						this.log("Adding player bindings");
						var _this = this;
						var embedPlayer = this.embedPlayer;
						embedPlayer.unbindHelper(_this.bindPostFix);
						embedPlayer.bindHelper('playerReady' + this.bindPostFix, function() {
							if (_this.isDVR()) {
								_this.hideLiveStreamStatus();
								_this.hideScrubber();
								_this.hideBackToLive();
								_this.disableLiveControls();
								embedPlayer.addPlayerSpinner();
								_this.getLiveStreamStatusFromAPI(function(onAirStatus) {
									_this.showLiveStreamStatus();
									embedPlayer.hideSpinner();
								});
								_this.switchDone = true;
								if (embedPlayer.sequenceProxy) {
									_this.switchDone = false;
								}
							}
						});
						embedPlayer.bindHelper('onplay' + this.bindPostFix, function() {
							if (_this.isDVR() && _this.switchDone) {
								_this.hideLiveStreamStatus();
								_this.removePausedMonitor();
							}
						});
						embedPlayer.bindHelper('onpause' + this.bindPostFix, function() {
							if (_this.isDVR() && _this.switchDone) {
								_this.disableLiveControls();
								_this.unsetLiveIndicator();
								embedPlayer.addPlayerSpinner();
								_this.getLiveStreamStatusFromAPI(function(onAirStatus) {
									_this.showLiveStreamStatus();
									if (onAirStatus) {
										_this.showBackToLive();
										_this.addPausedMonitor();
									}
									_this.enableLiveControls();
								});
							}
						});
						embedPlayer.bindHelper('liveStreamStatusUpdate' + this.bindPostFix, function(e, onAirObj) {
							_this.setLiveStreamStatus(_this.getLiveStreamStatusText());
							if (!_this.firstPlay || !_this.isDVR()) {
								_this.toggleLiveControls(onAirObj.onAirStatus);
							}
							if (_this.isDVR() && !onAirObj.onAirStatus) {
								_this.hideBackToLive();
							}
						});
						embedPlayer.bindHelper('firstPlay' + this.bindPostFix, function() {
							_this.firstPlay = true;
							if (_this.isDVR()) {
								var vid = embedPlayer.getPlayerElement();
								$(vid).bind('playing' + _this.bindPostFix, function() {
									$(vid).unbind('playing' + _this.bindPostFix);
									_this.onFirstPlay();
								});
								if (embedPlayer.sequenceProxy) {
									_this.onFirstPlay();
								}
							}
						});
						embedPlayer.bindHelper('AdSupport_PreSequenceComplete' + this.bindPostFix, function() {
							_this.switchDone = true;
						});
					},
					onFirstPlay: function() {
						this.setLiveIndicator();
						this.disableScrubber();
						this.showScrubber();
						this.vidStartTime = this.getCurrentTime();
						this.clockStartTime = Date.now();
						if (this.vidStartTime < this.minDVRTime) {
							this.addMinDVRMonitor();
							return;
						}
						this.minDVRReached = true;
						this.enableScrubber();
					},
					addMinDVRMonitor: function() {
						this.log("addMinDVRMonitor : " + _this.minDVRTime);
						var _this = this;
						var currTime = this.getCurrentTime();
						this.minDVRMonitor = setInterval(function() {
							if (currTime >= _this.minDVRTime) {
								_this.minDVRReached = true;
								_this.enableScrubber();
								_this.removeMinDVRMonitor();
								return;
							}
							currTime = _this.getCurrentTime();
						}, 1000)
					},
					removeMinDVRMonitor: function() {
						this.log("removeMinDVRMonitor");
						this.minDVRMonitor = clearInterval(this.minDVRMonitor);
					},
					addLiveStreamStatusMonitor: function() {
						this.log("addLiveStreamStatusMonitor");
						var _this = this;
						this.liveStreamStatusMonitor = setInterval(function() {
							_this.getLiveStreamStatusFromAPI();
						}, _this.liveStreamStatusInterval * 1000);
					},
					removeLiveStreamStatusMonitor: function() {
						this.log("removeLiveStreamStatusMonitor");
						this.liveStreamStatusMonitor = clearInterval(this.liveStreamStatusMonitor);
					},
					addPausedMonitor: function() {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						var vid = embedPlayer.getPlayerElement();
						var pauseTime = vid.currentTime;
						var pauseClockTime = Date.now();
						var scrubberPosition = this.getCurrentScrubberPosition() / 1000;
						var totalTime = _this.dvrWindow;
						if (scrubberPosition < .99) {
							var sliderPos = 1 - scrubberPosition;
							var currentTime = mw.npt2seconds(this.getTimeDisplay());
							totalTime = currentTime / sliderPos;
						} else {
							if (pauseTime < totalTime) {
								totalTime = pauseTime;
							}
						}
						this.log("addPausedMonitor : totalTime = " + totalTime + ", Monitor rate = " + mw.getConfig('EmbedPlayer.MonitorRate'));
						this.pausedMonitor = setInterval(function() {
							var timePassed = (Date.now() - pauseClockTime) / 1000;
							var updateTime = _this.lastTimeDisplayed + timePassed;
							var perc = updateTime / totalTime;
							if (updateTime > totalTime) {
								perc = 1;
							}
							_this.updateScrubber(1 - perc);
							_this.setTimeDisplay('-' + mw.seconds2npt(updateTime));
						}, mw.getConfig('EmbedPlayer.MonitorRate'));
					},
					removePausedMonitor: function() {
						this.lastTimeDisplayed = mw.npt2seconds(this.getTimeDisplay());
						this.log("removePausedMonitor : Last time displayed = " + this.lastTimeDisplayed);
						this.pausedMonitor = clearInterval(this.pausedMonitor);
					},
					addLiveStreamStatus: function() {
						var embedPlayer = this.embedPlayer;
						embedPlayer.bindHelper('addControlBarComponent', function(event, controlBar) {
							var $liveStreamStatus = {
								'w': 28,
								'o': function(ctrlObj) {
									return $('<div />').addClass("ui-widget live-stream-status");
								}
							};
							controlBar.supportedComponents['liveStreamStatus'] = true;
							controlBar.components['liveStreamStatus'] = $liveStreamStatus;
						});
					},
					addScrubber: function() {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						embedPlayer.bindHelper('addControlBarComponent', function(event, controlBar) {
							var $liveStreamDVRScrubber = {
								'w': 0,
								'o': function(ctrlObj) {
									var sliderConfig = {
										range: "max",
										value: 1000,
										min: 0,
										max: 1000,
										animate: mw.getConfig('EmbedPlayer.MonitorRate') - (mw.getConfig('EmbedPlayer.MonitorRate') / 30),
										start: function(event, ui) {
											_this.removePausedMonitor();
											_this.userSlide = true;
											embedPlayer.getInterface().find('.play-btn-large').fadeOut('fast');
										},
										slide: function(event, ui) {
											var perc = ui.value / 1000;
											var totalVidTime = _this.vidStartTime + ((Date.now() - _this.clockStartTime) / 1000);
											var totalTime = (totalVidTime < _this.dvrWindow) ? totalVidTime : _this.dvrWindow;
											if (perc > .99) {
												embedPlayer.getInterface().find('.play_head_dvr .ui-slider-handle').attr('data-title', 'Live');
												_this.setLiveIndicator();
												return;
											}
											var jumpToTime = (1 - perc) * totalTime;
											embedPlayer.getInterface().find('.play_head_dvr .ui-slider-handle').attr('data-title', mw.seconds2npt(jumpToTime));
											_this.setTimeDisplay('-' + mw.seconds2npt(jumpToTime))
										},
										change: function(event, ui) {
											var perc = ui.value / 1000;
											var totalVidTime = _this.vidStartTime + ((Date.now() - _this.clockStartTime) / 1000);
											var totalTime = (totalVidTime < _this.dvrWindow) ? totalVidTime : _this.dvrWindow;
											var jumpToTime = perc * totalTime;
											if (perc > .99) {
												embedPlayer.getInterface().find('.play_head_dvr .ui-slider-handle').attr('data-title', 'Live');
											} else {
												embedPlayer.getInterface().find('.play_head_dvr .ui-slider-handle').attr('data-title', mw.seconds2npt(jumpToTime));
												_this.showBackToLive();
											}
											if (_this.userSlide) {
												_this.userSlide = false;
												if (perc > .99) {
													_this.backToLive();
													return;
												}
												if (embedPlayer.paused) {
													_this.addPausedMonitor();
												}
												_this.setCurrentTime(jumpToTime);
												_this.lastTimeDisplayed = (1 - perc) * totalTime;
											}
										}
									};
									var rightOffset = (embedPlayer.getPlayerWidth() - ctrlObj.availableWidth - ctrlObj.components.pause.w)
									var $playHead = $('<div />').addClass("play_head_dvr").css({
										"position": 'absolute',
										"left": (ctrlObj.components.pause.w + 4) + 'px',
										"right": rightOffset + 'px'
									}).slider(sliderConfig);
									$playHead.find('.ui-slider-handle').attr('data-title', mw.seconds2npt(0));
									$playHead.find('.ui-slider-range').addClass('ui-corner-all').css('z-index', 2);
									return $playHead;
								}
							}
							controlBar.supportedComponents['liveStreamDVRScrubber'] = true;
							controlBar.components['liveStreamDVRScrubber'] = $liveStreamDVRScrubber;
						});
					},
					addTimeDisplay: function() {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						embedPlayer.bindHelper('addControlBarComponent', function(event, controlBar) {
							var $liveStreamTimeDisplay = {
								'w': mw.getConfig('EmbedPlayer.TimeDisplayWidth'),
								'o': function(ctrlObj) {
									return $('<div />').addClass("ui-widget time-disp-dvr");
								}
							}
							controlBar.supportedComponents['liveStreamDVRStatus'] = true;
							controlBar.components['liveStreamDVRStatus'] = $liveStreamTimeDisplay;
						});
					},
					addBackToLiveButton: function() {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						embedPlayer.bindHelper('addControlBarComponent', function(event, controlBar) {
							var $backToLiveWrapper = $('<div />').addClass('back-to-live-icon').after($('<div />').addClass('back-to-live-text').text('Live'));
							var $backToLiveButton = $('<div />').addClass('ui-widget back-to-live').html($backToLiveWrapper).click(function() {
								_this.backToLive();
							});
							var $backToLive = {
								'w': 28,
								'o': function(ctrlObj) {
									return $backToLiveButton;
								}
							}
							controlBar.supportedComponents['backToLive'] = true;
							controlBar.components['backToLive'] = $backToLive;
						});
					},
					setLiveIndicator: function() {
						this.log("setLiveIndicator");
						if (this.embedPlayer.getInterface() && !embedPlayer.isOffline()) {
							this.embedPlayer.getInterface().find('.time-disp-dvr').addClass('time-disp-dvr-live').html('Live');
						}
						this.lastTimeDisplayed = 0;
					},
					unsetLiveIndicator: function() {
						this.log("unsetLiveIndicator");
						if (this.embedPlayer.getInterface() && this.embedPlayer.getInterface().find('.time-disp-dvr').hasClass('time-disp-dvr-live')) {
							this.embedPlayer.getInterface().find('.time-disp-dvr').removeClass('time-disp-dvr-live').html('');
						}
					},
					setTimeDisplay: function(value) {
						this.log("setTimeDisplay : " + value);
						this.unsetLiveIndicator();
						if (this.embedPlayer.getInterface()) {
							this.embedPlayer.getInterface().find('.time-disp-dvr').html(value);
						}
					},
					getTimeDisplay: function() {
						if (this.embedPlayer.getInterface()) {
							if (this.embedPlayer.getInterface().find('.time-disp-dvr').hasClass('time-disp-dvr-live')) {
								return 0;
							}
							return this.embedPlayer.getInterface().find('.time-disp-dvr').text().substr(1);
						}
						return null;
					},
					showBackToLive: function() {
						this.hideLiveStreamStatus();
						var embedPlayer = this.embedPlayer;
						var $backToLive = embedPlayer.getInterface().find('.back-to-live');
						if ($backToLive.length && $backToLive.is(':hidden')) {
							this.log("showBackToLive");
							embedPlayer.getInterface().find('.back-to-live').show();
						}
					},
					hideBackToLive: function() {
						this.log("hideBackToLive");
						var embedPlayer = this.embedPlayer;
						if (embedPlayer.getInterface().find('.back-to-live').length) {
							embedPlayer.getInterface().find('.back-to-live').hide();
						}
					},
					backToLive: function() {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						this.disableLiveControls();
						embedPlayer.addPlayerSpinner();
						this.hideTimeDisplay();
						this.hideBackToLive();
						this.updateScrubber(1);
						this.lastTimeDisplayed = 0;
						var vid = embedPlayer.getPlayerElement();
						$(vid).bind('playing' + this.bindPostFix, function() {
							$(vid).unbind('playing' + _this.bindPostFix);
							embedPlayer.hideSpinner();
							_this.setLiveIndicator();
							_this.enableLiveControls(true);
						});
						vid.load();
						vid.play();
					},
					hideTimeDisplay: function() {
						this.log("hideTimeDisplay");
						this.setTimeDisplay('');
					},
					hideLiveStreamStatus: function() {
						var embedPlayer = this.embedPlayer;
						var $liveStatus = embedPlayer.getInterface().find('.live-stream-status');
						if ($liveStatus.length && !$liveStatus.is(':hidden')) {
							this.log("hideLiveStreamStatus");
							this.embedPlayer.getInterface().find('.live-stream-status').hide();
						}
					},
					showLiveStreamStatus: function() {
						this.log("showLiveStreamStatus");
						this.embedPlayer.getInterface().find('.live-stream-status').show();
					},
					getLiveStreamStatusFromAPI: function(callback) {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						_this.getKalturaClient().doRequest({
							'service': 'liveStream',
							'action': 'islive',
							'id': embedPlayer.kentryid,
							'protocol': 'hls',
							'timestamp': Date.now()
						}, function(data) {
							_this.onAirStatus = false;
							if (data === true) {
								_this.onAirStatus = true;
							}
							if (callback) {
								callback(_this.onAirStatus);
							}
							_this.log("Trigger liveStreamStatusUpdate : " + _this.onAirStatus);
							embedPlayer.triggerHelper('liveStreamStatusUpdate', {
								'onAirStatus': _this.onAirStatus
							});
						}, mw.getConfig("SkipKSOnIsLiveRequest"));
					},
					getLiveStreamStatusText: function() {
						if (this.onAirStatus) {
							return 'On Air';
						}
						return 'Off Air';
					},
					setLiveStreamStatus: function(value) {
						this.log("setLiveStreamStatus : " + value);
						var embedPlayer = this.embedPlayer;
						var $liveStatus = embedPlayer.getInterface().find('.live-stream-status');
						$liveStatus.html(value);
						if (this.onAirStatus) {
							$liveStatus.removeClass('live-off-air').addClass('live-on-air');
						} else {
							$liveStatus.removeClass('live-on-air').addClass('live-off-air');
						}
					},
					updateScrubber: function(perc) {
						var $playHead = this.embedPlayer.getInterface().find('.play_head_dvr');
						if ($playHead.length) {
							$playHead.slider('value', perc * 1000);
						}
					},
					getCurrentScrubberPosition: function() {
						var $playHead = this.embedPlayer.getInterface().find('.play_head_dvr');
						if ($playHead.length) {
							var val = $playHead.slider("value");
							this.log("getCurrentScrubberPosition : " + val);
							return val;
						}
						return null;
					},
					disableScrubber: function() {
						this.log("disableScrubber");
						var embedPlayer = this.embedPlayer;
						if (this.isDVR()) {
							var $playHead = embedPlayer.getInterface().find(".play_head_dvr");
							if ($playHead.length) {
								$playHead.slider("option", "disabled", true);
							}
						}
					},
					enableScrubber: function() {
						this.log("enableScrubber");
						var embedPlayer = this.embedPlayer;
						if (this.isDVR()) {
							var $playHead = embedPlayer.getInterface().find(".play_head_dvr");
							if ($playHead.length) {
								$playHead.slider("option", "disabled", false);
							}
						}
					},
					hideScrubber: function() {
						var embedPlayer = this.embedPlayer;
						if (this.isDVR()) {
							var $playHead = embedPlayer.getInterface().find(".play_head_dvr");
							if ($playHead.length) {
								$playHead.hide();
							}
						}
					},
					showScrubber: function() {
						var embedPlayer = this.embedPlayer;
						if (this.isDVR()) {
							var $playHead = embedPlayer.getInterface().find(".play_head_dvr");
							if ($playHead.length) {
								$playHead.show();
							}
						}
					},
					disableLiveControls: function() {
						if (typeof this.liveControls == 'undefined' || this.liveControls === true) {
							var embedPlayer = this.embedPlayer;
							embedPlayer.hideLargePlayBtn();
							embedPlayer.disablePlayControls();
							embedPlayer.controlBuilder.removePlayerClickBindings();
							embedPlayer.getInterface().find('.play-btn').unbind('click').click(function() {
								if (embedPlayer._playContorls) {
									embedPlayer.play();
								}
							});
							this.disableScrubber();
							this.liveControls = false;
						}
					},
					enableLiveControls: function(hidePlayBtn) {
						if (this.liveControls === false) {
							var embedPlayer = this.embedPlayer;
							embedPlayer.hideSpinner();
							if (!hidePlayBtn) {
								embedPlayer.addLargePlayBtn();
							}
							embedPlayer.enablePlayControls();
							embedPlayer.controlBuilder.addPlayerClickBindings();
							if (this.minDVRReached) {
								this.enableScrubber();
							}
							this.liveControls = true;
						}
					},
					toggleLiveControls: function(onAirStatus) {
						if (onAirStatus) {
							this.enableLiveControls();
							return;
						}
						this.disableLiveControls();
					},
					getCurrentTime: function() {
						return this.embedPlayer.getPlayerElement().currentTime;
					},
					setCurrentTime: function(sec) {
						try {
							this.embedPlayer.getPlayerElement().currentTime = sec;
						} catch (e) {
							this.log("Error : Could not set video currentTime");
						}
					},
					extendApi: function() {
						var _this = this;
						var embedPlayer = this.embedPlayer;
						embedPlayer.isOffline = function() {
							return !_this.onAirStatus;
						}
					},
					getKalturaClient: function() {
						if (!this.kClient) {
							this.kClient = mw.kApiGetPartnerClient(this.embedPlayer.kwidgetid);
						}
						return this.kClient;
					},
					log: function(msg) {
						mw.log("LiveStream :: " + msg);
					}
				}
				liveStreamPlugin.init(embedPlayer);
			}
			callback();
		});
	})(window.mw, window.jQuery);;
}, {
	"all": ".mv-player .time-disp-dvr,.mv-player .live-stream-status,.mv-player .back-to-live{margin-top:8px;height:auto;overflow:hidden;font-size:10.2px;float:right;display:inline;border:none;padding-right:4px}.mv-player .live-on-air,.mv-player .live-off-air,.mv-player .back-to-live{margin-top:6px;border:1px solid #000000;padding:2px 4px 2px 4px}.mv-player .live-on-air{background-color:#2FC44D}.mv-player .live-off-air,.mv-player .back-to-live{background-color:#FF0000}.mv-player .time-disp-dvr{padding-right:8px}.mv-player .time-disp-dvr-live{text-shadow:0 0 10px #FFFFFF;font-weight:bold}.mv-player .play_head_dvr{position:absolute}.mv-player .play_head_dvr .ui-slider-handle{width:10px;height:15px;margin-left:-5px;margin-top:-0px;z-index:2}.mv-player .back-to-live{margin-right:4px;cursor:pointer;background-color:#2FC44D}.mv-player .back-to-live-icon{margin-right:4px;width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:6px solid #FFFFFF;display:inline-block}.mv-player .back-to-live-text{display:inline-block}\n\n/* cache key: resourceloader:filter:minify-css:7:b8b3ad3817495515b37ae1c3841b7475 */\n"
}, {});
mw.loader.implement("myLogo", function($) {
	(function(mw, $) {
		"use strict";
		var myLogo = function(embedPlayer) {
			var myLogoConfig = embedPlayer.getKalturaConfig('mylogo', ['relativeTo', 'position', 'watermarkClickPath', 'watermarkPath', 'height', 'width', 'className']);
			mw.setConfig('EmbedPlayer.AttributionButton', false);
			if (!myLogoConfig.width) myLogoConfig.width = 28;
			$(embedPlayer).bind('addControlBarComponent', function(event, controlBar) {
				controlBar.supportedComponents['controlBarWatermark'] = true;
				var components = {};
				components['controlBarWatermark'] = {
					'w': myLogoConfig.width,
					'o': function(ctrlObj) {
						var $watermarkButton = $('<div />').addClass('rButton k-watermark-plugin' + myLogoConfig.className).css({
							'width': myLogoConfig.width + 'px'
						}).append($('<a />').attr({
								'href': myLogoConfig.watermarkClickPath,
								'target': '_blank'
							}).append($('<img />').attr({
									'src': myLogoConfig.watermarkPath
								}).css({
										'right': '1px',
										'position': 'absolute'
									})))
						if (myLogoConfig.height) {
							$watermarkButton.css('height', myLogoConfig.height)
						}
						return $watermarkButton;
					}
				};
				for (var component_id in controlBar.components) {
					components[component_id] = controlBar.components[component_id];
				}
				controlBar.components = components;
			});
		}
		mw.addKalturaConfCheck(function(embedPlayer, callback) {
			if (!embedPlayer.$uiConf.find("Button[icon='kalturaLogo']").length || embedPlayer.getKalturaConfig('kalturaLogo', 'visible') == false || embedPlayer.getKalturaConfig('kalturaLogo', 'includeInLayout') == false) {
				mw.setConfig('EmbedPlayer.AttributionButton', false);
			}
			if (embedPlayer.isPluginEnabled('mylogo')) {
				myLogo(embedPlayer)
			}
			callback();
		});
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("playlistPlugin", function($) {
	(function(mw, $) {
		"use strict";
		$(mw).bind("PlaylistGetSourceHandler", function(event, playlist) {
			var $playlistTarget = $('#' + playlist.id);
			var embedPlayer = playlist.embedPlayer;
			var kplUrl0, kpl0Id, playlistConfig;
			if (!embedPlayer) {
				mw.log("Error: playlist source handler without embedPlayer");
			} else {
				playlistConfig = {
					'uiconf_id': embedPlayer.kuiconfid,
					'widget_id': embedPlayer.kwidgetid
				};
				kplUrl0 = embedPlayer.getKalturaConfig('playlistAPI', 'kpl0Url');
				if (kplUrl0) {
					kplUrl0 = decodeURIComponent(kplUrl0);
				}
				kpl0Id = embedPlayer.getKalturaConfig('playlistAPI', 'kpl0Id');
			}
			if (!kplUrl0 && !kpl0Id) {
				return;
			}
			var playlistId;
			if (embedPlayer.kalturaPlaylistData) {
				for (playlistId in embedPlayer.kalturaPlaylistData) break;
			}
			var plId = kpl0Id || new mw.Uri(kplUrl0).query['playlist_id'];
			if ((embedPlayer.kalturaPlaylistData) || plId || kplUrl0.indexOf('executeplaylist') != -1) {
				playlistConfig.playlist_id = plId;
				playlist.sourceHandler = new mw.PlaylistHandlerKaltura(playlist, playlistConfig);
				return;
			}
			mw.log("Error playlist source not found");
		});
		$(mw).bind('EmbedPlayerNewPlayer', function(event, embedPlayer) {
			$(embedPlayer).bind('KalturaSupport_CheckUiConf', function(event, $uiConf, callback) {
				var $playerInterface = embedPlayer.getInterface();
				if (embedPlayer.isPluginEnabled('playlistAPI') && (embedPlayer.getKalturaConfig('playlistAPI', 'kpl0Url') || embedPlayer.getKalturaConfig('playlistAPI', 'kpl0Id')) && !$('#playlistInterface').hasClass('activatedPlaylist')) {
					var $uiConf = embedPlayer.$uiConf;
					var layout;
					if ($uiConf.find('#playlistHolder').length) {
						layout = (parseInt($uiConf.find('#playlistHolder').attr('width')) != 100) ? 'horizontal' : 'vertical';
					} else {
						mw.log("Error:: could not determine playlist layout type ( use target size ) ");
						layout = ($playerInterface.width() < $playerInterface.height()) ? 'vertical' : 'horizontal';
					}
					if (!embedPlayer.isPluginEnabled('related')) {
						$playerInterface.addClass(layout);
					}
					var $playlistInterface = $playerInterface.parent('#playlistInterface');
					if (!$playlistInterface.length) {
						$playlistInterface = $playerInterface.wrap($('<div />').attr('id', 'playlistInterface').css({
							'position': 'relative',
							'width': '100%',
							'height': '100%'
						})).parent();
					}
					$playlistInterface.addClass('activatedPlaylist').playlist({
						'layout': layout,
						'embedPlayer': embedPlayer
					})
					callback();
				} else {
					callback();
				}
			});
		});
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("statisticsPlugin", function($) {
	(function(mw, $) {
		"use strict";
		mw.addKalturaPlugin("statistics", function(embedPlayer, callback) {
			mw.addKAnalytics(embedPlayer);
			callback();
		});
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("utf8_encode", function($) {
	window['utf8_encode'] = function(argString) {
		if (argString === null || typeof argString === "undefined") {
			return "";
		}
		var string = (argString + '');
		var utftext = "",
			start, end, stringl = 0;
		start = end = 0;
		stringl = string.length;
		for (var n = 0; n < stringl; n++) {
			var c1 = string.charCodeAt(n);
			var enc = null;
			if (c1 < 128) {
				end++;
			} else if (c1 > 127 && c1 < 2048) {
				enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
			} else {
				enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
			}
			if (enc !== null) {
				if (end > start) {
					utftext += string.slice(start, end);
				}
				utftext += enc;
				start = end = n + 1;
			}
		}
		if (end > start) {
			utftext += string.slice(start, stringl);
		}
		return utftext;
	};
}, {}, {});
mw.loader.implement("volumeBarLayout", function($) {
	(function(mw, $) {
		"use strict";
		mw.addKalturaPlugin('volumeBar', function(embedPlayer, callback) {
			var layout = embedPlayer.getKalturaConfig('volumeBar', 'layoutMode') || 'vertical';
			$(embedPlayer).bind('addControlBarComponent', function(event, controlBar) {
				controlBar.volumeLayout = layout;
				if (controlBar.volumeLayout == 'horizontal') {
					controlBar.components['volumeControl'].w = 80;
				}
			});
			callback();
		});
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("jquery.client", function($) {
	(function($) {
		var profileCache = {};
		$.client = {
			profile: function(nav) {
				if (nav === undefined) {
					nav = window.navigator;
				}
				if (profileCache[nav.userAgent] === undefined) {
					var uk = 'unknown';
					var x = 'x';
					var wildUserAgents = ['Opera', 'Navigator', 'Minefield', 'KHTML', 'Chrome', 'PLAYSTATION 3'];
					var userAgentTranslations = [
						[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
						['Chrome Safari', 'Chrome'],
						['KHTML', 'Konqueror'],
						['Minefield', 'Firefox'],
						['Navigator', 'Netscape'],
						['PLAYSTATION 3', 'PS3']
					];
					var versionPrefixes = ['camino', 'chrome', 'firefox', 'netscape', 'netscape6', 'opera', 'version', 'konqueror', 'lynx', 'msie', 'safari', 'ps3'];
					var versionSuffix = '(\\/|\\;?\\s|)([a-z0-9\\.\\+]*?)(\\;|dev|rel|\\)|\\s|$)';
					var names = ['camino', 'chrome', 'firefox', 'netscape', 'konqueror', 'lynx', 'msie', 'opera', 'safari', 'ipod', 'iphone', 'blackberry', 'ps3'];
					var nameTranslations = [];
					var layouts = ['gecko', 'konqueror', 'msie', 'opera', 'webkit'];
					var layoutTranslations = [
						['konqueror', 'khtml'],
						['msie', 'trident'],
						['opera', 'presto']
					];
					var layoutVersions = ['applewebkit', 'gecko'];
					var platforms = ['win', 'mac', 'linux', 'sunos', 'solaris', 'iphone'];
					var platformTranslations = [
						['sunos', 'solaris']
					];
					var translate = function(source, translations) {
						for (var i = 0; i < translations.length; i++) {
							source = source.replace(translations[i][0], translations[i][1]);
						}
						return source;
					};
					var ua = nav.userAgent,
						match, name = uk,
						layout = uk,
						layoutversion = uk,
						platform = uk,
						version = x;
					if (match = new RegExp('(' + wildUserAgents.join('|') + ')').exec(ua)) {
						ua = translate(ua, userAgentTranslations);
					}
					ua = ua.toLowerCase();
					if (match = new RegExp('(' + names.join('|') + ')').exec(ua)) {
						name = translate(match[1], nameTranslations);
					}
					if (match = new RegExp('(' + layouts.join('|') + ')').exec(ua)) {
						layout = translate(match[1], layoutTranslations);
					}
					if (match = new RegExp('(' + layoutVersions.join('|') + ')\\\/(\\d+)').exec(ua)) {
						layoutversion = parseInt(match[2], 10);
					}
					if (match = new RegExp('(' + platforms.join('|') + ')').exec(nav.platform.toLowerCase())) {
						platform = translate(match[1], platformTranslations);
					}
					if (match = new RegExp('(' + versionPrefixes.join('|') + ')' + versionSuffix).exec(ua)) {
						version = match[3];
					}
					if (name.match(/safari/) && version > 400) {
						version = '2.0';
					}
					if (name === 'opera' && version >= 9.8) {
						version = ua.match(/version\/([0-9\.]*)/i)[1] || 10;
					}
					var versionNumber = parseFloat(version, 10) || 0.0;
					profileCache[nav.userAgent] = {
						'name': name,
						'layout': layout,
						'layoutVersion': layoutversion,
						'platform': platform,
						'version': version,
						'versionBase': (version !== x ? Math.floor(versionNumber).toString() : x),
						'versionNumber': versionNumber
					};
				}
				return profileCache[nav.userAgent];
			},
			test: function(map, profile) {
				profile = $.isPlainObject(profile) ? profile : $.client.profile();
				var dir = $('body').is('.rtl') ? 'rtl' : 'ltr';
				if (typeof map[dir] !== 'object' || typeof map[dir][profile.name] === 'undefined') {
					return true;
				}
				var conditions = map[dir][profile.name];
				for (var i = 0; i < conditions.length; i++) {
					var op = conditions[i][0];
					var val = conditions[i][1];
					if (val === false) {
						return false;
					} else if (typeof val == 'string') {
						if (!(eval('profile.version' + op + '"' + val + '"'))) {
							return false;
						}
					} else if (typeof val == 'number') {
						if (!(eval('profile.versionNumber' + op + val))) {
							return false;
						}
					}
				}
				return true;
			}
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.color", function($) {
	(function(jQuery, undefined) {
		var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
			rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
			stringParsers = [{
				re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
				parse: function(execResult) {
					return [execResult[1], execResult[2], execResult[3], execResult[4]];
				}
			}, {
				re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
				parse: function(execResult) {
					return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
				}
			}, {
				re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
				parse: function(execResult) {
					return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
				}
			}, {
				re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
				parse: function(execResult) {
					return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
				}
			}, {
				re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
				space: "hsla",
				parse: function(execResult) {
					return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
				}
			}],
			color = jQuery.Color = function(color, green, blue, alpha) {
				return new jQuery.Color.fn.parse(color, green, blue, alpha);
			}, spaces = {
				rgba: {
					props: {
						red: {
							idx: 0,
							type: "byte"
						},
						green: {
							idx: 1,
							type: "byte"
						},
						blue: {
							idx: 2,
							type: "byte"
						}
					}
				},
				hsla: {
					props: {
						hue: {
							idx: 0,
							type: "degrees"
						},
						saturation: {
							idx: 1,
							type: "percent"
						},
						lightness: {
							idx: 2,
							type: "percent"
						}
					}
				}
			}, propTypes = {
				"byte": {
					floor: true,
					max: 255
				},
				"percent": {
					max: 1
				},
				"degrees": {
					mod: 360,
					floor: true
				}
			}, support = color.support = {}, supportElem = jQuery("<p>")[0],
			colors, each = jQuery.each;
		supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
		support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;
		each(spaces, function(spaceName, space) {
			space.cache = "_" + spaceName;
			space.props.alpha = {
				idx: 3,
				type: "percent",
				def: 1
			};
		});

		function clamp(value, prop, allowEmpty) {
			var type = propTypes[prop.type] || {};
			if (value == null) {
				return (allowEmpty || !prop.def) ? null : prop.def;
			}
			value = type.floor ? ~~value : parseFloat(value);
			if (isNaN(value)) {
				return prop.def;
			}
			if (type.mod) {
				return (value + type.mod) % type.mod;
			}
			return 0 > value ? 0 : type.max < value ? type.max : value;
		}
		function stringParse(string) {
			var inst = color(),
				rgba = inst._rgba = [];
			string = string.toLowerCase();
			each(stringParsers, function(i, parser) {
				var parsed, match = parser.re.exec(string),
					values = match && parser.parse(match),
					spaceName = parser.space || "rgba";
				if (values) {
					parsed = inst[spaceName](values);
					inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
					rgba = inst._rgba = parsed._rgba;
					return false;
				}
			});
			if (rgba.length) {
				if (rgba.join() === "0,0,0,0") {
					jQuery.extend(rgba, colors.transparent);
				}
				return inst;
			}
			return colors[string];
		}
		color.fn = jQuery.extend(color.prototype, {
			parse: function(red, green, blue, alpha) {
				if (red === undefined) {
					this._rgba = [null, null, null, null];
					return this;
				}
				if (red.jquery || red.nodeType) {
					red = jQuery(red).css(green);
					green = undefined;
				}
				var inst = this,
					type = jQuery.type(red),
					rgba = this._rgba = [],
					source;
				if (green !== undefined) {
					red = [red, green, blue, alpha];
					type = "array";
				}
				if (type === "string") {
					return this.parse(stringParse(red) || colors._default);
				}
				if (type === "array") {
					each(spaces.rgba.props, function(key, prop) {
						rgba[prop.idx] = clamp(red[prop.idx], prop);
					});
					return this;
				}
				if (type === "object") {
					if (red instanceof color) {
						each(spaces, function(spaceName, space) {
							if (red[space.cache]) {
								inst[space.cache] = red[space.cache].slice();
							}
						});
					} else {
						each(spaces, function(spaceName, space) {
							var cache = space.cache;
							each(space.props, function(key, prop) {
								if (!inst[cache] && space.to) {
									if (key === "alpha" || red[key] == null) {
										return;
									}
									inst[cache] = space.to(inst._rgba);
								}
								inst[cache][prop.idx] = clamp(red[key], prop, true);
							});
							if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
								inst[cache][3] = 1;
								if (space.from) {
									inst._rgba = space.from(inst[cache]);
								}
							}
						});
					}
					return this;
				}
			},
			is: function(compare) {
				var is = color(compare),
					same = true,
					inst = this;
				each(spaces, function(_, space) {
					var localCache, isCache = is[space.cache];
					if (isCache) {
						localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
						each(space.props, function(_, prop) {
							if (isCache[prop.idx] != null) {
								same = (isCache[prop.idx] === localCache[prop.idx]);
								return same;
							}
						});
					}
					return same;
				});
				return same;
			},
			_space: function() {
				var used = [],
					inst = this;
				each(spaces, function(spaceName, space) {
					if (inst[space.cache]) {
						used.push(spaceName);
					}
				});
				return used.pop();
			},
			transition: function(other, distance) {
				var end = color(other),
					spaceName = end._space(),
					space = spaces[spaceName],
					startColor = this.alpha() === 0 ? color("transparent") : this,
					start = startColor[space.cache] || space.to(startColor._rgba),
					result = start.slice();
				end = end[space.cache];
				each(space.props, function(key, prop) {
					var index = prop.idx,
						startValue = start[index],
						endValue = end[index],
						type = propTypes[prop.type] || {};
					if (endValue === null) {
						return;
					}
					if (startValue === null) {
						result[index] = endValue;
					} else {
						if (type.mod) {
							if (endValue - startValue > type.mod / 2) {
								startValue += type.mod;
							} else if (startValue - endValue > type.mod / 2) {
								startValue -= type.mod;
							}
						}
						result[index] = clamp((endValue - startValue) * distance + startValue, prop);
					}
				});
				return this[spaceName](result);
			},
			blend: function(opaque) {
				if (this._rgba[3] === 1) {
					return this;
				}
				var rgb = this._rgba.slice(),
					a = rgb.pop(),
					blend = color(opaque)._rgba;
				return color(jQuery.map(rgb, function(v, i) {
					return (1 - a) * blend[i] + a * v;
				}));
			},
			toRgbaString: function() {
				var prefix = "rgba(",
					rgba = jQuery.map(this._rgba, function(v, i) {
						return v == null ? (i > 2 ? 1 : 0) : v;
					});
				if (rgba[3] === 1) {
					rgba.pop();
					prefix = "rgb(";
				}
				return prefix + rgba.join() + ")";
			},
			toHslaString: function() {
				var prefix = "hsla(",
					hsla = jQuery.map(this.hsla(), function(v, i) {
						if (v == null) {
							v = i > 2 ? 1 : 0;
						}
						if (i && i < 3) {
							v = Math.round(v * 100) + "%";
						}
						return v;
					});
				if (hsla[3] === 1) {
					hsla.pop();
					prefix = "hsl(";
				}
				return prefix + hsla.join() + ")";
			},
			toHexString: function(includeAlpha) {
				var rgba = this._rgba.slice(),
					alpha = rgba.pop();
				if (includeAlpha) {
					rgba.push(~~ (alpha * 255));
				}
				return "#" + jQuery.map(rgba, function(v, i) {
					v = (v || 0).toString(16);
					return v.length === 1 ? "0" + v : v;
				}).join("");
			},
			toString: function() {
				return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
			}
		});
		color.fn.parse.prototype = color.fn;

		function hue2rgb(p, q, h) {
			h = (h + 1) % 1;
			if (h * 6 < 1) {
				return p + (q - p) * h * 6;
			}
			if (h * 2 < 1) {
				return q;
			}
			if (h * 3 < 2) {
				return p + (q - p) * ((2 / 3) - h) * 6;
			}
			return p;
		}
		spaces.hsla.to = function(rgba) {
			if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
				return [null, null, null, rgba[3]];
			}
			var r = rgba[0] / 255,
				g = rgba[1] / 255,
				b = rgba[2] / 255,
				a = rgba[3],
				max = Math.max(r, g, b),
				min = Math.min(r, g, b),
				diff = max - min,
				add = max + min,
				l = add * 0.5,
				h, s;
			if (min === max) {
				h = 0;
			} else if (r === max) {
				h = (60 * (g - b) / diff) + 360;
			} else if (g === max) {
				h = (60 * (b - r) / diff) + 120;
			} else {
				h = (60 * (r - g) / diff) + 240;
			}
			if (l === 0 || l === 1) {
				s = l;
			} else if (l <= 0.5) {
				s = diff / add;
			} else {
				s = diff / (2 - add);
			}
			return [Math.round(h) % 360, s, l, a == null ? 1 : a];
		};
		spaces.hsla.from = function(hsla) {
			if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
				return [null, null, null, hsla[3]];
			}
			var h = hsla[0] / 360,
				s = hsla[1],
				l = hsla[2],
				a = hsla[3],
				q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
				p = 2 * l - q,
				r, g, b;
			return [Math.round(hue2rgb(p, q, h + (1 / 3)) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - (1 / 3)) * 255), a];
		};
		each(spaces, function(spaceName, space) {
			var props = space.props,
				cache = space.cache,
				to = space.to,
				from = space.from;
			color.fn[spaceName] = function(value) {
				if (to && !this[cache]) {
					this[cache] = to(this._rgba);
				}
				if (value === undefined) {
					return this[cache].slice();
				}
				var ret, type = jQuery.type(value),
					arr = (type === "array" || type === "object") ? value : arguments,
					local = this[cache].slice();
				each(props, function(key, prop) {
					var val = arr[type === "object" ? key : prop.idx];
					if (val == null) {
						val = local[prop.idx];
					}
					local[prop.idx] = clamp(val, prop);
				});
				if (from) {
					ret = color(from(local));
					ret[cache] = local;
					return ret;
				} else {
					return color(local);
				}
			};
			each(props, function(key, prop) {
				if (color.fn[key]) {
					return;
				}
				color.fn[key] = function(value) {
					var vtype = jQuery.type(value),
						fn = (key === "alpha" ? (this._hsla ? "hsla" : "rgba") : spaceName),
						local = this[fn](),
						cur = local[prop.idx],
						match;
					if (vtype === "undefined") {
						return cur;
					}
					if (vtype === "function") {
						value = value.call(this, cur);
						vtype = jQuery.type(value);
					}
					if (value == null && prop.empty) {
						return this;
					}
					if (vtype === "string") {
						match = rplusequals.exec(value);
						if (match) {
							value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
						}
					}
					local[prop.idx] = value;
					return this[fn](local);
				};
			});
		});
		color.hook = function(hook) {
			var hooks = hook.split(" ");
			each(hooks, function(i, hook) {
				jQuery.cssHooks[hook] = {
					set: function(elem, value) {
						var parsed, curElem, backgroundColor = "";
						if (jQuery.type(value) !== "string" || (parsed = stringParse(value))) {
							value = color(parsed || value);
							if (!support.rgba && value._rgba[3] !== 1) {
								curElem = hook === "backgroundColor" ? elem.parentNode : elem;
								while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
									try {
										backgroundColor = jQuery.css(curElem, "backgroundColor");
										curElem = curElem.parentNode;
									} catch (e) {}
								}
								value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
							}
							value = value.toRgbaString();
						}
						try {
							elem.style[hook] = value;
						} catch (value) {}
					}
				};
				jQuery.fx.step[hook] = function(fx) {
					if (!fx.colorInit) {
						fx.start = color(fx.elem, hook);
						fx.end = color(fx.end);
						fx.colorInit = true;
					}
					jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
				};
			});
		};
		color.hook(stepHooks);
		jQuery.cssHooks.borderColor = {
			expand: function(value) {
				var expanded = {};
				each(["Top", "Right", "Bottom", "Left"], function(i, part) {
					expanded["border" + part + "Color"] = value;
				});
				return expanded;
			}
		};
		colors = jQuery.Color.names = {
			aqua: "#00ffff",
			black: "#000000",
			blue: "#0000ff",
			fuchsia: "#ff00ff",
			gray: "#808080",
			green: "#008000",
			lime: "#00ff00",
			maroon: "#800000",
			navy: "#000080",
			olive: "#808000",
			purple: "#800080",
			red: "#ff0000",
			silver: "#c0c0c0",
			teal: "#008080",
			white: "#ffffff",
			yellow: "#ffff00",
			transparent: [null, null, null, 0],
			_default: "#ffffff"
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.cookie", function($) {
	jQuery.cookie = function(name, value, options) {
		if (typeof value != 'undefined') {
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString();
			}
			var path = options.path ? '; path=' + (options.path) : '';
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else {
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	};;
}, {}, {});
mw.loader.implement("jquery.debouncedresize", function($) {
	(function($) {
		var $event = $.event,
			$special, resizeTimeout;
		$special = $event.special.debouncedresize = {
			setup: function() {
				$(this).on("resize", $special.handler);
			},
			teardown: function() {
				$(this).off("resize", $special.handler);
			},
			handler: function(event, execAsap) {
				var context = this,
					args = arguments,
					dispatch = function() {
						event.type = "debouncedresize";
						$event.dispatch.apply(context, args);
					};
				if (resizeTimeout) {
					clearTimeout(resizeTimeout);
				}
				execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
			},
			threshold: 150
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.hoverIntent", function($) {
	(function($) {
		$.fn.hoverIntent = function(f, g) {
			var cfg = {
				sensitivity: 7,
				interval: 100,
				timeout: 0
			};
			cfg = $.extend(cfg, g ? {
				over: f,
				out: g
			} : f);
			var cX, cY, pX, pY;
			var track = function(ev) {
				cX = ev.pageX;
				cY = ev.pageY;
			};
			var compare = function(ev, ob) {
				ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
				if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
					$(ob).unbind("mousemove", track);
					ob.hoverIntent_s = 1;
					return cfg.over.apply(ob, [ev]);
				} else {
					pX = cX;
					pY = cY;
					ob.hoverIntent_t = setTimeout(function() {
						compare(ev, ob);
					}, cfg.interval);
				}
			};
			var delay = function(ev, ob) {
				ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
				ob.hoverIntent_s = 0;
				return cfg.out.apply(ob, [ev]);
			};
			var handleHover = function(e) {
				var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
				while (p && p != this) {
					try {
						p = p.parentNode;
					} catch (e) {
						p = this;
					}
				}
				if (p == this) {
					return false;
				}
				var ev = $.extend({}, e);
				var ob = this;
				if (ob.hoverIntent_t) {
					ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
				}
				if (e.type == "mouseover") {
					pX = ev.pageX;
					pY = ev.pageY;
					$(ob).bind("mousemove", track);
					if (ob.hoverIntent_s != 1) {
						ob.hoverIntent_t = setTimeout(function() {
							compare(ev, ob);
						}, cfg.interval);
					}
				} else {
					$(ob).unbind("mousemove", track);
					if (ob.hoverIntent_s == 1) {
						ob.hoverIntent_t = setTimeout(function() {
							delay(ev, ob);
						}, cfg.timeout);
					}
				}
			};
			return this.mouseover(handleHover).mouseout(handleHover);
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.menu", function($) {
	var allUIMenus = [];
	(function($) {
		$.getLineItem = function(string, icon, callback, opt_class, opt_data) {
			var $li = $('<li>').append($('<a>').attr('href', '#').click(callback));
			if (!opt_class) {
				opt_class = '';
			}
			if (!opt_data) {
				opt_data = [];
			}
			if (icon) {
				$li.find('a').append($('<span style="float:left;"></span>').addClass('ui-icon ui-icon-' + icon).addClass(opt_class).data(opt_data));
			}
			$li.find('a').append($('<span>').text(string));
			return $li;
		};
		$.fn.menu = function(options) {
			var caller = this;
			if (this[0]) {
				caller = this[0];
			}
			var options = options;
			if (!caller.m) {
				caller.m = new Menu(caller, options);
				allUIMenus.push(caller.m);
				$(this).mousedown(function() {
					if (!caller.m.menuOpen) {
						caller.m.showLoading();
					};
				}).click(function() {
						if (caller.m.menuOpen == false) {
							caller.m.showMenu();
						} else {
							caller.m.kill();
						};
						return false;
					});
			}
			if (options.autoShow) {
				setTimeout(function() {
					caller.m.showLoading();
					caller.m.showMenu();
				}, 0);
			}
			if (options == 'show') {
				caller.m.showMenu();
			}
			return this;
		};

		function Menu(caller, options) {
			var menu = this;
			var caller = $(caller);
			mw.log('jquery.Menu:: target container: ' + options.targetMenuContainer);
			var callerClassList = 'fg-menu-container ui-widget ui-widget-content ui-corner-all';
			if (options.targetMenuContainer) {
				var container = $(options.targetMenuContainer).addClass(callerClassList).html(options.content)
			} else {
				var container = $('<div>').addClass(callerClassList).html(options.content);
			}
			this.menuOpen = false;
			this.menuExists = false;
			var options = jQuery.extend({
				content: null,
				autoShow: false,
				width: 180,
				maxHeight: 180,
				targetMenuContainer: null,
				zindex: 2,
				positionOpts: {
					posX: 'left',
					posY: 'bottom',
					offsetX: 0,
					offsetY: 0,
					directionH: 'right',
					directionV: 'down',
					detectH: true,
					detectV: true,
					linkToFront: false
				},
				showSpeed: 200,
				createMenuCallback: null,
				closeMenuCallback: null,
				callerOnState: 'ui-state-active',
				loadingState: 'ui-state-loading',
				linkHover: 'ui-state-hover',
				linkHoverSecondary: 'li-hover',
				crossSpeed: 200,
				crumbDefaultText: 'Choose an option:',
				backLink: true,
				backLinkText: 'Back',
				flyOut: false,
				flyOutOnState: 'ui-state-default',
				nextMenuLink: 'ui-icon-triangle-1-e',
				topLinkText: 'All',
				nextCrumbLink: 'ui-icon-carat-1-e'
			}, options);
			container.css({
				'left': '0px',
				'z-index': options.zindex
			});
			var killAllMenus = function() {
				$.each(allUIMenus, function(i) {
					if (allUIMenus[i].menuOpen) {
						allUIMenus[i].kill();
					};
				});
			};
			this.kill = function() {
				caller.removeClass(options.loadingState).removeClass('fg-menu-open').removeClass(options.callerOnState);
				container.find('li').removeClass(options.linkHoverSecondary).find('a').removeClass(options.linkHover);
				if (options.flyOutOnState) {
					container.find('li a').removeClass(options.flyOutOnState);
				};
				if (options.callerOnState) {
					caller.removeClass(options.callerOnState);
				};
				if (container.is('.fg-menu-ipod')) {
					menu.resetDrilldownMenu();
				};
				if (container.is('.fg-menu-flyout')) {
					menu.resetFlyoutMenu();
				};
				if (!options.keepPosition) {
					container.parent().hide();
				} else {
					container.hide();
				}
				menu.menuOpen = false;
				if (typeof options.closeMenuCallback == 'function') {
					options.closeMenuCallback();
				}
				$(document).unbind('click touchstart', killAllMenus);
				$(document).unbind('keydown');
			};
			this.showLoading = function() {
				caller.addClass(options.loadingState);
			};
			this.showMenu = function() {
				mw.log('jquery.menu:: show menu');
				killAllMenus();
				menu.create()
				mw.log('jquery.menu:: menu.create');
				caller.addClass('fg-menu-open').addClass(options.callerOnState);
				container.parent().show().click(function() {
					menu.kill();
					return false;
				});
				mw.log('jquery.menu:: menu. binding container');
				container.hide().slideDown(options.showSpeed).find('.fg-menu:eq(0)');
				menu.menuOpen = true;
				caller.removeClass(options.loadingState);
				if (window.parent != window) {
					$(window.parent.document).bind('click touchstart', killAllMenus);
				}
				$(document).click(killAllMenus);
				$(document).keydown(function(event) {
					var e;
					if (event.which != "") {
						e = event.which;
					} else if (event.charCode != "") {
						e = event.charCode;
					} else if (event.keyCode != "") {
						e = event.keyCode;
					}
					var menuType = ($(event.target).parents('div').is('.fg-menu-flyout')) ? 'flyout' : 'ipod';
					switch (e) {
						case 37:
							if (menuType == 'flyout') {
								$(event.target).trigger('mouseout');
								if ($('.' + options.flyOutOnState).size() > 0) {
									$('.' + options.flyOutOnState).trigger('mouseover');
								};
							};
							if (menuType == 'ipod') {
								$(event.target).trigger('mouseout');
								if ($('.fg-menu-footer').find('a').size() > 0) {
									$('.fg-menu-footer').find('a').trigger('click');
								};
								if ($('.fg-menu-header').find('a').size() > 0) {
									$('.fg-menu-current-crumb').prev().find('a').trigger('click');
								};
								if ($('.fg-menu-current').prev().is('.fg-menu-indicator')) {
									$('.fg-menu-current').prev().trigger('mouseover');
								};
							};
							return false;
							break;
						case 38:
							if ($(event.target).is('.' + options.linkHover)) {
								var prevLink = $(event.target).parent().prev().find('a:eq(0)');
								if (prevLink.size() > 0) {
									$(event.target).trigger('mouseout');
									prevLink.trigger('mouseover');
								};
							} else {
								container.find('a:eq(0)').trigger('mouseover');
							}
							return false;
							break;
						case 39:
							if ($(event.target).is('.fg-menu-indicator')) {
								if (menuType == 'flyout') {
									$(event.target).next().find('a:eq(0)').trigger('mouseover');
								} else if (menuType == 'ipod') {
									$(event.target).trigger('click');
									setTimeout(function() {
										$(event.target).next().find('a:eq(0)').trigger('mouseover');
									}, options.crossSpeed);
								};
							};
							return false;
							break;
						case 40:
							if ($(event.target).is('.' + options.linkHover)) {
								var nextLink = $(event.target).parent().next().find('a:eq(0)');
								if (nextLink.size() > 0) {
									$(event.target).trigger('mouseout');
									nextLink.trigger('mouseover');
								};
							} else {
								container.find('a:eq(0)').trigger('mouseover');
							}
							return false;
							break;
						case 27:
							killAllMenus();
							break;
						case 13:
							if ($(event.target).is('.fg-menu-indicator') && menuType == 'ipod') {
								$(event.target).trigger('click');
								setTimeout(function() {
									$(event.target).next().find('a:eq(0)').trigger('mouseover');
								}, options.crossSpeed);
							};
							break;
					};
				});
			};
			this.create = function() {
				mw.log("jquery.menu.create ");
				container.css({
					'width': options.width
				}).find('ul:first').not('.fg-menu-breadcrumb').addClass('fg-menu');
				if (!options.keepPosition) {
					container.appendTo('body')
				}
				container.find('ul, li a').addClass('ui-corner-all');
				container.find('ul').attr('role', 'menu').eq(0).attr('aria-activedescendant', 'active-menuitem').attr('aria-labelledby', caller.attr('id'));
				container.find('li').attr('role', 'menuitem');
				container.find('li:has(ul)').attr('aria-haspopup', 'true').find('ul').attr('aria-expanded', 'false');
				container.find('a').attr('tabindex', '-1');
				if (container.find('ul').size() > 1) {
					if (options.flyOut) {
						mw.log("jquery.menu:: call menu.flyout ");
						menu.flyout(container, options);
					} else {
						mw.log("jquery.menu:: call menu.drilldown ");
						menu.drilldown(container, options);
					}
				} else {
					container.find('a').click(function() {
						menu.chooseItem(this);
						return false;
					});
				};
				if (options.linkHover) {
					var allLinks = container.find('.fg-menu li a');
					allLinks.hover(function() {
						var menuitem = $(this);
						var menuli = menuitem.parent();
						if (!menuli.hasClass('divider') && !menuli.hasClass('disabled')) {
							$('.' + options.linkHover).removeClass(options.linkHover).blur().parent().removeAttr('id');
							$(this).addClass(options.linkHover).focus().parent().addClass('active-menuitem');
						}
					}, function() {
						if (typeof menuitem != 'undefined' && !menuitem.hasClass('divider') && !menuitem.hasClass('disabled')) {
							$(this).removeClass(options.linkHover).blur().parent().removeClass('active-menuitem');
						}
					});
				};
				if (options.linkHoverSecondary) {
					container.find('.fg-menu li').hover(function() {
						$(this).siblings('li').removeClass(options.linkHoverSecondary);
						if (options.flyOutOnState) {
							$(this).siblings('li').find('a').removeClass(options.flyOutOnState);
						}
						$(this).addClass(options.linkHoverSecondary);
					}, function() {
						$(this).removeClass(options.linkHoverSecondary);
					});
				};
				if (!options.keepPosition) {
					menu.setPosition(container, caller, options);
				}
				menu.menuExists = true;
				if (typeof options.createMenuCallback == 'function') {
					options.createMenuCallback();
				}
			};
			this.chooseItem = function(item) {
				menu.kill();
				if (options.selectItemCallback) options.selectItemCallback(item);
			};
		};
		Menu.prototype.flyout = function(container, options) {
			var menu = this;
			this.resetFlyoutMenu = function() {
				var allLists = container.find('ul ul');
				allLists.removeClass('ui-widget-content').hide();
			};
			container.addClass('fg-menu-flyout').find('li:has(ul)').each(function() {
				var linkWidth = container.width();
				var showTimer, hideTimer;
				var allSubLists = $(this).find('ul');
				allSubLists.css({
					left: linkWidth,
					width: linkWidth
				}).hide();
				$(this).find('a:eq(0)').addClass('fg-menu-indicator').html('<span>' + $(this).find('a:eq(0)').html() + '</span><span class="ui-icon ' + options.nextMenuLink + '"></span>').hover(function() {
					clearTimeout(hideTimer);
					var subList = $(this).next();
					if (!fitVertical(subList, $(this).offset().top)) {
						subList.css({
							top: 'auto',
							bottom: 0
						});
					};
					if (!fitHorizontal(subList, $(this).offset().left + 100)) {
						subList.css({
							left: 'auto',
							right: linkWidth,
							'z-index': 1005
						});
					};
					showTimer = setTimeout(function() {
						subList.addClass('ui-widget-content').show(options.showSpeed).attr('aria-expanded', 'true');
					}, 300);
				}, function() {
					clearTimeout(showTimer);
					var subList = $(this).next();
					hideTimer = setTimeout(function() {
						subList.removeClass('ui-widget-content').hide(options.showSpeed).attr('aria-expanded', 'false');
					}, 400);
				});
				$(this).find('ul a').hover(function() {
					clearTimeout(hideTimer);
					if ($(this).parents('ul').prev().is('a.fg-menu-indicator')) {
						$(this).parents('ul').prev().addClass(options.flyOutOnState);
					}
				}, function() {
					hideTimer = setTimeout(function() {
						allSubLists.hide(options.showSpeed);
						container.find(options.flyOutOnState).removeClass(options.flyOutOnState);
					}, 500);
				});
			});
			container.find('a').click(function() {
				menu.chooseItem(this);
				return false;
			});
		};
		Menu.prototype.drilldown = function(container, options) {
			var menu = this;
			var topList = container.find('.fg-menu');
			var breadcrumb = $('<ul class="fg-menu-breadcrumb ui-widget-header ui-corner-all ui-helper-clearfix"></ul>');
			var crumbDefaultHeader = $('<li class="fg-menu-breadcrumb-text">' + options.crumbDefaultText + '</li>');
			var firstCrumbText = (options.backLink) ? options.backLinkText : options.topLinkText;
			var firstCrumbClass = (options.backLink) ? 'fg-menu-prev-list' : 'fg-menu-all-lists';
			var firstCrumbLinkClass = (options.backLink) ? 'ui-state-default ui-corner-all' : '';
			var firstCrumbIcon = (options.backLink) ? '<span class="ui-icon ui-icon-triangle-1-w"></span>' : '';
			var firstCrumb = $('<li class="' + firstCrumbClass + '"><a href="#" class="' + firstCrumbLinkClass + '">' + firstCrumbIcon + firstCrumbText + '</a></li>');
			container.addClass('fg-menu-ipod');
			if (options.backLink) {
				breadcrumb.addClass('fg-menu-footer').appendTo(container).hide();
			} else {
				breadcrumb.addClass('fg-menu-header').prependTo(container);
			};
			breadcrumb.append(crumbDefaultHeader);
			var checkMenuHeight = function(el) {
				if (el.height() > options.maxHeight) {
					el.addClass('fg-menu-scroll')
				};
				el.css({
					height: options.maxHeight - 30
				});
			};
			var resetChildMenu = function(el) {
				el.removeClass('fg-menu-scroll').removeClass('fg-menu-current').height('auto');
			};
			this.resetDrilldownMenu = function() {
				$('.fg-menu-current').removeClass('fg-menu-current');
				topList.animate({
					left: 0
				}, options.crossSpeed, function() {
					$(this).find('ul').each(function() {
						$(this).hide();
						resetChildMenu($(this));
					});
					topList.addClass('fg-menu-current');
				});
				$('.fg-menu-all-lists').find('span').remove();
				breadcrumb.empty().append(crumbDefaultHeader);
				$('.fg-menu-footer').empty().hide();
				checkMenuHeight(topList);
			};
			topList.addClass('fg-menu-content fg-menu-current ui-widget-content ui-helper-clearfix').css({
				width: container.width()
			}).find('ul').css({
					width: container.width(),
					left: container.width()
				}).addClass('ui-widget-content').hide();
			checkMenuHeight(topList);
			topList.find('a').each(function() {
				if ($(this).next().is('ul')) {
					$(this).addClass('fg-menu-indicator').each(function() {
						if (!$(this).hasClass('fg-menu-link')) {
							$(this).addClass('fg-menu-link').html(nextMenuLink = '<span>' + $(this).html() + '</span><span class="ui-icon ' + options.nextMenuLink + '"></span>')
						}
					}).click(function() {
							var nextList = $(this).next();
							var parentUl = $(this).parents('ul:eq(0)');
							var parentLeft = (parentUl.is('.fg-menu-content')) ? 0 : parseFloat(topList.css('left'));
							var nextLeftVal = Math.round(parentLeft - parseFloat(container.width()));
							var footer = $('.fg-menu-footer');
							resetChildMenu(parentUl);
							checkMenuHeight(nextList);
							topList.animate({
								left: nextLeftVal
							}, options.crossSpeed);
							nextList.show().addClass('fg-menu-current').attr('aria-expanded', 'true');
							var setPrevMenu = function(backlink) {
								var b = backlink;
								var c = $('.fg-menu-current');
								var prevList = c.parents('ul:eq(0)');
								c.hide().attr('aria-expanded', 'false');
								resetChildMenu(c);
								checkMenuHeight(prevList);
								prevList.addClass('fg-menu-current').attr('aria-expanded', 'true');
								if (prevList.hasClass('fg-menu-content')) {
									b.remove();
									footer.hide();
								};
							};
							if (options.backLink) {
								if (footer.find('a').size() == 0) {
									footer.show();
									$('<a href="#"><span class="ui-icon ui-icon-triangle-1-w"></span> <span>Back</span></a>').appendTo(footer).click(function() {
										var b = $(this);
										var prevLeftVal = parseFloat(topList.css('left')) + container.width();
										topList.animate({
											left: prevLeftVal
										}, options.crossSpeed, function() {
											setPrevMenu(b);
										});
										return false;
									});
								}
							} else {
								if (breadcrumb.find('li').size() == 1) {
									breadcrumb.empty().append(firstCrumb);
									firstCrumb.find('a').click(function() {
										menu.resetDrilldownMenu();
										return false;
									});
								}
								$('.fg-menu-current-crumb').removeClass('fg-menu-current-crumb');
								var crumbText = $(this).find('span:eq(0)').text();
								var newCrumb = $('<li class="fg-menu-current-crumb"><a href="javascript://" class="fg-menu-crumb">' + crumbText + '</a></li>');
								newCrumb.appendTo(breadcrumb).find('a').click(function() {
									if ($(this).parent().is('.fg-menu-current-crumb')) {
										menu.chooseItem(this);
									} else {
										var newLeftVal = -($('.fg-menu-current').parents('ul').size() - 1) * 180;
										topList.animate({
											left: newLeftVal
										}, options.crossSpeed, function() {
											setPrevMenu();
										});
										$(this).parent().addClass('fg-menu-current-crumb').find('span').remove();
										$(this).parent().nextAll().remove();
									};
									return false;
								});
								newCrumb.prev().append(' <span class="ui-icon ' + options.nextCrumbLink + '"></span>');
							};
							return false;
						});
				} else {
					$(this).click(function() {
						menu.chooseItem(this);
						return false;
					});
				};
			});
		};
		Menu.prototype.setPosition = function(widget, caller, options) {
			mw.log('jquery.menu::setPosition');
			var el = widget;
			var referrer = caller;
			var dims = {
				refX: referrer.offset().left,
				refY: referrer.offset().top,
				refW: referrer.getTotalWidth(),
				refH: referrer.getTotalHeight()
			};
			var options = options;
			var xVal, yVal;
			var helper = $('<div class="menuPositionHelper">');
			helper.css('z-index', options.zindex);
			if (isNaN(dims.refW) || isNaN(dims.refH)) {
				dims.refH = 16;
				dims.refW = 23;
			}
			helper.css({
				'position': 'absolute',
				'left': dims.refX,
				'top': dims.refY,
				'width': dims.refW,
				'height': dims.refH
			});
			el.wrap(helper);
			xVal = yVal = 0;
			switch (options.positionOpts.posX) {
				case 'left':
					xVal = 0;
					break;
				case 'center':
					xVal = dims.refW / 2;
					break;
				case 'right':
					xVal = dims.refW;
					break;
			};
			switch (options.positionOpts.posY) {
				case 'top':
					yVal = 0;
					break;
				case 'center':
					yVal = dims.refH / 2;
					break;
				case 'bottom':
					yVal = dims.refH;
					break;
			};
			xVal += (options.positionOpts.offsetX) ? options.positionOpts.offsetX : 0;
			yVal += (options.positionOpts.offsetY) ? options.positionOpts.offsetY : 0;
			mw.log(" about to position: " + yVal);
			if (options.positionOpts.directionV == 'up') {
				el.css({
					'top': 'auto',
					'bottom': yVal
				});
				if (options.positionOpts.detectV && !fitVertical(el)) {
					el.css({
						'bottom': 'auto',
						'top': yVal
					});
				}
			} else {
				el.css({
					'bottom': 'auto',
					'top': yVal
				});
				if (options.positionOpts.detectV && !fitVertical(el)) {
					el.css({
						'top': 'auto',
						'bottom': yVal
					});
				}
			};
			if (options.positionOpts.directionH == 'left') {
				el.css({
					left: 'auto',
					right: xVal
				});
				if (options.positionOpts.detectH && !fitHorizontal(el)) {
					el.css({
						right: 'auto',
						left: xVal
					});
				}
			} else {
				el.css({
					right: 'auto',
					left: xVal
				});
				if (options.positionOpts.detectH && !fitHorizontal(el)) {
					el.css({
						left: 'auto',
						right: xVal
					});
				}
			};
			if (options.positionOpts.linkToFront) {
				referrer.clone().addClass('linkClone').css({
					position: 'absolute',
					top: 0,
					right: 'auto',
					bottom: 'auto',
					left: 0,
					width: referrer.width(),
					height: referrer.height()
				}).insertAfter(el);
			};
		};

		function sortBigToSmall(a, b) {
			return b - a;
		};
		jQuery.fn.getTotalWidth = function() {
			return $(this).width() + parseInt($(this).css('paddingRight')) + parseInt($(this).css('paddingLeft')) + parseInt($(this).css('borderRightWidth')) + parseInt($(this).css('borderLeftWidth'));
		};
		jQuery.fn.getTotalHeight = function() {
			return $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom')) + parseInt($(this).css('borderTopWidth')) + parseInt($(this).css('borderBottomWidth'));
		};

		function getScrollTop() {
			return self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		};

		function getScrollLeft() {
			return self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
		};

		function getWindowHeight() {
			var de = document.documentElement;
			return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
		};

		function getWindowWidth() {
			var de = document.documentElement;
			return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
		};

		function fitHorizontal(el, leftOffset) {
			var leftVal = parseInt(leftOffset) || $(el).offset().left;
			return (leftVal + $(el).width() <= getWindowWidth() + getScrollLeft() && leftVal - getScrollLeft() >= 0);
		};

		function fitVertical(el, topOffset) {
			var topVal = parseInt(topOffset) || $(el).offset().top;
			return (topVal + $(el).height() <= getWindowHeight() + getScrollTop() && topVal - getScrollTop() >= 0);
		};
		Number.prototype.pxToEm = String.prototype.pxToEm = function(settings) {
			settings = jQuery.extend({
				scope: 'body',
				reverse: false
			}, settings);
			var pxVal = (this == '') ? 0 : parseFloat(this);
			var scopeVal;
			var getWindowWidth = function() {
				var de = document.documentElement;
				return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
			};
			if (settings.scope == 'body' && $.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
				var calcFontSize = function() {
					return (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(3) * 16;
				};
				scopeVal = calcFontSize();
			} else {
				scopeVal = parseFloat(jQuery(settings.scope).css("font-size"));
			};
			var result = (settings.reverse == true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
			return result;
		};
	})(jQuery);;
}, {
	"all": ".fg-menu-container{position:absolute;top:0;left:-999px;padding:.4em;overflow:hidden}.fg-menu-container.fg-menu-flyout{overflow:visible}.fg-menu,.fg-menu ul{list-style:none none;padding:0;margin:0}.fg-menu{position:relative}.fg-menu-flyout .fg-menu{position:static}.fg-menu ul{position:absolute;top:0}.fg-menu ul ul{top:-1px}.fg-menu-container.fg-menu-ipod .fg-menu-content,.fg-menu-container.fg-menu-ipod .fg-menu-content ul{background:none !important}.fg-menu.fg-menu-scroll,.fg-menu ul.fg-menu-scroll{overflow:scroll;overflow-x:hidden}.fg-menu li{clear:both;float:left;width:100%;margin:0;padding:0;border:0}.fg-menu li li{font-size:1em} .fg-menu-flyout ul ul{padding:.4em}.fg-menu-flyout li{position:relative}.fg-menu-scroll{overflow:scroll;overflow-x:hidden}.fg-menu-breadcrumb{margin:0;padding:0}.fg-menu-footer{margin-top:.4em;padding:.4em;position:absolute;bottom:2px;width:170px}.fg-menu-header{margin-bottom:.4em;padding:.4em}.fg-menu-breadcrumb li{float:left;list-style:none;margin:0;padding:0 .2em;font-size:.9em;opacity:.7}.fg-menu-breadcrumb li.fg-menu-prev-list,.fg-menu-breadcrumb li.fg-menu-current-crumb{clear:left;float:none;opacity:1}.fg-menu-breadcrumb li.fg-menu-current-crumb{padding-top:.2em}.fg-menu-breadcrumb a,.fg-menu-breadcrumb span{float:left}.fg-menu-footer a:link,.fg-menu-footer a:visited{float:left;width:100%;text-decoration:none}.fg-menu-footer a:hover,.fg-menu-footer a:active{}.fg-menu-footer a span{float:left;cursor:pointer}.fg-menu-breadcrumb .fg-menu-prev-list a:link,.fg-menu-breadcrumb .fg-menu-prev-list a:visited,.fg-menu-breadcrumb .fg-menu-prev-list a:hover,.fg-menu-breadcrumb .fg-menu-prev-list a:active{background-image:none;text-decoration:none}.fg-menu-breadcrumb .fg-menu-prev-list a{float:left;padding-right:.4em}.fg-menu-breadcrumb .fg-menu-prev-list a .ui-icon{float:left}.fg-menu-breadcrumb .fg-menu-current-crumb a:link,.fg-menu-breadcrumb .fg-menu-current-crumb a:visited,.fg-menu-breadcrumb .fg-menu-current-crumb a:hover,.fg-menu-breadcrumb .fg-menu-current-crumb a:active{display:block;background-image:none;font-size:1.3em;text-decoration:none} .fg-menu a:link,.fg-menu a:visited,.fg-menu a:hover,.fg-menu a:active{float:left;width:92%;padding:.3em 3%;text-decoration:none;outline:0 !important}.fg-menu a{border:1px dashed transparent}.fg-menu a.ui-state-default:link,.fg-menu a.ui-state-default:visited,.fg-menu a.ui-state-default:hover,.fg-menu a.ui-state-default:active,.fg-menu a.ui-state-hover:link,.fg-menu a.ui-state-hover:visited,.fg-menu a.ui-state-hover:hover,.fg-menu a.ui-state-hover:active,.fg-menu a.ui-state-active:link,.fg-menu a.ui-state-active:visited,.fg-menu a.ui-state-active:hover,.fg-menu a.ui-state-active:active{border-style:solid;font-weight:normal}.fg-menu a span{display:block;cursor:pointer} .fg-menu-indicator span{float:left}.fg-menu-indicator span.ui-icon{float:right}.fg-menu-content.ui-widget-content,.fg-menu-content ul.ui-widget-content{border:0} .fg-menu.fg-menu-has-icons a:link,.fg-menu.fg-menu-has-icons a:visited,.fg-menu.fg-menu-has-icons a:hover,.fg-menu.fg-menu-has-icons a:active{padding-left:20px}.fg-menu .horizontal-divider hr,.fg-menu .horizontal-divider span{padding:0;margin:5px .6em}.fg-menu .horizontal-divider hr{border:0;height:1px}.fg-menu .horizontal-divider span{font-size:.9em;text-transform:uppercase;padding-left:.2em}\n\n/* cache key: resourceloader:filter:minify-css:7:83724fc45d6aee680c63f0df172c9324 */\n"
}, {});
mw.loader.implement("jquery.messageBox", function($) {
	(function($) {
		$.messageBoxNew = function(options) {
			options = $.extend({
				id: 'js-messagebox',
				parent: 'body',
				insert: 'prepend'
			}, options);
			var $curBox = $('#' + options.id);
			if ($curBox.length > 0) {
				if ($curBox.hasClass('js-messagebox')) {
					return $curBox;
				} else {
					return $curBox.addClass('js-messagebox');
				}
			} else {
				var $newBox = $('<div>', {
					'id': options.id,
					'class': 'js-messagebox',
					'css': {
						'display': 'none'
					}
				});
				if ($(options.parent).length < 1) {
					options.parent = 'body';
				}
				if (options.insert === 'append') {
					$newBox.appendTo(options.parent);
					return $newBox;
				} else {
					$newBox.prependTo(options.parent);
					return $newBox;
				}
			}
		};
		$.messageBox = function(options) {
			options = $.extend({
				message: '',
				group: 'default',
				replace: false,
				target: 'js-messagebox'
			}, options);
			var $target = $.messageBoxNew({
				id: options.target
			});
			var groupID = options.target + '-' + options.group;
			var $group = $('#' + groupID);
			if ($group.length < 1) {
				$group = $('<div>', {
					'id': groupID,
					'class': 'js-messagebox-group'
				});
				$target.prepend($group);
			}
			if (options.replace === true) {
				$group.empty();
			}
			if (options.message === '' || options.message === null) {
				$group.hide();
			} else {
				$group.prepend($('<p>').append(options.message)).show();
				$target.slideDown();
			}
			if ($target.find('> *:visible').length === 0) {
				$group.show();
				$target.slideUp();
				$group.hide();
			} else {
				$target.slideDown();
			}
			return $group;
		};
	}(jQuery));;
}, {
	"all": ".js-messagebox{margin:1em 5%;padding:0.5em 2.5%;border:1px solid #ccc;background-color:#fcfcfc;font-size:0.8em}.js-messagebox .js-messagebox-group{margin:1px;padding:0.5em 2.5%;border-bottom:1px solid #ddd}.js-messagebox .js-messagebox-group:last-child{border-bottom:thin none transparent}\n\n/* cache key: resourceloader:filter:minify-css:7:2bb917065f5e11cbbe44ba45500bbed5 */\n"
}, {});
mw.loader.implement("jquery.mwEmbedUtil", function($) {
	(function($) {
		var _oldUnique = $.unique;
		$.unique = function(arr) {
			if ( !! arr[0].nodeType) {
				return _oldUnique.apply(this, arguments);
			} else {
				return $.grep(arr, function(v, k) {
					return $.inArray(v, arr) === k;
				});
			}
		};
		$.btnHtml = function(msg, styleClass, iconId, opt) {
			if (!opt) opt = {};
			var href = (opt.href) ? opt.href : '#';
			var target_attr = (opt.target) ? ' target="' + opt.target + '" ' : '';
			var style_attr = (opt.style) ? ' style="' + opt.style + '" ' : '';
			return '<a href="' + href + '" ' + target_attr + style_attr + ' class="ui-state-default ui-corner-all ui-icon_link ' + styleClass + '"><span class="ui-icon ui-icon-' + iconId + '" ></span>' + '<span class="btnText">' + msg + '</span></a>';
		};
		var mw_default_button_options = {
			'class': '',
			'style': {},
			'text': '',
			'icon': 'carat-1-n'
		};
		$.button = function(options) {
			var options = $j.extend({}, mw_default_button_options, options);
			var $button = $('<a />').attr('href', '#').addClass('ui-state-default ui-corner-all ui-icon_link');
			if (options.css) {
				$button.css(options.css);
			}
			if (options['class']) {
				$button.addClass(options['class']);
			}
			$button.append($('<span />').addClass('ui-icon ui-icon-' + options.icon), $('<span />').addClass('btnText').text(options.text)).buttonHover();
			if (!options.text) {
				$button.css('padding', '1em');
			}
			return $button;
		};
		$.fn.buttonHover = function() {
			$(this).hover(function() {
				$(this).addClass('ui-state-hover');
			}, function() {
				$(this).removeClass('ui-state-hover');
			});
			return this;
		};
		$.fn.dialogFitWindow = function(options) {
			var opt_default = {
				'hspace': 50,
				'vspace': 50
			};
			if (!options) var options = {};
			options = $j.extend(opt_default, options);
			$(this.selector).dialog('option', 'width', $(window).width() - options.hspace);
			$(this.selector).dialog('option', 'height', $(window).height() - options.vspace);
			$(this.selector).dialog('option', 'position', 'center');
			$(this.selector + '~ .ui-dialog-buttonpane').css({
				'position': 'absolute',
				'left': '0px',
				'right': '0px',
				'bottom': '0px'
			});
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.mwExtension", function($) {
	(function($) {
		$.extend({
			trimLeft: function(str) {
				return str === null ? '' : str.toString().replace(/^\s+/, '');
			},
			trimRight: function(str) {
				return str === null ? '' : str.toString().replace(/\s+$/, '');
			},
			ucFirst: function(str) {
				return str.charAt(0).toUpperCase() + str.substr(1);
			},
			escapeRE: function(str) {
				return str.replace(/([\\{}()|.?*+\-^$\[\]])/g, "\\$1");
			},
			isDomElement: function(el) {
				return !!el && !! el.nodeType;
			},
			isEmpty: function(v) {
				if (v === '' || v === 0 || v === '0' || v === null || v === false || v === undefined) {
					return true;
				}
				if (v.length === 0) {
					return true;
				}
				if (typeof v === 'object') {
					for (var key in v) {
						return false;
					}
					return true;
				}
				return false;
			},
			compareArray: function(arrThis, arrAgainst) {
				if (arrThis.length != arrAgainst.length) {
					return false;
				}
				for (var i = 0; i < arrThis.length; i++) {
					if ($.isArray(arrThis[i])) {
						if (!$.compareArray(arrThis[i], arrAgainst[i])) {
							return false;
						}
					} else if (arrThis[i] !== arrAgainst[i]) {
						return false;
					}
				}
				return true;
			},
			compareObject: function(objectA, objectB) {
				if (typeof objectA == typeof objectB) {
					if (typeof objectA == 'object') {
						if (objectA === objectB) {
							return true;
						} else {
							var prop;
							for (prop in objectA) {
								if (prop in objectB) {
									var type = typeof objectA[prop];
									if (type == typeof objectB[prop]) {
										switch (type) {
											case 'object':
												if (!$.compareObject(objectA[prop], objectB[prop])) {
													return false;
												}
												break;
											case 'function':
												if (objectA[prop].toString() !== objectB[prop].toString()) {
													return false;
												}
												break;
											default:
												if (objectA[prop] !== objectB[prop]) {
													return false;
												}
												break;
										}
									} else {
										return false;
									}
								} else {
									return false;
								}
							}
							for (prop in objectB) {
								if (!(prop in objectA)) {
									return false;
								}
							}
						}
					}
				} else {
					return false;
				}
				return true;
			}
		});
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.ui.button", function($) {
	(function($) {
		var lastActive, baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
			stateClasses = "ui-state-hover ui-state-active ",
			typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon ui-button-text-only",
			formResetHandler = function(event) {
				$(":ui-button", event.target.form).each(function() {
					var inst = $(this).data("button");
					setTimeout(function() {
						inst.refresh();
					}, 1);
				});
			}, radioGroup = function(radio) {
				var name = radio.name,
					form = radio.form,
					radios = $([]);
				if (name) {
					if (form) {
						radios = $(form).find("[name='" + name + "']");
					} else {
						radios = $("[name='" + name + "']", radio.ownerDocument).filter(function() {
							return !this.form;
						});
					}
				}
				return radios;
			};
		$.widget("ui.button", {
			options: {
				text: true,
				label: null,
				icons: {
					primary: null,
					secondary: null
				}
			},
			_create: function() {
				this.element.closest("form").unbind("reset.button").bind("reset.button", formResetHandler);
				this._determineButtonType();
				this.hasTitle = !! this.buttonElement.attr("title");
				var self = this,
					options = this.options,
					toggleButton = this.type === "checkbox" || this.type === "radio",
					hoverClass = "ui-state-hover" + (!toggleButton ? " ui-state-active" : ""),
					focusClass = "ui-state-focus";
				if (options.label === null) {
					options.label = this.buttonElement.html();
				}
				if (this.element.is(":disabled")) {
					options.disabled = true;
				}
				this.buttonElement.addClass(baseClasses).attr("role", "button").bind("mouseenter.button", function() {
					if (options.disabled) {
						return;
					}
					$(this).addClass("ui-state-hover");
					if (this === lastActive) {
						$(this).addClass("ui-state-active");
					}
				}).bind("mouseleave.button", function() {
						if (options.disabled) {
							return;
						}
						$(this).removeClass(hoverClass);
					}).bind("focus.button", function() {
						$(this).addClass(focusClass);
					}).bind("blur.button", function() {
						$(this).removeClass(focusClass);
					});
				if (toggleButton) {
					this.element.bind("change.button", function() {
						self.refresh();
					});
				}
				if (this.type === "checkbox") {
					this.buttonElement.bind("click.button", function() {
						if (options.disabled) {
							return false;
						}
						$(this).toggleClass("ui-state-active");
						self.buttonElement.attr("aria-pressed", self.element[0].checked);
					});
				} else if (this.type === "radio") {
					this.buttonElement.bind("click.button", function() {
						if (options.disabled) {
							return false;
						}
						$(this).addClass("ui-state-active");
						self.buttonElement.attr("aria-pressed", true);
						var radio = self.element[0];
						radioGroup(radio).not(radio).map(function() {
							return $(this).button("widget")[0];
						}).removeClass("ui-state-active").attr("aria-pressed", false);
					});
				} else {
					this.buttonElement.bind("mousedown.button", function() {
						if (options.disabled) {
							return false;
						}
						$(this).addClass("ui-state-active");
						lastActive = this;
						$(document).one("mouseup", function() {
							lastActive = null;
						});
					}).bind("mouseup.button", function() {
							if (options.disabled) {
								return false;
							}
							$(this).removeClass("ui-state-active");
						}).bind("keydown.button", function(event) {
							if (options.disabled) {
								return false;
							}
							if (event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER) {
								$(this).addClass("ui-state-active");
							}
						}).bind("keyup.button", function() {
							$(this).removeClass("ui-state-active");
						});
					if (this.buttonElement.is("a")) {
						this.buttonElement.keyup(function(event) {
							if (event.keyCode === $.ui.keyCode.SPACE) {
								$(this).click();
							}
						});
					}
				}
				this._setOption("disabled", options.disabled);
			},
			_determineButtonType: function() {
				if (this.element.is(":checkbox")) {
					this.type = "checkbox";
				} else {
					if (this.element.is(":radio")) {
						this.type = "radio";
					} else {
						if (this.element.is("input")) {
							this.type = "input";
						} else {
							this.type = "button";
						}
					}
				}
				if (this.type === "checkbox" || this.type === "radio") {
					this.buttonElement = this.element.parents().last().find("[for=" + this.element.attr("id") + "]");
					this.element.addClass("ui-helper-hidden-accessible");
					var checked = this.element.is(":checked");
					if (checked) {
						this.buttonElement.addClass("ui-state-active");
					}
					this.buttonElement.attr("aria-pressed", checked);
				} else {
					this.buttonElement = this.element;
				}
			},
			widget: function() {
				return this.buttonElement;
			},
			destroy: function() {
				this.element.removeClass("ui-helper-hidden-accessible");
				this.buttonElement.removeClass(baseClasses + " " + stateClasses + " " + typeClasses).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
				if (!this.hasTitle) {
					this.buttonElement.removeAttr("title");
				}
				$.Widget.prototype.destroy.call(this);
			},
			_setOption: function(key, value) {
				$.Widget.prototype._setOption.apply(this, arguments);
				if (key === "disabled") {
					if (value) {
						this.element.attr("disabled", true);
					} else {
						this.element.removeAttr("disabled");
					}
				}
				this._resetButton();
			},
			refresh: function() {
				var isDisabled = this.element.is(":disabled");
				if (isDisabled !== this.options.disabled) {
					this._setOption("disabled", isDisabled);
				}
				if (this.type === "radio") {
					radioGroup(this.element[0]).each(function() {
						if ($(this).is(":checked")) {
							$(this).button("widget").addClass("ui-state-active").attr("aria-pressed", true);
						} else {
							$(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", false);
						}
					});
				} else if (this.type === "checkbox") {
					if (this.element.is(":checked")) {
						this.buttonElement.addClass("ui-state-active").attr("aria-pressed", true);
					} else {
						this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", false);
					}
				}
			},
			_resetButton: function() {
				if (this.type === "input") {
					if (this.options.label) {
						this.element.val(this.options.label);
					}
					return;
				}
				var buttonElement = this.buttonElement.removeClass(typeClasses),
					buttonText = $("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(buttonElement.empty()).text(),
					icons = this.options.icons,
					multipleIcons = icons.primary && icons.secondary;
				if (icons.primary || icons.secondary) {
					buttonElement.addClass("ui-button-text-icon" + (multipleIcons ? "s" : ""));
					if (icons.primary) {
						buttonElement.prepend("<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>");
					}
					if (icons.secondary) {
						buttonElement.append("<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>");
					}
					if (!this.options.text) {
						buttonElement.addClass(multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only").removeClass("ui-button-text-icons ui-button-text-icon");
						if (!this.hasTitle) {
							buttonElement.attr("title", buttonText);
						}
					}
				} else {
					buttonElement.addClass("ui-button-text-only");
				}
			}
		});
		$.widget("ui.buttonset", {
			_create: function() {
				this.element.addClass("ui-buttonset");
				this._init();
			},
			_init: function() {
				this.refresh();
			},
			_setOption: function(key, value) {
				if (key === "disabled") {
					this.buttons.button("option", key, value);
				}
				$.Widget.prototype._setOption.apply(this, arguments);
			},
			refresh: function() {
				this.buttons = this.element.find(":button, :submit, :reset, :checkbox, :radio, a, :data(button)").filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
					return $(this).button("widget")[0];
				}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end();
			},
			destroy: function() {
				this.element.removeClass("ui-buttonset");
				this.buttons.map(function() {
					return $(this).button("widget")[0];
				}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
				$.Widget.prototype.destroy.call(this);
			}
		});
	}(jQuery));;
}, {
	"all": ".ui-button{display:inline-block;position:relative;padding:0;margin-right:.1em;text-decoration:none !important;cursor:pointer;text-align:center;zoom:1;overflow:visible} .ui-button-icon-only{width:2.2em} button.ui-button-icon-only{width:2.4em} .ui-button-icons-only{width:3.4em}button.ui-button-icons-only{width:3.7em} .ui-button .ui-button-text{display:block;line-height:1.4}.ui-button-text-only .ui-button-text{padding:.4em 1em}.ui-button-icon-only .ui-button-text,.ui-button-icons-only .ui-button-text{padding:.4em;text-indent:-9999999px}.ui-button-text-icon .ui-button-text,.ui-button-text-icons .ui-button-text{padding:.4em 1em .4em 2.1em}.ui-button-text-icons .ui-button-text{padding-left:2.1em;padding-right:2.1em} input.ui-button{padding:.4em 1em} .ui-button-icon-only .ui-icon,.ui-button-text-icon .ui-icon,.ui-button-text-icons .ui-icon,.ui-button-icons-only .ui-icon{position:absolute;top:50%;margin-top:-8px}.ui-button-icon-only .ui-icon{left:50%;margin-left:-8px}.ui-button-text-icon .ui-button-icon-primary,.ui-button-text-icons .ui-button-icon-primary,.ui-button-icons-only .ui-button-icon-primary{left:.5em}.ui-button-text-icons .ui-button-icon-secondary,.ui-button-icons-only .ui-button-icon-secondary{right:.5em} .ui-buttonset{margin-right:7px}.ui-buttonset .ui-button{margin-left:0;margin-right:-.3em} button.ui-button::-moz-focus-inner{border:0;padding:0}\n\n/* cache key: resourceloader:filter:minify-css:7:2b2f06157cbeed5c0ed774f6072721b6 */\n"
}, {});
mw.loader.implement("jquery.ui.core", function($) {
	(function($) {
		$.ui = $.ui || {};
		if ($.ui.version) {
			return;
		}
		$.extend($.ui, {
			version: "1.8.2",
			plugin: {
				add: function(module, option, set) {
					var proto = $.ui[module].prototype;
					for (var i in set) {
						proto.plugins[i] = proto.plugins[i] || [];
						proto.plugins[i].push([option, set[i]]);
					}
				},
				call: function(instance, name, args) {
					var set = instance.plugins[name];
					if (!set || !instance.element[0].parentNode) {
						return;
					}
					for (var i = 0; i < set.length; i++) {
						if (instance.options[set[i][0]]) {
							set[i][1].apply(instance.element, args);
						}
					}
				}
			},
			contains: function(a, b) {
				return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b);
			},
			hasScroll: function(el, a) {
				if ($(el).css('overflow') == 'hidden') {
					return false;
				}
				var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
					has = false;
				if (el[scroll] > 0) {
					return true;
				}
				el[scroll] = 1;
				has = (el[scroll] > 0);
				el[scroll] = 0;
				return has;
			},
			isOverAxis: function(x, reference, size) {
				return (x > reference) && (x < (reference + size));
			},
			isOver: function(y, x, top, left, height, width) {
				return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
			},
			keyCode: {
				ALT: 18,
				BACKSPACE: 8,
				CAPS_LOCK: 20,
				COMMA: 188,
				COMMAND: 91,
				COMMAND_LEFT: 91,
				COMMAND_RIGHT: 93,
				CONTROL: 17,
				DELETE: 46,
				DOWN: 40,
				END: 35,
				ENTER: 13,
				ESCAPE: 27,
				HOME: 36,
				INSERT: 45,
				LEFT: 37,
				MENU: 93,
				NUMPAD_ADD: 107,
				NUMPAD_DECIMAL: 110,
				NUMPAD_DIVIDE: 111,
				NUMPAD_ENTER: 108,
				NUMPAD_MULTIPLY: 106,
				NUMPAD_SUBTRACT: 109,
				PAGE_DOWN: 34,
				PAGE_UP: 33,
				PERIOD: 190,
				RIGHT: 39,
				SHIFT: 16,
				SPACE: 32,
				TAB: 9,
				UP: 38,
				WINDOWS: 91
			}
		});
		$.fn.extend({
			_focus: $.fn.focus,
			focus: function(delay, fn) {
				return typeof delay === 'number' ? this.each(function() {
					var elem = this;
					setTimeout(function() {
						$(elem).focus();
						(fn && fn.call(elem));
					}, delay);
				}) : this._focus.apply(this, arguments);
			},
			enableSelection: function() {
				return this.attr('unselectable', 'off').css('MozUserSelect', '');
			},
			disableSelection: function() {
				return this.attr('unselectable', 'on').css('MozUserSelect', 'none');
			},
			scrollParent: function() {
				var scrollParent;
				if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
					scrollParent = this.parents().filter(function() {
						return (/(relative|absolute|fixed)/).test($.curCSS(this, 'position', 1)) && (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
					}).eq(0);
				} else {
					scrollParent = this.parents().filter(function() {
						return (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
					}).eq(0);
				}
				return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
			},
			zIndex: function(zIndex) {
				if (zIndex !== undefined) {
					return this.css('zIndex', zIndex);
				}
				if (this.length) {
					var elem = $(this[0]),
						position, value;
					while (elem.length && elem[0] !== document) {
						position = elem.css('position');
						if (position == 'absolute' || position == 'relative' || position == 'fixed') {
							value = parseInt(elem.css('zIndex'));
							if (!isNaN(value) && value != 0) {
								return value;
							}
						}
						elem = elem.parent();
					}
				}
				return 0;
			}
		});
		$.extend($.expr[':'], {
			data: function(elem, i, match) {
				return !!$.data(elem, match[3]);
			},
			focusable: function(element) {
				var nodeName = element.nodeName.toLowerCase(),
					tabIndex = $.attr(element, 'tabindex');
				return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : 'a' == nodeName || 'area' == nodeName ? element.href || !isNaN(tabIndex) : !isNaN(tabIndex)) && !$(element)['area' == nodeName ? 'parents' : 'closest'](':hidden').length;
			},
			tabbable: function(element) {
				var tabIndex = $.attr(element, 'tabindex');
				return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(':focusable');
			}
		});
	})(jQuery);;
}, {
	"all": ".ui-helper-hidden{display:none}.ui-helper-hidden-accessible{position:absolute;left:-99999999px}.ui-helper-reset{margin:0;padding:0;border:0;outline:0;line-height:1.3;text-decoration:none;font-size:100%;list-style:none}.ui-helper-clearfix:after{content:\".\";display:block;height:0;clear:both;visibility:hidden}.ui-helper-clearfix{display:inline-block} * html .ui-helper-clearfix{height:1%}.ui-helper-clearfix{display:block} .ui-helper-zfix{width:100%;height:100%;top:0;left:0;position:absolute;opacity:0;filter:Alpha(Opacity=0)} .ui-state-disabled{cursor:default !important}  .ui-icon{display:block;text-indent:-99999px;overflow:hidden;background-repeat:no-repeat}  .ui-widget-overlay{position:absolute;top:0;left:0;width:100%;height:100%}\n\n/* cache key: resourceloader:filter:minify-css:7:b80b11161e9a8e2d415a43fd6f09d170 */\n"
}, {});
mw.loader.implement("jquery.ui.dialog", function($) {
	(function($) {
		var uiDialogClasses = 'ui-dialog ' + 'ui-widget ' + 'ui-widget-content ' + 'ui-corner-all ';
		$.widget("ui.dialog", {
			options: {
				autoOpen: true,
				buttons: {},
				closeOnEscape: true,
				closeText: 'close',
				dialogClass: '',
				draggable: true,
				hide: null,
				height: 'auto',
				maxHeight: false,
				maxWidth: false,
				minHeight: 150,
				minWidth: 150,
				modal: false,
				position: 'center',
				resizable: true,
				show: null,
				stack: true,
				title: '',
				width: 300,
				zIndex: 1000
			},
			_create: function() {
				this.originalTitle = this.element.attr('title');
				var self = this,
					options = self.options,
					title = options.title || self.originalTitle || '&#160;',
					titleId = $.ui.dialog.getTitleId(self.element),
					uiDialog = (self.uiDialog = $('<div></div>')).appendTo(document.body).hide().addClass(uiDialogClasses + options.dialogClass).css({
						zIndex: options.zIndex
					}).attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
							if (options.closeOnEscape && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
								self.close(event);
								event.preventDefault();
							}
						}).attr({
							role: 'dialog',
							'aria-labelledby': titleId
						}).mousedown(function(event) {
							self.moveToTop(false, event);
						}),
					uiDialogContent = self.element.show().removeAttr('title').addClass('ui-dialog-content ' + 'ui-widget-content').appendTo(uiDialog),
					uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>')).addClass('ui-dialog-titlebar ' + 'ui-widget-header ' + 'ui-corner-all ' + 'ui-helper-clearfix').prependTo(uiDialog),
					uiDialogTitlebarClose = $('<a href="#"></a>').addClass('ui-dialog-titlebar-close ' + 'ui-corner-all').attr('role', 'button').hover(function() {
						uiDialogTitlebarClose.addClass('ui-state-hover');
					}, function() {
						uiDialogTitlebarClose.removeClass('ui-state-hover');
					}).focus(function() {
							uiDialogTitlebarClose.addClass('ui-state-focus');
						}).blur(function() {
							uiDialogTitlebarClose.removeClass('ui-state-focus');
						}).click(function(event) {
							self.close(event);
							return false;
						}).appendTo(uiDialogTitlebar),
					uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>')).addClass('ui-icon ' + 'ui-icon-closethick').text(options.closeText).appendTo(uiDialogTitlebarClose),
					uiDialogTitle = $('<span></span>').addClass('ui-dialog-title').attr('id', titleId).html(title).prependTo(uiDialogTitlebar);
				if ($.isFunction(options.beforeclose) && !$.isFunction(options.beforeClose)) {
					options.beforeClose = options.beforeclose;
				}
				uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();
				if (options.draggable && $.fn.draggable) {
					self._makeDraggable();
				}
				if (options.resizable && $.fn.resizable) {
					self._makeResizable();
				}
				self._createButtons(options.buttons);
				self._isOpen = false;
				if ($.fn.bgiframe) {
					uiDialog.bgiframe();
				}
			},
			_init: function() {
				if (this.options.autoOpen) {
					this.open();
				}
			},
			destroy: function() {
				var self = this;
				if (self.overlay) {
					self.overlay.destroy();
				}
				self.uiDialog.hide();
				self.element.unbind('.dialog').removeData('dialog').removeClass('ui-dialog-content ui-widget-content').hide().appendTo('body');
				self.uiDialog.remove();
				if (self.originalTitle) {
					self.element.attr('title', self.originalTitle);
				}
				return self;
			},
			widget: function() {
				return this.uiDialog;
			},
			close: function(event) {
				var self = this,
					maxZ;
				if (false === self._trigger('beforeClose', event)) {
					return;
				}
				if (self.overlay) {
					self.overlay.destroy();
				}
				self.uiDialog.unbind('keypress.ui-dialog');
				self._isOpen = false;
				if (self.options.hide) {
					self.uiDialog.hide(self.options.hide, function() {
						self._trigger('close', event);
					});
				} else {
					self.uiDialog.hide();
					self._trigger('close', event);
				}
				$.ui.dialog.overlay.resize();
				if (self.options.modal) {
					maxZ = 0;
					$('.ui-dialog').each(function() {
						if (this !== self.uiDialog[0]) {
							maxZ = Math.max(maxZ, $(this).css('z-index'));
						}
					});
					$.ui.dialog.maxZ = maxZ;
				}
				return self;
			},
			isOpen: function() {
				return this._isOpen;
			},
			moveToTop: function(force, event) {
				var self = this,
					options = self.options,
					saveScroll;
				if ((options.modal && !force) || (!options.stack && !options.modal)) {
					return self._trigger('focus', event);
				}
				if (options.zIndex > $.ui.dialog.maxZ) {
					$.ui.dialog.maxZ = options.zIndex;
				}
				if (self.overlay) {
					$.ui.dialog.maxZ += 1;
					self.overlay.$el.css('z-index', $.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ);
				}
				saveScroll = {
					scrollTop: self.element.attr('scrollTop'),
					scrollLeft: self.element.attr('scrollLeft')
				};
				$.ui.dialog.maxZ += 1;
				self.uiDialog.css('z-index', $.ui.dialog.maxZ);
				self.element.attr(saveScroll);
				self._trigger('focus', event);
				return self;
			},
			open: function() {
				if (this._isOpen) {
					return;
				}
				var self = this,
					options = self.options,
					uiDialog = self.uiDialog;
				self.overlay = options.modal ? new $.ui.dialog.overlay(self) : null;
				if (uiDialog.next().length) {
					uiDialog.appendTo('body');
				}
				self._size();
				self._position(options.position);
				uiDialog.show(options.show);
				self.moveToTop(true);
				if (options.modal) {
					uiDialog.bind('keypress.ui-dialog', function(event) {
						if (event.keyCode !== $.ui.keyCode.TAB) {
							return;
						}
						var tabbables = $(':tabbable', this),
							first = tabbables.filter(':first'),
							last = tabbables.filter(':last');
						if (event.target === last[0] && !event.shiftKey) {
							first.focus(1);
							return false;
						} else if (event.target === first[0] && event.shiftKey) {
							last.focus(1);
							return false;
						}
					});
				}
				$([]).add(uiDialog.find('.ui-dialog-content :tabbable:first')).add(uiDialog.find('.ui-dialog-buttonpane :tabbable:first')).add(uiDialog).filter(':first').focus();
				self._trigger('open');
				self._isOpen = true;
				return self;
			},
			_createButtons: function(buttons) {
				var self = this,
					hasButtons = false,
					uiDialogButtonPane = $('<div></div>').addClass('ui-dialog-buttonpane ' + 'ui-widget-content ' + 'ui-helper-clearfix');
				self.uiDialog.find('.ui-dialog-buttonpane').remove();
				if (typeof buttons === 'object' && buttons !== null) {
					$.each(buttons, function() {
						return !(hasButtons = true);
					});
				}
				if (hasButtons) {
					$.each(buttons, function(name, fn) {
						var button = $('<button type="button"></button>').text(name).click(function() {
							fn.apply(self.element[0], arguments);
						}).appendTo(uiDialogButtonPane);
						if ($.fn.button) {
							button.button();
						}
					});
					uiDialogButtonPane.appendTo(self.uiDialog);
				}
			},
			_makeDraggable: function() {
				var self = this,
					options = self.options,
					doc = $(document),
					heightBeforeDrag;

				function filteredUi(ui) {
					return {
						position: ui.position,
						offset: ui.offset
					};
				}
				self.uiDialog.draggable({
					cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
					handle: '.ui-dialog-titlebar',
					containment: 'document',
					start: function(event, ui) {
						heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
						$(this).height($(this).height()).addClass("ui-dialog-dragging");
						self._trigger('dragStart', event, filteredUi(ui));
					},
					drag: function(event, ui) {
						self._trigger('drag', event, filteredUi(ui));
					},
					stop: function(event, ui) {
						options.position = [ui.position.left - doc.scrollLeft(), ui.position.top - doc.scrollTop()];
						$(this).removeClass("ui-dialog-dragging").height(heightBeforeDrag);
						self._trigger('dragStop', event, filteredUi(ui));
						$.ui.dialog.overlay.resize();
					}
				});
			},
			_makeResizable: function(handles) {
				handles = (handles === undefined ? this.options.resizable : handles);
				var self = this,
					options = self.options,
					position = self.uiDialog.css('position'),
					resizeHandles = (typeof handles === 'string' ? handles : 'n,e,s,w,se,sw,ne,nw');

				function filteredUi(ui) {
					return {
						originalPosition: ui.originalPosition,
						originalSize: ui.originalSize,
						position: ui.position,
						size: ui.size
					};
				}
				self.uiDialog.resizable({
					cancel: '.ui-dialog-content',
					containment: 'document',
					alsoResize: self.element,
					maxWidth: options.maxWidth,
					maxHeight: options.maxHeight,
					minWidth: options.minWidth,
					minHeight: self._minHeight(),
					handles: resizeHandles,
					start: function(event, ui) {
						$(this).addClass("ui-dialog-resizing");
						self._trigger('resizeStart', event, filteredUi(ui));
					},
					resize: function(event, ui) {
						self._trigger('resize', event, filteredUi(ui));
					},
					stop: function(event, ui) {
						$(this).removeClass("ui-dialog-resizing");
						options.height = $(this).height();
						options.width = $(this).width();
						self._trigger('resizeStop', event, filteredUi(ui));
						$.ui.dialog.overlay.resize();
					}
				}).css('position', position).find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
			},
			_minHeight: function() {
				var options = this.options;
				if (options.height === 'auto') {
					return options.minHeight;
				} else {
					return Math.min(options.minHeight, options.height);
				}
			},
			_position: function(position) {
				var myAt = [],
					offset = [0, 0],
					isVisible;
				position = position || $.ui.dialog.prototype.options.position;
				if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
					myAt = position.split ? position.split(' ') : [position[0], position[1]];
					if (myAt.length === 1) {
						myAt[1] = myAt[0];
					}
					$.each(['left', 'top'], function(i, offsetPosition) {
						if (+myAt[i] === myAt[i]) {
							offset[i] = myAt[i];
							myAt[i] = offsetPosition;
						}
					});
				} else if (typeof position === 'object') {
					if ('left' in position) {
						myAt[0] = 'left';
						offset[0] = position.left;
					} else if ('right' in position) {
						myAt[0] = 'right';
						offset[0] = -position.right;
					}
					if ('top' in position) {
						myAt[1] = 'top';
						offset[1] = position.top;
					} else if ('bottom' in position) {
						myAt[1] = 'bottom';
						offset[1] = -position.bottom;
					}
				}
				isVisible = this.uiDialog.is(':visible');
				if (!isVisible) {
					this.uiDialog.show();
				}
				this.uiDialog.css({
					top: 0,
					left: 0
				}).position({
						my: myAt.join(' '),
						at: myAt.join(' '),
						offset: offset.join(' '),
						of: window,
						collision: 'fit',
						using: function(pos) {
							var topOffset = $(this).css(pos).offset().top;
							if (topOffset < 0) {
								$(this).css('top', pos.top - topOffset);
							}
						}
					});
				if (!isVisible) {
					this.uiDialog.hide();
				}
			},
			_setOption: function(key, value) {
				var self = this,
					uiDialog = self.uiDialog,
					isResizable = uiDialog.is(':data(resizable)'),
					resize = false;
				switch (key) {
					case "beforeclose":
						key = "beforeClose";
						break;
					case "buttons":
						self._createButtons(value);
						break;
					case "closeText":
						self.uiDialogTitlebarCloseText.text("" + value);
						break;
					case "dialogClass":
						uiDialog.removeClass(self.options.dialogClass).addClass(uiDialogClasses + value);
						break;
					case "disabled":
						if (value) {
							uiDialog.addClass('ui-dialog-disabled');
						} else {
							uiDialog.removeClass('ui-dialog-disabled');
						}
						break;
					case "draggable":
						if (value) {
							self._makeDraggable();
						} else {
							uiDialog.draggable('destroy');
						}
						break;
					case "height":
						resize = true;
						break;
					case "maxHeight":
						if (isResizable) {
							uiDialog.resizable('option', 'maxHeight', value);
						}
						resize = true;
						break;
					case "maxWidth":
						if (isResizable) {
							uiDialog.resizable('option', 'maxWidth', value);
						}
						resize = true;
						break;
					case "minHeight":
						if (isResizable) {
							uiDialog.resizable('option', 'minHeight', value);
						}
						resize = true;
						break;
					case "minWidth":
						if (isResizable) {
							uiDialog.resizable('option', 'minWidth', value);
						}
						resize = true;
						break;
					case "position":
						self._position(value);
						break;
					case "resizable":
						if (isResizable && !value) {
							uiDialog.resizable('destroy');
						}
						if (isResizable && typeof value === 'string') {
							uiDialog.resizable('option', 'handles', value);
						}
						if (!isResizable && value !== false) {
							self._makeResizable(value);
						}
						break;
					case "title":
						$(".ui-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
						break;
					case "width":
						resize = true;
						break;
				}
				$.Widget.prototype._setOption.apply(self, arguments);
				if (resize) {
					self._size();
				}
			},
			_size: function() {
				var options = this.options,
					nonContentHeight;
				this.element.css({
					width: 'auto',
					minHeight: 0,
					height: 0
				});
				nonContentHeight = this.uiDialog.css({
					height: 'auto',
					width: options.width
				}).height();
				this.element.css(options.height === 'auto' ? {
					minHeight: Math.max(options.minHeight - nonContentHeight, 0),
					height: 'auto'
				} : {
					minHeight: 0,
					height: Math.max(options.height - nonContentHeight, 0)
				}).show();
				if (this.uiDialog.is(':data(resizable)')) {
					this.uiDialog.resizable('option', 'minHeight', this._minHeight());
				}
			}
		});
		$.extend($.ui.dialog, {
			version: "1.8.2",
			uuid: 0,
			maxZ: 0,
			getTitleId: function($el) {
				var id = $el.attr('id');
				if (!id) {
					this.uuid += 1;
					id = this.uuid;
				}
				return 'ui-dialog-title-' + id;
			},
			overlay: function(dialog) {
				this.$el = $.ui.dialog.overlay.create(dialog);
			}
		});
		$.extend($.ui.dialog.overlay, {
			instances: [],
			oldInstances: [],
			maxZ: 0,
			events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','), function(event) {
				return event + '.dialog-overlay';
			}).join(' '),
			create: function(dialog) {
				if (this.instances.length === 0) {
					setTimeout(function() {
						if ($.ui.dialog.overlay.instances.length) {
							$(document).bind($.ui.dialog.overlay.events, function(event) {
								return ($(event.target).zIndex() >= $.ui.dialog.overlay.maxZ);
							});
						}
					}, 1);
					$(document).bind('keydown.dialog-overlay', function(event) {
						if (dialog.options.closeOnEscape && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
							dialog.close(event);
							event.preventDefault();
						}
					});
					$(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
				}
				var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-widget-overlay')).appendTo(document.body).css({
					width: this.width(),
					height: this.height()
				});
				if ($.fn.bgiframe) {
					$el.bgiframe();
				}
				this.instances.push($el);
				return $el;
			},
			destroy: function($el) {
				this.oldInstances.push(this.instances.splice($.inArray($el, this.instances), 1)[0]);
				if (this.instances.length === 0) {
					$([document, window]).unbind('.dialog-overlay');
				}
				$el.remove();
				var maxZ = 0;
				$.each(this.instances, function() {
					maxZ = Math.max(maxZ, this.css('z-index'));
				});
				this.maxZ = maxZ;
			},
			height: function() {
				var scrollHeight, offsetHeight;
				if ($.browser.msie && $.browser.version < 7) {
					scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
					offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
					if (scrollHeight < offsetHeight) {
						return $(window).height() + 'px';
					} else {
						return scrollHeight + 'px';
					}
				} else {
					return $(document).height() + 'px';
				}
			},
			width: function() {
				var scrollWidth, offsetWidth;
				if ($.browser.msie && $.browser.version < 7) {
					scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
					offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
					if (scrollWidth < offsetWidth) {
						return $(window).width() + 'px';
					} else {
						return scrollWidth + 'px';
					}
				} else {
					return $(document).width() + 'px';
				}
			},
			resize: function() {
				var $overlays = $([]);
				$.each($.ui.dialog.overlay.instances, function() {
					$overlays = $overlays.add(this);
				});
				$overlays.css({
					width: 0,
					height: 0
				}).css({
						width: $.ui.dialog.overlay.width(),
						height: $.ui.dialog.overlay.height()
					});
			}
		});
		$.extend($.ui.dialog.overlay.prototype, {
			destroy: function() {
				$.ui.dialog.overlay.destroy(this.$el);
			}
		});
	}(jQuery));;
}, {
	"all": ".ui-dialog{position:absolute;padding:.2em;width:300px;overflow:hidden}.ui-dialog .ui-dialog-titlebar{padding:.5em 1em .3em;position:relative}.ui-dialog .ui-dialog-title{float:left;margin:.1em 16px .2em 0}.ui-dialog .ui-dialog-titlebar-close{position:absolute;right:.3em;top:50%;width:19px;margin:-10px 0 0 0;padding:1px;height:18px}.ui-dialog .ui-dialog-titlebar-close span{display:block;margin:1px}.ui-dialog .ui-dialog-titlebar-close:hover,.ui-dialog .ui-dialog-titlebar-close:focus{padding:0}.ui-dialog .ui-dialog-content{border:0;padding:.5em 1em;background:none;overflow:auto;zoom:1}.ui-dialog .ui-dialog-buttonpane{text-align:left;border-width:1px 0 0 0;background-image:none;margin:.5em 0 0 0;padding:.3em 1em .5em .4em}.ui-dialog .ui-dialog-buttonpane button{float:right;margin:.5em .4em .5em 0;cursor:pointer;padding:.2em .6em .3em .6em;line-height:1.4em;width:auto;overflow:visible}.ui-dialog .ui-resizable-se{width:14px;height:14px;right:3px;bottom:3px}.ui-draggable .ui-dialog-titlebar{cursor:move}\n\n/* cache key: resourceloader:filter:minify-css:7:cb89a9da9e3a1d29e22c67b4c371f5c3 */\n"
}, {});
mw.loader.implement("jquery.ui.draggable", function($) {
	(function($) {
		$.widget("ui.draggable", $.ui.mouse, {
			widgetEventPrefix: "drag",
			options: {
				addClasses: true,
				appendTo: "parent",
				axis: false,
				connectToSortable: false,
				containment: false,
				cursor: "auto",
				cursorAt: false,
				grid: false,
				handle: false,
				helper: "original",
				iframeFix: false,
				opacity: false,
				refreshPositions: false,
				revert: false,
				revertDuration: 500,
				scope: "default",
				scroll: true,
				scrollSensitivity: 20,
				scrollSpeed: 20,
				snap: false,
				snapMode: "both",
				snapTolerance: 20,
				stack: false,
				zIndex: false
			},
			_create: function() {
				if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position"))) this.element[0].style.position = 'relative';
				(this.options.addClasses && this.element.addClass("ui-draggable"));
				(this.options.disabled && this.element.addClass("ui-draggable-disabled"));
				this._mouseInit();
			},
			destroy: function() {
				if (!this.element.data('draggable')) return;
				this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable" + " ui-draggable-dragging" + " ui-draggable-disabled");
				this._mouseDestroy();
				return this;
			},
			_mouseCapture: function(event) {
				var o = this.options;
				if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle')) return false;
				this.handle = this._getHandle(event);
				if (!this.handle) return false;
				return true;
			},
			_mouseStart: function(event) {
				var o = this.options;
				this.helper = this._createHelper(event);
				this._cacheHelperProportions();
				if ($.ui.ddmanager) $.ui.ddmanager.current = this;
				this._cacheMargins();
				this.cssPosition = this.helper.css("position");
				this.scrollParent = this.helper.scrollParent();
				this.offset = this.positionAbs = this.element.offset();
				this.offset = {
					top: this.offset.top - this.margins.top,
					left: this.offset.left - this.margins.left
				};
				$.extend(this.offset, {
					click: {
						left: event.pageX - this.offset.left,
						top: event.pageY - this.offset.top
					},
					parent: this._getParentOffset(),
					relative: this._getRelativeOffset()
				});
				this.originalPosition = this.position = this._generatePosition(event);
				this.originalPageX = event.pageX;
				this.originalPageY = event.pageY;
				(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));
				if (o.containment) this._setContainment();
				if (this._trigger("start", event) === false) {
					this._clear();
					return false;
				}
				this._cacheHelperProportions();
				if ($.ui.ddmanager && !o.dropBehaviour) $.ui.ddmanager.prepareOffsets(this, event);
				this.helper.addClass("ui-draggable-dragging");
				this._mouseDrag(event, true);
				return true;
			},
			_mouseDrag: function(event, noPropagation) {
				this.position = this._generatePosition(event);
				this.positionAbs = this._convertPositionTo("absolute");
				if (!noPropagation) {
					var ui = this._uiHash();
					if (this._trigger('drag', event, ui) === false) {
						this._mouseUp({});
						return false;
					}
					this.position = ui.position;
				}
				if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + 'px';
				if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + 'px';
				if ($.ui.ddmanager) $.ui.ddmanager.drag(this, event);
				return false;
			},
			_mouseStop: function(event) {
				var dropped = false;
				if ($.ui.ddmanager && !this.options.dropBehaviour) dropped = $.ui.ddmanager.drop(this, event);
				if (this.dropped) {
					dropped = this.dropped;
					this.dropped = false;
				}
				if (!this.element[0] || !this.element[0].parentNode) return false;
				if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
					var self = this;
					$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
						if (self._trigger("stop", event) !== false) {
							self._clear();
						}
					});
				} else {
					if (this._trigger("stop", event) !== false) {
						this._clear();
					}
				}
				return false;
			},
			cancel: function() {
				if (this.helper.is(".ui-draggable-dragging")) {
					this._mouseUp({});
				} else {
					this._clear();
				}
				return this;
			},
			_getHandle: function(event) {
				var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
				$(this.options.handle, this.element).find("*").andSelf().each(function() {
					if (this == event.target) handle = true;
				});
				return handle;
			},
			_createHelper: function(event) {
				var o = this.options;
				var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone() : this.element);
				if (!helper.parents('body').length) helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));
				if (helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) helper.css("position", "absolute");
				return helper;
			},
			_adjustOffsetFromHelper: function(obj) {
				if (typeof obj == 'string') {
					obj = obj.split(' ');
				}
				if ($.isArray(obj)) {
					obj = {
						left: +obj[0],
						top: +obj[1] || 0
					};
				}
				if ('left' in obj) {
					this.offset.click.left = obj.left + this.margins.left;
				}
				if ('right' in obj) {
					this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
				}
				if ('top' in obj) {
					this.offset.click.top = obj.top + this.margins.top;
				}
				if ('bottom' in obj) {
					this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
				}
			},
			_getParentOffset: function() {
				this.offsetParent = this.helper.offsetParent();
				var po = this.offsetParent.offset();
				if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
					po.left += this.scrollParent.scrollLeft();
					po.top += this.scrollParent.scrollTop();
				}
				if ((this.offsetParent[0] == document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) po = {
					top: 0,
					left: 0
				};
				return {
					top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
					left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
				};
			},
			_getRelativeOffset: function() {
				if (this.cssPosition == "relative") {
					var p = this.element.position();
					return {
						top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
						left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
					};
				} else {
					return {
						top: 0,
						left: 0
					};
				}
			},
			_cacheMargins: function() {
				this.margins = {
					left: (parseInt(this.element.css("marginLeft"), 10) || 0),
					top: (parseInt(this.element.css("marginTop"), 10) || 0)
				};
			},
			_cacheHelperProportions: function() {
				this.helperProportions = {
					width: this.helper.outerWidth(),
					height: this.helper.outerHeight()
				};
			},
			_setContainment: function() {
				var o = this.options;
				if (o.containment == 'parent') o.containment = this.helper[0].parentNode;
				if (o.containment == 'document' || o.containment == 'window') this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
				if (!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
					var ce = $(o.containment)[0];
					if (!ce) return;
					var co = $(o.containment).offset();
					var over = ($(ce).css("overflow") != 'hidden');
					this.containment = [co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
				} else if (o.containment.constructor == Array) {
					this.containment = o.containment;
				}
			},
			_convertPositionTo: function(d, pos) {
				if (!pos) pos = this.position;
				var mod = d == "absolute" ? 1 : -1;
				var o = this.options,
					scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
					scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
				return {
					top: (pos.top + this.offset.relative.top * mod + this.offset.parent.top * mod - ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)),
					left: (pos.left + this.offset.relative.left * mod + this.offset.parent.left * mod - ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod))
				};
			},
			_generatePosition: function(event) {
				var o = this.options,
					scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
					scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
				var pageX = event.pageX;
				var pageY = event.pageY;
				if (this.originalPosition) {
					if (this.containment) {
						if (event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
						if (event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
						if (event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
						if (event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
					}
					if (o.grid) {
						var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
						pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;
						var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
						pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
					}
				}
				return {
					top: (pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))),
					left: (pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())))
				};
			},
			_clear: function() {
				this.helper.removeClass("ui-draggable-dragging");
				if (this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
				this.helper = null;
				this.cancelHelperRemoval = false;
			},
			_trigger: function(type, event, ui) {
				ui = ui || this._uiHash();
				$.ui.plugin.call(this, type, [event, ui]);
				if (type == "drag") this.positionAbs = this._convertPositionTo("absolute");
				return $.Widget.prototype._trigger.call(this, type, event, ui);
			},
			plugins: {},
			_uiHash: function(event) {
				return {
					helper: this.helper,
					position: this.position,
					originalPosition: this.originalPosition,
					offset: this.positionAbs
				};
			}
		});
		$.extend($.ui.draggable, {
			version: "1.8.2"
		});
		$.ui.plugin.add("draggable", "connectToSortable", {
			start: function(event, ui) {
				var inst = $(this).data("draggable"),
					o = inst.options,
					uiSortable = $.extend({}, ui, {
						item: inst.element
					});
				inst.sortables = [];
				$(o.connectToSortable).each(function() {
					var sortable = $.data(this, 'sortable');
					if (sortable && !sortable.options.disabled) {
						inst.sortables.push({
							instance: sortable,
							shouldRevert: sortable.options.revert
						});
						sortable._refreshItems();
						sortable._trigger("activate", event, uiSortable);
					}
				});
			},
			stop: function(event, ui) {
				var inst = $(this).data("draggable"),
					uiSortable = $.extend({}, ui, {
						item: inst.element
					});
				$.each(inst.sortables, function() {
					if (this.instance.isOver) {
						this.instance.isOver = 0;
						inst.cancelHelperRemoval = true;
						this.instance.cancelHelperRemoval = false;
						if (this.shouldRevert) this.instance.options.revert = true;
						this.instance._mouseStop(event);
						this.instance.options.helper = this.instance.options._helper;
						if (inst.options.helper == 'original') this.instance.currentItem.css({
							top: 'auto',
							left: 'auto'
						});
					} else {
						this.instance.cancelHelperRemoval = false;
						this.instance._trigger("deactivate", event, uiSortable);
					}
				});
			},
			drag: function(event, ui) {
				var inst = $(this).data("draggable"),
					self = this;
				var checkPos = function(o) {
					var dyClick = this.offset.click.top,
						dxClick = this.offset.click.left;
					var helperTop = this.positionAbs.top,
						helperLeft = this.positionAbs.left;
					var itemHeight = o.height,
						itemWidth = o.width;
					var itemTop = o.top,
						itemLeft = o.left;
					return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
				};
				$.each(inst.sortables, function(i) {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if (this.instance._intersectsWith(this.instance.containerCache)) {
						if (!this.instance.isOver) {
							this.instance.isOver = 1;
							this.instance.currentItem = $(self).clone().appendTo(this.instance.element).data("sortable-item", true);
							this.instance.options._helper = this.instance.options.helper;
							this.instance.options.helper = function() {
								return ui.helper[0];
							};
							event.target = this.instance.currentItem[0];
							this.instance._mouseCapture(event, true);
							this.instance._mouseStart(event, true, true);
							this.instance.offset.click.top = inst.offset.click.top;
							this.instance.offset.click.left = inst.offset.click.left;
							this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
							this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;
							inst._trigger("toSortable", event);
							inst.dropped = this.instance.element;
							inst.currentItem = inst.element;
							this.instance.fromOutside = inst;
						}
						if (this.instance.currentItem) this.instance._mouseDrag(event);
					} else {
						if (this.instance.isOver) {
							this.instance.isOver = 0;
							this.instance.cancelHelperRemoval = true;
							this.instance.options.revert = false;
							this.instance._trigger('out', event, this.instance._uiHash(this.instance));
							this.instance._mouseStop(event, true);
							this.instance.options.helper = this.instance.options._helper;
							this.instance.currentItem.remove();
							if (this.instance.placeholder) this.instance.placeholder.remove();
							inst._trigger("fromSortable", event);
							inst.dropped = false;
						}
					};
				});
			}
		});
		$.ui.plugin.add("draggable", "cursor", {
			start: function(event, ui) {
				var t = $('body'),
					o = $(this).data('draggable').options;
				if (t.css("cursor")) o._cursor = t.css("cursor");
				t.css("cursor", o.cursor);
			},
			stop: function(event, ui) {
				var o = $(this).data('draggable').options;
				if (o._cursor) $('body').css("cursor", o._cursor);
			}
		});
		$.ui.plugin.add("draggable", "iframeFix", {
			start: function(event, ui) {
				var o = $(this).data('draggable').options;
				$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
					$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
						width: this.offsetWidth + "px",
						height: this.offsetHeight + "px",
						position: "absolute",
						opacity: "0.001",
						zIndex: 1000
					}).css($(this).offset()).appendTo("body");
				});
			},
			stop: function(event, ui) {
				$("div.ui-draggable-iframeFix").each(function() {
					this.parentNode.removeChild(this);
				});
			}
		});
		$.ui.plugin.add("draggable", "opacity", {
			start: function(event, ui) {
				var t = $(ui.helper),
					o = $(this).data('draggable').options;
				if (t.css("opacity")) o._opacity = t.css("opacity");
				t.css('opacity', o.opacity);
			},
			stop: function(event, ui) {
				var o = $(this).data('draggable').options;
				if (o._opacity) $(ui.helper).css('opacity', o._opacity);
			}
		});
		$.ui.plugin.add("draggable", "scroll", {
			start: function(event, ui) {
				var i = $(this).data("draggable");
				if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
			},
			drag: function(event, ui) {
				var i = $(this).data("draggable"),
					o = i.options,
					scrolled = false;
				if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {
					if (!o.axis || o.axis != 'x') {
						if ((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
						else if (event.pageY - i.overflowOffset.top < o.scrollSensitivity) i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
					}
					if (!o.axis || o.axis != 'y') {
						if ((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
						else if (event.pageX - i.overflowOffset.left < o.scrollSensitivity) i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
					}
				} else {
					if (!o.axis || o.axis != 'x') {
						if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
						else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
					}
					if (!o.axis || o.axis != 'y') {
						if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
						else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
					}
				}
				if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) $.ui.ddmanager.prepareOffsets(i, event);
			}
		});
		$.ui.plugin.add("draggable", "snap", {
			start: function(event, ui) {
				var i = $(this).data("draggable"),
					o = i.options;
				i.snapElements = [];
				$(o.snap.constructor != String ? (o.snap.items || ':data(draggable)') : o.snap).each(function() {
					var $t = $(this);
					var $o = $t.offset();
					if (this != i.element[0]) i.snapElements.push({
						item: this,
						width: $t.outerWidth(),
						height: $t.outerHeight(),
						top: $o.top,
						left: $o.left
					});
				});
			},
			drag: function(event, ui) {
				var inst = $(this).data("draggable"),
					o = inst.options;
				var d = o.snapTolerance;
				var x1 = ui.offset.left,
					x2 = x1 + inst.helperProportions.width,
					y1 = ui.offset.top,
					y2 = y1 + inst.helperProportions.height;
				for (var i = inst.snapElements.length - 1; i >= 0; i--) {
					var l = inst.snapElements[i].left,
						r = l + inst.snapElements[i].width,
						t = inst.snapElements[i].top,
						b = t + inst.snapElements[i].height;
					if (!((l - d < x1 && x1 < r + d && t - d < y1 && y1 < b + d) || (l - d < x1 && x1 < r + d && t - d < y2 && y2 < b + d) || (l - d < x2 && x2 < r + d && t - d < y1 && y1 < b + d) || (l - d < x2 && x2 < r + d && t - d < y2 && y2 < b + d))) {
						if (inst.snapElements[i].snapping)(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), {
							snapItem: inst.snapElements[i].item
						})));
						inst.snapElements[i].snapping = false;
						continue;
					}
					if (o.snapMode != 'inner') {
						var ts = Math.abs(t - y2) <= d;
						var bs = Math.abs(b - y1) <= d;
						var ls = Math.abs(l - x2) <= d;
						var rs = Math.abs(r - x1) <= d;
						if (ts) ui.position.top = inst._convertPositionTo("relative", {
							top: t - inst.helperProportions.height,
							left: 0
						}).top - inst.margins.top;
						if (bs) ui.position.top = inst._convertPositionTo("relative", {
							top: b,
							left: 0
						}).top - inst.margins.top;
						if (ls) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: l - inst.helperProportions.width
						}).left - inst.margins.left;
						if (rs) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: r
						}).left - inst.margins.left;
					}
					var first = (ts || bs || ls || rs);
					if (o.snapMode != 'outer') {
						var ts = Math.abs(t - y1) <= d;
						var bs = Math.abs(b - y2) <= d;
						var ls = Math.abs(l - x1) <= d;
						var rs = Math.abs(r - x2) <= d;
						if (ts) ui.position.top = inst._convertPositionTo("relative", {
							top: t,
							left: 0
						}).top - inst.margins.top;
						if (bs) ui.position.top = inst._convertPositionTo("relative", {
							top: b - inst.helperProportions.height,
							left: 0
						}).top - inst.margins.top;
						if (ls) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: l
						}).left - inst.margins.left;
						if (rs) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: r - inst.helperProportions.width
						}).left - inst.margins.left;
					}
					if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
						snapItem: inst.snapElements[i].item
					})));
					inst.snapElements[i].snapping = (ts || bs || ls || rs || first);
				};
			}
		});
		$.ui.plugin.add("draggable", "stack", {
			start: function(event, ui) {
				var o = $(this).data("draggable").options;
				var group = $.makeArray($(o.stack)).sort(function(a, b) {
					return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
				});
				if (!group.length) {
					return;
				}
				var min = parseInt(group[0].style.zIndex) || 0;
				$(group).each(function(i) {
					this.style.zIndex = min + i;
				});
				this[0].style.zIndex = min + group.length;
			}
		});
		$.ui.plugin.add("draggable", "zIndex", {
			start: function(event, ui) {
				var t = $(ui.helper),
					o = $(this).data("draggable").options;
				if (t.css("zIndex")) o._zIndex = t.css("zIndex");
				t.css('zIndex', o.zIndex);
			},
			stop: function(event, ui) {
				var o = $(this).data("draggable").options;
				if (o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
			}
		});
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.ui.mouse", function($) {
	(function($) {
		$.widget("ui.mouse", {
			options: {
				cancel: ':input,option',
				distance: 1,
				delay: 0
			},
			_mouseInit: function() {
				var self = this;
				this.element.bind('mousedown.' + this.widgetName, function(event) {
					return self._mouseDown(event);
				}).bind('click.' + this.widgetName, function(event) {
						if (self._preventClickEvent) {
							self._preventClickEvent = false;
							event.stopImmediatePropagation();
							return false;
						}
					});
				this.started = false;
			},
			_mouseDestroy: function() {
				this.element.unbind('.' + this.widgetName);
			},
			_mouseDown: function(event) {
				event.originalEvent = event.originalEvent || {};
				if (event.originalEvent.mouseHandled) {
					return;
				}(this._mouseStarted && this._mouseUp(event));
				this._mouseDownEvent = event;
				var self = this,
					btnIsLeft = (event.which == 1),
					elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
				if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
					return true;
				}
				this.mouseDelayMet = !this.options.delay;
				if (!this.mouseDelayMet) {
					this._mouseDelayTimer = setTimeout(function() {
						self.mouseDelayMet = true;
					}, this.options.delay);
				}
				if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
					this._mouseStarted = (this._mouseStart(event) !== false);
					if (!this._mouseStarted) {
						event.preventDefault();
						return true;
					}
				}
				this._mouseMoveDelegate = function(event) {
					return self._mouseMove(event);
				};
				this._mouseUpDelegate = function(event) {
					return self._mouseUp(event);
				};
				$(document).bind('mousemove.' + this.widgetName, this._mouseMoveDelegate).bind('mouseup.' + this.widgetName, this._mouseUpDelegate);
				($.browser.safari || event.preventDefault());
				event.originalEvent.mouseHandled = true;
				return true;
			},
			_mouseMove: function(event) {
				if ($.browser.msie && !event.button) {
					return this._mouseUp(event);
				}
				if (this._mouseStarted) {
					this._mouseDrag(event);
					return event.preventDefault();
				}
				if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
					this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false);
					(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
				}
				return !this._mouseStarted;
			},
			_mouseUp: function(event) {
				$(document).unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate).unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);
				if (this._mouseStarted) {
					this._mouseStarted = false;
					this._preventClickEvent = (event.target == this._mouseDownEvent.target);
					this._mouseStop(event);
				}
				return false;
			},
			_mouseDistanceMet: function(event) {
				return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
			},
			_mouseDelayMet: function(event) {
				return this.mouseDelayMet;
			},
			_mouseStart: function(event) {},
			_mouseDrag: function(event) {},
			_mouseStop: function(event) {},
			_mouseCapture: function(event) {
				return true;
			}
		});
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.ui.position", function($) {
	(function($) {
		$.ui = $.ui || {};
		var horizontalPositions = /left|center|right/,
			horizontalDefault = "center",
			verticalPositions = /top|center|bottom/,
			verticalDefault = "center",
			_position = $.fn.position,
			_offset = $.fn.offset;
		$.fn.position = function(options) {
			if (!options || !options.of) {
				return _position.apply(this, arguments);
			}
			options = $.extend({}, options);
			var target = $(options.of),
				collision = (options.collision || "flip").split(" "),
				offset = options.offset ? options.offset.split(" ") : [0, 0],
				targetWidth, targetHeight, basePosition;
			if (options.of.nodeType === 9) {
				targetWidth = target.width();
				targetHeight = target.height();
				basePosition = {
					top: 0,
					left: 0
				};
			} else if (options.of.scrollTo && options.of.document) {
				targetWidth = target.width();
				targetHeight = target.height();
				basePosition = {
					top: target.scrollTop(),
					left: target.scrollLeft()
				};
			} else if (options.of.preventDefault) {
				options.at = "left top";
				targetWidth = targetHeight = 0;
				basePosition = {
					top: options.of.pageY,
					left: options.of.pageX
				};
			} else {
				targetWidth = target.outerWidth();
				targetHeight = target.outerHeight();
				basePosition = target.offset();
			}
			$.each(["my", "at"], function() {
				var pos = (options[this] || "").split(" ");
				if (pos.length === 1) {
					pos = horizontalPositions.test(pos[0]) ? pos.concat([verticalDefault]) : verticalPositions.test(pos[0]) ? [horizontalDefault].concat(pos) : [horizontalDefault, verticalDefault];
				}
				pos[0] = horizontalPositions.test(pos[0]) ? pos[0] : horizontalDefault;
				pos[1] = verticalPositions.test(pos[1]) ? pos[1] : verticalDefault;
				options[this] = pos;
			});
			if (collision.length === 1) {
				collision[1] = collision[0];
			}
			offset[0] = parseInt(offset[0], 10) || 0;
			if (offset.length === 1) {
				offset[1] = offset[0];
			}
			offset[1] = parseInt(offset[1], 10) || 0;
			if (options.at[0] === "right") {
				basePosition.left += targetWidth;
			} else if (options.at[0] === horizontalDefault) {
				basePosition.left += targetWidth / 2;
			}
			if (options.at[1] === "bottom") {
				basePosition.top += targetHeight;
			} else if (options.at[1] === verticalDefault) {
				basePosition.top += targetHeight / 2;
			}
			basePosition.left += offset[0];
			basePosition.top += offset[1];
			return this.each(function() {
				var elem = $(this),
					elemWidth = elem.outerWidth(),
					elemHeight = elem.outerHeight(),
					position = $.extend({}, basePosition);
				if (options.my[0] === "right") {
					position.left -= elemWidth;
				} else if (options.my[0] === horizontalDefault) {
					position.left -= elemWidth / 2;
				}
				if (options.my[1] === "bottom") {
					position.top -= elemHeight;
				} else if (options.my[1] === verticalDefault) {
					position.top -= elemHeight / 2;
				}
				position.left = parseInt(position.left);
				position.top = parseInt(position.top);
				$.each(["left", "top"], function(i, dir) {
					if ($.ui.position[collision[i]]) {
						$.ui.position[collision[i]][dir](position, {
							targetWidth: targetWidth,
							targetHeight: targetHeight,
							elemWidth: elemWidth,
							elemHeight: elemHeight,
							offset: offset,
							my: options.my,
							at: options.at
						});
					}
				});
				if ($.fn.bgiframe) {
					elem.bgiframe();
				}
				elem.offset($.extend(position, {
					using: options.using
				}));
			});
		};
		$.ui.position = {
			fit: {
				left: function(position, data) {
					var win = $(window),
						over = position.left + data.elemWidth - win.width() - win.scrollLeft();
					position.left = over > 0 ? position.left - over : Math.max(0, position.left);
				},
				top: function(position, data) {
					var win = $(window),
						over = position.top + data.elemHeight - win.height() - win.scrollTop();
					position.top = over > 0 ? position.top - over : Math.max(0, position.top);
				}
			},
			flip: {
				left: function(position, data) {
					if (data.at[0] === "center") {
						return;
					}
					var win = $(window),
						over = position.left + data.elemWidth - win.width() - win.scrollLeft(),
						myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
						offset = -2 * data.offset[0];
					position.left += position.left < 0 ? myOffset + data.targetWidth + offset : over > 0 ? myOffset - data.targetWidth + offset : 0;
				},
				top: function(position, data) {
					if (data.at[1] === "center") {
						return;
					}
					var win = $(window),
						over = position.top + data.elemHeight - win.height() - win.scrollTop(),
						myOffset = data.my[1] === "top" ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
						atOffset = data.at[1] === "top" ? data.targetHeight : -data.targetHeight,
						offset = -2 * data.offset[1];
					position.top += position.top < 0 ? myOffset + data.targetHeight + offset : over > 0 ? myOffset + atOffset + offset : 0;
				}
			}
		};
		if (!$.offset.setOffset) {
			$.offset.setOffset = function(elem, options) {
				if (/static/.test($.curCSS(elem, "position"))) {
					elem.style.position = "relative";
				}
				var curElem = $(elem),
					curOffset = curElem.offset(),
					curTop = parseInt($.curCSS(elem, "top", true), 10) || 0,
					curLeft = parseInt($.curCSS(elem, "left", true), 10) || 0,
					props = {
						top: (options.top - curOffset.top) + curTop,
						left: (options.left - curOffset.left) + curLeft
					};
				if ('using' in options) {
					options.using.call(elem, props);
				} else {
					curElem.css(props);
				}
			};
			$.fn.offset = function(options) {
				var elem = this[0];
				if (!elem || !elem.ownerDocument) {
					return null;
				}
				if (options) {
					return this.each(function() {
						$.offset.setOffset(this, options);
					});
				}
				return _offset.call(this);
			};
		}
	}(jQuery));;
}, {}, {});
mw.loader.implement("jquery.ui.resizable", function($) {
	(function($) {
		$.widget("ui.resizable", $.ui.mouse, {
			widgetEventPrefix: "resize",
			options: {
				alsoResize: false,
				animate: false,
				animateDuration: "slow",
				animateEasing: "swing",
				aspectRatio: false,
				autoHide: false,
				containment: false,
				ghost: false,
				grid: false,
				handles: "e,s,se",
				helper: false,
				maxHeight: null,
				maxWidth: null,
				minHeight: 10,
				minWidth: 10,
				zIndex: 1000
			},
			_create: function() {
				var self = this,
					o = this.options;
				this.element.addClass("ui-resizable");
				$.extend(this, {
					_aspectRatio: !! (o.aspectRatio),
					aspectRatio: o.aspectRatio,
					originalElement: this.element,
					_proportionallyResizeElements: [],
					_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
				});
				if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
					if (/relative/.test(this.element.css('position')) && $.browser.opera) this.element.css({
						position: 'relative',
						top: 'auto',
						left: 'auto'
					});
					this.element.wrap($('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
						position: this.element.css('position'),
						width: this.element.outerWidth(),
						height: this.element.outerHeight(),
						top: this.element.css('top'),
						left: this.element.css('left')
					}));
					this.element = this.element.parent().data("resizable", this.element.data('resizable'));
					this.elementIsWrapper = true;
					this.element.css({
						marginLeft: this.originalElement.css("marginLeft"),
						marginTop: this.originalElement.css("marginTop"),
						marginRight: this.originalElement.css("marginRight"),
						marginBottom: this.originalElement.css("marginBottom")
					});
					this.originalElement.css({
						marginLeft: 0,
						marginTop: 0,
						marginRight: 0,
						marginBottom: 0
					});
					this.originalResizeStyle = this.originalElement.css('resize');
					this.originalElement.css('resize', 'none');
					this._proportionallyResizeElements.push(this.originalElement.css({
						position: 'static',
						zoom: 1,
						display: 'block'
					}));
					this.originalElement.css({
						margin: this.originalElement.css('margin')
					});
					this._proportionallyResize();
				}
				this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : {
					n: '.ui-resizable-n',
					e: '.ui-resizable-e',
					s: '.ui-resizable-s',
					w: '.ui-resizable-w',
					se: '.ui-resizable-se',
					sw: '.ui-resizable-sw',
					ne: '.ui-resizable-ne',
					nw: '.ui-resizable-nw'
				});
				if (this.handles.constructor == String) {
					if (this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
					var n = this.handles.split(",");
					this.handles = {};
					for (var i = 0; i < n.length; i++) {
						var handle = $.trim(n[i]),
							hname = 'ui-resizable-' + handle;
						var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');
						if (/sw|se|ne|nw/.test(handle)) axis.css({
							zIndex: ++o.zIndex
						});
						if ('se' == handle) {
							axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
						};
						this.handles[handle] = '.ui-resizable-' + handle;
						this.element.append(axis);
					}
				}
				this._renderAxis = function(target) {
					target = target || this.element;
					for (var i in this.handles) {
						if (this.handles[i].constructor == String) this.handles[i] = $(this.handles[i], this.element).show();
						if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
							var axis = $(this.handles[i], this.element),
								padWrapper = 0;
							padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();
							var padPos = ['padding', /ne|nw|n/.test(i) ? 'Top' : /se|sw|s/.test(i) ? 'Bottom' : /^e$/.test(i) ? 'Right' : 'Left'].join("");
							target.css(padPos, padWrapper);
							this._proportionallyResize();
						}
						if (!$(this.handles[i]).length) continue;
					}
				};
				this._renderAxis(this.element);
				this._handles = $('.ui-resizable-handle', this.element).disableSelection();
				this._handles.mouseover(function() {
					if (!self.resizing) {
						if (this.className) var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
						self.axis = axis && axis[1] ? axis[1] : 'se';
					}
				});
				if (o.autoHide) {
					this._handles.hide();
					$(this.element).addClass("ui-resizable-autohide").hover(function() {
						$(this).removeClass("ui-resizable-autohide");
						self._handles.show();
					}, function() {
						if (!self.resizing) {
							$(this).addClass("ui-resizable-autohide");
							self._handles.hide();
						}
					});
				}
				this._mouseInit();
			},
			destroy: function() {
				this._mouseDestroy();
				var _destroy = function(exp) {
					$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
				};
				if (this.elementIsWrapper) {
					_destroy(this.element);
					var wrapper = this.element;
					wrapper.after(this.originalElement.css({
						position: wrapper.css('position'),
						width: wrapper.outerWidth(),
						height: wrapper.outerHeight(),
						top: wrapper.css('top'),
						left: wrapper.css('left')
					})).remove();
				}
				this.originalElement.css('resize', this.originalResizeStyle);
				_destroy(this.originalElement);
				return this;
			},
			_mouseCapture: function(event) {
				var handle = false;
				for (var i in this.handles) {
					if ($(this.handles[i])[0] == event.target) {
						handle = true;
					}
				}
				return !this.options.disabled && handle;
			},
			_mouseStart: function(event) {
				var o = this.options,
					iniPos = this.element.position(),
					el = this.element;
				this.resizing = true;
				this.documentScroll = {
					top: $(document).scrollTop(),
					left: $(document).scrollLeft()
				};
				if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
					el.css({
						position: 'absolute',
						top: iniPos.top,
						left: iniPos.left
					});
				}
				if ($.browser.opera && (/relative/).test(el.css('position'))) el.css({
					position: 'relative',
					top: 'auto',
					left: 'auto'
				});
				this._renderProxy();
				var curleft = num(this.helper.css('left')),
					curtop = num(this.helper.css('top'));
				if (o.containment) {
					curleft += $(o.containment).scrollLeft() || 0;
					curtop += $(o.containment).scrollTop() || 0;
				}
				this.offset = this.helper.offset();
				this.position = {
					left: curleft,
					top: curtop
				};
				this.size = this._helper ? {
					width: el.outerWidth(),
					height: el.outerHeight()
				} : {
					width: el.width(),
					height: el.height()
				};
				this.originalSize = this._helper ? {
					width: el.outerWidth(),
					height: el.outerHeight()
				} : {
					width: el.width(),
					height: el.height()
				};
				this.originalPosition = {
					left: curleft,
					top: curtop
				};
				this.sizeDiff = {
					width: el.outerWidth() - el.width(),
					height: el.outerHeight() - el.height()
				};
				this.originalMousePosition = {
					left: event.pageX,
					top: event.pageY
				};
				this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);
				var cursor = $('.ui-resizable-' + this.axis).css('cursor');
				$('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);
				el.addClass("ui-resizable-resizing");
				this._propagate("start", event);
				return true;
			},
			_mouseDrag: function(event) {
				var el = this.helper,
					o = this.options,
					props = {}, self = this,
					smp = this.originalMousePosition,
					a = this.axis;
				var dx = (event.pageX - smp.left) || 0,
					dy = (event.pageY - smp.top) || 0;
				var trigger = this._change[a];
				if (!trigger) return false;
				var data = trigger.apply(this, [event, dx, dy]),
					ie6 = $.browser.msie && $.browser.version < 7,
					csdif = this.sizeDiff;
				if (this._aspectRatio || event.shiftKey) data = this._updateRatio(data, event);
				data = this._respectSize(data, event);
				this._propagate("resize", event);
				el.css({
					top: this.position.top + "px",
					left: this.position.left + "px",
					width: this.size.width + "px",
					height: this.size.height + "px"
				});
				if (!this._helper && this._proportionallyResizeElements.length) this._proportionallyResize();
				this._updateCache(data);
				this._trigger('resize', event, this.ui());
				return false;
			},
			_mouseStop: function(event) {
				this.resizing = false;
				var o = this.options,
					self = this;
				if (this._helper) {
					var pr = this._proportionallyResizeElements,
						ista = pr.length && (/textarea/i).test(pr[0].nodeName),
						soffseth = ista && $.ui.hasScroll(pr[0], 'left') ? 0 : self.sizeDiff.height,
						soffsetw = ista ? 0 : self.sizeDiff.width;
					var s = {
							width: (self.size.width - soffsetw),
							height: (self.size.height - soffseth)
						}, left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
						top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;
					if (!o.animate) this.element.css($.extend(s, {
						top: top,
						left: left
					}));
					self.helper.height(self.size.height);
					self.helper.width(self.size.width);
					if (this._helper && !o.animate) this._proportionallyResize();
				}
				$('body').css('cursor', 'auto');
				this.element.removeClass("ui-resizable-resizing");
				this._propagate("stop", event);
				if (this._helper) this.helper.remove();
				return false;
			},
			_updateCache: function(data) {
				var o = this.options;
				this.offset = this.helper.offset();
				if (isNumber(data.left)) this.position.left = data.left;
				if (isNumber(data.top)) this.position.top = data.top;
				if (isNumber(data.height)) this.size.height = data.height;
				if (isNumber(data.width)) this.size.width = data.width;
			},
			_updateRatio: function(data, event) {
				var o = this.options,
					cpos = this.position,
					csize = this.size,
					a = this.axis;
				if (data.height) data.width = (csize.height * this.aspectRatio);
				else if (data.width) data.height = (csize.width / this.aspectRatio);
				if (a == 'sw') {
					data.left = cpos.left + (csize.width - data.width);
					data.top = null;
				}
				if (a == 'nw') {
					data.top = cpos.top + (csize.height - data.height);
					data.left = cpos.left + (csize.width - data.width);
				}
				return data;
			},
			_respectSize: function(data, event) {
				var el = this.helper,
					o = this.options,
					pRatio = this._aspectRatio || event.shiftKey,
					a = this.axis,
					ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width),
					ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width),
					isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);
				if (isminw) data.width = o.minWidth;
				if (isminh) data.height = o.minHeight;
				if (ismaxw) data.width = o.maxWidth;
				if (ismaxh) data.height = o.maxHeight;
				var dw = this.originalPosition.left + this.originalSize.width,
					dh = this.position.top + this.size.height;
				var cw = /sw|nw|w/.test(a),
					ch = /nw|ne|n/.test(a);
				if (isminw && cw) data.left = dw - o.minWidth;
				if (ismaxw && cw) data.left = dw - o.maxWidth;
				if (isminh && ch) data.top = dh - o.minHeight;
				if (ismaxh && ch) data.top = dh - o.maxHeight;
				var isNotwh = !data.width && !data.height;
				if (isNotwh && !data.left && data.top) data.top = null;
				else if (isNotwh && !data.top && data.left) data.left = null;
				return data;
			},
			_proportionallyResize: function() {
				var o = this.options;
				if (!this._proportionallyResizeElements.length) return;
				var element = this.helper || this.element;
				for (var i = 0; i < this._proportionallyResizeElements.length; i++) {
					var prel = this._proportionallyResizeElements[i];
					if (!this.borderDif) {
						var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
							p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];
						this.borderDif = $.map(b, function(v, i) {
							var border = parseInt(v, 10) || 0,
								padding = parseInt(p[i], 10) || 0;
							return border + padding;
						});
					}
					if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length))) continue;
					prel.css({
						height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
						width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
					});
				};
			},
			_renderProxy: function() {
				var el = this.element,
					o = this.options;
				this.elementOffset = el.offset();
				if (this._helper) {
					this.helper = this.helper || $('<div style="overflow:hidden;"></div>');
					var ie6 = $.browser.msie && $.browser.version < 7,
						ie6offset = (ie6 ? 1 : 0),
						pxyoffset = (ie6 ? 2 : -1);
					this.helper.addClass(this._helper).css({
						width: this.element.outerWidth() + pxyoffset,
						height: this.element.outerHeight() + pxyoffset,
						position: 'absolute',
						left: this.elementOffset.left - ie6offset + 'px',
						top: this.elementOffset.top - ie6offset + 'px',
						zIndex: ++o.zIndex
					});
					this.helper.appendTo("body").disableSelection();
				} else {
					this.helper = this.element;
				}
			},
			_change: {
				e: function(event, dx, dy) {
					return {
						width: this.originalSize.width + dx
					};
				},
				w: function(event, dx, dy) {
					var o = this.options,
						cs = this.originalSize,
						sp = this.originalPosition;
					return {
						left: sp.left + dx,
						width: cs.width - dx
					};
				},
				n: function(event, dx, dy) {
					var o = this.options,
						cs = this.originalSize,
						sp = this.originalPosition;
					return {
						top: sp.top + dy,
						height: cs.height - dy
					};
				},
				s: function(event, dx, dy) {
					return {
						height: this.originalSize.height + dy
					};
				},
				se: function(event, dx, dy) {
					return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
				},
				sw: function(event, dx, dy) {
					return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
				},
				ne: function(event, dx, dy) {
					return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
				},
				nw: function(event, dx, dy) {
					return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
				}
			},
			_propagate: function(n, event) {
				$.ui.plugin.call(this, n, [event, this.ui()]);
				(n != "resize" && this._trigger(n, event, this.ui()));
			},
			plugins: {},
			ui: function() {
				return {
					originalElement: this.originalElement,
					element: this.element,
					helper: this.helper,
					position: this.position,
					size: this.size,
					originalSize: this.originalSize,
					originalPosition: this.originalPosition
				};
			}
		});
		$.extend($.ui.resizable, {
			version: "1.8.2"
		});
		$.ui.plugin.add("resizable", "alsoResize", {
			start: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options;
				var _store = function(exp) {
					$(exp).each(function() {
						$(this).data("resizable-alsoresize", {
							width: parseInt($(this).width(), 10),
							height: parseInt($(this).height(), 10),
							left: parseInt($(this).css('left'), 10),
							top: parseInt($(this).css('top'), 10)
						});
					});
				};
				if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
					if (o.alsoResize.length) {
						o.alsoResize = o.alsoResize[0];
						_store(o.alsoResize);
					} else {
						$.each(o.alsoResize, function(exp, c) {
							_store(exp);
						});
					}
				} else {
					_store(o.alsoResize);
				}
			},
			resize: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options,
					os = self.originalSize,
					op = self.originalPosition;
				var delta = {
					height: (self.size.height - os.height) || 0,
					width: (self.size.width - os.width) || 0,
					top: (self.position.top - op.top) || 0,
					left: (self.position.left - op.left) || 0
				}, _alsoResize = function(exp, c) {
					$(exp).each(function() {
						var el = $(this),
							start = $(this).data("resizable-alsoresize"),
							style = {}, css = c && c.length ? c : ['width', 'height', 'top', 'left'];
						$.each(css || ['width', 'height', 'top', 'left'], function(i, prop) {
							var sum = (start[prop] || 0) + (delta[prop] || 0);
							if (sum && sum >= 0) style[prop] = sum || null;
						});
						if (/relative/.test(el.css('position')) && $.browser.opera) {
							self._revertToRelativePosition = true;
							el.css({
								position: 'absolute',
								top: 'auto',
								left: 'auto'
							});
						}
						el.css(style);
					});
				};
				if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
					$.each(o.alsoResize, function(exp, c) {
						_alsoResize(exp, c);
					});
				} else {
					_alsoResize(o.alsoResize);
				}
			},
			stop: function(event, ui) {
				var self = $(this).data("resizable");
				if (self._revertToRelativePosition && $.browser.opera) {
					self._revertToRelativePosition = false;
					el.css({
						position: 'relative'
					});
				}
				$(this).removeData("resizable-alsoresize-start");
			}
		});
		$.ui.plugin.add("resizable", "animate", {
			stop: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options;
				var pr = self._proportionallyResizeElements,
					ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') ? 0 : self.sizeDiff.height,
					soffsetw = ista ? 0 : self.sizeDiff.width;
				var style = {
						width: (self.size.width - soffsetw),
						height: (self.size.height - soffseth)
					}, left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
					top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;
				self.element.animate($.extend(style, top && left ? {
					top: top,
					left: left
				} : {}), {
					duration: o.animateDuration,
					easing: o.animateEasing,
					step: function() {
						var data = {
							width: parseInt(self.element.css('width'), 10),
							height: parseInt(self.element.css('height'), 10),
							top: parseInt(self.element.css('top'), 10),
							left: parseInt(self.element.css('left'), 10)
						};
						if (pr && pr.length) $(pr[0]).css({
							width: data.width,
							height: data.height
						});
						self._updateCache(data);
						self._propagate("resize", event);
					}
				});
			}
		});
		$.ui.plugin.add("resizable", "containment", {
			start: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options,
					el = self.element;
				var oc = o.containment,
					ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
				if (!ce) return;
				self.containerElement = $(ce);
				if (/document/.test(oc) || oc == document) {
					self.containerOffset = {
						left: 0,
						top: 0
					};
					self.containerPosition = {
						left: 0,
						top: 0
					};
					self.parentData = {
						element: $(document),
						left: 0,
						top: 0,
						width: $(document).width(),
						height: $(document).height() || document.body.parentNode.scrollHeight
					};
				} else {
					var element = $(ce),
						p = [];
					$(["Top", "Right", "Left", "Bottom"]).each(function(i, name) {
						p[i] = num(element.css("padding" + name));
					});
					self.containerOffset = element.offset();
					self.containerPosition = element.position();
					self.containerSize = {
						height: (element.innerHeight() - p[3]),
						width: (element.innerWidth() - p[1])
					};
					var co = self.containerOffset,
						ch = self.containerSize.height,
						cw = self.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw),
						height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);
					self.parentData = {
						element: ce,
						left: co.left,
						top: co.top,
						width: width,
						height: height
					};
				}
			},
			resize: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options,
					ps = self.containerSize,
					co = self.containerOffset,
					cs = self.size,
					cp = self.position,
					pRatio = self._aspectRatio || event.shiftKey,
					cop = {
						top: 0,
						left: 0
					}, ce = self.containerElement;
				if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;
				if (cp.left < (self._helper ? co.left : 0)) {
					self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
					if (pRatio) self.size.height = self.size.width / o.aspectRatio;
					self.position.left = o.helper ? co.left : 0;
				}
				if (cp.top < (self._helper ? co.top : 0)) {
					self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
					if (pRatio) self.size.width = self.size.height * o.aspectRatio;
					self.position.top = self._helper ? co.top : 0;
				}
				self.offset.left = self.parentData.left + self.position.left;
				self.offset.top = self.parentData.top + self.position.top;
				var woset = Math.abs((self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width),
					hoset = Math.abs((self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height);
				var isParent = self.containerElement.get(0) == self.element.parent().get(0),
					isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));
				if (isParent && isOffsetRelative) woset -= self.parentData.left;
				if (woset + self.size.width >= self.parentData.width) {
					self.size.width = self.parentData.width - woset;
					if (pRatio) self.size.height = self.size.width / self.aspectRatio;
				}
				if (hoset + self.size.height >= self.parentData.height) {
					self.size.height = self.parentData.height - hoset;
					if (pRatio) self.size.width = self.size.height * self.aspectRatio;
				}
			},
			stop: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options,
					cp = self.position,
					co = self.containerOffset,
					cop = self.containerPosition,
					ce = self.containerElement;
				var helper = $(self.helper),
					ho = helper.offset(),
					w = helper.outerWidth() - self.sizeDiff.width,
					h = helper.outerHeight() - self.sizeDiff.height;
				if (self._helper && !o.animate && (/relative/).test(ce.css('position'))) $(this).css({
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				});
				if (self._helper && !o.animate && (/static/).test(ce.css('position'))) $(this).css({
					left: ho.left - cop.left - co.left,
					width: w,
					height: h
				});
			}
		});
		$.ui.plugin.add("resizable", "ghost", {
			start: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options,
					cs = self.size;
				self.ghost = self.originalElement.clone();
				self.ghost.css({
					opacity: .25,
					display: 'block',
					position: 'relative',
					height: cs.height,
					width: cs.width,
					margin: 0,
					left: 0,
					top: 0
				}).addClass('ui-resizable-ghost').addClass(typeof o.ghost == 'string' ? o.ghost : '');
				self.ghost.appendTo(self.helper);
			},
			resize: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options;
				if (self.ghost) self.ghost.css({
					position: 'relative',
					height: self.size.height,
					width: self.size.width
				});
			},
			stop: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options;
				if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
			}
		});
		$.ui.plugin.add("resizable", "grid", {
			resize: function(event, ui) {
				var self = $(this).data("resizable"),
					o = self.options,
					cs = self.size,
					os = self.originalSize,
					op = self.originalPosition,
					a = self.axis,
					ratio = o._aspectRatio || event.shiftKey;
				o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
				var ox = Math.round((cs.width - os.width) / (o.grid[0] || 1)) * (o.grid[0] || 1),
					oy = Math.round((cs.height - os.height) / (o.grid[1] || 1)) * (o.grid[1] || 1);
				if (/^(se|s|e)$/.test(a)) {
					self.size.width = os.width + ox;
					self.size.height = os.height + oy;
				} else if (/^(ne)$/.test(a)) {
					self.size.width = os.width + ox;
					self.size.height = os.height + oy;
					self.position.top = op.top - oy;
				} else if (/^(sw)$/.test(a)) {
					self.size.width = os.width + ox;
					self.size.height = os.height + oy;
					self.position.left = op.left - ox;
				} else {
					self.size.width = os.width + ox;
					self.size.height = os.height + oy;
					self.position.top = op.top - oy;
					self.position.left = op.left - ox;
				}
			}
		});
		var num = function(v) {
			return parseInt(v, 10) || 0;
		};
		var isNumber = function(value) {
			return !isNaN(parseInt(value, 10));
		};
	})(jQuery);;
}, {
	"all": ".ui-resizable{position:relative}.ui-resizable-handle{position:absolute;font-size:0.1px;z-index:99999;display:block}.ui-resizable-disabled .ui-resizable-handle,.ui-resizable-autohide .ui-resizable-handle{display:none}.ui-resizable-n{cursor:n-resize;height:7px;width:100%;top:-5px;left:0}.ui-resizable-s{cursor:s-resize;height:7px;width:100%;bottom:-5px;left:0}.ui-resizable-e{cursor:e-resize;width:7px;right:-5px;top:0;height:100%}.ui-resizable-w{cursor:w-resize;width:7px;left:-5px;top:0;height:100%}.ui-resizable-se{cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.ui-resizable-sw{cursor:sw-resize;width:9px;height:9px;left:-5px;bottom:-5px}.ui-resizable-nw{cursor:nw-resize;width:9px;height:9px;left:-5px;top:-5px}.ui-resizable-ne{cursor:ne-resize;width:9px;height:9px;right:-5px;top:-5px}\n\n/* cache key: resourceloader:filter:minify-css:7:f8687212d5e59926ae1f30ea56db346e */\n"
}, {});
mw.loader.implement("jquery.ui.slider", function($) {
	(function($) {
		var numPages = 5;
		$.widget("ui.slider", $.ui.mouse, {
			widgetEventPrefix: "slide",
			options: {
				animate: false,
				distance: 0,
				max: 100,
				min: 0,
				orientation: "horizontal",
				range: false,
				step: 1,
				value: 0,
				values: null
			},
			_create: function() {
				var self = this,
					o = this.options;
				this._keySliding = false;
				this._mouseSliding = false;
				this._animateOff = true;
				this._handleIndex = null;
				this._detectOrientation();
				this._mouseInit();
				this.element.addClass("ui-slider" + " ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all");
				if (o.disabled) {
					this.element.addClass("ui-slider-disabled ui-disabled");
				}
				this.range = $([]);
				if (o.range) {
					if (o.range === true) {
						this.range = $("<div></div>");
						if (!o.values) {
							o.values = [this._valueMin(), this._valueMin()];
						}
						if (o.values.length && o.values.length !== 2) {
							o.values = [o.values[0], o.values[0]];
						}
					} else {
						this.range = $("<div></div>");
					}
					this.range.appendTo(this.element).addClass("ui-slider-range");
					if (o.range === "min" || o.range === "max") {
						this.range.addClass("ui-slider-range-" + o.range);
					}
					this.range.addClass("ui-widget-header");
				}
				if ($(".ui-slider-handle", this.element).length === 0) {
					$("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
				}
				if (o.values && o.values.length) {
					while ($(".ui-slider-handle", this.element).length < o.values.length) {
						$("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
					}
				}
				this.handles = $(".ui-slider-handle", this.element).addClass("ui-state-default" + " ui-corner-all");
				this.handle = this.handles.eq(0);
				this.handles.add(this.range).filter("a").click(function(event) {
					event.preventDefault();
				}).hover(function() {
						if (!o.disabled) {
							$(this).addClass("ui-state-hover");
						}
					}, function() {
						$(this).removeClass("ui-state-hover");
					}).focus(function() {
						if (!o.disabled) {
							$(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
							$(this).addClass("ui-state-focus");
						} else {
							$(this).blur();
						}
					}).blur(function() {
						$(this).removeClass("ui-state-focus");
					});
				this.handles.each(function(i) {
					$(this).data("index.ui-slider-handle", i);
				});
				this.handles.keydown(function(event) {
					var ret = true,
						index = $(this).data("index.ui-slider-handle"),
						allowed, curVal, newVal, step;
					if (self.options.disabled) {
						return;
					}
					switch (event.keyCode) {
						case $.ui.keyCode.HOME:
						case $.ui.keyCode.END:
						case $.ui.keyCode.PAGE_UP:
						case $.ui.keyCode.PAGE_DOWN:
						case $.ui.keyCode.UP:
						case $.ui.keyCode.RIGHT:
						case $.ui.keyCode.DOWN:
						case $.ui.keyCode.LEFT:
							ret = false;
							if (!self._keySliding) {
								self._keySliding = true;
								$(this).addClass("ui-state-active");
								allowed = self._start(event, index);
								if (allowed === false) {
									return;
								}
							}
							break;
					}
					step = self.options.step;
					if (self.options.values && self.options.values.length) {
						curVal = newVal = self.values(index);
					} else {
						curVal = newVal = self.value();
					}
					switch (event.keyCode) {
						case $.ui.keyCode.HOME:
							newVal = self._valueMin();
							break;
						case $.ui.keyCode.END:
							newVal = self._valueMax();
							break;
						case $.ui.keyCode.PAGE_UP:
							newVal = self._trimAlignValue(curVal + ((self._valueMax() - self._valueMin()) / numPages));
							break;
						case $.ui.keyCode.PAGE_DOWN:
							newVal = self._trimAlignValue(curVal - ((self._valueMax() - self._valueMin()) / numPages));
							break;
						case $.ui.keyCode.UP:
						case $.ui.keyCode.RIGHT:
							if (curVal === self._valueMax()) {
								return;
							}
							newVal = self._trimAlignValue(curVal + step);
							break;
						case $.ui.keyCode.DOWN:
						case $.ui.keyCode.LEFT:
							if (curVal === self._valueMin()) {
								return;
							}
							newVal = self._trimAlignValue(curVal - step);
							break;
					}
					self._slide(event, index, newVal);
					return ret;
				}).keyup(function(event) {
						var index = $(this).data("index.ui-slider-handle");
						if (self._keySliding) {
							self._keySliding = false;
							self._stop(event, index);
							self._change(event, index);
							$(this).removeClass("ui-state-active");
						}
					});
				this._refreshValue();
				this._animateOff = false;
			},
			destroy: function() {
				this.handles.remove();
				this.range.remove();
				this.element.removeClass("ui-slider" + " ui-slider-horizontal" + " ui-slider-vertical" + " ui-slider-disabled" + " ui-widget" + " ui-widget-content" + " ui-corner-all").removeData("slider").unbind(".slider");
				this._mouseDestroy();
				return this;
			},
			_mouseCapture: function(event) {
				var o = this.options,
					position, normValue, distance, closestHandle, self, index, allowed, offset, mouseOverHandle;
				if (o.disabled) {
					return false;
				}
				this.elementSize = {
					width: this.element.outerWidth(),
					height: this.element.outerHeight()
				};
				this.elementOffset = this.element.offset();
				position = {
					x: event.pageX,
					y: event.pageY
				};
				normValue = this._normValueFromMouse(position);
				distance = this._valueMax() - this._valueMin() + 1;
				self = this;
				this.handles.each(function(i) {
					var thisDistance = Math.abs(normValue - self.values(i));
					if (distance > thisDistance) {
						distance = thisDistance;
						closestHandle = $(this);
						index = i;
					}
				});
				if (o.range === true && this.values(1) === o.min) {
					index += 1;
					closestHandle = $(this.handles[index]);
				}
				allowed = this._start(event, index);
				if (allowed === false) {
					return false;
				}
				this._mouseSliding = true;
				self._handleIndex = index;
				closestHandle.addClass("ui-state-active").focus();
				offset = closestHandle.offset();
				mouseOverHandle = !$(event.target).parents().andSelf().is(".ui-slider-handle");
				this._clickOffset = mouseOverHandle ? {
					left: 0,
					top: 0
				} : {
					left: event.pageX - offset.left - (closestHandle.width() / 2),
					top: event.pageY - offset.top - (closestHandle.height() / 2) - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
				};
				normValue = this._normValueFromMouse(position);
				this._slide(event, index, normValue);
				this._animateOff = true;
				return true;
			},
			_mouseStart: function(event) {
				return true;
			},
			_mouseDrag: function(event) {
				var position = {
					x: event.pageX,
					y: event.pageY
				}, normValue = this._normValueFromMouse(position);
				this._slide(event, this._handleIndex, normValue);
				return false;
			},
			_mouseStop: function(event) {
				this.handles.removeClass("ui-state-active");
				this._mouseSliding = false;
				this._stop(event, this._handleIndex);
				this._change(event, this._handleIndex);
				this._handleIndex = null;
				this._clickOffset = null;
				this._animateOff = false;
				return false;
			},
			_detectOrientation: function() {
				this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
			},
			_normValueFromMouse: function(position) {
				var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;
				if (this.orientation === "horizontal") {
					pixelTotal = this.elementSize.width;
					pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
				} else {
					pixelTotal = this.elementSize.height;
					pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
				}
				percentMouse = (pixelMouse / pixelTotal);
				if (percentMouse > 1) {
					percentMouse = 1;
				}
				if (percentMouse < 0) {
					percentMouse = 0;
				}
				if (this.orientation === "vertical") {
					percentMouse = 1 - percentMouse;
				}
				valueTotal = this._valueMax() - this._valueMin();
				valueMouse = this._valueMin() + percentMouse * valueTotal;
				return this._trimAlignValue(valueMouse);
			},
			_start: function(event, index) {
				var uiHash = {
					handle: this.handles[index],
					value: this.value()
				};
				if (this.options.values && this.options.values.length) {
					uiHash.value = this.values(index);
					uiHash.values = this.values();
				}
				return this._trigger("start", event, uiHash);
			},
			_slide: function(event, index, newVal) {
				var otherVal, newValues, allowed;
				if (this.options.values && this.options.values.length) {
					otherVal = this.values(index ? 0 : 1);
					if ((this.options.values.length === 2 && this.options.range === true) && ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))) {
						newVal = otherVal;
					}
					if (newVal !== this.values(index)) {
						newValues = this.values();
						newValues[index] = newVal;
						allowed = this._trigger("slide", event, {
							handle: this.handles[index],
							value: newVal,
							values: newValues
						});
						otherVal = this.values(index ? 0 : 1);
						if (allowed !== false) {
							this.values(index, newVal, true);
						}
					}
				} else {
					if (newVal !== this.value()) {
						allowed = this._trigger("slide", event, {
							handle: this.handles[index],
							value: newVal
						});
						if (allowed !== false) {
							this.value(newVal);
						}
					}
				}
			},
			_stop: function(event, index) {
				var uiHash = {
					handle: this.handles[index],
					value: this.value()
				};
				if (this.options.values && this.options.values.length) {
					uiHash.value = this.values(index);
					uiHash.values = this.values();
				}
				this._trigger("stop", event, uiHash);
			},
			_change: function(event, index) {
				if (!this._keySliding && !this._mouseSliding) {
					var uiHash = {
						handle: this.handles[index],
						value: this.value()
					};
					if (this.options.values && this.options.values.length) {
						uiHash.value = this.values(index);
						uiHash.values = this.values();
					}
					this._trigger("change", event, uiHash);
				}
			},
			value: function(newValue) {
				if (arguments.length) {
					this.options.value = this._trimAlignValue(newValue);
					this._refreshValue();
					this._change(null, 0);
				}
				return this._value();
			},
			values: function(index, newValue) {
				var vals, newValues, i;
				if (arguments.length > 1) {
					this.options.values[index] = this._trimAlignValue(newValue);
					this._refreshValue();
					this._change(null, index);
				}
				if (arguments.length) {
					if ($.isArray(arguments[0])) {
						vals = this.options.values;
						newValues = arguments[0];
						for (i = 0; i < vals.length; i += 1) {
							vals[i] = this._trimAlignValue(newValues[i]);
							this._change(null, i);
						}
						this._refreshValue();
					} else {
						if (this.options.values && this.options.values.length) {
							return this._values(index);
						} else {
							return this.value();
						}
					}
				} else {
					return this._values();
				}
			},
			_setOption: function(key, value) {
				var i, valsLength = 0;
				if ($.isArray(this.options.values)) {
					valsLength = this.options.values.length;
				}
				$.Widget.prototype._setOption.apply(this, arguments);
				switch (key) {
					case "disabled":
						if (value) {
							this.handles.filter(".ui-state-focus").blur();
							this.handles.removeClass("ui-state-hover");
							this.handles.attr("disabled", "disabled");
							this.element.addClass("ui-disabled");
						} else {
							this.handles.removeAttr("disabled");
							this.element.removeClass("ui-disabled");
						}
						break;
					case "orientation":
						this._detectOrientation();
						this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
						this._refreshValue();
						break;
					case "value":
						this._animateOff = true;
						this._refreshValue();
						this._change(null, 0);
						this._animateOff = false;
						break;
					case "values":
						this._animateOff = true;
						this._refreshValue();
						for (i = 0; i < valsLength; i += 1) {
							this._change(null, i);
						}
						this._animateOff = false;
						break;
				}
			},
			_value: function() {
				var val = this.options.value;
				val = this._trimAlignValue(val);
				return val;
			},
			_values: function(index) {
				var val, vals, i;
				if (arguments.length) {
					val = this.options.values[index];
					val = this._trimAlignValue(val);
					return val;
				} else {
					vals = this.options.values.slice();
					for (i = 0; i < vals.length; i += 1) {
						vals[i] = this._trimAlignValue(vals[i]);
					}
					return vals;
				}
			},
			_trimAlignValue: function(val) {
				if (val < this._valueMin()) {
					return this._valueMin();
				}
				if (val > this._valueMax()) {
					return this._valueMax();
				}
				var step = (this.options.step > 0) ? this.options.step : 1,
					valModStep = val % step,
					alignValue = val - valModStep;
				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}
				return parseFloat(alignValue.toFixed(5));
			},
			_valueMin: function() {
				return this.options.min;
			},
			_valueMax: function() {
				return this.options.max;
			},
			_refreshValue: function() {
				var oRange = this.options.range,
					o = this.options,
					self = this,
					animate = (!this._animateOff) ? o.animate : false,
					valPercent, _set = {}, lastValPercent, value, valueMin, valueMax;
				if (this.options.values && this.options.values.length) {
					this.handles.each(function(i, j) {
						valPercent = (self.values(i) - self._valueMin()) / (self._valueMax() - self._valueMin()) * 100;
						_set[self.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
						$(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
						if (self.options.range === true) {
							if (self.orientation === "horizontal") {
								if (i === 0) {
									self.range.stop(1, 1)[animate ? "animate" : "css"]({
										left: valPercent + "%"
									}, o.animate);
								}
								if (i === 1) {
									self.range[animate ? "animate" : "css"]({
										width: (valPercent - lastValPercent) + "%"
									}, {
										queue: false,
										duration: o.animate
									});
								}
							} else {
								if (i === 0) {
									self.range.stop(1, 1)[animate ? "animate" : "css"]({
										bottom: (valPercent) + "%"
									}, o.animate);
								}
								if (i === 1) {
									self.range[animate ? "animate" : "css"]({
										height: (valPercent - lastValPercent) + "%"
									}, {
										queue: false,
										duration: o.animate
									});
								}
							}
						}
						lastValPercent = valPercent;
					});
				} else {
					value = this.value();
					valueMin = this._valueMin();
					valueMax = this._valueMax();
					valPercent = (valueMax !== valueMin) ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
					_set[self.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
					this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
					if (oRange === "min" && this.orientation === "horizontal") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							width: valPercent + "%"
						}, o.animate);
					}
					if (oRange === "max" && this.orientation === "horizontal") {
						this.range[animate ? "animate" : "css"]({
							width: (100 - valPercent) + "%"
						}, {
							queue: false,
							duration: o.animate
						});
					}
					if (oRange === "min" && this.orientation === "vertical") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							height: valPercent + "%"
						}, o.animate);
					}
					if (oRange === "max" && this.orientation === "vertical") {
						this.range[animate ? "animate" : "css"]({
							height: (100 - valPercent) + "%"
						}, {
							queue: false,
							duration: o.animate
						});
					}
				}
			}
		});
		$.extend($.ui.slider, {
			version: "1.8.2"
		});
	}(jQuery));;
}, {
	"all": ".ui-slider{position:relative;text-align:left}.ui-slider .ui-slider-handle{position:absolute;z-index:2;width:1.2em;height:1.2em;cursor:default}.ui-slider .ui-slider-range{position:absolute;z-index:1;font-size:.7em;display:block;border:0;background-position:0 0}.ui-slider-horizontal{height:.8em}.ui-slider-horizontal .ui-slider-handle{top:-.3em;margin-left:-.6em}.ui-slider-horizontal .ui-slider-range{top:0;height:100%}.ui-slider-horizontal .ui-slider-range-min{left:0}.ui-slider-horizontal .ui-slider-range-max{right:0}.ui-slider-vertical{width:.8em;height:100px}.ui-slider-vertical .ui-slider-handle{left:-.3em;margin-left:0;margin-bottom:-.6em}.ui-slider-vertical .ui-slider-range{left:0;width:100%}.ui-slider-vertical .ui-slider-range-min{bottom:0}.ui-slider-vertical .ui-slider-range-max{top:0}\n\n/* cache key: resourceloader:filter:minify-css:7:03fe24ffbdc391cc21800746d562fb5a */\n"
}, {});
mw.loader.implement("jquery.ui.touchPunch", function($) {
	(function($) {
		jQuery.ui['touchPunch'] = true;
		$.support.touch = 'ontouchend' in document;
		if (!$.support.touch) {
			return;
		}
		var mouseProto = $.ui.mouse.prototype,
			_mouseInit = mouseProto._mouseInit,
			touchHandled;

		function simulateMouseEvent(event, simulatedType) {
			if (event.originalEvent.touches.length > 1) {
				return;
			}
			event.preventDefault();
			var touch = event.originalEvent.changedTouches[0],
				simulatedEvent = document.createEvent('MouseEvents');
			simulatedEvent.initMouseEvent(simulatedType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			event.target.dispatchEvent(simulatedEvent);
		}
		mouseProto._touchStart = function(event) {
			var self = this;
			if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
				return;
			}
			touchHandled = true;
			self._touchMoved = false;
			simulateMouseEvent(event, 'mouseover');
			simulateMouseEvent(event, 'mousemove');
			simulateMouseEvent(event, 'mousedown');
		};
		mouseProto._touchMove = function(event) {
			if (!touchHandled) {
				return;
			}
			this._touchMoved = true;
			simulateMouseEvent(event, 'mousemove');
		};
		mouseProto._touchEnd = function(event) {
			if (!touchHandled) {
				return;
			}
			simulateMouseEvent(event, 'mouseup');
			simulateMouseEvent(event, 'mouseout');
			if (!this._touchMoved) {
				simulateMouseEvent(event, 'click');
			}
			touchHandled = false;
		};
		mouseProto._mouseInit = function() {
			var self = this;
			self.element.bind('touchstart', $.proxy(self, '_touchStart')).bind('touchmove', $.proxy(self, '_touchMove')).bind('touchend', $.proxy(self, '_touchEnd'));
			_mouseInit.call(self);
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("jquery.ui.widget", function($) {
	(function($) {
		var _remove = $.fn.remove;
		$.fn.remove = function(selector, keepData) {
			return this.each(function() {
				if (!keepData) {
					if (!selector || $.filter(selector, [this]).length) {
						$("*", this).add(this).each(function() {
							$(this).triggerHandler("remove");
						});
					}
				}
				return _remove.call($(this), selector, keepData);
			});
		};
		$.widget = function(name, base, prototype) {
			var namespace = name.split(".")[0],
				fullName;
			name = name.split(".")[1];
			fullName = namespace + "-" + name;
			if (!prototype) {
				prototype = base;
				base = $.Widget;
			}
			$.expr[":"][fullName] = function(elem) {
				return !!$.data(elem, name);
			};
			$[namespace] = $[namespace] || {};
			$[namespace][name] = function(options, element) {
				if (arguments.length) {
					this._createWidget(options, element);
				}
			};
			var basePrototype = new base();
			basePrototype.options = $.extend({}, basePrototype.options);
			$[namespace][name].prototype = $.extend(true, basePrototype, {
				namespace: namespace,
				widgetName: name,
				widgetEventPrefix: $[namespace][name].prototype.widgetEventPrefix || name,
				widgetBaseClass: fullName
			}, prototype);
			$.widget.bridge(name, $[namespace][name]);
		};
		$.widget.bridge = function(name, object) {
			$.fn[name] = function(options) {
				var isMethodCall = typeof options === "string",
					args = Array.prototype.slice.call(arguments, 1),
					returnValue = this;
				options = !isMethodCall && args.length ? $.extend.apply(null, [true, options].concat(args)) : options;
				if (isMethodCall && options.substring(0, 1) === "_") {
					return returnValue;
				}
				if (isMethodCall) {
					this.each(function() {
						var instance = $.data(this, name),
							methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : instance;
						if (methodValue !== instance && methodValue !== undefined) {
							returnValue = methodValue;
							return false;
						}
					});
				} else {
					this.each(function() {
						var instance = $.data(this, name);
						if (instance) {
							if (options) {
								instance.option(options);
							}
							instance._init();
						} else {
							$.data(this, name, new object(options, this));
						}
					});
				}
				return returnValue;
			};
		};
		$.Widget = function(options, element) {
			if (arguments.length) {
				this._createWidget(options, element);
			}
		};
		$.Widget.prototype = {
			widgetName: "widget",
			widgetEventPrefix: "",
			options: {
				disabled: false
			},
			_createWidget: function(options, element) {
				this.element = $(element).data(this.widgetName, this);
				this.options = $.extend(true, {}, this.options, $.metadata && $.metadata.get(element)[this.widgetName], options);
				var self = this;
				this.element.bind("remove." + this.widgetName, function() {
					self.destroy();
				});
				this._create();
				this._init();
			},
			_create: function() {},
			_init: function() {},
			destroy: function() {
				this.element.unbind("." + this.widgetName).removeData(this.widgetName);
				this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled");
			},
			widget: function() {
				return this.element;
			},
			option: function(key, value) {
				var options = key,
					self = this;
				if (arguments.length === 0) {
					return $.extend({}, self.options);
				}
				if (typeof key === "string") {
					if (value === undefined) {
						return this.options[key];
					}
					options = {};
					options[key] = value;
				}
				$.each(options, function(key, value) {
					self._setOption(key, value);
				});
				return self;
			},
			_setOption: function(key, value) {
				this.options[key] = value;
				if (key === "disabled") {
					this.widget()[value ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", value);
				}
				return this;
			},
			enable: function() {
				return this._setOption("disabled", false);
			},
			disable: function() {
				return this._setOption("disabled", true);
			},
			_trigger: function(type, event, data) {
				var callback = this.options[type];
				event = $.Event(event);
				event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
				data = data || {};
				if (event.originalEvent) {
					for (var i = $.event.props.length, prop; i;) {
						prop = $.event.props[--i];
						event[prop] = event.originalEvent[prop];
					}
				}
				this.element.trigger(event, data);
				return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false || event.isDefaultPrevented());
			}
		};
	})(jQuery);;
}, {}, {});
mw.loader.implement("mediawiki.Uri", function($) {
	(function($, mw) {
		function cat(pre, val, post, raw) {
			if (val === undefined || val === null || val === '') {
				return '';
			} else {
				return pre + (raw ? val : mw.Uri.encode(val)) + post;
			}
		}
		var parser = {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/(?:(?:([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)?((?:[^?#\/]*\/)*[^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
			loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?(?:(?:([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?((?:\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?[^?#\/]*)(?:\?([^#]*))?(?:#(.*))?/
		}, properties = ['protocol', 'user', 'password', 'host', 'port', 'path', 'query', 'fragment'];
		mw.UriRelative = function(documentLocation) {
			function Uri(uri, options) {
				options = typeof options === 'object' ? options : {
					strictMode: !! options
				};
				options = $.extend({
					strictMode: false,
					overrideKeys: false
				}, options);
				if (uri !== undefined && uri !== null || uri !== '') {
					if (typeof uri === 'string') {
						this._parse(uri, options);
					} else if (typeof uri === 'object') {
						var _this = this;
						$.each(properties, function(i, property) {
							_this[property] = uri[property];
						});
						if (this.query === undefined) {
							this.query = {};
						}
					}
				}
				if (!this.protocol) {
					this.protocol = defaultUri.protocol;
				}
				try {
					if (!this.host) {
						this.host = defaultUri.host;
						if (!this.port) {
							this.port = defaultUri.port;
						}
					}
					if (this.path && this.path.charAt(0) !== '/') {
						throw new Error('Bad constructor arguments');
					}
					if (!(this.protocol && this.host && this.path)) {
						throw new Error('Bad constructor arguments');
					}
				} catch (e) {
					mw.log(e);
				}
			}
			Uri.encode = function(s) {
				return encodeURIComponent(s).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
			};
			Uri.decode = function(s) {
				return decodeURIComponent(s.replace(/\+/g, '%20'));
			};
			Uri.prototype = {
				_parse: function(str, options) {
					var matches = parser[options.strictMode ? 'strict' : 'loose'].exec(str);
					var uri = this;
					$.each(properties, function(i, property) {
						uri[property] = matches[i + 1];
					});
					var q = {};
					if (uri.query) {
						uri.query.replace(/(?:^|&)([^&=]*)(?:(=)([^&]*))?/g, function($0, $1, $2, $3) {
							if ($1) {
								var k = Uri.decode($1);
								var v = ($2 === '' || $2 === undefined) ? null : Uri.decode($3);
								if (options.overrideKeys || q[k] === undefined) {
									q[k] = v;
								} else {
									if (typeof q[k] === 'string') {
										q[k] = [q[k]];
									}
									if ($.isArray(q[k])) {
										q[k].push(v);
									}
								}
							}
						});
					}
					this.query = q;
				},
				getUserInfo: function() {
					return cat('', this.user, cat(':', this.password, ''));
				},
				getHostPort: function() {
					return this.host + cat(':', this.port, '');
				},
				getAuthority: function() {
					return cat('', this.getUserInfo(), '@') + this.getHostPort();
				},
				getQueryString: function() {
					var args = [];
					$.each(this.query, function(key, val) {
						var k = Uri.encode(key);
						var vals = val === null ? [null] : $.makeArray(val);
						$.each(vals, function(i, v) {
							args.push(k + (v === null ? '' : '=' + Uri.encode(v)));
						});
					});
					return args.join('&');
				},
				getRelativePath: function() {
					return this.path + cat('?', this.getQueryString(), '', true) + cat('#', this.fragment, '');
				},
				toString: function() {
					return this.protocol + '://' + this.getAuthority() + this.getRelativePath();
				},
				clone: function() {
					return new Uri(this);
				},
				extend: function(parameters) {
					$.extend(this.query, parameters);
					return this;
				}
			};
			var defaultUri = new Uri(documentLocation);
			return Uri;
		};
		if (document && document.location && document.location.href) {
			if (typeof document.location == 'undefined' || !document.location.href) {
				mw.Uri = mw.UriRelative('http://webview.com/fixme');
			} else {
				mw.Uri = mw.UriRelative(document.location.href);
			}
		}
	})(jQuery, mediaWiki);;
}, {}, {});
mw.loader.implement("mediawiki.UtilitiesTime", function($) {
	(function(mw) {
		mw.seconds2npt = function(sec, show_ms) {
			if (isNaN(sec)) {
				mw.log("Warning: mediawiki.UtilitiesTime, trying to get npt time on NaN:" + sec);
				return '0:00:00';
			}
			var tm = mw.seconds2Measurements(sec);
			if (show_ms) {
				tm.seconds = Math.round(tm.seconds * 1000) / 1000;
			} else {
				tm.seconds = Math.round(tm.seconds);
			}
			if (tm.seconds < 10) {
				tm.seconds = '0' + tm.seconds;
			}
			if (tm.hours == 0) {
				hoursStr = '';
			} else {
				if (tm.minutes < 10) tm.minutes = '0' + tm.minutes;
				hoursStr = tm.hours + ":";
			}
			return hoursStr + tm.minutes + ":" + tm.seconds;
		};
		mw.seconds2Measurements = function(sec) {
			var tm = {};
			tm.days = Math.floor(sec / (3600 * 24));
			tm.hours = Math.floor(Math.round(sec) / 3600);
			tm.minutes = Math.floor((Math.round(sec) / 60) % 60);
			tm.seconds = Math.round(sec) % 60;
			return tm;
		};
		mw.measurements2seconds = function(timeMeasurements) {
			var seconds = 0;
			if (timeMeasurements.days) {
				seconds += parseInt(timeMeasurements.days, 10) * 24 * 3600;
			}
			if (timeMeasurements.hours) {
				seconds += parseInt(timeMeasurements.hours, 10) * 3600;
			}
			if (timeMeasurements.minutes) {
				seconds += parseInt(timeMeasurements.minutes, 10) * 60;
			}
			if (timeMeasurements.seconds) {
				seconds += parseInt(timeMeasurements.seconds, 10);
			}
			if (timeMeasurements.milliseconds) {
				seconds += parseInt(timeMeasurements.milliseconds, 10) / 1000;
			}
			return seconds;
		};
		mw.npt2seconds = function(npt_str) {
			if (!npt_str) {
				return 0;
			}
			npt_str = npt_str.replace(/npt:|s/g, '');
			var hour = 0;
			var min = 0;
			var sec = 0;
			times = npt_str.split(':');
			if (times.length == 3) {
				sec = times[2];
				min = times[1];
				hour = times[0];
			} else if (times.length == 2) {
				sec = times[1];
				min = times[0];
			} else {
				sec = times[0];
			}
			sec = sec.replace(/,\s?/, '.');
			return parseInt(hour * 3600) + parseInt(min * 60) + parseFloat(sec);
		};
	})(window.mediaWiki);;
}, {}, {});
mw.loader.implement("mediawiki.UtilitiesUrl", function($) {
	(function(mw) {
		mw.absoluteUrl = function(source, contextUrl) {
			if (source.indexOf('http://') === 0 || source.indexOf('https://') === 0) {
				return source;
			}
			if (!contextUrl) {
				contextUrl = document.URL;
			}
			var contextUrl = new mw.Uri(contextUrl);
			if (source.indexOf('//') === 0) {
				return contextUrl.protocol + ':' + source;
			}
			if (contextUrl.directory == '' && contextUrl.protocol == 'file') {
				var fileUrl = contextUrl.split('\\');
				fileUrl.pop();
				return fileUrl.join('\\') + '\\' + src;
			}
			if (source.indexOf('/') === 0) {
				return contextUrl.protocol + '://' + contextUrl.getAuthority() + source;
			} else {
				return contextUrl.protocol + '://' + contextUrl.getAuthority() + contextUrl.path + source;
			}
		};
		mw.isLocalDomain = function(url) {
			if (!url) {
				return false;
			}
			if ((url.indexOf('http://') != 0 && url.indexOf('//') != 0 && url.indexOf('https://') != 0) || new mw.Uri(document.URL).host == new mw.Uri(url).host) {
				return true;
			}
			return false;
		}
	})(window.mediaWiki);;
}, {}, {});
mw.loader.implement("mediawiki.client", function($) {
	(function(mw) {
		mw.isMobileDevice = function() {
			return (mw.isIphone() || mw.isIpod() || mw.isIpad() || mw.isAndroid())
		};
		mw.isIphone = function() {
			return (navigator.userAgent.indexOf('iPhone') != -1 && !mw.isIpad()) || mw.isIpod();
		};
		mw.isIE9 = function() {
			return (/msie 9/.test(navigator.userAgent.toLowerCase()));
		};
		mw.isIE = function() {
			return (/msie/).test(navigator.userAgent.toLowerCase());
		};
		mw.isDesktopSafari = function() {
			return (/safari/).test(navigator.userAgent.toLowerCase()) && !mw.isMobileDevice();
		};
		mw.isIphone4 = function() {
			return (mw.isIphone() && (window.devicePixelRatio && window.devicePixelRatio >= 2));
		};
		mw.isIpod = function() {
			return (navigator.userAgent.indexOf('iPod') != -1);
		};
		mw.isIpad = function() {
			return (navigator.userAgent.indexOf('iPad') != -1);
		};
		mw.isIpad3 = function() {
			return /OS 3_/.test(navigator.userAgent) && mw.isIpad();
		};
		mw.isAndroid42 = function() {
			return (navigator.userAgent.indexOf('Android 4.2') != -1);
		};
		mw.isAndroid41 = function() {
			return (navigator.userAgent.indexOf('Android 4.1') != -1);
		};
		mw.isAndroid40 = function() {
			return (navigator.userAgent.indexOf('Android 4.0') != -1);
		};
		mw.isAndroid2 = function() {
			return (navigator.userAgent.indexOf('Android 2.') != -1);
		};
		mw.isAndroid = function() {
			return (navigator.userAgent.indexOf('Android') != -1);
		};
		mw.isFirefox = function() {
			return (navigator.userAgent.indexOf('Firefox') != -1);
		};
		mw.isMobileChrome = function() {
			return (navigator.userAgent.indexOf('Android 4.') != -1 && navigator.userAgent.indexOf('Chrome') != -1)
		};
		mw.isIOS = function() {
			return (mw.isIphone() || mw.isIpod() || mw.isIpad());
		};
		mw.isIOS3 = function() {
			return /OS 3_/.test(navigator.userAgent) && mw.isIOS();
		};
		mw.isIOS4 = function() {
			return /OS 4_/.test(navigator.userAgent) && mw.isIOS();
		};
		mw.isIOS5 = function() {
			return /OS 5_/.test(navigator.userAgent) && mw.isIOS();
		};
		mw.isHTML5FallForwardNative = function() {
			if (mw.isMobileHTML5()) {
				return true;
			}
			if (document.URL.indexOf('forceMobileHTML5') != -1) {
				return true;
			}
			if (mw.supportsFlash()) {
				return false;
			}
			if (mw.supportsHTML5()) {
				return true;
			}
			return false;
		};
		mw.isMobileHTML5 = function() {
			if (mw.isIphone() || mw.isIpod() || mw.isIpad() || mw.isAndroid2()) {
				return true;
			}
			return false;
		};
		mw.supportsHTML5 = function() {
			if (navigator.userAgent.indexOf('BlackBerry') != -1) {
				return false;
			}
			var dummyvid = document.createElement("video");
			if (dummyvid.canPlayType) {
				return true;
			}
			return false;
		};
		mw.supportsFlash = function() {
			if (mw.getConfig('EmbedPlayer.DisableHTML5FlashFallback')) {
				return false;
			}
			var majorVersion = this.getFlashVersion().split(',').shift();
			if (majorVersion < 10) {
				return false;
			} else {
				return true;
			}
		};
		mw.getFlashVersion = function() {
			if (navigator.plugins && navigator.plugins.length) {
				try {
					if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
						return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
					}
				} catch (e) {}
			}
			try {
				try {
					if (typeof ActiveXObject != 'undefined') {
						var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
						try {
							axo.AllowScriptAccess = 'always';
						} catch (e) {
							return '6,0,0';
						}
					}
				} catch (e) {}
				return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
			} catch (e) {}
			return '0,0,0';
		};
	})(window.mediaWiki);;
}, {}, {});
mw.loader.implement("mediawiki.jqueryMsg", function($) {
	(function(mw, $, undefined) {
		mw.jqueryMsg = {};

		function getFailableParserFn(options) {
			var parser = new mw.jqueryMsg.parser(options);
			return function(args) {
				var key = args[0];
				var argsArray = $.isArray(args[1]) ? args[1] : $.makeArray(args).slice(1);
				try {
					return parser.parse(key, argsArray);
				} catch (e) {
					return $('<span>').append(key + ': ' + e.message);
				}
			};
		}
		mw.jqueryMsg.getMessageFunction = function(options) {
			var failableParserFn = getFailableParserFn(options);
			return function() {
				return failableParserFn(arguments).html();
			};
		};
		mw.jqueryMsg.getPlugin = function(options) {
			var failableParserFn = getFailableParserFn(options);
			return function() {
				var $target = this.empty();
				$.each(failableParserFn(arguments).contents(), function(i, node) {
					$target.append(node);
				});
				return $target;
			};
		};
		var parserDefaults = {
			'magic': {
				'SITENAME': mw.config.get('wgSiteName')
			},
			'messages': mw.messages,
			'language': mw.language
		};
		mw.jqueryMsg.parser = function(options) {
			this.settings = $.extend({}, parserDefaults, options);
			this.emitter = new mw.jqueryMsg.htmlEmitter(this.settings.language, this.settings.magic);
		};
		mw.jqueryMsg.parser.prototype = {
			astCache: {},
			parse: function(key, replacements) {
				return this.emitter.emit(this.getAst(key), replacements);
			},
			getAst: function(key) {
				if (this.astCache[key] === undefined) {
					var wikiText = this.settings.messages.get(key);
					if (typeof wikiText !== 'string') {
						wikiText = "\\[" + key + "\\]";
					}
					this.astCache[key] = this.wikiTextToAst(wikiText);
				}
				return this.astCache[key];
			},
			wikiTextToAst: function(input) {
				var pos = 0;

				function choice(ps) {
					return function() {
						for (var i = 0; i < ps.length; i++) {
							var result = ps[i]();
							if (result !== null) {
								return result;
							}
						}
						return null;
					};
				}
				function sequence(ps) {
					var originalPos = pos;
					var result = [];
					for (var i = 0; i < ps.length; i++) {
						var res = ps[i]();
						if (res === null) {
							pos = originalPos;
							return null;
						}
						result.push(res);
					}
					return result;
				}
				function nOrMore(n, p) {
					return function() {
						var originalPos = pos;
						var result = [];
						var parsed = p();
						while (parsed !== null) {
							result.push(parsed);
							parsed = p();
						}
						if (result.length < n) {
							pos = originalPos;
							return null;
						}
						return result;
					};
				}
				function transform(p, fn) {
					return function() {
						var result = p();
						return result === null ? null : fn(result);
					};
				}
				function makeStringParser(s) {
					var len = s.length;
					return function() {
						var result = null;
						if (input.substr(pos, len) === s) {
							result = s;
							pos += len;
						}
						return result;
					};
				}
				function makeRegexParser(regex) {
					return function() {
						var matches = input.substr(pos).match(regex);
						if (matches === null) {
							return null;
						}
						pos += matches[0].length;
						return matches[0];
					};
				}
				var regularLiteral = makeRegexParser(/^[^{}[\]$\\]/);
				var regularLiteralWithoutBar = makeRegexParser(/^[^{}[\]$\\|]/);
				var regularLiteralWithoutSpace = makeRegexParser(/^[^{}[\]$\s]/);
				var backslash = makeStringParser("\\");
				var anyCharacter = makeRegexParser(/^./);

				function escapedLiteral() {
					var result = sequence([backslash, anyCharacter]);
					return result === null ? null : result[1];
				}
				var escapedOrLiteralWithoutSpace = choice([escapedLiteral, regularLiteralWithoutSpace]);
				var escapedOrLiteralWithoutBar = choice([escapedLiteral, regularLiteralWithoutBar]);
				var escapedOrRegularLiteral = choice([escapedLiteral, regularLiteral]);

				function literalWithoutSpace() {
					var result = nOrMore(1, escapedOrLiteralWithoutSpace)();
					return result === null ? null : result.join('');
				}
				function literalWithoutBar() {
					var result = nOrMore(1, escapedOrLiteralWithoutBar)();
					return result === null ? null : result.join('');
				}
				function literal() {
					var result = nOrMore(1, escapedOrRegularLiteral)();
					return result === null ? null : result.join('');
				}
				var whitespace = makeRegexParser(/^\s+/);
				var dollar = makeStringParser('$');
				var digits = makeRegexParser(/^\d+/);

				function replacement() {
					var result = sequence([dollar, digits]);
					if (result === null) {
						return null;
					}
					return ['REPLACE', parseInt(result[1], 10) - 1];
				}
				var openExtlink = makeStringParser('[');
				var closeExtlink = makeStringParser(']');

				function extlink() {
					var result = null;
					var parsedResult = sequence([openExtlink, nonWhitespaceExpression, whitespace, expression, closeExtlink]);
					if (parsedResult !== null) {
						result = ['LINK', parsedResult[1], parsedResult[3]];
					}
					return result;
				}
				function extLinkParam() {
					var result = sequence([openExtlink, dollar, digits, whitespace, expression, closeExtlink]);
					if (result === null) {
						return null;
					}
					return ['LINKPARAM', parseInt(result[2], 10) - 1, result[4]];
				}
				var openLink = makeStringParser('[[');
				var closeLink = makeStringParser(']]');

				function link() {
					var result = null;
					var parsedResult = sequence([openLink, expression, closeLink]);
					if (parsedResult !== null) {
						result = ['WLINK', parsedResult[1]];
					}
					return result;
				}
				var templateName = transform(makeRegexParser(/^[ !"$&'()*,.\/0-9;=?@A-Z\^_`a-z~\x80-\xFF+-]+/), function(result) {
					return result.toString();
				});

				function templateParam() {
					var result = sequence([pipe, nOrMore(0, paramExpression)]);
					if (result === null) {
						return null;
					}
					var expr = result[1];
					return expr.length > 1 ? ["CONCAT"].concat(expr) : expr[0];
				}
				var pipe = makeStringParser('|');

				function templateWithReplacement() {
					var result = sequence([templateName, colon, replacement]);
					return result === null ? null : [result[0], result[2]];
				}
				function templateWithOutReplacement() {
					var result = sequence([templateName, colon, paramExpression]);
					return result === null ? null : [result[0], result[2]];
				}
				var colon = makeStringParser(':');
				var templateContents = choice([function() {
					var res = sequence([choice([templateWithReplacement, templateWithOutReplacement]), nOrMore(0, templateParam)]);
					return res === null ? null : res[0].concat(res[1]);
				}, function() {
					var res = sequence([templateName, nOrMore(0, templateParam)]);
					if (res === null) {
						return null;
					}
					return [res[0]].concat(res[1]);
				}]);
				var openTemplate = makeStringParser('{{');
				var closeTemplate = makeStringParser('}}');

				function template() {
					var result = sequence([openTemplate, templateContents, closeTemplate]);
					return result === null ? null : result[1];
				}
				var nonWhitespaceExpression = choice([template, link, extLinkParam, extlink, replacement, literalWithoutSpace]);
				var paramExpression = choice([template, link, extLinkParam, extlink, replacement, literalWithoutBar]);
				var expression = choice([template, link, extLinkParam, extlink, replacement, literal]);

				function start() {
					var result = nOrMore(0, expression)();
					if (result === null) {
						return null;
					}
					return ["CONCAT"].concat(result);
				}
				var result = start();
				if (result === null || pos !== input.length) {
					throw new Error("Parse error at position " + pos.toString() + " in input: " + input);
				}
				return result;
			}
		};
		mw.jqueryMsg.htmlEmitter = function(language, magic) {
			this.language = language;
			var _this = this;
			$.each(magic, function(key, val) {
				_this[key.toLowerCase()] = function() {
					return val;
				};
			});
			this.emit = function(node, replacements) {
				var ret = null;
				var _this = this;
				switch (typeof node) {
					case 'string':
					case 'number':
						ret = node;
						break;
					case 'object':
						var subnodes = $.map(node.slice(1), function(n) {
							return _this.emit(n, replacements);
						});
						var operation = node[0].toLowerCase();
						if (typeof _this[operation] === 'function') {
							ret = _this[operation](subnodes, replacements);
						} else {
							throw new Error('unknown operation "' + operation + '"');
						}
						break;
					case 'undefined':
						ret = '';
						break;
					default:
						throw new Error('unexpected type in AST: ' + typeof node);
				}
				return ret;
			};
		};
		mw.jqueryMsg.htmlEmitter.prototype = {
			concat: function(nodes) {
				var span = $('<span>').addClass('mediaWiki_htmlEmitter');
				$.each(nodes, function(i, node) {
					if (node instanceof jQuery && node.hasClass('mediaWiki_htmlEmitter')) {
						$.each(node.contents(), function(j, childNode) {
							span.append(childNode);
						});
					} else {
						span.append(node);
					}
				});
				return span;
			},
			replace: function(nodes, replacements) {
				var index = parseInt(nodes[0], 10);
				if (index < replacements.length) {
					if (typeof arg === 'string') {
						return mw.html.escape(replacements[index]);
					} else {
						return replacements[index];
					}
				} else {
					return '$' + (index + 1);
				}
			},
			wlink: function(nodes) {
				return "unimplemented";
			},
			link: function(nodes) {
				var arg = nodes[0];
				var contents = nodes[1];
				var $el;
				if (arg instanceof jQuery) {
					$el = arg;
				} else {
					$el = $('<a>');
					if (typeof arg === 'function') {
						$el.click(arg).attr('href', '#');
					} else {
						$el.attr('href', arg.toString());
					}
				}
				$el.append(contents);
				return $el;
			},
			linkparam: function(nodes, replacements) {
				var replacement, index = parseInt(nodes[0], 10);
				if (index < replacements.length) {
					replacement = replacements[index];
				} else {
					replacement = '$' + (index + 1);
				}
				return this.link([replacement, nodes[1]]);
			},
			plural: function(nodes) {
				var count = parseInt(this.language.convertNumber(nodes[0], true), 10);
				var forms = nodes.slice(1);
				return forms.length ? this.language.convertPlural(count, forms) : '';
			},
			gender: function(nodes) {
				var gender;
				if (nodes[0] && nodes[0].options instanceof mw.Map) {
					gender = nodes[0].options.get('gender');
				} else {
					gender = nodes[0];
				}
				var forms = nodes.slice(1);
				return this.language.gender(gender, forms);
			},
			grammar: function(nodes) {
				var form = nodes[0];
				var word = nodes[1];
				return word && form && this.language.convertGrammar(word, form);
			}
		};
		window.gM = mw.jqueryMsg.getMessageFunction();
		$.fn.msg = mw.jqueryMsg.getPlugin();
		var oldParser = mw.Message.prototype.parser;
		mw.Message.prototype.parser = function() {
			if (this.map.get(this.key).indexOf('{{') < 0) {
				return oldParser.apply(this);
			}
			var messageFunction = mw.jqueryMsg.getMessageFunction({
				'messages': this.map
			});
			return messageFunction(this.key, this.parameters);
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mediawiki.language", function($) {
	mediaWiki.language = {
		'pluralProcessor': function(template) {
			if (template.arg && template.parameters && mediaWiki.language.convertPlural) {
				if (template.parameters.length == 0) {
					return '';
				}
				var count = mediaWiki.language.convertNumber(template.arg, true);
				return mediaWiki.language.convertPlural(parseInt(count), template.parameters);
			}
			if (template.parameters[0]) {
				return template.parameters[0];
			}
			return '';
		},
		'convertPlural': function(count, forms) {
			if (!forms || forms.length == 0) {
				return '';
			}
			return (parseInt(count) == 1) ? forms[0] : forms[1];
		},
		'preConvertPlural': function(forms, count) {
			while (forms.length < count) {
				forms.push(forms[forms.length - 1]);
			}
			return forms;
		},
		'convertNumber': function(number, integer) {
			if (!mediaWiki.language.digitTransformTable) {
				return number;
			}
			var transformTable = mediaWiki.language.digitTransformTable;
			if (integer) {
				if (parseInt(number) == number) {
					return number;
				}
				var tmp = [];
				for (var i in transformTable) {
					tmp[transformTable[i]] = i;
				}
				transformTable = tmp;
			}
			var numberString = '' + number;
			var convertedNumber = '';
			for (var i = 0; i < numberString.length; i++) {
				if (transformTable[numberString[i]]) {
					convertedNumber += transformTable[numberString[i]];
				} else {
					convertedNumber += numberString[i];
				}
			}
			return integer ? parseInt(convertedNumber) : convertedNumber;
		},
		'digitTransformTable': null
	};;
}, {}, {});
mw.loader.implement("mediawiki.util", function($) {
	(function($, mw) {
		"use strict";
		var util = {
			init: function() {
				var profile, $tocTitle, $tocToggleLink, hideTocCookie;
				$.messageBoxNew({
					id: 'mw-js-message',
					parent: '#content'
				});
				profile = $.client.profile();
				if (profile.name === 'opera') {
					util.tooltipAccessKeyPrefix = 'shift-esc-';
				} else if (profile.name === 'chrome') {
					util.tooltipAccessKeyPrefix = (profile.platform === 'mac' ? 'ctrl-option-' : profile.platform === 'win' ? 'alt-shift-' : 'alt-');
				} else if (profile.platform !== 'win' && profile.name === 'safari' && profile.layoutVersion > 526) {
					util.tooltipAccessKeyPrefix = 'ctrl-alt-';
				} else if (!(profile.platform === 'win' && profile.name === 'safari') && (profile.name === 'safari' || profile.platform === 'mac' || profile.name === 'konqueror')) {
					util.tooltipAccessKeyPrefix = 'ctrl-';
				} else if (profile.name === 'firefox' && profile.versionBase > '1') {
					util.tooltipAccessKeyPrefix = 'alt-shift-';
				}
				if ($('#bodyContent').length) {
					util.$content = $('#bodyContent');
				} else if ($('#mw_contentholder').length) {
					util.$content = $('#mw_contentholder');
				} else if ($('#article').length) {
					util.$content = $('#article');
				} else {
					util.$content = $('#content');
				}
				$tocTitle = $('#toctitle');
				$tocToggleLink = $('#togglelink');
				if ($('#toc').length && $tocTitle.length && !$tocToggleLink.length) {
					hideTocCookie = $.cookie('mw_hidetoc');
					$tocToggleLink = $('<a href="#" class="internal" id="togglelink"></a>').text(mw.msg('hidetoc')).click(function(e) {
						e.preventDefault();
						util.toggleToc($(this));
					});
					$tocTitle.append($tocToggleLink.wrap('<span class="toctoggle"></span>').parent().prepend('&nbsp;[').append(']&nbsp;'));
					if (hideTocCookie === '1') {
						util.toggleToc($tocToggleLink);
					}
				}
			},
			rawurlencode: function(str) {
				str = String(str);
				return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/~/g, '%7E');
			},
			wikiUrlencode: function(str) {
				return util.rawurlencode(str).replace(/%20/g, '_').replace(/%3A/g, ':').replace(/%2F/g, '/');
			},
			wikiGetlink: function(str) {
				return mw.config.get('wgArticlePath').replace('$1', util.wikiUrlencode(typeof str === 'string' ? str : mw.config.get('wgPageName')));
			},
			wikiScript: function(str) {
				return mw.config.get('wgScriptPath') + '/' + (str || 'index') + mw.config.get('wgScriptExtension');
			},
			addCSS: function(text) {
				var s = mw.loader.addStyleTag(text);
				return s.sheet || s;
			},
			toggleToc: function($toggleLink, callback) {
				var $tocList = $('#toc ul:first');
				if ($tocList.length) {
					if ($tocList.is(':hidden')) {
						$tocList.slideDown('fast', callback);
						$toggleLink.text(mw.msg('hidetoc'));
						$('#toc').removeClass('tochidden');
						$.cookie('mw_hidetoc', null, {
							expires: 30,
							path: '/'
						});
						return true;
					} else {
						$tocList.slideUp('fast', callback);
						$toggleLink.text(mw.msg('showtoc'));
						$('#toc').addClass('tochidden');
						$.cookie('mw_hidetoc', '1', {
							expires: 30,
							path: '/'
						});
						return false;
					}
				} else {
					return null;
				}
			},
			getParamValue: function(param, url) {
				url = url || document.location.href;
				var re = new RegExp('^[^#]*[&?]' + $.escapeRE(param) + '=([^&#]*)'),
					m = re.exec(url);
				if (m) {
					return decodeURIComponent(m[1].replace(/\+/g, '%20'));
				}
				return null;
			},
			tooltipAccessKeyPrefix: 'alt-',
			tooltipAccessKeyRegexp: /\[(ctrl-)?(alt-)?(shift-)?(esc-)?(.)\]$/,
			updateTooltipAccessKeys: function($nodes) {
				if (!$nodes) {
					$nodes = $('#column-one a, #mw-head a, #mw-panel a, #p-logo a, input, label');
				} else if (!($nodes instanceof $)) {
					$nodes = $($nodes);
				}
				$nodes.attr('title', function(i, val) {
					if (val && util.tooltipAccessKeyRegexp.exec(val)) {
						return val.replace(util.tooltipAccessKeyRegexp, '[' + util.tooltipAccessKeyPrefix + '$5]');
					}
					return val;
				});
			},
			$content: null,
			addPortletLink: function(portlet, href, text, id, tooltip, accesskey, nextnode) {
				var $item, $link, $portlet, $ul;
				if (arguments.length < 3) {
					return null;
				}
				$link = $('<a>').attr('href', href).text(text);
				if (tooltip) {
					$link.attr('title', tooltip);
				}
				switch (mw.config.get('skin')) {
					case 'standard':
					case 'cologneblue':
						$('#quickbar').append($link.after('<br/>'));
						return $link[0];
					case 'nostalgia':
						$('#searchform').before($link).before(' &#124; ');
						return $link[0];
					default:
						$portlet = $('#' + portlet);
						if ($portlet.length === 0) {
							return null;
						}
						$ul = $portlet.find('ul').eq(0);
						if ($ul.length === 0) {
							$ul = $('<ul>');
							if ($portlet.find('div:first').length === 0) {
								$portlet.append($ul);
							} else {
								$portlet.find('div').eq(-1).append($ul);
							}
						}
						if ($ul.length === 0) {
							return null;
						}
						$portlet.removeClass('emptyPortlet');
						if ($portlet.hasClass('vectorTabs')) {
							$item = $link.wrap('<li><span></span></li>').parent().parent();
						} else {
							$item = $link.wrap('<li></li>').parent();
						}
						if (id) {
							$item.attr('id', id);
						}
						if (accesskey) {
							$link.attr('accesskey', accesskey);
							tooltip += ' [' + accesskey + ']';
							$link.attr('title', tooltip);
						}
						if (accesskey && tooltip) {
							util.updateTooltipAccessKeys($link);
						}
						if (nextnode && nextnode.parentNode === $ul[0]) {
							$(nextnode).before($item);
						} else if (typeof nextnode === 'string' && $ul.find(nextnode).length !== 0) {
							$ul.find(nextnode).eq(0).before($item);
						} else {
							$ul.append($item);
						}
						return $item[0];
				}
			},
			jsMessage: function(message, className) {
				if (!arguments.length || message === '' || message === null) {
					$('#mw-js-message').empty().hide();
					return true;
				} else {
					var $messageDiv = $('#mw-js-message');
					if (!$messageDiv.length) {
						$messageDiv = $('<div id="mw-js-message"></div>');
						if (util.$content.parent().length) {
							util.$content.parent().prepend($messageDiv);
						} else {
							return false;
						}
					}
					if (className) {
						$messageDiv.prop('class', 'mw-js-message-' + className);
					}
					if (typeof message === 'object') {
						$messageDiv.empty();
						$messageDiv.append(message);
					} else {
						$messageDiv.html(message);
					}
					$messageDiv.slideDown();
					return true;
				}
			},
			validateEmail: function(mailtxt) {
				var rfc5322_atext, rfc1034_ldh_str, HTML5_email_regexp;
				if (mailtxt === '') {
					return null;
				}
				rfc5322_atext = "a-z0-9!#$%&'*+\\-/=?^_`{|}~";
				rfc1034_ldh_str = "a-z0-9\\-";
				HTML5_email_regexp = new RegExp('^' + '[' + rfc5322_atext + '\\.]+' + '@' + '[' + rfc1034_ldh_str + ']+' + '(?:\\.[' + rfc1034_ldh_str + ']+)*' + '$', 'i');
				return (null !== mailtxt.match(HTML5_email_regexp));
			},
			isIPv4Address: function(address, allowBlock) {
				if (typeof address !== 'string') {
					return false;
				}
				var block = allowBlock ? '(?:\\/(?:3[0-2]|[12]?\\d))?' : '',
					RE_IP_BYTE = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|0?[0-9]?[0-9])',
					RE_IP_ADD = '(?:' + RE_IP_BYTE + '\\.){3}' + RE_IP_BYTE;
				return address.search(new RegExp('^' + RE_IP_ADD + block + '$')) !== -1;
			},
			isIPv6Address: function(address, allowBlock) {
				if (typeof address !== 'string') {
					return false;
				}
				var block = allowBlock ? '(?:\\/(?:12[0-8]|1[01][0-9]|[1-9]?\\d))?' : '',
					RE_IPV6_ADD = '(?:' + ':(?::|(?::' + '[0-9A-Fa-f]{1,4}' + '){1,7})' + '|' + '[0-9A-Fa-f]{1,4}' + '(?::' + '[0-9A-Fa-f]{1,4}' + '){0,6}::' + '|' + '[0-9A-Fa-f]{1,4}' + '(?::' + '[0-9A-Fa-f]{1,4}' + '){7}' + ')';
				if (address.search(new RegExp('^' + RE_IPV6_ADD + block + '$')) !== -1) {
					return true;
				}
				RE_IPV6_ADD = '[0-9A-Fa-f]{1,4}' + '(?:::?' + '[0-9A-Fa-f]{1,4}' + '){1,6}';
				return address.search(new RegExp('^' + RE_IPV6_ADD + block + '$')) !== -1 && address.search(/::/) !== -1 && address.search(/::.*::/) === -1;
			}
		};
		mw.util = util;
	})(jQuery, mediaWiki);;
}, {}, {
	"showtoc": "[showtoc]",
	"hidetoc": "[hidetoc]"
});
mw.loader.implement("mw.AkamaiMediaAnalytics", function($) {
	(function(mw, $) {
		"use strict";
		mw.AkamaiMediaAnalytics = function(embedPlayer, callback) {
			return this.init(embedPlayer, callback);
		}
		mw.AkamaiMediaAnalytics.prototype = {
			bindPostFix: '.akamaiMediaAnalytics',
			defaultConfigPath: 'http://ma193-r.analytics.edgesuite.net/config/beacon-3431.xml?beaconSentNotify=1',
			defaultConfigPathHTTPS: 'https://ma193-r.analytics.edgekey.net/config/beacon-3898.xml?beaconSentNotify=1',
			defaultJS: 'http://79423.analytics.edgesuite.net/html5/akamaihtml5-min.js',
			defaultJSHTTPS: 'https://79423.analytics.edgekey.net/html5/akamaihtml5-min.js',
			init: function(embedPlayer, callback) {
				var _this = this;
				this.embedPlayer = embedPlayer;
				this.embedPlayer.unbindHelper(_this.bindPostFix);
				var configPath = this.getConfigPath();
				window.AKAMAI_MEDIA_ANALYTICS_CONFIG_FILE_PATH = configPath;
				if (mw.getConfig('EmbedPlayer.IsFriendlyIframe')) {
					try {
						window.parent.AKAMAI_MEDIA_ANALYTICS_CONFIG_FILE_PATH = configPath;
					} catch (e) {}
				}
				if (typeof setAkamaiMediaAnalyticsData == 'function') {
					_this.setData(embedPlayer);
					callback();
				} else {
					var jsSrc = _this.defaultJS;
					if (this.isHttps()) {
						jsSrc = _this.defaultJSHTTPS;
					}
					kWidget.appendScriptUrl(jsSrc, function() {
						_this.setData(embedPlayer);
						callback();
					}, window.document);
				}
			},
			setData: function(embedPlayer) {
				var _this = this;
				var flavorSrc = embedPlayer.getSource();
				var flavorURL = '';
				if (flavorSrc) {
					flavorURL = flavorSrc.src;
				}
				var startIndex = flavorURL.indexOf('/flavorId/') + 10;
				var flavorId = flavorURL.substr(startIndex, flavorURL.indexOf('/format/') - startIndex);
				this.sendAkamaiData('publisherId', embedPlayer.kpartnerid);
				this.sendAkamaiData('title', this.getConfig('title') || embedPlayer.kentryid);
				this.sendAkamaiData('playerId', this.getConfig('playerId') || embedPlayer.kuiconfid);
				this.sendAkamaiData('flavorId', flavorId);
				this.sendAkamaiData('playerVersion', MWEMBED_VERSION);
				this.sendAkamaiData('category', this.getConfig('category') || this.getMediaTypeName());
				this.sendAkamaiData('contentLength', embedPlayer.evaluate('{mediaProxy.entry.msDuration}'));
				this.sendAkamaiData('device', navigator.platform);
				this.setDataIfExsits('subCategory');
				this.setDataIfExsits('eventName');
				var setPlayerLoadTime = function() {
					_this.sendAkamaiData('playerLoadtime', embedPlayer.evaluate('{playerStatusProxy.loadTime}'));
				};
				if (embedPlayer.evaluate('{playerStatusProxy.loadTime}')) {
					setPlayerLoadTime();
				} else {
					embedPlayer.bindHelper('playerReady', function() {
						setTimeout(function() {
							setPlayerLoadTime();
						}, 0);
					});
				}
			},
			sendAkamaiData: function(eventId, data) {
				setAkamaiMediaAnalyticsData(eventId, data);
				if (this.getConfig('trackEventMonitor')) {
					try {
						window.parent[this.getConfig('trackEventMonitor')](eventId, data);
					} catch (e) {}
				}
			},
			getConfigPath: function() {
				var configPath = null;
				if (this.getConfig('configPath')) {
					configPath = this.getConfig('configPath');
				}
				if (this.isHttps()) {
					if (configPath && (configPath.indexOf('https') != -1)) {
						return configPath;
					}
					return this.defaultConfigPathHTTPS;
				}
				if (configPath) {
					return configPath;
				}
				return this.defaultConfigPath;
			},
			getConfig: function(attr) {
				return this.embedPlayer.getKalturaConfig('akamaiMediaAnalytics', attr);
			},
			setDataIfExsits: function(attr) {
				var attrVal = this.getConfig(attr);
				if (attrVal !== null) this.sendAkamaiData(attr, attrVal);
			},
			getMediaTypeName: function() {
				switch (this.embedPlayer.evaluate('{mediaProxy.entry.mediaType}')) {
					case 2:
						return 'Image';
						break;
					case 5:
						return 'Audio';
						break;
					case 201:
						return 'Live_Stream_Flash';
						break;
					case 202:
						return 'Live_Stream_Windows_Media';
						break;
					case 203:
						return 'Live_Stream_Real_Media';
						break;
					case 204:
						return 'Live_Stream_Quicktime';
						break;
				}
				return 'Video';
			},
			isHttps: function() {
				return (document.location.protocol == 'https:');
			}
		};
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("mw.EmbedPlayer", function($) {
	(function(mw, $) {
		"use strict";
		mw.processEmbedPlayers = function(playerSelect, callback) {
			mw.log('processEmbedPlayers:: playerSelector: ' + playerSelect);
			var playerIdList = [];
			var areSelectedPlayersReady = function() {
				var playersLoaded = true;
				$.each(playerIdList, function(inx, playerId) {
					if (!$('#' + playerId)[0].playerReadyFlag) {
						playersLoaded = false;
						return false;
					}
				})
				if (playersLoaded) {
					if (callback) {
						callback();
					}
				}
			}
			var addPlayerElement = function(playerElement) {
				var _this = this;
				mw.log('EmbedPlayer:: addElement:: ' + playerElement.id);
				if (playerElement.pause) {
					playerElement.pause();
				}
				$(mw).trigger('EmbedPlayerWaitForMetaCheck', playerElement);
				var waitForMeta = false;
				if (playerElement.waitForMeta !== false) {
					waitForMeta = waitForMetaCheck(playerElement);
				}
				var ranPlayerSwapFlag = false;
				var runPlayerSwap = function() {
					if (ranPlayerSwapFlag) {
						return;
					}
					ranPlayerSwapFlag = true;
					mw.log("processEmbedPlayers::runPlayerSwap::" + $(playerElement).attr('id'));
					var playerInterface = new mw.EmbedPlayer(playerElement);
					var inDomPlayer = swapEmbedPlayerElement(playerElement, playerInterface);
					mw.log("processEmbedPlayers::trigger:: EmbedPlayerNewPlayer " + inDomPlayer.id);
					$(mw).trigger('EmbedPlayerNewPlayer', inDomPlayer);
					$(mw).trigger('newEmbedPlayerEvent', inDomPlayer);
					if ($(mw).data('events') && $(mw).data('events')['newEmbedPlayerEvent']) {
						mw.log("processEmbedPlayers:: Warning, newEmbedPlayerEvent is deprecated, please use EmbedPlayerNewPlayer");
						$(mw).trigger('newEmbedPlayerEvent', inDomPlayer);
					}
					$(inDomPlayer).bind('playerReady', areSelectedPlayersReady);
					mw.log("EmbedPlayer::addPlayerElement :trigger startPlayerBuildOut:" + inDomPlayer.id);
					$('#' + inDomPlayer.id).triggerQueueCallback('startPlayerBuildOut', function() {
						inDomPlayer.checkPlayerSources();
					});
				};
				if (waitForMeta && mw.getConfig('EmbedPlayer.WaitForMeta')) {
					mw.log('processEmbedPlayers::WaitForMeta ( video missing height (' + $(playerElement).attr('height') + '), width (' + $(playerElement).attr('width') + ') or duration: ' + $(playerElement).attr('duration'));
					$(playerElement).bind("loadedmetadata", runPlayerSwap);
					setTimeout(runPlayerSwap, 5000);
					return;
				} else {
					runPlayerSwap();
					return;
				}
			};
			var waitForMetaCheck = function(playerElement) {
				var waitForMeta = false;
				if (!playerElement) {
					return false;
				}
				if (!playerElement.tagName || (playerElement.tagName.toLowerCase() != 'audio' && playerElement.tagName.toLowerCase() != 'video')) {
					return false;
				}
				if (!mw.EmbedTypes.getMediaPlayers().isSupportedPlayer('oggNative') && !mw.EmbedTypes.getMediaPlayers().isSupportedPlayer('webmNative') && !mw.EmbedTypes.getMediaPlayers().isSupportedPlayer('h264Native') && !mw.EmbedTypes.getMediaPlayers().isSupportedPlayer('appleVdnPlayer')) {
					return false;
				}
				var width = $(playerElement).css('width');
				var height = $(playerElement).css('height');
				if ($(playerElement).css('width') == '300px' && $(playerElement).css('height') == '150px') {
					waitForMeta = true;
				} else {
					if ($(playerElement).attr('duration') || $(playerElement).attr('durationHint') || $(playerElement).attr('data-durationhint')) {
						return false;
					} else {
						waitForMeta = true;
					}
				}
				if ($(playerElement).attr('width') == -1 || $(playerElement).attr('height') == -1) {
					waitForMeta = true;
				}
				if ($(playerElement).attr('width') === 0 || $(playerElement).attr('height') === 0) {
					waitForMeta = true;
				}
				if (playerElement.height == 150 && playerElement.width == 300) {
					waitForMeta = true;
				}
				if (waitForMeta && ($(playerElement).attr('src') || $(playerElement).find("source[src]").length !== 0)) {
					return true;
				} else {
					return false;
				}
			};
			var swapEmbedPlayerElement = function(targetElement, playerInterface) {
				mw.log('processEmbedPlayers::swapEmbedPlayerElement: ' + targetElement.id);
				var swapPlayerElement = document.createElement('div');
				$(swapPlayerElement).addClass('mwEmbedPlayer');
				for (var method in playerInterface) {
					if (method != 'readyState') {
						swapPlayerElement[method] = playerInterface[method];
					}
				}
				if ($(targetElement).attr('width')) {
					$(swapPlayerElement).css('width', $(targetElement).attr('width'));
				}
				if ($(targetElement).attr('height')) {
					$(swapPlayerElement).css('height', $(targetElement).attr('height'));
				}
				swapPlayerElement.style.cssText += targetElement.style.cssText;
				swapPlayerElement.style.position = 'relative';
				var dataAttributes = mw.getConfig("EmbedPlayer.DataAttributes");
				if (dataAttributes) {
					$.each(dataAttributes, function(attrName, na) {
						if ($(targetElement).data(attrName)) {
							$(swapPlayerElement).data(attrName, $(targetElement).data(attrName));
						}
					});
				}
				if ((playerInterface.isPersistentNativePlayer() && !mw.getConfig('EmbedPlayer.DisableVideoTagSupport')) || (playerInterface.useNativePlayerControls() && (targetElement.nodeName == 'video' || targetElement.nodeName == 'audio'))) {
					$(targetElement).attr('id', playerInterface.pid).addClass('nativeEmbedPlayerPid').show().after($(swapPlayerElement).css('display', 'none'));
				} else {
					$(targetElement).replaceWith(swapPlayerElement);
				}
				if ($('#loadingSpinner_' + playerInterface.id).length == 0 && !$.browser.mozilla) {
					if (playerInterface.useNativePlayerControls() || playerInterface.isPersistentNativePlayer()) {
						var $spinner = $(targetElement).getAbsoluteOverlaySpinner();
					} else {
						var $spinner = $(swapPlayerElement).getAbsoluteOverlaySpinner();
					}
					$spinner.attr('id', 'loadingSpinner_' + playerInterface.id);
				}
				return swapPlayerElement;
			};
			$(playerSelect).each(function(index, playerElement) {
				playerIdList.push($(playerElement).attr("id"));
				if (playerElement.nodeName.toLowerCase() == 'div' && $(playerElement).attr('poster')) {
					var posterSrc = $(playerElement).attr('poster');
					var width = $(playerElement).width();
					var height = $(playerElement).height();
					if (!width) {
						var width = '100%';
					}
					if (!height) {
						var height = '100%';
					}
					mw.log('EmbedPlayer:: set loading background: ' + posterSrc);
					$(playerElement).append($('<img />').attr('src', posterSrc).css({
						'position': 'absolute',
						'width': width,
						'height': height
					}));
				}
			});
			var addedPlayersFlag = false;
			mw.log("processEmbedPlayers:: Do: " + $(playerSelect).length + ' players ');
			$(playerSelect).each(function(index, playerElement) {
				if ($(playerElement).hasClass('nativeEmbedPlayerPid')) {
					$('#loadingSpinner_' + $(playerElement).attr('id')).remove();
					mw.log('processEmbedPlayers::$.embedPlayer skip embedPlayer gennerated video: ' + playerElement);
				} else {
					addedPlayersFlag = true;
					addPlayerElement(playerElement);
				}
			});
			if (!addedPlayersFlag) {
				if (callback) {
					callback();
				}
			}
		};
	})(window.mw, jQuery);
	(function(mw, $) {
		"use strict";
		mw.mergeConfig('EmbedPlayer.Attributes', {
			"id": null,
			"width": null,
			"height": null,
			"src": null,
			"poster": null,
			"autoplay": false,
			"loop": false,
			"controls": true,
			"paused": true,
			"readyState": 0,
			"networkState": 0,
			"currentTime": 0,
			"previousTime": 0,
			"previousVolume": 1,
			"volume": 0.75,
			"preMuteVolume": 0.75,
			"duration": null,
			'data-durationhint': null,
			'durationHint': null,
			"muted": false,
			'videoAspect': '4:3',
			"start": 0,
			"end": null,
			"overlaycontrols": true,
			"usenativecontrols": false,
			'attributionbutton': true,
			'playerError': {},
			'data-blockPlayerDisplay': null,
			"startOffset": 0,
			"downloadLink": true,
			"type": null,
			"adsOnReplay": false,
			"live": false,
			"isAudioPlayer": false
		});
		mw.mergeConfig('EmbedPlayer.SourceAttributes', ['id', 'src', 'title', 'label', 'URLTimeEncoding', 'startOffset', 'start', 'end', 'default', 'title', 'titleKey']);
		mw.EmbedPlayer = function(element) {
			return this.init(element);
		};
		mw.EmbedPlayer.prototype = {
			'mediaElement': null,
			'supports': {},
			'playerReadyFlag': false,
			'loadError': false,
			'thumbnailUpdatingFlag': false,
			'stopped': true,
			'cmmlData': null,
			'serverSeekTime': 0,
			'seeking': false,
			'bufferedPercent': 0,
			'monitorTimerId': null,
			'bufferStartFlag': false,
			'bufferEndFlag': false,
			'pauseTime': null,
			'donePlayingCount': 0,
			'_propagateEvents': true,
			'onDoneInterfaceFlag': true,
			'_checkHideSpinner': false,
			'_playContorls': true,
			'displayPlayer': true,
			'widgetLoaded': false,
			init: function(element) {
				var _this = this;
				mw.log('EmbedPlayer: initEmbedPlayer: ' + $(element).width() + 'x' + $(element).height());
				var playerAttributes = mw.getConfig('EmbedPlayer.Attributes');
				this.rewriteElementTagName = element.tagName.toLowerCase();
				for (var attr in playerAttributes) {
					if (element.getAttribute(attr) != null) {
						if (element.getAttribute(attr) == '') {
							this[attr] = true;
						} else {
							this[attr] = element.getAttribute(attr);
						}
					} else {
						this[attr] = playerAttributes[attr];
					}
					if (this[attr] == "false") this[attr] = false;
					if (this[attr] == "true") this[attr] = true;
				}
				if (!this.width) {
					this.width = $(element).width()
					$(element).attr('width', this.width)
				}
				if (!this.height) {
					this.height = $(element).height()
					$(element).attr('height', this.height)
				}
				if (this.useNativePlayerControls()) {
					_this.controls = true;
				}
				var sn = $(element).attr('class');
				if (sn && sn != '') {
					var skinList = mw.getConfig('EmbedPlayer.SkinList');
					for (var n = 0; n < skinList.length; n++) {
						if (sn.indexOf(skinList[n].toLowerCase()) !== -1) {
							this.skinName = skinList[n];
						}
					}
				}
				if (!this.skinName) {
					this.skinName = mw.getConfig('EmbedPlayer.DefaultSkin');
				}
				if (!this.monitorRate) {
					this.monitorRate = mw.getConfig('EmbedPlayer.MonitorRate');
				}
				if (this.startOffset && this.startOffset.split(':').length >= 2) {
					this.startOffset = parseFloat(mw.npt2seconds(this.startOffset));
				}
				this.startOffset = parseFloat(this.startOffset);
				if (element.duration) {
					_this.duration = element.duration;
				}
				if (_this['data-durationhint']) {
					_this.durationHint = _this['data-durationhint'];
				}
				if (_this.durationHint && !_this.duration) {
					_this.duration = mw.npt2seconds(_this.durationHint);
				}
				this.duration = parseFloat(this.duration);
				mw.log('EmbedPlayer::init:' + this.id + " duration is: " + this.duration);
				this.pid = 'pid_' + this.id;
				this.mediaElement = new mw.MediaElement(element);
			},
			bindHelper: function(name, callback) {
				$(this).bind(name, callback);
				return this;
			},
			unbindHelper: function(bindName) {
				if (bindName) {
					$(this).unbind(bindName);
				}
				return this;
			},
			triggerQueueCallback: function(name, callback) {
				$(this).triggerQueueCallback(name, callback);
			},
			triggerHelper: function(name, obj) {
				try {
					$(this).trigger(name, obj);
				} catch (e) {}
			},
			stopEventPropagation: function() {
				mw.log("EmbedPlayer:: stopEventPropagation");
				this.stopMonitor();
				this._propagateEvents = false;
			},
			restoreEventPropagation: function() {
				mw.log("EmbedPlayer:: restoreEventPropagation");
				this._propagateEvents = true;
				this.startMonitor();
			},
			enablePlayControls: function() {
				mw.log("EmbedPlayer:: enablePlayControls");
				if (this.useNativePlayerControls()) {
					return;
				}
				this._playContorls = true;
				this.getInterface().find('.play-btn').buttonHover().css('cursor', 'pointer');
				this.controlBuilder.addPlayerTouchBindings();
				this.controlBuilder.enableSeekBar();
				$(this).trigger('onEnableInterfaceComponents');
			},
			disablePlayControls: function(excludingComponents) {
				mw.log("EmbedPlayer:: disablePlayControls");
				if (this.useNativePlayerControls()) {
					return;
				}
				this._playContorls = false;
				this.getInterface().find('.play-btn').unbind('mouseenter mouseleave').css('cursor', 'default');
				this.controlBuilder.removePlayerTouchBindings();
				this.controlBuilder.disableSeekBar();
				$(this).trigger('onDisableInterfaceComponents', [excludingComponents]);
			},
			updateFeatureSupport: function() {
				mw.log("EmbedPlayer::updateFeatureSupport trigger: updateFeatureSupportEvent");
				$(this).trigger('updateFeatureSupportEvent', this.supports);
				return;
			},
			applyIntrinsicAspect: function() {
				var $this = $(this);
				if (this.getInterface().find('.playerPoster').length) {
					var img = this.getInterface().find('.playerPoster')[0];
					var pHeight = this.getVideoHolder().height();
					if (img.naturalWidth && img.naturalHeight) {
						var pWidth = parseInt(img.naturalWidth / img.naturalHeight * pHeight);
						if (pWidth > $this.width()) {
							pWidth = $this.width();
							pHeight = parseInt(img.naturalHeight / img.naturalWidth * pWidth);
						}
						var $parent = $(img).parent();
						$(img).hide().clone().css({
							'height': pHeight + 'px',
							'width': pWidth + 'px',
							'left': (($this.width() - pWidth) * .5) + 'px',
							'top': (($this.height() - pHeight) * .5) + 'px',
							'position': 'absolute'
						}).appendTo($parent).show();
						$(img).remove();
					}
				}
			},
			loadPlayerSize: function(element) {
				this.height = element.height > 0 ? element.height + '' : $(element).css('height');
				this.width = element.width > 0 ? element.width + '' : $(element).css('width');
				if (this.height == '32px' || this.height == '32px') {
					this.width = '100%';
					this.height = '100%';
				}
				mw.log('EmbedPlayer::loadPlayerSize: css size:' + this.width + ' h: ' + this.height);
				if (this.height.indexOf('100%') != -1 || this.width.indexOf('100%') != -1) {
					var $relativeParent = $(element).parents().filter(function() {
						return $(this).is('body') || $(this).css('position') == 'relative';
					}).slice(0, 1);
					this.width = $relativeParent.width();
					this.height = $relativeParent.height();
				}
				this.height = parseInt(this.height);
				this.width = parseInt(this.width);
				this.height = (this.height == 0 || isNaN(this.height) && $(element).attr('height')) ? parseInt($(element).attr('height')) : this.height;
				this.width = (this.width == 0 || isNaN(this.width) && $(element).attr('width')) ? parseInt($(element).attr('width')) : this.width;
				if (this.isAudio() && this.height == '32') {
					this.height = 20;
				}
				if (this.isAudio() && this.videoAspect) {
					var aspect = this.videoAspect.split(':');
					if (this.height && !this.width) {
						this.width = parseInt(this.height * (aspect[0] / aspect[1]));
					}
					if (this.width && !this.height) {
						var apectRatio = (aspect[1] / aspect[0]);
						this.height = parseInt(this.width * (aspect[1] / aspect[0]));
					}
				}
				if ((isNaN(this.height) || isNaN(this.width)) || (this.height == -1 || this.width == -1) || ((this.height == 150 || this.height == 64) && this.width == 300)) {
					var defaultSize = mw.getConfig('EmbedPlayer.DefaultSize').split('x');
					if (isNaN(this.width)) {
						this.width = defaultSize[0];
					}
					if (this.isAudio()) {
						this.height = 20;
					} else {
						this.height = defaultSize[1];
					}
				}
			},
			getPlayerWidth: function() {
				if ($.browser.mozilla && parseFloat($.browser.version) < 2) {
					return ($(this).parent().parent().width());
				}
				if (mw.getConfig('EmbedPlayer.IsIframeServer')) {
					return $(window).width();
				}
				return this.getVideoHolder().width();
			},
			getPlayerHeight: function() {
				return this.getVideoHolder().height();
			},
			checkPlayerSources: function() {
				mw.log('EmbedPlayer::checkPlayerSources: ' + this.id);
				var _this = this;
				$(_this).trigger('preCheckPlayerSources');
				$(_this).triggerQueueCallback('checkPlayerSourcesEvent', function() {
					_this.setupSourcePlayer();
				});
			},
			getTextTracks: function() {
				if (!this.mediaElement) {
					return [];
				}
				return this.mediaElement.getTextTracks();
			},
			emptySources: function() {
				if (this.mediaElement) {
					this.mediaElement.sources = [];
					this.mediaElement.selectedSource = null;
				}
				this.prevPlayer = this.selectedPlayer;
			},
			switchPlaySource: function(source, switchCallback, doneCallback) {
				var _this = this;
				var targetPlayer = mw.EmbedTypes.getMediaPlayers().defaultPlayer(source.mimeType);
				if (targetPlayer.library != this.selectedPlayer.library) {
					this.selectedPlayer = targetPlayer;
					this.updatePlaybackInterface(function() {
						_this.playerSwitchSource(source, switchCallback, doneCallback);
					});
				} else {
					_this.playerSwitchSource(source, switchCallback, doneCallback);
				}
			},
			playerSwitchSource: function(source, switchCallback, doneCallback) {
				mw.log("Error player interface must support actual source switch");
			},
			setupSourcePlayer: function() {
				var _this = this;
				mw.log("EmbedPlayer::setupSourcePlayer: " + this.id + ' sources: ' + this.mediaElement.sources.length);
				if (mw.getConfig('EmbedPlayer.ReplaceSources')) {
					this.emptySources();
					$.each(mw.getConfig('EmbedPlayer.ReplaceSources'), function(inx, source) {
						_this.mediaElement.tryAddSource(source);
					});
				}
				this.mediaElement.autoSelectSource();
				if (this.mediaElement.selectedSource) {
					this.selectedPlayer = mw.EmbedTypes.getMediaPlayers().defaultPlayer(this.mediaElement.selectedSource.mimeType);
					if (this.selectedPlayer && (!this.prevPlayer || this.prevPlayer.library != this.selectedPlayer.library)) {
						this.updatePlaybackInterface();
						return;
					}
				}
				if (!this.selectedPlayer || !this.mediaElement.selectedSource) {
					this.showPlayerError();
					mw.log("EmbedPlayer:: setupSourcePlayer > player ready ( but with errors ) ");
				} else {
					$(this).trigger('layoutReady');
					this.getInterface().find('.control-bar').show();
					this.addLargePlayBtn();
				}
				this.playerReadyFlag = true;
				$(this).trigger('playerReady');
				this.triggerWidgetLoaded();
			},
			updatePlaybackInterface: function(callback) {
				var _this = this;
				mw.log("EmbedPlayer::updatePlaybackInterface: duration is: " + this.getDuration() + ' playerId: ' + this.id);
				if (this.instanceOf) {
					$(this).data('previousInstanceOf', this.instanceOf);
					var tmpObj = mw['EmbedPlayer' + this.instanceOf];
					var attributes = mw.getConfig('EmbedPlayer.Attributes');
					for (var i in tmpObj) {
						if (i in attributes) {
							continue;
						}
						if (typeof this['parent_' + i] != 'undefined') {
							this[i] = this['parent_' + i];
						} else {
							this[i] = null;
						}
					}
				}
				this.selectedPlayer.load(function() {
					mw.log('EmbedPlayer::updatePlaybackInterface: loaded ' + _this.selectedPlayer.library + ' duration: ' + _this.getDuration());
					_this.updateLoadedPlayerInterface(callback);
				});
			},
			updateLoadedPlayerInterface: function(callback) {
				var _this = this;
				mw.log('EmbedPlayer::updateLoadedPlayerInterface ' + _this.selectedPlayer.library + " player loaded for: " + _this.id);
				var playerInterface = mw['EmbedPlayer' + _this.selectedPlayer.library];
				if (playerInterface.init) {
					playerInterface.init();
				}
				for (var method in playerInterface) {
					if (typeof _this[method] != 'undefined' && !_this['parent_' + method]) {
						_this['parent_' + method] = _this[method];
					}
					_this[method] = playerInterface[method];
				}
				_this.updateFeatureSupport();
				_this.embedPlayerHTML();
				_this.getDuration();
				_this.showPlayer();
				if ($.isFunction(callback)) {
					callback();
				}
			},
			selectPlayer: function(player) {
				mw.log("EmbedPlayer:: selectPlayer " + player.id);
				var _this = this;
				if (this.selectedPlayer.id != player.id) {
					this.selectedPlayer = player;
					this.updatePlaybackInterface(function() {
						_this.getInterface().find('.track').remove();
						if (!_this.useNativePlayerControls() && _this.controls && _this.controlBuilder.isOverlayControls()) {
							_this.controlBuilder.showControlBar();
							_this.getInterface().hoverIntent({
								'sensitivity': 4,
								'timeout': 2000,
								'over': function() {
									_this.controlBuilder.showControlBar();
								},
								'out': function() {
									_this.controlBuilder.hideControlBar();
								}
							});
						}
					});
				}
			},
			getTimeRange: function() {
				var endTime = (this.controlBuilder && this.controlBuilder.longTimeDisp && !this.isLive()) ? '/' + mw.seconds2npt(this.getDuration()) : '';
				var defaultTimeRange = '0:00' + endTime;
				if (!this.mediaElement) {
					return defaultTimeRange;
				}
				if (!this.mediaElement.selectedSource) {
					return defaultTimeRange;
				}
				if (!this.mediaElement.selectedSource.endNpt) {
					return defaultTimeRange;
				}
				return this.mediaElement.selectedSource.startNpt + this.mediaElement.selectedSource.endNpt;
			},
			getDuration: function() {
				if (isNaN(this.duration) && this.mediaElement && this.mediaElement.selectedSource && typeof this.mediaElement.selectedSource.durationHint != 'undefined') {
					this.duration = this.mediaElement.selectedSource.durationHint;
				}
				return this.duration;
			},
			getHeight: function() {
				return this.getInterface().height();
			},
			getWidth: function() {
				return this.getInterface().width();
			},
			isAudio: function() {
				return (this.rewriteElementTagName == 'audio' || (this.mediaElement && this.mediaElement.selectedSource && this.mediaElement.selectedSource.mimeType.indexOf('audio/') !== -1) || this.isAudioPlayer);
			},
			embedPlayerHTML: function() {
				return 'Error: function embedPlayerHTML should be implemented by embed player interface ';
			},
			seek: function(percent, stopAfterSeek) {
				var _this = this;
				this.seeking = true;
				$(this).trigger('preSeek', percent);
				if (percent < 0) {
					percent = 0;
				}
				if (percent > 1) {
					percent = 1;
				}
				this.updatePlayHead(percent);
				if (this.supportsURLTimeEncoding()) {
					mw.log('EmbedPlayer::seek:: updated serverSeekTime: ' + mw.seconds2npt(this.serverSeekTime) + ' currentTime: ' + _this.currentTime);
					if (_this.currentTime == _this.serverSeekTime) {
						return;
					}
					this.stop();
					this.didSeekJump = true;
					this.serverSeekTime = mw.npt2seconds(this.startNpt) + parseFloat(percent * this.getDuration());
				}
				this.controlBuilder.onSeek();
			},
			setCurrentTime: function(time, callback) {
				mw.log('Error: EmbedPlayer, setCurrentTime not overriden');
				if ($.isFunction(callback)) {
					callback();
				}
			},
			setDuration: function(newDuration) {
				this.duration = newDuration;
				if (this.controlBuilder) {
					this.updatePlayheadStatus();
				}
			},
			triggeredEndDone: false,
			postSequenceFlag: false,
			onClipDone: function() {
				var _this = this;
				if (!_this._propagateEvents) {
					return;
				}
				mw.log('EmbedPlayer::onClipDone: propagate:' + _this._propagateEvents + ' id:' + this.id + ' doneCount:' + this.donePlayingCount + ' stop state:' + this.isStopped());
				if (!this.isStopped()) {
					this.stopped = true;
					this.controlBuilder.showControlBar();
					if (!this.onDoneInterfaceFlag) {
						this.stopEventPropagation();
					}
					mw.log("EmbedPlayer:: trigger: ended ( inteface continue pre-check: " + this.onDoneInterfaceFlag + ' )');
					$(this).trigger('ended');
					mw.log("EmbedPlayer::onClipDone:Trigged ended, continue? " + this.onDoneInterfaceFlag);
					if (!this.onDoneInterfaceFlag) {
						this.restoreEventPropagation();
						return;
					}
					if (this.onDoneInterfaceFlag) {
						mw.log("EmbedPlayer:: trigger: playbackComplete");
						$(this).trigger('playbackComplete');
						mw.log("EmbedPlayer:: trigger: postEnded");
						$(this).trigger('postEnded');
					}
					if (this.onDoneInterfaceFlag) {
						mw.log("EmbedPlayer::onDoneInterfaceFlag=true do interface done");
						this.stopEventPropagation();
						_this.donePlayingCount++;
						var startTime = 0.01;
						if (this.startOffset) {
							startTime = this.startOffset;
						}
						this.setCurrentTime(startTime, function() {
							_this.stop();
							mw.log("EmbedPlayer::onClipDone:Restore events after we rewind the player");
							_this.restoreEventPropagation();
							if (_this.loop) {
								_this.stopped = false;
								_this.play();
								return;
							} else {
								_this.pause();
							}
							if (mw.getConfig('EmbedPlayer.ForceLargeReplayButton') === true) {
								_this.addLargePlayBtn();
							} else {
								if ($(_this).data('hideEndPlayButton') || !_this.useLargePlayBtn()) {
									_this.hideLargePlayBtn();
								} else {
									_this.addLargePlayBtn();
								}
							}
							mw.log("EmbedPlayer:: trigger: onEndedDone");
							if (!_this.triggeredEndDone) {
								_this.triggeredEndDone = true;
								$(_this).trigger('onEndedDone');
							}
						})
					}
				}
			},
			showThumbnail: function() {
				var _this = this;
				mw.log('EmbedPlayer::showThumbnail::' + this.stopped);
				this.controlBuilder.closeMenuOverlay();
				this.updatePosterHTML();
				this.paused = true;
				this.stopped = true;
				this.controlBuilder.addControlBindings();
				if (!this.useNativePlayerControls()) {
					mw.log("mediaLoaded");
					$(this).trigger('mediaLoaded');
				}
			},
			showPlayer: function() {
				mw.log('EmbedPlayer:: showPlayer: ' + this.id + ' interace: w:' + this.width + ' h:' + this.height);
				var _this = this;
				this.hideSpinnerAndPlayBtn();
				if (!this.useNativePlayerControls() && this.isPersistentNativePlayer()) {
					$(this).show();
				}
				if (this.controls) {
					if (this.useNativePlayerControls()) {
						if (this.getPlayerElement()) {
							$(this.getPlayerElement()).attr('controls', "true");
						}
					} else {
						this.controlBuilder.addControls();
					}
				}
				this.updatePosterHTML();
				this.updateTemporalUrl();
				if (this.displayPlayer === false) {
					_this.getVideoHolder().hide();
					_this.getInterface().height(_this.getComponentsHeight());
				}
				this.doUpdateLayout();
				this.addLargePlayBtn();
				this.playerReadyFlag = true;
				mw.log("EmbedPlayer:: Trigger: playerReady");
				$(this).trigger('playerReady');
				this.triggerWidgetLoaded();
				if (this['data-blockPlayerDisplay']) {
					this.blockPlayerDisplay();
					return;
				}
				if (this.getError()) {
					this.showErrorMsg(this.getError());
					return;
				}
				if (this.isStopped() && this.autoplay && this.canAutoPlay()) {
					mw.log('EmbedPlayer::showPlayer::Do autoPlay');
					_this.play();
				}
			},
			canAutoPlay: function() {
				return false;
			},
			getComponentsHeight: function() {
				var height = 0;
				this.getInterface().find('.block').each(function() {
					height += $(this).outerHeight(true);
				});
				return height
			},
			doUpdateLayout: function(skipTrigger) {
				var containerHeight = this.getInterface().height();
				var newHeight = containerHeight - this.getComponentsHeight();
				var currentHeight = this.getVideoHolder().height();
				var deltaHeight = Math.abs(currentHeight - newHeight);
				mw.log('EmbedPlayer: doUpdateLayout:: containerHeight: ' + containerHeight + ', components: ' + this.getComponentsHeight() + ', videoHolder old height: ' + currentHeight + ', new height: ' + newHeight + ' hight delta: ' + deltaHeight);
				if (currentHeight !== newHeight && deltaHeight > 1) {
					this.getVideoHolder().height(newHeight);
				}
				if (this.isStopped() && !(this.sequenceProxy && this.sequenceProxy.isInSequence)) {
					this.updatePosterHTML();
				}
				if (!skipTrigger && deltaHeight != 1) {
					mw.log('EmbedPlayer: updateLayout: trigger "updateLayout" ');
					this.triggerHelper('updateLayout');
				}
			},
			getInterface: function() {
				if (!this.$interface) {
					var _this = this;
					this.controlBuilder = new mw.PlayerControlBuilder(this);
					if ($(this).parent('.videoHolder').length == 0) {
						$(this).wrap($('<div />').addClass('videoHolder'));
					}
					var $videoHolder = $(this).parent('.videoHolder');
					if ($videoHolder.parent('.mwPlayerContainer').length == 0) {
						this.$interface = $videoHolder.wrap($('<div />').addClass('mwPlayerContainer')).parent()
						if (this.style.cssText) {
							this.$interface[0].style.cssText += this.style.cssText;
						}
					} else {
						this.$interface = $videoHolder.parent('.mwPlayerContainer')
					}
					this.$interface.addClass(this.controlBuilder.playerClass)
					this.style.cssText = '';
					if (mw.getConfig('EmbedPlayer.IsIframeServer')) {
						$(window).off("debouncedresize").on("debouncedresize", function() {
							mw.log('debouncedresize:: call doUpdateLayout');
							_this.doUpdateLayout();
						});
					}
				}
				return this.$interface;
			},
			updateInterfaceSize: function(size) {
				var oldH = this.getInterface().height();
				var oldW = this.getInterface().width();
				if (size.width != oldW || size.height != oldH) {
					this.getInterface().css(size);
					this.doUpdateLayout(true);
				}
			},
			updateTemporalUrl: function() {
				var sourceHash = /[^\#]+$/.exec(this.getSrc()).toString();
				if (sourceHash.indexOf('t=') === 0) {
					var times = sourceHash.substr(2).split(',');
					if (times[0]) {
						this.currentTime = mw.npt2seconds(times[0].toString());
					}
					if (times[1]) {
						this.pauseTime = mw.npt2seconds(times[1].toString());
						if (this.pauseTime < this.currentTime) {
							this.pauseTime = null;
						}
					}
					this.updatePlayHead(this.currentTime / this.duration);
					this.controlBuilder.setStatus(mw.seconds2npt(this.currentTime));
				}
			},
			setError: function(errorObj) {
				var _this = this;
				if (typeof errorObj == 'string') {
					this.playerError = {
						'title': _this.getKalturaMsg('ks-GENERIC_ERROR_TITLE'),
						'message': errorObj
					}
					return;
				}
				this.playerError = errorObj;
			},
			getError: function() {
				if (!$.isEmptyObject(this.playerError)) {
					return this.playerError;
				}
				return null;
			},
			showErrorMsg: function(errorObj) {
				this.hideSpinnerAndPlayBtn();
				if (this.controlBuilder) {
					if (mw.getConfig("EmbedPlayer.ShowPlayerAlerts")) {
						var alertObj = $.extend(errorObj, {
							'isModal': true,
							'keepOverlay': true,
							'noButtons': true,
							'isError': true
						});
						this.controlBuilder.displayAlert(alertObj);
					}
				}
				return;
			},
			blockPlayerDisplay: function() {
				this.getInterface().find('.error').hide();
			},
			showPlayerError: function() {
				var _this = this;
				var $this = $(this);
				mw.log("EmbedPlayer::showPlayerError");
				this.hideSpinnerAndPlayBtn();
				$this.trigger('mediaLoadError');
				$this.trigger('mediaError');
				if (this['data-blockPlayerDisplay']) {
					this.blockPlayerDisplay();
					return;
				}
				if (this.getError()) {
					this.showErrorMsg(this.getError());
					return;
				}
				this.showNoInlinePlabackSupport();
			},
			showNoInlinePlabackSupport: function() {
				var _this = this;
				var $this = $(this);
				if (this.mediaElement.sources.length == 0 || !mw.getConfig('EmbedPlayer.NotPlayableDownloadLink')) {
					if (this.kentryid) {
						this.showNoPlayableSources();
					}
					return;
				}
				this.isLinkPlayer = true;
				this.updatePosterHTML();
				this.addLargePlayBtn();
				var downloadUrl = this.mediaElement.sources[0].getSrc();
				this.triggerHelper('directDownloadLink', function(dlUrl) {
					if (dlUrl) {
						downloadUrl = dlUrl;
					}
				});
				var $pBtn = this.getInterface().find('.play-btn-large').attr('title', gM('mwe-embedplayer-play_clip')).show().unbind('click').click(function() {
					_this.triggerHelper('firstPlay');
					_this.triggerHelper('playing');
					return true;
				});
				if (!$pBtn.parent('a').length) {
					$pBtn.wrap($('<a />').attr("target", "_blank"));
				}
				$pBtn.parent('a').attr("href", downloadUrl);
				$(this).trigger('showInlineDownloadLink');
			},
			showNoPlayableSources: function() {
				var $this = $(this);
				var errorObj = this.getKalturaMsgObject('mwe-embedplayer-missing-source');
				$this.trigger('NoSourcesCustomError', function(customErrorMsg) {
					if (customErrorMsg) {
						errorObj.message = customErrorMsg;
					}
				});
				this.setError(errorObj);
				this.showErrorMsg(errorObj);
				this.hideLargePlayBtn();
				return;
			},
			updateVideoTimeReq: function(timeRequest) {
				mw.log('EmbedPlayer::updateVideoTimeReq:' + timeRequest);
				var timeParts = timeRequest.split('/');
				this.updateVideoTime(timeParts[0], timeParts[1]);
			},
			updateVideoTime: function(startNpt, endNpt) {
				this.mediaElement.updateSourceTimes(startNpt, endNpt);
				var et = (this.controlBuilder.longTimeDisp && !this.isLive()) ? '/' + endNpt : '';
				this.controlBuilder.setStatus(startNpt + et);
				this.updatePlayHead(0);
				if (this.supportsURLTimeEncoding()) {
					this.serverSeekTime = 0;
				} else {
					this.serverSeekTime = mw.npt2seconds(startNpt);
				}
			},
			updateThumbTimeNPT: function(time) {
				this.updateThumbTime(mw.npt2seconds(time) - parseInt(this.startOffset));
			},
			updateThumbTime: function(floatSeconds) {
				var _this = this;
				if (typeof this.orgThumSrc == 'undefined') {
					this.orgThumSrc = this.poster;
				}
				if (this.orgThumSrc.indexOf('t=') !== -1) {
					this.lastThumbUrl = mw.replaceUrlParams(this.orgThumSrc, {
						't': mw.seconds2npt(floatSeconds + parseInt(this.startOffset))
					});
					if (!this.thumbnailUpdatingFlag) {
						this.updatePoster(this.lastThumbUrl, false);
						this.lastThumbUrl = null;
					}
				}
			},
			updateThumbPerc: function(percent) {
				return this.updateThumbTime((this.getDuration() * percent));
			},
			updatePosterSrc: function(posterSrc) {
				if (!posterSrc) {
					posterSrc = mw.getConfig('EmbedPlayer.BlackPixel');
				}
				this.poster = posterSrc;
				this.updatePosterHTML();
			},
			changeMedia: function(callback) {
				var _this = this;
				var $this = $(this);
				mw.log('EmbedPlayer:: changeMedia ');
				this.emptySources();
				$this.trigger('onChangeMedia');
				this.firstPlay = true;
				this.donePlayingCount = 0;
				this.triggeredEndDone = false;
				this.preSequenceFlag = false;
				this.postSequenceFlag = false;
				this.currentTime = 0;
				this.updatePlayHead(0);
				this.controlBuilder.setStatus(this.getTimeRange());
				this.pauseLoading();
				this.setError(null);
				this['data-blockPlayerDisplay'] = null
				$this.attr('data-blockPlayerDisplay', '');
				this.getInterface().find('.error').remove();
				this.controlBuilder.closeAlert();
				this.controlBuilder.closeMenuOverlay();
				this.getInterface().find('.control-bar').show();
				this.hideLargePlayBtn();
				var bindName = 'playerReady.changeMedia';
				$this.unbind(bindName).bind(bindName, function() {
					mw.log('EmbedPlayer::changeMedia playerReady callback');
					_this.hideSpinnerAndPlayBtn();
					if (_this.getError()) {
						_this.changeMediaStarted = false;
						if (_this.playlist) {
							_this.playlist.enablePrevNext();
							_this.playlist.addClipBindings();
							_this.controlBuilder.closeAlert();
						}
						_this.showErrorMsg(_this.getError());
						return;
					}
					if (_this.controlBuilder) {
						_this.controlBuilder.showControlBar();
					}
					if (_this.autoplay) {
						_this.hideLargePlayBtn();
					} else {
						_this.addLargePlayBtn();
					}
					var source = _this.getSource();
					if ((_this.isPersistentNativePlayer() || _this.useNativePlayerControls()) && source) {
						_this.switchPlaySource(source, function() {
							_this.changeMediaStarted = false;
							if (_this.autoplay) {
								_this.play();
							} else {
								_this.ignoreNextNativeEvent = true;
								_this.pause();
								_this.addLargePlayBtn();
								_this.updatePosterHTML();
							}
							$this.trigger('onChangeMediaDone');
							if (callback) {
								callback();
							}
						});
						return;
					}
					_this.changeMediaStarted = false;
					_this.stop();
					if (_this.autoplay) {
						_this.play();
					} else {
						_this.addLargePlayBtn();
					}
					$this.trigger('onChangeMediaDone');
					if (callback) {
						callback();
					}
				});
				$this.triggerQueueCallback('checkPlayerSourcesEvent', function() {
					mw.log("EmbedPlayer::changeMedia:  Done with checkPlayerSourcesEvent");
					_this.setupSourcePlayer();
				});
			},
			isImagePlayScreen: function() {
				return (this.useNativePlayerControls() && !this.isLinkPlayer && mw.isIphone() && mw.getConfig('EmbedPlayer.iPhoneShowHTMLPlayScreen'));
			},
			triggerWidgetLoaded: function() {
				if (!this.widgetLoaded) {
					this.widgetLoaded = true;
					mw.log("EmbedPlayer:: Trigger: widgetLoaded");
					this.triggerHelper('widgetLoaded');
				}
			},
			updatePosterHTML: function() {
				mw.log('EmbedPlayer:updatePosterHTML:' + this.id + ' poster:' + this.poster);
				var _this = this;
				if (this.isImagePlayScreen() || this.isAudio()) {
					this.addPlayScreenWithNativeOffScreen();
					return;
				}
				var posterCss = {
					'position': 'absolute'
				};
				var posterSrc = this.poster
				if (!posterSrc) {
					posterSrc = mw.getConfig('EmbedPlayer.BlackPixel');
					$.extend(posterCss, {
						'height': '100%',
						'width': '100%'
					});
				}
				$(this).empty();
				var called = false;
				var localApplyIntrinsicAspect = function() {
					if (called) {
						return;
					}
					called = true;
					_this.applyIntrinsicAspect();
				};
				$(this).html($('<img />').css(posterCss).attr({
					'src': this.poster
				}).addClass('playerPoster').load(function() {
						if (posterSrc != mw.getConfig('EmbedPlayer.BlackPixel')) {
							localApplyIntrinsicAspect();
						}
					}).each(function() {
						if (this.complete) {
							setTimeout(function() {
								localApplyIntrinsicAspect();
							}, 0)
						}
					})).show();
				if (this.useLargePlayBtn() && this.controlBuilder && this.height > this.controlBuilder.getComponentHeight('playButtonLarge')) {
					this.addLargePlayBtn();
				}
			},
			addPlayScreenWithNativeOffScreen: function() {
				mw.log("Error: EmbedPlayer, Must override 'addPlayScreenWithNativeOffScreen' with player inteface");
				return;
			},
			useLargePlayBtn: function() {
				if (this.isPersistantPlayBtn()) {
					return true;
				}
				return !this.useNativePlayerControls();
			},
			isPersistantPlayBtn: function() {
				return mw.isAndroid2() || (mw.isIphone() && mw.getConfig('EmbedPlayer.iPhoneShowHTMLPlayScreen'));
			},
			useNativePlayerControls: function() {
				if (this.usenativecontrols === true) {
					return true;
				}
				if (mw.getConfig('EmbedPlayer.NativeControls') === true) {
					return true;
				}
				if (mw.getConfig('EmbedPlayer.WebKitPlaysInline') === true && mw.isIphone()) {
					return false;
				}
				if (mw.isAndroid2() || mw.isIpod() || mw.isIphone()) {
					return true;
				}
				if (mw.isIpad()) {
					if (this.isPersistentNativePlayer() && mw.getConfig('EmbedPlayer.EnableIpadHTMLControls') === true) {
						return false;
					} else {
						return true;
					}
				}
				return false;
			},
			isPersistentNativePlayer: function() {
				if (this.isLinkPlayer) {
					return false;
				}
				if ($('#' + this.pid).length == 0) {
					return $('#' + this.id).hasClass('persistentNativePlayer');
				}
				return $('#' + this.pid).hasClass('persistentNativePlayer');
			},
			hideLargePlayBtn: function() {
				if (this.getInterface()) {
					this.getInterface().find('.play-btn-large').hide();
				}
			},
			addLargePlayBtn: function() {
				if (this.isPauseLoading) {
					mw.log("EmbedPlayer:: addLargePlayBtn ( skip play button, during load )");
					return;
				}
				if (this.useNativePlayerControls()) {
					this.getInterface().css('pointer-events', 'auto');
				}
				if (mw.getConfig('EmbedPlayer.WebKitPlaysInline') && mw.isIphone()) {
					return;
				}
				if (this.getInterface().find('.play-btn-large').length) {
					this.getInterface().find('.play-btn-large').show();
				} else {
					this.getVideoHolder().append(this.controlBuilder.getComponent('playButtonLarge'));
				}
			},
			getVideoHolder: function() {
				return this.getInterface().find('.videoHolder');
			},
			getNativePlayerHtml: function() {
				return $('<div />').css('width', this.getWidth()).html('Error: Trying to get native html5 player without native support for codec');
			},
			applyMediaElementBindings: function() {
				mw.log("Warning applyMediaElementBindings should be implemented by player interface");
				return;
			},
			getSharingEmbedCode: function() {
				switch (mw.getConfig('EmbedPlayer.ShareEmbedMode')) {
					case 'iframe':
						return this.getShareIframeObject();
						break;
					case 'videojs':
						return this.getShareEmbedVideoJs();
						break;
				}
			},
			getShareIframeObject: function() {
				var iframeUrl = this.getIframeSourceUrl();
				var embedCode = '&lt;iframe src=&quot;' + mw.html.escape(iframeUrl) + '&quot; ';
				embedCode += 'width=&quot;' + this.getPlayerWidth() + '&quot; ';
				embedCode += 'height=&quot;' + this.getPlayerHeight() + '&quot; ';
				embedCode += 'allowfullscreen webkitallowfullscreen mozAllowFullScreen ';
				embedCode += 'frameborder=&quot;0&quot; ';
				embedCode += '&gt;&lt/iframe&gt;';
				return embedCode;
			},
			getIframeSourceUrl: function() {
				var iframeUrl = false;
				this.triggerHelper('getShareIframeSrc', function(localIframeSrc) {
					if (iframeUrl) {
						mw.log("Error multiple modules binding getShareIframeSrc");
					}
					iframeUrl = localIframeSrc;
				});
				if (iframeUrl) {
					return iframeUrl;
				}
				var iframeUrl = mw.getMwEmbedPath() + 'mwEmbedFrame.php?';
				var params = {
					'src[]': []
				};
				for (var i = 0; i < this.mediaElement.sources.length; i++) {
					var source = this.mediaElement.sources[i];
					if (source.src) {
						params['src[]'].push(mw.absoluteUrl(source.src));
					}
				}
				if (this.poster) {
					params.poster = this.poster;
				}
				if (this.skinName) {
					params.skin = this.skinName;
				}
				if (this.duration) {
					params.durationHint = parseFloat(this.duration);
				}
				iframeUrl += $.param(params);
				return iframeUrl;
			},
			getShareEmbedVideoJs: function() {
				var embedtag = (this.isAudio()) ? 'audio' : 'video';
				var embedCode = '&lt;script type=&quot;text/javascript&quot; ' + 'src=&quot;' + mw.html.escape(mw.absoluteUrl(mw.getMwEmbedSrc())) + '&quot;&gt;&lt;/script&gt' + '&lt;' + embedtag + ' ';
				if (this.poster) {
					embedCode += 'poster=&quot;' + mw.html.escape(mw.absoluteUrl(this.poster)) + '&quot; ';
				}
				if (this.skinName) {
					embedCode += 'class=&quot;' + mw.html.escape(this.skinName) + '&quot; ';
				}
				if (this.duration) {
					embedCode += 'durationHint=&quot;' + parseFloat(this.duration) + '&quot; ';
				}
				if (this.width || this.height) {
					embedCode += 'style=&quot;';
					embedCode += (this.width) ? 'width:' + this.width + 'px;' : '';
					embedCode += (this.height) ? 'height:' + this.height + 'px;' : '';
					embedCode += '&quot; ';
				}
				embedCode += '&gt;';
				for (var i = 0; i < this.mediaElement.sources.length; i++) {
					var source = this.mediaElement.sources[i];
					if (source.src) {
						embedCode += '&lt;source src=&quot;' + mw.absoluteUrl(source.src) + '&quot; &gt;&lt;/source&gt;';
					}
				}
				embedCode += '&lt;/video&gt;';
				return embedCode;
			},
			firstPlay: true,
			preSequenceFlag: false,
			inPreSequence: false,
			replayEventCount: 0,
			play: function() {
				var _this = this;
				var $this = $(this);
				mw.log("EmbedPlayer:: play: " + this._propagateEvents + ' isStopped: ' + _this.isStopped());
				this.absoluteStartPlayTime = new Date().getTime();
				if (this.getError()) {
					return false;
				}
				if (_this.isStopped() && (_this.preSequenceFlag == false || (_this.sequenceProxy && _this.sequenceProxy.isInSequence == false))) {
					if (!_this.selectedPlayer) {
						_this.showPlayerError();
						return false;
					} else {
						_this.embedPlayerHTML();
					}
				}
				this.addPlayerSpinner();
				this.hideSpinnerOncePlaying();
				_this.stopped = false;
				if (!this.preSequenceFlag) {
					this.preSequenceFlag = true;
					mw.log("EmbedPlayer:: trigger preSequence ");
					this.triggerHelper('preSequence');
					this.playInterfaceUpdate();
					if (_this.sequenceProxy && _this.sequenceProxy.isInSequence) {
						mw.log("EmbedPlayer:: isInSequence, do NOT play content");
						return false;
					}
				}
				if (this.firstPlay && this._propagateEvents) {
					this.firstPlay = false;
					this.triggerHelper('firstPlay');
				}
				if (this.paused === true) {
					this.paused = false;
					mw.log("EmbedPlayer:: trigger play event::" + !this.paused + ' events:' + this._propagateEvents);
					if (this._propagateEvents) {
						this.triggerHelper('onplay');
					}
				}
				if (this.donePlayingCount > 0 && !this.paused && this._propagateEvents) {
					this.replayEventCount++;
					this.triggeredEndDone = false;
					if (this.replayEventCount <= this.donePlayingCount) {
						mw.log("EmbedPlayer::play> trigger replayEvent");
						this.triggerHelper('replayEvent');
					}
				}
				if (this.currentTime < this.startTime) {
					$this.bind('playing.startTime', function() {
						$this.unbind('playing.startTime');
						if (!mw.isIOS()) {
							_this.setCurrentTime(_this.startTime);
							_this.startTime = 0;
						} else {
							setTimeout(function() {
								_this.setCurrentTime(_this.startTime, function() {
									_this.play();
								});
								_this.startTime = 0;
							}, 500)
						}
					});
				}
				this.playInterfaceUpdate();
				if (_this._playContorls) {
					return true;
				} else {
					mw.log("EmbedPlayer::play: _playContorls is false");
					return false;
				}
			},
			playInterfaceUpdate: function() {
				var _this = this;
				mw.log('EmbedPlayer:: playInterfaceUpdate');
				if (this.controlBuilder) {
					this.controlBuilder.closeMenuOverlay();
				}
				this.getInterface().find('.error').remove();
				this.hideLargePlayBtn();
				this.getInterface().find('.play-btn span').removeClass('ui-icon-play').addClass('ui-icon-pause');
				this.hideSpinnerOncePlaying();
				this.getInterface().find('.play-btn').unbind('click').click(function() {
					if (_this._playContorls) {
						_this.pause();
					}
				}).attr('title', gM('mwe-embedplayer-pause_clip'));
				$(this).trigger('onPlayInterfaceUpdate');
			},
			pauseLoading: function() {
				this.pause();
				this.addPlayerSpinner();
				this.isPauseLoading = true;
			},
			addPlayerSpinner: function() {
				var sId = 'loadingSpinner_' + this.id;
				$('#' + sId).remove();
				this.hideLargePlayBtn();
				$(this).getAbsoluteOverlaySpinner().attr('id', sId);
			},
			hideSpinner: function() {
				$('#loadingSpinner_' + this.id + ',.loadingSpinner').remove();
			},
			hideSpinnerAndPlayBtn: function() {
				this.isPauseLoading = false;
				this.hideSpinner();
				this.hideLargePlayBtn();
			},
			hideSpinnerOncePlaying: function() {
				this._checkHideSpinner = true;
			},
			pause: function() {
				mw.log("EmbedPlayer::pause()");
				var _this = this;
				if (this.paused === false) {
					this.paused = true;
					if (this._propagateEvents) {
						mw.log('EmbedPlayer:trigger pause:' + this.paused);
						$(this).trigger('onpause');
					}
				}
				_this.pauseInterfaceUpdate();
			},
			pauseInterfaceUpdate: function() {
				var _this = this;
				mw.log("EmbedPlayer::pauseInterfaceUpdate");
				this.hideSpinner();
				if (this.useLargePlayBtn()) {
					this.addLargePlayBtn();
				}
				this.getInterface().find('.play-btn span').removeClass('ui-icon-pause').addClass('ui-icon-play');
				this.getInterface().find('.play-btn').unbind('click').click(function() {
					if (_this._playContorls) {
						_this.play();
					}
				}).attr('title', gM('mwe-embedplayer-play_clip'));
				$(this).trigger('onPauseInterfaceUpdate');
			},
			load: function() {
				mw.log('Waring:: the load method should be overided by player interface');
			},
			stop: function() {
				var _this = this;
				mw.log('EmbedPlayer::stop:' + this.id);
				this.stopped = true;
				if (this.adsOnReplay) {
					this.preSequenceFlag = false;
				}
				$(this).trigger('doStop');
				this.didSeekJump = false;
				this.currentTime = this.previousTime = this.serverSeekTime = 0;
				this.stopMonitor();
				if (!this.paused) {
					this.pause();
				}
				this.updatePosterHTML();
				this.bufferedPercent = 0;
				this.updateBufferStatus();
				this.controlBuilder.setStatus(this.getTimeRange());
				this.updatePlayHead(0);
				this.controlBuilder.setStatus(this.getTimeRange());
			},
			toggleMute: function() {
				mw.log('EmbedPlayer::toggleMute> (old state:) ' + this.muted);
				if (this.muted) {
					this.muted = false;
					var percent = this.preMuteVolume;
				} else {
					this.muted = true;
					this.preMuteVolume = this.volume;
					var percent = 0;
				}
				this.setVolume(percent, true);
				this.setInterfaceVolume(percent);
				$(this).trigger('onToggleMute');
			},
			setVolume: function(percent, triggerChange) {
				var _this = this;
				if (isNaN(percent)) {
					return;
				}
				this.previousVolume = this.volume;
				this.volume = percent;
				if (percent != 0) {
					this.muted = false;
				}
				this.setPlayerElementVolume(percent);
				if (triggerChange) {
					$(_this).trigger('volumeChanged', percent);
				}
			},
			setInterfaceVolume: function(percent) {
				if (this.supports['volumeControl'] && this.getInterface().find('.volume-slider').length) {
					this.getInterface().find('.volume-slider').slider('value', percent * 100);
				}
			},
			setPlayerElementVolume: function(percent) {
				mw.log('Error player does not support volume adjustment');
			},
			getPlayerElementVolume: function() {
				return this.volume;
			},
			getPlayerElementMuted: function() {
				return this.muted;
			},
			fullscreen: function() {
				this.controlBuilder.toggleFullscreen();
			},
			postEmbedActions: function() {
				return;
			},
			isPlaying: function() {
				if (this.stopped) {
					return false;
				} else if (this.paused) {
					return false;
				} else {
					return true;
				}
			},
			isStopped: function() {
				return this.stopped;
			},
			stopMonitor: function() {
				clearInterval(this.monitorInterval);
				this.monitorInterval = 0;
			},
			startMonitor: function() {
				this.monitor();
			},
			monitor: function() {
				var _this = this;
				_this.syncCurrentTime();
				_this.syncVolume();
				_this.syncMonitor()
				if (_this._propagateEvents) {
					$(_this).trigger('monitorEvent');
					if (_this.progressEventData) {
						$(_this).trigger('progress', _this.progressEventData);
					}
				}
			},
			syncMonitor: function() {
				var _this = this;
				if (!this.isStopped()) {
					if (!this.monitorInterval) {
						this.monitorInterval = setInterval(function() {
							if (_this.monitor) _this.monitor();
						}, this.monitorRate);
					}
				} else {
					this.stopMonitor();
				}
			},
			syncVolume: function() {
				var _this = this;
				if (Math.round(_this.volume * 100) != Math.round(_this.previousVolume * 100)) {
					_this.setInterfaceVolume(_this.volume);
				}
				_this.previousVolume = _this.volume;
				_this.volume = this.getPlayerElementVolume();
				if (_this.muted != _this.getPlayerElementMuted() && !_this.isStopped()) {
					mw.log("EmbedPlayer::syncVolume: muted does not mach embed player");
					_this.toggleMute();
					_this.muted = _this.getPlayerElementMuted();
				}
			},
			syncCurrentTime: function() {
				var _this = this;
				if (_this._checkHideSpinner && _this.currentTime != _this.getPlayerElementTime()) {
					_this._checkHideSpinner = false;
					_this.hideSpinnerAndPlayBtn();
					if (_this.isPersistantPlayBtn()) {
						_this.addLargePlayBtn();
					} else {
						_this.hideLargePlayBtn();
					}
				}
				if (parseInt(_this.previousTime) != parseInt(_this.currentTime) && !this.userSlide && !this.seeking && !this.isStopped()) {
					if (_this.getDuration() && _this.currentTime <= _this.getDuration()) {
						var seekPercent = _this.currentTime / _this.getDuration();
						mw.log("EmbedPlayer::syncCurrentTime::" + _this.previousTime + ' != ' + _this.currentTime + " javascript based currentTime update to " + seekPercent + ' == ' + _this.currentTime);
						_this.previousTime = _this.currentTime;
						this.seek(seekPercent);
					}
				}
				_this.currentTime = _this.getPlayerElementTime();
				if (_this.serverSeekTime && _this.supportsURLTimeEncoding()) {
					_this.currentTime = parseInt(_this.serverSeekTime) + parseInt(_this.getPlayerElementTime());
				}
				_this.previousTime = _this.currentTime;
				if (_this.pauseTime && _this.currentTime > _this.pauseTime) {
					_this.pause();
					_this.pauseTime = null;
				}
			},
			updatePlayheadStatus: function() {
				var _this = this;
				if (this.currentTime >= 0 && this.duration) {
					if (!this.userSlide && !this.seeking) {
						if (parseInt(this.startOffset) != 0) {
							this.updatePlayHead((this.currentTime - this.startOffset) / this.duration);
							var et = (this.controlBuilder.longTimeDisp && !this.isLive()) ? '/' + mw.seconds2npt(parseFloat(this.duration)) : '';
							var st = this.currentTime - this.startOffset;
							if (st < 0) {
								st = 0;
							}
							this.controlBuilder.setStatus(mw.seconds2npt(st) + et);
						} else {
							var ct = (this.getPlayerElement()) ? this.getPlayerElement().currentTime || this.currentTime : this.currentTime;
							this.updatePlayHead(ct / this.duration);
							var et = (this.controlBuilder.longTimeDisp && !this.isLive()) ? '/' + mw.seconds2npt(this.duration) : '';
							this.controlBuilder.setStatus(mw.seconds2npt(this.currentTime) + et);
						}
					}
					var endPresentationTime = this.duration;
					if ((this.currentTime - this.startOffset) >= endPresentationTime && !this.isStopped()) {
						mw.log("EmbedPlayer::updatePlayheadStatus > should run clip done :: " + this.currentTime + ' > ' + endPresentationTime);
						this.onClipDone();
					}
				} else {
					if (this.isStopped()) {
						this.controlBuilder.setStatus(this.getTimeRange());
					} else if (this.paused) {
						this.controlBuilder.setStatus(gM('mwe-embedplayer-paused'));
					} else if (this.isPlaying()) {
						if (this.currentTime && !this.duration) {
							var timeSeparator = (this.isLive()) ? '' : ' /';
							this.controlBuilder.setStatus(mw.seconds2npt(this.currentTime) + timeSeparator);
						} else {
							this.controlBuilder.setStatus(" - - - ");
						}
					} else {
						this.controlBuilder.setStatus(this.getTimeRange());
					}
				}
			},
			getPlayerElementTime: function() {
				mw.log("Error: getPlayerElementTime should be implemented by embed library");
			},
			getPlayerElement: function() {
				mw.log("Error: getPlayerElement should be implemented by embed library, or you may be calling this event too soon");
			},
			updateBufferStatus: function() {
				var $buffer = this.getInterface().find('.mw_buffer');
				if (this.bufferedPercent != 0) {
					if (this.bufferedPercent > 1) {
						this.bufferedPercent = 1;
					}
					$buffer.css({
						"width": (this.bufferedPercent * 100) + '%'
					});
					$(this).trigger('updateBufferPercent', this.bufferedPercent);
				} else {
					$buffer.css("width", '0px');
				}
				if (this.bufferedPercent > 0 && !this.bufferStartFlag) {
					this.bufferStartFlag = true;
					mw.log("EmbedPlayer::bufferStart");
					$(this).trigger('bufferStartEvent');
				}
				if (this.bufferedPercent == 1 && !this.bufferEndFlag) {
					this.bufferEndFlag = true;
					$(this).trigger('bufferEndEvent');
				}
			},
			updatePlayHead: function(perc) {
				if (this.getInterface()) {
					var $playHead = this.getInterface().find('.play_head');
					if (!this.useNativePlayerControls() && $playHead.length != 0) {
						var val = parseInt(perc * 1000);
						$playHead.slider('value', val);
					}
				}
				$(this).trigger('updatePlayHeadPercent', perc);
			},
			getSrc: function(serverSeekTime) {
				if (serverSeekTime) {
					this.serverSeekTime = serverSeekTime;
				}
				if (this.currentTime && !this.serverSeekTime) {
					this.serverSeekTime = this.currentTime;
				}
				if (!this.mediaElement) {
					return false;
				}
				if (!this.mediaElement.selectedSource) {
					this.mediaElement.autoSelectSource();
				};
				if (this.mediaElement.selectedSource) {
					if (this.supportsURLTimeEncoding()) {
						return this.mediaElement.selectedSource.getSrc(this.serverSeekTime);
					} else {
						return this.mediaElement.selectedSource.getSrc();
					}
				}
				return false;
			},
			getSource: function() {
				this.mediaElement.autoSelectSource();
				return this.mediaElement.selectedSource;
			},
			getCompatibleSource: function(videoFiles) {
				var $media = $('<video />');
				$.each(videoFiles, function(inx, source) {
					$media.append($('<source />').attr(source));
					mw.log("EmbedPlayer::getCompatibleSource: add " + source.src + ' of type:' + source.type);
				});
				var myMediaElement = new mw.MediaElement($media[0]);
				var source = myMediaElement.autoSelectSource();
				if (source) {
					mw.log("EmbedPlayer::getCompatibleSource: " + source.getSrc());
					return source;
				}
				mw.log("Error:: could not find compatible source");
				return false;
			},
			supportsURLTimeEncoding: function() {
				var timeUrls = mw.getConfig('EmbedPlayer.EnableURLTimeEncoding');
				if (timeUrls == 'none') {
					return false;
				} else if (timeUrls == 'always') {
					return this.mediaElement.selectedSource.URLTimeEncoding;
				} else if (timeUrls == 'flash') {
					if (this.mediaElement.selectedSource && this.mediaElement.selectedSource.URLTimeEncoding) {
						return (this.instanceOf == 'Kplayer');
					}
				} else {
					mw.log("Error:: invalid config value for EmbedPlayer.EnableURLTimeEncoding:: " + mw.getConfig('EmbedPlayer.EnableURLTimeEncoding'));
				}
				return false;
			},
			setCookie: function(name, value, options) {
				var _this = this;
				if (mw.getConfig('alertForCookies')) {
					if ($.cookie('allowCookies')) {
						$.cookie(name, value, options);
					} else {
						var alertObj = {
							'title': "Cookies",
							'message': "Video player will save cookies on your computer",
							'isModal': true,
							'isExternal': false,
							'buttons': ["Allow", "Disallow"],
							'callbackFunction': function(eventObj) {
								if (eventObj.target.textContent.toLowerCase() === "allow") {
									$.cookie('allowCookies', true);
									$.cookie(name, value, options);
								} else {
									$.cookie('allowCookies', null);
									_this.disabledCookies = true;
								}
							}
						};
						if (!this.disabledCookies) {
							this.controlBuilder.displayAlert(alertObj);
						}
					}
				} else {
					$.cookie(name, value, options);
				}
			},
			setLive: function(isLive) {
				this.live = isLive;
			},
			isLive: function() {
				return this.live;
			},
			isDVR: function() {
				return this.kalturaPlayerMetaData['dvrStatus'];
			}
		};
	})(window.mw, window.jQuery);
	(function(mw, $) {
		"use strict";
		mw.PlayerControlBuilder = function(embedPlayer, options) {
			return this.init(embedPlayer, options);
		};
		mw.PlayerControlBuilder.prototype = {
			playerClass: 'mv-player',
			longTimeDisp: true,
			volumeLayout: 'vertical',
			height: mw.getConfig('EmbedPlayer.ControlsHeight'),
			supportedComponents: {
				'options': true
			},
			supportedMenuItems: {
				'playerSelect': true,
				'download': true,
				'share': true,
				'aboutPlayerLibrary': true
			},
			inFullScreen: false,
			addWarningFlag: false,
			displayOptionsMenuFlag: false,
			hideControlBarCallback: false,
			controlsDisabled: false,
			spaceKeyBindingEnabled: true,
			parentsAbsoluteList: [],
			parentsRelativeList: [],
			bindPostfix: '.controlBuilder',
			init: function(embedPlayer) {
				var _this = this;
				this.embedPlayer = embedPlayer;
				var skinClass = embedPlayer.skinName.substr(0, 1).toUpperCase() + embedPlayer.skinName.substr(1);
				if (mw['PlayerSkin' + skinClass]) {
					var _this = $.extend(true, {}, this, mw['PlayerSkin' + skinClass]);
					return _this;
				}
				return this;
			},
			getHeight: function() {
				return this.height;
			},
			addControls: function() {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				embedPlayer.getInterface().find('.control-bar,.overlay-win').remove();
				_this.displayOptionsMenuFlag = false;
				var $controlBar = $('<div />').addClass('ui-state-default ui-widget-header ui-helper-clearfix control-bar').css('height', this.height);
				if (_this.isOverlayControls()) {
					$controlBar.hide();
					$controlBar.addClass('hover');
				} else {
					$controlBar.addClass('block');
				}
				if (embedPlayer.isAudio() && embedPlayer.getInterface().height() == 0) {
					embedPlayer.getInterface().css({
						'height': this.height
					});
				}
				embedPlayer.getInterface().append($controlBar);
				if ($.browser.mozilla && parseFloat($.browser.version) < 2) {
					embedPlayer.triggerHelper('resizeIframeContainer', [{
						'height': embedPlayer.height + $controlBar.height() - 1
					}]);
				}
				this.addControlComponents();
				this.addControlBindings();
			},
			addControlComponents: function() {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				this.availableWidth = embedPlayer.getPlayerWidth();
				mw.log('PlayerControlsBuilder:: addControlComponents into:' + this.availableWidth);
				this.supportedComponents = $.extend(this.supportedComponents, embedPlayer.supports);
				if (mw.getConfig('EmbedPlayer.AttributionButton') && embedPlayer.attributionbutton) {
					this.supportedComponents['attributionButton'] = true;
				}
				if (mw.getConfig('EmbedPlayer.EnableFullscreen') === false) {
					this.supportedComponents['fullscreen'] = false;
				}
				if (mw.getConfig('EmbedPlayer.EnableOptionsMenu') === false) {
					this.supportedComponents['options'] = false;
				}
				if (mw.getConfig('EmbedPlayer.EnableVolumeControl') === false) {
					this.supportedComponents['volumeControl'] = false;
				}
				if (embedPlayer.mediaElement.getPlayableSources().length == 1) {
					this.supportedComponents['sourceSwitch'] = false;
				}
				$(embedPlayer).trigger('addControlBarComponent', this);
				for (var componentId in this.components) {
					if (this.components[componentId] === false) {
						continue;
					}
					var specialItems = ['playHead', 'timeDisplay', 'liveStreamStatus', 'liveStreamDVRStatus', 'liveStreamDVRScrubber', 'backToLive'];
					if ($.inArray(componentId, specialItems) != -1) {
						continue;
					}
					if (componentId == 'fullscreen' && this.embedPlayer.isAudio()) {
						continue;
					}
					this.addComponent(componentId);
				}
				if (mw.getConfig('EmbedPlayer.EnableTimeDisplay') && !embedPlayer.isLive()) {
					this.addComponent('timeDisplay');
				}
				if (this.availableWidth > 30 && !embedPlayer.isLive()) {
					this.addComponent('playHead');
				}
				if (embedPlayer.isLive()) {
					this.addComponent('liveStreamStatus');
					if (embedPlayer.isDVR()) {
						this.addComponent('backToLive');
						this.addComponent('liveStreamDVRStatus');
						this.addComponent('liveStreamDVRScrubber');
					}
				}
				$(embedPlayer).trigger('controlBarBuildDone');
			},
			addComponent: function(componentId) {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				var $controlBar = embedPlayer.getInterface().find('.control-bar');
				if (_this.supportedComponents[componentId]) {
					if (_this.availableWidth > _this.components[componentId].w) {
						$controlBar.append(_this.getComponent(componentId));
						_this.availableWidth -= _this.components[componentId].w;
						mw.log("PlayerControlBuilder: availableWidth:" + _this.availableWidth + ' ' + componentId + ' took: ' + _this.components[componentId].w)
					} else {
						mw.log('PlayerControlBuilder:: Not enough space for control component:' + componentId);
					}
				}
			},
			getAspectPlayerWindowCss: function(windowSize) {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				if (!windowSize) {
					var windowSize = {
						'width': $(window).width(),
						'height': $(window).height()
					};
				}
				windowSize.width = parseInt(windowSize.width);
				windowSize.height = parseInt(windowSize.height);
				if (!_this.isOverlayControls()) {
					windowSize.height = windowSize.height - this.height;
				}
				var targetWidth = windowSize.width;
				var targetHeight = Math.floor(targetWidth * (1 / _this.getIntrinsicAspect()));
				if (targetHeight + 2 > windowSize.height) {
					targetHeight = windowSize.height;
					targetWidth = parseInt(targetHeight * _this.getIntrinsicAspect());
				}
				var offsetTop = 0;
				offsetTop += (targetHeight < windowSize.height) ? (windowSize.height - targetHeight) / 2 : 0;
				var offsetLeft = (targetWidth < windowSize.width) ? parseInt(windowSize.width - targetWidth) / 2 : 0;
				var position = (mw.isIOS4() && mw.isIphone()) ? 'static' : 'absolute';
				mw.log('PlayerControlBuilder::getAspectPlayerWindowCss: ' + ' h:' + targetHeight + ' w:' + targetWidth + ' t:' + offsetTop + ' l:' + offsetLeft);
				return {
					'position': position,
					'height': parseInt(targetHeight),
					'width': parseInt(targetWidth),
					'top': parseInt(offsetTop),
					'left': parseInt(offsetLeft)
				};
			},
			getIntrinsicAspect: function() {
				var vid = this.embedPlayer.getPlayerElement();
				if (vid && vid.videoWidth && vid.videoHeight) {
					return vid.videoWidth / vid.videoHeight;
				}
				if (this.embedPlayer.mediaElement && this.embedPlayer.mediaElement.selectedSource) {
					var ss = this.embedPlayer.mediaElement.selectedSource;
					if (ss.aspect) {
						return ss.aspect;
					}
					if (ss.width && ss.height) {
						return ss.width / ss.height
					}
				}
				var img = this.embedPlayer.getInterface().find('.playerPoster')[0];
				if (img && img.naturalWidth && img.naturalHeight) {
					return img.naturalWidth / img.naturalHeight
				}
				return this.embedPlayer.getWidth() / this.embedPlayer.getHeight()
			},
			getPlayButtonPosition: function() {
				var _this = this;
				return {
					'position': 'absolute',
					'left': '50%',
					'top': '50%',
					'margin-left': -.5 * this.getComponentWidth('playButtonLarge'),
					'margin-top': -.5 * this.getComponentHeight('playButtonLarge')
				};
			},
			isInFullScreen: function() {
				return this.inFullScreen;
			},
			toggleFullscreen: function() {
				var _this = this;
				if (this.isInFullScreen()) {
					this.restoreWindowPlayer();
				} else {
					this.doFullScreenPlayer();
				}
			},
			doFullScreenPlayer: function(callback) {
				mw.log("PlayerControlBuilder:: doFullScreenPlayer");
				var _this = this;
				var embedPlayer = this.embedPlayer;
				var $interface = embedPlayer.getInterface();
				if (this.isInFullScreen() == true) {
					return;
				}
				this.inFullScreen = true;
				var isIframe = mw.getConfig('EmbedPlayer.IsIframeServer'),
					doc = isIframe ? window['parent'].document : window.document,
					context = isIframe ? window['parent'] : window;
				this.verticalScrollPosition = (doc.all ? doc.scrollTop : context.pageYOffset);
				$interface.addClass('fullscreen');
				if (_this.isOverlayControls()) {
					_this.addFullscreenMouseMoveHideShowControls();
				}
				$(embedPlayer).trigger('fullScreenStoreVerticalScroll');
				if (window.fullScreenApi.supportsFullScreen && !mw.isMobileChrome()) {
					_this.preFullscreenPlayerSize = this.getPlayerSize();
					var fullscreenHeight = null;
					var fsTarget = this.getFsTarget();
					var escapeFullscreen = function(event) {
						var doc = (mw.getConfig('EmbedPlayer.IsIframeServer')) ? window['parent'].document : window.document;
						if (!window.fullScreenApi.isFullScreen(doc)) {
							_this.restoreWindowPlayer();
						}
					}
					fsTarget.removeEventListener(fullScreenApi.fullScreenEventName, escapeFullscreen);
					fsTarget.addEventListener(fullScreenApi.fullScreenEventName, escapeFullscreen);
					window.fullScreenApi.requestFullScreen(fsTarget);
					if ($.browser.mozilla) {
						_this.fullscreenRestoreCheck = setInterval(function() {
							if (fullscreenHeight && $(window).height() < fullscreenHeight) {
								clearInterval(_this.fullscreenRestoreCheck);
								_this.restoreWindowPlayer();
							}
							if (!fullscreenHeight && _this.preFullscreenPlayerSize.height != $(window).height()) {
								fullscreenHeight = $(window).height();
							}
						}, 250);
					}
				} else {
					var vid = this.embedPlayer.getPlayerElement();
					if (mw.getConfig('EmbedPlayer.EnableIpadNativeFullscreen') && vid && vid.webkitSupportsFullscreen) {
						this.doHybridNativeFullscreen();
						return;
					} else {
						this.doContextTargetFullscreen();
					}
				}
				$(window).keyup(function(event) {
					if (event.keyCode == 27) {
						_this.restoreWindowPlayer();
					}
				});
				$(embedPlayer).trigger('onOpenFullScreen');
			},
			doContextTargetFullscreen: function() {
				var isIframe = mw.getConfig('EmbedPlayer.IsIframeServer');
				var _this = this,
					doc = isIframe ? window['parent'].document : window.document,
					$doc = $(doc),
					$target = $(this.getFsTarget()),
					context = isIframe ? window['parent'] : window;
				this.parentsAbsoluteList = [];
				this.parentsRelativeList = [];
				this.orginalParnetViewPortContent = $doc.find('meta[name="viewport"]').attr('content');
				this.orginalTargetElementLayout = {
					'style': $target[0].style.cssText,
					'width': $target.width(),
					'height': $target.height()
				};
				mw.log("PlayerControls:: doParentIframeFullscreen> verticalScrollPosition:" + this.verticalScrollPosition);
				context.scroll(0, 0);
				if (!$doc.find('meta[name="viewport"]').length) {
					$doc.find('head').append($('<meta />').attr('name', 'viewport'));
				}
				$doc.find('meta[name="viewport"]').attr('content', 'width=1024, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1');
				var playerCssPosition = (mw.isIOS()) ? 'absolute' : 'fixed';
				$target.parents().each(function() {
					var $parent = $(this);
					if ($parent.css('position') == 'absolute') {
						_this.parentsAbsoluteList.push($parent);
						$parent.css('position', 'static');
					}
					if ($parent.css('position') == 'relative') {
						_this.parentsRelativeList.push($parent);
						$parent.css('position', 'static');
					}
				});
				$target.css({
					'z-index': mw.getConfig('EmbedPlayer.FullScreenZIndex'),
					'position': playerCssPosition,
					'top': '0px',
					'left': '0px',
					'margin': 0
				}).data('isFullscreen', true).after($('<div>').addClass('player-placeholder').css({
						'width': this.orginalTargetElementLayout.width,
						'height': this.orginalTargetElementLayout.height
					}))
				var updateTargetSize = function() {
					context.scroll(0, 0);
					var innerHeight = context.innerHeight;
					if (mw.isMobileChrome()) {
						innerHeight += 1;
					}
					if ((mw.isAndroid41() || mw.isAndroid42() || (mw.isAndroid() && mw.isFirefox())) && !mw.isMobileChrome() && context.devicePixelRatio) {
						innerHeight = context.outerHeight / context.devicePixelRatio;
					}
					$target.css({
						'width': context.innerWidth,
						'height': innerHeight
					});
					if (!mw.isMobileChrome()) {
						$target.trigger('resize');
					}
					_this.embedPlayer.applyIntrinsicAspect();
				};
				var updateSizeByDevice = function() {
					if (mw.isAndroid()) {
						setTimeout(updateTargetSize, 10);
					} else {
						updateTargetSize();
					}
				};
				updateSizeByDevice();
				var eventName = mw.isAndroid() ? 'resize' : 'orientationchange';
				eventName += this.bindPostfix;
				$(context).bind(eventName, function() {
					if (_this.isInFullScreen()) {
						updateSizeByDevice();
					}
				});
				document.ontouchmove = function(e) {
					if (_this.isInFullScreen()) {
						e.preventDefault();
					}
				};
			},
			restoreContextPlayer: function() {
				var isIframe = mw.getConfig('EmbedPlayer.IsIframeServer');
				var _this = this,
					doc = isIframe ? window['parent'].document : window.document,
					$doc = $(doc),
					$target = $(this.getFsTarget()),
					context = isIframe ? window['parent'] : window;
				mw.log("PlayerControlsBuilder:: restoreContextPlayer> verticalScrollPosition:" + this.verticalScrollPosition);
				if (this.orginalParnetViewPortContent) {
					$doc.find('meta[name="viewport"]').attr('content', this.orginalParnetViewPortContent);
				} else {
					$doc.find('meta[name="viewport"]').attr('content', 'initial-scale=1, maximum-scale=8, minimum-scale=1, user-scalable=yes');
					if (mw.isMobileChrome()) {
						$doc.find('meta[name="viewport"]').attr('content', 'user-scalable=yes');
					}
				}
				if (this.orginalTargetElementLayout) {
					$target[0].style.cssText = this.orginalTargetElementLayout.style;
					$target.attr({
						'width': this.orginalTargetElementLayout.width,
						'height': this.orginalTargetElementLayout.height
					}).trigger('resize')
					_this.embedPlayer.applyIntrinsicAspect();
					$target.siblings('.player-placeholder').remove();
				}
				$.each(_this.parentsAbsoluteList, function(inx, $elm) {
					$elm.css('position', 'absolute');
				});
				$.each(_this.parentsRelativeList, function(inx, $elm) {
					$elm.css('position', 'relative');
				});
				setTimeout(function() {
					context.scroll(0, _this.verticalScrollPosition);
				}, 100)
			},
			doHybridNativeFullscreen: function() {
				var vid = this.embedPlayer.getPlayerElement();
				var _this = this;
				vid.webkitEnterFullscreen();
				this.fsIntervalID = setInterval(function() {
					var currentFS = vid.webkitDisplayingFullscreen;
					if (_this.isInFullScreen() && !currentFS) {
						_this.inFullScreen = false;
						$(_this.embedPlayer).trigger('onCloseFullScreen');
						_this.embedPlayer.getInterface().removeClass('fullscreen');
						clearInterval(_this.fsIntervalID);
					}
				}, 250);
			},
			getWindowSize: function() {
				return {
					'width': $(window).width(),
					'height': $(window).height()
				};
			},
			doDomFullscreen: function() {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				var $interface = embedPlayer.getInterface();
				$('.mw-fullscreen-overlay').remove();
				_this.preFullscreenPlayerSize = this.getPlayerSize();
				$interface.after($('<div />').addClass('mw-fullscreen-overlay').css('z-index', mw.getConfig('EmbedPlayer.FullScreenZIndex')).hide().fadeIn("slow"));
				if (!this.windowPositionStyle) {
					this.windowPositionStyle = $interface.css('position');
				}
				if (!this.windowZindex) {
					this.windowZindex = $interface.css('z-index');
				}
				this.windowOffset = this.getWindowOffset();
				$interface.css({
					'position': 'fixed',
					'z-index': mw.getConfig('EmbedPlayer.FullScreenZIndex') + 1,
					'top': this.windowOffset.top,
					'left': this.windowOffset.left
				});
				if (embedPlayer.isPersistentNativePlayer()) {
					$(embedPlayer.getPlayerElement()).css({
						'z-index': mw.getConfig('EmbedPlayer.FullScreenZIndex') + 1,
						'position': 'absolute'
					});
				}
				_this.parentsAbsolute = [];
				$('body').css('overflow', 'hidden');
				var topOffset = '0px';
				var leftOffset = '0px';
				if ($interface.offsetParent()[0].tagName && $interface.offsetParent()[0].tagName.toLowerCase() != 'body') {
					topOffset = -this.windowOffset.top + 'px';
					leftOffset = -this.windowOffset.left + 'px';
				}
				$interface.css('overlow', 'hidden');
				$interface.parents().each(function() {
					if ($(this).css('position') == 'absolute') {
						_this.parentsAbsolute.push($(this));
						$(this).css('position', null);
						mw.log('PlayerControlBuilder::  should update position: ' + $(this).css('position'));
					}
				});
				$(window).keyup(function(event) {
					if (event.keyCode == 27) {
						_this.restoreWindowPlayer();
					}
				});
			},
			addFullscreenMouseMoveHideShowControls: function() {
				var _this = this;
				_this.mouseMovedFlag = false;
				var oldX = 0,
					oldY = 0;
				_this.embedPlayer.getInterface().mousemove(function(e) {
					if (Math.abs(oldX - event.pageX) > 4 || Math.abs(oldY - event.pageY) > 4) {
						_this.mouseMovedFlag = true;
					}
					oldX = event.pageX;
					oldY = event.pageY;
				});
				var checkMovedMouse = function() {
					if (_this.isInFullScreen()) {
						if (_this.mouseMovedFlag) {
							_this.mouseMovedFlag = false;
							_this.showControlBar();
							setTimeout(checkMovedMouse, 4000);
						} else {
							_this.hideControlBar();
							setTimeout(checkMovedMouse, 250);
						}
						return;
					}
				};
				_this.showControlBar();
				checkMovedMouse();
			},
			getWindowOffset: function() {
				var windowOffset = this.embedPlayer.getInterface().offset();
				windowOffset.top = windowOffset.top - $(document).scrollTop();
				windowOffset.left = windowOffset.left - $(document).scrollLeft();
				this.windowOffset = windowOffset;
				return this.windowOffset;
			},
			displayFullscreenTip: function() {
				var _this = this;
				if (mw.isMobileDevice()) {
					return;
				}
				if ($.browser.safari && !/chrome/.test(navigator.userAgent.toLowerCase())) {
					return;
				}
				var toolTipMsg = (navigator.userAgent.indexOf('Mac OS X') != -1) ? gM('mwe-embedplayer-fullscreen-tip-osx') : gM('mwe-embedplayer-fullscreen-tip');
				var $targetTip = this.addWarningBinding('EmbedPlayer.FullscreenTip', $('<h3/>').html(toolTipMsg));
				$targetTip.show();
				var hideTip = function() {
					mw.setConfig('EmbedPlayer.FullscreenTip', false);
					$targetTip.fadeOut('fast');
				};
				$(this.embedPlayer).bind('onCloseFullScreen', hideTip);
				setTimeout(hideTip, 5000);
				$(document).keyup(function(event) {
					if (event.keyCode == 122) {
						hideTip();
					}
					return true;
				});
			},
			getPlayerSize: function() {
				var controlsHeight = (this.isOverlayControls()) ? 0 : this.getHeight();
				var height = $(window).height() - controlsHeight;
				if (mw.getConfig('EmbedPlayer.IsIframeServer')) {
					return {
						'height': height,
						'width': $(window).width()
					}
				} else {
					return {
						'height': this.embedPlayer.getInterface().height(),
						'width': this.embedPlayer.getInterface().width()
					}
				}
			},
			getFsTarget: function() {
				if (mw.getConfig('EmbedPlayer.IsIframeServer')) {
					var targetId;
					if (window.fullScreenApi.supportsFullScreen) {
						targetId = this.embedPlayer.id + '_ifp';
					} else {
						targetId = this.embedPlayer.id;
					}
					return window['parent'].document.getElementById(targetId);
				} else {
					var $interface = this.embedPlayer.getInterface();
					return $interface[0];
				}
			},
			getDocTarget: function() {
				if (mw.getConfig('EmbedPlayer.IsIframeServer')) {
					return window['parent'].document;
				} else {
					return document;
				}
			},
			restoreWindowPlayer: function() {
				var _this = this;
				mw.log("PlayerControlBuilder :: restoreWindowPlayer");
				var embedPlayer = this.embedPlayer;
				if (this.isInFullScreen() === false) {
					return;
				}
				this.inFullScreen = false;
				embedPlayer.getInterface().removeClass('fullscreen');
				if (window.fullScreenApi.supportsFullScreen) {
					var fsTarget = this.getFsTarget();
					var docTarget = this.getDocTarget();
					window.fullScreenApi.cancelFullScreen(fsTarget, docTarget);
				}
				this.restoreContextPlayer();
				$(document).unbind('touchend.fullscreen');
				$(embedPlayer).trigger('onCloseFullScreen');
			},
			restoreDomPlayer: function() {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				var $interface = embedPlayer.$interface;
				var interfaceHeight = (_this.isOverlayControls()) ? embedPlayer.getHeight() : embedPlayer.getHeight() + _this.getHeight();
				mw.log('restoreWindowPlayer:: h:' + interfaceHeight + ' w:' + embedPlayer.getWidth());
				$('.mw-fullscreen-overlay').remove('slow');
				mw.log('restore embedPlayer:: ' + embedPlayer.getWidth() + ' h: ' + embedPlayer.getHeight());
				embedPlayer.getInterface().css({
					'width': _this.preFullscreenPlayerSize.width,
					'height': _this.preFullscreenPlayerSize.height
				});
				var topPos = {
					'position': _this.windowPositionStyle,
					'z-index': _this.windowZindex,
					'overlow': 'visible',
					'top': '0px',
					'left': '0px'
				};
				$([$interface, $interface.find('.playerPoster'), embedPlayer]).css(topPos);
				if (embedPlayer.getPlayerElement()) {
					$(embedPlayer.getPlayerElement()).css(topPos)
				}
				$('body').css('overflow', 'auto');
				if (embedPlayer.isPersistentNativePlayer()) {
					$(embedPlayer.getPlayerElement()).css({
						'z-index': 'auto'
					});
				}
			},
			getOverlayWidth: function() {
				return (this.embedPlayer.getPlayerWidth() < 300) ? 300 : this.embedPlayer.getPlayerWidth();
			},
			getOverlayHeight: function() {
				return (this.embedPlayer.getPlayerHeight() < 200) ? 200 : this.embedPlayer.getPlayerHeight();
			},
			addControlBindings: function() {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				var $interface = embedPlayer.getInterface();
				_this.onControlBar = false;
				$(embedPlayer).unbind(this.bindPostfix);
				var bindFirstPlay = false;
				_this.addRightClickBinding();
				_this.addPlayerClickBindings();
				$(embedPlayer).bind('onplay' + this.bindPostfix, function() {
					embedPlayer.controlBuilder.addRightClickBinding();
				});
				$(embedPlayer).bind('monitorEvent' + this.bindPostfix, function() {
					embedPlayer.updatePlayheadStatus();
				});
				$(embedPlayer).bind('monitorEvent' + this.bindPostfix, function() {
					embedPlayer.updateBufferStatus();
				});
				$(embedPlayer).bind('onEnableInterfaceComponents' + this.bindPostfix, function() {
					this.controlBuilder.controlsDisabled = false;
					this.controlBuilder.addPlayerClickBindings();
				});
				$(embedPlayer).bind('onDisableInterfaceComponents' + this.bindPostfix, function() {
					this.controlBuilder.controlsDisabled = true;
					this.controlBuilder.removePlayerClickBindings();
				});
				this.addPlayerTouchBindings();
				if ($.browser.msie && $.browser.version <= 6) {
					$('#' + embedPlayer.id + ' .play-btn-large').pngFix();
				}
				this.doVolumeBinding();
				if (this.addSkinControlBindings && typeof(this.addSkinControlBindings) == 'function') {
					this.addSkinControlBindings();
				}
				$(embedPlayer).bind('onOpenFullScreen' + this.bindPostfix, function() {
					setTimeout(function() {
						embedPlayer.doUpdateLayout();
					}, 100)
				});
				$(embedPlayer).bind('onCloseFullScreen' + this.bindPostfix, function() {
					setTimeout(function() {
						embedPlayer.doUpdateLayout();
					}, 100)
				});
				mw.log('trigger::addControlBindingsEvent');
				$(embedPlayer).trigger('addControlBindingsEvent');
			},
			removePlayerTouchBindings: function() {
				$(this.embedPlayer).unbind("touchstart" + this.bindPostfix);
			},
			addPlayerTouchBindings: function() {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				var $interface = embedPlayer.getInterface();
				var bindSpaceUp = function() {
					$(window).bind('keyup' + _this.bindPostfix, function(e) {
						if (e.keyCode == 32 && _this.spaceKeyBindingEnabled) {
							if (embedPlayer.paused) {
								embedPlayer.play();
							} else {
								embedPlayer.pause();
							}
							_this.embedPlayer.stopEventPropagation();
							setTimeout(function() {
								_this.embedPlayer.restoreEventPropagation();
							}, 1);
							return false;
						}
					});
				};
				var bindSpaceDown = function() {
					$(window).unbind('keyup' + _this.bindPostfix);
				};
				if (_this.checkNativeWarning()) {
					_this.addWarningBinding('EmbedPlayer.ShowNativeWarning', gM('mwe-embedplayer-for_best_experience', $('<a />').attr({
						'href': 'http://www.mediawiki.org/wiki/Extension:TimedMediaHandler/Client_download',
						'target': '_new'
					})));
				}
				if (!_this.isOverlayControls()) {
					$interface.show().hover(bindSpaceUp, bindSpaceDown);
					$(embedPlayer).bind('touchstart' + this.bindPostfix, function() {
						if (mw.isAndroid41() || mw.isAndroid42() || (mw.isAndroid() && mw.isFirefox())) {
							return;
						}
						mw.log("PlayerControlBuilder:: touchstart:" + ' isPause:' + embedPlayer.paused);
						if (embedPlayer.paused) {
							embedPlayer.play();
						} else {
							embedPlayer.pause();
						}
					});
				} else {
					$(embedPlayer).bind('touchstart' + this.bindPostfix, function() {
						if (embedPlayer.getInterface().find('.control-bar').is(':visible')) {
							if (mw.isAndroid41() || mw.isAndroid42() || (mw.isAndroid() && mw.isFirefox())) {
								return;
							}
							if (embedPlayer.paused) {
								embedPlayer.play();
							} else {
								embedPlayer.pause();
							}
						} else {
							_this.showControlBar();
						}
						clearTimeout(_this.hideControlBarCallback);
						_this.hideControlBarCallback = setTimeout(function() {
							_this.hideControlBar()
						}, 5000);
						return true;
					});
					var hoverIntentConfig = {
						'sensitivity': 100,
						'timeout': 1000,
						'over': function(e) {
							if (mw.isIE9()) {
								clearTimeout(_this.hideControlBarCallback);
								_this.hideControlBarCallback = false;
							}
							_this.showControlBar();
							bindSpaceUp();
						},
						'out': function(e) {
							_this.hideControlBar();
							bindSpaceDown();
						}
					};
					if (mw.isIE9()) {
						$(embedPlayer.getPlayerElement()).hoverIntent(hoverIntentConfig);
						embedPlayer.getInterface().find('.control-bar').hover(function(e) {
							_this.onControlBar = true;
							embedPlayer.getInterface().find('.control-bar').show();
						}, function(e) {
							if (!_this.hideControlBarCallback) {
								_this.hideControlBarCallback = setTimeout(function() {
									_this.hideControlBar();
								}, 1000);
							}
							_this.onControlBar = false;
						});
					} else {
						if (!mw.isIpad()) {
							$interface.hoverIntent(hoverIntentConfig);
						}
					}
				}
			},
			removePlayerClickBindings: function() {
				$(this.embedPlayer).unbind("click" + this.bindPostfix).unbind("dblclick" + this.bindPostfix);
			},
			addPlayerClickBindings: function() {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				document.ontouchmove = function(e) {
					if (_this.isInFullScreen()) {
						e.preventDefault();
					}
				};
				this.removePlayerClickBindings();
				$(embedPlayer).bind('onEnableSpaceKey' + this.bindPostfix, function() {
					_this.spaceKeyBindingEnabled = true;
				});
				$(embedPlayer).bind('onDisableSpaceKey' + this.bindPostfix, function() {
					_this.spaceKeyBindingEnabled = false;
				});
				if (this.supportedComponents['fullscreen']) {
					$(embedPlayer).bind("dblclick" + _this.bindPostfix, function() {
						embedPlayer.fullscreen();
					});
				}
				var dblClickTime = 300;
				var lastClickTime = 0;
				var didDblClick = false;
				$(embedPlayer).bind("click" + _this.bindPostfix, function() {
					mw.log("PlayerControlBuilder:: click:" + embedPlayer.id + ' isPause:' + embedPlayer.paused);
					if (embedPlayer.useNativePlayerControls() || _this.isControlsDisabled() || mw.isIpad() || mw.isAndroid40()) {
						return true;
					}
					var clickTime = new Date().getTime();
					if (clickTime - lastClickTime < dblClickTime) {
						didDblClick = true;
						setTimeout(function() {
							didDblClick = false;
						}, dblClickTime + 10);
					}
					lastClickTime = clickTime;
					setTimeout(function() {
						if (!didDblClick) {
							if (embedPlayer.paused) {
								embedPlayer.play();
							} else {
								embedPlayer.pause();
							}
						}
					}, dblClickTime);
					return true;
				});
			},
			addRightClickBinding: function() {
				var embedPlayer = this.embedPlayer;
				if (mw.getConfig('EmbedPlayer.EnableRightClick') === false) {
					document.oncontextmenu = function(e) {
						return false;
					};
					$(embedPlayer).mousedown(function(e) {
						if (e.button == 2) {
							return false;
						}
					});
				}
			},
			hideControlBar: function() {
				var animateDuration = 'fast';
				var _this = this;
				if (_this.displayOptionsMenuFlag || _this.keepControlBarOnScreen) {
					setTimeout(function() {
						_this.hideControlBar();
					}, 200);
					return;
				}
				if (this.onControlBar === true) {
					return;
				}
				this.embedPlayer.getInterface().find('.control-bar').fadeOut(animateDuration);
				$(this.embedPlayer).trigger('onHideControlBar', {
					'bottom': 15
				});
			},
			restoreControlsHover: function() {
				if (this.isOverlayControls()) {
					this.keepControlBarOnScreen = false;
				}
			},
			showControlBar: function(keepOnScreen) {
				var animateDuration = 'fast';
				if (!this.embedPlayer) return;
				if (this.embedPlayer.getPlayerElement && !this.embedPlayer.isPersistentNativePlayer()) {
					$(this.embedPlayer.getPlayerElement()).css('z-index', '1');
				}
				mw.log('PlayerControlBuilder:: ShowControlBar,  keep on screen: ' + keepOnScreen);
				this.embedPlayer.getInterface().find('.control-bar').fadeIn(animateDuration);
				if (keepOnScreen) {
					this.keepControlBarOnScreen = true;
				}
				$(this.embedPlayer).trigger('onShowControlBar', {
					'bottom': this.getHeight() + 15
				});
			},
			isOverlayControls: function() {
				if (!this.embedPlayer.supports['overlays']) {
					return false;
				}
				if (this.embedPlayer.overlaycontrols === false) {
					return false;
				}
				if (this.embedPlayer.isAudio()) {
					return false;
				}
				if (mw.getConfig('EmbedPlayer.OverlayControls') === false) {
					return false;
				}
				if (this.embedPlayer.controls === false) {
					return false;
				}
				return true;
			},
			isControlsDisabled: function() {
				return this.controlsDisabled;
			},
			checkNativeWarning: function() {
				if (mw.getConfig('EmbedPlayer.ShowNativeWarning') === false) {
					return false;
				}
				if (this.embedPlayer.instanceOf == 'ImageOverlay') {
					return false;
				}
				if (this.embedPlayer.getPlayerHeight() < 199) {
					return false;
				}
				var supportingPlayers = mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('video/ogg');
				for (var i = 0; i < supportingPlayers.length; i++) {
					if (supportingPlayers[i].id == 'oggNative') {
						return false;
					}
				}
				if (/chrome/.test(navigator.userAgent.toLowerCase()) && mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('video/webm').length) {
					return false;
				}
				if ((mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('video/mp4').length && this.embedPlayer.mediaElement.getSources('video/mp4').length) || (mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('video/x-flv').length && this.embedPlayer.mediaElement.getSources('video/x-flv').length) || (mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('application/vnd.apple.mpegurl').length && this.embedPlayer.mediaElement.getSources('application/vnd.apple.mpegurl').length) || (mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('audio/mpeg').length && this.embedPlayer.mediaElement.getSources('audio/mpeg').length)) {
					return false;
				}
				return true;
			},
			addWarningBinding: function(preferenceId, warningMsg, hideDisableUi) {
				mw.log('mw.PlayerControlBuilder: addWarningBinding: ' + preferenceId + ' wm: ' + warningMsg);
				var embedPlayer = this.embedPlayer;
				var _this = this;
				if (embedPlayer.getWidth() < 200) {
					return false;
				}
				if (mw.getConfig(preferenceId) === true && $.cookie(preferenceId) == 'hidewarning') {
					return;
				}
				var warnId = "warningOverlay_" + embedPlayer.id;
				$('#' + warnId).remove();
				var $targetWarning = $('<div />').attr({
					'id': warnId
				}).addClass('ui-state-highlight ui-corner-all').css({
						'position': 'absolute',
						'background': '#333',
						'color': '#AAA',
						'top': '10px',
						'left': '10px',
						'right': '10px',
						'padding': '4px',
						'z-index': 2
					}).html(warningMsg);
				embedPlayer.getInterface().append($targetWarning);
				$targetWarning.append($('<br />'));
				if (!hideDisableUi) {
					$targetWarning.append($('<input type="checkbox" />').attr({
						'id': 'ffwarn_' + embedPlayer.id,
						'name': 'ffwarn_' + embedPlayer.id
					}).click(function() {
							mw.log("WarningBindinng:: set " + preferenceId + ' to hidewarning ');
							embedPlayer.setCookie(preferenceId, 'hidewarning', {
								expires: 30
							})
							mw.setConfig(preferenceId, false);
							$('#warningOverlay_' + embedPlayer.id).fadeOut('slow');
							_this.addWarningFlag = false;
						}));
					$targetWarning.append($('<label />').text(gM('mwe-embedplayer-do_not_warn_again')).attr('for', 'ffwarn_' + embedPlayer.id));
				}
				return $targetWarning;
			},
			doVolumeBinding: function() {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				embedPlayer.getInterface().find('.volume_control').unbind().buttonHover().click(function() {
					mw.log('Volume control toggle');
					embedPlayer.toggleMute();
				});
				if (this.volumeLayout == 'vertical') {
					var hoverOverDelay = false;
					var $targetvol = embedPlayer.getInterface().find('.vol_container').hide();
					embedPlayer.getInterface().find('.volume_control').hover(function() {
						$targetvol.addClass('vol_container_top');
						if (embedPlayer && embedPlayer.isPlaying && embedPlayer.isPlaying() && !embedPlayer.supports['overlays']) {
							$targetvol.removeClass('vol_container_top').addClass('vol_container_below');
						}
						$targetvol.fadeIn('fast');
						hoverOverDelay = true;
					}, function() {
						hoverOverDelay = false;
						setTimeout(function() {
							if (!hoverOverDelay) {
								$targetvol.fadeOut('fast');
							}
						}, 500);
					});
				}
				var userSlide = false;
				var sliderConf = {
					range: "min",
					value: 80,
					min: 0,
					max: 100,
					slide: function(event, ui) {
						var percent = ui.value / 100;
						mw.log('PlayerControlBuilder::slide:update volume:' + percent);
						embedPlayer.setVolume(percent);
						userSlide = true;
					},
					change: function(event, ui) {
						var percent = ui.value / 100;
						if (percent == 0) {
							embedPlayer.getInterface().find('.volume_control span').removeClass('ui-icon-volume-on').addClass('ui-icon-volume-off');
						} else {
							embedPlayer.getInterface().find('.volume_control span').removeClass('ui-icon-volume-off').addClass('ui-icon-volume-on');
						}
						mw.log('PlayerControlBuilder::change:update volume:' + percent);
						embedPlayer.setVolume(percent, userSlide);
						userSlide = false;
					}
				};
				if (this.volumeLayout == 'vertical') {
					sliderConf['orientation'] = "vertical";
				}
				embedPlayer.getInterface().find('.volume-slider').slider(sliderConf);
			},
			getOptionsMenu: function() {
				var $optionsMenu = $('<ul />');
				for (var menuItemKey in this.optionMenuItems) {
					if ($.inArray(menuItemKey, mw.getConfig('EmbedPlayer.EnabledOptionsMenuItems')) === -1) {
						continue;
					}
					$optionsMenu.append(this.optionMenuItems[menuItemKey](this));
				}
				return $optionsMenu;
			},
			onClipDone: function() {},
			onSeek: function() {
				this.setStatus(gM('mwe-embedplayer-seeking'));
				this.embedPlayer.addPlayerSpinner();
				this.embedPlayer.hideSpinnerOncePlaying();
			},
			setStatus: function(value) {
				if (this.embedPlayer.getInterface()) {
					this.embedPlayer.getInterface().find('.time-disp').html(value);
				}
			},
			optionMenuItems: {
				'share': function(ctrlObj) {
					return $.getLineItem(gM('mwe-embedplayer-share'), 'mail-closed', function() {
						ctrlObj.displayMenuOverlay(ctrlObj.getShare());
						$(ctrlObj.embedPlayer).trigger('showShareEvent');
					});
				},
				'aboutPlayerLibrary': function(ctrlObj) {
					return $.getLineItem(gM('mwe-embedplayer-about-library'), 'info', function() {
						ctrlObj.displayMenuOverlay(ctrlObj.aboutPlayerLibrary());
						$(ctrlObj.embedPlayer).trigger('aboutPlayerLibrary');
					});
				}
			},
			closeMenuOverlay: function() {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				var $overlay = embedPlayer.getInterface().find('.overlay-win,.ui-widget-overlay,.ui-widget-shadow');
				if ($overlay.length && !embedPlayer._playContorls && !$overlay.find('.overlayCloseButton').length) {
					embedPlayer.enablePlayControls();
				}
				this.displayOptionsMenuFlag = false;
				$overlay.fadeOut("slow", function() {
					$overlay.remove();
				});
				$overlay.remove();
				if (embedPlayer.isStopped() && (embedPlayer.sequenceProxy && embedPlayer.sequenceProxy.isInSequence == false)) {
					embedPlayer.getInterface().find('.play-btn-large').fadeIn('slow');
				}
				$(embedPlayer).trigger('closeMenuOverlay');
				return false;
			},
			displayMenuOverlay: function(overlayContent, closeCallback, hideCloseButton) {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				mw.log('PlayerControlBuilder:: displayMenuOverlay');
				this.displayOptionsMenuFlag = true;
				if (!this.supportedComponents['overlays']) {
					embedPlayer.stop();
				}
				embedPlayer.hideLargePlayBtn();
				if (embedPlayer.getInterface().find('.overlay-win').length != 0) {
					embedPlayer.getInterface().find('.overlay-content').html(overlayContent);
					return;
				}
				var $overlayContainer = embedPlayer.getInterface();
				if (hideCloseButton) {
					$overlayContainer = embedPlayer.getVideoHolder();
					embedPlayer.disablePlayControls(['playlistPrevNext']);
					embedPlayer.getInterface().find('.play-btn').unbind('click').click(function() {
						if (embedPlayer._playContorls) {
							embedPlayer.play();
						}
					})
				}
				$overlayContainer.append($('<div />').addClass('ui-widget-overlay').css({
					'height': '100%',
					'width': '100%',
					'z-index': 2
				}));
				var $closeButton = [];
				if (!hideCloseButton) {
					$closeButton = $('<div />').addClass('ui-state-default ui-corner-all ui-icon_link rButton overlayCloseButton').css({
						'position': 'absolute',
						'cursor': 'pointer',
						'top': '2px',
						'right': '2px'
					}).click(function() {
							_this.closeMenuOverlay();
							if (closeCallback) {
								closeCallback();
							}
						}).append($('<span />').addClass('ui-icon ui-icon-closethick'));
				}
				var overlayMenuCss = {
					'height': '100%',
					'width': '100%',
					'position': 'absolute',
					'margin': '0 10px 10px 0',
					'overflow': 'auto',
					'padding': '4px',
					'z-index': 3
				};
				var $overlayMenu = $('<div />').addClass('overlay-win ui-state-default ui-widget-header ui-corner-all').css(overlayMenuCss).append($closeButton, $('<div />').addClass('overlay-content').append(overlayContent));
				$overlayContainer.prepend($overlayMenu).find('.overlay-win').fadeIn("slow");
				$(embedPlayer).trigger('displayMenuOverlay');
				return false;
			},
			closeAlert: function(keepOverlay) {
				var embedPlayer = this.embedPlayer;
				var $alert = embedPlayer.getInterface().find('.alert-container');
				mw.log('mw.PlayerControlBuilder::closeAlert');
				if (!keepOverlay || (mw.isIpad() && this.inFullScreen)) {
					embedPlayer.controlBuilder.closeMenuOverlay();
				}
				$alert.remove();
				return false;
			},
			displayAlert: function(alertObj) {
				var embedPlayer = this.embedPlayer;
				var callback;
				mw.log('PlayerControlBuilder::displayAlert:: ' + alertObj.title);
				if (embedPlayer.getInterface().find('.overlay-win').length != 0) {
					return;
				}
				if (typeof alertObj.callbackFunction == 'string') {
					if (alertObj.isExternal) {
						try {
							callback = window.parent[alertObj.callbackFunction];
						} catch (e) {}
					} else {
						callback = window[alertObj.callbackFunction];
					}
				} else if (typeof alertObj.callbackFunction == 'function') {
					callback = alertObj.callbackFunction;
				} else {
					callback = function() {};
				}
				var $container = $('<div />').addClass('alert-container');
				var $title = $('<div />').text(alertObj.title).addClass('alert-title alert-text');
				if (alertObj.props && alertObj.props.titleTextColor) {
					$title.removeClass('alert-text');
					$title.css('color', mw.getHexColor(alertObj.props.titleTextColor));
				}
				var $message = $('<div />').html(alertObj.message).addClass('alert-message alert-text');
				if (alertObj.isError) {
					$message.addClass('error');
				}
				if (alertObj.props && alertObj.props.textColor) {
					$message.removeClass('alert-text');
					$message.css('color', mw.getHexColor(alertObj.props.textColor));
				}
				var $buttonsContainer = $('<div />').addClass('alert-buttons-container');
				if (alertObj.props && alertObj.props.buttonRowSpacing) {
					$buttonsContainer.css('margin-top', alertObj.props.buttonRowSpacing);
				}
				var $buttonSet = alertObj.buttons || [];
				var buttonsNum = $buttonSet.length;
				if (buttonsNum == 0 && !alertObj.noButtons) {
					$buttonSet = ["OK"];
					buttonsNum++;
				}
				$.each($buttonSet, function(i) {
					var label = this.toString();
					var $currentButton = $('<button />').addClass('alert-button').text(label).click(function(eventObject) {
						callback(eventObject);
						embedPlayer.controlBuilder.closeAlert(alertObj.keepOverlay);
					});
					if (alertObj.props && alertObj.props.buttonHeight) {
						$currentButton.css('height', alertObj.props.buttonHeight);
					}
					if (buttonsNum > 1) {
						if (i < buttonsNum - 1) {
							if (alertObj.props && alertObj.props.buttonSpacing) {
								$currentButton.css('margin-right', alertObj.props.buttonSpacing);
							}
						}
					}
					$buttonsContainer.append($currentButton);
				});
				$container.append($title, $message, $buttonsContainer);
				return embedPlayer.controlBuilder.displayMenuOverlay($container, false, true);
			},
			aboutPlayerLibrary: function() {
				return $('<div />').append($('<h2 />').text(gM('mwe-embedplayer-about-library')), $('<span />').append(gM('mwe-embedplayer-about-library-desc', $('<a />').attr({
					'href': mw.getConfig('EmbedPlayer.LibraryPage'),
					'target': '_new'
				}))));
			},
			getShare: function() {
				var embedPlayer = this.embedPlayer;
				var embed_code = embedPlayer.getSharingEmbedCode();
				var _this = this;
				var $shareInterface = $('<div />');
				var $shareList = $('<ul />');
				$shareList.append($('<li />').text(gM('mwe-embedplayer-embed_site_or_blog')));
				$shareInterface.append($('<h2 />').text(gM('mwe-embedplayer-share_this_video')));
				$shareInterface.append($shareList);
				var $shareButton = false;
				if (!mw.isIpad()) {
					$shareButton = $('<button />').addClass('ui-state-default ui-corner-all copycode').text(gM('mwe-embedplayer-copy-code')).click(function() {
						$shareInterface.find('textarea').focus().select();
						if (document.selection) {
							var copiedTxt = document.selection.createRange();
							copiedTxt.execCommand("Copy");
						}
					});
				}
				$shareInterface.append($('<textarea />').attr('rows', 4).html(embed_code).click(function() {
					$(this).select();
				}), $('<br />'), $('<br />'), $shareButton);
				return $shareInterface;
			},
			getPlayerSelect: function() {
				mw.log('PlayerControlBuilder::getPlayerSelect: source:' + this.embedPlayer.mediaElement.selectedSource.getSrc() + ' player: ' + this.embedPlayer.selectedPlayer.id);
				var embedPlayer = this.embedPlayer;
				var _this = this;
				var $playerSelect = $('<div />').append($('<h2 />').text(gM('mwe-embedplayer-choose_player')));
				$.each(embedPlayer.mediaElement.getPlayableSources(), function(sourceId, source) {
					var isPlayable = (typeof mw.EmbedTypes.getMediaPlayers().defaultPlayer(source.getMIMEType()) == 'object');
					var isSelected = (source.getSrc() == embedPlayer.mediaElement.selectedSource.getSrc());
					$playerSelect.append($('<h3 />').text(source.getTitle()));
					if (isPlayable) {
						var $playerList = $('<ul />');
						var supportingPlayers = mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers(source.getMIMEType());
						for (var i = 0; i < supportingPlayers.length; i++) {
							if (embedPlayer.selectedPlayer.id == supportingPlayers[i].id && isSelected) {
								var $playerLine = $('<span />').append($('<a />').attr({
										'href': '#'
									}).addClass('active').text(supportingPlayers[i].getName())).click(function() {
										embedPlayer.controlBuilder.closeMenuOverlay();
									});
							} else {
								$playerLine = $('<a />').attr({
									'href': '#',
									'id': 'sc_' + sourceId + '_' + supportingPlayers[i].id
								}).addClass('ui-corner-all').text(supportingPlayers[i].getName()).click(function() {
										var iparts = $(this).attr('id').replace(/sc_/, '').split('_');
										var sourceId = iparts[0];
										var player_id = iparts[1];
										mw.log('PlayerControlBuilder:: source id: ' + sourceId + ' player id: ' + player_id);
										embedPlayer.controlBuilder.closeMenuOverlay();
										if (_this.isInFullScreen()) {
											_this.restoreWindowPlayer();
										}
										embedPlayer.mediaElement.setSourceByIndex(sourceId);
										var playableSources = embedPlayer.mediaElement.getPlayableSources();
										mw.EmbedTypes.getMediaPlayers().setPlayerPreference(player_id, playableSources[sourceId].getMIMEType());
										embedPlayer.stop();
										return false;
									}).hover(function() {
										$(this).addClass('active');
									}, function() {
										$(this).removeClass('active');
									});
							}
							$playerList.append($('<li />').append($playerLine));
						}
						$playerSelect.append($playerList);
					} else {
						$playerSelect.append(gM('mwe-embedplayer-no-player', source.getTitle()));
					}
				});
				return $playerSelect;
			},
			showDownload: function($target) {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				_this.showDownloadWithSources($target);
			},
			showDownloadWithSources: function($target) {
				var _this = this;
				mw.log('PlayerControlBuilder:: showDownloadWithSources::' + $target.length);
				var embedPlayer = this.embedPlayer;
				$target.empty();
				$target.append($('<div />'));
				$target = $target.find('div');
				var $mediaList = $('<ul />');
				var $textList = $('<ul />');
				$.each(embedPlayer.mediaElement.getSources(), function(index, source) {
					if (source.getSrc()) {
						mw.log("showDownloadWithSources:: Add src: " + source.getTitle());
						var fileName = source.mwtitle;
						if (!fileName) {
							var path = new mw.Uri(source.getSrc()).path;
							var pathParts = path.split('/');
							fileName = pathParts[pathParts.length - 1];
						}
						var $dlLine = $('<li />').append($('<a />').attr({
							'href': source.getSrc(),
							'download': fileName
						}).text(source.getTitle()));
						if (source.getSrc().indexOf('?t=') !== -1) {
							$target.append($dlLine);
						} else if (this.getMIMEType().indexOf('text') === 0) {
							$textList.append($dlLine);
						} else {
							$mediaList.append($dlLine);
						}
					}
				});
				if ($mediaList.find('li').length != 0) {
					$target.append($('<h2 />').text(gM('mwe-embedplayer-download_full')), $mediaList);
				}
				if ($textList.find('li').length != 0) {
					$target.append($('<h2 />').html(gM('mwe-embedplayer-download_text')), $textList);
				}
			},
			getSwitchSourceMenu: function() {
				var _this = this;
				var embedPlayer = this.embedPlayer;
				var $sourceMenu = $('<ul />');

				function addToSourceMenu(source) {
					var icon = (source.getSrc() == embedPlayer.mediaElement.selectedSource.getSrc()) ? 'bullet' : 'radio-on';
					$sourceMenu.append($.getLineItem(source.getShortTitle(), icon, function() {
						mw.log('PlayerControlBuilder::SwitchSourceMenu: ' + source.getSrc());
						$(this).parent().siblings().find('span.ui-icon').removeClass('ui-icon-bullet').addClass('ui-icon-radio-on');
						$(this).find('span.ui-icon').removeClass('ui-icon-radio-on').addClass('ui-icon-bullet');
						embedPlayer.getInterface().find('.source-switch').text(source.getShortTitle());
						embedPlayer.mediaElement.setSource(source);
						if (!_this.embedPlayer.isStopped()) {
							var oldMediaTime = _this.embedPlayer.getPlayerElement().currentTime;
							var oldPaused = _this.embedPlayer.paused;
							embedPlayer.playerSwitchSource(source, function(vid) {
								embedPlayer.setCurrentTime(oldMediaTime, function() {
									if (oldPaused) {
										embedPlayer.pause();
									}
								});
							});
						}
					}));
				}
				var sources = this.embedPlayer.mediaElement.getPlayableSources();
				if (sources[0].getBitrate()) {
					sources.sort(function(a, b) {
						return a.getBitrate() - b.getBitrate();
					});
				}
				$.each(sources, function(sourceIndex, source) {
					var supportingPlayers = mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers(source.getMIMEType());
					for (var i = 0; i < supportingPlayers.length; i++) {
						if (supportingPlayers[i].library == 'Native') {
							addToSourceMenu(source);
						}
					}
				});
				return $sourceMenu;
			},
			getComponent: function(componentId) {
				if (this.components[componentId]) {
					return this.components[componentId].o(this);
				} else {
					return false;
				}
			},
			getComponentHeight: function(componentId) {
				if (this.components[componentId] && this.components[componentId].h) {
					return this.components[componentId].h;
				}
				return 0;
			},
			getComponentWidth: function(componentId) {
				if (this.components[componentId] && this.components[componentId].w) {
					return this.components[componentId].w;
				}
				return 0;
			},
			disableSeekBar: function() {
				var $playHead = this.embedPlayer.getInterface().find(".play_head");
				if ($playHead.length) {
					$playHead.slider("option", "disabled", true);
				}
			},
			enableSeekBar: function() {
				var $playHead = this.embedPlayer.getInterface().find(".play_head");
				if ($playHead.length) {
					$playHead.slider("option", "disabled", false);
				}
			},
			components: {
				'playButtonLarge': {
					'w': 70,
					'h': 53,
					'o': function(ctrlObj) {
						return $('<div />').attr({
							'title': gM('mwe-embedplayer-play_clip'),
							'class': "play-btn-large"
						}).click(function() {
								ctrlObj.embedPlayer.play();
								return false;
							});
					}
				},
				'attributionButton': {
					'w': 28,
					'o': function(ctrlObj) {
						var buttonConfig = mw.getConfig('EmbedPlayer.AttributionButton');
						if (buttonConfig.iconurl) {
							var $icon = $('<img />').attr('src', buttonConfig.iconurl);
						} else {
							var $icon = $('<span />').addClass('ui-icon');
							if (buttonConfig['class']) {
								$icon.addClass(buttonConfig['class']);
							}
						}
						if (typeof buttonConfig.style != 'object') {
							buttonConfig.style = {};
						}
						if (buttonConfig.style.width) {
							this.w = parseInt(buttonConfig.style.width);
						} else {
							buttonConfig.style.width = parseInt(this.w) + 'px';
						}
						return $('<div />').addClass('rButton').css({
							'top': '1px',
							'left': '2px'
						}).css(buttonConfig.style).append($('<a />').attr({
								'href': buttonConfig.href,
								'title': buttonConfig.title,
								'target': '_new'
							}).append($icon));
					}
				},
				'options': {
					'w': 28,
					'o': function(ctrlObj) {
						return $('<div />').attr('title', gM('mwe-embedplayer-player_options')).addClass('ui-state-default ui-corner-all ui-icon_link rButton options-btn').append($('<span />').addClass('ui-icon ui-icon-wrench')).buttonHover().menu({
							'content': ctrlObj.getOptionsMenu(),
							'zindex': mw.getConfig('EmbedPlayer.FullScreenZIndex') + 2,
							'positionOpts': {
								'directionV': 'up',
								'offsetY': 30,
								'directionH': 'left',
								'offsetX': -28
							}
						});
					}
				},
				'fullscreen': {
					'w': 24,
					'o': function(ctrlObj) {
						var $btn = $('<div />').attr('title', gM('mwe-embedplayer-player_fullscreen')).addClass("ui-state-default ui-corner-all ui-icon_link rButton fullscreen-btn").append($('<span />').addClass("ui-icon ui-icon-arrow-4-diag")).buttonHover();
						if ((mw.getConfig('EmbedPlayer.IsIframeServer') && mw.isIpad3()) || mw.getConfig("EmbedPlayer.NewWindowFullscreen")) {
							var url = ctrlObj.embedPlayer.getIframeSourceUrl();
							return $('<a />').attr({
								'href': url,
								'target': '_new'
							}).click(function() {
									var url = $(this).attr('href');
									var iframeMwConfig = {};
									iframeMwConfig['EmbedPlayer.IsFullscreenIframe'] = true;
									iframeMwConfig['EmbedPlayer.IframeCurrentTime'] = ctrlObj.embedPlayer.currentTime;
									iframeMwConfig['EmbedPlayer.IframeIsPlaying'] = ctrlObj.embedPlayer.isPlaying();
									iframeMwConfig['EmbedPlayer.IframeParentUrl'] = document.URL;
									url += '#' + encodeURIComponent(JSON.stringify({
										'mwConfig': iframeMwConfig,
										'playerId': ctrlObj.embedPlayer.id
									}));
									ctrlObj.embedPlayer.pause();
									var newwin = window.open(url, ctrlObj.embedPlayer.id, 'width=' + screen.width + ', height=' + (screen.height - 90) + ', top=0, left=0' + ', fullscreen=yes');
									if (newwin === null) {
										return true;
									}
									if (window.focus) {
										newwin.focus();
									}
									return false;
								}).append($btn);
						} else {
							return $btn.click(function() {
								ctrlObj.embedPlayer.fullscreen();
							});
						}
					}
				},
				'pause': {
					'w': 28,
					'o': function(ctrlObj) {
						return $('<div />').attr('title', gM('mwe-embedplayer-play_clip')).addClass("ui-state-default ui-corner-all ui-icon_link lButton play-btn").append($('<span />').addClass("ui-icon ui-icon-play")).buttonHover().click(function() {
							ctrlObj.embedPlayer.play();
						});
					}
				},
				'volumeControl': {
					'w': 28,
					'o': function(ctrlObj) {
						mw.log('PlayerControlBuilder::Set up volume control for: ' + ctrlObj.embedPlayer.id);
						var $volumeOut = $('<span />');
						if (ctrlObj.volumeLayout == 'horizontal') {
							$volumeOut.append($('<div />').addClass("ui-slider ui-slider-horizontal rButton volume-slider"));
						}
						$volumeOut.append($('<div />').attr('title', gM('mwe-embedplayer-volume_control')).addClass("ui-state-default ui-corner-all ui-icon_link rButton volume_control").append($('<span />').addClass("ui-icon ui-icon-volume-on")));
						if (ctrlObj.volumeLayout == 'vertical') {
							$volumeOut.find('.volume_control').append($('<div />').hide().addClass("vol_container ui-corner-all").append($('<div />').addClass("volume-slider")));
						}
						return $volumeOut.html();
					}
				},
				'sourceSwitch': {
					'w': 70,
					'o': function(ctrlObj) {
						var $menuContainer = $('<div />').addClass('swMenuContainer').hide();
						ctrlObj.embedPlayer.getInterface().append($menuContainer)
						var getSourceSwitch = function() {
							return $('<div />').addClass('ui-widget source-switch').css('height', ctrlObj.getHeight()).append(ctrlObj.embedPlayer.mediaElement.selectedSource.getShortTitle()).menu({
								'content': ctrlObj.getSwitchSourceMenu(),
								'zindex': mw.getConfig('EmbedPlayer.FullScreenZIndex') + 2,
								'keepPosition': true,
								'targetMenuContainer': $menuContainer,
								'width': 160,
								'showSpeed': 0,
								'createMenuCallback': function() {
									var $interface = ctrlObj.embedPlayer.getInterface();
									var $sw = $interface.find('.source-switch');
									var $swMenuContainer = $interface.find('.swMenuContainer');
									var height = $swMenuContainer.find('li').length * 24;
									if (height > $interface.height() - 30) {
										height = $interface.height() - 30;
									}
									var top = $interface.height() - height - ctrlObj.getHeight() - 8;
									$menuContainer.css({
										'position': 'absolute',
										'left': $sw[0].offsetLeft - 30,
										'top': top,
										'bottom': ctrlObj.getHeight(),
										'height': height
									})
									ctrlObj.showControlBar(true);
								},
								'closeMenuCallback': function() {
									ctrlObj.restoreControlsHover()
								}
							});
						}
						ctrlObj.embedPlayer.bindHelper('onChangeMediaDone', function() {
							$('.ui-widget.source-switch').replaceWith(getSourceSwitch());
						})
						return getSourceSwitch();
					}
				},
				'timeDisplay': {
					'w': mw.getConfig('EmbedPlayer.TimeDisplayWidth'),
					'o': function(ctrlObj) {
						return $('<div />').addClass("ui-widget time-disp").append(ctrlObj.embedPlayer.getTimeRange());
					}
				},
				'playHead': {
					'w': 0,
					'o': function(ctrlObj) {
						var sliderConfig = {
							range: "min",
							value: 0,
							min: 0,
							max: 1000,
							animate: mw.getConfig('EmbedPlayer.MonitorRate') - (mw.getConfig('EmbedPlayer.MonitorRate') / 30),
							start: function(event, ui) {
								var id = (embedPlayer.pc != null) ? embedPlayer.pc.pp.id : embedPlayer.id;
								embedPlayer.userSlide = true;
								$(id + ' .play-btn-large').fadeOut('fast');
								embedPlayer.startTimeSec = (embedPlayer.instanceOf == 'mvPlayList') ? 0 : mw.npt2seconds(embedPlayer.getTimeRange().split('/')[0]);
							},
							slide: function(event, ui) {
								var perc = ui.value / 1000;
								$(this).find('.ui-slider-handle').attr('data-title', mw.seconds2npt(perc * embedPlayer.getDuration()));
								embedPlayer.jumpTime = mw.seconds2npt(parseFloat(parseFloat(embedPlayer.getDuration()) * perc) + embedPlayer.startTimeSec);
								if (_this.longTimeDisp) {
									ctrlObj.setStatus(gM('mwe-embedplayer-seek_to', embedPlayer.jumpTime));
								} else {
									ctrlObj.setStatus(embedPlayer.jumpTime);
								}
								if (embedPlayer.isPlaying == false) {
									embedPlayer.updateThumbPerc(perc);
								}
							},
							change: function(event, ui) {
								var perc = ui.value / 1000;
								$(this).find('.ui-slider-handle').attr('data-title', mw.seconds2npt(perc * embedPlayer.getDuration()));
								if (embedPlayer.userSlide) {
									embedPlayer.userSlide = false;
									embedPlayer.seeking = true;
									embedPlayer.seekTimeSec = mw.npt2seconds(embedPlayer.jumpTime, true);
									mw.log('PlayerControlBuilder:: seek to: ' + embedPlayer.jumpTime + ' perc:' + perc + ' sts:' + embedPlayer.seekTimeSec);
									ctrlObj.setStatus(gM('mwe-embedplayer-seeking'));
									if (embedPlayer.isStopped()) {
										embedPlayer.play();
									}
									embedPlayer.seek(perc);
								}
							}
						};
						var embedPlayer = ctrlObj.embedPlayer;
						if (embedPlayer.sequenceProxy) {
							sliderConfig['disabled'] = true;
						}
						var _this = this;
						var $playHead = $('<div />').addClass("play_head").css({
							"position": 'absolute',
							"left": (ctrlObj.components.pause.w + 2) + 'px',
							"right": ((embedPlayer.getPlayerWidth() - ctrlObj.availableWidth) - ctrlObj.components.pause.w) + 'px'
						}).slider(sliderConfig);
						$playHead.find('.ui-slider-handle').css('z-index', 4).attr('data-title', mw.seconds2npt(0));
						$playHead.find('.ui-slider-range').addClass('ui-corner-all').css('z-index', 2);
						$playHead.append($('<div />').addClass("ui-slider-range ui-slider-range-min ui-widget-header").addClass("ui-state-highlight ui-corner-all mw_buffer"));
						return $playHead;
					}
				}
			}
		};
	})(window.mediaWiki, window.jQuery);;
}, {
	"all": ".mwPlayerContainer video{width:100%;height:100%}.videoHolder{position:relative;overflow:hidden;width:100%;height:100%;background:#000}.mwPlayerContainer.fullscreen{position:absolute !important;width:100% !important;height:100%! important;z-index:9999;min-height:100%;top:0;left:0;margin:0}.mwPlayerContainer{position:relative;overflow:hidden}.mwEmbedPlayer{width:100%;height:100%;overflow:hidden;position:absolute;top:0;left:0}.mv-player .control-bar.hover{width:100%;position:absolute;bottom:0;left:0}.player_select_list{color:white;font-size:10pt; }.player_select_list a:visited{color:white}.mv_playhead{position:absolute;top:0;left:0;width:17px;height:21px; }.mv_status{font-family:\"Times New Roman\",Times,serif;font-size:14px;float:left}.set_ogg_player_pref{text-align:left}.large_play_button{display:block;width:130px;height:96px;margin:auto; position:absolute;z-index:3;cursor:pointer} .mv-player .overlay-win{background:transparent;border:0} .mv-player .overlay-content{padding:10px}.mv-player .overlay-content h3{display:block;font-size:16px;font-weight:bold;color:#fff;font-family:arial}.mv-player .overlay-win h2{font-size:18px;margin-top:0}.mv-player .overlay-content div{font-size:12px;color:#fff;font-weight:bold}.mv-player .overlay-content div a{color:#00a8ff }.mv-player .overlay-content div a:hover{color:#3abcff }.mv-player .overlay-content ul{list-style:none;margin:0 0 10px 0;padding:0}.mv-player .vol_container{background:#272727;opacity:.90;filter:Alpha(Opacity=90);position:absolute;left:0px}.mv-player .ui-icon ui-icon-closethick{border:1px solid #606060;background:#222;font-weight:normal;color:#EEE}.mv-player .overlay-win textarea{background:#e4e4e4;height:35px;padding:6px;color:#666;border:0}.mv-player .overlay-content .copycode{color:#333;padding:8px 12px;font-weight:bold;float:right;cursor:pointer}.control-bar .ui-icon_link{border:0}.control-bar .ui-state-hover{border:0}.control-bar{position:relative;overflow:visible}\n\n/* cache key: resourceloader:filter:minify-css:7:71bc5bbcd4458d38866310f6fde25df5 */\n"
}, {
	"mwe-embedplayer-credit-title": "Title: $1",
	"mwe-embedplayer-credit-date": "Date: $1",
	"mwe-embedplayer-credit-author": "Author: $1",
	"mwe-embedplayer-nocredits": "No credits available",
	"mwe-embedplayer-loading_plugin": "Loading plugin ...",
	"mwe-embedplayer-select_playback": "Set playback preference",
	"mwe-embedplayer-link_back": "Link back",
	"mwe-embedplayer-error_swap_vid": "Error: mwEmbed was unable to swap the video tag for the mwEmbed interface",
	"mwe-embedplayer-add_to_end_of_sequence": "Add to end of sequence",
	"mwe-embedplayer-missing_video_stream": "The video file for this stream is missing",
	"mwe-embedplayer-play_clip": "Play clip",
	"mwe-embedplayer-pause_clip": "Pause clip",
	"mwe-embedplayer-volume_control": "Volume control",
	"mwe-embedplayer-volume-mute": "Mute",
	"mwe-embedplayer-volume-unmute": "Unmute",
	"mwe-embedplayer-player_options": "Player options",
	"mwe-embedplayer-timed_text": "Timed text",
	"mwe-embedplayer-player_fullscreen": "Fullscreen",
	"mwe-embedplayer-player_closefullscreen": "Exit Fullscreen",
	"mwe-embedplayer-next_clip_msg": "Play next clip",
	"mwe-embedplayer-prev_clip_msg": "Play previous clip",
	"mwe-embedplayer-current_clip_msg": "Continue playing this clip",
	"mwe-embedplayer-seek_to": "Seek $1",
	"mwe-embedplayer-paused": "paused",
	"mwe-embedplayer-download_segment": "Download selection:",
	"mwe-embedplayer-download_full": "Download full video file:",
	"mwe-embedplayer-download_right_click": "To download, right click and select <i>Save link as...<\/i>",
	"mwe-embedplayer-download_clip": "Download video",
	"mwe-embedplayer-download_text": "Download text",
	"mwe-embedplayer-download": "Download",
	"mwe-embedplayer-share": "Share",
	"mwe-embedplayer-credits": "Credits",
	"mwe-embedplayer-about-library": "About Kaltura player",
	"mwe-embedplayer-about-library-desc": "Kaltura's HTML5 media library enables you to take advantage of the HTML5 &lt;video&gt; and &lt;audio&gt; tags today with a consistent player interface across all major browsers.\r\n\r\n[$1 More about the Kaltura player library].",
	"mwe-embedplayer-clip_linkback": "Clip source page",
	"mwe-embedplayer-choose_player": "Choose video player",
	"mwe-embedplayer-no-player": "No player available for $1",
	"mwe-embedplayer-share_this_video": "Share this video",
	"mwe-embedplayer-video_credits": "Video credits",
	"mwe-embedplayer-no-video_credits": "No credits available",
	"mwe-embedplayer-kaltura-platform-title": "Kaltura open source video platform",
	"mwe-embedplayer-menu_btn": "Menu",
	"mwe-embedplayer-close_btn": "Close",
	"mwe-embedplayer-ogg-player-vlc-player": "VLC player",
	"mwe-embedplayer-ogg-player-oggNative": "HTML5 Ogg player",
	"mwe-embedplayer-ogg-player-h264Native": "HTML5 H.264 player",
	"mwe-embedplayer-ogg-player-webmNative": "HTML5 WebM player",
	"mwe-embedplayer-ogg-player-oggPlugin": "Generic Ogg plugin",
	"mwe-embedplayer-ogg-player-quicktime-mozilla": "QuickTime plugin",
	"mwe-embedplayer-ogg-player-quicktime-activex": "QuickTime ActiveX",
	"mwe-embedplayer-ogg-player-cortado": "Java Cortado",
	"mwe-embedplayer-ogg-player-flowplayer": "Flowplayer",
	"mwe-embedplayer-ogg-player-kplayer": "Kaltura player",
	"mwe-embedplayer-ogg-player-selected": "(selected)",
	"mwe-embedplayer-ogg-player-omtkplayer": "OMTK Flash Vorbis",
	"mwe-embedplayer-for_best_experience": "For a better video playback experience we recommend a [$1 html5 video browser].",
	"mwe-embedplayer-download-warn": "No compatible in browser player was detected, for in browser playback please download the [$1 latest Firefox]",
	"mwe-embedplayer-fullscreen-tip": "Press <b>F11<\/b> toggle <i>web browser<\/i> fullscreen",
	"mwe-embedplayer-fullscreen-tip-osx": "Press <b>shift \u2318 F<\/b> to toggle fullscreen",
	"mwe-embedplayer-do_not_warn_again": "In the future, do not show this message",
	"mwe-embedplayer-playerSelect": "Players",
	"mwe-embedplayer-read_before_embed": "<a href=\"http:\/\/mediawiki.org\/wiki\/Security_Notes_on_Remote_Embedding\" target=\"new\">Read this<\/a> before embedding.",
	"mwe-embedplayer-embed_site_or_blog": "Embed on a page",
	"mwe-embedplayer-related_videos": "Related videos",
	"mwe-embedplayer-seeking": "seeking",
	"mwe-embedplayer-buffering": "buffering",
	"mwe-embedplayer-copy-code": "Copy code",
	"mwe-embedplayer-video-h264": "H.264 video",
	"mwe-embedplayer-video-webm": "WebM video",
	"mwe-embedplayer-video-flv": "Flash video",
	"mwe-embedplayer-video-ogg": "Ogg video",
	"mwe-embedplayer-video-audio": "Ogg audio",
	"mwe-embedplayer-audio-mpeg": "MPEG audio",
	"mwe-embedplayer-video-3gp": "3GP video",
	"mwe-embedplayer-video-mpeg": "MPEG video",
	"mwe-embedplayer-video-msvideo": "AVI video",
	"mwe-embedplayer-missing-source": "No source video was found"
});
mw.loader.implement("mw.EmbedPlayerImageOverlay", function($) {
	(function(mw, $) {
		"use strict";
		mw.EmbedPlayerImageOverlay = {
			instanceOf: 'ImageOverlay',
			playerReady: true,
			lastPauseTime: 0,
			currentTime: 0,
			startOffset: 0,
			clockStartTime: 0,
			imageLoaded: false,
			init: function() {
				if (this['native_instaceOf'] == 'Native') {
					return;
				}
				for (var i in mw.EmbedPlayerNative) {
					if (typeof mw.EmbedPlayerImageOverlay[i] != 'undefined') {
						this['native_' + i] = mw.EmbedPlayerNative[i];
					} else {
						this[i] = mw.EmbedPlayerNative[i];
					}
				}
			},
			updatePlaybackInterface: function(callback) {
				mw.log('EmbedPlayerImageOverlay:: updatePlaybackInterface: ' + $(this).siblings('.playerPoster').length);
				$(this.getPlayerElement()).css('left', 0);
				this.parent_updatePlaybackInterface(callback);
			},
			updatePosterHTML: function() {
				var vid = this.getPlayerElement();
				$(vid).empty()
				this.embedPlayerHTML();
				this.addLargePlayBtn();
			},
			play: function() {
				mw.log('EmbedPlayerImageOverlay::play> lastPauseTime:' + this.lastPauseTime + ' ct: ' + this.currentTime);
				this.captureUserGesture();
				this.applyIntrinsicAspect();
				if (this.currentTime > this.getDuration()) {
					this.currentTime = this.pauseTime = 0;
				}
				this.stopped = false;
				this.parent_play();
				this.playInterfaceUpdate();
				this.clockStartTime = new Date().getTime();
				this.bufferedPercent = 0;
				this.monitor();
			},
			getDuration: function() {
				if (this.duration) {
					return this.duration;
				}
				this.updateDuration();
				return this.duration;
			},
			updateDuration: function() {
				if ($(this).data('imageDuration')) {
					this.duration = parseFloat($(this).data('imageDuration'));
				} else {
					this.duration = parseFloat(mw.getConfig("EmbedPlayer.DefaultImageDuration"));
				}
			},
			stop: function() {
				this.currentTime = 0;
				this.parent_stop();
			},
			_onpause: function() {},
			pause: function() {
				mw.log('EmbedPlayerImageOverlay::pause, lastPauseTime: ' + this.lastPauseTime);
				this.lastPauseTime = this.currentTime;
				this.parent_pause();
			},
			monitor: function() {
				if (this.duration == 0) {
					return;
				}
				var oldCurrentTime = this.currentTime;
				if (this.currentTime >= this.duration) {
					this.updatePlayHead(0);
					this.stopMonitor();
					$(this).trigger('ended');
				} else {
					this.parent_monitor();
				}
				if (oldCurrentTime != this.currentTime) {
					$(this).trigger('timeupdate');
				}
			},
			seek: function(seekPercent) {
				this.lastPauseTime = seekPercent * this.getDuration();
				this.seeking = false;
				$(this).trigger('seeking');
				$(this).trigger('seeked');
				this.play();
			},
			setCurrentTime: function(time, callback) {
				this.lastPauseTime = time;
				$(this).trigger('seeking');
				$(this).trigger('seeked');
				if (callback) {
					callback();
				}
			},
			playerSwitchSource: function(source, switchCallback, doneCallback) {
				mw.log("EmbedPlayerImageOverlay:: playerSwitchSource");
				var _this = this;
				this.mediaElement.selectedSource = source;
				this.addPlayerSpinner();
				this.captureUserGesture();
				this.embedPlayerHTML(function() {
					mw.log("EmbedPlayerImageOverlay:: playerSwitchSource, embedPlayerHTML callback");
					_this.applyIntrinsicAspect();
					_this.play();
					if (switchCallback) {
						switchCallback(_this);
					}
					$(_this).bind('ended.playerSwitchSource', function() {
						_this.stopMonitor();
						$(_this).unbind('ended.playerSwitchSource');
						if (doneCallback) {
							doneCallback(_this);
						}
					})
				});
			},
			captureUserGesture: function() {
				if (!$(this).data('previousInstanceOf')) {
					$(this).data('previousInstanceOf', this.instanceOf);
					var vid = this.getPlayerElement();
					$(vid).attr('src', null);
					this.triggerHelper('AddEmptyBlackSources', [vid]);
					vid.load();
				}
			},
			updatePosterSrc: function(posterSrc) {
				var _this = this;
				if (!posterSrc) {
					posterSrc = mw.getConfig('EmbedPlayer.BlackPixel');
				}
				this.poster = posterSrc;
				$(this).find('img.playerPoster').attr('src', this.poster).load(function() {
					_this.applyIntrinsicAspect();
				})
			},
			embedPlayerHTML: function(callback) {
				var _this = this;
				mw.log('EmbedPlayerImageOverlay::embedPlayerHTML: ' + this.id);
				this.updateDuration();
				var currentSoruceObj = this.mediaElement.selectedSource;
				_this.imageLoaded = false;
				if (!currentSoruceObj) {
					mw.log("Error:: EmbedPlayerImageOverlay:embedPlayerHTML> missing source");
					return;
				}
				var loadedCallback = function() {
					_this.applyIntrinsicAspect();
					_this.clockStartTime = new Date().getTime();
					_this.imageLoaded = true;
					_this.monitor();
					if ($.isFunction(callback)) {
						callback();
					}
				}
				var $image = $('<img />').css({
					'position': 'absolute'
				}).attr({
						'src': currentSoruceObj.getSrc()
					}).addClass('playerPoster').one('load', function() {
						if ($.isFunction(loadedCallback)) {
							loadedCallback();
							loadedCallback = null;
						}
					}).each(function() {
						if (this.complete) {
							$(this).load();
						}
					})
				$(this.getPlayerElement()).css({
					'left': this.getWidth() + 50,
					'position': 'absolute'
				});
				this.getPlayerElement().pause();
				$(this).html($image);
			},
			getPlayerElementTime: function() {
				if (!this.imageLoaded) {
					mw.log('image not loaded: 0');
					this.currentTime = 0;
				} else if (this.paused) {
					this.currentTime = this.lastPauseTime;
					mw.log('paused time: ' + this.currentTime);
				} else {
					this.currentTime = ((new Date().getTime() - this.clockStartTime) / 1000) + this.lastPauseTime;
					mw.log('clock time: ' + this.currentTime);
				}
				return this.currentTime;
			}
		};
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("mw.EmbedPlayerNative", function($) {
	(function(mw, $) {
		"use strict";
		mw.EmbedPlayerNative = {
			instanceOf: 'Native',
			onlyLoadFlag: false,
			onLoadedCallback: null,
			prevCurrentTime: -1,
			progressEventData: null,
			mediaLoadedFlag: null,
			keepPlayerOffScreenFlag: null,
			ignoreNextNativeEvent: null,
			currentSeekTargetTime: null,
			nativeEvents: ['loadstart', 'progress', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'play', 'pause', 'loadedmetadata', 'loadeddata', 'waiting', 'playing', 'canplay', 'canplaythrough', 'seeking', 'seeked', 'timeupdate', 'ended', 'ratechange', 'durationchange', 'volumechange'],
			supports: {
				'playHead': true,
				'pause': true,
				'fullscreen': true,
				'sourceSwitch': true,
				'timeDisplay': true,
				'volumeControl': true,
				'overlays': true
			},
			updateFeatureSupport: function() {
				if (this.useNativePlayerControls()) {
					this.supports.overlays = false;
				}
				if (!this.supportsVolumeControl()) {
					this.supports.volumeControl = false;
				}
				if (this.getPlayerElement() && this.getSrc()) {
					$(this.getPlayerElement()).attr('src', this.getSrc());
				}
				if (this.getPlayerElement()) {
					this.applyMediaElementBindings();
				}
				this.parent_updateFeatureSupport();
			},
			supportsVolumeControl: function() {
				return !(mw.isIpad() || mw.isAndroid() || mw.isMobileChrome() || this.useNativePlayerControls())
			},
			addPlayScreenWithNativeOffScreen: function() {
				var _this = this;
				this.hidePlayerOffScreen();
				this.keepPlayerOffScreenFlag = true;
				this.addLargePlayBtn();
				this.$interface.find('.play-btn-large').click(function() {
					_this.$interface.find('.play-btn-large').hide();
					_this.addPlayerSpinner();
					_this.hideSpinnerOncePlaying();
				});
				var posterSrc = (this.poster) ? this.poster : mw.getConfig('EmbedPlayer.BlackPixel');
				if ($(this).find('.playerPoster').length) {
					$(this).find('.playerPoster').attr('src', posterSrc);
				} else {
					$(this).append($('<img />').css({
						'margin': '0',
						'width': '100%',
						'height': '100%'
					}).attr('src', posterSrc).addClass('playerPoster').load(function() {
							_this.applyIntrinsicAspect();
						}))
				}
				$(this).show();
			},
			embedPlayerHTML: function() {
				var _this = this;
				var vid = _this.getPlayerElement();
				this.ignoreNextNativeEvent = true;
				if (this.useLargePlayBtn()) {
					this.addLargePlayBtn();
				}
				if (vid) {
					$(vid).empty();
				}
				if (vid && $(vid).attr('src') == this.getSrc(this.currentTime)) {
					_this.postEmbedActions();
					return;
				}
				mw.log("EmbedPlayerNative::embedPlayerHTML > play url:" + this.getSrc(this.currentTime) + ' startOffset: ' + this.start_ntp + ' end: ' + this.end_ntp);
				if (this.isPersistentNativePlayer() && vid) {
					_this.postEmbedActions();
					return;
				}
				_this.bufferStartFlag = false;
				_this.bufferEndFlag = false;
				$(this).html(_this.getNativePlayerHtml());
				_this.postEmbedActions();
			},
			getNativePlayerHtml: function(playerAttribtues, cssSet) {
				if (!playerAttribtues) {
					playerAttribtues = {};
				}
				if (!playerAttribtues['id']) {
					playerAttribtues['id'] = this.pid;
				}
				if (!playerAttribtues['src']) {
					playerAttribtues['src'] = this.getSrc(this.currentTime);
				}
				if (this.autoplay) {
					playerAttribtues['autoplay'] = 'true';
				}
				if (!cssSet) {
					cssSet = {};
				}
				if (!cssSet['width']) cssSet['width'] = '100%';
				if (!cssSet['height']) cssSet['height'] = '100%';
				if (this.loop) {
					playerAttribtues['loop'] = 'true';
				}
				var tagName = this.isAudio() ? 'audio' : 'video';
				return $('<' + tagName + ' />').addClass('nativeEmbedPlayerPid').attr(playerAttribtues).css(cssSet)
			},
			canAutoPlay: function() {
				return !mw.isAndroid() && !mw.isMobileChrome() && !mw.isIOS();
			},
			postEmbedActions: function() {
				var _this = this;
				var vid = this.getPlayerElement();
				if (!vid) {
					return;
				}
				if ($(vid).attr('src') != this.getSrc(this.currentTime)) {
					$(vid).attr('src', this.getSrc(this.currentTime));
				}
				if (mw.getConfig('EmbedPlayer.WebKitPlaysInline')) {
					$(vid).attr('webkit-playsinline', 1);
				}
				if (mw.getConfig('EmbedPlayer.WebKitAllowAirplay')) {
					$(vid).attr('x-webkit-airplay', "allow");
				}
				if (this.useNativePlayerControls()) {
					$(vid).attr('controls', "true");
				}
				$(vid).show();
				_this.applyMediaElementBindings();
				if (this.currentTime != vid.currentTime) {
					var waitReadyStateCount = 0;
					var checkReadyState = function() {
						if (vid.readyState > 0) {
							vid.currentTime = this.currentTime;
							return;
						}
						if (waitReadyStateCount > 1000) {
							mw.log("Error: EmbedPlayerNative: could not run native seek");
							return;
						}
						waitReadyStateCount++;
						setTimeout(function() {
							checkReadyState();
						}, 10);
					};
				}
				if (!_this.loop && mw.isIOS()) {
					mw.log("EmbedPlayerNative::postEmbedActions: issue .load() call");
					vid.load();
				}
			},
			applyMediaElementBindings: function() {
				var _this = this;
				mw.log("EmbedPlayerNative::MediaElementBindings");
				var vid = this.getPlayerElement();
				if (!vid) {
					mw.log(" Error: applyMediaElementBindings without player elemnet");
					return;
				}
				$.each(_this.nativeEvents, function(inx, eventName) {
					$(vid).unbind(eventName + '.embedPlayerNative').bind(eventName + '.embedPlayerNative', function() {
						if (_this._propagateEvents && _this.instanceOf == 'Native') {
							var argArray = $.makeArray(arguments);
							if (_this['_on' + eventName]) {
								_this['_on' + eventName].apply(_this, argArray);
							} else {
								$(_this).trigger(eventName, argArray);
							}
						}
					});
				});
			},
			monitor: function() {
				var _this = this;
				var vid = _this.getPlayerElement();
				if (vid && vid.buffered && vid.buffered.end && vid.duration) {
					try {
						this.bufferedPercent = (vid.buffered.end(vid.buffered.length - 1) / vid.duration);
					} catch (e) {}
				}
				_this.parent_monitor();
			},
			seek: function(percent, stopAfterSeek) {
				var _this = this;
				if (percent < 0) {
					percent = 0;
				}
				if (percent > 1) {
					percent = 1;
				}
				mw.log('EmbedPlayerNative::seek p: ' + percent + ' : ' + this.supportsURLTimeEncoding() + ' dur: ' + this.getDuration() + ' sts:' + this.seekTimeSec);
				this.kPreSeekTime = _this.currentTime;
				this.triggerHelper('preSeek', percent);
				this.seeking = true;
				this.currentTime = (percent * this.duration).toFixed(2);
				mw.log('EmbedPlayerNative::seek:trigger');
				this.triggerHelper('seeking');
				this.controlBuilder.onSeek();
				if (this.supportsURLTimeEncoding()) {
					if (percent < this.bufferedPercent && this.playerElement.duration && !this.didSeekJump) {
						mw.log("EmbedPlayerNative::seek local seek " + percent + ' is already buffered < ' + this.bufferedPercent);
						this.doNativeSeek(percent);
					} else {
						this.parent_seek(percent);
					}
				} else {
					this.doNativeSeek(percent, function() {
						if (stopAfterSeek) {
							_this.hideSpinnerAndPlayBtn();
							_this.pause();
							_this.updatePlayheadStatus();
						}
					});
				}
			},
			doNativeSeek: function(percent, callback) {
				var _this = this;
				if ((navigator.userAgent.indexOf('Chrome') === -1) && _this.playerElement.seeking) {
					return;
				}
				mw.log('EmbedPlayerNative::doNativeSeek::' + percent);
				this.seeking = true;
				this.seekTimeSec = 0;
				if (mw.isIOS()) {
					this.hidePlayerOffScreen();
				}
				var targetTime = percent * this.getDuration();
				if (this.startOffset) {
					targetTime += parseFloat(this.startOffset);
				}
				this.setCurrentTime(targetTime, function() {
					_this.currentTime = _this.getPlayerElement().currentTime;
					if (_this.seeking) {
						_this.seeking = false;
						$(_this).trigger('seeked');
					}
					_this.restorePlayerOnScreen();
					_this.monitor();
					if (callback) {
						callback();
					}
				});
			},
			doPlayThenSeek: function(percent) {
				mw.log('EmbedPlayerNative::doPlayThenSeek::' + percent + ' isPaused ' + this.paused);
				var _this = this;
				var oldPauseState = this.paused;
				this.play();
				var retryCount = 0;
				var readyForSeek = function() {
					_this.getPlayerElement();
					if (_this.playerElement && _this.playerElement.duration) {
						_this.doNativeSeek(percent, function() {
							if (oldPauseState) {
								_this.pause();
							}
						});
					} else {
						if (retryCount < 800) {
							setTimeout(readyForSeek, 10);
							retryCount++;
						} else {
							mw.log('EmbedPlayerNative:: Error: doPlayThenSeek failed :' + _this.playerElement.duration);
						}
					}
				};
				readyForSeek();
			},
			setCurrentTime: function(seekTime, callback, callbackCount) {
				var _this = this;
				if (!callbackCount) {
					callbackCount = 0;
				}
				seekTime = parseFloat(seekTime);
				mw.log("EmbedPlayerNative:: setCurrentTime seekTime:" + seekTime + ' count:' + callbackCount);
				var vid = this.getPlayerElement();
				if (callbackCount == 0 && vid.currentTime == 0) {
					$(vid).attr('preload', 'auto')[0].load();
				}
				$(this).data('currentSeekTarget', seekTime);
				var callbackHandler = function() {
					_this.seeking = false;
					if ($.isFunction(callback)) {
						callback();
						callback = null;
					}
				}
				if (vid.readyState < 1) {
					if (callbackCount == 0 && vid.paused) {
						this.stopEventPropagation();
						$(vid).on('play.seekPrePlay', function() {
							_this.restoreEventPropagation();
							$(vid).off('play.seekPrePlay');
						});
						vid.load();
						vid.play();
					}
					if (callbackCount >= 15) {
						mw.log("Error:: EmbedPlayerNative: with seek request, media never in ready state");
						callbackHandler();
						return;
					}
					setTimeout(function() {
						if ($(_this).data('currentSeekTarget') != seekTime) {
							mw.log("EmbedPlayerNative:: expired seek target");
							return;
						}
						_this.setCurrentTime(seekTime, callback, callbackCount + 1);
					}, 1000);
					return;
				}
				if (vid.currentTime.toFixed(2) == seekTime.toFixed(2)) {
					mw.log("EmbedPlayerNative:: setCurrentTime: current time matches seek target: " + vid.currentTime.toFixed(2) + ' == ' + seekTime.toFixed(2));
					callbackHandler();
					return;
				}
				var seekBind = 'seeked.nativeSeekBind';
				$(vid).unbind(seekBind).bind(seekBind, function(event) {
					$(vid).unbind(seekBind);
					if (seekTime == 0 && vid.currentTime == 0) {
						callbackHandler();
						return;
					}
					if (vid.currentTime > 0) {
						callbackHandler();
					} else {
						mw.log("Error:: EmbedPlayerNative: seek callback without time updatet " + vid.currentTime);
					}
				});
				setTimeout(function() {
					if ($(_this).data('currentSeekTarget') != seekTime) {
						mw.log("EmbedPlayerNative:: Expired seek target");
						return;
					}
					if ($.isFunction(callback)) {
						if (Math.abs(vid.currentTime - seekTime) < 5) {
							mw.log("EmbedPlayerNative:: Video time: " + vid.currentTime + " is within 5 seconds of target" + seekTime + ", sucessfull seek");
							callbackHandler();
						} else {
							mw.log("Error:: EmbedPlayerNative: Seek still has not made a callback after 5 seconds, retry");
							_this.setCurrentTime(seekTime, callback, callbackCount++);
						}
					}
				}, 5000);
				try {
					_this.seeking = true;
					_this.currentSeekTargetTime = seekTime.toFixed(2);
					vid.currentTime = _this.currentSeekTargetTime;
				} catch (e) {
					mw.log("Error:: EmbedPlayerNative: Could not set video tag seekTime");
					callbackHandler();
					return;
				}
				if (!vid.seeking) {
					mw.log("Error:: not entering seek state, play and wait for positive time");
					vid.play();
					setTimeout(function() {
						_this.waitForPositiveCurrentTime(function() {
							mw.log("EmbedPlayerNative:: Got possitive time:" + vid.currentTime.toFixed(2) + ", trying to seek again");
							_this.setCurrentTime(seekTime, callback, callbackCount + 1);
						});
					}, mw.getConfig('EmbedPlayer.MonitorRate'));
				}
			},
			waitForPositiveCurrentTime: function(callback) {
				var _this = this;
				var vid = this.getPlayerElement();
				this.waitForPositiveCurrentTimeCount++;
				if (vid.currentTime > 0) {
					mw.log('EmbedPlayerNative:: waitForPositiveCurrentTime success');
					callback();
				} else if (this.waitForPositiveCurrentTimeCount > 200) {
					mw.log("Error:: waitForPositiveCurrentTime failed to reach possitve time");
					callback();
				} else {
					setTimeout(function() {
						_this.waitForPositiveCurrentTime(callback)
					}, 50)
				}
			},
			getPlayerElementTime: function() {
				var _this = this;
				this.getPlayerElement();
				if (!this.playerElement) {
					mw.log('EmbedPlayerNative::getPlayerElementTime: ' + this.id + ' not in dom ( stop monitor)');
					this.stop();
					return false;
				}
				var ct = this.playerElement.currentTime;
				if (!ct || isNaN(ct) || ct < 0 || !isFinite(ct)) {
					return 0;
				}
				return this.playerElement.currentTime;
			},
			updatePosterSrc: function(src) {
				if (this.getPlayerElement()) {
					$(this.getPlayerElement()).attr('poster', src);
				}
				this.parent_updatePosterSrc(src);
			},
			emptySources: function() {
				$(this.getPlayerElement()).attr('src', null);
				this.parent_emptySources();
			},
			playerSwitchSource: function(source, switchCallback, doneCallback) {
				var _this = this;
				var src = source.getSrc();
				var vid = this.getPlayerElement();
				var switchBindPostfix = '.playerSwitchSource';
				this.isPauseLoading = false;
				if (!src || src == vid.src) {
					if ($.isFunction(switchCallback)) {
						switchCallback(vid);
					}
					if ($.isFunction(doneCallback)) {
						doneCallback();
					}
					return;
				}
				$(vid).attr('preload', 'auto');
				mw.log('EmbedPlayerNative:: playerSwitchSource: ' + src + ' native time: ' + vid.currentTime);
				this.ignoreNextNativeEvent = true;
				this.currentTime = 0;
				this.previousTime = 0;
				if (vid) {
					try {
						$(vid).unbind(switchBindPostfix);
						vid.pause();
						var originalControlsState = vid.controls;
						vid.removeAttribute('controls');
						_this.seeking = false;
						_this.addPlayerSpinner();
						$(vid).empty();
						vid.src = src;
						if (mw.isDesktopSafari()) {
							vid.load();
						}
						_this.hidePlayerOffScreen();
						$(vid).bind('loadedmetadata' + switchBindPostfix, function() {
							$(vid).unbind('loadedmetadata' + switchBindPostfix);
							mw.log("EmbedPlayerNative:: playerSwitchSource> loadedmetadata callback for:" + src);
							_this.restorePlayerOnScreen();
							if ($.isFunction(switchCallback)) {
								vid.play();
							}
						});
						var handleSwitchCallback = function() {
							_this.restorePlayerOnScreen();
							_this.hideSpinnerAndPlayBtn();
							vid.controls = originalControlsState;
							if ($.isFunction(switchCallback)) {
								mw.log("EmbedPlayerNative:: playerSwitchSource> call switchCallback");
								switchCallback(vid);
								switchCallback = null;
							}
						}
						$(vid).bind('playing' + switchBindPostfix, function() {
							$(vid).unbind('playing' + switchBindPostfix);
							mw.log("EmbedPlayerNative:: playerSwitchSource> playing callback: " + vid.currentTime);
							handleSwitchCallback();
						});
						if ($.isFunction(doneCallback)) {
							$(vid).bind('ended' + switchBindPostfix, function(event) {
								if (_this.mobileChromeTimeoutID) {
									clearTimeout(_this.mobileChromeTimeoutID);
									_this.mobileChromeTimeoutID = null;
								}
								$(vid).unbind(switchBindPostfix);
								doneCallback();
								return false;
							});
							if (mw.isMobileChrome()) {
								$(vid).bind('timeupdate' + switchBindPostfix, function(e) {
									var _this = this;
									var timeDiff = this.duration - this.currentTime;
									if (timeDiff < 0.5) {
										_this.mobileChromeTimeoutID = setTimeout(function() {
											_this.mobileChromeTimeoutID = null;
											if (timeDiff <= (_this.duration - _this.currentTime)) {
												mw.log('EmbedPlayerNative:: playerSwitchSource> error in getting ended event, issue doneCallback directly.');
												$(vid).unbind(switchBindPostfix);
												doneCallback();
											}
										}, 2000);
									}
								});
							}
						}
						vid.play();
						setTimeout(function() {
							if (vid.readyState === 0 && $.isFunction(switchCallback) && !_this.canAutoPlay()) {
								mw.log("EmbedPlayerNative:: Error: possible play without user click gesture, issue callback");
								handleSwitchCallback();
								_this.pause();
								_this.addLargePlayBtn();
							}
						}, 5000);
					} catch (e) {
						mw.log("Error: EmbedPlayerNative Error in switching source playback");
					}
				}
			},
			hidePlayerOffScreen: function(vid) {
				var vid = this.getPlayerElement();
				$(vid).css({
					'position': 'absolute',
					'left': '-4048px'
				});
			},
			restorePlayerOnScreen: function(vid) {
				var vid = this.getPlayerElement();
				if (this.keepPlayerOffScreenFlag || this.instanceOf != 'Native') {
					return;
				}
				$(this).find('.playerPoster').remove();
				$(vid).css({
					'left': '0px',
					'top': '0px'
				});
			},
			pause: function() {
				this.getPlayerElement();
				this.parent_pause();
				if (this.playerElement) {
					this.playerElement.pause();
				}
			},
			play: function() {
				var vid = this.getPlayerElement();
				var _this = this;
				if (this.isStopped() && this._playContorls) {
					this.restorePlayerOnScreen();
				}
				if (_this.parent_play()) {
					if (this.getPlayerElement() && this.getPlayerElement().play) {
						mw.log("EmbedPlayerNative:: issue native play call:");
						if ($(vid).attr('src') != this.getSrc()) {
							$(vid).attr('src', this.getSrc());
						}
						if (this.isPauseLoading) {
							this.hideSpinnerOncePlaying();
						}
						$(this.getPlayerElement()).show();
						if (!_this.isAudio()) {
							$(this).find('.playerPoster').remove();
						}
						if (this.useNativePlayerControls() && $(this).find('video ').length == 0) {
							$(this).hide();
						}
						$(this.getPlayerElement()).attr('preload', "auto");
						this.getPlayerElement().play();
						this.monitor();
					}
				} else {
					mw.log("EmbedPlayerNative:: parent play returned false, don't issue play on native element");
				}
			},
			stop: function() {
				var _this = this;
				if (this.playerElement && this.playerElement.currentTime) {
					this.playerElement.currentTime = 0;
					this.playerElement.pause();
				}
				this.parent_stop();
			},
			toggleMute: function() {
				this.parent_toggleMute();
				this.getPlayerElement();
				if (this.playerElement) this.playerElement.muted = this.muted;
			},
			setPlayerElementVolume: function(percent) {
				if (this.getPlayerElement()) {
					if (percent != 0) {
						this.playerElement.muted = false;
					}
					this.playerElement.volume = percent;
				}
			},
			getPlayerElementVolume: function() {
				if (this.getPlayerElement()) {
					return this.playerElement.volume;
				}
			},
			getPlayerElementMuted: function() {
				if (this.getPlayerElement()) {
					return this.playerElement.muted;
				}
			},
			getNativeDuration: function() {
				if (this.playerElement) {
					return this.playerElement.duration;
				}
			},
			load: function(callback) {
				this.getPlayerElement();
				if (!this.playerElement) {
					mw.log('EmbedPlayerNative::load() ... doEmbed');
					this.onlyLoadFlag = true;
					this.embedPlayerHTML();
					this.onLoadedCallback = callback;
				} else {
					this.playerElement.load();
					if (callback) {
						callback();
					}
				}
			},
			getPlayerElement: function() {
				this.playerElement = $('#' + this.pid).get(0);
				return this.playerElement;
			},
			_onseeking: function() {
				mw.log("EmbedPlayerNative::onSeeking " + this.seeking + ' new time: ' + this.getPlayerElement().currentTime);
				if (this.seeking && Math.round(this.getPlayerElement().currentTime - this.currentSeekTargetTime) > 2) {
					mw.log("Error:: EmbedPlayerNative Seek time missmatch: target:" + this.getPlayerElement().currentTime + ' actual ' + this.currentSeekTargetTime + ', note apple HLS can only seek to 10 second targets');
				}
				if (!this.seeking) {
					this.currentSeekTargetTime = this.getPlayerElement().currentTime;
					this.seeking = true;
					this.controlBuilder.onSeek();
					mw.log("EmbedPlayerNative::seeking:trigger:: " + this.seeking);
					if (this._propagateEvents) {
						this.triggerHelper('seeking');
					}
				}
			},
			_onseeked: function() {
				mw.log("EmbedPlayerNative::onSeeked " + this.seeking + ' ct:' + this.playerElement.currentTime);
				this.previousTime = this.currentTime = this.playerElement.currentTime;
				this.kPreSeekTime = null;
				if (this.seeking) {
					if (Math.abs(this.currentSeekTargetTime - this.getPlayerElement().currentTime) > 2) {
						mw.log("Error:: EmbedPlayerNative:seeked triggred with time mismatch: target:" + this.currentSeekTargetTime + ' actual:' + this.getPlayerElement().currentTime);
						return;
					}
					this.seeking = false;
					if (this._propagateEvents) {
						mw.log("EmbedPlayerNative:: trigger: seeked");
						this.triggerHelper('seeked');
					}
				}
				this.hideSpinner();
				this.updatePlayheadStatus();
				if (this.isStopped()) {
					this.addLargePlayBtn();
				}
				this.monitor();
			},
			_onpause: function() {
				var _this = this;
				if (this.ignoreNextNativeEvent) {
					this.ignoreNextNativeEvent = false;
					return;
				}
				var timeSincePlay = Math.abs(this.absoluteStartPlayTime - new Date().getTime());
				mw.log("EmbedPlayerNative:: OnPaused:: propagate:" + this._propagateEvents + ' time since play: ' + timeSincePlay + ' isNative=true');
				if (timeSincePlay > mw.getConfig('EmbedPlayer.MonitorRate')) {
					_this.parent_pause();
					if (mw.isIphone()) {
						_this.updatePosterHTML();
					}
				} else {
					this.getPlayerElement().play();
				}
			},
			_onplay: function() {
				mw.log("EmbedPlayerNative:: OnPlay:: propogate:" + this._propagateEvents + ' paused: ' + this.paused);
				if (this.useNativePlayerControls() && $(this).find('video ').length == 0) {
					$(this).hide();
				}
				if (!this.ignoreNextNativeEvent && this._propagateEvents && this.paused && (mw.getConfig('EmbedPlayer.EnableIpadHTMLControls') === true)) {
					this.parent_play();
				} else {
					this.playInterfaceUpdate();
					this.absoluteStartPlayTime = new Date().getTime();
				}
				this.ignoreNextNativeEvent = false;
			},
			_onloadedmetadata: function() {
				this.getPlayerElement();
				if (!this.duration && this.playerElement && !isNaN(this.playerElement.duration) && isFinite(this.playerElement.duration)) {
					mw.log('EmbedPlayerNative :onloadedmetadata metadata ready Update duration:' + this.playerElement.duration + ' old dur: ' + this.getDuration());
					this.setDuration(this.playerElement.duration);
				}
				if (!this.paused && this._propagateEvents) {
					this.getPlayerElement().play();
				}
				if (typeof this.onLoadedCallback == 'function') {
					this.onLoadedCallback();
				}
				if (!this.mediaLoadedFlag) {
					$(this).trigger('mediaLoaded');
					this.mediaLoadedFlag = true;
				}
			},
			_onprogress: function(event) {
				var e = event.originalEvent;
				if (e && e.loaded && e.total) {
					this.bufferedPercent = e.loaded / e.total;
					this.progressEventData = e.loaded;
				}
			},
			_onended: function(event) {
				var _this = this;
				if (this.getPlayerElement()) {
					mw.log('EmbedPlayer:native: onended:' + this.playerElement.currentTime + ' real dur:' + this.getDuration() + ' ended ' + this._propagateEvents);
					if (this._propagateEvents) {
						this.onClipDone();
					}
				}
			},
			_onerror: function(event) {
				this.triggerHelper('embedPlayerError');
			},
			onClipDone: function() {
				var _this = this;
				$(this).unbind('onEndedDone.onClipDone').bind('onEndedDone.onClipDone', function() {
					_this.addPlayScreenWithNativeOffScreen();
					if (!_this.isImagePlayScreen()) {
						_this.keepPlayerOffScreenFlag = false;
					}
				});
				this.parent_onClipDone();
			}
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mw.EmbedTypes", function($) {
	(function(mw, $) {
		"use strict";
		var kplayer = new mw.MediaPlayer('kplayer', ['video/x-flv', 'video/h264', 'video/mp4', 'audio/mpeg'], 'Kplayer');
		var cortadoPlayer = new mw.MediaPlayer('cortado', ['video/ogg', 'audio/ogg', 'application/ogg'], 'Java');
		var oggNativePlayer = new mw.MediaPlayer('oggNative', ['video/ogg', 'audio/ogg', 'application/ogg'], 'Native');
		var h264NativePlayer = new mw.MediaPlayer('h264Native', ['video/h264', 'video/mp4'], 'Native');
		var appleVdnPlayer = new mw.MediaPlayer('appleVdn', ['application/vnd.apple.mpegurl'], 'Native');
		var mp3NativePlayer = new mw.MediaPlayer('mp3Native', ['audio/mpeg', 'audio/mp3'], 'Native');
		var webmNativePlayer = new mw.MediaPlayer('webmNative', ['video/webm'], 'Native');
		var imageOverlayPlayer = new mw.MediaPlayer('imageOverlay', ['image/jpeg', 'image/png'], 'ImageOverlay');
		mw.EmbedTypes = {
			mediaPlayers: null,
			detect_done: false,
			init: function() {
				this.detect();
				this.detect_done = true;
			},
			getMediaPlayers: function() {
				if (this.mediaPlayers) {
					return this.mediaPlayers;
				}
				this.mediaPlayers = new mw.MediaPlayers();
				this.detectPlayers();
				return this.mediaPlayers;
			},
			supportedMimeType: function(mimeType) {
				for (var i = 0; i < navigator.plugins.length; i++) {
					var plugin = navigator.plugins[i];
					if (typeof plugin[mimeType] != "undefined") {
						return true;
					}
				}
				return false;
			},
			addFlashPlayer: function() {
				if (!mw.getConfig('EmbedPlayer.DisableHTML5FlashFallback')) {
					this.mediaPlayers.addPlayer(kplayer);
				}
			},
			addJavaPlayer: function() {
				if (!mw.getConfig('EmbedPlayer.DisableJava')) {
					this.mediaPlayers.addPlayer(cortadoPlayer);
				}
			},
			detectPlayers: function() {
				mw.log("EmbedTypes::detectPlayers running detect");
				this.mediaPlayers.addPlayer(imageOverlayPlayer);
				try {
					var javaEnabled = navigator.javaEnabled();
				} catch (e) {}
				var uniqueMimesOnly = $.browser.opera || $.browser.safari;
				if (javaEnabled && (navigator.appName == 'Opera')) {
					this.addJavaPlayer();
				}
				if (mw.supportsFlash()) {
					this.addFlashPlayer();
				}
				if ($.browser.msie) {
					if (this.testActiveX('JavaWebStart.isInstalled')) {
						this.addJavaPlayer();
					}
				}
				if (!mw.getConfig('EmbedPlayer.DisableVideoTagSupport') && (typeof HTMLVideoElement == 'object' || typeof HTMLVideoElement == 'function')) {
					try {
						var dummyvid = document.createElement("video");
						if (dummyvid.canPlayType) {
							if (dummyvid.canPlayType('video/webm; codecs="vp8, vorbis"') && !mw.isAndroid40()) {
								this.mediaPlayers.addPlayer(webmNativePlayer);
							}
							if (this.supportedMimeType('audio/mpeg') || dummyvid.canPlayType('audio/mpeg; codecs="mp3"')) {
								this.mediaPlayers.addPlayer(mp3NativePlayer);
							}
							if (dummyvid.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
								this.mediaPlayers.addPlayer(h264NativePlayer);
								if (dummyvid.canPlayType('application/vnd.apple.mpegurl; codecs="avc1.42E01E"')) {
									if (navigator.userAgent.indexOf('Android 3.') == -1) {
										this.mediaPlayers.addPlayer(appleVdnPlayer);
									}
								}
							}
							if (mw.isAndroid2()) {
								this.mediaPlayers.addPlayer(h264NativePlayer);
							}
							if (dummyvid.canPlayType('video/ogg; codecs="theora,vorbis"')) {
								this.mediaPlayers.addPlayer(oggNativePlayer);
							} else if (this.supportedMimeType('video/ogg')) {
								this.mediaPlayers.addPlayer(oggNativePlayer);
							}
						}
					} catch (e) {
						mw.log('could not run canPlayType ' + e);
					}
				}
				if (navigator.mimeTypes && navigator.mimeTypes.length > 0) {
					for (var i = 0; i < navigator.mimeTypes.length; i++) {
						var type = navigator.mimeTypes[i].type;
						var semicolonPos = type.indexOf(';');
						if (semicolonPos > -1) {
							type = type.substr(0, semicolonPos);
						}
						var pluginName = navigator.mimeTypes[i].enabledPlugin ? navigator.mimeTypes[i].enabledPlugin.name : '';
						if (!pluginName) {
							pluginName = '';
						}
						if (type == 'application/x-java-applet') {
							this.addJavaPlayer();
							continue;
						}
						if ((type == 'video/mpeg' || type == 'video/x-msvideo')) {}
						if (type == 'application/ogg') {
							continue;
						} else if (uniqueMimesOnly) {
							if (type == 'application/x-vlc-player') {
								continue;
							} else if (type == 'video/quicktime') {
								continue;
							}
						}
					}
				}
				mw.log("EmbedPlayer::trigger:EmbedPlayerUpdateMediaPlayers");
				$(mw).trigger('EmbedPlayerUpdateMediaPlayers', this.mediaPlayers);
			},
			testActiveX: function(name) {
				mw.log("EmbedPlayer::detect: test testActiveX: " + name);
				var hasObj = true;
				try {
					var obj = new ActiveXObject('' + name);
				} catch (e) {
					hasObj = false;
				}
				return hasObj;
			}
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mw.KAnalytics", function($) {
	(function(mw, $) {
		"use strict";
		window['Kaltura'] = true;
		mw.KAnalytics = function(embedPlayer) {
			this.init(embedPlayer);
		};
		mw.addKAnalytics = function(embedPlayer) {
			embedPlayer.kAnalytics = new mw.KAnalytics(embedPlayer);
		}
		mw.KAnalytics.prototype = {
			embedPlayer: null,
			reportSet: null,
			lastSeekEventTime: 0,
			bindPostFix: '.kAnalytics',
			startReportTime: 0,
			kEventTypes: {
				'WIDGET_LOADED': 1,
				'MEDIA_LOADED': 2,
				'PLAY': 3,
				'PLAY_REACHED_25': 4,
				'PLAY_REACHED_50': 5,
				'PLAY_REACHED_75': 6,
				'PLAY_REACHED_100': 7,
				'OPEN_EDIT': 8,
				'OPEN_VIRAL': 9,
				'OPEN_DOWNLOAD': 10,
				'OPEN_REPORT': 11,
				'BUFFER_START': 12,
				'BUFFER_END': 13,
				'OPEN_FULL_SCREEN': 14,
				'CLOSE_FULL_SCREEN': 15,
				'REPLAY': 16,
				'SEEK': 17,
				'OPEN_UPLOAD': 18,
				'SAVE_PUBLISH': 19,
				'CLOSE_EDITOR': 20,
				'PRE_BUMPER_PLAYED': 21,
				'POST_BUMPER_PLAYED': 22,
				'BUMPER_CLICKED': 23,
				'FUTURE_USE_1': 24,
				'FUTURE_USE_2': 25,
				'FUTURE_USE_3': 26
			},
			init: function(embedPlayer) {
				this.version = mw.getConfig('version');
				this.embedPlayer = embedPlayer;
				if (!this.kClient) {
					this.kClient = mw.kApiGetPartnerClient(embedPlayer.kwidgetid);
				}
				$(embedPlayer).unbind(this.bindPostFix);
				this.resetPlayerflags();
				this.bindPlayerEvents();
			},
			resetPlayerflags: function() {
				this._p25Once = false;
				this._p50Once = false;
				this._p75Once = false;
				this._p100Once = false;
				this.hasSeeked = false;
				this.lastSeek = 0;
			},
			sendAnalyticsEvent: function(KalturaStatsEventKey) {
				var _this = this;
				this.kClient.getKS(function(ks) {
					_this.doSendAnalyticsEvent(ks, KalturaStatsEventKey);
				});
			},
			doSendAnalyticsEvent: function(ks, KalturaStatsEventKey) {
				var _this = this;
				mw.log("KAnalytics :: doSendAnalyticsEvent > " + KalturaStatsEventKey);
				if (this.embedPlayer.evaluate('{sequenceProxy.isInSequence}')) {
					return;
				}
				var eventKeyId = this.kEventTypes[KalturaStatsEventKey];
				var eventSet = {
					'eventType': eventKeyId,
					'clientVer': this.version,
					'currentPoint': parseInt(this.embedPlayer.currentTime * 1000),
					'duration': this.embedPlayer.getDuration(),
					'eventTimestamp': new Date().getTime(),
					'isFirstInSession': 'false',
					'objectType': 'KalturaStatsEvent',
					'partnerId': this.embedPlayer.kpartnerid,
					'sessionId': this.embedPlayer.evaluate('{configProxy.sessionId}'),
					'uiconfId': 0
				};
				if (isNaN(eventSet.duration)) {
					eventSet.duration = 0;
				}
				eventSet['seek'] = (this.hasSeeked) ? 'true' : 'false';
				if (this.embedPlayer.kentryid) {
					eventSet['entryId'] = this.embedPlayer.kentryid;
				} else {
					eventSet['entryId'] = this.embedPlayer.getSrc();
				}
				if (this.embedPlayer.kuiconfid) {
					eventSet['uiconfId'] = this.embedPlayer.kuiconfid;
				}
				if (this.embedPlayer.kwidgetid) {
					eventSet['widgetId'] = this.embedPlayer.kwidgetid;
				}
				var flashVarEvents = {
					'playbackContext': 'contextId',
					'originFeature': 'featureType',
					'applicationName': 'applicationId',
					'userId': 'userId'
				}
				for (var fvKey in flashVarEvents) {
					if (this.embedPlayer.getKalturaConfig('', fvKey)) {
						eventSet[flashVarEvents[fvKey]] = encodeURIComponent(this.embedPlayer.getKalturaConfig('', fvKey));
					}
				}
				eventSet['referrer'] = encodeURIComponent(mw.getConfig('EmbedPlayer.IframeParentUrl'));
				var eventRequest = {
					'service': 'stats',
					'action': 'collect'
				};
				for (var i in eventSet) {
					eventRequest['event:' + i] = eventSet[i];
				}
				$(this.embedPlayer).trigger('KalturaSendAnalyticEvent', [KalturaStatsEventKey, eventSet]);
				var parentTrackName = this.embedPlayer.getKalturaConfig('statistics', 'trackEventMonitor');
				if (mw.getConfig('EmbedPlayer.IsFriendlyIframe')) {
					try {
						if (window.parent[parentTrackName]) {
							window.parent[parentTrackName](KalturaStatsEventKey, eventSet);
						}
					} catch (e) {}
				}
				this.kClient.doRequest(eventRequest);
			},
			bindPlayerEvents: function() {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				var b = function(hookName, eventType) {
					$(_this.embedPlayer).bind(hookName + _this.bindPostFix, function() {
						_this.sendAnalyticsEvent(eventType);
					});
				};
				b('widgetLoaded', 'WIDGET_LOADED');
				b('KalturaSupport_EntryDataReady', 'MEDIA_LOADED');
				b('firstPlay', 'PLAY');
				b('showShareEvent', 'OPEN_VIRAL');
				b('showDownloadEvent', 'OPEN_DOWNLOAD');
				b('bufferStartEvent', 'BUFFER_START');
				b('bufferEndEvent', 'BUFFER_END');
				b('onOpenFullScreen', 'OPEN_FULL_SCREEN');
				b('onCloseFullScreen', 'CLOSE_FULL_SCREEN');
				b('replayEvent', 'REPLAY');
				$(embedPlayer).bind('seeked' + this.bindPostFix, function(seekTarget) {
					if (_this.lastSeekEventTime == 0 || _this.lastSeekEventTime + 2000 < new Date().getTime()) {
						_this.sendAnalyticsEvent('SEEK');
					}
					_this.lastSeekEventTime = new Date().getTime();
					this.hasSeeked = true;
					this.lastSeek = seekTarget;
				});
				$(embedPlayer).bind('monitorEvent' + this.bindPostFix, function() {
					_this.updateTimeStats();
				});
			},
			updateTimeStats: function() {
				var embedPlayer = this.embedPlayer;
				var _this = this;
				var percent = embedPlayer.currentTime / embedPlayer.duration;
				var seekPercent = this.lastSeek / embedPlayer.duration;
				if (!_this._p25Once && percent >= .25 && seekPercent <= .25) {
					_this._p25Once = true;
					_this.sendAnalyticsEvent('PLAY_REACHED_25');
				} else if (!_this._p50Once && percent >= .50 && seekPercent < .50) {
					_this._p50Once = true;
					_this.sendAnalyticsEvent('PLAY_REACHED_50');
				} else if (!_this._p75Once && percent >= .75 && seekPercent < .75) {
					_this._p75Once = true;
					_this.sendAnalyticsEvent('PLAY_REACHED_75');
				} else if (!_this._p100Once && percent >= .98 && seekPercent < 1) {
					_this._p100Once = true;
					_this.sendAnalyticsEvent('PLAY_REACHED_100');
				}
			}
		};
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("mw.KApi", function($) {
	(function(mw, $) {
		"use strict";
		mw.KApi = function(widgetId) {
			return this.init(widgetId);
		};
		mw.KApi.prototype = {
			baseParam: {
				'apiVersion': '3.1',
				'clientTag': 'html5:v' + window['MWEMBED_VERSION'],
				'expiry': '86400',
				'format': 9,
				'ignoreNull': 1
			},
			playerLoaderCache: [],
			ks: null,
			init: function(widgetId) {
				this.widgetId = widgetId;
			},
			clearCache: function() {
				this.playerLoaderCache = [];
				this.ks = null;
			},
			callbackIndex: 0,
			getWidgetId: function() {
				return this.widgetId;
			},
			doRequest: function(requestObject, callback, skipKS) {
				var _this = this;
				var param = {};
				if (!requestObject.length && !this.ks) {
					requestObject = [requestObject];
				}
				if (mw.getConfig('Kaltura.NoApiCache') === true) {
					param['nocache'] = 'true';
				}
				if (requestObject.length) {
					param['service'] = 'multirequest';
					param['action'] = 'null';
					var mulitRequestIndex = 1;
					for (var i = 0; i < requestObject.length; i++) {
						var requestInx = mulitRequestIndex + i;
						for (var paramKey in requestObject[i]) {
							if (typeof requestObject[i][paramKey] == 'object') {
								for (var subParamKey in requestObject[i][paramKey]) {
									param[requestInx + ':' + paramKey + ':' + subParamKey] = requestObject[i][paramKey][subParamKey];
								}
							} else {
								param[requestInx + ':' + paramKey] = requestObject[i][paramKey];
							}
						}
					}
				} else {
					param = requestObject;
				}
				for (var i in this.baseParam) {
					if (typeof param[i] == 'undefined') {
						param[i] = this.baseParam[i];
					}
				};
				if (skipKS) {
					_this.doApiRequest(param, callback);
				} else {
					this.getKS(function(ks) {
						param['ks'] = ks;
						_this.doApiRequest(param, callback);
					});
				}
			},
			setKS: function(ks) {
				this.ks = ks;
			},
			getKS: function(callback) {
				if (this.ks) {
					callback(this.ks);
					return true;
				}
				var _this = this;
				var ksParam = {
					'action': 'startwidgetsession',
					'widgetId': '_' + this.widget_id
				};
				var param = $.extend({
					'service': 'session'
				}, this.baseParam, ksParam);
				this.doApiRequest(param, function(data) {
					_this.ks = data.ks;
					callback(_this.ks);
				});
			},
			doApiRequest: function(param, callback) {
				var _this = this;
				var serviceType = param['service'];
				delete param['service'];
				if (serviceType != 'session') {
					param['kalsig'] = _this.getSignature(param);
				}
				var requestURL = _this.getApiUrl(serviceType) + '&' + $.param(param);
				var globalCBName = 'kapi_' + _this.getSignature(param);
				if (window[globalCBName]) {
					mw.log("Error global callback name already exists: " + globalCBName);
					this.callbackIndex++;
					globalCBName = globalCBName + this.callbackIndex;
				}
				window[globalCBName] = function(data) {
					if (callback) {
						callback(data);
						callback = null;
					}
				};
				requestURL += '&callback=' + globalCBName;
				mw.log("kAPI:: doApiRequest: " + requestURL);
				$.getScript(requestURL);
			},
			getApiUrl: function(serviceType) {
				var serviceUrl = mw.getConfig('Kaltura.ServiceUrl');
				if (serviceType && serviceType == 'stats' && mw.getConfig('Kaltura.StatsServiceUrl')) {
					serviceUrl = mw.getConfig('Kaltura.StatsServiceUrl');
				}
				return serviceUrl + mw.getConfig('Kaltura.ServiceBase') + serviceType;
			},
			getSignature: function(params) {
				params = this.ksort(params);
				var str = "";
				for (var v in params) {
					var k = params[v];
					str += k + v;
				}
				return MD5(str);
			},
			ksort: function(arr) {
				var sArr = [];
				var tArr = [];
				var n = 0;
				for (i in arr) {
					tArr[n++] = i + "|" + arr[i];
				}
				tArr = tArr.sort();
				for (var i = 0; i < tArr.length; i++) {
					var x = tArr[i].split("|");
					sArr[x[0]] = x[1];
				}
				return sArr;
			},
			playerLoader: function(kProperties, callback) {
				var _this = this;
				var requestObject = [];
				var entryIdValue;
				var refIndex;
				if (!kProperties.reference_id && kProperties.flashvars && kProperties.flashvars['referenceId']) {
					kProperties.reference_id = kProperties.flashvars['referenceId'];
				}
				if (this.getCacheKey(kProperties) && this.playerLoaderCache[this.getCacheKey(kProperties)]) {
					mw.log("KApi:: playerLoader load from cache: " + !! (this.playerLoaderCache[this.getCacheKey(kProperties)]));
					callback(this.playerLoaderCache[this.getCacheKey(kProperties)]);
					return;
				}
				var fillCacheAndRunCallback = function(namedData) {
					_this.playerLoaderCache[_this.getCacheKey(kProperties)] = namedData;
					callback(namedData);
				}
				if (!kProperties.reference_id && !kProperties.entry_id) {
					mw.log("KApi:: entryId and referenceId not found, exit.");
					callback({
						error: "Empty player"
					});
					return;
				}
				if (kProperties.flashvars && kProperties.flashvars.ks) {
					this.setKS(kProperties.flashvars.ks);
				}
				if (kProperties.entry_id) {
					entryIdValue = kProperties.entry_id;
					requestObject.push({
						'service': 'baseentry',
						'action': 'get',
						'version': '-1',
						'entryId': kProperties.entry_id
					});
				} else if (kProperties.reference_id) {
					requestObject.push({
						'service': 'baseentry',
						'action': 'listByReferenceId',
						'refId': kProperties.reference_id
					});
					if (kProperties.uiconf_id) {
						refIndex = 2;
					} else {
						refIndex = 1;
					}
					entryIdValue = '{' + refIndex + ':result:objects:0:id}';
				}
				requestObject.push({
					'contextDataParams': {
						'referrer': window.kWidgetSupport.getHostPageUrl(),
						'objectType': 'KalturaEntryContextDataParams',
						'flavorTags': 'all'
					},
					'service': 'baseentry',
					'entryId': entryIdValue,
					'action': 'getContextData'
				});
				requestObject.push({
					'service': 'metadata_metadata',
					'action': 'list',
					'version': '-1',
					'filter:metadataObjectTypeEqual': 1,
					'filter:orderBy': '+createdAt',
					'filter:objectIdEqual': entryIdValue,
					'pager:pageSize': 1
				});
				var loadCuePoints = true;
				if (kProperties.flashvars && kProperties.flashvars.getCuePointsData && kProperties.flashvars.getCuePointsData == "false") {
					loadCuePoints = false;
				}
				if (loadCuePoints) {
					requestObject.push({
						'service': 'cuepoint_cuepoint',
						'action': 'list',
						'filter:objectType': 'KalturaCuePointFilter',
						'filter:orderBy': '+startTime',
						'filter:statusEqual': 1,
						'filter:entryIdEqual': entryIdValue
					});
				}
				_this.getNamedDataFromRequest(requestObject, fillCacheAndRunCallback);
			},
			getNamedDataFromRequest: function(requestObject, callback) {
				var _this = this;
				this.doRequest(requestObject, function(data) {
					var namedData = {};
					if (data[0].code) {
						mw.log('Error in kaltura api response: ' + data[0].message);
						callback({
							'error': data[0].message
						});
						return;
					}
					var dataIndex = 0;
					if (data[0]['confFile']) {
						namedData['uiConf'] = data[dataIndex]['confFile'];
						dataIndex++;
						if (data.length == 1) {
							callback(namedData);
							return;
						}
					}
					if (requestObject[dataIndex]['action'] == 'listByReferenceId') {
						if (!data[dataIndex].objects || (data[dataIndex].objects && data[dataIndex].objects.length == 0)) {
							namedData['meta'] = {
								code: 'ENTRY_ID_NOT_FOUND',
								message: 'Entry with reference id ' + requestObject[dataIndex]['refId'] + ' not found'
							};
						} else {
							namedData['meta'] = data[dataIndex].objects[0];
						}
					} else {
						namedData['meta'] = data[dataIndex];
					}
					dataIndex++;
					namedData['contextData'] = data[dataIndex];
					dataIndex++;
					namedData['entryMeta'] = _this.convertCustomDataXML(data[dataIndex]);
					dataIndex++;
					if (data[dataIndex] && data[dataIndex].totalCount > 0) {
						namedData['entryCuePoints'] = data[dataIndex].objects;
					}
					callback(namedData);
				});
			},
			convertCustomDataXML: function(data) {
				var result = {};
				if (data && data.objects && data.objects[0]) {
					var xml = $.parseXML(data.objects[0].xml);
					var $xml = $(xml).find('metadata').children();
					$.each($xml, function(inx, node) {
						result[node.nodeName] = node.textContent;
					});
				}
				return result;
			},
			getCacheKey: function(kProperties) {
				var rKey = '';
				if (kProperties) {
					$.each(kProperties, function(inx, value) {
						if (inx == 'flashvars') {
							if (typeof kProperties.flashvars == 'object') {
								rKey += kProperties.flashvars.getCuePointsData;
								rKey += kProperties.flashvars.ks
							}
						} else {
							rKey += inx + '_' + value;
						}
					});
				}
				return rKey;
			}
		};
		mw.KApiPartnerCache = [];
		mw.kApiGetPartnerClient = function(widgetId) {
			if (!mw.KApiPartnerCache[widgetId]) {
				mw.KApiPartnerCache[widgetId] = new mw.KApi(widgetId);
			}
			return mw.KApiPartnerCache[widgetId];
		};
		mw.KApiPlayerLoader = function(kProperties, callback) {
			if (!kProperties.widget_id) {
				mw.log("Error:: mw.KApiPlayerLoader:: cant run player loader with widget_id " + kProperties.widget_id);
			}
			var kClient = mw.kApiGetPartnerClient(kProperties.widget_id);
			kClient.playerLoader(kProperties, function(data) {
				setTimeout(function() {
					callback(data);
				}, 0);
			});
			return kClient;
		};
		mw.KApiRequest = function(widgetId, requestObject, callback) {
			var kClient = mw.kApiGetPartnerClient(widgetId);
			kClient.doRequest(requestObject, callback);
		};
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("mw.KCuePoints", function($) {
	(function(mw, $) {
		"use strict";
		mw.KCuePoints = function(embedPlayer) {
			return this.init(embedPlayer);
		};
		mw.KCuePoints.prototype = {
			bindPostfix: '.kCuePoints',
			midCuePointsArray: [],
			init: function(embedPlayer) {
				var _this = this;
				this.destroy();
				this.embedPlayer = embedPlayer;
				embedPlayer.bindHelper('KalturaSupport_CuePointsReady' + this.bindPostfix, function() {
					_this.processCuePoints();
					_this.addPlayerBindings();
				});
			},
			destroy: function() {
				$(this.embedPlayer).unbind(this.bindPostfix);
			},
			processCuePoints: function() {
				var _this = this;
				var cuePoints = this.getCuePoints();
				var newCuePointsArray = [];
				$.each(cuePoints, function(idx, cuePoint) {
					if (_this.getVideoAdType(cuePoint) == 'pre' || _this.getVideoAdType(cuePoint) == 'post') {
						_this.triggerCuePoint(cuePoint);
					} else {
						newCuePointsArray.push(cuePoint);
					}
				});
				this.midCuePointsArray = newCuePointsArray;
			},
			addPlayerBindings: function() {
				var _this = this;
				var currentCuePoint = this.getNextCuePoint(0);
				var embedPlayer = this.embedPlayer;
				if (!currentCuePoint) {
					return;
				}
				$(embedPlayer).bind('onChangeMedia' + this.bindPostfix, function() {
					_this.destroy();
				});
				$(embedPlayer).bind("seeked" + this.bindPostfix, function() {
					var currentTime = embedPlayer.currentTime * 1000;
					currentCuePoint = _this.getNextCuePoint(currentTime);
				});
				$(embedPlayer).bind("monitorEvent" + this.bindPostfix, function() {
					if (!currentCuePoint) {
						return;
					}
					var currentTime = embedPlayer.currentTime * 1000;
					if (currentTime > currentCuePoint.startTime && embedPlayer._propagateEvents) {
						var cuePointToBeTriggered = $.extend({}, currentCuePoint);
						currentCuePoint = _this.getNextCuePoint(currentTime);
						_this.triggerCuePoint(cuePointToBeTriggered);
					}
				});
			},
			getEndTime: function() {
				return this.embedPlayer.evaluate('{mediaProxy.entry.msDuration}');
			},
			getCuePoints: function() {
				if (!this.embedPlayer.rawCuePoints || !this.embedPlayer.rawCuePoints.length) {
					return [];
				}
				return this.embedPlayer.rawCuePoints;
			},
			getNextCuePoint: function(time) {
				var cuePoints = this.midCuePointsArray;
				for (var i = 0; i < cuePoints.length; i++) {
					if (cuePoints[i].startTime >= time) {
						return cuePoints[i];
					}
				}
				return false;
			},
			triggerCuePoint: function(rawCuePoint) {
				var eventName;
				rawCuePoint.sourceUrl = this.embedPlayer.evaluate(rawCuePoint.sourceUrl);
				var cuePointWrapper = {
					'cuePoint': rawCuePoint
				};
				if (rawCuePoint.cuePointType == 'codeCuePoint.Code') {
					eventName = 'KalturaSupport_CuePointReached';
				} else if (rawCuePoint.cuePointType == 'adCuePoint.Ad') {
					eventName = 'KalturaSupport_AdOpportunity';
					cuePointWrapper.context = this.getVideoAdType(rawCuePoint);
				} else {
					return;
				}
				mw.log('mw.KCuePoints :: Trigger event: ' + eventName + ' - ' + rawCuePoint.cuePointType + ' at: ' + rawCuePoint.startTime);
				$(this.embedPlayer).trigger(eventName, cuePointWrapper);
			},
			getVideoAdType: function(rawCuePoint) {
				if (rawCuePoint.startTime === 0) {
					return 'pre';
				} else if (rawCuePoint.startTime == this.getEndTime()) {
					return 'post';
				} else {
					return 'mid';
				}
				mw.log("Error:: KCuePoints could not determine adType");
			},
			getAdSlotType: function(cuePointWrapper) {
				if (cuePointWrapper.cuePoint.adType == 1) {
					return this.getVideoAdType(cuePointWrapper.cuePoint) + 'roll';
				} else {
					return 'overlay';
				}
			},
			getRawAdSlotType: function(rawCuePoint) {
				if (rawCuePoint.adType == 1) {
					return this.getVideoAdType(rawCuePoint) + 'roll';
				} else {
					return 'overlay';
				}
			},
			getCuePointsCount: function(filter) {
				var _this = this;
				var cuePoints = this.getCuePoints();
				if (!cuePoints) return 0;
				if (!filter) return cuePoints.length;
				var totalResults = {
					'preroll': 0,
					'midroll': 0,
					'postroll': 0,
					'overlay': 0
				};
				$.each(cuePoints, function(idx, rawCuePoint) {
					totalResults[_this.getRawAdSlotType(rawCuePoint)]++;
				});
				if (filter && totalResults[filter]) {
					return totalResults[filter];
				}
				return 0;
			}
		};
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("mw.KDPMapping", function($) {
	(function(mw, $) {
		"use strict";
		mw.KDPMapping = function(embedPlayer) {
			return this.init(embedPlayer);
		};
		mw.KDPMapping.prototype = {
			listenerList: {},
			init: function(embedPlayer) {
				var _this = this;
				var kdpApiMethods = ['addJsListener', 'removeJsListener', 'sendNotification', 'setKDPAttribute', 'evaluate'];
				var parentProxyDiv = null;
				if (mw.getConfig('EmbedPlayer.IsFriendlyIframe')) {
					try {
						parentProxyDiv = window['parent'].document.getElementById(embedPlayer.id);
					} catch (e) {}
				}
				$.each(kdpApiMethods, function(inx, methodName) {
					embedPlayer[methodName] = function() {
						var args = $.makeArray(arguments);
						args.splice(0, 0, embedPlayer);
						return _this[methodName].apply(_this, args);
					}
					if (parentProxyDiv) {
						parentProxyDiv[methodName] = function() {
							var args = $.makeArray(arguments);
							args.splice(0, 0, embedPlayer);
							return _this[methodName].apply(_this, args);
						}
					}
				});
				var runCallbackOnParent = false;
				if (mw.getConfig('EmbedPlayer.IsFriendlyIframe')) {
					try {
						if (window['parent'] && window['parent']['kWidget'] && parentProxyDiv) {
							runCallbackOnParent = true;
							window['parent']['kWidget'].jsCallbackReady(embedPlayer.id);
						}
					} catch (e) {
						runCallbackOnParent = false;
					}
				}
				if (!runCallbackOnParent) {
					window.kWidget.jsCallbackReady(embedPlayer.id);
				}
			},
			setKDPAttribute: function(embedPlayer, componentName, property, value) {
				mw.log("KDPMapping::setKDPAttribute " + componentName + " p:" + property + " v:" + value + ' for: ' + embedPlayer.id);
				switch (property) {
					case 'autoPlay':
						embedPlayer.autoplay = value;
						break;
					case 'disableAlerts':
						mw.setConfig('EmbedPlayer.ShowPlayerAlerts', !value);
						break;
					default:
						var subComponent = null;
						var pConf = embedPlayer.playerConfig['plugins'];
						var baseComponentName = componentName;
						if (componentName.indexOf('.') != -1) {
							var cparts = componentName.split('.');
							baseComponentName = cparts[0];
							subComponent = cparts[1];
						}
						if (!pConf[baseComponentName]) {
							pConf[baseComponentName] = {};
						}
						if (subComponent) {
							if (!pConf[baseComponentName][subComponent]) {
								pConf[baseComponentName][subComponent] = {};
							}
							pConf[baseComponentName][subComponent][property] = value;
						} else {
							pConf[baseComponentName][property] = value;
						}
						break;
				}
				if (property == 'mediaPlayFrom') {
					embedPlayer.startTime = parseFloat(value);
				}
				if (property == 'mediaPlayTo') {
					embedPlayer.pauseTime = parseFloat(value);
				}
				if (baseComponentName == 'servicesProxy' && subComponent && subComponent == 'kalturaClient' && property == 'ks') {
					this.updateKS(embedPlayer, value);
				}
				$(embedPlayer).trigger('Kaltura_SetKDPAttribute', [componentName, property, value]);
			},
			updateKS: function(embedPlayer, ks) {
				var client = mw.kApiGetPartnerClient(embedPlayer.kwidgetid);
				client.clearCache();
				client.setKS(ks);
				embedPlayer.setFlashvars('ks', ks);
				embedPlayer.sendNotification('changeMedia', {
					'entryId': embedPlayer.kentryid
				});
			},
			evaluate: function(embedPlayer, objectString, limit) {
				var _this = this;
				var result;
				var isCurlyBracketsExpresion = function(str) {
					if (typeof str == 'string') {
						return (str.charAt(0) == '{' && str.charAt(str.length - 1) == '}');
					}
					return false;
				};
				limit = limit || 0;
				if (limit > 4) {
					mw.log('KDPMapping::evaluate: recursive calls are limited to 5');
					return objectString;
				}
				if (typeof objectString !== 'string') {
					return objectString;
				}
				if (isCurlyBracketsExpresion(objectString) && objectString.split('{').length == 2) {
					result = _this.evaluateExpression(embedPlayer, objectString.substring(1, objectString.length - 1));
				} else if (objectString.split('{').length > 1) {
					result = objectString.replace(/\{([^\}]*)\}/g, function(match, contents, offset, s) {
						return _this.evaluateExpression(embedPlayer, contents);
					});
				} else {
					result = objectString;
				}
				if (result === 0) {
					return result;
				}
				if (result === "undefined" || result === "null" || result === "") result = undefined;
				if (result === "false") {
					result = false;
				}
				if (result === "true") {
					result = true;
				}
				if (isCurlyBracketsExpresion(result)) {
					result = this.evaluate(embedPlayer, result, limit++);
				}
				return result;
			},
			getEvaluateExpression: function(embedPlayer, expression) {
				var _this = this;
				if (expression.indexOf('(') !== -1) {
					var fparts = expression.split('(');
					return _this.evaluateStringFunction(fparts[0], _this.getEvaluateExpression(embedPlayer, fparts[1].slice(0, -1)));
				}
				var objectPath = expression.split('.');
				if (embedPlayer.playerConfig && embedPlayer.playerConfig.plugins && embedPlayer.playerConfig.plugins[objectPath[0]]) {
					var kObj = embedPlayer.playerConfig.plugins[objectPath[0]];
					if (!objectPath[1]) {
						return kObj;
					}
					if (!objectPath[2] && (objectPath[1] in kObj)) {
						return kObj[objectPath[1]];
					}
					if (objectPath[2] && kObj[objectPath[1]] && typeof kObj[objectPath[1]][objectPath[2]] != 'undefined') {
						return kObj[objectPath[1]][objectPath[2]];
					}
				}
				switch (objectPath[0]) {
					case 'isHTML5':
						return true;
						break;
					case 'sequenceProxy':
						if (!embedPlayer.sequenceProxy) {
							return null;
						}
						if (objectPath[1]) {
							switch (objectPath[1]) {
								case 'timeRemaining':
								case 'isInSequence':
								case 'skipOffsetRemaining':
									return embedPlayer.sequenceProxy[objectPath[1]];
									break;
								case 'activePluginMetadata':
									if (objectPath[2]) {
										if (!embedPlayer.sequenceProxy.activePluginMetadata) {
											return null;
										}
										return embedPlayer.sequenceProxy.activePluginMetadata[objectPath[2]]
									}
									return embedPlayer.sequenceProxy.activePluginMetadata;
									break;
							}
							return null;
						}
						return embedPlayer.sequenceProxy;
						break;
					case 'video':
						switch (objectPath[1]) {
							case 'volume':
								return embedPlayer.volume;
								break;
							case 'player':
								switch (objectPath[2]) {
									case 'currentTime':
										if (embedPlayer.kPreSeekTime !== null) {
											return embedPlayer.kPreSeekTime;
										}
										return embedPlayer.currentTime;
										break;
								}
								break;
						}
						break;
					case 'duration':
						return embedPlayer.getDuration();
						break;
					case 'mediaProxy':
						switch (objectPath[1]) {
							case 'entryCuePoints':
								if (!embedPlayer.rawCuePoints) {
									return null;
								}
								var kdpCuePointFormat = {};
								$.each(embedPlayer.rawCuePoints, function(inx, cuePoint) {
									var startTime = parseInt(cuePoint.startTime);
									if (kdpCuePointFormat[startTime]) {
										kdpCuePointFormat[startTime].push(cuePoint)
									} else {
										kdpCuePointFormat[startTime] = [cuePoint];
									}
								});
								return kdpCuePointFormat;
								break;
							case 'entryMetadata':
								if (!embedPlayer.kalturaEntryMetaData) {
									return null;
								}
								if (objectPath[2]) {
									return embedPlayer.kalturaEntryMetaData[objectPath[2]];
								} else {
									return embedPlayer.kalturaEntryMetaData;
								}
								break;
							case 'entry':
								if (!embedPlayer.kalturaPlayerMetaData) {
									return null;
								}
								if (objectPath[2]) {
									return embedPlayer.kalturaPlayerMetaData[objectPath[2]];
								} else {
									return embedPlayer.kalturaPlayerMetaData;
								}
								break;
							case 'isLive':
								return embedPlayer.isLive();
								break;
							case 'isOffline':
								if ($.isFunction(embedPlayer.isOffline)) {
									return embedPlayer.isOffline();
								}
								return true;
								break;
							case 'kalturaMediaFlavorArray':
								if (!embedPlayer.kalturaFlavors) {
									return null;
								}
								return embedPlayer.kalturaFlavors;
								break;
						}
						break;
					case 'configProxy':
						var fv = embedPlayer.getFlashvars();
						switch (objectPath[1]) {
							case 'flashvars':
								if (objectPath[2]) {
									switch (objectPath[2]) {
										case 'autoPlay':
											return embedPlayer.autoplay;
											break;
										case 'referer':
											if (fv && fv[objectPath[2]]) {
												return fv[objectPath[2]];
											}
											return mw.getConfig('EmbedPlayer.IframeParentUrl');
											break;
										default:
											if (fv && fv[objectPath[2]]) {
												return fv[objectPath[2]]
											}
											return null;
											break;
									}
								} else {
									return fv;
								}
								break;
							case 'kw':
								var kw = {
									'objectType': "KalturaWidget",
									'id': embedPlayer.kwidgetid,
									'partnerId': embedPlayer.kpartnerid,
									'uiConfId': embedPlayer.kuiconfid
								}
								if (objectPath[2]) {
									if (typeof kw[objectPath[2]] != 'undefined') {
										return kw[objectPath[2]]
									}
									return null;
								}
								return kw;
								break;
							case 'sessionId':
								return window.kWidgetSupport.getGUID();
								break;
						}
						return {
							'flashvars': fv,
							'sessionId': window.kWidgetSupport.getGUID()
						};
						break;
					case 'playerStatusProxy':
						switch (objectPath[1]) {
							case 'kdpStatus':
								if (embedPlayer.kdpEmptyFlag) {
									return "empty";
								}
								if (embedPlayer.playerReadyFlag) {
									return 'ready';
								}
								return null;
								break;
							case 'loadTime':
								return kWidget.loadTime[embedPlayer.kwidgetid];
								break;
						}
						break;
					case 'playlistAPI':
						switch (objectPath[1]) {
							case 'dataProvider':
								if (!embedPlayer.kalturaPlaylistData) {
									return null;
								}
								var plData = embedPlayer.kalturaPlaylistData;
								var plId = null;
								if (plData['currentPlaylistId']) {
									plId = plData['currentPlaylistId'];
								} else {
									for (var plKey in plData) break;
									plId = plKey;
								}
								var dataProvider = {
									'content': plData[plId],
									'length': plData[plId].length,
									'selectedIndex': plData['selectedIndex']
								}
								if (objectPath[2] == 'selectedIndex') {
									return dataProvider.selectedIndex;
								}
								return dataProvider;
								break;
						}
						break;
				}
				var pluginConfigValue = null;
				if (!objectPath[1] && $.isEmptyObject(embedPlayer.getKalturaConfig(objectPath[0]))) {
					pluginConfigValue = embedPlayer.getKalturaConfig('', objectPath[0]);
				} else {
					pluginConfigValue = embedPlayer.getKalturaConfig(objectPath[0], objectPath[1]);
					if ($.isEmptyObject(pluginConfigValue)) {
						return;
					}
				}
				return pluginConfigValue;
			},
			evaluateExpression: function(embedPlayer, expression) {
				var evalVal = this.getEvaluateExpression(embedPlayer, expression);
				if (evalVal === null || typeof evalVal == 'undefined' || evalVal === 'undefined') {
					return '';
				}
				return evalVal;
			},
			evaluateStringFunction: function(functionName, value) {
				switch (functionName) {
					case 'encodeUrl':
						return encodeURI(value);
						break;
				}
			},
			removeJsListener: function(embedPlayer, eventName, callbackName) {
				mw.log("KDPMapping:: removeJsListener:: " + eventName);
				if (typeof eventName == 'string') {
					var eventData = eventName.split('.', 2);
					var eventNamespace = eventData[1];
					if (eventNamespace && eventName[0] === '.') {
						$(embedPlayer).unbind('.' + eventNamespace);
					} else if (!eventNamespace) {
						eventNamespace = 'kdpMapping';
					}
					eventName = eventData[0];
					if (!callbackName) {
						callbackName = 'anonymous';
					} else {
						var listenerId = this.getListenerId(embedPlayer, eventName, eventNamespace, callbackName);
						if (!this.listenerList[listenerId]) {
							return;
						}
					}
					if (this.listenerList[listenerId]) {
						this.listenerList[listenerId] = null;
					} else {
						for (var listenerItem in this.listenerList) {
							if (listenerItem.indexOf(embedPlayer.id + '_' + eventName + '.' + eventNamespace) != -1) {
								this.listenerList[listenerItem] = null;
							}
						}
					}
				}
			},
			getListenerId: function(embedPlayer, eventName, eventNamespace, callbackName) {
				return embedPlayer.id + '_' + eventName + '.' + eventNamespace + '_' + callbackName;
			},
			addJsListener: function(embedPlayer, eventName, callbackName) {
				var _this = this;
				if (typeof eventName == 'string') {
					var eventData = eventName.split('.', 2);
					var eventNamespace = (eventData[1]) ? eventData[1] : 'kdpMapping';
					eventName = eventData[0];
				}
				if (typeof callbackName == 'string') {
					var listenerId = this.getListenerId(embedPlayer, eventName, eventNamespace, callbackName);
					this.listenerList[listenerId] = callbackName;
					var callback = function() {
						var callbackName = _this.listenerList[listenerId];
						var callbackToRun = kWidgetSupport.getFunctionByName(callbackName, window);
						if (!$.isFunction(callbackToRun)) {
							callbackToRun = kWidgetSupport.getFunctionByName(callbackName, window['parent']);
						}
						if ($.isFunction(callbackToRun)) {
							callbackToRun.apply(embedPlayer, $.makeArray(arguments));
						} else {
							mw.log('kdpMapping::addJsListener: callback name: ' + callbackName + ' not found');
						}
					};
				} else if (typeof callbackName == 'function') {
					var listenerId = this.getListenerId(embedPlayer, eventName, eventNamespace, 'anonymous');
					_this.listenerList[listenerId] = true;
					var callback = function() {
						if (_this.listenerList[listenerId]) {
							callbackName.apply(embedPlayer, $.makeArray(arguments));
						}
					}
				} else {
					mw.log("Error: KDPMapping : bad callback type: " + callbackName);
					return;
				}
				var b = function(bindName, bindCallback) {
					if (!bindCallback) {
						bindCallback = function() {
							callback(embedPlayer.id);
						};
					}
					bindName += '.' + eventNamespace;
					embedPlayer.bindHelper(bindName, function() {
						bindCallback.apply(embedPlayer, $.makeArray(arguments));
					});
				};
				switch (eventName) {
					case 'layoutReady':
						b('KalturaSupport_DoneWithUiConf');
						break;
					case 'mediaLoadError':
						b('mediaLoadError');
						break;
					case 'mediaError':
						b('mediaError');
						break;
					case 'kdpEmpty':
					case 'readyToLoad':
						if (embedPlayer.playerReadyFlag) {
							if (!embedPlayer.kentryid) {
								embedPlayer.kdpEmptyFlag = true;
								callback(embedPlayer.id);
							}
						} else {
							b('playerReady', function() {
								if (!embedPlayer.kentryid) {
									embedPlayer.kdpEmptyFlag = true;
									setTimeout(function() {
										callback(embedPlayer.id);
									}, 0)
								}
							});
						}
						break;
					case 'kdpReady':
						b('playerReady', function() {
							if (!embedPlayer.getError()) {
								embedPlayer.kdpEmptyFlag = false;
							}
							callback(embedPlayer.id);
						});
						break;
					case 'playerLoaded':
					case 'playerReady':
						b('playerReady');
						break;
					case 'changeVolume':
					case 'volumeChanged':
						b('volumeChanged', function(event, percent) {
							callback({
								'newVolume': percent
							}, embedPlayer.id);
						});
						break;
					case 'playerStateChange':
						b('preCheckPlayerSources', function() {
							callback('loading', embedPlayer.id);
						})
						b('playerReady', function() {
							callback('ready', embedPlayer.id);
						});
						b('onpause', function() {
							callback('paused', embedPlayer.id);
						});
						b('onplay', function() {
							callback('playing', embedPlayer.id);
						});
						break;
					case 'doStop':
					case 'stop':
						b("doStop");
						break;
					case 'playerPaused':
					case 'pause':
					case 'doPause':
						b("onpause");
						break;
					case 'playerPlayed':
						b("onplay");
						break;
					case 'play':
					case 'doPlay':
						b("onplay");
						break;
					case 'playerSeekStart':
						b("seeking");
						break;
					case 'seek':
					case 'doSeek':
					case 'doIntelligentSeek':
						b("seeking", function() {
							var seekTime = (embedPlayer.kPreSeekTime !== null) ? embedPlayer.kPreSeekTime : embedPlayer.currentTime;
							callback(seekTime, embedPlayer.id);
						});
						break;
					case 'playerSeekEnd':
						b("seeked", function() {
							embedPlayer.kPreSeekTime = null
							callback(embedPlayer.id);
						});
						break;
					case 'playerPlayEnd':
						b("postEnded");
						break;
					case 'playbackComplete':
						b("playbackComplete");
						b("AdSupport_EndAdPlayback", function(e, slotType) {
							if (slotType != 'postroll') {
								callback();
							}
						});
						break;
					case 'durationChange':
						b("durationchange", function() {
							callback({
								'newValue': embedPlayer.duration
							}, embedPlayer.id);
						});
						break;
					case 'openFullScreen':
					case 'hasOpenedFullScreen':
						b("onOpenFullScreen");
						break;
					case 'hasCloseFullScreen':
					case 'closeFullScreen':
						b("onCloseFullScreen");
						break;
					case 'playerUpdatePlayhead':
						b('monitorEvent', function() {
							if (embedPlayer.isPlaying()) {
								callback(embedPlayer.currentTime);
							}
						});
						break;
					case 'changeMedia':
						b('playerReady', function(event) {
							callback({
								'entryId': embedPlayer.kentryid
							}, embedPlayer.id);
						});
						break;
					case 'entryReady':
						b('KalturaSupport_EntryDataReady', function(event, entryData) {
							callback(entryData, embedPlayer.id);
						});
						break;
					case 'entryFailed':
						b('KalturaSupport_EntryFailed');
						break;
					case 'mediaReady':
						b('playerReady', function(event) {
							if (embedPlayer.kentryid) {
								setTimeout(function() {
									callback(embedPlayer.id)
								}, 0);
							}
						});
						break;
					case 'metadataReceived':
						b('KalturaSupport_MetadataReceived');
						break;
					case 'bufferChange':
						var triggeredBufferStart = false;
						var triggeredBufferEnd = false;
						b('monitorEvent', function() {
							if (!triggeredBufferStart) {
								callback(true, embedPlayer.id);
								triggeredBufferStart = true;
							}
							if (!triggeredBufferEnd && embedPlayer.bufferedPercent == 1) {
								callback(false, embedPlayer.id);
								triggeredBufferEnd = true;
							}
						})
						break;
					case 'bytesDownloadedChange':
						var prevBufferBytes = 0;
						b('monitorEvent', function() {
							if (typeof embedPlayer.bufferedPercent != 'undefined') {
								var bufferBytes = parseInt(embedPlayer.bufferedPercent * embedPlayer.mediaElement.selectedSource.getSize());
								if (bufferBytes != prevBufferBytes) {
									callback({
										'newValue': bufferBytes
									}, embedPlayer.id);
									prevBufferBytes = bufferBytes;
								}
							}
						})
						break;
					case 'playerDownloadComplete':
						b('monitorEvent', function() {
							if (embedPlayer.bufferedPercent == 1) {
								callback(embedPlayer.id);
							}
						});
						break;
					case 'bufferProgress':
						var prevBufferTime = 0;
						b('monitorEvent', function() {
							if (typeof embedPlayer.bufferedPercent != 'undefined') {
								var bufferTime = parseInt(embedPlayer.bufferedPercent * embedPlayer.duration);
								if (bufferTime != prevBufferTime) {
									callback({
										'newTime': bufferTime
									}, embedPlayer.id);
									prevBufferTime = bufferTime;
								}
							}
						})
						break;
					case 'bytesTotalChange':
						var prevBufferBytesTotal = 0;
						b('mediaLoaded', function() {
							callback({
								'newValue': embedPlayer.mediaElement.selectedSource.getSize()
							});
						})
						break;
					case 'preSequenceStart':
					case 'prerollStarted':
						b('AdSupport_prerollStarted', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'preSequenceComplete':
						b('AdSupport_preSequenceComplete', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'midrollStarted':
						b('AdSupport_midrollStarted', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'midSequenceComplete':
						b('AdSupport_midSequenceComplete', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'postRollStarted':
						b('AdSupport_midrollStarted', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'postSequenceComplete':
						b('AdSupport_postSequenceComplete', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'adStart':
						b('AdSupport_StartAdPlayback', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id);
						});
						break;
					case 'adEnd':
						b('AdSupport_EndAdPlayback', function(e, slotType) {
							callback({
								'timeSlot': slotType
							}, embedPlayer.id)
						});
						break;
					case 'adUpdatePlayhead':
						b('AdSupport_AdUpdatePlayhead', function(event, adTime) {
							callback(adTime, embedPlayer.id);
						});
						break;
					case 'pre1start':
						b('AdSupport_PreSequence');
						break;
					case 'post1start':
						b('AdSupport_PostSequence');
						break;
					case 'cuePointsReceived':
						b('KalturaSupport_CuePointsReady', function(event, cuePoints) {
							callback(embedPlayer.rawCuePoints, embedPlayer.id);
						});
						break;
					case 'cuePointReached':
						b('KalturaSupport_CuePointReached', function(event, cuePointWrapper) {
							callback(cuePointWrapper, embedPlayer.id);
						});
						break;
					case 'adOpportunity':
						b('KalturaSupport_AdOpportunity', function(event, cuePointWrapper) {
							callback(cuePointWrapper, embedPlayer.id);
						});
						break;
					case 'videoView':
						b('firstPlay');
						break;
					case 'share':
						b('showShareEvent');
						break;
					case 'openFullscreen':
						b('openFullScreen');
						break;
					case 'closefullscreen':
						b('closeFullScreen');
						break;
					case 'replay':
					case 'doReplay':
						b('replayEvent');
						break;
					case 'save':
					case 'gotoContributorWindow':
					case 'gotoEditorWindow':
						mw.log("Warning: kdp event: " + eventName + " does not have an html5 mapping");
						break;
					case 'freePreviewEnd':
						b('KalturaSupport_FreePreviewEnd');
						break;
					case 'ccDataLoaded':
						b('KalturaSupport_CCDataLoaded');
						break;
					case 'newClosedCaptionsData':
						b('KalturaSupport_NewClosedCaptionsData');
						break;
					case 'changedClosedCaptions':
						b('TimedText_ChangeSource');
						break;
					default:
						b(eventName, function() {
							var args = $.makeArray(arguments);
							if (args.length) {
								args.shift();
							}
							callback.apply(embedPlayer, args);
						});
						break;
				};
				return true;
			},
			sendNotification: function(embedPlayer, notificationName, notificationData) {
				mw.log('KDPMapping:: sendNotification > ' + notificationName, notificationData);
				switch (notificationName) {
					case 'doPlay':
						if (embedPlayer.playerReadyFlag == false) {
							mw.log('Warning:: KDPMapping, Calling doPlay before player ready');
							$(embedPlayer).bind('playerReady.sendNotificationDoPlay', function() {
								$(embedPlayer).unbind('.sendNotificationDoPlay');
								embedPlayer.play();
							})
							return;
						}
						embedPlayer.play();
						break;
					case 'doPause':
						embedPlayer.pause();
						break;
					case 'doStop':
						setTimeout(function() {
							embedPlayer.ignoreNextNativeEvent = true;
							embedPlayer.stop();
						}, 10);
						break;
					case 'doReplay':
						embedPlayer.stop();
						embedPlayer.play();
						break;
					case 'doSeek':
						var percent = (parseFloat(notificationData) - embedPlayer.startOffset) / embedPlayer.getDuration();
						embedPlayer.kPreSeekTime = embedPlayer.currentTime;
						embedPlayer.bindHelper('seeked.kdpMapOnce', function() {
							embedPlayer.kPreSeekTime = null;
						});
						embedPlayer.seek(percent, embedPlayer.paused);
						break;
					case 'changeVolume':
						embedPlayer.setVolume(parseFloat(notificationData));
						embedPlayer.setInterfaceVolume(parseFloat(notificationData));
						break;
					case 'openFullScreen':
						embedPlayer.controlBuilder.doFullScreenPlayer();
						break;
					case 'closeFullScreen':
						embedPlayer.controlBuilder.restoreWindowPlayer();
						break;
					case 'cleanMedia':
						embedPlayer.emptySources();
						break;
					case 'changeMedia':
						if (embedPlayer.playlist && !notificationData.playlistCall) {
							var clipList = embedPlayer.playlist.sourceHandler.getClipList();
							for (var inx = 0; inx < clipList.length; inx++) {
								var clip = clipList[inx];
								var autoContinue = embedPlayer.playlist.sourceHandler.autoContinue
								if (clip.id == notificationData.entryId) {
									embedPlayer.playlist.playClip(inx, autoContinue);
									return;
								}
							};
						}
						if ((!notificationData.entryId || notificationData.entryId == "" || notificationData.entryId == -1) && (!notificationData.referenceId || notificationData.referenceId == "" || notificationData.referenceId == -1)) {
							mw.log("KDPMapping:: ChangeMedia missing entryId or refrenceid, empty sources.")
							embedPlayer.emptySources();
							break;
						}
						if ((notificationData.entryId && notificationData.entryId != -1) || (notificationData.referenceId && notificationData.referenceId != -1)) {
							if (embedPlayer.changeMediaStarted) {
								break;
							}
							embedPlayer.changeMediaStarted = true;
							if (!notificationData.entryId && notificationData.referenceId) {
								embedPlayer.kreferenceid = notificationData.referenceId;
							} else {
								embedPlayer.kreferenceid = null;
							}
							embedPlayer.kentryid = notificationData.entryId;
							embedPlayer.kalturaPlayerMetaData = null;
							embedPlayer.kalturaEntryMetaData = null;
							embedPlayer.rawCuePoints = null;
							embedPlayer.kCuePoints = null;
							embedPlayer.kAds = null;
							embedPlayer.updatePosterSrc();
							embedPlayer.changeMedia();
							break;
						}
					case 'alert':
						embedPlayer.controlBuilder.displayAlert(notificationData);
						break;
					case 'removealert':
						embedPlayer.controlBuilder.closeAlert();
						break;
					case 'enableGui':
						if (notificationData.guiEnabled == true) {
							embedPlayer.enablePlayControls();
						} else {
							embedPlayer.disablePlayControls();
						}
						break;
					default:
						$(embedPlayer).trigger(notificationName, [notificationData]);
						break;
				}
				$(embedPlayer).trigger('Kaltura_SendNotification', [notificationName, notificationData]);
			}
		};
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("mw.KLayout", function($) {
	(function(mw, $) {
		"use strict";
		mw.KLayout = function(options) {
			this.init(options);
		};
		mw.KLayout.prototype = {
			titleLength: 45,
			descriptionLength: 75,
			init: function(options) {
				var _this = this;
				var validOptions = ['$layoutBox', 'embedPlayer', 'evaluateCallback', 'getEmbedPlayerCallback', 'titleLength', 'descriptionLength'];
				$.each(validOptions, function(inx, optionName) {
					if (options[optionName]) {
						_this[optionName] = options[optionName];
					}
				});
			},
			getLayout: function($uiConfBox) {
				if (!$uiConfBox) {
					$uiConfBox = this.$layoutBox;
				}
				var _this = this;
				var offsetLeft = 0;
				var $boxContainer = $('<div />');
				$j.each($uiConfBox.children(), function(inx, boxItem) {
					var $node = $('<div />');
					switch (boxItem.nodeName.toLowerCase()) {
						case 'video':
							if (_this.getEmbedPlayerCallback) {
								$node.append(_this.getEmbedPlayerCallback());
							}
							break;
						case 'img':
							var $node = $('<img />');
							break;
						case 'vbox':
						case 'hbox':
						case 'canvas':
							if (offsetLeft) $node.css('margin-left', offsetLeft);
							$node.append(_this.getLayout($(boxItem)));
							break;
						case 'spacer':
							$node.css('display', 'inline');
							break;
						case 'label':
						case 'text':
							var $node = $('<span />').css('display', 'block');
							break;
						default:
							return [];
							break;
					}
					mw.log("KLayout::getLayout > " + boxItem.nodeName.toLowerCase());
					$node.addClass(boxItem.nodeName.toLowerCase());
					if ($node && $node.length) {
						_this.applyUiConfAttributes($node, boxItem);
						if ($node.css('width').indexOf('%') === -1) {
							offsetLeft += $node.width();
						}
						if ($node[0].nodeName.toLowerCase() == 'div') {
							$node.css('width', '');
						}
						$boxContainer.append($node);
						if (boxItem.nodeName.toLowerCase() == 'hbox') {
							$boxContainer.append($("<div />").css('height', $node.css('height')));
						}
					}
				});
				this.applyUiConfAttributes($boxContainer, $uiConfBox[0]);
				return $boxContainer;
			},
			applyUiConfAttributes: function($target, confTag) {
				var _this = this;
				if (!confTag) {
					return;
				}
				var styleName = null;
				var idName = null;
				$.each(confTag.attributes, function(inx, attr) {
					switch (attr.nodeName.toLowerCase()) {
						case 'id':
							idName = attr.nodeValue;
							$target.data('id', idName).addClass(idName);
							break;
						case 'stylename':
							styleName = attr.nodeValue;
							$target.addClass(styleName);
							break;
						case 'url':
							$target.attr('src', _this.uiConfValueLookup(attr.nodeValue));
							break;
						case 'width':
						case 'height':
							var appendPx = '';
							if (attr.nodeValue.indexOf('%') == -1) {
								appendPx = 'px';
							}
							$target.css(attr.nodeName, attr.nodeValue + appendPx);
							break;
						case 'paddingtop':
							$target.css('padding-top', attr.nodeValue);
							break;
						case 'paddingright':
							$target.css('padding-right', attr.nodeValue);
							break;
						case 'text':
							$target.text(_this.uiConfValueLookup(attr.nodeValue));
							break;
						case 'font':
							var str = attr.nodeValue;
							if (str.indexOf('bold') !== -1) {
								$target.css('font-weight', 'bold');
								str = str.replace('bold', '');
							}
							var f = str.charAt(0).toUpperCase();
							$target.css('font-family', f + str.substr(1));
							break;
						case 'x':
							$target.css({
								'left': attr.nodeValue
							});
							break;
						case 'y':
							$target.css({
								'top': attr.nodeValue
							});
							break;
					}
				});
				mw.log("KLayout:: applyUiConfAttributes > style: " + styleName);
				switch (styleName) {
					case 'itemRendererLabel':
					case 'alertBodyText':
						if (idName == 'movieDescription' || idName == 'irDescriptionIrScreen' || idName == 'irDescriptionIrText') {
							$target.text(_this.formatDescription($target.text()));
						} else {
							$target.text(_this.formatTitle($target.text()));
						}
						break;
				}
			},
			uiConfValueLookup: function(objectString) {
				if (this.evaluateCallback) {
					return this.evaluateCallback(objectString);
				}
				return this.embedPlayer.evaluate(objectString);
			},
			formatTitle: function(text) {
				if (text.length > this.titleLength) return text.substr(0, this.titleLength - 3) + ' ...';
				return text;
			},
			formatDescription: function(text) {
				if (text.length > this.descriptionLength) return text.substr(0, this.descriptionLength - 3) + ' ...';
				return text;
			}
		};
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("mw.KWidgetSupport", function($) {
	(function(mw, $) {
		"use strict";
		mw.KWidgetSupport = function(options) {
			return this.init(options);
		};
		mw.KWidgetSupport.prototype = {
			kClient: null,
			kSessionId: null,
			init: function(options) {
				if (options) {
					$.extend(this, options);
				}
				this.addPlayerHooks();
			},
			isIframeApiServer: function() {
				return (mw.getConfig('EmbedPlayer.IsIframeServer') && mw.getConfig('EmbedPlayer.EnableIframeApi') && mw.getConfig('EmbedPlayer.IframeParentUrl'))
			},
			addPlayerHooks: function() {
				var _this = this;
				$(mw).bind('KalturaSupportNewPlayer', function(event, embedPlayer) {
					if (!embedPlayer.kwidgetid) {
						mw.log("Error:: KalturaSupportNewPlayer without kwidgetid");
						return;
					}
					_this.bindPlayer(embedPlayer);
					new mw.KDPMapping(embedPlayer);
				});
			},
			bindPlayer: function(embedPlayer) {
				var _this = this;
				this.addPlayerMethods(embedPlayer);
				_this.setUiConf(embedPlayer);
				embedPlayer.bindHelper('directDownloadLink', function(event, downloadUrlCallback) {
					var baseUrl = mw.getConfig('wgLoadScript').replace('load.php', '');
					var downloadUrl = baseUrl + 'modules/KalturaSupport/download.php/wid/' + embedPlayer.kwidgetid;
					if (embedPlayer.kuiconfid) {
						downloadUrl += '/uiconf_id/' + embedPlayer.kuiconfid;
					}
					if (embedPlayer.kentryid) {
						downloadUrl += '/entry_id/' + embedPlayer.kentryid;
					}
					var client = mw.kApiGetPartnerClient(embedPlayer.kwidgetid);
					var referrer = base64_encode(kWidgetSupport.getHostPageUrl());
					client.getKS(function(ks) {
						downloadUrl += '/?ks=' + ks + '&referrer=' + referrer;
						downloadUrlCallback(downloadUrl);
					});
				});
				embedPlayer.bindHelper('checkPlayerSourcesEvent', function(event, callback) {
					_this.loadAndUpdatePlayerData(embedPlayer, callback);
				});
				embedPlayer.bindHelper('KalturaSupport_EntryDataReady', function() {
					var thumbUrl = _this.getKalturaThumbnailUrl({
						url: embedPlayer.evaluate('{mediaProxy.entry.thumbnailUrl}'),
						width: embedPlayer.getWidth(),
						height: embedPlayer.getHeight()
					});
					if (embedPlayer.getFlashvars('loadThumbnailWithKs') === true) {
						thumbUrl += '?ks=' + embedPlayer.getFlashvars('ks');
					}
					embedPlayer.updatePosterSrc(thumbUrl);
					if (embedPlayer.kalturaPlayerMetaData.mediaType === 5) {
						embedPlayer.isAudioPlayer = true;
					}
				});
				embedPlayer.bindHelper('AddEmptyBlackSources', function(event, vid) {
					$(vid).empty();
					$.each(mw.getConfig('Kaltura.BlackVideoSources'), function(inx, sourceAttr) {
						$(vid).append($('<source />').attr(sourceAttr))
					});
				});
				embedPlayer.bindHelper('getShareIframeSrc', function(event, callback) {
					var iframeUrl = mw.getMwEmbedPath() + 'mwEmbedFrame.php';
					iframeUrl += '/wid/' + embedPlayer.kwidgetid + '/uiconf_id/' + embedPlayer.kuiconfid + '/entry_id/' + embedPlayer.kentryid + '/' + '?' + kWidget.flashVarsToUrl(embedPlayer.getFlashvars());
					callback(iframeUrl);
				});
				embedPlayer.bindHelper('embedPlayerError', function() {
					embedPlayer.showErrorMsg({
						title: embedPlayer.getKalturaMsg('ks-GENERIC_ERROR_TITLE'),
						message: embedPlayer.getKalturaMsg('ks-CLIP_NOT_FOUND')
					});
				});
			},
			setUiConf: function(embedPlayer) {
				if (!embedPlayer.playerConfig || !embedPlayer.playerConfig.uiConf) {
					mw.log('Error: KWidgetSupport::setUiConf error UiConf not found');
					return;
				}
				var uiConf = embedPlayer.playerConfig.uiConf;
				uiConf = $.trim(uiConf.replace(/\<\?xml.*\?\>/, ''));
				$(embedPlayer).trigger('KalturaSupport_RawUiConfReady', [uiConf]);
				embedPlayer.$uiConf = $($.parseXML(uiConf));
			},
			loadAndUpdatePlayerData: function(embedPlayer, callback) {
				var _this = this;
				mw.log("KWidgetSupport::loadAndUpdatePlayerData");
				_this.loadPlayerData(embedPlayer, function(playerData) {
					if (!playerData) {
						mw.log("KWidgetSupport::loadAndUpdatePlayerData> error no player data!");
						callback();
						return;
					}
					_this.updatePlayerData(embedPlayer, playerData, callback);
				});
			},
			updatePlayerData: function(embedPlayer, playerData, callback) {
				var _this = this;
				if (playerData.error) {
					embedPlayer.setError(playerData.error);
				}
				if (playerData.meta && playerData.meta.type == 7) {
					if (mw.EmbedTypes.getMediaPlayers().isSupportedPlayer('appleVdn')) {
						_this.addLiveEntrySource(embedPlayer, playerData.meta);
						embedPlayer.setLive(true);
					} else {
						embedPlayer.setError(embedPlayer.getKalturaMsg('LIVE-STREAM-NOT-SUPPORTED'));
					}
				}
				if (playerData.contextData && playerData.contextData.flavorAssets) {
					_this.addFlavorSources(embedPlayer, playerData);
				}
				if (playerData.meta && playerData.meta.mediaType == 2) {
					mw.log('KWidgetSupport::updatePlayerData: Add Entry Image');
					embedPlayer.mediaElement.tryAddSource($('<source />').attr({
						'src': _this.getKalturaThumbnailUrl({
							url: playerData.meta.thumbnailUrl,
							width: embedPlayer.getWidth(),
							height: embedPlayer.getHeight()
						}),
						'type': 'image/jpeg'
					}).get(0));
				}
				if (playerData.meta && playerData.meta.type == "externalMedia.externalMedia") {
					$(embedPlayer).trigger('KalturaSupport_AddExternalMedia', playerData.meta);
				}
				mw.log("KWidgetSupport::updatePlayerData: check for meta:");
				if (playerData.meta && playerData.meta.code == 'ENTRY_ID_NOT_FOUND') {
					$(embedPlayer).trigger('KalturaSupport_EntryFailed');
				} else {
					if (playerData.entryMeta) {
						embedPlayer.kalturaEntryMetaData = playerData.entryMeta;
					}
					if (playerData.meta) {
						mw.log("KWidgetSupport::updatePlayerData: update duration:" + playerData.meta.duration);
						embedPlayer.setDuration(playerData.meta.duration);
						embedPlayer.kalturaPlayerMetaData = playerData.meta;
					}
				}
				if ($(embedPlayer).data('uiConfXml')) {
					embedPlayer.$uiConf = $(embedPlayer).data('uiConfXml');
				}
				if (playerData.contextData) {
					embedPlayer.kalturaAccessControl = playerData.contextData;
				}
				if (playerData.entryCuePoints && playerData.entryCuePoints.length > 0) {
					mw.load(["mw.KCuePoints"], function() {
						mw.log("KCuePoints:: Add: " + playerData.entryCuePoints.length + " CuePoints to embedPlayer");
						embedPlayer.rawCuePoints = playerData.entryCuePoints;
						embedPlayer.kCuePoints = new mw.KCuePoints(embedPlayer);
						_this.handleUiConf(embedPlayer, callback);
					});
				} else {
					_this.handleUiConf(embedPlayer, callback);
				}
			},
			addPlayerMethods: function(embedPlayer) {
				var _this = this;
				embedPlayer.getRawKalturaConfig = function(confPrefix, attr) {
					var rawConfigArray = _this.getRawPluginConfig(embedPlayer, confPrefix, attr);
					if (attr) {
						return rawConfigArray[attr];
					}
					return rawConfigArray;
				};
				embedPlayer.getKalturaConfig = function(confPrefix, attr) {
					return _this.getPluginConfig(embedPlayer, confPrefix, attr);
				};
				embedPlayer.setKalturaConfig = function(pluginName, key, value) {
					if (!pluginName || !key) {
						return;
					}
					var objectSet = {};
					if (typeof key === "string") {
						objectSet[key] = value;
					}
					if (typeof key === "object") {
						objectSet = key;
					}
					if (!embedPlayer.playerConfig) {
						embedPlayer.playerConfig = {
							'plugins': {},
							'vars': {}
						};
					}
					if (!embedPlayer.playerConfig['plugins'][pluginName]) {
						embedPlayer.playerConfig['plugins'][pluginName] = objectSet;
					} else {
						if (typeof key === 'object') {
							$.extend(embedPlayer.playerConfig['plugins'][pluginName], objectSet);
							mw.log('merged:: ', embedPlayer.playerConfig['plugins'][pluginName]);
						} else if (typeof embedPlayer.playerConfig['plugins'][pluginName][key] === 'object' && typeof value === 'object') {
							$.extend(embedPlayer.playerConfig['plugins'][pluginName][key], value);
						} else {
							embedPlayer.playerConfig['plugins'][pluginName][key] = value;
						}
					}
				};
				embedPlayer.addExportedObject = function(pluginName, objectSet) {
					if (console && console.log) {
						console.log("KwidgetSupport:: addExportedObject is deprecated, please use standard setKalturaConfig");
					}
					for (var key in objectSet) {
						embedPlayer.setKalturaConfig(pluginName, key, objectSet[key]);
					}
				};
				embedPlayer.isPluginEnabled = function(pluginName) {
					var lcPluginName = (pluginName[0]) ? pluginName[0].toLowerCase() + pluginName.substr(1) : false;
					if (lcPluginName && _this.getPluginConfig(embedPlayer, lcPluginName, 'plugin')) {
						if (_this.getPluginConfig(embedPlayer, lcPluginName, 'disableHTML5')) {
							return false;
						}
						return true;
					}
					return false;
				};
				embedPlayer.getFlashvars = function(param) {
					if (!embedPlayer.playerConfig || !embedPlayer.playerConfig.vars) {
						return {};
					}
					var fv = embedPlayer.playerConfig['vars'] || {};
					if (param) {
						if (param in fv) {
							return fv[param];
						} else {
							return undefined;
						}
					}
					return fv;
				}
				embedPlayer.setFlashvars = function(key, value) {
					if (key) {
						embedPlayer.playerConfig['vars'][key] = value;
					}
				}
				embedPlayer.getKalturaMsg = function(msgKey) {
					var localeMsgKey = msgKey;
					if (embedPlayer.currentLocale) {
						localeMsgKey = embedPlayer.currentLocale + '_' + msgKey;
					}
					if (_this.getPluginConfig(embedPlayer, 'strings', localeMsgKey)) {
						return _this.getPluginConfig(embedPlayer, 'strings', localeMsgKey);
					}
					if (mw.messages.exists(msgKey)) {
						return gM(msgKey);
					}
					msgKey = 'ks-' + msgKey;
					if (mw.messages.exists(msgKey)) {
						return gM(msgKey);
					}
					if (msgKey.indexOf('_TITLE') == -1) {
						return gM('ks-GENERIC_ERROR');
					}
					return gM('ks-GENERIC_ERROR_TITLE');
				};
				embedPlayer.getKalturaMsgTitle = function(msgKey) {
					return embedPlayer.getKalturaMsg(msgKey + '_TITLE');
				};
				embedPlayer.getKalturaMsgObject = function(msgKey) {
					return {
						'title': embedPlayer.getKalturaMsgTitle(msgKey),
						'message': embedPlayer.getKalturaMsg(msgKey)
					}
				};
			},
			handleUiConf: function(embedPlayer, callback) {
				var _this = this;
				var doneWithUiConf = function() {
					if (embedPlayer.rawCuePoints) {
						mw.log("KWidgetSupport:: trigger KalturaSupport_CuePointsReady", embedPlayer.rawCuePoints);
						$(embedPlayer).trigger('KalturaSupport_CuePointsReady', embedPlayer.rawCuePoints);
					}
					if (embedPlayer.kalturaPlayerMetaData) {
						$(embedPlayer).trigger('KalturaSupport_EntryDataReady', embedPlayer.kalturaPlayerMetaData);
					}
					if (embedPlayer.kalturaEntryMetaData) {
						$(embedPlayer).trigger('KalturaSupport_MetadataReceived', embedPlayer.kalturaEntryMetaData);
					}
					mw.log("KWidgetSupport:: trigger KalturaSupport_DoneWithUiConf");
					setTimeout(function() {
						$(embedPlayer).trigger('KalturaSupport_DoneWithUiConf');
						callback();
					}, 0);
				};
				if (embedPlayer.$uiConf) {
					_this.baseUiConfChecks(embedPlayer);
					mw.log("KWidgetSupport:: trigger KalturaSupport_CheckUiConf");
					$(embedPlayer).triggerQueueCallback('KalturaSupport_CheckUiConf', embedPlayer.$uiConf, function() {
						mw.log("KWidgetSupport::KalturaSupport_CheckUiConf done with all uiConf checks");
						$(mw).triggerQueueCallback('Kaltura_CheckConfig', embedPlayer, function() {
							doneWithUiConf();
						});
					});
				} else {
					doneWithUiConf();
				}
			},
			baseUiConfChecks: function(embedPlayer) {
				var _this = this;
				var getAttr = function(attrName) {
					return _this.getPluginConfig(embedPlayer, '', attrName);
				}
				var autoPlay = getAttr('autoPlay');
				if (autoPlay) {
					embedPlayer.autoplay = true;
				}
				var loop = getAttr('loop');
				if (loop) {
					embedPlayer.loop = true;
				}
				if (getAttr('disableAlerts')) {
					mw.setConfig('EmbedPlayer.ShowPlayerAlerts', false);
				}
				if (getAttr('disableBitrateCookie') && getAttr('mediaProxy.preferedFlavorBR')) {
					embedPlayer.setCookie('EmbedPlayer.UserBandwidth', getAttr('mediaProxy.preferedFlavorBR') * 1000);
				}
				if (getAttr('mediaProxy.preferedFlavorBR') && embedPlayer.mediaElement) {
					embedPlayer.mediaElement.preferedFlavorBR = getAttr('mediaProxy.preferedFlavorBR') * 1000;
				}
				var imageDuration = getAttr('imageDefaultDuration');
				if (imageDuration) {
					$(embedPlayer).data('imageDuration', imageDuration);
				}
				var mediaPlayFrom = embedPlayer.evaluate('{mediaProxy.mediaPlayFrom}');
				if (mediaPlayFrom) {
					embedPlayer.startTime = parseFloat(mediaPlayFrom);
				}
				var mediaPlayTo = embedPlayer.evaluate('{mediaProxy.mediaPlayTo}');
				if (mediaPlayTo) {
					embedPlayer.pauseTime = parseFloat(mediaPlayTo);
				}
				if (getAttr('adsOnReplay')) {
					embedPlayer.adsOnReplay = true;
				}
				if (getAttr('disablePlayerSpinner')) {
					mw.setConfig('LoadingSpinner.Disabled', true);
				}
				if (embedPlayer.$uiConf.find('#endScreen').find('button[command="play"],button[kclick="sendNotification(\'doPlay\')"]').length == 0) {
					$(embedPlayer).data('hideEndPlayButton', true);
				} else {
					$(embedPlayer).data('hideEndPlayButton', false);
				}
			},
			getPluginConfig: function(embedPlayer, confPrefix, attr) {
				var singleAttrName = false;
				if (typeof attr == 'string') {
					singleAttrName = attr;
				}
				var rawConfigArray = this.getRawPluginConfig(embedPlayer, confPrefix, singleAttrName);
				var configArray = this.postProcessConfig(embedPlayer, rawConfigArray);
				if (singleAttrName != false) {
					return configArray[singleAttrName];
				} else {
					return configArray;
				}
			},
			getRawPluginConfig: function(embedPlayer, confPrefix, attr) {
				var _this = this;
				if (!embedPlayer.playerConfig) {
					if (window.kalturaIframePackageData.playerConfig) {
						embedPlayer.playerConfig = window.kalturaIframePackageData.playerConfig;
						delete(window.kalturaIframePackageData.playerConfig);
					}
					if (attr) {
						attr = [attr];
					}
					return this.getLegacyPluginConfig(embedPlayer, confPrefix, attr);
				}
				var plugins = embedPlayer.playerConfig['plugins'];
				var returnConfig = {};
				if (confPrefix && confPrefix[0]) {
					confPrefix = confPrefix[0].toLowerCase() + confPrefix.substr(1);
				}
				if (confPrefix && plugins[confPrefix]) {
					if (!attr) {
						return plugins[confPrefix];
					}
					if (attr && typeof plugins[confPrefix][attr] !== 'undefined') {
						returnConfig[attr] = plugins[confPrefix][attr];
					}
					if (attr && typeof attr == 'object') {
						for (var currAttr in attr) {
							if (plugins[confPrefix][attr[currAttr]]) {
								returnConfig[attr[currAttr]] = plugins[confPrefix][attr[currAttr]];
							}
						}
					}
				}
				if (!confPrefix && attr) {
					returnConfig[attr] = embedPlayer.playerConfig['vars'][attr]
				}
				return returnConfig;
			},
			getLegacyPluginConfig: function(embedPlayer, confPrefix, attr) {
				if (!this.logLegacyErrorOnce) {
					this.logLegacyErrorOnce = true;
					mw.log("Error: kWidgetSupport get config from uiCOnf has been deprecated please load via iframe");
				}
				var _this = this;
				var flashvars = embedPlayer.getFlashvars();
				var $uiConf = embedPlayer.$uiConf;
				if (!$uiConf) {
					mw.log("Error::getLegacyPluginConfig missing $uiConf");
				}
				if (attr && $.inArray('plugin', attr) != -1) {
					attr.push("disableHTML5");
				}
				var config = {};
				var $plugin = [];
				var $uiPluginVars = [];
				if (confPrefix) {
					$plugin = $uiConf.find('#' + confPrefix);
					if ($plugin.length && attr && $.inArray('plugin', attr) != -1) {
						config['plugin'] = true;
					}
					$uiPluginVars = $uiConf.find('var[key^="' + confPrefix + '"]');
				} else {
					var uiPluginVarsSelect = '';
					var coma = '';
					$.each(attr, function(inx, attrName) {
						uiPluginVarsSelect += coma + 'var[key="' + attrName + '"]';
						coma = ',';
					});
					if (uiPluginVarsSelect) {
						$uiPluginVars = $uiConf.find(uiPluginVarsSelect);
					}
				}
				if (!attr && confPrefix) {
					if ($plugin.length) {
						$.each($plugin[0].attributes, function(i, nodeAttr) {
							config[nodeAttr.name] = nodeAttr.value;
						});
					}
					$.each(flashvars, function(key, val) {
						if (key.indexOf(confPrefix) === 0) {
							config[key] = val;
						}
					})
					$uiPluginVars.each(function(inx, node) {
						var attrName = $(node).attr('key');
						if ($(node).attr('overrideflashvar') != "false" || !config[attrName]) {
							var attrKey = attrName.replace(confPrefix + '.', '');
							config[attrKey] = $(node)[0].getAttribute('value');
						}
					});
				} else {
					$.each(attr, function(inx, attrName) {
						if ($plugin.length) {
							if ($plugin.attr(attrName)) {
								config[attrName] = $plugin.attr(attrName);
							}
							if ($plugin.attr(attrName.toLowerCase())) {
								config[attrName] = $plugin.attr(attrName.toLowerCase());
							}
						}
						var pluginPrefix = (confPrefix) ? confPrefix + '.' : '';
						if (flashvars[pluginPrefix + attrName]) {
							config[attrName] = flashvars[pluginPrefix + attrName];
						}
						$uiPluginVars.each(function(inx, node) {
							if ($(node).attr('key') == pluginPrefix + attrName) {
								if ($(node).attr('overrideflashvar') == "true" || !config[attrName]) {
									config[attrName] = $(node)[0].getAttribute('value');
								}
								return false;
							}
						});
					});
				}
				return config;
			},
			postProcessConfig: function(embedPlayer, config) {
				var _this = this;
				var returnSet = $.extend({}, config);
				$.each(returnSet, function(attrName, value) {
					if (value && (typeof value === 'string')) {
						returnSet[attrName] = unescape(value);
					}
					if (embedPlayer.evaluate) {
						returnSet[attrName] = embedPlayer.evaluate(returnSet[attrName]);
					}
				});
				return returnSet;
			},
			getEntryIdSourcesFromApi: function(widgetId, partnerId, entryId, size, callback) {
				var _this = this;
				var sources;
				mw.log("KWidgetSupport:: getEntryIdSourcesFromApi: w:" + widgetId + ' entry:' + entryId);
				this.kClient = mw.KApiPlayerLoader({
					'widget_id': widgetId,
					'entry_id': entryId
				}, function(playerData) {
					if (playerData.contextData) {
						var acStatus = _this.getAccessControlStatus(playerData.contextData);
						if (acStatus !== true) {
							callback(acStatus);
							return;
						}
					}
					if (playerData.meta && playerData.meta.mediaType == 2) {
						sources = [{
							'src': _this.getKalturaThumbnailUrl({
								url: playerData.meta.thumbnailUrl,
								width: size.width,
								height: size.height
							}),
							'type': 'image/jpeg'
						}];
					} else {
						sources = _this.getEntryIdSourcesFromPlayerData(partnerId, playerData);
					}
					callback(sources);
				});
			},
			loadPlayerData: function(embedPlayer, callback) {
				var _this = this;
				var playerRequest = {};
				if (!embedPlayer.kwidgetid) {
					mw.log("Error: missing required widget paramater ( kwidgetid ) ");
					callback(false);
					return;
				} else {
					playerRequest.widget_id = embedPlayer.kwidgetid;
				}
				if (!this.checkForUrlEntryId(embedPlayer) && embedPlayer.kentryid) {
					playerRequest.entry_id = embedPlayer.kentryid;
				}
				if (embedPlayer.kreferenceid) {
					playerRequest.reference_id = embedPlayer.kreferenceid;
				}
				playerRequest.flashvars = embedPlayer.getFlashvars();
				this.kClient = mw.kApiGetPartnerClient(playerRequest.widget_id);
				this.kClient.setKS(embedPlayer.getFlashvars('ks'));
				if (window.kalturaIframePackageData && window.kalturaIframePackageData.playlistResult) {
					embedPlayer.kalturaPlaylistData = window.kalturaIframePackageData.playlistResult;
					delete(window.kalturaIframePackageData.playlistResult);
				}
				if (window.kalturaIframePackageData && window.kalturaIframePackageData.entryResult) {
					this.handlePlayerData(embedPlayer, kalturaIframePackageData.entryResult);
					callback(window.kalturaIframePackageData.entryResult);
					delete(window.kalturaIframePackageData.entryResult);
				} else {
					this.kClient = mw.KApiPlayerLoader(playerRequest, function(playerData) {
						_this.handlePlayerData(embedPlayer, playerData);
						callback(playerData);
					});
				}
			},
			handlePlayerData: function(embedPlayer, entryResult) {
				if (entryResult.meta && entryResult.meta.id) {
					embedPlayer.kentryid = entryResult.meta.id;
					embedPlayer.kpartnerid = entryResult.meta.partnerId;
				}
				var errObj = null;
				if (entryResult.meta && entryResult.meta.code == "INVALID_KS") {
					errObj = embedPlayer.getKalturaMsgObject("NO_KS");
				}
				if (entryResult.error) {
					errObj = embedPlayer.getKalturaMsgObject('GENERIC_ERROR');
					errObj.message = entryResult.error;
				}
				if (errObj) {
					embedPlayer.hideSpinner();
					embedPlayer.setError(errObj);
				}
			},
			getAccessControlStatus: function(ac, embedPlayer) {
				if (ac.isAdmin) {
					return true;
				}
				if (ac.isCountryRestricted) {
					return embedPlayer.getKalturaMsgObject('UNAUTHORIZED_COUNTRY');
				}
				if (ac.isScheduledNow === 0) {
					return embedPlayer.getKalturaMsgObject('OUT_OF_SCHEDULING');
				}
				if (ac.isIpAddressRestricted) {
					return embedPlayer.getKalturaMsgObject('UNAUTHORIZED_IP_ADDRESS');
				}
				if (ac.isSessionRestricted && ac.previewLength === -1) {
					return embedPlayer.getKalturaMsgObject('NO_KS');
				}
				if (ac.isSiteRestricted) {
					return embedPlayer.getKalturaMsgObject('UNAUTHORIZED_DOMAIN');
				}
				if (ac.isUserAgentRestricted) {
					return embedPlayer.getKalturaMsgObject('USER_AGENT_RESTRICTED');
				}
				if (ac.accessControlActions && ac.accessControlActions.length) {
					var msgObj = embedPlayer.getKalturaMsgObject('GENERIC_ERROR');
					var err = false;
					$.each(ac.accessControlActions, function() {
						if (this.type == 1) {
							msgObj.message = '';
							if (ac.accessControlMessages && ac.accessControlMessages.length) {
								$.each(ac.accessControlMessages, function() {
									msgObj.message += this.value + '\n';
									err = true;
								});
							} else {
								msgObj = embedPlayer.getKalturaMsgObject('NO_KS');
								err = true;
							}
						}
					});
					if (err) {
						return msgObj;
					}
				}
				return true;
			},
			getUiConfId: function(embedPlayer) {
				return embedPlayer.kuiconfid;
			},
			checkForUrlEntryId: function(embedPlayer) {
				if (embedPlayer.kentryid && typeof embedPlayer.kentryid == 'string' && embedPlayer.kentryid.indexOf('://') != -1) {
					embedPlayer.mediaElement.tryAddSource($('<source />').attr({
						'src': embedPlayer.kentryid
					}).get(0));
					return true;
				}
				return false;
			},
			addFlavorSources: function(embedPlayer, playerData) {
				var _this = this;
				mw.log('KWidgetSupport::addEntryIdSources:');
				var sources = embedPlayer.mediaElement.getSources();
				if (sources[0] && sources[0]['data-flavorid']) {
					return;
				}
				var flavorSources = _this.getEntryIdSourcesFromPlayerData(embedPlayer.kpartnerid, playerData);
				embedPlayer.kalturaFlavors = flavorSources;
				var preferedBitRate = embedPlayer.evaluate('{mediaProxy.preferedFlavorBR}');
				var flashvarsPlayMainfestParams = this.getPlayMainfestParams(embedPlayer);
				var qp = '';
				for (var i = 0; i < flavorSources.length; i++) {
					var source = flavorSources[i];
					if (preferedBitRate && source.type == 'application/vnd.apple.mpegurl') {
						qp = (source.src.indexOf('?') === -1) ? '?' : '&';
						source.src = source.src + qp + 'preferredBitrate=' + preferedBitRate;
					}
					qp = (source.src.indexOf('?') === -1) ? '?' : '&';
					source.src = source.src + qp + flashvarsPlayMainfestParams;
					mw.log('KWidgetSupport:: addSource::' + embedPlayer.id + ' : ' + source.src + ' type: ' + source.type);
					var sourceElm = $('<source />').attr(source).get(0);
					embedPlayer.mediaElement.tryAddSource(sourceElm);
				}
			},
			getPlayMainfestParams: function(embedPlayer) {
				var p = '';
				var and = '';
				var urlParms = ["deliveryCode", "storageId", "maxBitrate", "playbackContext", "seekFrom", "clipTo"];
				$.each(urlParms, function(inx, param) {
					if (embedPlayer.getFlashvars(param)) {
						p += and + param + '=' + embedPlayer.getFlashvars(param);
						and = '&';
					}
				});
				return p;
			},
			getHostPageUrl: function() {
				var hostUrl = (mw.getConfig('EmbedPlayer.IframeParentUrl')) ? mw.getConfig('EmbedPlayer.IframeParentUrl') : document.URL;
				if (hostUrl.indexOf("#") !== -1) {
					hostUrl = hostUrl.substr(0, hostUrl.indexOf("#"));
				}
				hostUrl = hostUrl.substr(0, hostUrl.indexOf("/", 8));
				return hostUrl;
			},
			getBaseFlavorUrl: function(partnerId) {
				if (mw.getConfig('Kaltura.UseManifestUrls')) {
					return mw.getConfig('Kaltura.ServiceUrl') + '/p/' + partnerId + '/sp/' + partnerId + '00/playManifest';
				} else {
					return mw.getConfig('Kaltura.CdnUrl') + '/p/' + partnerId + '/sp/' + partnerId + '00/flvclipper';
				}
			},
			getEntryIdSourcesFromPlayerData: function(partnerId, playerData) {
				var _this = this;
				if (!playerData.contextData && !playerData.contextData.flavorAssets) {
					mw.log("Error: KWidgetSupport: contextData.flavorAssets is not defined ");
					return;
				}
				var flavorData = playerData.contextData.flavorAssets;
				var protocol = mw.getConfig('Kaltura.Protocol');
				if (!protocol) {
					protocol = window.location.protocol.replace(':', '');
				}
				var deviceSources = [];
				var ipadAdaptiveFlavors = [];
				var iphoneAdaptiveFlavors = [];
				var flavorUrl = _this.getBaseFlavorUrl(partnerId);
				for (var i = 0; i < flavorData.length; i++) {
					var asset = flavorData[i];
					var sourceAspect = Math.round((asset.width / asset.height) * 100) / 100
					var source = {
						'data-sizebytes': asset.size * 1024,
						'data-bandwidth': asset.bitrate * 1024,
						'data-width': asset.width,
						'data-height': asset.height,
						'data-aspect': sourceAspect
					};
					var tags = asset.tags.toLowerCase().split(',');
					if (asset.status != 2) {
						if (asset.status == 4) {
							source.error = 'not-ready-transcoding';
							mw.log("KWidgetSupport:: Skip sources that are not ready: " + asset.id + ' ' + asset.tags);
						}
						continue;
					}
					if (mw.getConfig('Kaltura.UseManifestUrls')) {
						var src = flavorUrl + '/entryId/' + asset.entryId;
						if (mw.getConfig('Kaltura.UseAppleAdaptive') && $.inArray('applembr', tags) != -1) {
							src += '/format/applehttp/protocol/' + protocol + '/a.m3u8';
							deviceSources.push({
								'data-aspect': sourceAspect,
								'data-flavorid': 'AppleMBR',
								'type': 'application/vnd.apple.mpegurl',
								'src': src
							});
							continue;
						} else {
							src += '/flavorId/' + asset.id + '/format/url/protocol/' + protocol;
						}
					} else {
						mw.log("Error: KWidgetSupport: non-manifest urls are deprecated");
						var src = flavorUrl + '/entry_id/' + asset.entryId + '/flavor/' + asset.id;
					}
					if ($.inArray('ipad', tags) != -1) {
						source['src'] = src + '/a.mp4';
						source['data-flavorid'] = 'iPad';
						source['type'] = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2';
					}
					if ($.inArray('iphone', tags) != -1) {
						source['src'] = src + '/a.mp4';
						source['data-flavorid'] = 'iPhone';
						source['type'] = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2';
					}
					if ($.inArray('mbr', tags) != -1 && $.isEmptyObject(source['src']) && !mw.isMobileDevice() && asset.fileExt.toLowerCase() == 'mp4') {
						source['src'] = src + '/a.mp4';
						source['type'] = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2';
					}
					if (asset.fileExt && (asset.fileExt.toLowerCase() == 'ogg' || asset.fileExt.toLowerCase() == 'ogv' || (asset.containerFormat && asset.containerFormat.toLowerCase() == 'ogg'))) {
						source['src'] = src + '/a.ogg';
						source['data-flavorid'] = 'ogg';
						source['type'] = 'video/ogg';
					}
					if (asset.fileExt && asset.containerFormat && (asset.fileExt == 'webm' || $.inArray('webm', tags) != -1 || (asset.containerFormat.toLowerCase() == 'webm'))) {
						source['src'] = src + '/a.webm';
						source['data-flavorid'] = 'webm';
						source['type'] = 'video/webm; codecs="vp8, vorbis';
					}
					if (asset.fileExt && asset.fileExt == '3gp') {
						source['src'] = src + '/a.3gp';
						source['data-flavorid'] = '3gp';
						source['type'] = 'video/3gp';
					}
					if (asset.fileExt && asset.fileExt == 'mp3') {
						source['src'] = src + '/a.mp3';
						source['data-flavorid'] = 'mp3';
						source['type'] = 'audio/mp3';
					}
					if (source['src']) {
						deviceSources.push(source);
					}
					if (navigator.userAgent.indexOf('Android') !== -1 && asset.width == 0 && asset.height == 0) {
						continue;
					}
					if ($.inArray('ipadnew', tags) != -1) {
						ipadAdaptiveFlavors.push(asset.id);
					}
					if ($.inArray('iphonenew', tags) != -1) {
						ipadAdaptiveFlavors.push(asset.id);
						iphoneAdaptiveFlavors.push(asset.id);
					}
				}
				for (var i = 0; i < deviceSources.length; i++) {
					var source = deviceSources[i];
					if (!this.isValidAspect(source['data-aspect'])) {
						source['data-aspect'] = this.getValidAspect(deviceSources);
					}
					mw.log("KWidgetSupport:: set aspect for: " + source['data-flavorid'] + ' = ' + source['data-aspect']);
				}
				if (mw.getConfig('Kaltura.UseFlavorIdsUrls') && $.grep(deviceSources, function(a) {
					if (a['data-flavorid'] == 'AppleMBR') {
						return true;
					}
				}).length == 0) {
					var validClipAspect = this.getValidAspect(deviceSources);
					if (mw.isIpad() && ipadAdaptiveFlavors.length > 1 && mw.getConfig('Kaltura.UseAppleAdaptive')) {
						deviceSources.push({
							'data-aspect': validClipAspect,
							'data-flavorid': 'iPadNew',
							'type': 'application/vnd.apple.mpegurl',
							'src': flavorUrl + '/entryId/' + asset.entryId + '/flavorIds/' + ipadAdaptiveFlavors.join(',') + '/format/applehttp/protocol/' + protocol + '/a.m3u8'
						});
					}
					if (mw.isIphone() && iphoneAdaptiveFlavors.length > 1 && mw.getConfig('Kaltura.UseAppleAdaptive')) {
						deviceSources.push({
							'data-aspect': validClipAspect,
							'data-flavorid': 'iPhoneNew',
							'type': 'application/vnd.apple.mpegurl',
							'src': flavorUrl + '/entryId/' + asset.entryId + '/flavorIds/' + iphoneAdaptiveFlavors.join(',') + '/format/applehttp/protocol/' + protocol + '/a.m3u8'
						});
					}
				}
				if (playerData.meta.duration < 10) {
					deviceSources = this.removeAdaptiveFlavors(deviceSources);
				}
				if (mw.getConfig('playlistAPI.kpl0Url') && playerData.meta && playerData.meta.mediaType == 5) {
					deviceSources = this.removeAdaptiveFlavors(deviceSources);
				}
				var ksCheck = false;
				this.kClient.getKS(function(ks) {
					ksCheck = true;
					$.each(deviceSources, function(inx, source) {
						deviceSources[inx]['src'] = deviceSources[inx]['src'] + '?ks=' + ks + '&referrer=' + base64_encode(_this.getHostPageUrl());
					});
				});
				if (!ksCheck) {
					mw.log("Error:: KWidgetSupport: KS not defined in time, streams will be missing ks paramter");
				}
				return deviceSources;
			},
			removeAdaptiveFlavors: function(sources) {
				for (var i = 0; i < sources.length; i++) {
					if (sources[i].type == 'application/vnd.apple.mpegurl') {
						sources.splice(i, 1);
						i--;
					}
				}
				return sources;
			},
			getValidAspect: function(sources) {
				var _this = this;
				for (var i = 0; i < sources.length; i++) {
					var source = sources[i];
					var aspect = source['data-aspect'];
					if (this.isValidAspect(aspect)) {
						return aspect;
					}
				}
				var aspectParts = mw.getConfig('EmbedPlayer.DefaultSize').split('x');
				return Math.round((aspectParts[0] / aspectParts[1]) * 100) / 100;
			},
			addLiveEntrySource: function(embedPlayer, entry) {
				var _this = this;
				var srcUrl = this.getBaseFlavorUrl(entry.partnerId) + '/entryId/' + entry.id + '/format/applehttp/protocol/http/a.m3u8';
				this.kClient.getKS(function(ks) {
					srcUrl = srcUrl + '?ks=' + ks + '&referrer=' + base64_encode(_this.getHostPageUrl());
				});
				mw.log('KWidgetSupport::addLiveEntrySource: Add Live Entry Source - ' + srcUrl);
				embedPlayer.mediaElement.tryAddSource($('<source />').attr({
					'src': srcUrl,
					'type': 'application/vnd.apple.mpegurl'
				})[0]);
			},
			isValidAspect: function(aspect) {
				return !isNaN(aspect) && isFinite(aspect);
			},
			generateGUID: function() {
				var S4 = function() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				};
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			},
			getGUID: function() {
				if (!this.kSessionId) {
					this.kSessionId = this.generateGUID();
				}
				return this.kSessionId;
			},
			getKalturaThumbnailUrl: function(thumb) {
				if (!thumb.url) {
					return mw.getConfig('EmbedPlayer.BlackPixel');
				}
				var thumbUrl = thumb.url;
				if (thumbUrl.indexOf("thumbnail/entry_id") != -1) {
					thumbUrl += '/width/' + thumb.width;
					thumbUrl += '/height/' + thumb.height;
				}
				return thumbUrl;
			},
			getFunctionByName: function(functionName, context) {
				try {
					var args = Array.prototype.slice.call(arguments).splice(2);
					var namespaces = functionName.split(".");
					var func = namespaces.pop();
					for (var i = 0; i < namespaces.length; i++) {
						context = context[namespaces[i]];
					}
					return context[func];
				} catch (e) {
					mw.log("kWidgetSupport::executeFunctionByName: Error could not find function: " + functionName + ' error: ' + e);
					return false;
				}
			}
		};
		if (!window.kWidgetSupport) {
			window.kWidgetSupport = new mw.KWidgetSupport();
		}
		mw.getEntryIdSourcesFromApi = function(widgetId, partnerId, entryId, size, callback) {
			kWidgetSupport.getEntryIdSourcesFromApi(widgetId, partnerId, entryId, size, callback);
		};
	})(window.mw, jQuery);;
}, {}, {
	"ks-CLIP_NOT_FOUND": "Media not found",
	"ks-CLIP_NOT_FOUND_TITLE": "Sorry, clip not found",
	"ks-ENTRY_CONVERTING": "Media is currently being converted, please try again in a few minutes.",
	"ks-ENTRY_CONVERTING_TITLE": "Entry is converting",
	"ks-ENTRY_DELETED": "We're sorry, this content is no longer available.",
	"ks-ENTRY_DELETED_TITLE": "Entry is deleted ",
	"ks-ENTRY_IMPORTING": "Media is currently being converted, please try again in a few minutes.",
	"ks-ENTRY_IMPORTING_TITLE": "Entry is converting",
	"ks-ENTRY_MODERATE": "Media is awaiting moderation",
	"ks-ENTRY_MODERATE_TITLE": "Entry is awaiting moderation",
	"ks-ENTRY_PENDING": "Free preview completed, need to purchase ",
	"ks-ENTRY_PENDING_TITLE": "Free preview completed, need to purchase ",
	"ks-ENTRY_PRECONVERT": "Media is currently being converted, please try again in a few minutes.",
	"ks-ENTRY_PRECONVERT_TITLE": "Entry is converting",
	"ks-ENTRY_REJECTED": "We're sorry, this content was removed",
	"ks-ENTRY_REJECTED_TITLE": "Entry is rejected",
	"ks-ERROR_PROCESSING_MEDIA": "There was an error processing this media.",
	"ks-ERROR_PROCESSING_MEDIA_TITLE": "Error processing media ",
	"ks-FREE_PREVIEW_END": "Access to the rest of the content is restricted.",
	"ks-FREE_PREVIEW_END_TITLE": "Free preview completed, need to purchase ",
	"ks-GENERIC_ERROR": "An internal error has occurred",
	"ks-GENERIC_ERROR_TITLE": "Error",
	"ks-NO_KS": "We're sorry, access to this content is restricted. ",
	"ks-NO_KS_TITLE": "No KS where KS is required ",
	"ks-NO_MIX_PLUGIN": "In order to view mix entry, you must add the mix plugin to the uiconf xml",
	"ks-NO_MIX_PLUGIN_TITLE": "No Mix Plugin",
	"ks-OUT_OF_SCHEDULING": "We're sorry, this content is currently unavailable.",
	"ks-OUT_OF_SCHEDULING_TITLE": "Out of scheduling  ",
	"ks-SERVICE_ERROR": "Service error",
	"ks-SERVICE_GET_ENTRY_ERROR": "Error in Get Entry",
	"ks-SERVICE_GET_EXTRA_ERROR": "Error in get base entry extra data",
	"ks-SERVICE_GET_EXTRA_ERROR_TITLE": "Error Get Extra Data",
	"ks-SERVICE_GET_FLAVORS_ERROR": "Error in Get Flavors",
	"ks-SERVICE_GET_UICONF_ERROR": "Error in Get Uiconf",
	"ks-SERVICE_GET_WIDGET_ERROR": "Error in Get Widget",
	"ks-SERVICE_START_WIDGET_ERROR": "Error in Start Widget Session",
	"ks-UNAUTHORIZED_COUNTRY": "We're sorry, this content is only available in certain countries.",
	"ks-UNAUTHORIZED_COUNTRY_TITLE": "Unauthorized country",
	"ks-UNAUTHORIZED_DOMAIN": "We're sorry, this content is only available on certain domains.",
	"ks-UNAUTHORIZED_DOMAIN_TITLE": "Unauthorized domain",
	"ks-UNAUTHORIZED_IP_ADDRESS": "We're sorry, this content is only available for ceratin IP addresses.",
	"ks-UNAUTHORIZED_IP_ADDRESS_TITLE": "Unauthorized IP address",
	"ks-UNKNOWN_STATUS": "Unknown status",
	"ks-UNKNOWN_STATUS_TITLE": "Unknown status",
	"ks-USER_AGENT_RESTRICTED": "User Agent Restricted\nWe're sorry, this content is not available for your device.",
	"ks-LIVE-STREAM-NOT-SUPPORTED": "Your browser does not support Live stream playback."
});
mw.loader.implement("mw.KalturaIframePlayerSetup", function($) {
	(function(mw, $, playerData) {
		"use strict";
		try {
			if (window['parent'] && window['parent']['kWidget']) {
				mw.config.set('EmbedPlayer.IsFriendlyIframe', true);
			} else {
				mw.config.set('EmbedPlayer.IsFriendlyIframe', false);
			}
		} catch (e) {
			mw.config.set('EmbedPlayer.IsFriendlyIframe', false);
		}
		if (mw.config.get('EmbedPlayer.IsFriendlyIframe')) {
			try {
				if (window['parent'] && window['parent']['preMwEmbedConfig']) {
					mw.config.set(window['parent']['preMwEmbedConfig']);
					mw.config.set('EmbedPlayer.IframeParentUrl', document.URL.replace(/#.*/, ''));
				}
			} catch (e) {}
		} else {
			try {
				var hashObj = JSON.parse(unescape(hashString.replace(/^#/, '')));
				if (hashObj && hashObj.mwConfig) {
					mw.config.set(hashObj.mwConfig);
				}
			} catch (e) {
				kWidget.log("KalturaIframePlayerSetup, could not get configuration ");
			}
		}
		mw.config.set('KalturaSupport.PlayerConfig', playerData['playerConfig']);
		mw.config.set('Kaltura.IframeRewrite', false);
		mw.config.set('Mw.LogPrepend', 'iframe:');
		mw.config.set('Kaltura.LoadScriptForVideoTags', false);
		mw.config.set('EmbedPlayer.WaitForMeta', false);
		mw.config.set('EmbedPlayer.IframeParentPlayerId', playerData['playerId']);
		mw.config.set(playerData['enviornmentConfig']);
		if (mw.config.get('EmbedPlayer.IsFullscreenIframe')) {
			mw.config.set('EmbedPlayer.EnableFullscreen', false);
		} else {
			if (mw.config.get('EmbedPlayer.IframeParentUrl') === null) {
				mw.config.set("EmbedPlayer.NewWindowFullscreen", true);
			}
		}
		var removeElement = function(elemId) {
			if (document.getElementById(elemId)) {
				try {
					var el = document.getElementById(elemId);
					el.parentNode.removeChild(el);
				} catch (e) {}
			}
		};
		if (kWidget.isUiConfIdHTML5(playerData.playerConfig.uiConfId) || !(kWidget.supportsFlash() || mw.config.get('Kaltura.ForceFlashOnDesktop'))) {
			removeElement('kaltura_player_iframe_no_rewrite');
			$('#' + playerData.playerId).embedPlayer(function() {
				$('#kaltura_player_iframe_no_rewrite').remove();
				var embedPlayer = $('#' + playerData.playerId)[0];
				if (mw.config.get('EmbedPlayer.IframeCurrentTime')) {
					embedPlayer.currentTime = mw.config.get('EmbedPlayer.IframeCurrentTime');
				}
				if (mw.config.get('EmbedPlayer.IframeIsPlaying')) {
					embedPlayer.play();
				}
			});
		} else {
			mw.log("Error: KalturaIframePlayer:: rendering flash player after loading html5 lib");
		}
	})(window.mw, window.jQuery, window.kalturaIframePackageData);;
}, {}, {});
mw.loader.implement("mw.MediaElement", function($) {
	(function(mw, $) {
		"use strict";
		mw.MediaElement = function(element) {
			this.init(element);
		};
		mw.MediaElement.prototype = {
			sources: null,
			addedROEData: false,
			selectedSource: null,
			preferedFlavorBR: null,
			init: function(videoElement) {
				var _this = this;
				mw.log("EmbedPlayer::mediaElement:init:" + videoElement.id);
				this.parentEmbedId = videoElement.id;
				this.sources = new Array();
				if (videoElement) {
					if ($(videoElement).attr("src")) {
						_this.tryAddSource(videoElement);
					}
					$(videoElement).find('source,track').each(function() {
						_this.tryAddSource(this);
					});
				}
			},
			updateSourceTimes: function(startNpt, endNpt) {
				var _this = this;
				$.each(this.sources, function(inx, mediaSource) {
					mediaSource.updateSrcTime(startNpt, endNpt);
				});
			},
			getTextTracks: function() {
				var textTracks = [];
				$.each(this.sources, function(inx, source) {
					if (source.nodeName == 'track' || (source.mimeType && source.mimeType.indexOf('text/') !== -1)) {
						textTracks.push(source);
					}
				});
				return textTracks;
			},
			getSources: function(mimeFilter) {
				if (!mimeFilter) {
					return this.sources;
				}
				var source_set = new Array();
				for (var i = 0; i < this.sources.length; i++) {
					if (this.sources[i].mimeType && this.sources[i].mimeType.indexOf(mimeFilter) != -1) {
						source_set.push(this.sources[i]);
					}
				}
				return source_set;
			},
			getSourceById: function(sourceId) {
				for (var i = 0; i < this.sources.length; i++) {
					if (this.sources[i].id == sourceId) {
						return this.sources[i];
					}
				}
				return null;
			},
			setSourceByIndex: function(index) {
				mw.log('EmbedPlayer::mediaElement:selectSource: ' + index);
				var oldSrc = this.selectedSource.getSrc();
				var playableSources = this.getPlayableSources();
				for (var i = 0; i < playableSources.length; i++) {
					if (i == index) {
						this.selectedSource = playableSources[i];
						break;
					}
				}
				if (oldSrc != this.selectedSource.getSrc()) {
					$('#' + this.parentEmbedId).trigger('SourceChange');
				}
			},
			setSource: function(source) {
				var oldSrc = this.selectedSource.getSrc();
				this.selectedSource = source;
				if (oldSrc != this.selectedSource.getSrc()) {
					$('#' + this.parentEmbedId).trigger('SourceChange');
				}
			},
			autoSelectSource: function() {
				mw.log('EmbedPlayer::mediaElement::autoSelectSource');
				var _this = this;
				var playableSources = this.getPlayableSources();
				var flash_flag = false,
					ogg_flag = false;
				this.selectedSource = null;
				if (playableSources.length == 0) {
					return false;
				}
				var setSelectedSource = function(source) {
					_this.selectedSource = source;
					return _this.selectedSource;
				};
				$(this).trigger('onSelectSource', playableSources);
				if (_this.selectedSource) {
					mw.log('MediaElement::autoSelectSource: Set via trigger::' + _this.selectedSource.getTitle());
					return _this.selectedSource;
				}
				$.each(playableSources, function(inx, source) {
					if (source.markedDefault) {
						mw.log('MediaElement::autoSelectSource: Set via marked default: ' + source.markedDefault);
						return setSelectedSource(source);;
					}
				});
				var vndSources = this.getPlayableSources('application/vnd.apple.mpegurl')
				if (vndSources.length && mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers('application/vnd.apple.mpegurl').length) {
					var desktopVdn, mobileVdn;
					$.each(vndSources, function(inx, source) {
						if (source.getFlavorId() && source.getFlavorId().toLowerCase() == 'iphonenew') {
							mobileVdn = source;
						} else {
							desktopVdn = source;
						}
					})
					if (mw.isIphone() && mobileVdn) {
						setSelectedSource(mobileVdn);
					} else if (desktopVdn) {
						setSelectedSource(desktopVdn);
					}
				}
				if (this.selectedSource) {
					mw.log('MediaElement::autoSelectSource: Set via Adaptive HLS: source flavor id:' + _this.selectedSource.getFlavorId() + ' src: ' + _this.selectedSource.getSrc());
					return this.selectedSource;
				}
				if ($.cookie('EmbedPlayer.UserBandwidth') || this.preferedFlavorBR) {
					var bandwidthDelta = 999999999;
					var bandwidthTarget = $.cookie('EmbedPlayer.UserBandwidth') || this.preferedFlavorBR;
					$.each(playableSources, function(inx, source) {
						if (source.bandwidth) {
							var player = mw.EmbedTypes.getMediaPlayers().defaultPlayer(source.mimeType);
							if (!player || player.library != 'Native') {
								return true;
							}
							if (Math.abs(source.bandwidth - bandwidthTarget) < bandwidthDelta) {
								bandwidthDelta = Math.abs(source.bandwidth - bandwidthTarget);
								setSelectedSource(source);
							}
						}
					});
					if (this.selectedSource) {
						var setTypeName = ($.cookie('EmbedPlayer.UserBandwidth')) ? 'cookie' : 'preferedFlavorBR'
						mw.log('MediaElement::autoSelectSource: ' + 'Set via bandwidth, ' + setTypeName + ' source:' + this.selectedSource.bandwidth + ' target: ' + bandwidthTarget);
						return this.selectedSource;
					}
				}
				var nativePlayableSources = [];
				$.each(playableSources, function(inx, source) {
					var mimeType = source.mimeType;
					var player = mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType);
					if (player && player.library == 'Native') {
						nativePlayableSources.push(source);
					}
				});
				var namedSourceSet = {};
				$.each(playableSources, function(inx, source) {
					var mimeType = source.mimeType;
					var player = mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType);
					if (player && player.library == 'Native') {
						switch (player.id) {
							case 'mp3Native':
								var shortName = 'mp3';
								break;
							case 'oggNative':
								var shortName = 'ogg';
								break;
							case 'webmNative':
								var shortName = 'webm';
								break;
							case 'h264Native':
								var shortName = 'h264';
								break;
							case 'appleVdn':
								var shortName = 'appleVdn';
								break;
						}
						if (!namedSourceSet[shortName]) {
							namedSourceSet[shortName] = [];
						}
						namedSourceSet[shortName].push(source);
					}
				});
				if (mw.isMobileDevice() && namedSourceSet['h264'] && namedSourceSet['h264'].length) {
					var minSize = 99999999;
					$.each(namedSourceSet['h264'], function(inx, source) {
						if (parseInt(source.width) < parseInt(minSize) && parseInt(source.width) != 0) {
							minSize = source.width;
							setSelectedSource(source);
						}
					})
				}
				if (this.selectedSource) {
					mw.log('MediaElement::autoSelectSource: mobileDevice; most compatible h.264 because of resolution:' + this.selectedSource.width);
					return this.selectedSource;
				}
				var codecPref = mw.getConfig('EmbedPlayer.CodecPreference');
				if (codecPref) {
					for (var i = 0; i < codecPref.length; i++) {
						var codec = codecPref[i];
						if (!namedSourceSet[codec]) {
							continue;
						}
						if (namedSourceSet[codec].length == 1) {
							mw.log('MediaElement::autoSelectSource: Set 1 source via EmbedPlayer.CodecPreference: ' + namedSourceSet[codec][0].getTitle());
							return setSelectedSource(namedSourceSet[codec][0]);
						} else if (namedSourceSet[codec].length > 1) {
							var minSizeDelta = null;
							if (this.parentEmbedId) {
								var displayWidth = $('#' + this.parentEmbedId).width();
								$.each(namedSourceSet[codec], function(inx, source) {
									if (parseInt(source.width) && displayWidth) {
										var sizeDelta = Math.abs(source.width - displayWidth);
										if (minSizeDelta == null || sizeDelta < minSizeDelta) {
											minSizeDelta = sizeDelta;
											setSelectedSource(source);
										}
									}
								});
							}
							if (this.selectedSource) {
								mw.log('MediaElement::autoSelectSource: from  ' + this.selectedSource.mimeType + ' because of resolution:' + this.selectedSource.width + ' close to: ' + displayWidth);
								return this.selectedSource;
							}
							if (namedSourceSet[codec][0]) {
								mw.log('MediaElement::autoSelectSource: first codec prefrence source');
								return setSelectedSource(namedSourceSet[codec][0]);
							}
						}
					};
				}
				$.each(playableSources, function(inx, source) {
					var mimeType = source.mimeType;
					var player = mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType);
					if (mimeType == 'video/h264' && player && (player.library == 'Native' || player.library == 'Kplayer')) {
						if (source) {
							mw.log('MediaElement::autoSelectSource: Set h264 via native or flash fallback:' + source.getTitle());
							return setSelectedSource(source);
						}
					}
				});
				if (!this.selectedSource && playableSources[0]) {
					mw.log('MediaElement::autoSelectSource: Set via first source: ' + playableSources[0].getTitle() + ' mime: ' + playableSources[0].getMIMEType());
					return setSelectedSource(playableSources[0]);
				}
				mw.log('MediaElement::autoSelectSource: no match found');
				return false;
			},
			isOgg: function(mimeType) {
				if (mimeType == 'video/ogg' || mimeType == 'ogg/video' || mimeType == 'video/annodex' || mimeType == 'application/ogg') {
					return true;
				}
				return false;
			},
			getPosterSrc: function() {
				return this.poster;
			},
			hasStreamOfMIMEType: function(mimeType) {
				for (var i = 0; i < this.sources.length; i++) {
					if (this.sources[i].getMIMEType() == mimeType) {
						return true;
					}
				}
				return false;
			},
			isPlayableType: function(mimeType) {
				if (mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType)) {
					return true;
				} else {
					return false;
				}
			},
			tryAddSource: function(element) {
				var newSrc = $(element).attr('src');
				if (newSrc) {
					for (var i = 0; i < this.sources.length; i++) {
						if (this.sources[i].src == newSrc) {
							this.sources[i].updateSource(element);
							return this.sources[i];
						}
					}
				}
				var source = new mw.MediaSource(element);
				this.sources.push(source);
				return source;
			},
			getPlayableSources: function(mimeFilter) {
				var playableSources = [];
				for (var i = 0; i < this.sources.length; i++) {
					if (this.isPlayableType(this.sources[i].mimeType) && (!mimeFilter || this.sources[i].mimeType.indexOf(mimeFilter) != -1)) {
						playableSources.push(this.sources[i]);
					}
				};
				mw.log("MediaElement::GetPlayableSources mimeFilter:" + mimeFilter + " " + playableSources.length + ' sources playable out of ' + this.sources.length);
				return playableSources;
			}
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mw.MediaPlayer", function($) {
	(function(mw, $) {
		"use strict";
		mw.MediaPlayer = function(id, supportedTypes, library) {
			this.id = id;
			this.supportedTypes = supportedTypes;
			this.library = library;
			this.loaded = false;
			this.loading_callbacks = new Array();
			return this;
		};
		mw.MediaPlayer.prototype = {
			id: null,
			supportedTypes: null,
			library: null,
			loaded: false,
			supportsMIMEType: function(type) {
				for (var i = 0; i < this.supportedTypes.length; i++) {
					if (this.supportedTypes[i] == type) return true;
				}
				return false;
			},
			getName: function() {
				return gM('mwe-embedplayer-ogg-player-' + this.id);
			},
			load: function(callback) {
				mw.load(['mw.EmbedPlayer' + this.library.substr(0, 1).toUpperCase() + this.library.substr(1)], function() {
					if (callback) {
						callback();
					}
				});
			}
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mw.MediaPlayers", function($) {
	(function(mw, $) {
		"use strict";
		mw.MediaPlayers = function() {
			this.init();
		};
		mw.MediaPlayers.prototype = {
			players: null,
			preference: {},
			defaultPlayers: {},
			init: function() {
				this.players = new Array();
				this.loadPreferences();
				this.defaultPlayers['video/x-flv'] = ['Kplayer', 'Vlc'];
				this.defaultPlayers['video/h264'] = ['Native', 'Kplayer', 'Vlc'];
				this.defaultPlayers['video/mp4'] = ['Native', 'Kplayer', 'Vlc'];
				this.defaultPlayers['application/vnd.apple.mpegurl'] = ['Native'];
				this.defaultPlayers['video/ogg'] = ['Native', 'Vlc', 'Java', 'Generic'];
				this.defaultPlayers['video/webm'] = ['Native', 'Vlc'];
				this.defaultPlayers['application/ogg'] = ['Native', 'Vlc', 'Java', 'Generic'];
				this.defaultPlayers['audio/ogg'] = ['Native', 'Vlc', 'Java'];
				this.defaultPlayers['audio/mpeg'] = ['Native', 'Kplayer'];
				this.defaultPlayers['audio/mp3'] = ['Native', 'Kplayer'];
				this.defaultPlayers['video/mpeg'] = ['Vlc'];
				this.defaultPlayers['video/x-msvideo'] = ['Vlc'];
				this.defaultPlayers['image/jpeg'] = ['ImageOverlay'];
				this.defaultPlayers['image/png'] = ['ImageOverlay'];
			},
			addPlayer: function(player) {
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].id == player.id) {
						return;
					}
				}
				this.players.push(player);
			},
			isSupportedPlayer: function(playerId) {
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].id == playerId) {
						return true;
					}
				}
				return false;
			},
			getMIMETypePlayers: function(mimeType) {
				var mimePlayers = new Array();
				var _this = this;
				if (this.defaultPlayers[mimeType]) {
					$.each(this.defaultPlayers[mimeType], function(d, lib) {
						var library = _this.defaultPlayers[mimeType][d];
						for (var i = 0; i < _this.players.length; i++) {
							if (_this.players[i].library == library && _this.players[i].supportsMIMEType(mimeType)) {
								mimePlayers.push(_this.players[i]);
							}
						}
					});
				}
				return mimePlayers;
			},
			defaultPlayer: function(mimeType) {
				var mimePlayers = this.getMIMETypePlayers(mimeType);
				if (mimePlayers.length > 0) {
					for (var i = 0; i < mimePlayers.length; i++) {
						if (mimePlayers[i].id == this.preference[mimeType]) return mimePlayers[i];
					}
					return mimePlayers[0];
				}
				return null;
			},
			setFormatPreference: function(mimeFormat) {
				this.preference['formatPreference'] = mimeFormat;
				$.cookie('EmbedPlayer.Preference', JSON.stringify(this.preference));
			},
			loadPreferences: function() {
				this.preference = {};
				if ($.cookie('EmbedPlayer.Preference')) {
					this.preference = JSON.parse($.cookie('EmbedPlayer.Preference'));
				}
			},
			setPlayerPreference: function(playerId, mimeType) {
				var selectedPlayer = null;
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].id == playerId) {
						selectedPlayer = this.players[i];
						mw.log('EmbedPlayer::setPlayerPreference: choosing ' + playerId + ' for ' + mimeType);
						this.preference[mimeType] = playerId;
						$.cookie('EmbedPlayer.Preference', JSON.stringify(this.preference));
						break;
					}
				}
				if (selectedPlayer) {
					$('.mwEmbedPlayer').each(function(inx, playerTarget) {
						var embedPlayer = $(playerTarget).get(0);
						if (embedPlayer.mediaElement.selectedSource && (embedPlayer.mediaElement.selectedSource.mimeType == mimeType)) {
							embedPlayer.selectPlayer(selectedPlayer);
						}
					});
				}
			}
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mw.MediaSource", function($) {
	(function(mw, $) {
		"use strict";
		mw.mergeConfig('EmbedPlayer.SourceAttributes', ['id', 'src', 'title', 'URLTimeEncoding', 'nodeName', 'data-startoffset', 'data-durationhint', 'data-shorttitle', 'data-width', 'data-height', 'data-bandwidth', 'data-sizebytes', 'data-framerate', 'data-flavorid', 'data-aspect', 'data-mwtitle', 'data-mwprovider', 'start', 'end', 'default']);
		mw.MediaSource = function(element) {
			this.init(element);
		};
		mw.MediaSource.prototype = {
			mimeType: null,
			uri: null,
			title: null,
			markedDefault: false,
			URLTimeEncoding: false,
			startOffset: 0,
			duration: 0,
			id: null,
			startNpt: null,
			endNpt: null,
			srclang: null,
			init: function(element) {
				var _this = this;
				this.src = $(element).attr('src');
				var pUrl = new mw.Uri(this.src);
				if (typeof pUrl.query['t'] != 'undefined') {
					this.URLTimeEncoding = true;
				}
				var sourceAttr = mw.getConfig('EmbedPlayer.SourceAttributes');
				$.each(sourceAttr, function(inx, attr) {
					if ($(element).attr(attr)) {
						var attrName = (attr.indexOf('data-') === 0) ? attr.substr(5) : attr
						_this[attrName] = $(element).attr(attr);
						if (attrName == 'default') {
							_this[attrName] = $(element).attr(attr) == "true" ? true : false;
						}
					}
				});
				if (this.label) {
					this.title = this.label;
				}
				if ($(element).attr('type')) {
					this.mimeType = $(element).attr('type');
				} else if ($(element).attr('content-type')) {
					this.mimeType = $(element).attr('content-type');
				} else if ($(element)[0].tagName.toLowerCase() == 'audio') {
					this.mimeType = 'audio/ogg';
				} else {
					this.mimeType = this.detectType(this.src);
				}
				if (this.mimeType == 'video/theora') {
					this.mimeType = 'video/ogg';
				}
				if (this.mimeType == 'audio/vorbis') {
					this.mimeType = 'audio/ogg';
				}
				if (this.mimeType) {
					this.mimeType = this.mimeType.split(';')[0];
				}
				if ($(element).parent().attr('category')) {
					this.category = $(element).parent().attr('category');
				}
				if ($(element).attr('default')) {
					this.markedDefault = true;
				}
				this.getURLDuration();
			},
			updateSource: function(element) {
				if ($(element).attr("title")) {
					this.title = $(element).attr("title");
				}
			},
			updateSrcTime: function(startNpt, endNpt) {
				if (this.URLTimeEncoding) {
					if (!mw.npt2seconds(startNpt)) {
						startNpt = this.startNpt;
					}
					if (!mw.npt2seconds(endNpt)) {
						endNpt = this.endNpt;
					}
					this.src = mw.replaceUrlParams(this.src, {
						't': startNpt + '/' + endNpt
					});
					this.getURLDuration();
				}
			},
			setDuration: function(duration) {
				this.duration = duration;
				if (!this.endNpt) {
					this.endNpt = mw.seconds2npt(this.startOffset + duration);
				}
			},
			getMIMEType: function() {
				if (this.mimeType) {
					return this.mimeType;
				}
				this.mimeType = this.detectType(this.src);
				return this.mimeType;
			},
			setSrc: function(src) {
				this.src = src;
			},
			getSrc: function(serverSeekTime) {
				if (!serverSeekTime || !this.URLTimeEncoding) {
					return this.src;
				}
				var endvar = '';
				if (this.endNpt) {
					endvar = '/' + this.endNpt;
				}
				return mw.replaceUrlParams(this.src, {
					't': mw.seconds2npt(serverSeekTime) + endvar
				});
			},
			getTitle: function() {
				if (this.title) {
					return this.title;
				}
				if (this.label) {
					return this.label;
				}
				switch (this.getMIMEType()) {
					case 'video/h264':
						return gM('mwe-embedplayer-video-h264');
						break;
					case 'video/x-flv':
						return gM('mwe-embedplayer-video-flv');
						break;
					case 'video/webm':
						return gM('mwe-embedplayer-video-webm');
						break;
					case 'video/ogg':
						return gM('mwe-embedplayer-video-ogg');
						break;
					case 'audio/ogg':
						return gM('mwe-embedplayer-video-audio');
						break;
					case 'audio/mpeg':
						return gM('mwe-embedplayer-audio-mpeg');
						break;
					case 'video/3gp':
						return gM('mwe-embedplayer-video-3gp');
						break;
					case 'video/mpeg':
						return gM('mwe-embedplayer-video-mpeg');
						break;
					case 'video/x-msvideo':
						return gM('mwe-embedplayer-video-msvideo');
						break;
				}
				try {
					var fileName = new mw.Uri(mw.absoluteUrl(this.getSrc())).path.split('/').pop();
					if (fileName) {
						return fileName;
					}
				} catch (e) {}
				return this.mimeType;
			},
			getShortTitle: function() {
				var _this = this;
				if (this.shorttitle) {
					return this.shorttitle;
				}
				var genTitle = '';
				if (this.height) {
					if (this.heigth < 255) {
						genTitle += '240P ';
					} else if (this.height < 370) {
						genTitle += '360P ';
					} else if (this.height < 500) {
						genTitle += '480P ';
					} else if (this.height < 800) {
						genTitle += '720P ';
					} else {
						genTitle += '1080P ';
					}
				}
				genTitle += this.getTitle().replace('video', '').replace('a.', '');
				if (genTitle.length > 20) {
					genTitle = genTitle.substring(0, 17) + "...";
				}
				if (this.getBitrate()) {
					var bits = (Math.round(this.getBitrate() / 1024 * 10) / 10) + '';
					if (bits[0] == '0') {
						bits = bits.substring(1);
					}
					genTitle += ' ' + bits + 'Mbs ';
				}
				return genTitle
			},
			getURLDuration: function() {
				if (this.URLTimeEncoding) {
					var annoURL = new mw.Uri(this.src);
					if (annoURL.query.t) {
						var times = annoURL.query.t.split('/');
						this.startNpt = times[0];
						this.endNpt = times[1];
						this.startOffset = mw.npt2seconds(this.startNpt);
						this.duration = mw.npt2seconds(this.endNpt) - this.startOffset;
					} else {
						if (this.startOffset) {
							this.startNpt = mw.seconds2npt(this.startOffset);
						}
						if (this.duration) {
							this.endNpt = mw.seconds2npt(parseInt(this.duration) + parseInt(this.startOffset));
						}
					}
				}
			},
			getExt: function(uri) {
				var urlParts = new mw.Uri(uri);
				var ext = (urlParts.file) ? /[^.]+$/.exec(urlParts.file) : /[^.]+$/.exec(uri);
				if (!ext) {
					return '';
				}
				ext = /[^#]*/g.exec(ext.toString());
				return ext.toString().toLowerCase();
			},
			getFlavorId: function() {
				if (this.flavorid) {
					return this.flavorid;
				}
				return;
			},
			detectType: function(uri) {
				switch (this.getExt(uri)) {
					case 'smil':
					case 'sml':
						return 'application/smil';
						break;
					case 'm4v':
					case 'mp4':
						return 'video/h264';
						break;
					case 'm3u8':
						return 'application/vnd.apple.mpegurl';
						break;
					case 'webm':
						return 'video/webm';
						break;
					case '3gp':
						return 'video/3gp';
						break;
					case 'srt':
						return 'text/x-srt';
						break;
					case 'flv':
						return 'video/x-flv';
						break;
					case 'ogg':
					case 'ogv':
						return 'video/ogg';
						break;
					case 'oga':
						return 'audio/ogg';
						break;
					case 'mp3':
						return 'audio/mpeg';
						break;
					case 'anx':
						return 'video/ogg';
						break;
					case 'xml':
						return 'text/xml';
						break;
					case 'avi':
						return 'video/x-msvideo';
						break;
					case 'mpg':
						return 'video/mpeg';
						break;
					case 'mpeg':
						return 'video/mpeg';
						break;
				}
				mw.log("Error: could not detect type of media src: " + uri);
			},
			getBitrate: function() {
				if (this.bandwidth) {
					return this.bandwidth / 1024;
				}
				return 0;
			},
			getSize: function() {
				if (this.sizebytes) {
					return this.sizebytes;
				}
				return 0;
			}
		};
	})(mediaWiki, jQuery);;
}, {}, {});
mw.loader.implement("mw.PlayerSkinMvpcf", function($) {
	mw.PlayerSkinMvpcf = {
		playerClass: 'mv-player'
	};;
}, {
	"all": ".mv-player a:link{color:#ccc;text-decoration:none}.mv-player a:visited{color:#ccc;text-decoration:none}  .mv-player a:hover{color:#fff;text-decoration:underline}.mv-player img,.mv-player img a,.mv-player img a:hover{border:0}.mv-player .video{display:block;position:relative;font-size:1px;height:305px}.mv-player .control-bar{height:29px;margin:0;padding:0;border:0;z-index:2;position:absolute;bottom:0px;left:0px;right:0px}.mv-player .controlInnerSmall{ height:29px;float:left;display:inline}.mv-player .lButton{cursor:pointer;float:left;list-style:none outside none;margin:2px;padding:4px 0;width:24px;height:16px;position:relative}.mv-player .rButton{cursor:pointer;float:right;list-style:none outside none;margin:2px;padding:4px 0;width:23px;height:16px;position:relative}.mv-player .volume_icon{float:right;display:inline;width:22px;height:29px;padding:0 0 0 0}.mv-player .vol_container{z-index:99;width:23px;height:75px;width:23px;position:absolute;left:0px;background:#CCC}.mv-player .vol_container_below{top:30px}.mv-player .vol_container_top{top:-77px}.mv-player .vol_container .volume-slider{margin-top:5px;height:65px;width:10px;margin-left:auto ;margin-right:auto }.mv-player .vol_container .ui-slider-handle{cursor :pointer;width:10px;height:10px;position:absolute;left:-1px}.mv-player .time-disp{line-height:32px;height:29px;overflow:visible;font-size:10.2px;float:right;display:inline;border:none;padding-right:4px}.mv-player .speed-switch{width:50px}.mv-player .source-switch{width:70px}.mv-player .source-switch,.mv-player .speed-switch{border:medium none;display:inline;color:#eee;font:11px arial,sans-serif;line-height:20px;overflow:hidden;cursor:pointer;float:right;text-align:center;padding-top:4px;line-height:24px}.mv-player .play_head{float:left;display:inline;height:10px;margin-left:8px;margin-top:10px;margin-right:8px;position:relative}.mv-player .play_head_dvr{height :10px;margin-top :10px}.mv-player .play_head .ui-slider-handle{width:10px;height:15px;margin-left:-5px;margin-top:-0px;z-index:2}.mv-player .inOutSlider .ui-slider-handle{width:8px;cusror:move}.mv-player .overlay-win textarea{background:none repeat scroll 0 0 transparent;border:2px solid #333;color:#fff;font:11px arial,sans-serif;height:15px;overflow:hidden;padding-left:2px;width:97%}.mv-player .overlay-win div.ui-state-highlight{background:none repeat scroll 0 0 transparent;border-color:#554926;color:#FFE96E;float:left;padding:2px 5px}.mv-player .videoOptionsComplete div.ui-state-highlight a{color:#eee;font-weight:bold}.mv-player .overlay-win h2{font-size:115%}.mv-player .overlay-win{font-family :arial,sans-serif;font-size :85%}.mv-player .overlay-win a{text-decoration:none}.mv-player .overlay-win ul{padding-left:15px}.mv-player a:hover{}.mv-player .overlay-win ul li span{font-weight:bold;color:#fff}.mv-player .overlay-win h2{font-size:16px}.mv-player .overlay-win h3{font-size:14px}.active{font-size:12px}.ui-slider-horizontal.volume-slider{width:44px;height:2px;top:7px}.ui-slider-horizontal.volume-slider .ui-slider-handle{border-width:1px}\n\n/* cache key: resourceloader:filter:minify-css:7:235d1210c8cd21186df601ff9c68e792 */\n"
}, {});
mw.loader.implement("mw.Playlist", function($) {
	(function(mw, $) {
		"use strict";
		mw.Playlist = function(options) {
			return this.init(options);
		};
		mw.Playlist.prototype = {
			clipIndex: 0,
			targetPlayerSize: null,
			sourceHandler: null,
			theme: null,
			playerId: null,
			onTouchScroll: false,
			enableClipSwitch: true,
			bindPostfix: '.playlist',
			init: function(options) {
				var _this = this;
				if (options.src) this.src = options.src;
				if (options.srcPayLoad) {
					this.srcPayLoad = unescape(options.srcPayLoad).replace(/\+/g, ' ');
				}
				if (options.embedPlayer) {
					this.embedPlayer = options.embedPlayer;
					this.embedPlayer.playlist = this;
				}
				if (options.target) {
					this.$target = $(options.target);
				}
				this.playerId = (this.embedPlayer) ? this.embedPlayer.id : (options['id']) ? options['id'] : this.$target.attr('id');
				if (!this.$target.attr('id')) {
					this.$target.attr('id', this.playerId + '_pl');
				}
				this.id = this.$target.attr('id');
				$(mw).bind('EmbedPlayerWaitForMetaCheck', function(even, playerElement) {
					if ($(playerElement).hasClass('mwPlaylist')) {
						playerElement.waitForMeta = false;
					}
				});
				this.type = (options.type) ? options.type : mw.getConfig('Playlist.DefaultType');
				var namedOptions = ['layout', 'playerAspect', 'itemThumbWidth', 'titleHeight', 'titleLength', 'descriptionLength'];
				$.each(namedOptions, function(inx, optionName) {
					var confName = 'Playlist.' + optionName.charAt(0).toUpperCase() + optionName.substr(1);
					_this[optionName] = (typeof options[optionName] != 'undefined') ? options[optionName] : mw.getConfig(confName);
				});
			},
			getTitleHeight: function() {
				if (this.sourceHandler && typeof this.sourceHandler.titleHeight != 'undefined') return this.sourceHandler.titleHeight;
				return this.titleHeight;
			},
			formatTitle: function(text) {
				if (text.length > this.titleLength) return text;
			},
			formatDescription: function(text) {
				if (text.length > this.descriptionLength) return text.substr(0, this.descriptionLength - 3) + ' ...';
				return text;
			},
			drawPlaylist: function(drawDoneCallback) {
				var _this = this;
				if (!this.embedPlayer) {
					this.$target.loadingSpinner();
				}
				var callback = function() {
					if (_this.sourceHandler.autoPlay || _this.autoPlay) {
						if (_this.embedPlayer.canAutoPlay()) {
							_this.playClip(_this.clipIndex, (_this.sourceHandler.autoPlay || _this.autoPlay));
						}
					}
					drawDoneCallback();
				};
				this.loadPlaylistHandler(function(sourceHandler) {
					if (!_this.embedPlayer) {
						_this.$target.empty();
					}
					mw.log("Playlist::drawPlaylist: sourceHandler:" + sourceHandler);
					if (_this.sourceHandler.getClipList().length == 0) {
						_this.$target.text(gM('mwe-playlist-empty'));
						callback();
						return;
					}
					if (_this.sourceHandler.hasPlaylistUi()) {
						_this.drawUI(callback);
					} else {
						_this.drawEmbedPlayer(_this.clipIndex, callback);
					}
				});
			},
			getClipList: function() {
				return this.sourceHandler.getClipList();
			},
			getVideoListWrapper: function() {
				var listWrapId = 'video-list-wrapper-' + this.id;
				var $listWrap = this.$target.find('#' + listWrapId)
				if (!$listWrap.length) {
					$listWrap = $('<div />').attr('id', listWrapId).addClass('video-list-wrapper').appendTo(this.$target)
				}
				return $listWrap;
			},
			getVideoList: function() {
				return this.getVideoListWrapper().find('.media-rss-video-list');
			},
			getListHeight: function() {
				var height = this.getVideoListWrapper().height() - 10;
				var $tabs = this.getVideoListWrapper().find('.playlist-set-container');
				if ($tabs.length) {
					height = height - $tabs.outerHeight();
				}
				return height;
			},
			setVideoWrapperHeight: function(height) {
				this.videoListWrapperHeight = height;
				this.getVideoListWrapper().height(height);
				this.getVideoList().height(this.getListHeight());
			},
			getVideoListWrapperHeight: function() {
				if (this.videoListWrapperHeight) {
					return this.videoListWrapperHeight;
				}
				return this.getVideoListWrapper().height();
			},
			drawUI: function(callback) {
				var _this = this;
				var embedPlayer = _this.getEmbedPlayer();
				this.$target.addClass('ui-widget-content');
				this.getVideoListWrapper().append($('<div />').addClass('media-rss-video-list').attr('id', 'media-rss-video-list-' + _this.id))
				if ($.isFunction(_this.sourceHandler.setupPlaylistMode)) {
					_this.sourceHandler.setupPlaylistMode(_this.layout);
				}
				if (_this.sourceHandler.hasMultiplePlaylists()) {
					var playlistSet = _this.sourceHandler.getPlaylistSet();
					var $plListContainer = $('<div />').addClass('playlist-set-container').css({
						'height': '20px',
						'padding': '4px'
					}).append($('<span />').addClass('playlist-set-list').css({
							'white-space': 'pre'
						}));
					this.getVideoListWrapper().prepend($plListContainer);
					var $plListSet = this.$target.find('.playlist-set-list');
					$.each(playlistSet, function(inx, playlist) {
						if (!playlist.name) {
							return true;
						}
						if (inx != 0) {
							$plListSet.append($('<span />').text(' | '));
						}
						var $plLink = $('<a />').attr('href', '#').text(playlist.name).click(function() {
							_this.switchTab(inx);
							return false;
						}).buttonHover();
						if (inx == 0) {
							$plLink.addClass('ui-state-active');
						}
						$plListSet.append($plLink);
					});
					if ($plListSet.width() > $plListContainer.width()) {
						var baseButtonWidth = 24;
						$plListSet.css({
							'position': 'absolute',
							'left': baseButtonWidth + 'px'
						});
						var $scrollButton = $('<div />').addClass('ui-corner-all ui-state-default').css({
							'position': 'absolute',
							'top': '-1px',
							'cursor': 'pointer',
							'margin': '0px',
							'padding': '2px',
							'width': '16px',
							'height': '16px'
						});
						var $buttonSpan = $('<span />').addClass('ui-icon').css('margin', '2px');
						var plScrollPos = 0;
						var scrollToListPos = function(pos) {
							var listSetLeft = $plListSet.find('a').eq(pos).offset().left - $plListSet.offset().left;
							mw.log("scroll to: " + pos + ' left: ' + listSetLeft);
							$plListSet.animate({
								'left': -(listSetLeft - baseButtonWidth) + 'px'
							});
						};
						$plListContainer.append($scrollButton.clone().css('left', '0px').append($buttonSpan.clone().addClass('ui-icon-circle-arrow-w')).click(function() {
							if (plScrollPos >= 0) {
								mw.log("scroll right");
								plScrollPos--;
								scrollToListPos(plScrollPos);
							}
						}).buttonHover(), $scrollButton.clone().css('right', '0px').append($buttonSpan.clone().addClass('ui-icon-circle-arrow-e')).click(function() {
							if (plScrollPos < $plListSet.find('a').length - 1) {
								plScrollPos++;
								scrollToListPos(plScrollPos);
							}
						}).buttonHover());
					}
				}
				_this.addMediaList();
				var $videoList = _this.getVideoList();
				_this.drawEmbedPlayer(_this.clipIndex, function() {
					_this.updatePlaylistLayout();
					_this.sourceHandler.adjustTextWidthAfterDisplay($videoList);
					if (mw.isMobileDevice() && !$videoList[0].iScroll) {}
					if (callback) {
						callback();
					}
				});
			},
			updatePlaylistLayout: function() {
				var playerSize = this.getTargetPlayerSize();
				this.embedPlayer.updateInterfaceSize(playerSize);
				if (this.layout == 'vertical') {
					var verticalSpace = this.embedPlayer.getInterface().height();
					this.getVideoListWrapper().css({
						'left': '0px',
						'right': '4px'
					});
				} else {
					this.getVideoListWrapper().css({
						'top': '0px',
						'left': parseInt(playerSize.width) + 4,
						'right': '2px',
						'height': playerSize.height
					});
					this.getVideoList().css('height', this.getListHeight());
					if (this.getVideoList()[0] && this.getVideoList()[0].iScroll) {
						this.getVideoList()[0].iScroll.refresh();
					}
				}
				this.getVideoListWrapper().show();
			},
			switchTab: function(inx) {
				var _this = this;
				var $tabSet = this.$target.find('.playlist-set-list');
				$tabSet.find('a').eq(inx).addClass('ui-state-active').siblings().removeClass('ui-state-active');
				_this.sourceHandler.setPlaylistIndex(inx);
				mw.log('mw.Playlist:: selectPlaylist:' + inx);
				_this.$target.find('.media-rss-video-list').empty().append($('<div />').css({
					'position': 'absolute',
					'top': '45%',
					'left': '45%'
				}).loadingSpinner())
				_this.sourceHandler.loadCurrentPlaylist(function() {
					_this.$target.find('.media-rss-video-list').empty();
					_this.addMediaList();
					_this.embedPlayer.triggerHelper('indexChanged', {
						'newIndex': inx
					});
				});
			},
			getTargetPlayerSize: function() {
				var _this = this;
				this.targetWidth = this.$target.width();
				this.targetHeight = this.$target.height();
				if (!_this.sourceHandler.hasPlaylistUi()) {
					return {
						'width': this.targetWidth,
						'height': this.targetHeight
					};
				}
				if (_this.layout == 'vertical') {
					if (this.embedPlayer.controlBuilder.height == this.embedPlayer.getInterface().height()) {
						this.targetHeight = this.embedPlayer.controlBuilder.height;
					} else {
						this.targetHeight = this.targetHeight - this.getVideoListWrapperHeight();
					}
					this.targetPlayerSize = {
						'width': this.targetWidth,
						'height': this.targetHeight
					};
				} else {
					var playerWidth = parseInt(this.$target.find('.media-rss-video-player-container').css('width'));
					if (isNaN(playerWidth) || !playerWidth) {
						if (_this.sourceHandler.getVideoListWidth() != 'auto') {
							playerWidth = this.targetWidth - _this.sourceHandler.getVideoListWidth();
						} else {
							var pa = this.playerAspect.split(':');
							playerWidth = parseInt((pa[0] / pa[1]) * this.targetHeight);
						}
					}
					this.targetPlayerSize = {
						'height': (this.targetHeight - this.getTitleHeight()),
						'width': playerWidth
					};
				}
				if (parseInt(this.targetPlayerSize.width) > this.targetWidth) {
					var pa = this.playerAspect.split(':');
					this.targetPlayerSize.width = this.targetWidth;
					this.targetPlayerSize.height = parseInt((pa[1] / pa[0]) * this.targetWidth);
				}
				return this.targetPlayerSize;
			},
			getEmbedPlayer: function() {
				return $('#' + this.getVideoPlayerId())[0];
			},
			getVideoPlayerTarget: function() {
				return this.$target.find('.media-rss-video-player');
			},
			playClip: function(clipIndex, autoContinue) {
				var _this = this;
				mw.log("Playlist::playClip: index: " + clipIndex + ' autoContinue: ' + autoContinue);
				var embedPlayer = this.getEmbedPlayer();
				this.clipIndex = clipIndex;
				if (!embedPlayer) {
					mw.log("Error: Playlist:: playClip called with null embedPlayer ");
					return;
				}
				embedPlayer.triggerHelper('Playlist_PlayClip', [clipIndex, !! autoContinue]);
				if (embedPlayer.getPlayerElement()) {
					mw.log("Playlist:: issue load call to capture click for iOS");
					embedPlayer.getPlayerElement().load();
				}
				_this.updatePlayerUi(clipIndex);
				_this.disablePrevNext();
				_this.sourceHandler.playClip(embedPlayer, clipIndex, function() {
					mw.log("Playlist::playClip > sourceHandler playClip callback ");
					_this.enablePrevNext();
					_this.addClipBindings();
					embedPlayer.onDoneInterfaceFlag = true;
				});
			},
			drawEmbedPlayer: function(clipIndex, callback) {
				var _this = this;
				mw.log("Playlist:: updatePlayer " + clipIndex);
				this.clipIndex = clipIndex;
				var embedPlayer = _this.getEmbedPlayer();
				if ($(embedPlayer).data('clipIndex') == clipIndex) {
					callback();
					return;
				}
				_this.sourceHandler.drawEmbedPlayer(clipIndex, function() {
					_this.updatePlayerUi(_this.clipIndex);
					_this.addClipBindings();
					callback();
				});
			},
			addClipBindings: function() {
				var _this = this;
				mw.log("Playlist::addClipBindings");
				var embedPlayer = _this.getEmbedPlayer();
				$(embedPlayer).unbind(this.bindPostfix);
				_this.sourceHandler.addEmbedPlayerBindings(embedPlayer);
				_this.addPlaylistSeekButtons();
				_this.addPlaylistAdBindings();
				if (_this.sourceHandler.autoContinue == true) {
					$(embedPlayer).bind('postEnded' + _this.bindPostfix, function(event) {
						mw.log("Playlist:: postEnded > on inx: " + _this.clipIndex);
						if (parseInt(_this.clipIndex) + 1 < _this.sourceHandler.getClipCount() && parseInt(_this.clipIndex) + 1 <= parseInt(mw.getConfig('Playlist.MaxClips'))) {
							mw.log("Playlist:: postEnded > continue playlist set: onDoneInterfaceFlag false ");
							embedPlayer.onDoneInterfaceFlag = false;
							_this.clipIndex = parseInt(_this.clipIndex) + 1;
							_this.playClip(_this.clipIndex, true);
						} else {
							mw.log("Playlist:: End of playlist, run normal end action");
							embedPlayer.triggerHelper('playlistDone');
							if (_this.sourceHandler.loop) {
								embedPlayer.onDoneInterfaceFlag = false;
								_this.clipIndex = 0;
								_this.playClip(_this.clipIndex, true);
							} else {
								embedPlayer.onDoneInterfaceFlag = true;
							}
						}
					});
				}
				var uiSelector = '.playlist-set-container,.playlist-block-list,.video-list-wrapper,.playlist-scroll-buttons';
				$(embedPlayer).bind('onOpenFullScreen' + this.bindPostfix, function() {
					$(uiSelector).hide();
					_this.$target.find('.playlist-block-list').hide();
				});
				$(embedPlayer).bind('onCloseFullScreen' + this.bindPostfix, function() {
					_this.$target.find('.playlist-block-list').show();
					if (!_this.sourceHandler.includeInLayout) {
						return;
					}
					$(uiSelector).show();
				});
				$(embedPlayer).bind('updateLayout' + this.bindPostfix, function() {
					if (embedPlayer.controlBuilder.isInFullScreen() || !embedPlayer.displayPlayer || !_this.sourceHandler.includeInLayout) {
						return;
					}
					_this.updatePlaylistLayout();
				});
				$(embedPlayer).bind('playlistPlayPrevious' + this.bindPostfix, function() {
					_this.playPrevious();
				});
				$(embedPlayer).bind('playlistPlayNext' + this.bindPostfix, function() {
					_this.playNext();
				});
				$(embedPlayer).bind('onDisableInterfaceComponents' + this.bindPostfix, function(event, excludingComponents) {
					if (!excludingComponents || ($.inArray('playlistPrevNext', excludingComponents) == -1)) {
						_this.disablePrevNext();
					}
				});
				$(embedPlayer).bind('onEnableInterfaceComponents' + this.bindPostfix, function() {
					_this.enablePrevNext();
				});
				$(embedPlayer).trigger('playlistsListed');
			},
			disablePrevNext: function() {
				this.embedPlayer.$interface.find('.playlistPlayPrevious,.playlistPlayNext').unbind('mouseenter mouseleave click').css('cursor', 'default');
			},
			enablePrevNext: function() {
				var _this = this;
				this.embedPlayer.$interface.find('.playlistPlayPrevious,.playlistPlayNext').css('cursor', 'pointer').unbind('click').click(function() {
					if ($(this).hasClass('playlistPlayPrevious')) {
						$(_this.embedPlayer).trigger('playlistPlayPrevious');
					} else if ($(this).hasClass('playlistPlayNext')) {
						$(_this.embedPlayer).trigger('playlistPlayNext');
					}
				}).buttonHover();
			},
			updatePlayerUi: function(clipIndex) {
				var _this = this;
				_this.sourceHandler.updatePlayerUi(clipIndex);
				_this.$target.find('.clipItemBlock').removeClass('ui-state-active').addClass('ui-state-default').eq(clipIndex).addClass('ui-state-active');
			},
			getVideoPlayerId: function() {
				return this.playerId;
			},
			addPlaylistSeekButtons: function() {
				var _this = this;
				var embedPlayer = this.getEmbedPlayer();
				if (!embedPlayer) {
					return;
				}
				if (!embedPlayer.controlBuilder) {
					return;
				}
				var $controlBar = embedPlayer.$interface.find('.control-bar');
				if ($controlBar.find('.ui-icon-seek-next').length != 0) {
					return false;
				}
				var $plButton = $('<div />').addClass("ui-state-default ui-corner-all ui-icon_link lButton").buttonHover().append($('<span />').addClass("ui-icon"));
				var $playButton = $controlBar.find('.play-btn');
				if (_this.sourceHandler.isNextButtonDisplayed()) {
					var pleft = parseInt($controlBar.find('.play_head').css('left')) + 28;
					$controlBar.find('.play_head').css('left', pleft);
					var $nextButton = $plButton.clone().attr({
						'title': 'Next clip'
					}).unbind('click').click(function() {
							$(embedPlayer).trigger('playlistPlayNext');
						}).addClass('playlistPlayNext').find('span').addClass('ui-icon-seek-next').parent().buttonHover();
					$playButton.after($nextButton);
				}
				if (_this.sourceHandler.isPreviousButtonDisplayed()) {
					var pleft = parseInt($controlBar.find('.play_head').css('left')) + 28;
					$controlBar.find('.play_head').css('left', pleft);
					var $prevButton = $plButton.clone().attr({
						'title': 'Previous clip'
					}).unbind('click').click(function() {
							$(embedPlayer).trigger('playlistPlayPrevious');
						}).addClass('playlistPlayPrevious').find('span').addClass('ui-icon-seek-prev').parent().buttonHover();
					$playButton.after($prevButton);
				}
			},
			addPlaylistAdBindings: function() {
				var _this = this;
				var embedPlayer = this.getEmbedPlayer();
				$(embedPlayer).bind('AdSupport_StartAdPlayback' + this.bindPostfix, function() {
					_this.blockPlaylist();
				});
				$(embedPlayer).bind('AdSupport_EndAdPlayback' + this.bindPostfix, function() {
					_this.restorePlaylist();
				});
			},
			blockPlaylist: function() {
				var _this = this;
				var embedPlayer = this.getEmbedPlayer();
				_this.enableClipSwitch = false;
				var $listwrap = this.$target.find('.video-list-wrapper');
				var cssPops = ['width', 'height', 'position', 'bottom', 'right', 'left', 'top'];
				var cssObj = {};
				$.each(cssPops, function(inx, prop) {
					cssObj[prop] = $listwrap.css(prop);
				});
				if (!this.$target.find('.playlist-block-list').length) {
					$listwrap.before($('<div />').css(cssObj).addClass('playlist-block-list').css({
						'z-index': 2,
						'background-color': '#FFF',
						'opacity': '0.7',
						'filter': 'alpha(opacity=70)'
					}).click(function() {
							return false;
						}));
				}
				if (embedPlayer.controlBuilder.isInFullScreen()) {
					_this.$target.find('.playlist-block-list').hide();
				}
			},
			restorePlaylist: function() {
				this.enableClipSwitch = true;
				this.$target.find('.playlist-block-list').remove();
			},
			addMediaList: function() {
				var _this = this;
				var $targetItemList = this.$target.find('.media-rss-video-list');
				this.playlistItemWidth = $targetItemList.width();
				$.each(this.sourceHandler.getClipList(), function(inx, clip) {
					mw.log('mw.Playlist::addMediaList: On clip: ' + inx);
					if (inx > mw.getConfig('Playlist.MaxClips')) {
						return false;
					}
					var $itemBlock = $('<div />').addClass('ui-widget-content ui-corner-all playlistItem ui-helper-clearfix');
					if (_this.clipIndex == inx) {
						$itemBlock.addClass('ui-state-active');
					} else {
						$itemBlock.addClass('ui-state-default');
					}
					$itemBlock.append(_this.sourceHandler.getPlaylistItem(inx)).data('clipIndex', inx).buttonHover().addClass('clipItemBlock').css({
						'cursor': 'pointer'
					}).bind('click', function(event) {
							if (_this.embedPlayer.changeMediaStarted) {
								return;
							}
							if (!_this.enableClipSwitch) {
								return;
							}
							if (_this.onTouchScroll && !mw.isIOS()) {
								return;
							}
							_this.clipIndex = $(this).data('clipIndex');
							_this.playClip(_this.clipIndex);
						});
					$targetItemList.append($itemBlock);
				});
			},
			play: function() {
				mw.log('mw.Playlist::play ');
				var embedPlayer = $('#' + this.getVideoPlayerId())[0];
				embedPlayer.play();
			},
			playNext: function() {
				var _this = this;
				if (_this.enableClipSwitch && parseInt(_this.clipIndex) + 1 < _this.sourceHandler.getClipCount() && parseInt(_this.clipIndex) + 1 <= parseInt(mw.getConfig('Playlist.MaxClips'))) {
					_this.clipIndex++;
					_this.playClip(_this.clipIndex);
					return;
				}
				mw.log("Error: mw.playlist can't next: current: " + _this.clipIndex);
			},
			playPrevious: function() {
				var _this = this;
				if (_this.enableClipSwitch && _this.clipIndex - 1 >= 0) {
					_this.clipIndex--;
					_this.playClip(_this.clipIndex);
					return;
				}
				mw.log("Cant prev: cur:" + _this.clipIndex);
			},
			loadPlaylistHandler: function(callback) {
				var _this = this;
				$(mw).trigger('PlaylistGetSourceHandler', [this]);
				if (!_this.sourceHandler) {
					switch (this.type) {
						case 'application/rss+xml':
							_this.sourceHandler = new mw.PlaylistHandlerMediaRss(this);
							break;
					}
				};
				_this.sourceHandler.loadPlaylist(function() {
					callback(_this.sourceHandler);
				});
			},
			setSourceHandler: function(sourceHandler) {
				this.sourceHandler = sourceHandler;
			}
		};
	})(window.mw, jQuery);;
}, {
	"all": ".media-rss-video-list .ui-state-default{background-color:#222; background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sGEBApKAahcBIAAAANSURBVAjXY2BgYGAAAAAFAAFe8yo6AAAAAElFTkSuQmCC)}.media-rss-video-list .ui-state-active{background-color:#444}.playlistItem img{float:left;padding:4px;vertical-align:middle}.playlistItem{font-size:12px;margin:5px;padding:2px}.playlistItem .clipText{width:100%;vertical-align:text-top}.playlistItem .clipTitle{float:left;display:block}.playlistItem .clipDuration{float:right;height:16px;display:block;padding-right:2px}.playlist-set-container{font-size:12px;margin:5px}.media-rss-video-list{margin:5px;margin-left:8px;overflow-x:hidden;overflow-y:auto}.video-list-wrapper{background-color:#111;z-index:1;position:absolute;height:100%;border:0;overflow:hidden}.playlist-set-list{padding-left:15px;font-size:14px}.playlist-set-list a{color:#999}.playlist-set-list a.active{color:#fff}.btnText{font-family:Arial;font-size:13px}.playlist-set-container a{text-decoration:none;border:0;font-size:13px;font-family:Arial}.playlist-set-container a:hover{border-width:0;background:transparent}.playlist-set-container .ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active,.playlist-set-container .ui-widget-content .ui-state-hover,.playlist-set-container .ui-widget-header .ui-state-hover{border-width:0}.mv-player .play_head .ui-slider-handle{border-width:1px}.ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default{border-width:0}.playlistItem{background:#252525;min-height:50px;border-radius:4px;padding:8px;margin-bottom:4px;cursor:pointer;border-width:0;font-family:Arial}.playlistItem img{float:left;margin-right:8px;width:72px;height:48px;padding:0}.playlistItem:hover{background:#3C3C3C}.playlistItem{background:#3C3C3C;font-size:11px}.irLinkIrScreen,.clipTitle{float:left;color:#bcbcbc;width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:break-word}.irDurationIrScreen,.clipDuration{float:right;margin-right:10px;color:#bcbcbc;font-size:10px}.irDescriptionIrScreen,.clipDescription{color:#bcbcbc;word-wrap:break-word;display:inline-block} .horizontal .video-list-wrapper{float:right}.horizontal .video-list-wrapper{} .vertical .video-list-wrapper{height:auto}.vertical .video-list-wrapper{width:100%;position:absolute;bottom:0}\n\n/* cache key: resourceloader:filter:minify-css:7:e9714221a18f38054eb974958956f6a3 */\n"
}, {
	"mwe-playlist-empty": "Error: empty or not valid playlist"
});
mw.loader.implement("mw.PlaylistHandlerKaltura", function($) {
	(function(mw, $) {
		"use strict";
		mw.PlaylistHandlerKaltura = function(playlist, options) {
			return this.init(playlist, options);
		};
		mw.setConfig('KalturaSupport.PlaylistDefaultItemRenderer', '<hbox id="irCont" height="100%" width="100%" x="10" y="10" verticalalign="top" stylename="Button_upSkin_default"> <img id="irImageIrScreen" url="{this.thumbnailUrl}" source="{this.thumbnailUrl}" height="48" width="72"> <vbox height="100%" width="100%" id="labelsHolder" verticalgap="0"> <hbox id="nameAndDuration" width="100%" height="18"> <label id="irLinkIrScreen" height="18" width="100%" text="{this.name}" stylename="itemRendererLabel" label="{this.name}" prefix="" font="Arial"></label> <label id="irDurationIrScreen" height="18" width="70" text="{formatDate(this.duration, \'NN:SS\')}" stylename="itemRendererLabel" prefix="" font="Arial"></label> </hbox> <label id="irDescriptionIrScreen" width="240" height="18" text="{this.description}" stylename="itemRendererLabel" prefix="" font="Arial"></label> </vbox> </hbox>');
		mw.PlaylistHandlerKaltura.prototype = {
			clipList: null,
			widget_id: null,
			playlist_id: null,
			mrssHandler: null,
			playlistSet: [],
			titleHeight: 0,
			$uiConf: null,
			includeInLayout: true,
			loadingEntry: null,
			bindPostFix: '.playlistHandlerKaltura',
			errorMsg: null,
			init: function(playlist, options) {
				this.playlist = playlist;
				for (var i in options) {
					this[i] = options[i];
				}
			},
			getConfig: function(key) {
				return this.playlist.embedPlayer.getKalturaConfig('playlistAPI', key);
			},
			loadPlaylist: function(callback) {
				var _this = this;
				var embedPlayer = this.playlist.embedPlayer;
				var $uiConf = embedPlayer.$uiConf;
				mw.log("mw.PlaylistHandlerKaltura:: loadPlaylist > ");
				if (!embedPlayer.kalturaPlaylistData) {
					mw.log('Error: no playlists were found in embedPlayer.kalturaPlaylistData.');
					return false;
				}
				_this.playlistSet = [];
				for (var playlistId in embedPlayer.kalturaPlaylistData) {
					if (embedPlayer.kalturaPlaylistData.hasOwnProperty(playlistId)) {
						_this.playlistSet.push(embedPlayer.kalturaPlaylistData[playlistId]);
					}
				}
				if (_this.playlistSet.length == 0) {
					mw.log("Error: could not find any playlists.");
					return false;
				}
				var plConf = _this.playlist.embedPlayer.getKalturaConfig('playlist', ['includeInLayout', 'width', 'height']);
				_this.autoContinue = _this.getConfig('autoContinue');
				mw.log("mw.PlaylistHandlerKaltura::loadPlaylist > autoContinue: " + _this.autoContinue);
				_this.autoPlay = _this.getConfig('autoPlay');
				_this.loop = _this.getConfig('loop');
				_this.videolistWidth = (plConf.width) ? plConf.width : $uiConf.find('#playlist').attr('width');
				_this.videolistHeight = (plConf.height) ? plConf.height : $uiConf.find('#playlist').attr('height');
				if (plConf.includeInLayout === false || parseInt($uiConf.find('#playlistHolder').attr('width')) == 0) {
					_this.includeInLayout = false;
				} else if (parseInt(_this.videolistWidth) == 0) {
					_this.videolistWidth = 250;
				}
				_this.$playlistItemRenderer = $uiConf.find('#playlistItemRenderer');
				if (_this.$playlistItemRenderer.children().length == 0) {
					_this.$playlistItemRenderer = $(mw.getConfig('KalturaSupport.PlaylistDefaultItemRenderer'));
				}
				if (!_this.includeInLayout) {
					_this.autoContinue = true;
				}
				mw.log("PlaylistHandlerKaltura:: got  " + _this.playlistSet.length + ' playlists ');
				_this.setPlaylistIndex(0);
				_this.loadCurrentPlaylist(function() {
					var initItemEntryId = _this.getConfig('initItemEntryId');
					if (initItemEntryId) {
						$.each(_this.getClipList(), function(inx, clip) {
							if (clip.id == initItemEntryId) {
								_this.playlist.clipIndex = inx;
							}
						});
					}
					if ($.isFunction(callback)) {
						callback();
					}
				});
			},
			getPlaylistSize: function() {
				var embedPlayer = this.playlist.getEmbedPlayer();
				var pWidth = embedPlayer.getKalturaConfig('playlistHolder', 'width');
				if (!pWidth) {
					pWidth = embedPlayer.getKalturaConfig('playlist', 'width');
				}
				var pHeight = embedPlayer.getKalturaConfig('playlistHolder', 'height');
				if (!pHeight) {
					pHeight = embedPlayer.getKalturaConfig('playlist', 'height');
				}
				if (typeof pWidth == 'string' && pWidth.indexOf('%') == -1) {
					pWidth = pWidth + 'px';
				}
				if (typeof pHeight == 'string' && pHeight.indexOf('%') == -1) {
					pHeight = pHeight + 'px';
				}
				return {
					width: pWidth,
					height: pHeight
				};
			},
			setupPlaylistMode: function(layout) {
				var _this = this;
				var embedPlayer = this.playlist.getEmbedPlayer();
				var playerHolder = embedPlayer.getKalturaConfig('PlayerHolder', ["visible", "includeInLayout"]);
				if ((playerHolder.visible === false || playerHolder.includeInLayout === false) && !embedPlayer.useNativePlayerControls()) {
					embedPlayer.displayPlayer = false;
				}
				var updateLayout = function() {
					mw.log("PlaylistHandlerKaltura:: updateLayout:");
					var playlistSize = _this.getPlaylistSize();
					if (layout == 'vertical') {
						if (playlistSize.height == '100%') {
							var windowHeight = window.innerHeight;
							if (mw.getConfig('EmbedPlayer.IsFriendlyIframe') && mw.isIOS()) {
								windowHeight = $(window.parent.document.getElementById(embedPlayer.id)).height()
							}
							playlistSize.height = (windowHeight - embedPlayer.getComponentsHeight());
						}
						_this.playlist.setVideoWrapperHeight(playlistSize.height);
					} else {
						_this.playlist.getVideoListWrapper().width(playlistSize.width);
					}
				};
				updateLayout();
				embedPlayer.bindHelper('updateLayout' + this.bindPostFix, function() {
					updateLayout()
				});
			},
			hasMultiplePlaylists: function() {
				return (this.playlistSet.length > 1);
			},
			hasPlaylistUi: function() {
				return this.includeInLayout;
			},
			isNextButtonDisplayed: function() {
				return !!this.playlist.getEmbedPlayer().$uiConf.find('#nextBtnControllerScreen').length;
			},
			isPreviousButtonDisplayed: function() {
				return !!this.playlist.getEmbedPlayer().$uiConf.find('#previousBtnControllerScreen').length;
			},
			getPlaylistSet: function() {
				return this.playlistSet;
			},
			getVideoListWidth: function() {
				return parseInt(this.videolistWidth) + 10;
			},
			setPlaylistIndex: function(playlistIndex) {
				this.playlist_id = this.playlistSet[playlistIndex].id;
				var embedPlayer = this.playlist.getEmbedPlayer();
				if (embedPlayer.kalturaPlaylistData) {
					embedPlayer.kalturaPlaylistData.currentPlaylistId = this.playlist_id;
				}
			},
			setClipIndex: function(clipIndex) {
				var embedPlayer = this.playlist.getEmbedPlayer();
				if (embedPlayer.kalturaPlaylistData) {
					embedPlayer.kalturaPlaylistData.currentPlaylistId = this.playlist_id;
					embedPlayer.setKalturaConfig('playlistAPI', 'dataProvider', {
						'selectedIndex': clipIndex
					});
				}
			},
			loadCurrentPlaylist: function(callback) {
				this.loadPlaylistById(this.playlist_id, callback);
			},
			loadPlaylistById: function(playlist_id, loadedCallback) {
				var _this = this;
				mw.log("PlaylistHandlerKaltura::loadPlaylistById> " + playlist_id);
				var embedPlayer = this.playlist.embedPlayer;
				if (!embedPlayer.kalturaPlaylistData) {
					embedPlayer.kalturaPlaylistData = {};
				}
				var callback = function() {
					if (embedPlayer.playerReadyFlag) {
						embedPlayer.triggerHelper('playlistReady');
					} else {
						embedPlayer.bindHelper('playerReady.playlistReady', function() {
							$(embedPlayer).unbind('playerReady.playlistReady');
							embedPlayer.triggerHelper('playlistReady');
						});
					}
					if ($.isFunction(loadedCallback)) {
						loadedCallback();
					}
				};
				if (embedPlayer.kalturaPlaylistData[playlist_id] && embedPlayer.kalturaPlaylistData[playlist_id].items && embedPlayer.kalturaPlaylistData[playlist_id].items.length) {
					_this.clipList = embedPlayer.kalturaPlaylistData[playlist_id].items;
					embedPlayer.setKalturaConfig('playlistAPI', 'dataProvider', {
						'content': _this.clipList
					});
					callback();
					return;
				}
				var playlistRequest = {
					'service': 'playlist',
					'action': 'execute',
					'id': playlist_id
				};
				this.getKClient().doRequest(playlistRequest, function(playlistDataResult) {
					_this.clipList = [];
					var playlistData;
					if (playlistDataResult[0] && playlistDataResult[0].id) {
						playlistData = playlistDataResult;
					} else if (playlistDataResult[0] && playlistDataResult[0][0].id) {
						playlistData = playlistDataResult[0];
					} else {
						mw.log("Error: kaltura playlist:" + playlist_id + " could not load:" + playlistDataResult.code);
						_this.errorMsg = "Error loading playlist:" + playlistDataResult.code;
						callback();
						return;
					}
					mw.log('PlaylistHandlerKaltura::Got playlist of length::' + playlistData.length);
					if (playlistData.length > mw.getConfig("Playlist.MaxClips")) {
						playlistData = playlistData.splice(0, mw.getConfig("Playlist.MaxClips"));
					}
					embedPlayer.kalturaPlaylistData[playlist_id].items = playlistData;
					embedPlayer.setKalturaConfig('playlistAPI', 'dataProvider', {
						'content': playlistData
					});
					_this.clipList = playlistData;
					callback();
				});
			},
			getKClient: function() {
				if (!this.kClient) {
					this.kClient = mw.kApiGetPartnerClient(this.widget_id);
				}
				return this.kClient;
			},
			getClipCount: function() {
				return this.getClipList().length;
			},
			getClip: function(clipIndex) {
				return this.getClipList()[clipIndex];
			},
			getClipList: function() {
				return this.clipList;
			},
			playClip: function(embedPlayer, clipIndex, callback) {
				var _this = this
				if (!embedPlayer) {
					mw.log("Error:: PlaylistHandlerKaltura:playClip > no embed player");
					if ($.isFunction(callback)) {
						callback();
					}
					return;
				}
				if (clipIndex == 0) {
					embedPlayer.triggerHelper('playlistFirstEntry');
				} else if (clipIndex == (_this.getClipCount() - 1)) {
					embedPlayer.triggerHelper('playlistLastEntry');
				} else {
					embedPlayer.triggerHelper('playlistMiddleEntry');
				}
				if (embedPlayer.kentryid == this.getClip(clipIndex).id) {
					if (this.loadingEntry) {
						mw.log("Error: PlaylistHandlerKaltura is loading Entry, possible double playClip request");
					} else {
						embedPlayer.play();
					}
					if ($.isFunction(callback)) {
						callback();
					}
					return;
				}
				this.loadingEntry = this.getClip(clipIndex).id;
				var bindName = 'onChangeMediaDone' + this.bindPostFix;
				$(embedPlayer).unbind(bindName).bind(bindName, function() {
					mw.log('mw.PlaylistHandlerKaltura:: onChangeMediaDone');
					_this.loadingEntry = false;
					embedPlayer.play();
					if ($.isFunction(callback)) {
						callback();
					}
				});
				mw.log("PlaylistHandlerKaltura::playClip::changeMedia entryId: " + this.getClip(clipIndex).id);
				if (this.autoContinue && !embedPlayer.firstPlay) {
					embedPlayer.stopped = embedPlayer.paused = false;
				}
				_this.setClipIndex(clipIndex);
				embedPlayer.sendNotification("changeMedia", {
					'entryId': this.getClip(clipIndex).id,
					'playlistCall': true
				});
			},
			drawEmbedPlayer: function(clipIndex, callback) {
				var _this = this;
				var $target = _this.playlist.getVideoPlayerTarget();
				mw.log("PlaylistHandlerKaltura::drawEmbedPlayer:" + clipIndex);
				var embedPlayer = _this.playlist.getEmbedPlayer();
				embedPlayer.doUpdateLayout();
				_this.setClipIndex(clipIndex);
				if (embedPlayer.playerReadyFlag) {
					callback();
				} else {
					$(embedPlayer).bind('playerReady' + this.bindPostFix, function() {
						callback();
					});
				}
				if (embedPlayer.kentryid != this.getClip(clipIndex).id) {
					embedPlayer.sendNotification('changeMedia', {
						entryId: this.getClip(clipIndex).id
					});
				}
			},
			updatePlayerUi: function(clipIndex) {},
			addEmbedPlayerBindings: function(embedPlayer) {
				var _this = this;
				mw.log('PlaylistHandlerKaltura:: addEmbedPlayerBindings');
				$(embedPlayer).unbind(this.bindPostFix);
				$(embedPlayer).bind('Kaltura_SetKDPAttribute' + this.bindPostFix, function(event, componentName, property, value) {
					mw.log("PlaylistHandlerKaltura::Kaltura_SetKDPAttribute:" + property + ' value:' + value);
					switch (componentName) {
						case "playlistAPI.dataProvider":
							_this.doDataProviderAction(property, value);
							break;
						case 'tabBar':
							_this.switchTab(property, value)
							break;
					}
				});
				$(embedPlayer).bind('Kaltura_SendNotification' + this.bindPostFix, function(event, notificationName, notificationData) {
					switch (notificationName) {
						case 'playlistPlayNext':
						case 'playlistPlayPrevious':
							mw.log("PlaylistHandlerKaltura:: trigger: " + notificationName);
							$(embedPlayer).trigger(notificationName);
							break;
					}
				});
			},
			switchTab: function(property, value) {
				if (property == 'selectedIndex') {
					this.playlist.switchTab(value);
				}
			},
			doDataProviderAction: function(property, value) {
				switch (property) {
					case 'selectedIndex':
						this.playlist.playClip(parseInt(value));
						break;
				}
			},
			getClipPoster: function(clipIndex, size) {
				if (this.mrssHandler) {
					return this.mrssHandler.getClipPoster(clipIndex, size);
				}
				var clip = this.getClip(clipIndex);
				if (!size) {
					return clip.thumbnailUrl;
				}
				return kWidget.getKalturaThumbUrl({
					'width': size.width,
					'height': size.height,
					'entry_id': clip.id,
					'partner_id': clip.partnerId
				});
			},
			getClipTitle: function(clipIndex) {
				if (this.mrssHandler) {
					return this.mrssHandler.getClipTitle(clipIndex);
				}
				return this.getClip(clipIndex).name;
			},
			getClipDesc: function(clipIndex) {
				if (this.mrssHandler) {
					return this.mrssHandler.getClipDesc(clipIndex);
				}
				return this.getClip(clipIndex).description;
			},
			getClipDuration: function(clipIndex) {
				if (this.mrssHandler) {
					return this.mrssHandler.getClipDuration(clipIndex);
				}
				if (this.getClip(clipIndex).mediaType == 2) {
					var embedPlayer = this.playlist.embedPlayer;
					var imageDuration = embedPlayer.getKalturaConfig('', 'imageDefaultDuration') ? embedPlayer.getKalturaConfig('', 'imageDefaultDuration') : mw.getConfig("EmbedPlayer.DefaultImageDuration");
					return parseFloat(imageDuration);
				}
				return this.getClip(clipIndex).duration;
			},
			getPlaylistItem: function(clipIndex) {
				var _this = this;
				var $item = $('<div />');
				$item.append(this.getBoxLayout(clipIndex, this.$playlistItemRenderer));
				$item.find('.nameAndDuration').after($('<div />').css({
					'display': 'block',
					'height': '20px'
				}))
				$item.find('.hasMarginLeft').slice(1).css('margin-left', '');
				return $item;
			},
			adjustTextWidthAfterDisplay: function($clipList) {
				var textWidth = $clipList.width() - $clipList.find('img').width();
				textWidth = textWidth - 64;
				$clipList.find('.irDescriptionIrScreen').css('width', textWidth);
			},
			getBoxLayout: function(clipIndex, $currentBox) {
				var _this = this;
				var offsetLeft = 0;
				var $boxContainer = $('<div />');
				$.each($currentBox.children(), function(inx, boxItem) {
					switch (boxItem.nodeName.toLowerCase()) {
						case 'image':
							var $node = $('<img />');
							$node.attr('alt', _this.getClipTitle(clipIndex));
							break;
						case 'vbox':
						case 'hbox':
						case 'canvas':
							var $node = $('<div />');
							if (offsetLeft) {
								$node.css('margin-left', offsetLeft).addClass("hasMarginLeft")
							}
							$node.append(_this.getBoxLayout(clipIndex, $(boxItem)));
							break;
						case 'spacer':
							$node = $('<div />').css('display', 'inline');
							break;
						case 'label':
							var nodeSiblings = $(boxItem).siblings();
							if (nodeSiblings && nodeSiblings.length && $(nodeSiblings[0]).attr('id').toLowerCase() == 'hover' + $(boxItem).attr('id').toLowerCase()) {
								break;
							}
						case 'text':
							var $node = $('<span />').css('display', 'block');
							break;
						default:
							var $node = false;
							break;
					}
					if ($node && $node.length) {
						$node.addClass(boxItem.nodeName.toLowerCase());
						_this.applyUiConfAttributes(clipIndex, $node, boxItem);
						if ($node.css('width').indexOf('%') === -1) {
							offsetLeft += $node.width();
						}
						if ($node[0].nodeName.toLowerCase() == 'div') {
							$node.css('width', '');
						}
						$boxContainer.append($node);
						if (boxItem.nodeName.toLowerCase() == 'hbox') {
							$boxContainer.append();
						}
					}
				});
				if ($boxContainer.find('span').length == 2 && $boxContainer.find('span').slice(0).css('width') == '100%') {
					$boxContainer.find('span').slice(0).css({
						'width': '',
						'float': 'left'
					});
					$boxContainer.find('span').slice(1).css('float', 'right');
				} else if ($boxContainer.find('span').length > 1) {
					$boxContainer.find('span').each(function(inx, node) {
						if ($(node).css('float') != 'right') {
							$(node).css('float', 'left');
						}
					});
				}
				$boxContainer.find('div,span').each(function(inx, node) {
					$(node).css('width', '');
					if ($(node).data('id') == 'irDescriptionIrScreen' || $(node).data('id') == 'irDescriptionIrText') {
						$(node).css({
							'height': '',
							'float': 'left'
						});
					}
					if ($(node).hasClass('hbox') || $(node).hasClass('vbox') || $(node).hasClass('canvas')) {
						$(node).css('height', '');
					}
					if ($(node).hasClass('itemRendererLabel') && $(node).css('float') == 'left' && ($(node).siblings().hasClass('hbox') || $(node).siblings().hasClass('vbox'))) {
						$(node).css({
							'display': 'block'
						});
					}
					if ($(node).hasClass('irDurationIrScreen')) {
						$(node).css('float', 'right');
					}
				});
				return $boxContainer;
			},
			applyUiConfAttributes: function(clipIndex, $target, confTag) {
				var _this = this;
				if (!confTag) {
					return;
				}
				var styleName = null;
				var idName = null;
				$.each(confTag.attributes, function(inx, attr) {
					switch (attr.nodeName.toLowerCase()) {
						case 'id':
							idName = attr.nodeValue;
							$target.data('id', idName);
							$target.addClass(idName);
							break;
						case 'stylename':
							styleName = attr.nodeValue;
							$target.addClass(styleName);
							break;
						case 'url':
							$target.attr('src', _this.uiConfValueLookup(clipIndex, attr.nodeValue));
							break;
						case 'width':
						case 'height':
							var appendPx = '';
							if (attr.nodeValue.indexOf('%') == -1) {
								appendPx = 'px';
							}
							$target.css(attr.nodeName, attr.nodeValue + appendPx);
							break;
						case 'paddingright':
							$target.css('padding-right', attr.nodeValue);
							break;
						case 'text':
							var val = _this.uiConfValueLookup(clipIndex, attr.nodeValue) || '';
							$target.text(val);
							break;
						case 'font':
							var str = attr.nodeValue;
							if (str.indexOf('bold') !== -1) {
								$target.css('font-weight', 'bold');
								str = str.replace('bold', '');
							}
							var f = str.charAt(0).toUpperCase();
							$target.css('font-family', f + str.substr(1));
							break;
						case 'x':
							$target.css({
								'left': attr.nodeValue
							});
							break;
						case 'y':
							$target.css({
								'top': attr.nodeValue
							});
							break;
					}
				});
				switch (styleName) {
					case 'itemRendererLabel':
						$target.attr('title', $target.text());
						if (idName == 'irDescriptionIrScreen' || idName == 'irDescriptionIrText') {
							$target.text(_this.playlist.formatDescription($target.text()));
						} else {
							$target.text(_this.playlist.formatTitle($target.text()));
						}
						if ($target.text() == 'null') {
							$target.text('');
						}
						break;
				}
			},
			uiConfValueLookup: function(clipIndex, objectString) {
				var parsedString = objectString.replace(/\{|\}/g, '');
				var objectPath = parsedString.split('.');
				switch (objectPath[0]) {
					case 'div10002(this':
						return this.uiConfValueLookup(clipIndex, 'this.' + objectPath[1].replace(/\)/, ''));
						break;
					case 'formatDate(this':
						return mw.seconds2npt(this.getClipDuration(clipIndex));
						break;
					case 'this':
						switch (objectPath[1]) {
							case 'thumbnailUrl':
								return this.getClipPoster(clipIndex);
								break;
							case 'name':
								return this.getClipTitle(clipIndex);
								break;
							case 'description':
								return this.getClipDesc(clipIndex);
								break;
						};
						if (this.getClip(clipIndex)[objectPath[1]]) {
							return this.getClip(clipIndex)[objectPath[1]];
						} else {
							mw.log("Error: Kaltura Playlist Handler could not find property:" + objectPath[1]);
						}
						break;
					default:
						return objectString;
				}
			}
		};
	})(window.mediaWiki, window.jQuery);;
}, {}, {});
mw.loader.implement("mw.PlaylistHandlerMediaRss", function($) {
	(function(mw, $) {
		"use strict";
		mw.PlaylistHandlerMediaRss = function(playlist) {
			return this.init(playlist);
		};
		mw.PlaylistHandlerMediaRss.prototype = {
			mediaNS: 'http://search.yahoo.com/mrss/',
			autoContinue: true,
			autoPlay: false,
			includeInLayout: true,
			init: function(playlist) {
				this.playlist = playlist;
			},
			loadPlaylist: function(callback) {
				var _this = this;
				if (this.$rss) {
					callback(this.$rss);
					return;
				}
				if (this.getSrcPayLoad()) {
					var xmlDoc = $.parseXML(this.getSrcPayLoad());
					this.$rss = $(xmlDoc);
					callback(_this.$rss);
					return;
				}
				if (!_this.getSrc()) {
					mw.log("PlaylistHandlerMediaRSS:: missing source");
					return;
				}
				if (mw.isLocalDomain(this.getSrc())) {
					$.get(mw.absoluteUrl(this.getSrc()), function(data) {
						_this.$rss = $(data);
						callback(_this.$rss);
					});
				} else {
					new mw.ajaxProxy({
						url: _this.getSrc(),
						success: function(resultXML) {
							_this.$rss = $(resultXML);
							callback(_this.$rss);
						},
						error: function() {
							mw.log("Error: loading " + _this.getSrc());
							callback(false);
							return;
						},
						startWithProxy: true
					});
				}
			},
			hasMultiplePlaylists: function() {
				return false;
			},
			hasPlaylistUi: function() {
				if (this.playlist.layout == 'noClipList') {
					return false;
				}
				return this.includeInLayout;
			},
			isNextButtonDisplayed: function() {
				return true;
			},
			isPreviousButtonDisplayed: function() {
				return true;
			},
			getVideoListWidth: function() {
				return 'auto';
			},
			getSrcPayLoad: function() {
				return this.playlist.srcPayLoad;
			},
			getSrc: function() {
				return this.playlist.src;
			},
			getClipCount: function() {
				if (!this.$rss) {
					mw.log("Error no rss to count items");
				}
				return this.$rss.find('item').length;
			},
			playClip: function(embedPlayer, clipIndex, callback) {
				var _this = this;
				embedPlayer.updatePosterSrc(_this.getClipPoster(clipIndex, _this.playlist.getTargetPlayerSize()));
				embedPlayer.emptySources();
				var clipSources = this.getClipSources(clipIndex);
				if (!clipSources) {
					mw.log("Error: mw.Playlist no sources found for clipIndex:" + clipIndex);
					return;
				}
				for (var i = 0; i < clipSources.length; i++) {
					var $source = $('<source />').attr(clipSources[i]);
					embedPlayer.mediaElement.tryAddSource($source[0]);
				}
				embedPlayer.changeMedia(function() {
					_this.playlist.updatePlayerUi(_this.clipIndex);
					_this.playlist.addClipBindings();
					embedPlayer.play();
					if (callback) {
						callback();
					}
				});
			},
			drawEmbedPlayer: function(clipIndex, callback) {
				var _this = this;
				var playerSize = _this.playlist.getTargetPlayerSize();
				var $target = _this.playlist.getVideoPlayerTarget();
				var $video;
				if ($('#' + _this.playlist.getVideoPlayerId()).length) {
					mw.log('Error :: PlaylistHandler: drawEmbedPlayer player already in DOM? ');
					callback();
					return;
				} else {
					$video = $('<video />').attr({
						'id': _this.playlist.getVideoPlayerId(),
						'poster': _this.getClipPoster(clipIndex, playerSize)
					}).css(playerSize);
					_this.updateVideoSources(clipIndex, $video);
					$target.append($video);
					jQuery.fn.embedPlayer = window.jQueryEmbedPlayer;
					$video.embedPlayer(callback);
				}
			},
			updateVideoSources: function(clipIndex, $video) {
				var _this = this;
				var clipSources = _this.getClipSources(clipIndex);
				if (clipSources) {
					for (var i = 0; i < clipSources.length; i++) {
						var $source = $('<source />').attr(clipSources[i]);
						$video.append($source);
					}
				}
			},
			updatePlayerUi: function(clipIndex) {
				var _this = this;
				var playerSize = _this.playlist.getTargetPlayerSize();
				if (this.playlist.titleHeight != 0) {
					var $title = $('<div />').addClass('playlist-title ui-state-default ui-widget-header ui-corner-all').css({
						'top': '0px',
						'height': _this.titleHeight,
						'width': playerSize.width
					}).text(_this.getClipTitle(clipIndex));
					$(_this.target + ' .media-rss-video-player-container').find('.playlist-title').remove();
					$(_this.target + ' .media-rss-video-player-container').prepend($title);
				}
			},
			getClipSources: function(clipIndex) {
				var _this = this;
				var $item = $(this.$rss.find('item')[clipIndex]);
				var clipSources = [];
				$.each($item.find('*'), function(inx, mediaContent) {
					if ($(mediaContent)[0].nodeName == 'media:content') {
						clipSource = {};
						if ($(mediaContent).attr('url')) {
							clipSource.src = $(mediaContent).attr('url');
						}
						if ($(mediaContent).attr('type')) {
							clipSource.type = $(mediaContent).attr('type');
						}
						if ($(mediaContent).attr('duration')) {
							clipSource.durationHint = $(mediaContent).attr('duration');
						}
						clipSources.push(clipSource);
					}
				});
				return clipSources;
			},
			getCustomAttributes: function(clipIndex) {
				return {};
			},
			addEmbedPlayerBindings: function(embedPlayer) {},
			getClipList: function() {
				return this.$rss.find('item');
			},
			getClipPoster: function(clipIndex) {
				var $item = this.$rss.find('item').eq(clipIndex);
				var mediaThumb = $item.find('media\\:thumbnail, content\\:thumbnail, thumbnail');
				mw.log('mw.PlaylistMediaRss::getClipPoster: ' + $(mediaThumb).attr('url'));
				if (mediaThumb && $(mediaThumb).attr('url')) {
					return $(mediaThumb).attr('url');
				}
				return mw.getConfig('imagesPath') + 'vid_default_thumb.jpg';
			},
			getClipTitle: function(clipIndex) {
				var $item = this.$rss.find('item').eq(clipIndex);
				var mediaTitle = $item.find('media\\:title, content\\:title, title');
				if (mediaTitle) {
					return $(mediaTitle).text();
				}
				mw.log("Error could not find title for clip: " + clipIndex);
				return gM('mwe-mediarss-untitled');
			},
			getClipDesc: function(clipIndex) {
				var $item = this.$rss.find('item').eq(clipIndex);
				var mediaDesc = $item.find('media\\:description, content\\:description, description');
				if (mediaDesc) {
					return $(mediaDesc).text();
				}
				mw.log("Error could not find description for clip: " + clipIndex);
				return gM('mwe-mediarss-untitled');
			},
			getClipDuration: function(clipIndex) {
				var $item = this.$rss.find('item').eq(clipIndex);
				var itemDuration = 0;
				$($item.find('*')).each(function(inx, mediaContent) {
					if ($(mediaContent).attr('duration')) {
						itemDuration = $(mediaContent).attr('duration');
						return false;
					}
				});
				return itemDuration;
			},
			getPlaylistItem: function(clipIndex) {
				var _this = this;
				var width = (_this.playlist.itemThumbWidth) ? _this.playlist.itemThumbWidth : 70;
				var $item = $('<div />').css('width', '100%').append($('<img />').attr({
					'alt': _this.getClipTitle(clipIndex),
					'src': _this.getClipPoster(clipIndex)
				}).css({
						'width': width + 'px'
					}), $('<div />').addClass('clipText').append($('<span />').addClass('clipTitle').text(_this.playlist.formatTitle(_this.getClipTitle(clipIndex))), $('<div />').addClass('clipDuration').text(mw.seconds2npt(_this.getClipDuration(clipIndex)))), $('<div />').css('clear', 'right'), $('<span />').addClass('clipDescription').text(_this.playlist.formatDescription(_this.getClipDesc(clipIndex)))).attr('title', _this.getClipDesc(clipIndex));
				return $item;
			},
			adjustTextWidthAfterDisplay: function($clipList) {}
		};
	})(window.mw, jQuery);;
}, {}, {});
mw.loader.implement("mw.PlaylistLayoutJQueryUi", function($) {;
}, {}, {});
mw.loader.implement("mw.PlaylistLayoutMobile", function($) {;
}, {}, {});
mw.loader.implement("mw.ajaxProxy", function($) {
	(function(mw, $) {
		var ajaxProxy = function(options) {
			if (!$.isFunction(options.success)) {
				mw.log("mw.ajaxProxy :: Error: missing success callback.");
				return;
			}
			if (!options.url) {
				mw.log("mw.ajaxProxy :: Error: missing url to proxy.");
			}
			var defaults = {
				error: function() {},
				proxyUrl: mw.getConfig('Mw.XmlProxyUrl'),
				proxyType: 'jsonp',
				startWithProxy: false,
				timeout: mw.getConfig('Mw.AjaxTimeout', 10000)
			};
			this.options = $.extend({}, defaults, options);
			this.ajax();
		};
		ajaxProxy.prototype = {
			ajax: function(useProxy) {
				var _this = this;
				if (_this.options.startWithProxy) {
					_this.proxy();
					return;
				}
				var ajaxOptions = {
					success: function(result) {
						_this.handleResult(result);
					},
					timeout: _this.options.timeout
				};
				if (useProxy) {
					ajaxOptions.url = _this.options.proxyUrl + encodeURIComponent(_this.options.url);
					ajaxOptions.error = function() {
						mw.log("mw.ajaxProxy :: Error: request failed with proxy.");
						_this.options.error();
					};
				} else {
					ajaxOptions.url = _this.options.url;
					ajaxOptions.error = function(jqXHR, textStatus, errorThrown) {
						mw.log("mw.ajaxProxy :: Error: cross domain request failed, trying with proxy");
						_this.proxy();
					};
				}
				try {
					$.ajax(ajaxOptions);
				} catch (e) {}
			},
			proxy: function() {
				var _this = this;
				if (_this.options.proxyUrl) {
					if (_this.options.proxyType == 'jsonp') {
						$.ajax({
							url: _this.options.proxyUrl + '?url=' + encodeURIComponent(_this.options.url) + '&callback=?',
							dataType: 'json',
							success: function(result) {
								_this.handleResult(result, true);
							},
							error: function(error) {
								mw.log("mw.ajaxProxy :: Error: could not load:", error);
								_this.options.error();
							},
							timeout: _this.options.timeout
						});
					} else {
						_this.ajax(true);
					}
				} else {
					mw.log("mw.ajaxProxy :: Error: please setup proxy configuration");
					this.options.error();
				}
			},
			handleResult: function(result, isJsonP) {
				var _this = this;
				if (isJsonP) {
					if (result['http_code'] == 'ERROR' || result['http_code'] == 0) {
						mw.log("mw.ajaxProxy :: Error: load error with http response");
						_this.options.error();
						return;
					}
					try {
						var resultXML = $.parseXML(result['contents']);
						if (resultXML) {
							result = resultXML;
						}
					} catch (e) {
						result = result['contents'];
					}
					_this.options.success(result);
				} else {
					_this.options.success(result);
				}
			}
		};
		mw.ajaxProxy = ajaxProxy;
	})(window.mw, window.jQuery);;
}, {}, {});
mw.loader.implement("mw.MwEmbedSupport.style", function($) {;
}, {
	"all": ".modal_editor{ left:10px;top:10px;right:10px;bottom:10px;position:fixed;z-index:100}.displayHTML a:visited{color:white}.loadingSpinner{width:32px;height:32px;display:block;padding:0px;background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/common/images/loading_ani.gif?2014-05-14T15:25:00Z)}.mw-imported-resource{border:thin solid black}.kaltura-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/common/images/kaltura_logo_sm_transparent.png?2014-05-14T15:25:00Z) !important;background-repeat:no-repeat;display:block;height:12px;width:12px;margin-top:2px !important;margin-left:3px !important}.mw-fullscreen-overlay{background:rgb(0,0,0) none repeat scroll 0% 0%;position:fixed;top:0pt;left:0pt;width:100%;height:100%;-moz-background-clip:border;-moz-background-origin:padding;-moz-background-inline-policy:continuous} .play-btn-large{width:70px;height:53px;background :url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAA1CAYAAAD8mJ3rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+RJREFUeNrsm0tPGlEYhg/MIDcZLhqqqcYYY1GimJgYjRovcePadKm7rrvgX3TT/ozWhW5duLCJMerCaBSroASVaJRquBSQmeHS76vYWqmpF844g/MmLwmjQHj8bud4RkP+yAAeAb8BN5OXpRA4AP4KzuAFTfEHbrAX/Iq8bJ2BP4K/IZh68CewmagixYh5z8DDO7BL5fFbLNikhQePyqJEHgRjUjmU6FfEqPqHVDAqGBWMMsDU1tbqGhsb9Urs2VSk0+m0Xq/3dU9Pjw2fn5+fCzMzM5H5+fmoEsDggPcWXFXuN56amnIODQ3VFAoFgjYajUx3dzc3MDBgvbi4EE5OTgQZcxGpgZmcnKznOE53+7rFYmH7+/vtnZ2dZoDDA6TsiwIzPj5eYzabmeuIuW2Hw1E1MjLiaG5u1ofDYT6RSOTkBIZajcnlcgXwf3+vq6vL2tHRYVlZWYlNT09HYrFYtqJrzNjYmMNkMt0ZMTeN2x8NDQ3G4mu0oVAoI4pioSJTaXR01H5fMNfWgFpaWkzDw8N2eF44ODjg8/l8oaLAwJfDvz4LX4w81AzDaNva2qr7+vo4QRByR0dHfMWAgVZtxxb9GDDX1uv1DNYfaPMWrD1nZ2eC4sEMDg7aHppKdxm6G4szkMvlMiIcCQo0PTAwyNmeGjG3bbVadb29vTYo1FU4IKZSKVotnmq7JtlslkrhhMixtLa2Vm9sbCTm5ubOacxAVOcYAEMz3DUej8fqdrsty8vL0YWFhSjP83nZg8FoyWP8094e0Goxbe0wKHKzs7One3t7l7LediimkmQ2GAzMxMREHXQyrRJSSdLhjGVZbVNTkyEQCKRlCwazCOFIPbImk8ms7GuM1BFzfHx8Wa59HpoRc6/Vdbk+y+fzJRYXF2OK6EpSREwwGEwuLS3F4vF4WWcDqgMezZUxpE0G5xda6yeqxZdGxOB+8erqaiwcDmeodjil1BjsNmtrazEY4NJEAlEFU45UymQy+c3Nzfj29naqUNzuUzoY8pQVgSAI+d3d3R9bW1tJURTzRGLJLmLwNfv7+6n19fVEOReFcouYB4E5PDxMIxCoJ8/+rxRqYLAc3DeVIpEID0Di0HFEIhOxz/nh0WhURCCnp6c8kZmogYFukuM4jr2r9UJRTYRCoUsiU1EDs7Ozk3Q6nX8d/8BiCm034ff701K23scIz/l+IZTO+NbV1enb29urGYbRYLoAkNRztN5HKEUVjIKVUo+a3SEVjApGBVM2MGkVQ4nSCManciiRD8F8JsW7ulRd7XggEzztkAT7ydXtOS99nvkO/gAOam5cVO+JvHFP5E8BBgBjuVwnLBcrSQAAAABJRU5ErkJggg==);background :url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/common/images/player_big_play_button.png?2014-05-14T15:25:00Z)!ie;position :absolute;cursor :pointer;border :none !important;z-index :1;left :50%;top :50%;margin-left:-35px;margin-top :-26px}.play-btn-large:hover{background :url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAA1CAYAAAD8mJ3rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9RJREFUeNrsm8tPGlEUxgcBQamNSavVKBoa05I2AWNaW2IlJDauXJkaE1cuumbByv/A1AVsjRtjorEujFEDC3ykvhZGWGgIAtKqUYrTgmjLAPLsuVZbqrUxOheGcr/km8WQ3MWPc+acc2cuj/otMVgDfgSWUfmlbbAL/AEcQTd4Zz88AevAD6j8Fg3Wg+0ITCXYAJZQRNRZxGj5cHkLfkx4/JIAXFwAFwVhcUkKBKaYcLik04gh+osIGAKGgMkNMDKZTFRfXy8hYM7nC7G4wGg0Kt1u92ur1arZ29vTaLXaqlwBgxq8N+BCthc2GAx1HR0dsmQySSFLJJLC1tbWiq6uroqDg4PQ5uZmiMNcYtgiRq1WlwOQ1EVDapUMDw83Li8vNzY3N9/Nu1QqAMXj8dRVViqV90wmU9PExIRSoVBI8gbMv6CkW6PRVM7NzTUNDg4+raqqKvzvwSQSidR14aDtj7a2turV1dXm3t7eutLSUkHeR0y6+aDu7u6HAOiVTqeTikSirPVZaD/mPY69mMXFRVVtbe2d26yBqld/f/8nSDNvhrkw2MDMz8+/rKmpYWXdnZ2doF6vd8PD2p/zYMxm8wu2wJxrY2PjsK+vz22xWII5Cwb+3edSqRRLGYYeiIYGcsflcoVzDszU1NSz6upqbP0JVL0klPkDBIim6RjbYLCVxVgslopGoymchQP1QCqVqnxycnJ/YGBgPxgMJthaHCsYKMFJ7MMen89rb2+XtrS0VEAP5IA0O+Y8GMwR84eKiooEPT098s7OTgvDMAnOgkENG4KTyeZDKBTyGxoaSpaWlo44DSYTqXRRfr8/yulUykbEOJ3OY7vdHiJg0gbWhYUFemhoyJMLVSmJjBuK1Wr1j4yMeGCuirK5Lu5nDLaIga7329jY2P7W1haW7hcnGApHKnk8ntD4+LhnfX39O85IFODMezYjJhAInExPT39eWVk5ojIgrGCQbz20MEx8dnbWOzMzc4g20zNV4TgbMScnJ0lo77+YzWZfOBxOUBkWNjDnr0tuAtRisfghbWg2h8KcTiWbzRZAQHw+X4zKsnBGzKmvo+3t7aDRaPTu7u5GKI4oq68pvF5v2GQyeR0OB0NxTNjAQDWJlZWVia8qvVBl6LW1tWOKo8IGBmYXP3p9wgOll14004ADmSy9NxG2PV8kuVwuUavV94VCIc/tdjMA5DASiSQo7ovBCiaHxZBPza4QAUPAEDCsgQkRDJcUQmBshMPlsQ2BGaXOTnURnQrtHY+iz1nRJxVO6ufxnHzvZ76C34E/8tJukjORaWcifwgwAL3bpBIa2UbLAAAAAElFTkSuQmCC);background :url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/common/images/player_big_play_button_hover.png?2014-05-14T15:25:00Z)!ie}.carouselContainer{position :absolute;width :100%;z-index :2}.carouselVideoTitle{position :absolute;top :0px;left :0px;width :100%;background :rgba(0,0,0,0.8);color :white;font-size :small;font-weight :bold;z-index :2}.carouselVideoTitleText{display :block;padding :10px 10px 10px 20px}.carouselTitleDuration{position :absolute;top :0px;right :0px;padding :2px;background-color :#5A5A5A;color :#D9D9D9;font-size :smaller;z-index :2}.carouselImgTitle{position :absolute;width :100%;text-align :center;color :white;font-size :small;background :rgba(0,0,0,0.4)}.carouselImgDuration{position :absolute;top :2px;left :2px;background :rgba( 0,0,0,0.7 );color :white;padding :1px 6px;font-size :small}.carouselPrevButton,.carouselNextButton{display :block;position :absolute;bottom:23px}.carouselPrevButton{left :5px}.carouselNextButton{right:6px}.alert-container{-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;background-image:linear-gradient(bottom,rgb(215,215,215) 4%,rgb(230,230,230) 55%,rgb(255,255,255) 100%);background-image:-o-linear-gradient(bottom,rgb(215,215,215) 4%,rgb(230,230,230) 55%,rgb(255,255,255) 100%);background-image:-moz-linear-gradient(bottom,rgb(215,215,215) 4%,rgb(230,230,230) 55%,rgb(255,255,255) 100%);background-image:-webkit-linear-gradient(bottom,rgb(215,215,215) 4%,rgb(230,230,230) 55%,rgb(255,255,255) 100%);background-image:-ms-linear-gradient(bottom,rgb(215,215,215) 4%,rgb(230,230,230) 55%,rgb(255,255,255) 100%);background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0.04,rgb(215,215,215)),color-stop(0.55,rgb(230,230,230)),color-stop(1,rgb(255,255,255)));margin:auto;position:absolute;top:0;left:0;right:0;bottom:0;max-width:80%;max-height:30%}.alert-title{background-color :#E6E6E6;padding :5px;border-bottom :1px solid #D1D1D1;font-weight :normal !important;font-size:14px !important;-webkit-border-top-left-radius:3px;-moz-border-radius-topleft:3px;border-top-left-radius:3px;-webkit-border-top-right-radius:3px;-moz-border-radius-topright:3px;border-top-right-radius:3px }.alert-message{padding :5px;font-weight :normal !important;text-align:center;font-size:14px !important;-webkit-text-size-adjust:none}.alert-buttons-container{text-align:center;padding-bottom:5px}.alert-button{background-color:#474747;color:white;-webkit-border-radius:.5em;-moz-border-radius:.5em;border-radius:.5em;padding:2px 10px;background-image:linear-gradient(bottom,rgb(25,25,25) 4%,rgb(47,47,47) 55%,rgb(71,71,71) 68%);background-image:-o-linear-gradient(bottom,rgb(25,25,25) 4%,rgb(47,47,47) 55%,rgb(71,71,71) 68%);background-image:-moz-linear-gradient(bottom,rgb(25,25,25) 4%,rgb(47,47,47) 55%,rgb(71,71,71) 68%);background-image:-webkit-linear-gradient(bottom,rgb(25,25,25) 4%,rgb(47,47,47) 55%,rgb(71,71,71) 68%);background-image:-ms-linear-gradient(bottom,rgb(25,25,25) 4%,rgb(47,47,47) 55%,rgb(71,71,71) 68%);background-image:-webkit-gradient( linear,left bottom,left top,color-stop(0.04,rgb(25,25,25)),color-stop(0.55,rgb(47,47,47)),color-stop(0.68,rgb(71,71,71)) )}.alert-text{color :black !important}  .ui-helper-hidden{display:none}.ui-helper-hidden-accessible{position:absolute !important;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px)}.ui-helper-reset{margin:0;padding:0;border:0;outline:0;line-height:1.3;text-decoration:none;font-size:100%;list-style:none}.ui-helper-clearfix:after{content:\".\";display:block;height:0;clear:both;visibility:hidden}.ui-helper-clearfix{display:inline-block} * html .ui-helper-clearfix{height:1%}.ui-helper-clearfix{display:block} .ui-helper-zfix{width:100%;height:100%;top:0;left:0;position:absolute;opacity:0;filter:Alpha(Opacity=0)} .ui-state-disabled{cursor:default !important}  .ui-icon{display:block;text-indent:-99999px;overflow:hidden;background-repeat:no-repeat}  .ui-widget-overlay{position:absolute;top:0;left:0;width:100%;height:100%}  .ui-widget{font-family:Verdana,Arial,sans-serif;font-size:11px}.ui-widget .ui-widget{font-size:1em}.ui-widget input,.ui-widget select,.ui-widget textarea,.ui-widget button{font-family:Verdana,Arial,sans-serif;font-size:1em}.ui-widget-content{border:1px solid #555555;background:#000000;color:#ffffff} .ui-widget-content a{color:#777}.ui-widget-header{border:1px solid #828282;background:#333333 url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-bg_flat_70_333333_40x100.png?2014-05-14T15:25:00Z) 50% 50% repeat-x;color:#ffffff;font-weight:bold}.ui-widget-header a{color:#ffffff} .ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default{font-weight:normal;color:#eeeeee}.ui-state-default a,.ui-state-default a:link,.ui-state-default a:visited{color:#eeeeee;text-decoration:none}.ui-state-hover,.ui-widget-content .ui-state-hover,.ui-widget-header .ui-state-hover,.ui-state-focus,.ui-widget-content .ui-state-focus,.ui-widget-header .ui-state-focus{font-weight:normal;color:#ffffff}.ui-state-hover a,.ui-state-hover a:hover{color:#ffffff;text-decoration:none}.ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active{font-weight:normal;color:#ffffff}.ui-state-active a,.ui-state-active a:link,.ui-state-active a:visited{color:#ffffff;text-decoration:none}.ui-widget :active{outline:none} .ui-state-highlight,.ui-widget-content .ui-state-highlight,.ui-widget-header .ui-state-highlight{border:1px solid #828282;background:#111111 url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-bg_diagonals-medium_25_111111_40x40.png?2014-05-14T15:25:00Z) 50% 50% repeat;color:#2e7db2}.ui-state-highlight a,.ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a{color:#2e7db2}.ui-state-error,.ui-widget-content .ui-state-error,.ui-widget-header .ui-state-error{border:1px solid #ffb73d;background:#ffc73d url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-bg_glass_40_ffc73d_1x400.png?2014-05-14T15:25:00Z) 50% 50% repeat-x;color:#111111}.ui-state-error a,.ui-widget-content .ui-state-error a,.ui-widget-header .ui-state-error a{color:#111111}.ui-state-error-text,.ui-widget-content .ui-state-error-text,.ui-widget-header .ui-state-error-text{color:#111111}.ui-priority-primary,.ui-widget-content .ui-priority-primary,.ui-widget-header .ui-priority-primary{font-weight:bold}.ui-priority-secondary,.ui-widget-content .ui-priority-secondary,.ui-widget-header .ui-priority-secondary{opacity:.7;filter:Alpha(Opacity=70);font-weight:normal}.ui-state-disabled,.ui-widget-content .ui-state-disabled,.ui-widget-header .ui-state-disabled{opacity:.35;filter:Alpha(Opacity=35);background-image:none}  .ui-icon{width:16px;height:16px;background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_cccccc_256x240.png?2014-05-14T15:25:00Z)}.ui-widget-content .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_cccccc_256x240.png?2014-05-14T15:25:00Z)}.ui-widget-header .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_ffffff_256x240.png?2014-05-14T15:25:00Z)}.ui-state-default .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_cccccc_256x240.png?2014-05-14T15:25:00Z)}.ui-state-hover .ui-icon,.ui-state-focus .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_ffffff_256x240.png?2014-05-14T15:25:00Z)}.ui-state-active .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_ffffff_256x240.png?2014-05-14T15:25:00Z)}.ui-state-highlight .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_4b8e0b_256x240.png?2014-05-14T15:25:00Z)}.ui-state-error .ui-icon,.ui-state-error-text .ui-icon{background-image:url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-icons_a83300_256x240.png?2014-05-14T15:25:00Z)} .ui-icon-carat-1-n{background-position:0 0}.ui-icon-carat-1-ne{background-position:-16px 0}.ui-icon-carat-1-e{background-position:-32px 0}.ui-icon-carat-1-se{background-position:-48px 0}.ui-icon-carat-1-s{background-position:-64px 0}.ui-icon-carat-1-sw{background-position:-80px 0}.ui-icon-carat-1-w{background-position:-96px 0}.ui-icon-carat-1-nw{background-position:-112px 0}.ui-icon-carat-2-n-s{background-position:-128px 0}.ui-icon-carat-2-e-w{background-position:-144px 0}.ui-icon-triangle-1-n{background-position:0 -16px}.ui-icon-triangle-1-ne{background-position:-16px -16px}.ui-icon-triangle-1-e{background-position:-32px -16px}.ui-icon-triangle-1-se{background-position:-48px -16px}.ui-icon-triangle-1-s{background-position:-64px -16px}.ui-icon-triangle-1-sw{background-position:-80px -16px}.ui-icon-triangle-1-w{background-position:-96px -16px}.ui-icon-triangle-1-nw{background-position:-112px -16px}.ui-icon-triangle-2-n-s{background-position:-128px -16px}.ui-icon-triangle-2-e-w{background-position:-144px -16px}.ui-icon-arrow-1-n{background-position:0 -32px}.ui-icon-arrow-1-ne{background-position:-16px -32px}.ui-icon-arrow-1-e{background-position:-32px -32px}.ui-icon-arrow-1-se{background-position:-48px -32px}.ui-icon-arrow-1-s{background-position:-64px -32px}.ui-icon-arrow-1-sw{background-position:-80px -32px}.ui-icon-arrow-1-w{background-position:-96px -32px}.ui-icon-arrow-1-nw{background-position:-112px -32px}.ui-icon-arrow-2-n-s{background-position:-128px -32px}.ui-icon-arrow-2-ne-sw{background-position:-144px -32px}.ui-icon-arrow-2-e-w{background-position:-160px -32px}.ui-icon-arrow-2-se-nw{background-position:-176px -32px}.ui-icon-arrowstop-1-n{background-position:-192px -32px}.ui-icon-arrowstop-1-e{background-position:-208px -32px}.ui-icon-arrowstop-1-s{background-position:-224px -32px}.ui-icon-arrowstop-1-w{background-position:-240px -32px}.ui-icon-arrowthick-1-n{background-position:0 -48px}.ui-icon-arrowthick-1-ne{background-position:-16px -48px}.ui-icon-arrowthick-1-e{background-position:-32px -48px}.ui-icon-arrowthick-1-se{background-position:-48px -48px}.ui-icon-arrowthick-1-s{background-position:-64px -48px}.ui-icon-arrowthick-1-sw{background-position:-80px -48px}.ui-icon-arrowthick-1-w{background-position:-96px -48px}.ui-icon-arrowthick-1-nw{background-position:-112px -48px}.ui-icon-arrowthick-2-n-s{background-position:-128px -48px}.ui-icon-arrowthick-2-ne-sw{background-position:-144px -48px}.ui-icon-arrowthick-2-e-w{background-position:-160px -48px}.ui-icon-arrowthick-2-se-nw{background-position:-176px -48px}.ui-icon-arrowthickstop-1-n{background-position:-192px -48px}.ui-icon-arrowthickstop-1-e{background-position:-208px -48px}.ui-icon-arrowthickstop-1-s{background-position:-224px -48px}.ui-icon-arrowthickstop-1-w{background-position:-240px -48px}.ui-icon-arrowreturnthick-1-w{background-position:0 -64px}.ui-icon-arrowreturnthick-1-n{background-position:-16px -64px}.ui-icon-arrowreturnthick-1-e{background-position:-32px -64px}.ui-icon-arrowreturnthick-1-s{background-position:-48px -64px}.ui-icon-arrowreturn-1-w{background-position:-64px -64px}.ui-icon-arrowreturn-1-n{background-position:-80px -64px}.ui-icon-arrowreturn-1-e{background-position:-96px -64px}.ui-icon-arrowreturn-1-s{background-position:-112px -64px}.ui-icon-arrowrefresh-1-w{background-position:-128px -64px}.ui-icon-arrowrefresh-1-n{background-position:-144px -64px}.ui-icon-arrowrefresh-1-e{background-position:-160px -64px}.ui-icon-arrowrefresh-1-s{background-position:-176px -64px}.ui-icon-arrow-4{background-position:0 -80px}.ui-icon-arrow-4-diag{background-position:-16px -80px}.ui-icon-extlink{background-position:-32px -80px}.ui-icon-newwin{background-position:-48px -80px}.ui-icon-refresh{background-position:-64px -80px}.ui-icon-shuffle{background-position:-80px -80px}.ui-icon-transfer-e-w{background-position:-96px -80px}.ui-icon-transferthick-e-w{background-position:-112px -80px}.ui-icon-folder-collapsed{background-position:0 -96px}.ui-icon-folder-open{background-position:-16px -96px}.ui-icon-document{background-position:-32px -96px}.ui-icon-document-b{background-position:-48px -96px}.ui-icon-note{background-position:-64px -96px}.ui-icon-mail-closed{background-position:-80px -96px}.ui-icon-mail-open{background-position:-96px -96px}.ui-icon-suitcase{background-position:-112px -96px}.ui-icon-comment{background-position:-128px -96px}.ui-icon-person{background-position:-144px -96px}.ui-icon-print{background-position:-160px -96px}.ui-icon-trash{background-position:-176px -96px}.ui-icon-locked{background-position:-192px -96px}.ui-icon-unlocked{background-position:-208px -96px}.ui-icon-bookmark{background-position:-224px -96px}.ui-icon-tag{background-position:-240px -96px}.ui-icon-home{background-position:0 -112px}.ui-icon-flag{background-position:-16px -112px}.ui-icon-calendar{background-position:-32px -112px}.ui-icon-cart{background-position:-48px -112px}.ui-icon-pencil{background-position:-64px -112px}.ui-icon-clock{background-position:-80px -112px}.ui-icon-disk{background-position:-96px -112px}.ui-icon-calculator{background-position:-112px -112px}.ui-icon-zoomin{background-position:-128px -112px}.ui-icon-zoomout{background-position:-144px -112px}.ui-icon-search{background-position:-160px -112px}.ui-icon-wrench{background-position:-176px -112px}.ui-icon-gear{background-position:-192px -112px}.ui-icon-heart{background-position:-208px -112px}.ui-icon-heart-cancel{background-position:0 -128px}.ui-icon-star{background-position:-224px -112px}.ui-icon-link{background-position:-240px -112px}.ui-icon-cancel{background-position:0 -128px}.ui-icon-plus{background-position:-16px -128px}.ui-icon-plusthick{background-position:-32px -128px}.ui-icon-minus{background-position:-48px -128px}.ui-icon-minusthick{background-position:-64px -128px}.ui-icon-close{background-position:-80px -128px}.ui-icon-closethick{background-position:-96px -128px}.ui-icon-key{background-position:-112px -128px}.ui-icon-lightbulb{background-position:-128px -128px}.ui-icon-scissors{background-position:-144px -128px}.ui-icon-clipboard{background-position:-160px -128px}.ui-icon-copy{background-position:-176px -128px}.ui-icon-contact{background-position:-192px -128px}.ui-icon-image{background-position:-208px -128px}.ui-icon-video{background-position:-224px -128px}.ui-icon-script{background-position:-240px -128px}.ui-icon-alert{background-position:0 -144px}.ui-icon-info{background-position:-16px -144px}.ui-icon-notice{background-position:-32px -144px}.ui-icon-help{background-position:-48px -144px}.ui-icon-check{background-position:-64px -144px}.ui-icon-bullet{background-position:-80px -144px}.ui-icon-radio-off{background-position:-96px -144px}.ui-icon-radio-on{background-position:-112px -144px}.ui-icon-pin-w{background-position:-128px -144px}.ui-icon-pin-s{background-position:-144px -144px}.ui-icon-play{background-position:0 -160px}.ui-icon-pause{background-position:-16px -160px}.ui-icon-seek-next{background-position:-32px -160px}.ui-icon-seek-prev{background-position:-48px -160px}.ui-icon-seek-end{background-position:-64px -160px}.ui-icon-seek-first{background-position:-80px -160px}.ui-icon-stop{background-position:-96px -160px}.ui-icon-eject{background-position:-112px -160px}.ui-icon-volume-off{background-position:-128px -160px}.ui-icon-volume-on{background-position:-144px -160px}.ui-icon-power{background-position:0 -176px}.ui-icon-signal-diag{background-position:-16px -176px}.ui-icon-signal{background-position:-32px -176px}.ui-icon-battery-0{background-position:-48px -176px}.ui-icon-battery-1{background-position:-64px -176px}.ui-icon-battery-2{background-position:-80px -176px}.ui-icon-battery-3{background-position:-96px -176px}.ui-icon-circle-plus{background-position:0 -192px}.ui-icon-circle-minus{background-position:-16px -192px}.ui-icon-circle-close{background-position:-32px -192px}.ui-icon-circle-triangle-e{background-position:-48px -192px}.ui-icon-circle-triangle-s{background-position:-64px -192px}.ui-icon-circle-triangle-w{background-position:-80px -192px}.ui-icon-circle-triangle-n{background-position:-96px -192px}.ui-icon-circle-arrow-e{background-position:-112px -192px}.ui-icon-circle-arrow-s{background-position:-128px -192px}.ui-icon-circle-arrow-w{background-position:-144px -192px}.ui-icon-circle-arrow-n{background-position:-160px -192px}.ui-icon-circle-zoomin{background-position:-176px -192px}.ui-icon-circle-zoomout{background-position:-192px -192px}.ui-icon-circle-check{background-position:-208px -192px}.ui-icon-circlesmall-plus{background-position:0 -208px}.ui-icon-circlesmall-minus{background-position:-16px -208px}.ui-icon-circlesmall-close{background-position:-32px -208px}.ui-icon-squaresmall-plus{background-position:-48px -208px}.ui-icon-squaresmall-minus{background-position:-64px -208px}.ui-icon-squaresmall-close{background-position:-80px -208px}.ui-icon-grip-dotted-vertical{background-position:0 -224px}.ui-icon-grip-dotted-horizontal{background-position:-16px -224px}.ui-icon-grip-solid-vertical{background-position:-32px -224px}.ui-icon-grip-solid-horizontal{background-position:-48px -224px}.ui-icon-gripsmall-diagonal-se{background-position:-64px -224px}.ui-icon-grip-diagonal-se{background-position:-80px -224px}.ui-icon-like-on{background-image:url(images/like_cccccc.png) !important;background-position:0 0}.ui-icon-like-off{background-image:url(images/like_cccccc.png) !important;background-position:0 -16px}.ui-state-hover .ui-icon-like-on,.ui-state-hover .ui-icon-like-off{background-image:url(images/like_ffffff.png) !important}.ui-state-active .ui-icon-like-on,.ui-state-active .ui-icon-like-off{background-image:url(images/like_ffffff.png) !important}.ui-state-focus .ui-icon-like-on ,.ui-state-focus .ui-icon-like-off{background-image:url(images/like_ffffff.png) !important}  .ui-corner-tl{-moz-border-radius-topleft:6px;-webkit-border-top-left-radius:6px;border-top-left-radius:6px}.ui-corner-tr{-moz-border-radius-topright:6px;-webkit-border-top-right-radius:6px;border-top-right-radius:6px}.ui-corner-bl{-moz-border-radius-bottomleft:6px;-webkit-border-bottom-left-radius:6px;border-bottom-left-radius:6px}.ui-corner-br{-moz-border-radius-bottomright:6px;-webkit-border-bottom-right-radius:6px;border-bottom-right-radius:6px}.ui-corner-top{-moz-border-radius-topleft:6px;-webkit-border-top-left-radius:6px;border-top-left-radius:6px;-moz-border-radius-topright:6px;-webkit-border-top-right-radius:6px;border-top-right-radius:6px}.ui-corner-bottom{-moz-border-radius-bottomleft:6px;-webkit-border-bottom-left-radius:6px;border-bottom-left-radius:6px;-moz-border-radius-bottomright:6px;-webkit-border-bottom-right-radius:6px;border-bottom-right-radius:6px}.ui-corner-right{-moz-border-radius-topright:6px;-webkit-border-top-right-radius:6px;border-top-right-radius:6px;-moz-border-radius-bottomright:6px;-webkit-border-bottom-right-radius:6px;border-bottom-right-radius:6px}.ui-corner-left{-moz-border-radius-topleft:6px;-webkit-border-top-left-radius:6px;border-top-left-radius:6px;-moz-border-radius-bottomleft:6px;-webkit-border-bottom-left-radius:6px;border-bottom-left-radius:6px}.ui-corner-all{-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px} .ui-widget-overlay{background:#5c5c5c url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-bg_flat_50_5c5c5c_40x100.png?2014-05-14T15:25:00Z) 50% 50% repeat-x;opacity:.80;filter:Alpha(Opacity=80)}.ui-widget-shadow{margin:-7px 0 0 -7px;padding:7px;background:#cccccc url(http://192.168.0.64/html5.kaltura/mwEmbed/modules/MwEmbedSupport/skins/jquery.ui.themes/kaltura-dark/images/ui-bg_flat_30_cccccc_40x100.png?2014-05-14T15:25:00Z) 50% 50% repeat-x;opacity:.60;filter:Alpha(Opacity=60);-moz-border-radius:8px;-webkit-border-radius:8px;border-radius:8px}.ui-slider{position:relative;text-align:left}.ui-slider .ui-slider-handle{position:absolute;z-index:2;width:1.2em;height:1.2em;cursor:default}.ui-slider .ui-slider-range{position:absolute;z-index:1;font-size:.7em;display:block;border:0}.ui-slider-horizontal{height:.8em}.ui-slider-horizontal .ui-slider-handle{top:-.3em;margin-left:-.6em}.ui-slider-horizontal .ui-slider-range{top:0;height:100%}.ui-slider-horizontal .ui-slider-range-min{left:0}.ui-slider-horizontal .ui-slider-range-max{right:0}.ui-slider-vertical{width:.8em;height:100px}.ui-slider-vertical .ui-slider-handle{left:-.3em;margin-left:0;margin-bottom:-.6em}.ui-slider-vertical .ui-slider-range{left:0;width:100%}.ui-slider-vertical .ui-slider-range-min{bottom:0}.ui-slider-vertical .ui-slider-range-max{top:0} .mv-player .overlay-win{background:transparent;border:0} .mv-player .overlay-content{padding:10px}.mv-player .overlay-content h3{display:block;font-size:16px;font-weight:bold;color:#fff;font-family:arial}.mv-player .overlay-win h2{font-size:18px;margin-top:0}.mv-player .overlay-content div{font-size:12px;color:#fff;font-weight:bold}.mv-player .overlay-content div a{color:#00a8ff }.mv-player .overlay-content div a:hover{color:#3abcff }.mv-player .overlay-content ul{list-style:none;margin:0 0 10px 0;padding:0}.mv-player .vol_container{background:#272727;opacity:.80;filter:Alpha(Opacity=80);position:absolute;left:0px}.ui-widget-overlay{background:black;opacity:.40;filter:Alpha(Opacity=40)}.mv-player .ui-icon ui-icon-closethick{border:1px solid #606060;background:#222;font-weight:normal;color:#EEE}.mv-player .overlay-win textarea{background:#e4e4e4;height:35px;padding:6px;color:#666;border:0}.mv-player .overlay-content .copycode{padding:8px 12px;font-weight:bold;float:right;cursor:pointer}.mv-player .play_head .ui-slider-handle,.mv-player .play_head_dvr .ui-slider-handle{border:solid thin;color:#777;background-color:#333} .ui-icon_link{padding:.4em 1em .4em 20px;text-decoration:none;position:relative}.ui-icon_link span.ui-icon{margin:0 5px 0 0;position:absolute;left:0.2em;right:auto;top:50%;margin-top:-8px;zoom:1}.ui-icon_link span.ui-text{position:absolute;left:0.2em;right:auto;margin-top:-3px;zoom:1}.ui-progressbar-value{ background-image:url(\'images/pbar-ani.gif\')}.ui-widget-overlay{background:black;opacity:.40;filter:Alpha(Opacity=40)}.ui-widget-content input{padding:5px}.ui-widget-content a{color:#777}ul.ui-provider-selection{list-style-type:none;margin:0 0 0.6em 0;overflow:hidden;padding:0;text-align:center}ul.ui-provider-selection li{border-left:1px solid black;float:left;line-height:1.1em;margin:0 0.5em 0 -0.5em;padding:0 0.5em;color:blue;list-style-image:none;cursor:pointer}ul.ui-provider-selection li .ui-selected{color:black;font-weight:bold}ul.ui-provider-selection li a.ui-active{color:black;font-weight:bold}ul.ui-provider-selection li a{color:blue;text-decoration:none}.fg-menu .ui-icon{position:relative;top:-1px}.ui-dialog-buttonpane a{float:right;margin-right:10px}\n\n/* cache key: resourceloader:filter:minify-css:7:3524f8461d87e2710aa8c1263efb4f4f */\n"
}, {});

/* cache key: resourceloader:filter:minify-js:7:a10141d3c632116fc54a53c2b4c016bc */