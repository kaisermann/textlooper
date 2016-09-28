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
    defaults = {
      delay: 1500,
      in: 'fadeIn',
      out: 'fadeOut',
      selector: "data-textloop"
    };

  /* -- TextLooper Class -- */
  function TextLooper(node) {
    var _curIndex = -1,
      _curAnimation,
      _useOutAnimation = false,
      _initialized = false,
      _this = this;
    _this.node = node;

    var init = function () {
        var i, prefixes = ["webkit", "moz", "MS", "o", ""];

        if(_initialized)
          throw("TextLooper: Trying to initialize the instance more than once");
        _initialized = true;

        _this.attrs = _this.parseAttrs();

        // If out animations are defined, we should ignore data-textloop-comeback
        _this.attrs.useComebackAsOut = !_this.attrs.out ? _this.node.hasAttribute(defaults.selector + "-comeback") : false;

        if(_this.attrs.useComebackAsOut) {
          _tmpAttrs.out = _tmpAttrs.in.slice(0);
        }

        if(_this.attrs.useComebackAsOut) {
          var css = '.textlooper--reverse{';
          prefixes.forEach(function (prefix, i) {
            var divisor = ((prefix) ? '-' : '');
            css += divisor + prefix + divisor + 'animation-direction: alternate-reverse;';
          });
          css += '}';
          writeCSS(css);
        }

        // Listens to the end of animations
        prefixes.forEach(function (prefix, i) {
          _this.node.addEventListener(prefix + ((!prefix.length) ? "animationend" : "AnimationEnd"), animationEnded);
        });
      },
      animationEnded = function () {
        _this.node.classList.remove("animated", "textlooper--reverse", _curAnimation);
        _useOutAnimation = !_useOutAnimation;

        // Is there any out-animations list or are we supposed to use comback animations?
        if(_this.attrs.out && !_useOutAnimation)
          timerHandler();
        else // If not...
          setTimeout(timerHandler, _this.attrs.delay[_curIndex]);
      },
      timerHandler = function () {
        if(_this.attrs.out && _useOutAnimation) {
          console.log('out');
          // Do not increment the _curIndex and use the relative out-animation
          _curAnimation = _this.attrs.out[_curIndex];
          if(_this.attrs.useComebackAsOut) {
            _this.node.classList.add("textlooper--reverse");
          }
          _this.node.classList.add("animated", _curAnimation);
        } else {
          console.log('in');
          // In-animation
          if(++_curIndex === _this.attrs.phrase.length)
            _curIndex = 0;

          _curAnimation = _this.attrs.in[_curIndex];

          _this.node.style.visibility = 'hidden';
          _this.node.textContent = _this.attrs.phrase[_curIndex];

          // We must wait a ~little~ bit between a original animation and its comeback
          setTimeout(function () {
            _this.node.style.visibility = 'visible';
            _this.node.classList.add("animated", _curAnimation);
          }, 0);
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
      },
      clipEmptyEntries = function (arr) {
        var result = [];
        arr.map(function (str) {
          str = str.trim();
          if(str.length) {
            result.push(str);
          }
        });
        return result;
      };

    // Privileged methods
    this.start = function () {
      init();
      // Let's mark this node as a text-looper node
      this.node.classList.add("textlooper--looping");
      timerHandler();
    };

    this.parseAttrs = function () {
      var _tmpAttrs = {
        phrase: []
      };
      _tmpAttrs.separator = _this.node.getAttribute(defaults.selector + "-separator") || ",";

      // Check if main selector and delays exist and initializes its list
      _tmpAttrs.delay = _this.node.getAttribute(defaults.selector);
      if(_tmpAttrs.delay == null)
        throw('TextLooper: no ' + defaults.selector + ' attribute detected');
      _tmpAttrs.delay = clipEmptyEntries(_tmpAttrs.delay.split('|'));

      // Get node text
      _tmpAttrs.phrase = clipEmptyEntries(_this.node.textContent.split(_tmpAttrs.separator));

      if(!_tmpAttrs.phrase.length)
        throw('TextLooper: no text detected');

      ['in', 'out'].forEach(function (key) {
        var attr = defaults.selector + '-' + key;
        if(!_this.node.hasAttribute(attr)) {
          _tmpAttrs[key] = null;
          return;
        }
        _tmpAttrs[key] = _this.node.getAttribute(attr);
        _tmpAttrs[key] = (!_tmpAttrs[key]) ? [] : clipEmptyEntries(_tmpAttrs[key].split('|'));
      });

      ['in', 'out', 'delay'].forEach(function (key) {
        // if out-animations list doesn't exist, let's ignore it
        if(key === 'out' && !_tmpAttrs[key])
          return;

        var list = _tmpAttrs[key];
        if(!list)
          list = _tmpAttrs[key] = [];

        // Fills the rest of each list with the default value if list is null
        // or with the list's first value if it's not null
        if(list.length < _tmpAttrs.phrase.length) {
          var fillItem = list.length ? list[0] : defaults[key];
          _tmpAttrs[key] = _tmpAttrs[key].concat(new Array(_tmpAttrs.phrase.length - list.length).fill(fillItem));
        }

        if(_tmpAttrs[key].length !== _tmpAttrs.phrase.length) {
          throw("TextLooper: There are a different number of phrases and parameters");
        }
      });

      return _tmpAttrs;
    };
  }

  // Static methods
  TextLooper.getDefaults = function () {
    return defaults;
  };

  TextLooper.setDefaultDelay = function (delay) {
    defaults.delay = delay;
  };

  TextLooper.setDefaultInAnimation = function (animation) {
    defaults.in = animation;
  };

  TextLooper.setDefaultOutAnimation = function (animation) {
    defaults.out = animation;
  };

  TextLooper.setSelector = function (selector) {
    defaults.selector = selector;
  };


  TextLooper.refresh = function () {
    for(var i = 0, nodes = document.querySelectorAll("[" + defaults.selector + "]:not(.textlooper--looping)"); i < nodes.length; i++)
      new TextLooper(nodes[i]).start();
  };

  return TextLooper;
}));
