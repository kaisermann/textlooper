(function (root, factory) {
  if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    module.exports = factory();
  else
    root.TextLooper = factory();
}(this, function (undefined) {
  /* jshint eqnull: true */
  'use strict';

  var
    defaults = {
      delay: 1500,
      in: 'fadeIn',
      out: 'fadeOut',
      selector: 'data-textlooper',
      loopingClass: 'textlooper--looping',
      separator: ','
    },
    prefixes = ['webkit', 'moz', 'MS', 'o', '']

  // TextLooper Class
  function TextLooper(node, optionsObj) {
    var _curIndex = -1,
      _curAnimation,
      _useOutAnimation = false,
      _this = this;

    var init = function (node, optionsObj) {
      _this.node = node;
      _this.attributes = treatAttributes(optionsObj ? Object.assign({
        ins: [],
        outs: null,
        comebackAsOut: false,
        delays: []
      }, optionsObj) : parseAttributes());

      if(_this.attributes.comebackAsOut) {
        var css = '.textlooper--reverse{';
        prefixes.forEach(function (prefix) {
          var divisor = ((prefix) ? '-' : '');
          css += divisor + prefix + divisor + 'animation-direction: alternate-reverse;';
        });
        css += '}';
        writeCSS(css);
      }

      // Listens to the end of animations
      prefixes.forEach(function (prefix, i) {
        _this.node.addEventListener(prefix + ((!prefix.length) ? 'animationend' : 'AnimationEnd'), animationEnded);
      });
    };

    var animationEnded = function () {
      _this.node.classList.remove('animated', 'textlooper--reverse', _curAnimation);
      _useOutAnimation = !_useOutAnimation;
      if(true) {
        var a;
      }

      // Is there any out-animations list or are we supposed to use comback animations?
      if(_this.attributes.outs && !_useOutAnimation) {
        timerHandler();
      } else { // If not...
        setTimeout(timerHandler, _this.attributes.delays[_curIndex]);
      }
    };
    var timerHandler = function () {
      if(_this.attributes.outs && _useOutAnimation) {
        // Out-animation
        // Do not increment the _curIndex and use the relative out-animation
        _curAnimation = _this.attributes.outs[_curIndex];
        if(_this.attributes.comebackAsOut) {
          _this.node.classList.add('textlooper--reverse');
        }
        _this.node.classList.add('animated', _curAnimation);
      } else {
        // In-animation
        if(++_curIndex === _this.attributes.phrases.length)
          _curIndex = 0;

        _curAnimation = _this.attributes.ins[_curIndex];

        // We must set visibility to hidden/visible to prevent text from flickering
        _this.node.style.visibility = 'hidden';
        _this.node.textContent = _this.attributes.phrases[_curIndex];

        setTimeout(function () {
          _this.node.style.visibility = 'visible';
          _this.node.classList.add('animated', _curAnimation);
        }, 0);
      }
    };

    var parseAttributes = function () {
      var _tmpAttrs = {};
      _tmpAttrs.separator = _this.node.getAttribute(selector('separator')) || defaults.separator;

      // Check if main selector and delays exist and initializes its list
      if(!_this.node.hasAttribute(selector())) {
        _this.node.setAttribute(selector(), defaults.delay);
      }
      _tmpAttrs.delays = _this.node.getAttribute(selector());

      // Filters empty and non-number entries and transforms the result in integers
      _tmpAttrs.delays = clipEmptyEntries(_tmpAttrs.delays.split('|')).filter(function (str) {
        return Number.isInteger(+str);
      }).map(Number);

      // Get node text
      _tmpAttrs.phrases = clipEmptyEntries(_this.node.textContent.split(_tmpAttrs.separator));

      if(!_tmpAttrs.phrases.length)
        throw new Error('TextLooper: no text detected');

      // Get in and out (if defined) animations list
      ['in', 'out'].forEach(function (key) {
        var pluralKey = key + 's';
        var attr = selector(key);
        if(!_this.node.hasAttribute(attr)) {
          _tmpAttrs[pluralKey] = null;
          return;
        }
        _tmpAttrs[pluralKey] = _this.node.getAttribute(attr);
        _tmpAttrs[pluralKey] = (!_tmpAttrs[pluralKey]) ? [] : clipEmptyEntries(_tmpAttrs[pluralKey].split('|'));
      });

      return _tmpAttrs;
    };

    var treatAttributes = function (arr) {
      // If we got here without a separator we must have come from a external attributes object
      arr.separator = arr.separator || defaults.separator;

      ['in', 'out', 'delay'].forEach(function (key) {
        var pluralKey = key + 's';
        // if out-animations list doesn't exist, let's ignore it
        if(key === 'out' && !arr[pluralKey])
          return;

        var list = arr[pluralKey];

        if(!list)
          list = arr[pluralKey] = [];
        else if(!Array.isArray(list)) {
          arr[pluralKey] = [arr[pluralKey]];
        }

        // Fills the rest of each list with the default value if list is null
        // or with the list's first value if it's not null
        if(list.length < arr.phrases.length) {
          var fillItem = list.length ? list[0] : defaults[key];
          arr[pluralKey] = arr[pluralKey].concat(new Array(arr.phrases.length - list.length).fill(fillItem));
        }

        if(arr[pluralKey].length !== arr.phrases.length) {
          throw new Error('TextLooper: There are a different number of phrases and parameters');
        }
      });

      // If out animations are defined, we should ignore data-textloop-comeback
      if(!arr.comebackAsOut) {
        arr.comebackAsOut = !arr.outs ? _this.node.hasAttribute(selector('comeback')) : false;
      }

      if(arr.comebackAsOut) {
        arr.outs = arr.ins.slice(0);
      }
      return arr;
    };

    // Privileged methods
    this.start = function () {
      // Let's mark this node as a text-looper node
      this.node.classList.add(defaults.loopingClass);
      timerHandler();
      return _this;
    };

    this.getAttributes = function () {
      return this.attributes;
    };

    init(node, optionsObj);
  }

  // Private helper methods
  function selector(str) {
    str = str || '';
    return defaults.selector + ((!str.length) ? '' : '-' + str);
  }

  function writeCSS(css) {
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
  }

  function clipEmptyEntries(arr) {
    return arr.filter(function (str) {
      return str.trim().length;
    });
  }

  // Static methods
  TextLooper.setDefaults = function (o) {
    Object.assign(defaults, o);
  };

  TextLooper.getDefaults = function () {
    return defaults;
  };

  TextLooper.seek = function () {
    for(var i = 0, nodes = document.querySelectorAll('[' + selector() + ']:not(.' + defaults.loopingClass + ')'); i < nodes.length; i++) {
      new TextLooper(nodes[i]).start();
    }
  };

  return TextLooper;
}));
