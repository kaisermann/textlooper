# ViSC - Visibility State Controller JS

## Why?
> Have you ever found yourself in the need of knowing how much of an element is visible to, let's say, animate some of it styles depending on the percentage? Well, there you go!

## Compatibility 
- IE 9+
- jQuery & Zepto Compatible

## How To Use

#### Details
- 'Selector' can be a **string**, **node**, an **array of nodes**, a **NodeList** or a **jQuery object**.
- The events callback and the **'getState'** methods return an array list of the **VisibilityState Object**.


#### Vanilla JS
````
var selector = ".element";

// Creates a new ViSController
var visc = new Visc();

// Binds the scroll and resize events with a callback
// attached to the elements queried by the selector.
visc.bind(selector, function(states) {});

// Unbind all ViSC events related to the selector
visc.unbind();

// Gets the visibility state of a selector without
// binding scroll and resize events. 
var states = Visc.getState(selector);
````

#### jQuery / Zepto
````
var selector = ".element";

// Binds the scroll and resize events with a callback.
$(selector).visc(function(states){});

// Unbind all ViSC events related to the selector
$(selector).unvisc();

// Gets the visibility state of a selector without
// binding scroll and resize events. 
var states = $(selector).visc('getState');
````

### Visibility State Object
````
VisibilityState
{
	// How much of the element is visible?
	visibilityRate: { 
		both: Percentage, 
		horizontal: Percentage,
		vertical: Percentage
	},
	// How much space does the element occupies in the viewport?
	occupiedViewport: { 
		both: Percentage, 
		horizontal: Percentage,
		vertical: Percentage
	},
	// How much of the element you can see in your viewport?
	maxVisibility = { 
		both: Percentage, 
		horizontal: Percentage,
		vertical: Percentage
	},
	// Frames relative to the element
	frames = 
	{
		window: Rectangle Frame,
		element: Rectangle Frame,
		viewport: Rectangle Frame
	},
	// If the element is position on the screen (independent of its width and height)
	onScreen: boolean,
	// Current Element
	element: Node
}
````
### Static Methods
````
// Gets the visibility state of a selector without
// binding scroll and resize events. 
Visc.getState(selector);

// Gets the number of event binded ViSC instances 
Visc.getNumberOfInstances();

// Checks if a node or collection of nodes is visible on the viewport
// minValue: how much of each node must be visible to return true (0 to 1)
Visc.isVisible(selector[,min,[booleanMode]]);

// Checks if a node or a collection of nodes is positioned on the screen 
// (independent of its width and height)
Visc.isOnScreen = function (selector[,booleanMode]) 
````

##### BooleanMode
>In case of a collection parameter, the default behaviour of 'isOnScreen' and 'isVisible' is to check if **all** the nodes are visible/on screen. To change it to return true if **at least** one of the nodes is visible/on screen you can set the parameter **BooleanMode** to **Visc.BooleanMode.OR**.
````
Visc.BooleanMode { OR, AND }
````

## Examples 
##### Check if all '.blocks' are visible
```` 
var selector = ".block";
var allVisible = Visc.isVisible(selector);

if(allVisible)
	console.log("I can see everything!!!!!");
else
	console.log("Where did everyone go???");
````

##### Check if at least one '.blocks' is visible
```` 
var selector = ".block";
var oneVisibile = Visc.isVisible(selector, 0, Visc.BooleanMode.OR);

if(oneVisibile)
	console.log("Hey, I can see you!! Where are your other friends??");
else
	console.log("Where did everyone go???");
````

##### Check if scroll hit EACH zero width .block.tiny
```` 
var selector = ".block.tiny";
new Visc().bind(selector, function(states)
{
	states.forEach(function(state, i)
	{
		if(state.onScreen)
			console.log("Hey, you are very thin, but I can still see you!");
	});
});
```` 

##### Check if scroll hit ANY zero width .block.tiny
```` 
var selector = ".block.tiny";
window.addEventListener("scroll", function()
{
	var onScreen = Visc.isOnScreen(selector, Visc.BooleanMode.OR);
	if(onScreen)
		console.log("Hey, you are very thin, but I can still see you!");
});
````

##### Check if scroll hit ALL zero width .block.tiny
```` 
var selector = ".block.tiny";
window.addEventListener("scroll", function()
{
	var onScreen = Visc.isOnScreen(selector, 0);
	if(onScreen)
		console.log("Hey, you and your friends are very thin, but I can still see you!");
});
````

##### And so on...