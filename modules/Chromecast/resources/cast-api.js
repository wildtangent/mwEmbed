var chrome = chrome || {};
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
var goog = goog || {};
goog.global = this;
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
	var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
	parts[0] in cur || !cur.execScript || cur.execScript("var " + parts[0]);
	for (var part;parts.length && (part = parts.shift());) {
		parts.length || void 0 === opt_object ? cur = cur[part] ? cur[part] : cur[part] = {} : cur[part] = opt_object;
	}
};
goog.define = function(name, defaultValue) {
	goog.exportPath_(name, defaultValue);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(name) {
	goog.exportPath_(name);
};
goog.setTestOnly = function(opt_message) {
	if (!goog.DEBUG) {
		throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
	}
};
goog.getObjectByName = function(name, opt_obj) {
	for (var parts = name.split("."), cur = opt_obj || goog.global, part;part = parts.shift();) {
		if (goog.isDefAndNotNull(cur[part])) {
			cur = cur[part];
		} else {
			return null;
		}
	}
	return cur;
};
goog.globalize = function(obj, opt_global) {
	var global = opt_global || goog.global, x;
	for (x in obj) {
		global[x] = obj[x];
	}
};
goog.addDependency = function(relPath, provides, requires) {
	if (goog.DEPENDENCIES_ENABLED) {
		for (var provide, require, path = relPath.replace(/\\/g, "/"), deps = goog.dependencies_, i = 0;provide = provides[i];i++) {
			deps.nameToPath[provide] = path, path in deps.pathToNames || (deps.pathToNames[path] = {}), deps.pathToNames[path][provide] = !0;
		}
		for (var j = 0;require = requires[j];j++) {
			path in deps.requires || (deps.requires[path] = {}), deps.requires[path][require] = !0;
		}
	}
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function() {
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue) {
	return opt_returnValue;
};
goog.abstractMethod = function() {
	throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
	ctor.getInstance = function() {
		if (ctor.instance_) {
			return ctor.instance_;
		}
		goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
		return ctor.instance_ = new ctor;
	};
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !1;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
	var doc = goog.global.document;
	return "undefined" != typeof doc && "write" in doc;
}, goog.findBasePath_ = function() {
	if (goog.global.CLOSURE_BASE_PATH) {
		goog.basePath = goog.global.CLOSURE_BASE_PATH;
	} else {
		if (goog.inHtmlDocument_()) {
			for (var scripts = goog.global.document.getElementsByTagName("script"), i = scripts.length - 1;0 <= i;--i) {
				var src = scripts[i].src, qmark = src.lastIndexOf("?"), l = -1 == qmark ? src.length : qmark;
				if ("base.js" == src.substr(l - 7, 7)) {
					goog.basePath = src.substr(0, l - 7);
					break;
				}
			}
		}
	}
}, goog.importScript_ = function(src) {
	var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
	!goog.dependencies_.written[src] && importScript(src) && (goog.dependencies_.written[src] = !0);
}, goog.writeScriptTag_ = function(src) {
	if (goog.inHtmlDocument_()) {
		var doc = goog.global.document;
		if ("complete" == doc.readyState) {
			if (/\bdeps.js$/.test(src)) {
				return!1;
			}
			throw Error('Cannot write "' + src + '" after document load');
		}
		doc.write('<script type="text/javascript" src="' + src + '">\x3c/script>');
		return!0;
	}
	return!1;
}, goog.writeScripts_ = function() {
	function visitNode(path) {
		if (!(path in deps.written)) {
			if (!(path in deps.visited) && (deps.visited[path] = !0, path in deps.requires)) {
				for (var requireName in deps.requires[path]) {
					if (!goog.isProvided_(requireName)) {
						if (requireName in deps.nameToPath) {
							visitNode(deps.nameToPath[requireName]);
						} else {
							throw Error("Undefined nameToPath for " + requireName);
						}
					}
				}
			}
			path in seenScript || (seenScript[path] = !0, scripts.push(path));
		}
	}
	var scripts = [], seenScript = {}, deps = goog.dependencies_, path$$0;
	for (path$$0 in goog.included_) {
		deps.written[path$$0] || visitNode(path$$0);
	}
	for (var i = 0;i < scripts.length;i++) {
		if (scripts[i]) {
			goog.importScript_(goog.basePath + scripts[i]);
		} else {
			throw Error("Undefined script input");
		}
	}
}, goog.getPathFromDeps_ = function(rule) {
	return rule in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[rule] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(value) {
	var s = typeof value;
	if ("object" == s) {
		if (value) {
			if (value instanceof Array) {
				return "array";
			}
			if (value instanceof Object) {
				return s;
			}
			var className = Object.prototype.toString.call(value);
			if ("[object Window]" == className) {
				return "object";
			}
			if ("[object Array]" == className || "number" == typeof value.length && "undefined" != typeof value.splice && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("splice")) {
				return "array";
			}
			if ("[object Function]" == className || "undefined" != typeof value.call && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("call")) {
				return "function";
			}
		} else {
			return "null";
		}
	} else {
		if ("function" == s && "undefined" == typeof value.call) {
			return "object";
		}
	}
	return s;
};
goog.isDef = function(val) {
	return void 0 !== val;
};
goog.isNull = function(val) {
	return null === val;
};
goog.isDefAndNotNull = function(val) {
	return null != val;
};
goog.isArray = function(val) {
	return "array" == goog.typeOf(val);
};
goog.isArrayLike = function(val) {
	var type = goog.typeOf(val);
	return "array" == type || "object" == type && "number" == typeof val.length;
};
goog.isDateLike = function(val) {
	return goog.isObject(val) && "function" == typeof val.getFullYear;
};
goog.isString = function(val) {
	return "string" == typeof val;
};
goog.isBoolean = function(val) {
	return "boolean" == typeof val;
};
goog.isNumber = function(val) {
	return "number" == typeof val;
};
goog.isFunction = function(val) {
	return "function" == goog.typeOf(val);
};
goog.isObject = function(val) {
	var type = typeof val;
	return "object" == type && null != val || "function" == type;
};
goog.getUid = function(obj) {
	return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
	return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
	"removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
	try {
		delete obj[goog.UID_PROPERTY_];
	} catch (ex) {
	}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
	var type = goog.typeOf(obj);
	if ("object" == type || "array" == type) {
		if (obj.clone) {
			return obj.clone();
		}
		var clone = "array" == type ? [] : {}, key;
		for (key in obj) {
			clone[key] = goog.cloneObject(obj[key]);
		}
		return clone;
	}
	return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
	return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
	if (!fn) {
		throw Error();
	}
	if (2 < arguments.length) {
		var boundArgs = Array.prototype.slice.call(arguments, 2);
		return function() {
			var newArgs = Array.prototype.slice.call(arguments);
			Array.prototype.unshift.apply(newArgs, boundArgs);
			return fn.apply(selfObj, newArgs);
		};
	}
	return function() {
		return fn.apply(selfObj, arguments);
	};
};
goog.bind = function(fn, selfObj, var_args) {
	Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
	return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function() {
		var newArgs = args.slice();
		newArgs.push.apply(newArgs, arguments);
		return fn.apply(this, newArgs);
	};
};
goog.mixin = function(target, source) {
	for (var x in source) {
		target[x] = source[x];
	}
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
	return+new Date;
};
goog.globalEval = function(script) {
	if (goog.global.execScript) {
		goog.global.execScript(script, "JavaScript");
	} else {
		if (goog.global.eval) {
			if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
				goog.global.eval(script);
			} else {
				var doc = goog.global.document, scriptElt = doc.createElement("script");
				scriptElt.type = "text/javascript";
				scriptElt.defer = !1;
				scriptElt.appendChild(doc.createTextNode(script));
				doc.body.appendChild(scriptElt);
				doc.body.removeChild(scriptElt);
			}
		} else {
			throw Error("goog.globalEval not available");
		}
	}
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(className, opt_modifier) {
	var getMapping = function(cssName) {
		return goog.cssNameMapping_[cssName] || cssName;
	}, renameByParts = function(cssName) {
		for (var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
			mapped.push(getMapping(parts[i]));
		}
		return mapped.join("-");
	}, rename;
	rename = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? getMapping : renameByParts : function(a) {
		return a;
	};
	return opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
};
goog.setCssNameMapping = function(mapping, opt_style) {
	goog.cssNameMapping_ = mapping;
	goog.cssNameMappingStyle_ = opt_style;
};
goog.getMsg = function(str, opt_values) {
	var values = opt_values || {}, key;
	for (key in values) {
		var value = ("" + values[key]).replace(/\$/g, "$$$$");
		str = str.replace(RegExp("\\{\\$" + key + "\\}", "gi"), value);
	}
	return str;
};
goog.getMsgWithFallback = function(a) {
	return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
	goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
	object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
	function tempCtor() {
	}
	tempCtor.prototype = parentCtor.prototype;
	childCtor.superClass_ = parentCtor.prototype;
	childCtor.prototype = new tempCtor;
	childCtor.prototype.constructor = childCtor;
	childCtor.base = function(me, methodName, var_args) {
		var args = Array.prototype.slice.call(arguments, 2);
		return parentCtor.prototype[methodName].apply(me, args);
	};
};
goog.base = function(me, opt_methodName, var_args) {
	var caller = arguments.callee.caller;
	if (goog.DEBUG && !caller) {
		throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
	}
	if (caller.superClass_) {
		return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1));
	}
	for (var args = Array.prototype.slice.call(arguments, 2), foundCaller = !1, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
		if (ctor.prototype[opt_methodName] === caller) {
			foundCaller = !0;
		} else {
			if (foundCaller) {
				return ctor.prototype[opt_methodName].apply(me, args);
			}
		}
	}
	if (me[opt_methodName] === caller) {
		return me.constructor.prototype[opt_methodName].apply(me, args);
	}
	throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(fn) {
	fn.call(goog.global);
};
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(selfObj, var_args) {
	if (1 < arguments.length) {
		var args = Array.prototype.slice.call(arguments, 1);
		args.unshift(this, selfObj);
		return goog.bind.apply(null, args);
	}
	return goog.bind(this, selfObj);
}, Function.prototype.partial = function(var_args) {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this, null);
	return goog.bind.apply(null, args);
}, Function.prototype.inherits = function(parentCtor) {
	goog.inherits(this, parentCtor);
}, Function.prototype.mixin = function(source) {
	goog.mixin(this.prototype, source);
});
chrome.cast.Capability = {VIDEO_OUT:"video_out", AUDIO_OUT:"audio_out", VIDEO_IN:"video_in", AUDIO_IN:"audio_in"};
chrome.cast.ErrorCode = {CANCEL:"cancel", TIMEOUT:"timeout", API_NOT_INITIALIZED:"api_not_initialized", INVALID_PARAMETER:"invalid_parameter", EXTENSION_NOT_COMPATIBLE:"extension_not_compatible", EXTENSION_MISSING:"extension_missing", RECEIVER_UNAVAILABLE:"receiver_unavailable", SESSION_ERROR:"session_error", CHANNEL_ERROR:"channel_error", LOAD_MEDIA_FAILED:"load_media_failed"};
chrome.cast.ReceiverAvailability = {AVAILABLE:"available", UNAVAILABLE:"unavailable"};
chrome.cast.ReceiverType = {CAST:"cast", DIAL:"dial", CUSTOM:"custom"};
chrome.cast.SenderPlatform = {CHROME:"chrome", IOS:"ios", ANDROID:"android"};
chrome.cast.Error = function(code, opt_description) {
	this.code = code;
	this.description = opt_description || null;
	this.details = null;
};
chrome.cast.SenderApplication = function(platform) {
	this.platform = platform;
	this.packageId = this.url = null;
};
chrome.cast.Image = function(url) {
	this.url = url;
	this.width = this.height = null;
};
chrome.cast.Volume = function() {
	this.level = 0;
	this.muted = !1;
};
var castv2 = {MessageType:{LAUNCH:"LAUNCH", STOP_SESSION:"STOP", SET_VOLUME:"SET_VOLUME", GET_STATUS:"GET_STATUS", RECEIVER_STATUS:"RECEIVER_STATUS", VIRTUAL_CONNECT:"CONNECT", VIRTUAL_CONNECT_CLOSE:"CLOSE", GET_APP_AVAILABILITY:"GET_APP_AVAILABILITY", MEDIA_LOAD:"LOAD", MEDIA_PAUSE:"PAUSE", MEDIA_SEEK:"SEEK", MEDIA_PLAY:"PLAY", MEDIA_STOP:"STOP_MEDIA", MEDIA_GET_STATUS:"GET_STATUS", MEDIA_SET_VOLUME:"MEDIA_SET_VOLUME", INVALID_PLAYER_STATE:"INVALID_PLAYER_STATE", LOAD_FAILED:"LOAD_FAILED", LOAD_CANCELLED:"LOAD_CANCELLED",
	INVALID_REQUEST:"INVALID_REQUEST", MEDIA_STATUS:"MEDIA_STATUS", LAUNCH_ERROR:"LAUNCH_ERROR", PING:"PING", PONG:"PONG"}};
castv2.AppMessage = function(sessionId, namespaceName, message) {
	this.sessionId = sessionId;
	this.namespaceName = namespaceName;
	this.message = message;
};
castv2.StopSessionRequest = function(opt_sessionId) {
	this.type = castv2.MessageType.STOP_SESSION;
	this.requestId = null;
	this.sessionId = opt_sessionId || null;
};
chrome.cast.ApiConfig = function(sessionRequest, sessionListener, receiverListener) {
	this.sessionRequest = sessionRequest;
	this.sessionListener = sessionListener;
	this.receiverListener = receiverListener;
};
chrome.cast.SessionRequest = function(appId, opt_capabilities) {
	this.appId = appId;
	this.capabilities = opt_capabilities || [chrome.cast.Capability.VIDEO_OUT, chrome.cast.Capability.AUDIO_OUT];
	this.customReceiverList = this.dialAppName = null;
};
chrome.cast.VolumeRequest = function(volume) {
	this.volume = volume;
	this.expectedVolume = null;
};
chrome.cast.Receiver = function(label, friendlyName, receiverType, opt_capabilities, opt_volume) {
	this.label = label;
	this.friendlyName = friendlyName;
	this.receiverType = receiverType;
	this.capabilities = opt_capabilities || null;
	this.volume = opt_volume || null;
};
chrome.cast.Session = function(sessionId, appId, displayName, appImages, receiver) {
	this.sessionId = sessionId;
	this.appId = appId;
	this.displayName = displayName;
	this.statusText = null;
	this.appImages = appImages;
	this.receiver = receiver;
	this.senderApps = [];
	this.namespaces = [];
	this.customData = null;
};
chrome.cast.media.MediaCommand = {PLAY:"play", PAUSE:"pause", NEXT:"next", PREVIOUS:"previous", SEEK:"seek", VOLUME:"volume"};
chrome.cast.media.MetadataType = {GENERIC:"generic", MOVIE:"movie", TV_SHOW:"tv_show", MUSIC_TRACK:"music_track"};
chrome.cast.media.PlayerState = {IDLE:"IDLE", PLAYING:"PLAYING", PAUSED:"PAUSED", BUFFERING:"BUFFERING"};
chrome.cast.media.ResumeState = {PLAYBACK_START:"PLAYBACK_START", PLAYBACK_PAUSE:"PLAYBACK_PAUSE"};
chrome.cast.media.StreamType = {BUFFERED:"buffered", LIVE:"live", OTHER:"other"};
chrome.cast.media.PauseRequest = function() {
	this.customData = null;
};
chrome.cast.media.PlayRequest = function() {
	this.customData = null;
};
chrome.cast.media.SeekRequest = function() {
	this.customData = this.resumeState = this.currentTime = null;
};
chrome.cast.media.StopRequest = function() {
	this.customData = null;
};
chrome.cast.media.VolumeRequest = function() {
	this.volume = null;
};
chrome.cast.media.LoadRequest = function(mediaInfo) {
	this.type = castv2.MessageType.MEDIA_LOAD;
	this.sessionId = this.requestId = null;
	this.media = mediaInfo;
	this.autoplay = !0;
	this.customData = this.currentTime = null;
};
chrome.cast.media.GenericMediaMetadata = function() {
	this.type = chrome.cast.media.MetadataType.GENERIC;
	this.releaseYear = this.images = this.subtitle = this.title = null;
};
chrome.cast.media.MovieMediaMetadata = function() {
	this.type = chrome.cast.media.MetadataType.MOVIE;
	this.releaseYear = this.images = this.subtitle = this.studio = this.title = null;
};
chrome.cast.media.TvShowMediaMetadata = function() {
	this.type = chrome.cast.media.MetadataType.TV_SHOW;
	this.releaseYear = this.images = this.episodeNumber = this.seasonNumber = this.episodeTitle = this.seriesTitle = null;
};
chrome.cast.media.MusicTrackMediaMetadata = function() {
	this.type = chrome.cast.media.MetadataType.MUSIC_TRACK;
	this.releaseYear = this.images = this.discNumber = this.trackNumber = this.artistName = this.songName = this.albumName = null;
};
chrome.cast.media.MediaInfo = function(contentId, contentType) {
	this.contentId = contentId;
	this.streamType = chrome.cast.media.StreamType.BUFFERED;
	this.contentType = contentType;
	this.customData = this.duration = this.metadata = null;
};
chrome.cast.media.Media = function(mediaSessionId) {
	this.sessionId = "";
	this.mediaSessionId = mediaSessionId;
	this.media = null;
	this.playbackRate = 1;
	this.playerState = chrome.cast.media.PlayerState.IDLE;
	this.currentTime = 0;
	this.supportedMediaCommands = [];
	this.volume = new chrome.cast.Volume;
	this.customData = null;
};
castv2.getCastNamespace_ = function(postfix) {
	return "urn:x-cast:com.google.cast." + postfix;
};
castv2.Namespace = {TP_CONNECTION:castv2.getCastNamespace_("tp.connection"), TP_HEARTBEAT:castv2.getCastNamespace_("tp.heartbeat"), RECEIVER:castv2.getCastNamespace_("receiver"), MEDIA:castv2.getCastNamespace_("media")};
castv2.Namespace.isCastNamespace = function(namespace) {
	switch(namespace) {
		case castv2.Namespace.TP_CONNECTION:
			;
		case castv2.Namespace.TP_HEARTBEAT:
			;
		case castv2.Namespace.RECEIVER:
			;
		case castv2.Namespace.MEDIA:
			return!0;
		default:
			return!1;
	}
};
castv2.ApplicationSessionDetails = function() {
	this.displayName = this.appId = this.sessionId = this.transportId = "";
	this.statusText = null;
	this.appImages = [];
	this.senderApps = [];
	this.namespaces = [];
};
castv2.ReceiverStatusRequest = function() {
	this.type = castv2.MessageType.GET_STATUS;
	this.requestId = null;
};
castv2.ReceiverStatusResponse = function() {
	this.type = castv2.MessageType.RECEIVER_STATUS;
	this.status = this.requestId = null;
};
castv2.ReceiverStatus = function() {
	this.channelUrl = this.volume = this.applications = null;
};
castv2.IParticipant = function() {
};
castv2.IReceiver = function() {
};
goog.debug = {};
goog.debug.Error = function(opt_msg) {
	Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
	opt_msg && (this.message = String(opt_msg));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
	return 0 == str.lastIndexOf(prefix, 0);
};
goog.string.endsWith = function(str, suffix) {
	var l = str.length - suffix.length;
	return 0 <= l && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
	return 0 == goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length));
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
	return 0 == goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length));
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
	return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
	for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1);subsArguments.length && 1 < splitParts.length;) {
		returnString += splitParts.shift() + subsArguments.shift();
	}
	return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
	return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmpty = function(str) {
	return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptySafe = function(str) {
	return goog.string.isEmpty(goog.string.makeSafe(str));
};
goog.string.isBreakingWhitespace = function(str) {
	return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
	return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
	return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
	return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
	return " " == ch;
};
goog.string.isUnicodeChar = function(ch) {
	return 1 == ch.length && " " <= ch && "~" >= ch || "\u0080" <= ch && "\ufffd" >= ch;
};
goog.string.stripNewlines = function(str) {
	return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
	return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
	return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
	return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
	return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = function(str) {
	return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
	return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
	return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
	var test1 = String(str1).toLowerCase(), test2 = String(str2).toLowerCase();
	return test1 < test2 ? -1 : test1 == test2 ? 0 : 1;
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
	if (str1 == str2) {
		return 0;
	}
	if (!str1) {
		return-1;
	}
	if (!str2) {
		return 1;
	}
	for (var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_), tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_), count = Math.min(tokens1.length, tokens2.length), i = 0;i < count;i++) {
		var a = tokens1[i], b = tokens2[i];
		if (a != b) {
			var num1 = parseInt(a, 10);
			if (!isNaN(num1)) {
				var num2 = parseInt(b, 10);
				if (!isNaN(num2) && num1 - num2) {
					return num1 - num2;
				}
			}
			return a < b ? -1 : 1;
		}
	}
	return tokens1.length != tokens2.length ? tokens1.length - tokens2.length : str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
	return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
	return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
	return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
	if (opt_isLikelyToContainHtmlChars) {
		return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;").replace(goog.string.singleQuoteRe_, "&#39;");
	}
	if (!goog.string.allRe_.test(str)) {
		return str;
	}
	-1 != str.indexOf("&") && (str = str.replace(goog.string.amperRe_, "&amp;"));
	-1 != str.indexOf("<") && (str = str.replace(goog.string.ltRe_, "&lt;"));
	-1 != str.indexOf(">") && (str = str.replace(goog.string.gtRe_, "&gt;"));
	-1 != str.indexOf('"') && (str = str.replace(goog.string.quotRe_, "&quot;"));
	-1 != str.indexOf("'") && (str = str.replace(goog.string.singleQuoteRe_, "&#39;"));
	return str;
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /"/g;
goog.string.singleQuoteRe_ = /'/g;
goog.string.allRe_ = /[&<>"']/;
goog.string.unescapeEntities = function(str) {
	return goog.string.contains(str, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(str) : goog.string.unescapePureXmlEntities_(str) : str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
	return goog.string.contains(str, "&") ? goog.string.unescapeEntitiesUsingDom_(str, document) : str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
	var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, div;
	div = opt_document ? opt_document.createElement("div") : document.createElement("div");
	return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
		var value = seen[s];
		if (value) {
			return value;
		}
		if ("#" == entity.charAt(0)) {
			var n = Number("0" + entity.substr(1));
			isNaN(n) || (value = String.fromCharCode(n));
		}
		value || (div.innerHTML = s + " ", value = div.firstChild.nodeValue.slice(0, -1));
		return seen[s] = value;
	});
};
goog.string.unescapePureXmlEntities_ = function(str) {
	return str.replace(/&([^;]+);/g, function(s, entity) {
		switch(entity) {
			case "amp":
				return "&";
			case "lt":
				return "<";
			case "gt":
				return ">";
			case "quot":
				return'"';
			default:
				if ("#" == entity.charAt(0)) {
					var n = Number("0" + entity.substr(1));
					if (!isNaN(n)) {
						return String.fromCharCode(n);
					}
				}
				return s;
		}
	});
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
	return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.stripQuotes = function(str, quoteChars) {
	for (var length = quoteChars.length, i = 0;i < length;i++) {
		var quoteChar = 1 == length ? quoteChars : quoteChars.charAt(i);
		if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
			return str.substring(1, str.length - 1);
		}
	}
	return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
	opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
	str.length > chars && (str = str.substring(0, chars - 3) + "...");
	opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
	return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
	opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
	if (opt_trailingChars && str.length > chars) {
		opt_trailingChars > chars && (opt_trailingChars = chars), str = str.substring(0, chars - opt_trailingChars) + "..." + str.substring(str.length - opt_trailingChars);
	} else {
		if (str.length > chars) {
			var half = Math.floor(chars / 2), endPos = str.length - half;
			str = str.substring(0, half + chars % 2) + "..." + str.substring(endPos);
		}
	}
	opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
	return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
	s = String(s);
	if (s.quote) {
		return s.quote();
	}
	for (var sb = ['"'], i = 0;i < s.length;i++) {
		var ch = s.charAt(i), cc = ch.charCodeAt(0);
		sb[i + 1] = goog.string.specialEscapeChars_[ch] || (31 < cc && 127 > cc ? ch : goog.string.escapeChar(ch));
	}
	sb.push('"');
	return sb.join("");
};
goog.string.escapeString = function(str) {
	for (var sb = [], i = 0;i < str.length;i++) {
		sb[i] = goog.string.escapeChar(str.charAt(i));
	}
	return sb.join("");
};
goog.string.escapeChar = function(c) {
	if (c in goog.string.jsEscapeCache_) {
		return goog.string.jsEscapeCache_[c];
	}
	if (c in goog.string.specialEscapeChars_) {
		return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
	}
	var rv = c, cc = c.charCodeAt(0);
	if (31 < cc && 127 > cc) {
		rv = c;
	} else {
		if (256 > cc) {
			if (rv = "\\x", 16 > cc || 256 < cc) {
				rv += "0";
			}
		} else {
			rv = "\\u", 4096 > cc && (rv += "0");
		}
		rv += cc.toString(16).toUpperCase();
	}
	return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.toMap = function(s) {
	for (var rv = {}, i = 0;i < s.length;i++) {
		rv[s.charAt(i)] = !0;
	}
	return rv;
};
goog.string.contains = function(s, ss) {
	return-1 != s.indexOf(ss);
};
goog.string.countOf = function(s, ss) {
	return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
	var resultStr = s;
	0 <= index && index < s.length && 0 < stringLength && (resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength));
	return resultStr;
};
goog.string.remove = function(s, ss) {
	var re = RegExp(goog.string.regExpEscape(ss), "");
	return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
	var re = RegExp(goog.string.regExpEscape(ss), "g");
	return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
	return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
	return Array(length + 1).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
	var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
	-1 == index && (index = s.length);
	return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
	return null == obj ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
	return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
	return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
	for (var order = 0, v1Subs = goog.string.trim(String(version1)).split("."), v2Subs = goog.string.trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length), subIdx = 0;0 == order && subIdx < subCount;subIdx++) {
		var v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "", v1CompParser = RegExp("(\\d*)(\\D*)", "g"), v2CompParser = RegExp("(\\d*)(\\D*)", "g");
		do {
			var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""], v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
			if (0 == v1Comp[0].length && 0 == v2Comp[0].length) {
				break;
			}
			order = goog.string.compareElements_(0 == v1Comp[1].length ? 0 : parseInt(v1Comp[1], 10), 0 == v2Comp[1].length ? 0 : parseInt(v2Comp[1], 10)) || goog.string.compareElements_(0 == v1Comp[2].length, 0 == v2Comp[2].length) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
		} while (0 == order);
	}
	return order;
};
goog.string.compareElements_ = function(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
	for (var result = 0, i = 0;i < str.length;++i) {
		result = 31 * result + str.charCodeAt(i), result %= goog.string.HASHCODE_MAX_;
	}
	return result;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
	return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
	var num = Number(str);
	return 0 == num && goog.string.isEmpty(str) ? NaN : num;
};
goog.string.isLowerCamelCase = function(str) {
	return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
	return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
	return String(str).replace(/\-([a-z])/g, function(all, match) {
		return match.toUpperCase();
	});
};
goog.string.toSelectorCase = function(str) {
	return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
	var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
	return str.replace(RegExp("(^" + (delimiters ? "|[" + delimiters + "]+" : "") + ")([a-z])", "g"), function(all, p1, p2) {
		return p1 + p2.toUpperCase();
	});
};
goog.string.parseInt = function(value) {
	isFinite(value) && (value = String(value));
	return goog.isString(value) ? /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10) : NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
	for (var parts = str.split(separator), returnVal = [];0 < limit && parts.length;) {
		returnVal.push(parts.shift()), limit--;
	}
	parts.length && returnVal.push(parts.join(separator));
	return returnVal;
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
	messageArgs.unshift(messagePattern);
	goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
	messageArgs.shift();
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
	var message = "Assertion failed";
	if (givenMessage) {
		var message = message + (": " + givenMessage), args = givenArgs
	} else {
		defaultMessage && (message += ": " + defaultMessage, args = defaultArgs);
	}
	throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !condition && goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
	return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
	if (goog.asserts.ENABLE_ASSERTS) {
		throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
	}
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertString = function(value, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !goog.isString(value) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !goog.isObject(value) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !goog.isArray(value) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
	goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
	!goog.asserts.ENABLE_ASSERTS || goog.isObject(value) && value.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
	return value;
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
	!goog.asserts.ENABLE_ASSERTS || value instanceof type || goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3));
	return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
	for (var key in Object.prototype) {
		goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
	}
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(array) {
	return array[array.length - 1];
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(arr, obj, opt_fromIndex) {
	return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
	var fromIndex = null == opt_fromIndex ? 0 : 0 > opt_fromIndex ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
	if (goog.isString(arr)) {
		return goog.isString(obj) && 1 == obj.length ? arr.indexOf(obj, fromIndex) : -1;
	}
	for (var i = fromIndex;i < arr.length;i++) {
		if (i in arr && arr[i] === obj) {
			return i;
		}
	}
	return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(arr, obj, opt_fromIndex) {
	return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, null == opt_fromIndex ? arr.length - 1 : opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
	var fromIndex = null == opt_fromIndex ? arr.length - 1 : opt_fromIndex;
	0 > fromIndex && (fromIndex = Math.max(0, arr.length + fromIndex));
	if (goog.isString(arr)) {
		return goog.isString(obj) && 1 == obj.length ? arr.lastIndexOf(obj, fromIndex) : -1;
	}
	for (var i = fromIndex;0 <= i;i--) {
		if (i in arr && arr[i] === obj) {
			return i;
		}
	}
	return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(arr, f, opt_obj) {
	goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
	for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
		i in arr2 && f.call(opt_obj, arr2[i], i, arr);
	}
};
goog.array.forEachRight = function(arr, f, opt_obj) {
	for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;0 <= i;--i) {
		i in arr2 && f.call(opt_obj, arr2[i], i, arr);
	}
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(arr, f, opt_obj) {
	return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
	for (var l = arr.length, res = [], resLength = 0, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
		if (i in arr2) {
			var val = arr2[i];
			f.call(opt_obj, val, i, arr) && (res[resLength++] = val);
		}
	}
	return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(arr, f, opt_obj) {
	return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
	for (var l = arr.length, res = Array(l), arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
		i in arr2 && (res[i] = f.call(opt_obj, arr2[i], i, arr));
	}
	return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.reduce ? function(arr, f, val, opt_obj) {
	opt_obj && (f = goog.bind(f, opt_obj));
	return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val);
} : function(arr, f, val$$0, opt_obj) {
	var rval = val$$0;
	goog.array.forEach(arr, function(val, index) {
		rval = f.call(opt_obj, rval, val, index, arr);
	});
	return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.reduceRight ? function(arr, f, val, opt_obj) {
	opt_obj && (f = goog.bind(f, opt_obj));
	return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val$$0, opt_obj) {
	var rval = val$$0;
	goog.array.forEachRight(arr, function(val, index) {
		rval = f.call(opt_obj, rval, val, index, arr);
	});
	return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(arr, f, opt_obj) {
	return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
	for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
		if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
			return!0;
		}
	}
	return!1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(arr, f, opt_obj) {
	return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
	for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
		if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
			return!1;
		}
	}
	return!0;
};
goog.array.count = function(arr$$0, f, opt_obj) {
	var count = 0;
	goog.array.forEach(arr$$0, function(element, index, arr) {
		f.call(opt_obj, element, index, arr) && ++count;
	}, opt_obj);
	return count;
};
goog.array.find = function(arr, f, opt_obj) {
	var i = goog.array.findIndex(arr, f, opt_obj);
	return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
	for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
		if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
			return i;
		}
	}
	return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
	var i = goog.array.findIndexRight(arr, f, opt_obj);
	return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
	for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;0 <= i;i--) {
		if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
			return i;
		}
	}
	return-1;
};
goog.array.contains = function(arr, obj) {
	return 0 <= goog.array.indexOf(arr, obj);
};
goog.array.isEmpty = function(arr) {
	return 0 == arr.length;
};
goog.array.clear = function(arr) {
	if (!goog.isArray(arr)) {
		for (var i = arr.length - 1;0 <= i;i--) {
			delete arr[i];
		}
	}
	arr.length = 0;
};
goog.array.insert = function(arr, obj) {
	goog.array.contains(arr, obj) || arr.push(obj);
};
goog.array.insertAt = function(arr, obj, opt_i) {
	goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
	goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
	var i;
	2 == arguments.length || 0 > (i = goog.array.indexOf(arr, opt_obj2)) ? arr.push(obj) : goog.array.insertAt(arr, obj, i);
};
goog.array.remove = function(arr, obj) {
	var i = goog.array.indexOf(arr, obj), rv;
	(rv = 0 <= i) && goog.array.removeAt(arr, i);
	return rv;
};
goog.array.removeAt = function(arr, i) {
	return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length;
};
goog.array.removeIf = function(arr, f, opt_obj) {
	var i = goog.array.findIndex(arr, f, opt_obj);
	return 0 <= i ? (goog.array.removeAt(arr, i), !0) : !1;
};
goog.array.concat = function(var_args) {
	return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
	var length = object.length;
	if (0 < length) {
		for (var rv = Array(length), i = 0;i < length;i++) {
			rv[i] = object[i];
		}
		return rv;
	}
	return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
	for (var i = 1;i < arguments.length;i++) {
		var arr2 = arguments[i], isArrayLike;
		if (goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && Object.prototype.hasOwnProperty.call(arr2, "callee")) {
			arr1.push.apply(arr1, arr2);
		} else {
			if (isArrayLike) {
				for (var len1 = arr1.length, len2 = arr2.length, j = 0;j < len2;j++) {
					arr1[len1 + j] = arr2[j];
				}
			} else {
				arr1.push(arr2);
			}
		}
	}
};
goog.array.splice = function(arr, index, howMany, var_args) {
	return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
	return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start) : goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
	for (var returnArray = opt_rv || arr, hashFn = opt_hashFn || function() {
		return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
	}, seen = {}, cursorInsert = 0, cursorRead = 0;cursorRead < arr.length;) {
		var current = arr[cursorRead++], key = hashFn(current);
		Object.prototype.hasOwnProperty.call(seen, key) || (seen[key] = !0, returnArray[cursorInsert++] = current);
	}
	returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
	return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, !1, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
	return goog.array.binarySearch_(arr, evaluator, !0, void 0, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
	for (var left = 0, right = arr.length, found;left < right;) {
		var middle = left + right >> 1, compareResult;
		compareResult = isEvaluator ? compareFn.call(opt_selfObj, arr[middle], middle, arr) : compareFn(opt_target, arr[middle]);
		0 < compareResult ? left = middle + 1 : (right = middle, found = !compareResult);
	}
	return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
	goog.array.ARRAY_PROTOTYPE_.sort.call(arr, opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
	for (var i = 0;i < arr.length;i++) {
		arr[i] = {index:i, value:arr[i]};
	}
	var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
	goog.array.sort(arr, function(obj1, obj2) {
		return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
	});
	for (i = 0;i < arr.length;i++) {
		arr[i] = arr[i].value;
	}
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
	var compare = opt_compareFn || goog.array.defaultCompare;
	goog.array.sort(arr, function(a, b) {
		return compare(a[key], b[key]);
	});
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
	for (var compare = opt_compareFn || goog.array.defaultCompare, i = 1;i < arr.length;i++) {
		var compareResult = compare(arr[i - 1], arr[i]);
		if (0 < compareResult || 0 == compareResult && opt_strict) {
			return!1;
		}
	}
	return!0;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
	if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
		return!1;
	}
	for (var l = arr1.length, equalsFn = opt_equalsFn || goog.array.defaultCompareEquality, i = 0;i < l;i++) {
		if (!equalsFn(arr1[i], arr2[i])) {
			return!1;
		}
	}
	return!0;
};
goog.array.compare = function(arr1, arr2, opt_equalsFn) {
	return goog.array.equals(arr1, arr2, opt_equalsFn);
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
	for (var compare = opt_compareFn || goog.array.defaultCompare, l = Math.min(arr1.length, arr2.length), i = 0;i < l;i++) {
		var result = compare(arr1[i], arr2[i]);
		if (0 != result) {
			return result;
		}
	}
	return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
	return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
	return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
	var index = goog.array.binarySearch(array, value, opt_compareFn);
	return 0 > index ? (goog.array.insertAt(array, value, -(index + 1)), !0) : !1;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
	var index = goog.array.binarySearch(array, value, opt_compareFn);
	return 0 <= index ? goog.array.removeAt(array, index) : !1;
};
goog.array.bucket = function(array, sorter, opt_obj) {
	for (var buckets = {}, i = 0;i < array.length;i++) {
		var value = array[i], key = sorter.call(opt_obj, value, i, array);
		goog.isDef(key) && (buckets[key] || (buckets[key] = [])).push(value);
	}
	return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
	var ret = {};
	goog.array.forEach(arr, function(element, index) {
		ret[keyFunc.call(opt_obj, element, index, arr)] = element;
	});
	return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
	var array = [], start = 0, end = startOrEnd, step = opt_step || 1;
	void 0 !== opt_end && (start = startOrEnd, end = opt_end);
	if (0 > step * (end - start)) {
		return[];
	}
	if (0 < step) {
		for (var i = start;i < end;i += step) {
			array.push(i);
		}
	} else {
		for (i = start;i > end;i += step) {
			array.push(i);
		}
	}
	return array;
};
goog.array.repeat = function(value, n) {
	for (var array = [], i = 0;i < n;i++) {
		array[i] = value;
	}
	return array;
};
goog.array.flatten = function(var_args) {
	for (var result = [], i = 0;i < arguments.length;i++) {
		var element = arguments[i];
		goog.isArray(element) ? result.push.apply(result, goog.array.flatten.apply(null, element)) : result.push(element);
	}
	return result;
};
goog.array.rotate = function(array, n) {
	array.length && (n %= array.length, 0 < n ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n)) : 0 > n && goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n)));
	return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
	var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
	goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
	if (!arguments.length) {
		return[];
	}
	for (var result = [], i = 0;;i++) {
		for (var value = [], j = 0;j < arguments.length;j++) {
			var arr = arguments[j];
			if (i >= arr.length) {
				return result;
			}
			value.push(arr[i]);
		}
		result.push(value);
	}
};
goog.array.shuffle = function(arr, opt_randFn) {
	for (var randFn = opt_randFn || Math.random, i = arr.length - 1;0 < i;i--) {
		var j = Math.floor(randFn() * (i + 1)), tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
};
goog.structs = {};
goog.structs.Collection = function() {
};
goog.functions = {};
goog.functions.constant = function(retValue) {
	return function() {
		return retValue;
	};
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue) {
	return opt_returnValue;
};
goog.functions.error = function(message) {
	return function() {
		throw Error(message);
	};
};
goog.functions.fail = function(err) {
	return function() {
		throw err;
	};
};
goog.functions.lock = function(f, opt_numArgs) {
	opt_numArgs = opt_numArgs || 0;
	return function() {
		return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
	};
};
goog.functions.nth = function(n) {
	return function() {
		return arguments[n];
	};
};
goog.functions.withReturnValue = function(f, retValue) {
	return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.compose = function(fn, var_args) {
	var functions = arguments, length = functions.length;
	return function() {
		var result;
		length && (result = functions[length - 1].apply(this, arguments));
		for (var i = length - 2;0 <= i;i--) {
			result = functions[i].call(this, result);
		}
		return result;
	};
};
goog.functions.sequence = function(var_args) {
	var functions = arguments, length = functions.length;
	return function() {
		for (var result, i = 0;i < length;i++) {
			result = functions[i].apply(this, arguments);
		}
		return result;
	};
};
goog.functions.and = function(var_args) {
	var functions = arguments, length = functions.length;
	return function() {
		for (var i = 0;i < length;i++) {
			if (!functions[i].apply(this, arguments)) {
				return!1;
			}
		}
		return!0;
	};
};
goog.functions.or = function(var_args) {
	var functions = arguments, length = functions.length;
	return function() {
		for (var i = 0;i < length;i++) {
			if (functions[i].apply(this, arguments)) {
				return!0;
			}
		}
		return!1;
	};
};
goog.functions.not = function(f) {
	return function() {
		return!f.apply(this, arguments);
	};
};
goog.functions.create = function(constructor, var_args) {
	var temp = function() {
	};
	temp.prototype = constructor.prototype;
	var obj = new temp;
	constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
	return obj;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(fn) {
	var called = !1, value;
	return function() {
		if (!goog.functions.CACHE_RETURN_VALUE) {
			return fn();
		}
		called || (value = fn(), called = !0);
		return value;
	};
};
goog.math = {};
goog.math.randomInt = function(a) {
	return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
	return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
	return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
	var r = a % b;
	return 0 > r * b ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
	return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
	return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
	return goog.math.modulo(angle, 360);
};
goog.math.toRadians = function(angleDegrees) {
	return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
	return 180 * angleRadians / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
	return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
	return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
	return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
	var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
	180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
	return d;
};
goog.math.sign = function(x) {
	return 0 == x ? 0 : 0 > x ? -1 : 1;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
	for (var compare = opt_compareFn || function(a, b) {
		return a == b;
	}, collect = opt_collectorFn || function(i1) {
		return array1[i1];
	}, length1 = array1.length, length2 = array2.length, arr = [], i = 0;i < length1 + 1;i++) {
		arr[i] = [], arr[i][0] = 0;
	}
	for (var j = 0;j < length2 + 1;j++) {
		arr[0][j] = 0;
	}
	for (i = 1;i <= length1;i++) {
		for (j = 1;j <= length2;j++) {
			compare(array1[i - 1], array2[j - 1]) ? arr[i][j] = arr[i - 1][j - 1] + 1 : arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
		}
	}
	for (var result = [], i = length1, j = length2;0 < i && 0 < j;) {
		compare(array1[i - 1], array2[j - 1]) ? (result.unshift(collect(i - 1, j - 1)), i--, j--) : arr[i - 1][j] > arr[i][j - 1] ? i-- : j--;
	}
	return result;
};
goog.math.sum = function(var_args) {
	return goog.array.reduce(arguments, function(sum, value) {
		return sum + value;
	}, 0);
};
goog.math.average = function(var_args) {
	return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
	var sampleSize = arguments.length;
	if (2 > sampleSize) {
		return 0;
	}
	var mean = goog.math.average.apply(null, arguments);
	return goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
		return Math.pow(val - mean, 2);
	})) / (sampleSize - 1);
};
goog.math.standardDeviation = function(var_args) {
	return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
	return isFinite(num) && 0 == num % 1;
};
goog.math.isFiniteNumber = function(num) {
	return isFinite(num) && !isNaN(num);
};
goog.math.safeFloor = function(num, opt_epsilon) {
	return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
	return Math.ceil(num - (opt_epsilon || 2E-15));
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
	throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
	return this;
};
goog.iter.toIterator = function(iterable) {
	if (iterable instanceof goog.iter.Iterator) {
		return iterable;
	}
	if ("function" == typeof iterable.__iterator__) {
		return iterable.__iterator__(!1);
	}
	if (goog.isArrayLike(iterable)) {
		var i = 0, newIter = new goog.iter.Iterator;
		newIter.next = function() {
			for (;;) {
				if (i >= iterable.length) {
					throw goog.iter.StopIteration;
				}
				if (i in iterable) {
					return iterable[i++];
				}
				i++;
			}
		};
		return newIter;
	}
	throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
	if (goog.isArrayLike(iterable)) {
		try {
			goog.array.forEach(iterable, f, opt_obj);
		} catch (ex) {
			if (ex !== goog.iter.StopIteration) {
				throw ex;
			}
		}
	} else {
		iterable = goog.iter.toIterator(iterable);
		try {
			for (;;) {
				f.call(opt_obj, iterable.next(), void 0, iterable);
			}
		} catch (ex$$0) {
			if (ex$$0 !== goog.iter.StopIteration) {
				throw ex$$0;
			}
		}
	}
};
goog.iter.filter = function(iterable, f, opt_obj) {
	var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
	newIter.next = function() {
		for (;;) {
			var val = iterator.next();
			if (f.call(opt_obj, val, void 0, iterator)) {
				return val;
			}
		}
	};
	return newIter;
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
	var start = 0, stop = startOrStop, step = opt_step || 1;
	1 < arguments.length && (start = startOrStop, stop = opt_stop);
	if (0 == step) {
		throw Error("Range step argument must not be zero");
	}
	var newIter = new goog.iter.Iterator;
	newIter.next = function() {
		if (0 < step && start >= stop || 0 > step && start <= stop) {
			throw goog.iter.StopIteration;
		}
		var rv = start;
		start += step;
		return rv;
	};
	return newIter;
};
goog.iter.join = function(iterable, deliminator) {
	return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
	var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
	newIter.next = function() {
		for (;;) {
			var val = iterator.next();
			return f.call(opt_obj, val, void 0, iterator);
		}
	};
	return newIter;
};
goog.iter.reduce = function(iterable, f, val$$0, opt_obj) {
	var rval = val$$0;
	goog.iter.forEach(iterable, function(val) {
		rval = f.call(opt_obj, rval, val);
	});
	return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
	iterable = goog.iter.toIterator(iterable);
	try {
		for (;;) {
			if (f.call(opt_obj, iterable.next(), void 0, iterable)) {
				return!0;
			}
		}
	} catch (ex) {
		if (ex !== goog.iter.StopIteration) {
			throw ex;
		}
	}
	return!1;
};
goog.iter.every = function(iterable, f, opt_obj) {
	iterable = goog.iter.toIterator(iterable);
	try {
		for (;;) {
			if (!f.call(opt_obj, iterable.next(), void 0, iterable)) {
				return!1;
			}
		}
	} catch (ex) {
		if (ex !== goog.iter.StopIteration) {
			throw ex;
		}
	}
	return!0;
};
goog.iter.chain = function(var_args) {
	var iterator = goog.iter.toIterator(arguments), iter = new goog.iter.Iterator, current = null;
	iter.next = function() {
		for (;;) {
			if (null == current) {
				var it = iterator.next();
				current = goog.iter.toIterator(it);
			}
			try {
				return current.next();
			} catch (ex) {
				if (ex !== goog.iter.StopIteration) {
					throw ex;
				}
				current = null;
			}
		}
	};
	return iter;
};
goog.iter.chainFromIterable = function(iterable) {
	return goog.iter.chain.apply(void 0, iterable);
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
	var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, dropping = !0;
	newIter.next = function() {
		for (;;) {
			var val = iterator.next();
			if (!dropping || !f.call(opt_obj, val, void 0, iterator)) {
				return dropping = !1, val;
			}
		}
	};
	return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
	var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, taking = !0;
	newIter.next = function() {
		for (;;) {
			if (taking) {
				var val = iterator.next();
				if (f.call(opt_obj, val, void 0, iterator)) {
					return val;
				}
				taking = !1;
			} else {
				throw goog.iter.StopIteration;
			}
		}
	};
	return newIter;
};
goog.iter.toArray = function(iterable) {
	if (goog.isArrayLike(iterable)) {
		return goog.array.toArray(iterable);
	}
	iterable = goog.iter.toIterator(iterable);
	var array = [];
	goog.iter.forEach(iterable, function(val) {
		array.push(val);
	});
	return array;
};
goog.iter.equals = function(iterable1, iterable2) {
	var pairs = goog.iter.zipLongest({}, iterable1, iterable2);
	return goog.iter.every(pairs, function(pair) {
		return pair[0] == pair[1];
	});
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
	try {
		return goog.iter.toIterator(iterable).next();
	} catch (e) {
		if (e != goog.iter.StopIteration) {
			throw e;
		}
		return defaultValue;
	}
};
goog.iter.product = function(var_args) {
	if (goog.array.some(arguments, function(arr) {
		return!arr.length;
	}) || !arguments.length) {
		return new goog.iter.Iterator;
	}
	var iter = new goog.iter.Iterator, arrays = arguments, indicies = goog.array.repeat(0, arrays.length);
	iter.next = function() {
		if (indicies) {
			for (var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
				return arrays[arrayIndex][valueIndex];
			}), i = indicies.length - 1;0 <= i;i--) {
				if (indicies[i] < arrays[i].length - 1) {
					indicies[i]++;
					break;
				}
				if (0 == i) {
					indicies = null;
					break;
				}
				indicies[i] = 0;
			}
			return retVal;
		}
		throw goog.iter.StopIteration;
	};
	return iter;
};
goog.iter.cycle = function(iterable) {
	var baseIterator = goog.iter.toIterator(iterable), cache = [], cacheIndex = 0, iter = new goog.iter.Iterator, useCache = !1;
	iter.next = function() {
		var returnElement = null;
		if (!useCache) {
			try {
				return returnElement = baseIterator.next(), cache.push(returnElement), returnElement;
			} catch (e) {
				if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
					throw e;
				}
				useCache = !0;
			}
		}
		returnElement = cache[cacheIndex];
		cacheIndex = (cacheIndex + 1) % cache.length;
		return returnElement;
	};
	return iter;
};
goog.iter.count = function(opt_start, opt_step) {
	var counter = opt_start || 0, step = goog.isDef(opt_step) ? opt_step : 1, iter = new goog.iter.Iterator;
	iter.next = function() {
		var returnValue = counter;
		counter += step;
		return returnValue;
	};
	return iter;
};
goog.iter.repeat = function(value) {
	var iter = new goog.iter.Iterator;
	iter.next = goog.functions.constant(value);
	return iter;
};
goog.iter.accumulate = function(iterable) {
	var iterator = goog.iter.toIterator(iterable), total = 0, iter = new goog.iter.Iterator;
	iter.next = function() {
		return total += iterator.next();
	};
	return iter;
};
goog.iter.zip = function(var_args) {
	var args = arguments, iter = new goog.iter.Iterator;
	if (0 < args.length) {
		var iterators = goog.array.map(args, goog.iter.toIterator);
		iter.next = function() {
			return goog.array.map(iterators, function(it) {
				return it.next();
			});
		};
	}
	return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
	var args = goog.array.slice(arguments, 1), iter = new goog.iter.Iterator;
	if (0 < args.length) {
		var iterators = goog.array.map(args, goog.iter.toIterator);
		iter.next = function() {
			var iteratorsHaveValues = !1, arr = goog.array.map(iterators, function(it) {
				var returnValue;
				try {
					returnValue = it.next(), iteratorsHaveValues = !0;
				} catch (ex) {
					if (ex !== goog.iter.StopIteration) {
						throw ex;
					}
					returnValue = fillValue;
				}
				return returnValue;
			});
			if (!iteratorsHaveValues) {
				throw goog.iter.StopIteration;
			}
			return arr;
		};
	}
	return iter;
};
goog.iter.compress = function(iterable, selectors) {
	var selectorIterator = goog.iter.toIterator(selectors);
	return goog.iter.filter(iterable, function() {
		return!!selectorIterator.next();
	});
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
	this.iterator = goog.iter.toIterator(iterable);
	this.keyFunc = opt_keyFunc || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
	for (;this.currentKey == this.targetKey;) {
		this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
	}
	this.targetKey = this.currentKey;
	return[this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
	for (var arr = [];this.currentKey == targetKey;) {
		arr.push(this.currentValue);
		try {
			this.currentValue = this.iterator.next();
		} catch (ex) {
			if (ex !== goog.iter.StopIteration) {
				throw ex;
			}
			break;
		}
		this.currentKey = this.keyFunc(this.currentValue);
	}
	return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
	return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.tee = function(iterable, opt_num) {
	var iterator = goog.iter.toIterator(iterable), num = goog.isNumber(opt_num) ? opt_num : 2, buffers = goog.array.map(goog.array.range(num), function() {
		return[];
	}), addNextIteratorValueToBuffers = function() {
		var val = iterator.next();
		goog.array.forEach(buffers, function(buffer) {
			buffer.push(val);
		});
	};
	return goog.array.map(buffers, function(buffer) {
		var iter = new goog.iter.Iterator;
		iter.next = function() {
			goog.array.isEmpty(buffer) && addNextIteratorValueToBuffers();
			return buffer.shift();
		};
		return iter;
	});
};
goog.iter.enumerate = function(iterable, opt_start) {
	return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
	var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, remaining = limitSize;
	iter.next = function() {
		if (0 < remaining--) {
			return iterator.next();
		}
		throw goog.iter.StopIteration;
	};
	return iter;
};
goog.iter.consume = function(iterable, count) {
	for (var iterator = goog.iter.toIterator(iterable);0 < count--;) {
		goog.iter.nextOrValue(iterator, null);
	}
	return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
	var iterator = goog.iter.consume(iterable, start);
	goog.isNumber(opt_end) && (iterator = goog.iter.limit(iterator, opt_end - start));
	return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
	var deduped = [];
	goog.array.removeDuplicates(arr, deduped);
	return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
	var elements = goog.iter.toArray(iterable), length = goog.isNumber(opt_length) ? opt_length : elements.length, sets = goog.array.repeat(elements, length), product = goog.iter.product.apply(void 0, sets);
	return goog.iter.filter(product, function(arr) {
		return!goog.iter.hasDuplicates_(arr);
	});
};
goog.iter.combinations = function(iterable, length) {
	function getIndexFromElements(index) {
		return elements[index];
	}
	var elements = goog.iter.toArray(iterable), indexes = goog.iter.range(elements.length), indexIterator = goog.iter.permutations(indexes, length), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
		return goog.array.isSorted(arr);
	}), iter = new goog.iter.Iterator;
	iter.next = function() {
		return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
	};
	return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
	function getIndexFromElements(index) {
		return elements[index];
	}
	var elements = goog.iter.toArray(iterable), indexes = goog.array.range(elements.length), sets = goog.array.repeat(indexes, length), indexIterator = goog.iter.product.apply(void 0, sets), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
		return goog.array.isSorted(arr);
	}), iter = new goog.iter.Iterator;
	iter.next = function() {
		return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
	};
	return iter;
};
goog.object = {};
goog.object.forEach = function(obj, f, opt_obj) {
	for (var key in obj) {
		f.call(opt_obj, obj[key], key, obj);
	}
};
goog.object.filter = function(obj, f, opt_obj) {
	var res = {}, key;
	for (key in obj) {
		f.call(opt_obj, obj[key], key, obj) && (res[key] = obj[key]);
	}
	return res;
};
goog.object.map = function(obj, f, opt_obj) {
	var res = {}, key;
	for (key in obj) {
		res[key] = f.call(opt_obj, obj[key], key, obj);
	}
	return res;
};
goog.object.some = function(obj, f, opt_obj) {
	for (var key in obj) {
		if (f.call(opt_obj, obj[key], key, obj)) {
			return!0;
		}
	}
	return!1;
};
goog.object.every = function(obj, f, opt_obj) {
	for (var key in obj) {
		if (!f.call(opt_obj, obj[key], key, obj)) {
			return!1;
		}
	}
	return!0;
};
goog.object.getCount = function(obj) {
	var rv = 0, key;
	for (key in obj) {
		rv++;
	}
	return rv;
};
goog.object.getAnyKey = function(obj) {
	for (var key in obj) {
		return key;
	}
};
goog.object.getAnyValue = function(obj) {
	for (var key in obj) {
		return obj[key];
	}
};
goog.object.contains = function(obj, val) {
	return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
	var res = [], i = 0, key;
	for (key in obj) {
		res[i++] = obj[key];
	}
	return res;
};
goog.object.getKeys = function(obj) {
	var res = [], i = 0, key;
	for (key in obj) {
		res[i++] = key;
	}
	return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
	for (var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments, i = isArrayLike ? 0 : 1;i < keys.length && (obj = obj[keys[i]], goog.isDef(obj));i++) {
	}
	return obj;
};
goog.object.containsKey = function(obj, key) {
	return key in obj;
};
goog.object.containsValue = function(obj, val) {
	for (var key in obj) {
		if (obj[key] == val) {
			return!0;
		}
	}
	return!1;
};
goog.object.findKey = function(obj, f, opt_this) {
	for (var key in obj) {
		if (f.call(opt_this, obj[key], key, obj)) {
			return key;
		}
	}
};
goog.object.findValue = function(obj, f, opt_this) {
	var key = goog.object.findKey(obj, f, opt_this);
	return key && obj[key];
};
goog.object.isEmpty = function(obj) {
	for (var key in obj) {
		return!1;
	}
	return!0;
};
goog.object.clear = function(obj) {
	for (var i in obj) {
		delete obj[i];
	}
};
goog.object.remove = function(obj, key) {
	var rv;
	(rv = key in obj) && delete obj[key];
	return rv;
};
goog.object.add = function(obj, key, val) {
	if (key in obj) {
		throw Error('The object already contains the key "' + key + '"');
	}
	goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
	return key in obj ? obj[key] : opt_val;
};
goog.object.set = function(obj, key, value) {
	obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
	return key in obj ? obj[key] : obj[key] = value;
};
goog.object.clone = function(obj) {
	var res = {}, key;
	for (key in obj) {
		res[key] = obj[key];
	}
	return res;
};
goog.object.unsafeClone = function(obj) {
	var type = goog.typeOf(obj);
	if ("object" == type || "array" == type) {
		if (obj.clone) {
			return obj.clone();
		}
		var clone = "array" == type ? [] : {}, key;
		for (key in obj) {
			clone[key] = goog.object.unsafeClone(obj[key]);
		}
		return clone;
	}
	return obj;
};
goog.object.transpose = function(obj) {
	var transposed = {}, key;
	for (key in obj) {
		transposed[obj[key]] = key;
	}
	return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(target, var_args) {
	for (var key, source, i = 1;i < arguments.length;i++) {
		source = arguments[i];
		for (key in source) {
			target[key] = source[key];
		}
		for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
			key = goog.object.PROTOTYPE_FIELDS_[j], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
		}
	}
};
goog.object.create = function(var_args) {
	var argLength = arguments.length;
	if (1 == argLength && goog.isArray(arguments[0])) {
		return goog.object.create.apply(null, arguments[0]);
	}
	if (argLength % 2) {
		throw Error("Uneven number of arguments");
	}
	for (var rv = {}, i = 0;i < argLength;i += 2) {
		rv[arguments[i]] = arguments[i + 1];
	}
	return rv;
};
goog.object.createSet = function(var_args) {
	var argLength = arguments.length;
	if (1 == argLength && goog.isArray(arguments[0])) {
		return goog.object.createSet.apply(null, arguments[0]);
	}
	for (var rv = {}, i = 0;i < argLength;i++) {
		rv[arguments[i]] = !0;
	}
	return rv;
};
goog.object.createImmutableView = function(obj) {
	var result = obj;
	Object.isFrozen && !Object.isFrozen(obj) && (result = Object.create(obj), Object.freeze(result));
	return result;
};
goog.object.isImmutableView = function(obj) {
	return!!Object.isFrozen && Object.isFrozen(obj);
};
goog.structs.Map = function(opt_map, var_args) {
	this.map_ = {};
	this.keys_ = [];
	this.version_ = this.count_ = 0;
	var argLength = arguments.length;
	if (1 < argLength) {
		if (argLength % 2) {
			throw Error("Uneven number of arguments");
		}
		for (var i = 0;i < argLength;i += 2) {
			this.set(arguments[i], arguments[i + 1]);
		}
	} else {
		opt_map && this.addAll(opt_map);
	}
};
goog.structs.Map.prototype.getCount = function() {
	return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
	this.cleanupKeysArray_();
	for (var rv = [], i = 0;i < this.keys_.length;i++) {
		rv.push(this.map_[this.keys_[i]]);
	}
	return rv;
};
goog.structs.Map.prototype.getKeys = function() {
	this.cleanupKeysArray_();
	return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(key) {
	return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
	for (var i = 0;i < this.keys_.length;i++) {
		var key = this.keys_[i];
		if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
			return!0;
		}
	}
	return!1;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
	if (this === otherMap) {
		return!0;
	}
	if (this.count_ != otherMap.getCount()) {
		return!1;
	}
	var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
	this.cleanupKeysArray_();
	for (var key, i = 0;key = this.keys_[i];i++) {
		if (!equalityFn(this.get(key), otherMap.get(key))) {
			return!1;
		}
	}
	return!0;
};
goog.structs.Map.defaultEquals = function(a, b) {
	return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
	return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
	this.map_ = {};
	this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(key) {
	return goog.structs.Map.hasKey_(this.map_, key) ? (delete this.map_[key], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
	if (this.count_ != this.keys_.length) {
		for (var srcIndex = 0, destIndex = 0;srcIndex < this.keys_.length;) {
			var key = this.keys_[srcIndex];
			goog.structs.Map.hasKey_(this.map_, key) && (this.keys_[destIndex++] = key);
			srcIndex++;
		}
		this.keys_.length = destIndex;
	}
	if (this.count_ != this.keys_.length) {
		for (var seen = {}, destIndex = srcIndex = 0;srcIndex < this.keys_.length;) {
			key = this.keys_[srcIndex], goog.structs.Map.hasKey_(seen, key) || (this.keys_[destIndex++] = key, seen[key] = 1), srcIndex++;
		}
		this.keys_.length = destIndex;
	}
};
goog.structs.Map.prototype.get = function(key, opt_val) {
	return goog.structs.Map.hasKey_(this.map_, key) ? this.map_[key] : opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
	goog.structs.Map.hasKey_(this.map_, key) || (this.count_++, this.keys_.push(key), this.version_++);
	this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
	var keys, values;
	map instanceof goog.structs.Map ? (keys = map.getKeys(), values = map.getValues()) : (keys = goog.object.getKeys(map), values = goog.object.getValues(map));
	for (var i = 0;i < keys.length;i++) {
		this.set(keys[i], values[i]);
	}
};
goog.structs.Map.prototype.clone = function() {
	return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
	for (var transposed = new goog.structs.Map, i = 0;i < this.keys_.length;i++) {
		var key = this.keys_[i];
		transposed.set(this.map_[key], key);
	}
	return transposed;
};
goog.structs.Map.prototype.toObject = function() {
	this.cleanupKeysArray_();
	for (var obj = {}, i = 0;i < this.keys_.length;i++) {
		var key = this.keys_[i];
		obj[key] = this.map_[key];
	}
	return obj;
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
	this.cleanupKeysArray_();
	var i = 0, keys = this.keys_, map = this.map_, version = this.version_, selfObj = this, newIter = new goog.iter.Iterator;
	newIter.next = function() {
		for (;;) {
			if (version != selfObj.version_) {
				throw Error("The map has changed since the iterator was created");
			}
			if (i >= keys.length) {
				throw goog.iter.StopIteration;
			}
			var key = keys[i++];
			return opt_keys ? key : map[key];
		}
	};
	return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
};
goog.structs.getCount = function(col) {
	return "function" == typeof col.getCount ? col.getCount() : goog.isArrayLike(col) || goog.isString(col) ? col.length : goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
	if ("function" == typeof col.getValues) {
		return col.getValues();
	}
	if (goog.isString(col)) {
		return col.split("");
	}
	if (goog.isArrayLike(col)) {
		for (var rv = [], l = col.length, i = 0;i < l;i++) {
			rv.push(col[i]);
		}
		return rv;
	}
	return goog.object.getValues(col);
};
goog.structs.getKeys = function(col) {
	if ("function" == typeof col.getKeys) {
		return col.getKeys();
	}
	if ("function" != typeof col.getValues) {
		if (goog.isArrayLike(col) || goog.isString(col)) {
			for (var rv = [], l = col.length, i = 0;i < l;i++) {
				rv.push(i);
			}
			return rv;
		}
		return goog.object.getKeys(col);
	}
};
goog.structs.contains = function(col, val) {
	return "function" == typeof col.contains ? col.contains(val) : "function" == typeof col.containsValue ? col.containsValue(val) : goog.isArrayLike(col) || goog.isString(col) ? goog.array.contains(col, val) : goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
	return "function" == typeof col.isEmpty ? col.isEmpty() : goog.isArrayLike(col) || goog.isString(col) ? goog.array.isEmpty(col) : goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
	"function" == typeof col.clear ? col.clear() : goog.isArrayLike(col) ? goog.array.clear(col) : goog.object.clear(col);
};
goog.structs.forEach = function(col, f, opt_obj) {
	if ("function" == typeof col.forEach) {
		col.forEach(f, opt_obj);
	} else {
		if (goog.isArrayLike(col) || goog.isString(col)) {
			goog.array.forEach(col, f, opt_obj);
		} else {
			for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
				f.call(opt_obj, values[i], keys && keys[i], col);
			}
		}
	}
};
goog.structs.filter = function(col, f, opt_obj) {
	if ("function" == typeof col.filter) {
		return col.filter(f, opt_obj);
	}
	if (goog.isArrayLike(col) || goog.isString(col)) {
		return goog.array.filter(col, f, opt_obj);
	}
	var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
	if (keys) {
		rv = {};
		for (var i = 0;i < l;i++) {
			f.call(opt_obj, values[i], keys[i], col) && (rv[keys[i]] = values[i]);
		}
	} else {
		for (rv = [], i = 0;i < l;i++) {
			f.call(opt_obj, values[i], void 0, col) && rv.push(values[i]);
		}
	}
	return rv;
};
goog.structs.map = function(col, f, opt_obj) {
	if ("function" == typeof col.map) {
		return col.map(f, opt_obj);
	}
	if (goog.isArrayLike(col) || goog.isString(col)) {
		return goog.array.map(col, f, opt_obj);
	}
	var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
	if (keys) {
		rv = {};
		for (var i = 0;i < l;i++) {
			rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
		}
	} else {
		for (rv = [], i = 0;i < l;i++) {
			rv[i] = f.call(opt_obj, values[i], void 0, col);
		}
	}
	return rv;
};
goog.structs.some = function(col, f, opt_obj) {
	if ("function" == typeof col.some) {
		return col.some(f, opt_obj);
	}
	if (goog.isArrayLike(col) || goog.isString(col)) {
		return goog.array.some(col, f, opt_obj);
	}
	for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
		if (f.call(opt_obj, values[i], keys && keys[i], col)) {
			return!0;
		}
	}
	return!1;
};
goog.structs.every = function(col, f, opt_obj) {
	if ("function" == typeof col.every) {
		return col.every(f, opt_obj);
	}
	if (goog.isArrayLike(col) || goog.isString(col)) {
		return goog.array.every(col, f, opt_obj);
	}
	for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
		if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
			return!1;
		}
	}
	return!0;
};
goog.structs.Set = function(opt_values) {
	this.map_ = new goog.structs.Map;
	opt_values && this.addAll(opt_values);
};
goog.structs.Set.getKey_ = function(val) {
	var type = typeof val;
	return "object" == type && val || "function" == type ? "o" + goog.getUid(val) : type.substr(0, 1) + val;
};
goog.structs.Set.prototype.getCount = function() {
	return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(element) {
	this.map_.set(goog.structs.Set.getKey_(element), element);
};
goog.structs.Set.prototype.addAll = function(col) {
	for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
		this.add(values[i]);
	}
};
goog.structs.Set.prototype.removeAll = function(col) {
	for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
		this.remove(values[i]);
	}
};
goog.structs.Set.prototype.remove = function(element) {
	return this.map_.remove(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.clear = function() {
	this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
	return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(element) {
	return this.map_.containsKey(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.getValues = function() {
	return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
	return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(col) {
	return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
	var colCount = goog.structs.getCount(col);
	if (this.getCount() > colCount) {
		return!1;
	}
	!(col instanceof goog.structs.Set) && 5 < colCount && (col = new goog.structs.Set(col));
	return goog.structs.every(this, function(value) {
		return goog.structs.contains(col, value);
	});
};
goog.structs.Set.prototype.__iterator__ = function() {
	return this.map_.__iterator__(!1);
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
	return goog.global.navigator ? goog.global.navigator.userAgent : null;
};
goog.userAgent.getNavigator = function() {
	return goog.global.navigator;
};
goog.userAgent.init_ = function() {
	goog.userAgent.detectedOpera_ = !1;
	goog.userAgent.detectedIe_ = !1;
	goog.userAgent.detectedWebkit_ = !1;
	goog.userAgent.detectedMobile_ = !1;
	goog.userAgent.detectedGecko_ = !1;
	var ua;
	if (!goog.userAgent.BROWSER_KNOWN_ && (ua = goog.userAgent.getUserAgentString())) {
		var navigator = goog.userAgent.getNavigator();
		goog.userAgent.detectedOpera_ = goog.string.startsWith(ua, "Opera");
		goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && (goog.string.contains(ua, "MSIE") || goog.string.contains(ua, "Trident"));
		goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && goog.string.contains(ua, "WebKit");
		goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && goog.string.contains(ua, "Mobile");
		goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && !goog.userAgent.detectedIe_ && "Gecko" == navigator.product;
	}
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
	var navigator = goog.userAgent.getNavigator();
	return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
	goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
	goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
	goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
	goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
	var ua = goog.userAgent.getUserAgentString();
	goog.userAgent.detectedAndroid_ = !!ua && goog.string.contains(ua, "Android");
	goog.userAgent.detectedIPhone_ = !!ua && goog.string.contains(ua, "iPhone");
	goog.userAgent.detectedIPad_ = !!ua && goog.string.contains(ua, "iPad");
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
	var version = "", re;
	if (goog.userAgent.OPERA && goog.global.opera) {
		var operaVersion = goog.global.opera.version, version = "function" == typeof operaVersion ? operaVersion() : operaVersion
	} else {
		if (goog.userAgent.GECKO ? re = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (re = /WebKit\/(\S+)/), re) {
			var arr = re.exec(goog.userAgent.getUserAgentString()), version = arr ? arr[1] : ""
		}
	}
	if (goog.userAgent.IE) {
		var docMode = goog.userAgent.getDocumentMode_();
		if (docMode > parseFloat(version)) {
			return String(docMode);
		}
	}
	return version;
};
goog.userAgent.getDocumentMode_ = function() {
	var doc = goog.global.document;
	return doc ? doc.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
	return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
	return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, version));
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
	return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
var doc$$inline_1 = goog.global.document;
goog.userAgent.DOCUMENT_MODE = doc$$inline_1 && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == doc$$inline_1.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0;
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
	var target = opt_target || goog.global, oldErrorHandler = target.onerror, retVal = !!opt_cancel;
	goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (retVal = !retVal);
	target.onerror = function(message, url, line, opt_col, opt_error) {
		oldErrorHandler && oldErrorHandler(message, url, line, opt_col, opt_error);
		logFunc({message:message, fileName:url, line:line, col:opt_col, error:opt_error});
		return retVal;
	};
};
goog.debug.expose = function(obj, opt_showFn) {
	if ("undefined" == typeof obj) {
		return "undefined";
	}
	if (null == obj) {
		return "NULL";
	}
	var str = [], x;
	for (x in obj) {
		if (opt_showFn || !goog.isFunction(obj[x])) {
			var s = x + " = ";
			try {
				s += obj[x];
			} catch (e) {
				s += "*** " + e + " ***";
			}
			str.push(s);
		}
	}
	return str.join("\n");
};
goog.debug.deepExpose = function(obj$$0, opt_showFn) {
	var previous = new goog.structs.Set, str = [], helper = function(obj, space) {
		var nestspace = space + "  ";
		try {
			if (goog.isDef(obj)) {
				if (goog.isNull(obj)) {
					str.push("NULL");
				} else {
					if (goog.isString(obj)) {
						str.push('"' + obj.replace(/\n/g, "\n" + space) + '"');
					} else {
						if (goog.isFunction(obj)) {
							str.push(String(obj).replace(/\n/g, "\n" + space));
						} else {
							if (goog.isObject(obj)) {
								if (previous.contains(obj)) {
									str.push("*** reference loop detected ***");
								} else {
									previous.add(obj);
									str.push("{");
									for (var x in obj) {
										if (opt_showFn || !goog.isFunction(obj[x])) {
											str.push("\n"), str.push(nestspace), str.push(x + " = "), helper(obj[x], nestspace);
										}
									}
									str.push("\n" + space + "}");
								}
							} else {
								str.push(obj);
							}
						}
					}
				}
			} else {
				str.push("undefined");
			}
		} catch (e) {
			str.push("*** " + e + " ***");
		}
	};
	helper(obj$$0, "");
	return str.join("");
};
goog.debug.exposeArray = function(arr) {
	for (var str = [], i = 0;i < arr.length;i++) {
		goog.isArray(arr[i]) ? str.push(goog.debug.exposeArray(arr[i])) : str.push(arr[i]);
	}
	return "[ " + str.join(", ") + " ]";
};
goog.debug.exposeException = function(err, opt_fn) {
	try {
		var e = goog.debug.normalizeErrorObject(err);
		return "Message: " + goog.string.htmlEscape(e.message) + '\nUrl: <a href="view-source:' + e.fileName + '" target="_new">' + e.fileName + "</a>\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(e.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(opt_fn) + "-> ");
	} catch (e2) {
		return "Exception trying to expose exception! You win, we lose. " + e2;
	}
};
goog.debug.normalizeErrorObject = function(err) {
	var href = goog.getObjectByName("window.location.href");
	if (goog.isString(err)) {
		return{message:err, name:"Unknown error", lineNumber:"Not available", fileName:href, stack:"Not available"};
	}
	var lineNumber, fileName, threwError = !1;
	try {
		lineNumber = err.lineNumber || err.line || "Not available";
	} catch (e) {
		lineNumber = "Not available", threwError = !0;
	}
	try {
		fileName = err.fileName || err.filename || err.sourceURL || goog.global.$googDebugFname || href;
	} catch (e$$0) {
		fileName = "Not available", threwError = !0;
	}
	return!threwError && err.lineNumber && err.fileName && err.stack && err.message && err.name ? err : {message:err.message || "Not available", name:err.name || "UnknownError", lineNumber:lineNumber, fileName:fileName, stack:err.stack || "Not available"};
};
goog.debug.enhanceError = function(err, opt_message) {
	var error = "string" == typeof err ? Error(err) : err;
	error.stack || (error.stack = goog.debug.getStacktrace(arguments.callee.caller));
	if (opt_message) {
		for (var x = 0;error["message" + x];) {
			++x;
		}
		error["message" + x] = String(opt_message);
	}
	return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
	for (var sb = [], fn = arguments.callee.caller, depth = 0;fn && (!opt_depth || depth < opt_depth);) {
		sb.push(goog.debug.getFunctionName(fn));
		sb.push("()\n");
		try {
			fn = fn.caller;
		} catch (e) {
			sb.push("[exception trying to get caller]\n");
			break;
		}
		depth++;
		if (depth >= goog.debug.MAX_STACK_DEPTH) {
			sb.push("[...long stack...]");
			break;
		}
	}
	opt_depth && depth >= opt_depth ? sb.push("[...reached max depth limit...]") : sb.push("[end]");
	return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(opt_fn) {
	return goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, []);
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
	var sb = [];
	if (goog.array.contains(visited, fn)) {
		sb.push("[...circular reference...]");
	} else {
		if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
			sb.push(goog.debug.getFunctionName(fn) + "(");
			for (var args = fn.arguments, i = 0;i < args.length;i++) {
				0 < i && sb.push(", ");
				var argDesc, arg = args[i];
				switch(typeof arg) {
					case "object":
						argDesc = arg ? "object" : "null";
						break;
					case "string":
						argDesc = arg;
						break;
					case "number":
						argDesc = String(arg);
						break;
					case "boolean":
						argDesc = arg ? "true" : "false";
						break;
					case "function":
						argDesc = (argDesc = goog.debug.getFunctionName(arg)) ? argDesc : "[fn]";
						break;
					default:
						argDesc = typeof arg;
				}
				40 < argDesc.length && (argDesc = argDesc.substr(0, 40) + "...");
				sb.push(argDesc);
			}
			visited.push(fn);
			sb.push(")\n");
			try {
				sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
			} catch (e) {
				sb.push("[exception trying to get caller]\n");
			}
		} else {
			fn ? sb.push("[...long stack...]") : sb.push("[end]");
		}
	}
	return sb.join("");
};
goog.debug.setFunctionResolver = function(resolver) {
	goog.debug.fnNameResolver_ = resolver;
};
goog.debug.getFunctionName = function(fn) {
	if (goog.debug.fnNameCache_[fn]) {
		return goog.debug.fnNameCache_[fn];
	}
	if (goog.debug.fnNameResolver_) {
		var name = goog.debug.fnNameResolver_(fn);
		if (name) {
			return goog.debug.fnNameCache_[fn] = name;
		}
	}
	var functionSource = String(fn);
	if (!goog.debug.fnNameCache_[functionSource]) {
		var matches = /function ([^\(]+)/.exec(functionSource);
		goog.debug.fnNameCache_[functionSource] = matches ? matches[1] : "[Anonymous]";
	}
	return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
	return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
	this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
};
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
	goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && ("number" == typeof opt_sequenceNumber || goog.debug.LogRecord.nextSequenceNumber_++);
	opt_time || goog.now();
	this.level_ = level;
	this.msg_ = msg;
	delete this.exception_;
	delete this.exceptionText_;
};
goog.debug.LogRecord.prototype.setException = function(exception) {
	this.exception_ = exception;
};
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
	this.exceptionText_ = text;
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
	this.level_ = level;
};
goog.debug.LogRecord.prototype.getMessage = function() {
	return this.msg_;
};
goog.debug.LogBuffer = function() {
	this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
	goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
	return goog.debug.LogBuffer.instance_;
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
	var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
	this.curIndex_ = curIndex;
	if (this.isFull_) {
		var ret = this.buffer_[curIndex];
		ret.reset(level, msg, loggerName);
		return ret;
	}
	this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
	return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
	return 0 < goog.debug.LogBuffer.CAPACITY;
};
goog.debug.LogBuffer.prototype.clear = function() {
	this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
	this.curIndex_ = -1;
	this.isFull_ = !1;
};
goog.debug.Logger = function(name) {
	this.name_ = name;
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(name, value) {
	this.name = name;
	this.value = value;
};
goog.debug.Logger.Level.prototype.toString = function() {
	return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
	goog.debug.Logger.Level.predefinedLevelsCache_ = {};
	for (var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
		goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level, goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
	}
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
	goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
	return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
	goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
	if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
		return goog.debug.Logger.Level.predefinedLevelsCache_[value];
	}
	for (var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
		var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
		if (level.value <= value) {
			return level;
		}
	}
	return null;
};
goog.debug.Logger.getLogger = function(name) {
	return goog.debug.LogManager.getLogger(name);
};
goog.debug.Logger.logToProfilers = function(msg) {
	goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(msg) : goog.global.console.markTimeline && goog.global.console.markTimeline(msg));
	goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(msg);
};
goog.debug.Logger.prototype.getName = function() {
	return this.name_;
};
goog.debug.Logger.prototype.getParent = function() {
	return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
	this.children_ || (this.children_ = {});
	return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(level) {
	goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = level : goog.debug.Logger.rootLevel_ = level);
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
	if (!goog.debug.LOGGING_ENABLED) {
		return goog.debug.Logger.Level.OFF;
	}
	if (!goog.debug.Logger.ENABLE_HIERARCHY) {
		return goog.debug.Logger.rootLevel_;
	}
	if (this.level_) {
		return this.level_;
	}
	if (this.parent_) {
		return this.parent_.getEffectiveLevel();
	}
	goog.asserts.fail("Root logger has no level set.");
	return null;
};
goog.debug.Logger.prototype.isLoggable = function(level) {
	return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
	goog.debug.LOGGING_ENABLED && this.isLoggable(level) && (goog.isFunction(msg) && (msg = msg()), this.doLogRecord_(this.getLogRecord(level, msg, opt_exception)));
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception) {
	var logRecord = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_) : new goog.debug.LogRecord(level, String(msg), this.name_);
	opt_exception && (logRecord.setException(opt_exception), logRecord.setExceptionText(goog.debug.exposeException(opt_exception, arguments.callee.caller)));
	return logRecord;
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
	goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
	goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
	goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
	goog.debug.Logger.logToProfilers("log:" + logRecord.getMessage());
	if (goog.debug.Logger.ENABLE_HIERARCHY) {
		for (var target = this;target;) {
			target.callPublish_(logRecord), target = target.getParent();
		}
	} else {
		for (var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
			handler(logRecord);
		}
	}
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
	if (this.handlers_) {
		for (var i = 0, handler;handler = this.handlers_[i];i++) {
			handler(logRecord);
		}
	}
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
	this.parent_ = parent;
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
	this.getChildren()[name] = logger;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
	goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(""), goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG));
};
goog.debug.LogManager.getLoggers = function() {
	return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
	goog.debug.LogManager.initialize();
	return goog.debug.LogManager.rootLogger_;
};
goog.debug.LogManager.getLogger = function(name) {
	goog.debug.LogManager.initialize();
	return goog.debug.LogManager.loggers_[name] || goog.debug.LogManager.createLogger_(name);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
	return function(info) {
		(opt_logger || goog.debug.LogManager.getRoot()).severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")");
	};
};
goog.debug.LogManager.createLogger_ = function(name) {
	var logger = new goog.debug.Logger(name);
	if (goog.debug.Logger.ENABLE_HIERARCHY) {
		var lastDotIndex = name.lastIndexOf("."), leafName = name.substr(lastDotIndex + 1), parentLogger = goog.debug.LogManager.getLogger(name.substr(0, lastDotIndex));
		parentLogger.addChild_(leafName, logger);
		logger.setParent_(parentLogger);
	}
	return goog.debug.LogManager.loggers_[name] = logger;
};
castv2.XssUtils = {};
castv2.XssUtils.sanitize = function(str, opt_maxLength) {
	if (!str) {
		return str;
	}
	opt_maxLength && (str = goog.string.truncate(str, opt_maxLength));
	return goog.string.htmlEscape(str);
};
castv2.XssUtils.unsanitize = function(str) {
	return goog.string.unescapeEntities(str);
};
var cloudview = {webrtc:{}};
cloudview.webrtc.CaptureSurfaceType = {TAB:"tab", DESKTOP:"desktop"};
cloudview.webrtc.MirroringQualityLevel = function(id, name, videoWidth, videoHeight, minVideoBitrate, maxVideoBitrate, videoQuality, audioBitrate) {
	this.id = id;
	this.name = name;
	this.videoWidth = videoWidth;
	this.videoHeight = videoHeight;
	this.videoResolution = videoWidth + "x" + videoHeight;
	this.minVideoBitrate = minVideoBitrate;
	this.maxVideoBitrate = maxVideoBitrate;
	this.videoQuality = videoQuality;
	this.audioBitrate = audioBitrate;
};
cloudview.webrtc.MirroringQualityLevel.HIGH = new cloudview.webrtc.MirroringQualityLevel("high", "High (720p)", 1280, 720, 2E3, 2500, 56, 128);
cloudview.webrtc.MirroringQualityLevel.LOW = new cloudview.webrtc.MirroringQualityLevel("low", "Standard (480p)", 854, 480, 750, 1500, 56, 128);
cloudview.webrtc.MirroringQualityLevel.HIGHEST = new cloudview.webrtc.MirroringQualityLevel("highest", "Extreme (720p high bitrate)", 1280, 720, 4E3, 5E3, 56, 128);
cloudview.webrtc.MirroringQualityLevel.DEFAULT = cloudview.webrtc.MirroringQualityLevel.HIGH;
cloudview.webrtc.MirroringQualityLevel.MIRRORING_QUALITY_LEVELS = [cloudview.webrtc.MirroringQualityLevel.HIGHEST, cloudview.webrtc.MirroringQualityLevel.HIGH, cloudview.webrtc.MirroringQualityLevel.LOW];
cloudview.webrtc.MirroringQualityLevel.CUSTOM_ID = "custom";
cloudview.webrtc.MirroringQualityLevel.getLevelById = function(mirrorQualityId) {
	return goog.array.find(cloudview.webrtc.MirroringQualityLevel.MIRRORING_QUALITY_LEVELS, function(q) {
		return q.id == mirrorQualityId;
	});
};
castv2.popup = {};
castv2.popup.IssueSeverity = {FATAL:"fatal", WARNING:"warning"};
castv2.popup.RequestType = {ACT_ON_ISSUE:"act_on_issue", STOP_ACTIVITY:"stop_activity", PLAY_MEDIA:"play_media", PAUSE_MEDIA:"pause_media", SET_MEDIA_VOLUME:"set_media_volume", CAST_THIS_TAB:"cast_this_tab", LAUNCH_DESKTOP_MIRROR:"launch_desktop_mirror", INIT:"init", UPDATE_SETTINGS:"update_settings"};
castv2.popup.EventTypeToPopup = {MODEL_UPDATE:"model_update"};
castv2.popup.Message = function(type, message) {
	this.type = type;
	this.message = message;
};
castv2.popup.Activity = function(id, receiver, iconUrl, title, isInLaunch, mediaPlayerStatus, tabId, isLocal, isMirror) {
	this.id = id;
	this.receiver = new castv2.popup.Receiver(receiver.id, castv2.XssUtils.unsanitize(receiver.name));
	this.iconUrl = iconUrl || null;
	this.title = title || "";
	this.isInLaunch = isInLaunch;
	this.mediaPlayerStatus = mediaPlayerStatus || null;
	this.tabId = tabId || null;
	this.isLocal = isLocal;
	this.isMirror = isMirror;
};
castv2.popup.Receiver = function(id, name) {
	this.id = id;
	this.name = name;
};
castv2.popup.Issue = function(id, title, message, defaultActionText, optActionText, opt_severity, opt_activityId) {
	this.id = id;
	this.title = title;
	this.message = message;
	this.defaultActionText = defaultActionText;
	this.optActionText = optActionText || "";
	this.severity = opt_severity || castv2.popup.IssueSeverity.FATAL;
	this.activityId = opt_activityId || null;
};
castv2.popup.ReceiverAndActivity = function(receiver, activity) {
	this.receiver = new castv2.popup.Receiver(receiver.id, castv2.XssUtils.unsanitize(receiver.name));
	this.activity = activity;
};
castv2.popup.ActOnIssueRequest = function(id, isDefaultAction) {
	this.id = id;
	this.isDefaultAction = isDefaultAction;
};
castv2.popup.Settings = function(captureSurface, opt_lowFpsMode, opt_castAppNotificationDismissed, opt_mirrorQualityId) {
	this.captureSurface = captureSurface || cloudview.webrtc.CaptureSurfaceType.TAB;
	this.lowFpsMode = opt_lowFpsMode || !1;
	this.castAppNotificationDismissed = opt_castAppNotificationDismissed || !1;
	this.mirrorQualityId = opt_mirrorQualityId || cloudview.webrtc.MirroringQualityLevel.DEFAULT.id;
};
castv2.popup.Model = function(receiverActs, issue, castOfCurrentTab, settings, isAppInTab) {
	this.receiverActs = receiverActs || [];
	this.issue = issue;
	this.isAppInTab = isAppInTab || !1;
	this.castOfCurrentTab = castOfCurrentTab;
	this.settings = settings || new castv2.popup.Settings(cloudview.webrtc.CaptureSurfaceType.TAB);
};
castv2.popup.MediaPlayerStatus = function() {
	this.timeProgress = !1;
	this.muted = null;
	this.hasPause = !0;
};
castv2.Receiver = function(ipAddress, friendlyName, uniqueId, url, opt_id) {
	this.friendlyName_ = friendlyName;
	this.uniqueId_ = uniqueId;
	this.url_ = url;
	this.isDebug_ = this.isInactive_ = !1;
	this.id_ = opt_id || "receiver.v2." + goog.string.hashCode(uniqueId);
};
castv2.Receiver.createFromMdnsService = function(service) {
	var uniqueId = goog.array.find(service.serviceData, function(e) {
		return goog.string.startsWith(e, "id=");
	}), index = service.serviceName.indexOf("._googlecast.");
	if (!uniqueId || -1 == index) {
		return null;
	}
	var port = service.serviceHostPort.substring(service.serviceHostPort.indexOf(":") + 1), name = service.serviceName.substring(0, index), uniqueId = uniqueId.substring(3);
	return new castv2.Receiver(service.ipAddress, name, uniqueId, "casts://" + service.ipAddress + ":" + port);
};
castv2.Receiver.prototype.isLocal = function() {
	return!0;
};
castv2.Receiver.prototype.getId = function() {
	return this.id_;
};
castv2.Receiver.prototype.getFriendlyName = function() {
	return this.friendlyName_;
};
castv2.Receiver.prototype.equals = function(receiver) {
	return receiver instanceof castv2.Receiver ? this.uniqueId_ == receiver.uniqueId_ && this.friendlyName_ == receiver.friendlyName_ && this.isInactive_ == receiver.isInactive_ && this.url_ == receiver.url_ && this.isDebug_ == receiver.isDebug_ : !1;
};
castv2.ApiDataUtils = {};
castv2.ApiDataUtils.getSessionFromReceiverStatus = function(receiver, receiverStatus) {
	return receiverStatus.applications && 1 == receiverStatus.applications.length ? castv2.ApiDataUtils.getSessionFrom(receiver, receiverStatus.applications[0]) : null;
};
castv2.ApiDataUtils.getSessionFrom = function(receiver, app) {
	var session = new chrome.cast.Session(app.sessionId, app.appId, app.displayName, app.appImages, castv2.ApiDataUtils.getReceiverFrom(receiver));
	session.senderApps = app.senderApps;
	session.namespaces = app.namespaces;
	return session;
};
castv2.ApiDataUtils.getReceiverFrom = function(receiver) {
	return new chrome.cast.Receiver(receiver.getId(), receiver.getFriendlyName(), chrome.cast.ReceiverType.CAST, [chrome.cast.Capability.VIDEO_OUT, chrome.cast.Capability.AUDIO_OUT], new chrome.cast.Volume);
};
castv2.ApiDataUtils.createSessionFromDictionary = function(session) {
	if (!session) {
		return null;
	}
	var newSession = new chrome.cast.Session(session.sessionId, session.appId, session.displayName, session.appImages, session.receiver), key;
	for (key in session) {
		session.hasOwnProperty(key) && (newSession[key] = session[key]);
	}
	return newSession;
};
castv2.ApiDataUtils.createMediaFromDictionary = function(media) {
	if (!media) {
		return null;
	}
	var newMedia = new chrome.cast.media.Media(media.mediaSessionId), key;
	for (key in media) {
		media.hasOwnProperty(key) && (newMedia[key] = media[key]);
	}
	return newMedia;
};
castv2.ApiDataUtils.isSessionStatusChanged = function(session1, session2) {
	if (session1.statusText != session2.statusText) {
		return!0;
	}
	for (var namespaces1 = session1.namespaces || [], namespaces2 = session2.namespaces || [], index = 0;index < namespaces1.length;index++) {
		if (0 > namespaces2.indexOf(namespaces1[index])) {
			return!0;
		}
	}
	return JSON.stringify(session1.customData) != JSON.stringify(session2.customData);
};
castv2.ApiObjectValidator = {};
castv2.ApiObjectValidator.checkMediaLoadRequest = function(request) {
	return!request || !goog.isString(request.sessionId) || !goog.isDefAndNotNull(request.media) || goog.isDefAndNotNull(request.autoplay) && !goog.isBoolean(request.autoplay) || goog.isDefAndNotNull(request.currentTime) && !goog.isNumber(request.currentTime) ? !1 : castv2.ApiObjectValidator.checkMediaInfo(request.media);
};
castv2.ApiObjectValidator.checkMediaInfo = function(info) {
	return!info || !goog.isString(info.contentId) || 1E3 < info.contentId.length || !goog.object.containsValue(chrome.cast.media.StreamType, info.streamType) || !goog.isString(info.contentType) || goog.isDefAndNotNull(info.duration) && !goog.isNumber(info.duration) ? !1 : !0;
};
castv2.ApiObjectValidator.checkAppMessage = function(message) {
	return!!message && goog.isDefAndNotNull(message.sessionId) && goog.isDefAndNotNull(message.namespaceName) && !castv2.Namespace.isCastNamespace(message.namespaceName);
};
castv2.ApiObjectValidator.checkApiConfig = function(config) {
	return config && goog.isFunction(config.sessionListener) && goog.isFunction(config.receiverListener) ? castv2.ApiObjectValidator.checkSessonRequest(config.sessionRequest) : !1;
};
castv2.ApiObjectValidator.checkSessonRequest = function(request) {
	if (!request) {
		return!1;
	}
	var isValid = goog.isDefAndNotNull;
	return isValid(request.appId) ? request.customReceiverList ? !goog.array.find(request.customReceiverList, function(r) {
		return!(goog.string.startsWith(r.label, "custom") && r.receiverType == chrome.cast.ReceiverType.CUSTOM && isValid(r.friendlyName) && goog.isNull(r.capabilities));
	}) : !0 : !1;
};
castv2.ApiObjectValidator.checkVolumeRequest = function(request) {
	return request && goog.isDefAndNotNull(request.volume) && castv2.ApiObjectValidator.checkVolume(request.volume) ? goog.isDefAndNotNull(request.expectedVolume) ? castv2.ApiObjectValidator.checkVolume(request.expectedVolume) : !0 : !1;
};
castv2.ApiObjectValidator.checkVolume = function(v) {
	if (!v) {
		return!1;
	}
	var isValid = goog.isDefAndNotNull;
	return goog.isDef(v.level) ? isValid(v.level) && goog.isNumber(v.level) && 0 <= v.level && 1 >= v.level : goog.isBoolean(v.muted);
};
castv2.Callbacks = function(successCallback, errorCallback, opt_timeoutMillis) {
	this.successCallback_ = successCallback;
	this.errorCallback_ = errorCallback;
	this.timeoutMillis_ = opt_timeoutMillis || castv2.Callbacks.REQUEST_TIMEOUT_MS_;
	this.isResolved_ = !1;
	this.timeoutTimerId_ = null;
};
castv2.Callbacks.REQUEST_TIMEOUT_MS_ = 3E3;
castv2.Callbacks.prototype.isResolved = function() {
	return this.isResolved_;
};
castv2.Callbacks.prototype.resolve_ = function() {
	this.isResolved_ = !0;
	this.errorCallback_ = this.successCallback_ = null;
	this.timeoutTimerId_ && (clearTimeout(this.timeoutTimerId_), this.timeoutTimerId_ = null);
};
castv2.Callbacks.nullFunction_ = function() {
};
castv2.Callbacks.prototype.useSuccessCallback = function() {
	var c = this.successCallback_;
	this.resolve_();
	return c || castv2.Callbacks.nullFunction_;
};
castv2.Callbacks.prototype.useErrorCallback = function() {
	var c = this.errorCallback_;
	this.resolve_();
	return c || castv2.Callbacks.nullFunction_;
};
castv2.Callbacks.prototype.startTimeout = function(opt_cleanupOnTimeout, opt_timeoutInfo) {
	if (!this.isResolved_ && !this.timeoutTimerId_) {
		var timeout = function() {
			if (!this.isResolved_) {
				opt_cleanupOnTimeout && opt_cleanupOnTimeout();
				var c = this.errorCallback_;
				this.resolve_();
				var error = new chrome.cast.Error(chrome.cast.ErrorCode.TIMEOUT);
				opt_timeoutInfo && (error.description = opt_timeoutInfo);
				c(error);
			}
		}.bind(this);
		this.timeoutTimerId_ = setTimeout(timeout, this.timeoutMillis_);
	}
};
castv2.InternalMessage = function(type, message, opt_seqNum, opt_clientId) {
	this.type = type;
	this.message = message;
	this.seqNum = opt_seqNum || null;
	this.clientId = opt_clientId || null;
	this.appOrigin = null;
};
castv2.InternalMessageType = {IFRAME_INIT_RESULT:"iframe_init_result", EXTENSION_VERSION:"extension_version", V2_MESSAGE:"v2_message", APP_MESSAGE:"app_message", CLIENT_INIT:"client_init", LOG_MESSAGE:"log_message", REQUEST_SESSION:"request_session", RECEIVER_AVAILABILITY:"receiver_availability", NEW_SESSION:"new_session", UPDATE_SESSION:"update_session", REMOVE_SESSION:"remove_session", APP_MESSAGE_SUCCESS:"app_message_success", STOP_SESSION_SUCCESS:"STOP_SESSION_SUCCESS", ERROR:"error"};
castv2.KeyArrayMap = function() {
	this.map_ = {};
};
castv2.KeyArrayMap.prototype.add = function(key, value) {
	var values = this.map_[key];
	if (values) {
		return-1 == values.indexOf(value) && values.push(value), !1;
	}
	this.map_[key] = [value];
	return!0;
};
castv2.KeyArrayMap.prototype.remove = function(key, value) {
	var values = this.map_[key];
	if (!values) {
		return!1;
	}
	var index = values.indexOf(value);
	if (-1 == index) {
		return!1;
	}
	if (1 == values.length) {
		return delete this.map_[key], !0;
	}
	values.splice(index, 1);
	return!1;
};
castv2.KeyArrayMap.prototype.removeKey = function(key) {
	if (!(key in this.map_)) {
		return!1;
	}
	delete this.map_[key];
	return!0;
};
castv2.KeyArrayMap.prototype.removeByKeyPrefix = function(keyPrefix) {
	var deletedAnyKey = !1;
	Object.keys(this.map_).forEach(function(k) {
		0 == k.indexOf(keyPrefix) && (delete this.map_[k], deletedAnyKey = !0);
	}, this);
	return deletedAnyKey;
};
castv2.KeyArrayMap.prototype.get = function(key) {
	return this.map_[key] || [];
};
castv2.MediaStatusMessage = function() {
	this.type = castv2.MessageType.MEDIA_STATUS;
	this.requestId = null;
	this.status = [];
	this.customData = null;
	this.sessionId = "";
};
chrome.cast.ApiMessenger = function(iframe, apiOrigin) {
	this.logger_ = {info:function(message) {
		console.info("[chrome.cast.ApiMessenger] " + message);
	}};
	this.iframe_ = iframe;
	this.apiOrigin_ = apiOrigin;
	this.apiMessageHandler_ = null;
};
chrome.cast.ApiMessenger.prototype.init = function() {
	window.addEventListener("message", this.onIFrameApiMessage_.bind(this), !1);
};
chrome.cast.ApiMessenger.prototype.setApiMessageHandler = function(handler) {
	this.apiMessageHandler_ = handler;
};
chrome.cast.ApiMessenger.prototype.onIFrameApiMessage_ = function(event) {
	if (event.source != window && event.origin == this.apiOrigin_) {
		this.logger_.info("Getting message: " + JSON.stringify(event.data));
		var message = event.data;
		message.type == castv2.InternalMessageType.IFRAME_INIT_RESULT && (this.isIframeApiReady_ = !message.message);
		this.apiMessageHandler_(message);
	}
};
chrome.cast.ApiMessenger.prototype.sendToIframeApi = function(message) {
	this.isIframeApiReady_ ? (this.logger_.info("Sending message to iframe API: " + JSON.stringify(message)), this.iframe_.contentWindow.postMessage(message, this.apiOrigin_)) : this.logger_.info("API is not ready to send " + JSON.stringify(message));
};
chrome.cast.ApiImpl = function(messenger) {
	this.logger_ = {info:function(message) {
		console.info("[chrome.cast.ApiImpl] " + message);
	}};
	this.nextSeq_ = 1E3 * Math.floor(1E5 * Math.random());
	this.messenger_ = messenger;
	this.pendingRequests_ = {};
	this.apiReady_ = !1;
	this.initCallbacks_ = this.apiConfig_ = this.apiInitError_ = null;
	this.appMessageListeners_ = new castv2.KeyArrayMap;
	this.mediaListeners_ = new castv2.KeyArrayMap;
	this.sessionUpdateListeners_ = new castv2.KeyArrayMap;
	this.sessions_ = {};
};
chrome.cast.ApiImpl.prototype.init = function() {
	this.messenger_.setApiMessageHandler(this.processIncomingMessage_.bind(this));
};
chrome.cast.ApiImpl.prototype.getNextSeq_ = function() {
	return "a" + this.nextSeq_++;
};
chrome.cast.ApiImpl.prototype.maybeInvokeCallback_ = function(message) {
	var seqNum = message.seqNum;
	if (!seqNum) {
		return!1;
	}
	var resultCallback = this.pendingRequests_[seqNum];
	if (resultCallback) {
		var finalValue = message.message;
		finalValue && finalValue.type == castv2.MessageType.MEDIA_STATUS ? finalValue.status && 1 == finalValue.status.length ? resultCallback.useSuccessCallback()(finalValue.status[0]) : resultCallback.useErrorCallback()(new chrome.cast.Error(chrome.cast.ErrorCode.LOAD_MEDIA_FAILED)) : message.type == castv2.InternalMessageType.ERROR ? resultCallback.useErrorCallback()(message.message) : (finalValue instanceof chrome.cast.Session && (this.sessions_[finalValue.sessionId] = finalValue), resultCallback.useSuccessCallback()(finalValue));
		delete this.pendingRequests_[seqNum];
	}
	return!!resultCallback;
};
chrome.cast.ApiImpl.prototype.maybeRecreateObject_ = function(message) {
	switch(message.type) {
		case castv2.InternalMessageType.NEW_SESSION:
			message.message = castv2.ApiDataUtils.createSessionFromDictionary(message.message);
			break;
		case castv2.InternalMessageType.V2_MESSAGE:
			var v2Message = message.message;
			v2Message.type == castv2.MessageType.MEDIA_STATUS && v2Message.status && (message.message.status = v2Message.status.map(function(e) {
				return castv2.ApiDataUtils.createMediaFromDictionary(e);
			}));
	}
};
chrome.cast.ApiImpl.prototype.processIncomingMessage_ = function(message) {
	this.logger_.info("Getting message from extension: " + JSON.stringify(message));
	this.maybeRecreateObject_(message);
	if (!this.maybeInvokeCallback_(message)) {
		switch(message.type) {
			case castv2.InternalMessageType.IFRAME_INIT_RESULT:
				this.onApiInitResult_(message);
				break;
			case castv2.InternalMessageType.RECEIVER_AVAILABILITY:
				this.onReceiverAvailability_(message);
				break;
			case castv2.InternalMessageType.NEW_SESSION:
				this.onNewSession_(message);
				break;
			case castv2.InternalMessageType.UPDATE_SESSION:
				this.onUpdateSession_(message);
				break;
			case castv2.InternalMessageType.REMOVE_SESSION:
				this.onRemoveSession_(message);
				break;
			case castv2.InternalMessageType.APP_MESSAGE:
				this.onIncomingAppMessage_(message.message);
				break;
			case castv2.InternalMessageType.V2_MESSAGE:
				this.onIncomingReceiverV2Message_(message);
				break;
			default:
				this.logger_.info("Unknown message type " + JSON.stringify(message));
		}
	}
};
chrome.cast.ApiImpl.prototype.onIncomingReceiverV2Message_ = function(message) {
	this.logger_.info("Processing v2 message: " + JSON.stringify(message));
	switch(message.message.type) {
		case castv2.MessageType.MEDIA_STATUS:
			this.onIncomingMediaStatusMessage_(message.message);
			break;
		default:
			this.logger_.info("Unknown v2 message type " + JSON.stringify(message));
	}
};
chrome.cast.ApiImpl.prototype.onIncomingMediaStatusMessage_ = function(statusMessage) {
	statusMessage.status.forEach(function(e) {
		var listeners = this.mediaListeners_.get(this.getMediaListenerKey_(e.sessionId, e.mediaSessionId));
		listeners && listeners.forEach(function(l) {
			l(e);
		});
	}, this);
};
chrome.cast.ApiImpl.prototype.onNewSession_ = function(message) {
	if (this.apiConfig_) {
		var session = message.message;
		this.sessions_[session.sessionId] = session;
		this.apiConfig_.sessionListener(session);
	}
};
chrome.cast.ApiImpl.prototype.onUpdateSession_ = function(message) {
	var session = message.message, existingSession = this.sessions_[session.sessionId];
	existingSession && (existingSession.statusText = session.statusText, existingSession.namespaces = session.namespaces, existingSession.customData = session.customData, this.sessionUpdateListeners_.get(session.sessionId).forEach(function(l) {
		l(!0);
	}));
};
chrome.cast.ApiImpl.prototype.onRemoveSession_ = function(message) {
	var sessionId = message.message;
	this.sessions_[sessionId] && (this.logger_.info("removing session: " + sessionId), delete this.sessions_[sessionId], this.appMessageListeners_.removeByKeyPrefix(sessionId), this.mediaListeners_.removeByKeyPrefix(sessionId), this.sessionUpdateListeners_.get(sessionId).forEach(function(l) {
		l(!1);
	}), this.sessionUpdateListeners_.removeKey(sessionId));
};
chrome.cast.ApiImpl.prototype.onIncomingAppMessage_ = function(message) {
	this.getAppMessageListeners_(message.sessionId, message.namespaceName).forEach(function(listener) {
		listener(message.namespaceName, message.message);
	});
};
chrome.cast.ApiImpl.prototype.onReceiverAvailability_ = function(message) {
	this.apiConfig_ && this.apiConfig_.receiverListener(message.message);
};
chrome.cast.ApiImpl.prototype.onApiInitResult_ = function(message) {
	var error = message.message;
	error ? (this.apiInitError_ = error, this.initCallbacks_ && this.initCallbacks_.useErrorCallback()(error)) : (this.apiReady_ = !0, this.sendSessionRequestToExtension_(), this.initCallbacks_ && this.initCallbacks_.useSuccessCallback()(void 0));
};
chrome.cast.ApiImpl.prototype.sendApiRequest = function(request, successCallback, errorCallback, opt_timeoutMillis) {
	this.checkApiReady_(errorCallback) && this.sendMessage_(new castv2.InternalMessage(castv2.InternalMessageType.V2_MESSAGE, request), new castv2.Callbacks(successCallback, errorCallback, opt_timeoutMillis));
};
chrome.cast.ApiImpl.prototype.sendAppRequest = function(request, successCallback, errorCallback, opt_timeoutMillis) {
	this.checkApiReady_(errorCallback) && (castv2.ApiObjectValidator.checkAppMessage(request) ? this.sendMessage_(new castv2.InternalMessage(castv2.InternalMessageType.APP_MESSAGE, request), new castv2.Callbacks(successCallback, errorCallback, opt_timeoutMillis)) : errorCallback(new chrome.cast.Error(chrome.cast.ErrorCode.INVALID_PARAMETER)));
};
chrome.cast.ApiImpl.prototype.sendSessionRequestToExtension_ = function() {
	this.apiConfig_ && this.apiReady_ && this.sendMessage_(new castv2.InternalMessage(castv2.InternalMessageType.CLIENT_INIT, this.apiConfig_.sessionRequest));
};
chrome.cast.ApiImpl.prototype.sendMessage_ = function(message, opt_callbacks) {
	var seqNum = this.getNextSeq_();
	message.seqNum = seqNum;
	if (this.pendingRequests_[seqNum] && !this.pendingRequests_[seqNum].isResolved()) {
		throw "Try to send a request with the existing seqNum: " + message.seqNum;
	}
	opt_callbacks && (this.pendingRequests_[seqNum] = opt_callbacks, opt_callbacks.startTimeout(function() {
		delete this.pendingRequests_[seqNum];
	}.bind(this)));
	this.messenger_.sendToIframeApi(message);
};
chrome.cast.ApiImpl.prototype.initialize = function(apiConfig, successCallback, errorCallback) {
	castv2.ApiObjectValidator.checkApiConfig(apiConfig) ? this.apiInitError_ ? errorCallback(this.apiInitError_) : this.apiConfig_ ? (this.logger_.info("Already initialized"), successCallback()) : (this.apiConfig_ = apiConfig, this.apiReady_ ? (this.sendSessionRequestToExtension_(), successCallback()) : (this.initCallbacks_ = new castv2.Callbacks(successCallback, errorCallback, 5E3), this.initCallbacks_.startTimeout())) : errorCallback(new chrome.cast.Error(chrome.cast.ErrorCode.INVALID_PARAMETER));
};
chrome.cast.ApiImpl.prototype.requestSession = function(successCallback, errorCallback, opt_sessionRequest) {
	if (this.checkApiReady_(errorCallback)) {
		if (opt_sessionRequest && !castv2.ApiObjectValidator.checkSessonRequest(opt_sessionRequest)) {
			errorCallback(new chrome.cast.Error(chrome.cast.ErrorCode.INVALID_PARAMETER));
		} else {
			var sessionRequest = opt_sessionRequest;
			!sessionRequest && this.apiConfig_ && (sessionRequest = this.apiConfig_.sessionRequest);
			this.sendMessage_(new castv2.InternalMessage(castv2.InternalMessageType.REQUEST_SESSION, sessionRequest), new castv2.Callbacks(successCallback, errorCallback, 6E5));
		}
	} else {
		errorCallback(new chrome.cast.Error(chrome.cast.ErrorCode.API_NOT_INITIALIZED));
	}
};
chrome.cast.ApiImpl.API_NOT_INITIALIZED_ERROR_ = new chrome.cast.Error(chrome.cast.ErrorCode.API_NOT_INITIALIZED);
chrome.cast.ApiImpl.prototype.checkApiReady_ = function(errorCallback) {
	this.apiReady_ || errorCallback(chrome.cast.ApiImpl.API_NOT_INITIALIZED_ERROR_);
	return this.apiReady_;
};
chrome.cast.ApiImpl.prototype.getAppMessageListenerKey_ = function(sessionId, namespace) {
	return sessionId + "#" + namespace;
};
chrome.cast.ApiImpl.prototype.addAppMessageListener = function(sessionId, namespace, listener) {
	this.appMessageListeners_.add(this.getAppMessageListenerKey_(sessionId, namespace), listener);
};
chrome.cast.ApiImpl.prototype.removeAppMessageListener = function(sessionId, namespace, listener) {
	this.appMessageListeners_.remove(this.getAppMessageListenerKey_(sessionId, namespace), listener);
};
chrome.cast.ApiImpl.prototype.getAppMessageListeners_ = function(sessionId, namespace) {
	return this.appMessageListeners_.get(this.getAppMessageListenerKey_(sessionId, namespace));
};
chrome.cast.ApiImpl.prototype.getMediaListenerKey_ = function(sessionId, mediaSessionId) {
	return sessionId + "#" + mediaSessionId;
};
chrome.cast.ApiImpl.prototype.addMediaListener = function(sessionId, mediaSessionId, listener) {
	this.mediaListeners_.add(this.getMediaListenerKey_(sessionId, mediaSessionId), listener);
};
chrome.cast.ApiImpl.prototype.removeMediaListener = function(sessionId, mediaSessionId, listener) {
	this.mediaListeners_.remove(this.getMediaListenerKey_(sessionId, mediaSessionId), listener);
};
chrome.cast.ApiImpl.prototype.addSessionUpdateListener = function(sessionId, listener) {
	this.sessionUpdateListeners_.add(sessionId, listener);
};
chrome.cast.ApiImpl.prototype.removeSessionUpdateListener = function(sessionId, listener) {
	this.sessionUpdateListeners_.remove(sessionId, listener);
};
castv2.SetVolumeRequest = function(volume) {
	chrome.cast.VolumeRequest.call(this, volume);
	this.type = castv2.MessageType.SET_VOLUME;
	this.requestId = null;
};
goog.inherits(castv2.SetVolumeRequest, chrome.cast.VolumeRequest);
castv2.SetVolumeRequest.getInstance = function(volumeRequest) {
	var setVolumeRequest = new castv2.SetVolumeRequest(volumeRequest.volume);
	setVolumeRequest.expectedVolume = volumeRequest.expectedVolume;
	return setVolumeRequest;
};
chrome.cast.isAvailable = !1;
chrome.cast.api_ = null;
chrome.cast.initialize = function(apiConfig, successCallback, errorCallback) {
	chrome.cast.api_.initialize(apiConfig, successCallback, errorCallback);
};
chrome.cast.requestSession = function(successCallback, errorCallback, opt_sessionRequest) {
	chrome.cast.api_.requestSession(successCallback, errorCallback, opt_sessionRequest);
};
chrome.cast.Receiver.prototype.setVolume = function(volumeRequest, successCallback, errorCallback) {
	chrome.cast.api_.sendApiRequest(castv2.SetVolumeRequest.getInstance(volumeRequest), successCallback, errorCallback);
};
chrome.cast.Session.prototype.stop = function(successCallback, errorCallback) {
	chrome.cast.api_.sendApiRequest(new castv2.StopSessionRequest(this.sessionId), successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.Session.prototype.stop", chrome.cast.Session.prototype.stop);
chrome.cast.Session.prototype.sendMessage = function(namespace, message, successCallback, errorCallback) {
	chrome.cast.api_.sendAppRequest(new castv2.AppMessage(this.sessionId, namespace, message), successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.Session.prototype.sendMessage", chrome.cast.Session.prototype.sendMessage);
chrome.cast.Session.prototype.addListener = function(listener) {
	chrome.cast.api_.addSessionUpdateListener(this.sessionId, listener);
};
goog.exportSymbol("chrome.cast.Session.prototype.addListener", chrome.cast.Session.prototype.addListener);
chrome.cast.Session.prototype.removeListener = function(listener) {
	chrome.cast.api_.removeSessionUpdateListener(this.sessionId, listener);
};
goog.exportSymbol("chrome.cast.Session.prototype.removeListener", chrome.cast.Session.prototype.removeListener);
chrome.cast.Session.prototype.addMessageListener = function(namespace, listener) {
	chrome.cast.api_.addAppMessageListener(this.sessionId, namespace, listener);
};
goog.exportSymbol("chrome.cast.Session.prototype.addMessageListener", chrome.cast.Session.prototype.addMessageListener);
chrome.cast.Session.prototype.removeMessageListener = function(namespace, listener) {
	chrome.cast.api_.removeAppMessageListener(this.sessionId, namespace, listener);
};
goog.exportSymbol("chrome.cast.Session.prototype.removeMessageListener", chrome.cast.Session.prototype.removeMessageListener);
chrome.cast.media.loadMedia = function(session, loadRequest, successCallback, errorCallback) {
	loadRequest.sessionId = session.sessionId;
	chrome.cast.api_.sendApiRequest(loadRequest, successCallback, errorCallback, 5200);
};
goog.exportSymbol("chrome.cast.media.loadMedia", chrome.cast.media.loadMedia);
chrome.cast.media.Media.prototype.play = function(playRequest, successCallback, errorCallback) {
	playRequest || (playRequest = new chrome.cast.media.PlayRequest);
	this.setupMediaRequest_(playRequest, castv2.MessageType.MEDIA_PLAY);
	chrome.cast.api_.sendApiRequest(playRequest, successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.play", chrome.cast.media.Media.prototype.play);
chrome.cast.media.Media.prototype.pause = function(pauseRequest, successCallback, errorCallback) {
	pauseRequest || (pauseRequest = new chrome.cast.media.PauseRequest);
	this.setupMediaRequest_(pauseRequest, castv2.MessageType.MEDIA_PAUSE);
	chrome.cast.api_.sendApiRequest(pauseRequest, successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.pause", chrome.cast.media.Media.prototype.pause);
chrome.cast.media.Media.prototype.seek = function(seekRequest, successCallback, errorCallback) {
	this.setupMediaRequest_(seekRequest, castv2.MessageType.MEDIA_SEEK);
	chrome.cast.api_.sendApiRequest(seekRequest, successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.seek", chrome.cast.media.Media.prototype.seek);
chrome.cast.media.Media.prototype.stop = function(stopRequest, successCallback, errorCallback) {
	stopRequest || (stopRequest = new chrome.cast.media.StopRequest);
	this.setupMediaRequest_(stopRequest, castv2.MessageType.MEDIA_STOP);
	chrome.cast.api_.sendApiRequest(stopRequest, successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.stop", chrome.cast.media.Media.prototype.stop);
chrome.cast.media.Media.prototype.setVolume = function(volumeRequest, successCallback, errorCallback) {
	this.setupMediaRequest_(volumeRequest, castv2.MessageType.MEDIA_SET_VOLUME);
	chrome.cast.api_.sendApiRequest(volumeRequest, successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.setVolume", chrome.cast.media.Media.prototype.setVolume);
chrome.cast.media.Media.prototype.supportsCommand = function() {
	return!0;
};
goog.exportSymbol("chrome.cast.media.Media.prototype.supportsCommand", chrome.cast.media.Media.prototype.supportsCommand);
chrome.cast.media.Media.prototype.setupMediaRequest_ = function(request, type) {
	request.mediaSessionId = this.mediaSessionId;
	request.sessionId = this.sessionId;
	request.requestId = null;
	request.type = type;
};
chrome.cast.media.Media.prototype.addListener = function(listener) {
	chrome.cast.api_.addMediaListener(this.sessionId, this.mediaSessionId, listener);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.addListener", chrome.cast.media.Media.prototype.addListener);
chrome.cast.media.Media.prototype.removeListener = function(listener) {
	chrome.cast.api_.removeMediaListener(this.sessionId, this.mediaSessionId, listener);
};
goog.exportSymbol("chrome.cast.media.Media.prototype.removeListener", chrome.cast.media.Media.prototype.removeListener);
chrome.cast.setupCastApi_ = function() {
	if (!chrome.cast.setupCastApiCalled_) {
		chrome.cast.setupCastApiCalled_ = !0;
		var iframe = document.createElement("iframe");
		iframe.src = "https://www.gstatic.com/cv/versions/dev/temp-api-v2-j4Ak/api_iframe.html?appOrigin=" + window.location.origin;
		iframe.setAttribute("style", "display:none");
		document.body.appendChild(iframe);
		var apiMessenger = new chrome.cast.ApiMessenger(iframe, "https://www.gstatic.com");
		apiMessenger.init();
		chrome.cast.api_ = new chrome.cast.ApiImpl(apiMessenger);
		chrome.cast.api_.init();
		chrome.cast.isAvailable = !0;
	}
};
chrome.cast.setupCastApiCalled_ = !1;
window.addEventListener("load", chrome.cast.setupCastApi_, !1);
window.addEventListener("DOMContentLoaded", chrome.cast.setupCastApi_, !1);
