## Whaaaaat?

* A very lightweight (1.05kB gzipped) text content looper based on CSS animations.
* This script uses a **@keyframe** animation to animate elements. That said, I highly recommend using [**Animate.css**](https://daneden.github.io/animate.css/).	 
	* Classes used "animated animationName"

## How to use

* To loop an element text, just set a `data-textloop` attribute on the desired element.

* `data-textloop` *(mandatory)*
  * Use `data-textloop` with a single interval to specify a delay between all elements
  * Use `data-textloop` with intervals separated by '|' to specify each delay


* `data-textloop-separator` *(optional)*
  * Changes the default separator `,`


* `data-textloop-in` *(optional)*
  * Use `data-textloop-in` with a single animation name to specify the 'in'/'intro' animation to all elements
  * Use `data-textloop-in` with animation names separated by '|' to specify each element's 'in'/'intro' animation
  * Defaults to `fadeIn` if defined without values


* `data-textloop-out` *(optional)*
  * Use `data-textloop-out` with a single animation name to specify the 'out'/'outro' animation to all elements
  * Use `data-textloop-out` with animation names separated by '|' to specify each element's 'out'/'outro' animation
  * Defaults to `fadeOut` if defined without values


* `data-textloop-comeback` *(optional)*
  * Set the `data-textloop-comeback` attribute if it's desired to also run the inverted animations before changing to the next phrase.
  * Will be ignore if defined together with `data-textloop-out`

## Observations

##### Visibility
LoopText sets 'visibility: visible' when it loops. This way you can hide your phrases before the script runs with a 'visibility: hidden' statement.

##### Interval behaviour

For text-lopping WITHOUT comeback/out animations the delay interval starts counting AFTER the current animation has ended.

For text-looping WITH comeback/out animations the delay interval starts AFTER the first iteration of an animation but not after its comeback/out animations.

##### Missing list items
Each missing animation/delay item will be replaced with the first one of its list.

Example:
```html
<span data-textloop="700|1000|500" data-textloop-in="pulse|fadeIn|swing">
  Multiple, animations, on, this, one
</span>
```

There are 5 different text elements and only three in-animations/delay items. The two missing items will be replaced by, respectively, '700' and 'pulse'.


## Examples

##### [Live examples](http://kaisermann.github.io/textlooper/)

````html
<!-- Default animation (fadeIn), default delay (1500), default separator (,) -->
<span data-textloop>
	Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Same animation as above but with its comeback animations -->
<span data-textloop data-textloop-comeback>
	Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Default animation (fadeIn), default delay (1500), custom separator (|) -->
<span data-textloop data-textloop-separator="|">
	Let's, Change | The, Separator | He he
</span>

<!-- Default animation (fadeIn), one delay (1000), custom separator (|) -->
<span data-textloop="1000" data-textloop-separator="|">
	This | will | wait | one | second
</span>

<!-- Default animation (fadeIn), multiple delays -->
<span data-textloop="500|500|500|500|1000">
	Multiple, delays, one, default, animation
</span>

<!-- Default delay (1500), one animation (bounceIn) -->
<span data-textloop data-textloop-animation="bounceIn">
	Default, delay, one, custom, animation
</span>

<!-- Default delay (1500), multiple animations -->
<span data-textloop data-textloop-animation="pulse|fadeIn|swing|fadeOut|bounceIn">
	Multiple, animations, one, default, delay
</span>

<!-- One delay (1000), multiple animations -->
<span data-textloop="1000" data-textloop-animation="pulse|fadeIn|swing|fadeOut|bounceIn">
	Multiple, animations, one, delay
</span>

<!-- Multiple animations, multiple delays -->
<span data-textloop="500|500|500|500|1000" data-textloop-animation="pulse|fadeIn|swing|fadeOut|bounceIn">
	Multiple, animations, on, this, one
</span>

<!-- Multiple animations, multiple delays with comeback animations -->
<span data-textloop="500|500|500|500|1000" data-textloop-animation="pulse|fadeIn|swing|slideInUp" data-textloop-comeback>
  Multiple, animations, on, this, one
</span>
````

### Methods
````js
// Sets a new default delay (in milliseconds)
TextLooper.setDefaultDelay(newDelay);

// Sets a new animation default name
TextLooper.setDefaultAnimation(newAnimationName);

// Look for new textLoopable elements
TextLooper.refreshElements();
````

## Compatibility
* IE 10, Webkit 4.0, Firefox 16, Opera 15 (animationend, classList)
* CSS 3.0 (@keyframes)

## Bonus credits
* [Vitor Paladini](https://github.com/vtrpldn) for naming the `data-textloop-comeback` attribute. (It was really hard to come with a name for it and he mockingly requested for credits, so here we are).
