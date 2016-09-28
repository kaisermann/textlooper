/* jshint node: true */
/* global describe, it, beforeEach */
'use strict';
require('jsdom-global')();
var assert = require('chai').assert;
var TextLooper = require('../dist/textLooper');

var globalDefaults = {
  delay: 1500,
  in: 'fadeIn',
  out: 'fadeOut',
  selector: "data-textloop"
};

describe('Getting global default values', function () {
  var oldDefaults = TextLooper.getDefaults();
  it('should be the same as globalDefaults', function () {
    assert.deepEqual(oldDefaults, globalDefaults);
  });
});

describe('Setting global defaults', function () {
  it('should be different from globalDefaults', function () {
    TextLooper.setDefaultDelay(5000);
    TextLooper.setDefaultInAnimation('slideInUp');
    TextLooper.setDefaultOutAnimation('slideInDown');
    TextLooper.setSelector('text-loop');

    var newDefaults = TextLooper.getDefaults();

    assert.notDeepEqual(newDefaults, globalDefaults);
    assert.equal(newDefaults.delay, 5000);
    assert.equal(newDefaults.in, 'slideInUp');
    assert.equal(newDefaults.out, 'slideInDown');
    assert.equal(newDefaults.selector, 'text-loop');
  });
});


describe('Parsing node attributes', function () {
  var node = document.createElement('span');
  var tl;
  it('should throw "no text-loop attribute detected"', function () {
    tl = new TextLooper(node);
    assert.throws(tl.parseAttrs, 'TextLooper: no text-loop attribute detected');
  });
  it('should throw "no text detected"', function () {
    node.setAttribute('text-loop', null);
    tl = new TextLooper(node);
    assert.throws(tl.parseAttrs, 'TextLooper: no text detected');
  });
});
