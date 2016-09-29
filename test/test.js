/* jshint node: true */
/* global describe, it, beforeEach */
'use strict';
require('jsdom-global')();
var assert = require('chai').assert;
var TextLooper = require('../dist/textLooper');

var node = document.createElement('span');
var tl, attrs;

var globalDefaults = {
  delay: 1500,
  in: 'fadeIn',
  out: 'fadeOut',
  selector: 'data-textlooper',
  separator: ','
};

function phraseGenerator(n, separator = ', ', returnArray = false) {
  separator = separator || ', ';
  var arr = new Array(n).fill()
    .map(function (item, index) {
      return 'Phrase ' + (index + 1);
    });
  return returnArray ? arr : arr.join(separator);
}

function sel(str = '') {
  return globalDefaults.selector + ((!str.length) ? '' : '-' + str);
}

describe('Initializing with javascript', function () {
  it('should have the same attributes as the original parse method result', function () {
    var opts = {
      phrases: phraseGenerator(2, ',', true),
      ins: ['slideInUp', 'slideOutUp'],
      outs: null
    }
    var attr1 = new TextLooper(node, opts).getAttributes();

    node.textContent = phraseGenerator(2, ',');
    node.setAttribute(sel('in'), 'slideInUp|slideOutUp');

    var attr2 = new TextLooper(node).getAttributes();
    assert.deepEqual(attr1, attr2);
  });
});

describe('Parsing node attributes', function () {
  it('should transform the node\'s text content into an array of strings', function () {
    node = document.createElement('span');
    node.textContent = phraseGenerator(4, ',');
    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.phrases, phraseGenerator(4, ',', true));
  });
  it('should transform the node\'s text content into an array of strings with a custom separator', function () {
    var customSeparator = ' @@ ';
    node.textContent = phraseGenerator(4, customSeparator);
    node.setAttribute(sel('separator'), customSeparator);

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.phrases, phraseGenerator(4, customSeparator, true));
  });

  it('should set the number of in-animations based on the default value and the number of phrases if in-animations are not defined', function () {
    node.setAttribute(sel('separator'), globalDefaults.separator);
    for(let i = 1; i <= 10; i++) {
      node.textContent = phraseGenerator(i);
      attrs = new TextLooper(node).getAttributes();
      assert.equal(attrs.ins.length, i);
    }
  });

  it('should set the number of out-animations based on the default value and the number of phrases if out-animations are not defined', function () {
    for(let i = 1; i <= 10; i++) {
      node.textContent = phraseGenerator(i);
      node.setAttribute(sel('out'), '');
      attrs = new TextLooper(node).getAttributes();
      assert.equal(attrs.outs.length, i);
    }
  });

  it('should set the number of delays based on the number the default value and of phrases if delays are not defined', function () {
    for(let i = 1; i <= 10; i++) {
      node.textContent = phraseGenerator(i);
      attrs = new TextLooper(node).getAttributes();
      assert.equal(attrs.delays.length, i);
    }
  });

  it('should have all defaults setted correctly when no delay, in and out animations are defined, ', function () {
    for(let i = 1; i <= 10; i++) {
      node.textContent = phraseGenerator(i);
      attrs = new TextLooper(node).getAttributes();
      assert.sameMembers(attrs.delays, new Array(i).fill(globalDefaults.delay));
      assert.sameMembers(attrs.ins, new Array(i).fill(globalDefaults.in));
      assert.sameMembers(attrs.outs, new Array(i).fill(globalDefaults.out));
    }
  });

  it('should set out animations from in animations when data-textlooper-comeback is defined,', function () {
    node.textContent = phraseGenerator(2);
    node.removeAttribute(sel('out'));
    node.setAttribute(sel('comeback'), '');

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.outs, new Array(2).fill(globalDefaults.in));
  });

  it('should ignore comeback attribute when data-textlooper-comeback and data-textlooper-out are defined', function () {
    node.textContent = phraseGenerator(2);
    node.setAttribute(sel('out'), '');

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.outs, new Array(2).fill(globalDefaults.out));

    node.removeAttribute(sel('comeback'));
    node.removeAttribute(sel('out'));
  });

  it('should have three defined delays when there are three phrases and data-textlooper value is defined', function () {
    node.textContent = phraseGenerator(3);
    node.setAttribute(sel(), '5000')

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.delays, new Array(3).fill(5000));
  });

  it('should have completed the incomplete delay list with copies of its first entry', function () {
    node.textContent = phraseGenerator(3);
    node.setAttribute(sel(), '5000|2500')

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.delays, [5000, 2500, 5000]);
  });

  it('should have completed the incomplete in-animations list with copies of its first entry', function () {
    node.setAttribute(sel('in'), 'fadeIn|slideInUp');

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.ins, ['fadeIn', 'slideInUp', 'fadeIn']);
  });

  it('should have completed the incomplete out-animations list with copies of its first entry', function () {
    node.setAttribute(sel('out'), 'fadeOut|slideOutDown');

    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.outs, ['fadeOut', 'slideOutDown', 'fadeOut']);
  });

  it('should have parsed an element\'s complete in-animations list without modifications', function () {
    node.textContent = phraseGenerator(4);
    node.setAttribute(sel('in'), 'fadeIn|slideInUp|slideInDown|bounceIn');
    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.ins, ['fadeIn', 'slideInUp', 'slideInDown', 'bounceIn'])
  });

  it('should have parsed an element\'s complete out-animations list without modifications', function () {
    node.setAttribute(sel('out'), 'fadeOut|slideOutUp|slideOutDown|bounceOut');
    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.outs, ['fadeOut', 'slideOutUp', 'slideOutDown', 'bounceOut'])
  });

  it('should have parsed an element\'s complete delays list without modifications', function () {
    node.setAttribute(sel(), '1000|2000|3000|4000');
    attrs = new TextLooper(node).getAttributes();
    assert.sameMembers(attrs.delays, [1000, 2000, 3000, 4000]);
  });

});
