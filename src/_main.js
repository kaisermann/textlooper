/*
 * Text Looper v1.1.0
 * https://github.com/kaisermann/textlooper
 * by Christian Kaisermann
 */
(function (root, factory) {
  if(typeof define === "function" && define.amd)
    define([], factory);
  else if(typeof exports === "object")
    module.exports = factory();
  else
    root.TextLooper = factory();
}(this, function (undefined) {
  'use strict';
  var
    mainSelector = "data-textloop",
    defaults = {
      delay: 1500,
      animation: 'fadeIn'
    };

  /* -- TextLooper Class -- */
  function TextLooper(_node) {
    var _lists = {
        animations: [],
        delays: [],
        phrases: []
      },
      _curIndex = -1,
      _curAnimation,
      _hasComebackAnimations = false,
      _shouldReverseAnimation = false;

    var init = function () {
        var i, prefixes = ["webkit", "moz", "MS", "o", ""];

        var _separator = _node.getAttribute(mainSelector + "-separator") || ",";
        _hasComebackAnimations = _node.hasAttribute(mainSelector + "-comeback");

        if(_hasComebackAnimations) {
          var css = '.textlooper--reverse{';
          prefixes.forEach(function (prefix, i) {
            var divisor = ((prefix) ? '-' : '');
            css += divisor + prefix + divisor + 'animation-direction: alternate-reverse;';
          });
          css += '}';
          writeCSS(css);
        }

        _lists.phrases = _node.textContent.split(_separator).map(function (str) {
          return str.trim();
        });

        _lists.delays = _node.getAttribute(mainSelector).trim().split('|');
        if(!_lists.delays[0].length)
          _lists.delays = [];

        _lists.animations = _node.getAttribute(mainSelector + '-animation');
        _lists.animations = (!_lists.animations || !_lists.animations.length) ? [] : _lists.animations.split('|');

        ['animation', 'delay'].forEach(function (itemName) {
          var listName = itemName + 's',
            list = _lists[listName],
            n_phrases = _lists.phrases.length;

          if(list.length < n_phrases) {
            var fillItem = list.length ? list[0] : defaults[itemName];
            _lists[listName] = _lists[listName].concat(new Array(n_phrases - list.length).fill(fillItem));
          }
        });

        if(_lists.animations.length !== _lists.phrases.length || _lists.delays.length !== _lists.phrases.length) {
          console.error("TextLooper - There are more phrases than parameters");
          return;
        }

        // Listens to the end of animations
        prefixes.forEach(function (prefix, i) {
          _node.addEventListener(prefix + ((!prefix.length) ? "animationend" : "AnimationEnd"), animationEnded);
        });

        // Let's mark this node as a text-looper node
        _node.classList.add("textlooper--looping");
        timerHandler();
      },
      animationEnded = function () {
        _node.classList.remove("animated", "textlooper--reverse", _curAnimation);
        _shouldReverseAnimation = !_shouldReverseAnimation;

        if(_hasComebackAnimations && !_shouldReverseAnimation)
          timerHandler();
        else
          setTimeout(timerHandler, _lists.delays[_curIndex]);
      },
      timerHandler = function () {
        if(_hasComebackAnimations && _shouldReverseAnimation) {
          _node.classList.add("animated", "textlooper--reverse", _curAnimation);
        } else {
          if(++_curIndex === _lists.phrases.length)
            _curIndex = 0;
          _curAnimation = _lists.animations[_curIndex];

          _node.style.visibility = 'hidden';
          _node.textContent = _lists.phrases[_curIndex];

          // We must wait a ~little~ bit between a original animation and its comeback
          setTimeout(function () {
            _node.style.visibility = 'visible';
            _node.classList.add("animated", _curAnimation);
          }, 1);
        }
      },
      writeCSS = function (css) {
        var head = document.head || document.getElementsByTagName('head')[0],
          style = document.createElement('style');

        // We don't need to add a style tag more than once
        if(head.querySelector('#textlooper-css'))
          return;

        style.type = 'text/css';
        style.id = 'textlooper-css';
        if(style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
      };
    init();
  }

  TextLooper.setDefaultDelay = function (delay) {
    defaults.delay = delay;
  };

  TextLooper.setDefaultAnimation = function (animation) {
    defaults.animation = animation;
  };

  TextLooper.refresh = function () {
    for(var i = 0, nodes = document.querySelectorAll("[" + mainSelector + "]:not(.textlooper--looping)"); i < nodes.length; i++)
      new TextLooper(nodes[i]);
  };

  TextLooper.refresh();
  return TextLooper;
}));
