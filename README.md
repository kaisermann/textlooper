# Whaaaaat?

* A very customizable and lightweight (1.35kB gzipped) text content looper based on CSS animations.
* This script uses `@keyframe` animations. That said, I highly recommend using [**Animate.css**](https://daneden.github.io/animate.css/).

# How to use

## Using html attributes

To loop an element's text, just set a `data-textlooper` attribute on the desired element and call the `TextLooper.seek()` method somewhere on your code.

#### Attributes
* `data-textlooper` _(mandatory)_

  * Use `data-textlooper` with a single interval to specify a delay between all elements
  * Use `data-textlooper` with intervals separated by '|' to specify each delay

* `data-textlooper-separator` _(optional)_

  * Changes the default separator `,`

* `data-textlooper-in` _(optional)_

  * Use `data-textlooper-in` with a single animation name to specify the 'in'/'intro' animation to all elements
  * Use `data-textlooper-in` with animation names separated by '|' to specify each element's 'in'/'intro' animation
  * Defaults to `fadeIn` if defined without values

* `data-textlooper-out` _(optional)_

  * Use `data-textlooper-out` with a single animation name to specify the 'out'/'outro' animation to all elements
  * Use `data-textlooper-out` with animation names separated by '|' to specify each element's 'out'/'outro' animation
  * Defaults to `fadeOut` if defined without values

* `data-textlooper-comeback` _(optional)_

  * Set the `data-textlooper-comeback` attribute if it's desired to also run the inverted animations before changing to the next phrase.
  * Will be ignore if defined together with `data-textlooper-out`

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

<table>
    <thead>
        <tr>
            <th>
                Attribute Name
            </th>
            <th>
                Description
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                phrases
            </td>
            <td>
                <code>Array</code>: phrases to loop through
            </td>
        </tr>
        <tr>
            <td>
                ins
            </td>
            <td>
                <code>String</code>: a single in-animation for all iterations.
                <br> <code>Array</code>: customizable in-animations to each iteration.
            </td>
        </tr>
        <tr>
            <td>
                outs
            </td>
            <td>
                <code>String</code>: a single out-animation for all iterations.
                <br> <code>Array</code>: customizable out-animations to each iteration.
            </td>
        </tr>
        <tr>
            <td>
                delays
            </td>
            <td>
                <code>Integer</code>: a single delay interval for all iterations.
                <br> <code>Array</code>: customizable delay intervals to each iteration.
            </td>
        </tr>
        <tr>
            <td>
                comebackAsOut
            </td>
            <td>
                A <code>boolean</code> defining if the out-animation should be the respective reversed in-animation.
            </td>
        </tr>
    </tbody>
</table>

# Observations

## Visibility

LoopText sets 'visibility: visible' when it loops. This way you can hide your phrases before the script runs with a 'visibility: hidden' statement.

## Delay interval behaviour

For text-lopping WITHOUT comeback/out animations the delay interval starts counting AFTER the current animation has ended.

For text-looping WITH comeback/out animations the delay interval starts AFTER the first iteration of an animation but not after its comeback/out animations.

## Missing list items

Each missing animation/delay item will be replaced with the first one of its list.

Example:

```html
<span data-textlooper="700|1000|500" data-textlooper-in="pulse|fadeIn|swing">
  Multiple, animations, on, this, one
</span>
```

There are 5 different text elements and only three in-animations/delay items. The two missing items will be replaced by, respectively, '700' and 'pulse'.

# Examples

#### [Live examples](http://kaisermann.github.io/textlooper/)

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
// Look for (new) textLoopable elements
TextLooper.seek();

// Overrides default values
TextLooper.setDefaults({
  delay: 1500,
  in: 'fadeIn',
  out: 'fadeOut',
  selector: 'data-textlooper',
  separator: ','
});

// Gets TextLooper default values
TextLooper.getDefaults();
```

# Compatibility

IE 10, Webkit 4.0, Firefox 16, Opera 15

# Bonus credits

* [Vitor Paladini](https://github.com/vtrpldn) for naming the `data-textlooper-comeback` attribute. (It was really hard to come with a name for it and he mockingly requested for credits, so here we are).
