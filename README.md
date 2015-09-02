## Whaaaaat?

* A very lightweight text content looper. 
* This script uses a **@keyframe** animation to animate elements. That said, I highly recommend using [**Animate.css**](https://daneden.github.io/animate.css/).     
    * Classes used "animated animationName"

## How to use

* To loop an element text, just set a '**data-textloop**' attribute on the desired element.
* Use '**data-textloop-separator**' to change the defualt separator (,)
* Use '**data-textloop**' with a single interval to specify a delay between all elements
* Use '**data-textloop**' with intervals separated by '|' to specify each delay
* Use '**data-textloop-animation**' with a single animation name to specify an animation to all elements
* Use '**data-textloop-animation**' with animation names separated by '|' to specify each element's animation

##### Examples

````
<!-- Default animation (fadeIn), default delay (1500), default separator (,) -->
<span data-textloop>
    Default, Phrase 1, Phrase 2, Phrase 3
</span>

<!-- Default animation (fadeIn), default delay (1500), custom separator (&) -->
<span data-textloop data-textloop-separator="&">
    Let's, Change & The, Separator & He he
</span>

<!-- Default animation (fadeIn), one delay (1000), custom separator (&) -->
<span data-textloop="1000" data-textloop-separator="&">
    This & will & wait & one & second
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
````

### Methods
````
// Sets a new delay default (in milliseconds)
TextLooper.setDefaultDelay(newDelay);

// Sets a new animation name default
TextLooper.setDefaultAnimation(newAnimationName);

// Look for new textLoopable elements
TextLooper.refreshElements();
````

## Compatibility 
- IE 10+ (uses classList)

