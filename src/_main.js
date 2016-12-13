(function () {

  // Private static properties
  let
    globalOpts = {
      delay: 1500,
      in: 'fadeIn',
      out: 'fadeOut',
      selector: 'data-textlooper',
      separator: ',',
      loopingClass: 'textlooper--looping',
      reverseClass: 'textlooper--reverse',
      animatedClass: 'animated'
    };

  const prefixes = ['webkit', 'moz', 'MS', 'o', ''];
  const head = document.head || document.getElementsByTagName('head')[0];

  // Private static
  const selector = (str = '') => `${globalOpts.selector}${!str.length ? '' : '-'}${str}`;
  const appendCSS = (styleNode, css) => {
    if (styleNode.styleSheet) {
      styleNode.styleSheet.cssText = css;
    } else {
      styleNode.appendChild(document.createTextNode(css));
    }
  };
  const clipEmpty = arr => arr.filter(str => str.trim().length);
  // Object.assign() ponyfill
  const objectAssign = Object.assign || function (srcObj) {
    for (let i = 1; i < arguments.length; i++) {
      for (let objProperty in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], objProperty)) {
          srcObj[objProperty] = arguments[i][objProperty];
        }
      }
    }
    return srcObj;
  };

  let style = (function () {
    // Creates a dynamic style tag
    const tmpStyle = document.createElement('style');
    tmpStyle.type = 'text/css';
    tmpStyle.id = 'textlooper-css';
    head.appendChild(tmpStyle);
    appendCSS(tmpStyle, '[' + selector() + ']{display:inline-block;}');
    return tmpStyle;
  })();
  let addedReverseCSS = false;

  // TextLooper Class
  class TextLooper {
    constructor(node, optionsObj) {
      let _curIndex = -1,
        _curAnimation,
        _useOutAnimation = false;
      const _self = this;

      const _constructor = (node, optionsObj) => {
        _self.node = node;
        _self.attributes = _transformAttrs(optionsObj ? objectAssign({
          ins: [],
          outs: null,
          comebackAsOut: false,
          delays: []
        }, optionsObj) : _parseAttrs());

        if (_self.attributes.comebackAsOut && !addedReverseCSS) {
          let css = `.${globalOpts.reverseClass} {`;
          prefixes.forEach((prefix) => {
            const divisor = ((prefix) ? '-' : '');
            css += divisor + prefix + divisor + 'animation-direction: alternate-reverse;';
          });
          css += '}';
          appendCSS(style, css);
          addedReverseCSS = true;
        }

        // Listens to the end of animations
        prefixes.forEach((prefix, i) => {
          _self.node.addEventListener(prefix + ((!prefix.length) ? 'animationend' : 'AnimationEnd'), _animationEnded);
        });
      };

      const _animationEnded = () => {
        _self.node.classList.remove(globalOpts.animatedClass, globalOpts.reverseClass, _curAnimation);
        _useOutAnimation = !_useOutAnimation;

        // Is there any out-animations list or are we supposed to use comback animations?
        if (_self.attributes.outs && !_useOutAnimation) {
          _timerHandler();
        } else { // If not...
          setTimeout(_timerHandler, _self.attributes.delays[_curIndex]);
        }
      };
      const _timerHandler = () => {
        if (_self.attributes.outs && _useOutAnimation) {
          // Out-animation
          // Do not increment the _curIndex and use the respetice out-animation
          _curAnimation = _self.attributes.outs[_curIndex];
          if (_self.attributes.comebackAsOut) {
            _self.node.classList.add(globalOpts.reverseClass);
          }
          _self.node.classList.add(globalOpts.animatedClass, _curAnimation);
        } else {
          // In-animation
          if (++_curIndex === _self.attributes.phrases.length) {
            _curIndex = 0;
          }

          _curAnimation = _self.attributes.ins[_curIndex];

          // We must set visibility to hidden/visible to prevent text from flickering
          _self.node.style.visibility = 'hidden';
          _self.node.textContent = _self.attributes.phrases[_curIndex];

          // Let's give the browser a moment to update the visibility: hidden state
          setTimeout(() => {
            _self.node.style.visibility = 'visible';
            _self.node.classList.add(globalOpts.animatedClass, _curAnimation);
          }, 0);
        }
      };

      const _parseAttrs = () => {
        const _tmpAttrs = {
          separator: _self.node.getAttribute(selector('separator')) || globalOpts.separator
        };

        // Check if main selector and delays exist and initializes its list
        if (!_self.node.hasAttribute(selector())) {
          _self.node.setAttribute(selector(), globalOpts.delay);
        }
        // Filters empty and non-number entries and transforms the result in integers
        _tmpAttrs.delays = _self.node.getAttribute(selector());
        _tmpAttrs.delays = clipEmpty(_tmpAttrs.delays.split('|'))
          .filter(str => Number.isInteger(+str))
          .map(Number);

        // Get node text content
        _tmpAttrs.phrases = clipEmpty(_self.node.textContent.split(_tmpAttrs.separator));

        if (!_tmpAttrs.phrases.length) {
          throw new Error('TextLooper - no text detected');
        }

        // Get in and out (if defined) animations list
        ['in', 'out'].forEach(key => {
          const pluralKey = key + 's';
          const attr = selector(key);
          if (!_self.node.hasAttribute(attr)) {
            _tmpAttrs[pluralKey] = null;
            return;
          }
          _tmpAttrs[pluralKey] = _self.node.getAttribute(attr);
          _tmpAttrs[pluralKey] = !_tmpAttrs[pluralKey] ? [] : clipEmpty(_tmpAttrs[pluralKey].split('|'));
        });

        return _tmpAttrs;
      };

      const _transformAttrs = function (arr) {

        // If we got here without a separator we must have come from a external attributes object
        arr.separator = arr.separator || globalOpts.separator;

        ['in', 'out', 'delay'].forEach(function (key) {
          const pluralKey = key + 's';
          let list;

          // if out-animations list doesn't exist, let's ignore it
          if (key === 'out' && !arr[pluralKey]) {
            return;
          }

          // If null, let's make it an empty array
          if (!arr[pluralKey]) {
            list = [];
          } else if (!Array.isArray(arr[pluralKey])) {
            // If it's not an array, let's make it into one
            list = [arr[pluralKey]];
          } else {
            list = arr[pluralKey];
          }

          // Fills the rest of each list with the default value if list is null
          // or with the list's first value if it's not null
          if (list.length < arr.phrases.length) {
            const fillItem = list.length ? list[0] : globalOpts[key];
            list = list.concat(new Array(arr.phrases.length - list.length).fill(fillItem));
          }

          if (list.length !== arr.phrases.length) {
            throw new Error('TextLooper - There are a different number of phrases and parameters');
          }
          arr[pluralKey] = list;
        });

        // If out animations are defined, we should ignore data-textloop-comeback
        if (!arr.comebackAsOut) {
          arr.comebackAsOut = !arr.outs ? _self.node.hasAttribute(selector('comeback')) : false;
        }

        if (arr.comebackAsOut) {
          arr.outs = arr.ins.slice(0);
        }
        return arr;
      };

      // Privileged methods
      this.start = function () {
        // Let's mark this node as a text-looper node
        this.node.classList.add(globalOpts.loopingClass);
        _timerHandler();
        return _self;
      };

      this.getAttributes = function () {
        return this.attributes;
      };

      _constructor(node, optionsObj);
    }

    // Static methods
    static setOptions(o) {
      objectAssign(globalOpts, o);
    }

    static getOptions() {
      return globalOpts;
    }

    static seek() {
      const nodes = document.querySelectorAll(`[${selector()}]:not(.${globalOpts.loopingClass})`);
      for (let i = 0; i < nodes.length; i++) {
        new TextLooper(nodes[i]).start();
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextLooper;
  } else {
    window.TextLooper = TextLooper;
  }
})();
