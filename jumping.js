// Initialize the game when the window loads
window.onload = function() {
	Crafty.init(800, 400);


	var callback = function() {
		var ground = Crafty.e('Ground, 2D, Canvas, Color')
			.attr({x: 0, y:320, w: 800, h: 15})
			.color('green');

		var fox = Crafty.e('2D, Canvas, Gravity, runner_start, KeyboardState, SpriteAnimation, Twoway')
			.attr({x: 25, y: 300})  // This sets initial position
			.twoway(180, 200)  // This sets speed
			.gravity("Ground")
			.reel("running", 1000, [[0,0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
					       [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]);
		
		// This "subscribes" to a "KeyDown" event. Any time a key pushed down this
		// function will get called. 
		fox.bind("KeyDown", function(e) {
			if (e.key == Crafty.keys.RIGHT_ARROW) {
				this.flip("X");

				if (!this.isPlaying("running")) {
					this.animate("running", -1); // -1 means loop indefinitely
				}
			} else if (e.key == Crafty.keys.LEFT_ARROW) {
				this.unflip("X");
				if (!this.isPlaying("running")) {
					this.animate("running", -1);
				}
			}
		});

		fox.bind("KeyUp", function(e) {
			if (!this.isKeyDown("RIGHT_ARROW") 
				&& !this.isKeyDown("LEFT_ARROW")
				&& !this.isKeyDown("UP_ARROW")) {
				console.log("pausing animation");
				this.pauseAnimation();
			}
		});
	}

	var assetsObj = {
		"sprites": {
			// This spritesheet has 12 images, in a 2 by 6 grid
			// The dimensions are 918x278
			"fox_running.png": {
				// This is the width of each image in pixels
				tile: 153,
				// The height of each image
				tileh: 139,
				// We give names to three individual images
				map: {
					runner_start: [0, 0],
					runner_middle: [5, 0],
					runner_end: [5, 1]
				}
			}
		}
	};

	Crafty.load(assetsObj, callback)
};

