/*
 * Text Looper v2.0.0
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
      in: 'fadeIn',
      out: 'fadeOut'
    };

  /* -- TextLooper Class -- */
  function TextLooper(_node) {
    var _lists = { in: [],
        out: [],
        delay: [],
        phrase: []
      },
      _curIndex = -1,
      _curAnimation,
      _useComebackAsOut = false,
      _useOutAnimation = false;

    var init = function () {
        var i, prefixes = ["webkit", "moz", "MS", "o", ""];

        var _separator = _node.getAttribute(mainSelector + "-separator") || ",";
        _lists.out = _node.getAttribute(mainSelector + '-out');

        _useComebackAsOut = !_lists.out ? _node.hasAttribute(mainSelector + "-comeback") : false;

        if(_useComebackAsOut) {
          var css = '.textlooper--reverse{';
          prefixes.forEach(function (prefix, i) {
            var divisor = ((prefix) ? '-' : '');
            css += divisor + prefix + divisor + 'animation-direction: alternate-reverse;';
          });
          css += '}';
          writeCSS(css);
        }

        _lists.phrase = _node.textContent.split(_separator).map(function (str) {
          return str.trim();
        });

        _lists.delay = _node.getAttribute(mainSelector).trim().split('|');
        if(!_lists.delay[0].length)
          _lists.delay = [];

        ['in', 'out'].forEach(function (key) {
          _lists[key] = _node.getAttribute(mainSelector + '-' + key);
          if(_lists[key]) // if a list exists
            _lists[key] = _lists[key].split('|');
          else if(_lists[key] === '' || key === 'in') // If empty attr or the in attr
            _lists[key] = [];
        });

        ['in', 'out', 'delay'].forEach(function (key) {
          if(key === 'out' && !_lists[key]) // if out list doesn't exist, let's ignore it
            return;

          var list = _lists[key];

          // Fills the rest of each list with the default value if list is null
          // or with the list's first value if it's not null
          if(list.length < _lists.phrase.length) {
            var fillItem = list.length ? list[0] : defaults[key];
            _lists[key] = _lists[key].concat(new Array(_lists.phrase.length - list.length).fill(fillItem));
          }

          if(_lists[key].length !== _lists.phrase.length) {
            throw("TextLooper - There are a different number of phrases and parameters");
          }
        });

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
        _useOutAnimation = !_useOutAnimation;

        // Is there any out-animations list or are we supposed to use comback animations?
        if((_lists.out || _useComebackAsOut) && !_useOutAnimation)
          timerHandler();
        else // If not...
          setTimeout(timerHandler, _lists.delay[_curIndex]);
      },
      timerHandler = function () {
        if(_useComebackAsOut && _useOutAnimation) {
          console.log('comeback');
          // Comeback animation
          _node.classList.add("animated", "textlooper--reverse", _curAnimation);
        } else {
          if(_lists.out && _useOutAnimation) {
            console.log('out');
            // Do not increment the _curIndex and use the relative out-animation
            _curAnimation = _lists.out[_curIndex];
            _node.classList.add("animated", _curAnimation);
          } else {
            console.log('in');
            // In-animation
            if(++_curIndex === _lists.phrase.length)
              _curIndex = 0;

            _curAnimation = _lists.in[_curIndex];

            _node.style.visibility = 'hidden';
            _node.textContent = _lists.phrase[_curIndex];

            // We must wait a ~little~ bit between a original animation and its comeback
            setTimeout(function () {
              _node.style.visibility = 'visible';
              _node.classList.add("animated", _curAnimation);
            }, 0);
          }
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
