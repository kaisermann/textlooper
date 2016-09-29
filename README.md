# Whaaaaat?

- A very lightweight (1.05kB gzipped) text content looper based on CSS animations.
- This script uses a **@keyframe** animation to animate elements. That said, I highly recommend using [**Animate.css**](https://daneden.github.io/animate.css/).

  - Classes used "animated animationName"

# How to use

## Using html attributes

To loop an element text, just set a `data-textloop` attribute on the desired element

- `data-textloop` _(mandatory)_

  - Use `data-textloop` with a single interval to specify a delay between all elements
  - Use `data-textloop` with intervals separated by '|' to specify each delay

- `data-textloop-separator` _(optional)_

  - Changes the default separator `,`

- `data-textloop-in` _(optional)_

  - Use `data-textloop-in` with a single animation name to specify the 'in'/'intro' animation to all elements
  - Use `data-textloop-in` with animation names separated by '|' to specify each element's 'in'/'intro' animation
  - Defaults to `fadeIn` if defined without values

- `data-textloop-out` _(optional)_

  - Use `data-textloop-out` with a single animation name to specify the 'out'/'outro' animation to all elements
  - Use `data-textloop-out` with animation names separated by '|' to specify each element's 'out'/'outro' animation
  - Defaults to `fadeOut` if defined without values

- `data-textloop-comeback` _(optional)_

  - Set the `data-textloop-comeback` attribute if it's desired to also run the inverted animations before changing to the next phrase.
  - Will be ignore if defined together with `data-textloop-out`

## Using javascript

It is possible to start looping a text node just by passing it as a parameter to a new instance of a TextLooper object.

Example:

```javascript
new TextLooper(node, {
  phrases: ['Array','of','phrases','to','loop']
  ins: ['slideInUp'],
  outs: ['slideOut'],
  delays: [1000,1000,2000,3000,3000],
  comebackAsOut: false
}).start();
```

Attribute Name | Description
:------------- | :------------------------------------------------------------------------------------------------------------------
phrases        | `Array`: phrases to loop through
ins            | `String`: a single in-animation for all iterations.<br>
`Array`: customizable in-animations to each iteration.
outs           | `String`: a single out-animation for all iterations.<br>
`Array`: customizable out-animations to each iteration.
delays         | `Integer`: a single delay interval for all iterations.<br>
`Array`: customizable delay intervals to each iteration.
comebackAsOut  | A boolean defining if the out-animation should be the respective reversed in-animation

# Observations

## Visibility

LoopText sets 'visibility: visible' when it loops. This way you can hide your phrases before the script runs with a 'visibility: hidden' statement.

## Interval behaviour

For text-lopping WITHOUT comeback/out animations the delay interval starts counting AFTER the current animation has ended.

For text-looping WITH comeback/out animations the delay interval starts AFTER the first iteration of an animation but not after its comeback/out animations.

## Missing list items

Each missing animation/delay item will be replaced with the first one of its list.

Example:

```html
<span data-textloop="700|1000|500" data-textloop-in="pulse|fadeIn|swing">
  Multiple, animations, on, this, one
</span>
```

There are 5 different text elements and only three in-animations/delay items. The two missing items will be replaced by, respectively, '700' and 'pulse'.

# Examples

## [Live examples](http://kaisermann.github.io/textlooper/)

```html
<!-- Default animation (fadeIn), default delay (1500), default separator  -->
<span data-textlooper>
	Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Same animation as above but with its comeback animations -->
<span data-textlooper data-textlooper-comeback>
	Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Same animation as above but with default out animation (fadeOut -->
<span data-textlooper data-textlooper-out>
	Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Default animation (fadeIn), default delay (1500), default separator  -->
<span data-textlooper>
	Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Default animation (fadeIn), default delay (1500), custom separator  -->
<span data-textlooper data-textlooper-separator="|">
	Let's, Change | The, Separator | He he
</span>

<!-- Default animation (fadeIn), one delay (1000), custom separator  -->
<span data-textlooper="1000" data-textlooper-separator="|">
	This | will | wait | one | second
</span>

<!-- Default animation (fadeIn), multiple delays -->
<span data-textlooper="500|500|500|500|1000">
	Multiple, delays, one, default, animation
</span>

<!-- Default delay (1500), one animation (bounceIn -->
<span data-textlooper data-textlooper-in="bounceIn">
	Default, delay, one, custom, animation
</span>

<!-- Default delay (1500), multiple animations -->
<span data-textlooper data-textlooper-in="pulse|fadeIn|swing|fadeOut|bounceIn">
	Multiple, animations, one, default, delay
</span>

<!-- One delay (1000), multiple animations -->
<span data-textlooper="1000" data-textlooper-in="pulse|fadeIn|swing|slideInLeft">
	Multiple, animations, one, delay
</span>

<!-- Multiple animations, multiple delays -->
<span data-textlooper="500|500|500|500|1000" data-textlooper-in="pulse|fadeIn|swing|slideInUp">
	Multiple, animations, on, this, one
</span>

<!-- Multiple animations, multiple delays with comebacks -->
<span data-textlooper="500|500|500|500|1000" data-textlooper-in="pulse|fadeIn|swing|slideInUp" data-textlooper-comeback>
	Multiple, animations, on, this, one
</span>
```

## Methods

```javascript
var node = document.createElement('span'), tl;

// Creates a new instance and parses the node's attributes
tl = new TextLooper(node);

// Creates a new instance and skips the parsing step
tl = new TextLooper(node, {
  phrases: ['Phrase 1','Phrase 2'],
  ins: 'fadeIn',
  comebackAsOut: true
});

// Starts looping
tl.start();

// Gets an instance attributes (phrases, animations, delays and separator)
tl.getAttributes();
```

##### Static

```javascript
// Look for new textLoopable elements
TextLooper.seek();

// Overrides default values
TextLooper.setDefaults({
  delay: 1500,
  in: 'fadeIn',
  out: 'fadeOut',
  selector: 'data-textlooper',
  loopingClass: 'textlooper--looping',
  separator: ','
});

// Gets TextLooper default values
TextLooper.getDefaults();
```

# Compatibility

IE 10, Webkit 4.0, Firefox 16, Opera 15

# Bonus credits

- [Vitor Paladini](https://github.com/vtrpldn) for naming the `data-textloop-comeback` attribute. (It was really hard to come with a name for it and he mockingly requested for credits, so here we are).
