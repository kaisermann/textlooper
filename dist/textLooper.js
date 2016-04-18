/*
 * Text Looper v1.0.6
 * https://github.com/kaisermann/textLooper
 * by Christian Kaisermann
 */
 (function (root, factory) 
 {
 	if (typeof define === "function" && define.amd)
 		define([], factory);
 	else if (typeof exports === "object")
 		module.exports = factory();
 	else
 		root.TextLooper = factory();
 }(this, function (undefined) 
 {
 	'use strict';
 	var 
 	mainSelector = "data-textloop", 
 	defaults = { delay: 1500, animation: 'fadeIn' };

 	/* -- TextLooper Class -- */
 	function TextLooper(_node) 
 	{
 		var 
 		_phrases = [],
 		_curIndex = -1,
 		_curAnimation,
 		_animations,
 		_delays;

 		var init = function()
 		{
 			var _separator = _node.getAttribute(mainSelector+"-separator") || ",";

 			for (var i = 0, splitted = _node.textContent.split(_separator); i < splitted.length; i++)
 				_phrases.push(splitted[i].trim());

 			_delays = _node.getAttribute(mainSelector).trim().split('|');

 			var tmp_animations = _node.getAttribute(mainSelector+"-animation");
 			_animations = (tmp_animations) ? tmp_animations.split('|') : undefined;

 			if((_animations && _animations.length>1 && _animations.length<_phrases.length) || (_delays.length>1 && _delays.length<_phrases.length))
 			{
 				console.error("TextLooper - There are more phrases than parameters");
 				return;
 			}

 			for (var p = 0, prefixes = ["webkit", "moz", "MS", "o", ""]; p < prefixes.length; p++) 
 				_node.addEventListener(prefixes[p]+((!prefixes[p]) ? "animationend" : "AnimationEnd"), animationEnded);

 			_node.classList.add("textLooped");
 			_node.style.visibility = "visible";
 			
 			timerHandler();
 		},
 		animationEnded = function() 
 		{ 
 			_node.classList.remove("animated", _curAnimation); 
 			setTimeout(timerHandler, getCurrent(_delays, _curIndex) || defaults.delay);
 		},
 		getCurrent = function(arr, index) { return (arr.length==1)?arr[0] : arr[index]; },
 		timerHandler = function() 
 		{
 			if(++_curIndex === _phrases.length)
 				_curIndex = 0;

 			_curAnimation = !_animations ? defaults.animation : getCurrent(_animations, _curIndex);

 			_node.textContent = _phrases[_curIndex];
 			_node.classList.add("animated", _curAnimation);
 		};
 		init();
 	}

 	TextLooper.setDefaultDelay = function(delay) { defaults.delay = delay; };
 	TextLooper.setDefaultAnimation = function(animation) { defaults.animation = animation; };
 	TextLooper.refresh = function() 
 	{ 
 		for(var i = 0, nodes = document.querySelectorAll("["+mainSelector+"]:not(.textLooped)"); i < nodes.length; i++)
 			new TextLooper(nodes[i]);
 	};

 	TextLooper.refresh();
 	return TextLooper;
 }));