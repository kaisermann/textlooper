var Tiq = require("./dist/tiq.js");

new Tiq()
.add(500, function(){ console.log("Print 1"); })  // Adds a method to the queue with delay of 500ms
.add(500, function(){ console.log("Print 2"); }) // Adds a method to the queue with delay of 1000ms
.add(500, function(){ console.log("Print 3"); }) // Adds a method to the queue with delay of 1000ms
.add(200, function(){ console.log("Print 4"); }) // Adds a method to the queue with delay of 2000ms
.before(function() { console.log("Print 0"); })   // Method to be executed before the queue itself
.after(function() // Method executed after the queue ends
{ 
	new Tiq()
	.setQueue([ // Sets the whole queue through an array of [delay, method]
		[100, function() { console.log("Loop 1"); }],
		[100, function() { console.log("Loop 2"); }],
		[100, function() { console.log("Loop 3"); }],
		])
	.before(function(){console.log("Starting loop");})
	.after(function(){console.log("There's no after while looping (this will never be executed).");})
	// Executed at the end of a loop iteration
	.iteration(function (count) // The iteration number is passed as a parameter
	{ 
		console.log("End of one loop iteration " + count);
		if(count==5)
			this.pause(); // Stops the queue
	})
	.loop(); // Start looping through the queue
})
.start();

