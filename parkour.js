
// Initialize the game when the window loads
window.onload = function() {
	Crafty.init(800, 800);

	Crafty.c("Block", {
		required: "2D, Canvas, Color",

		init() {
			this.x = 0;
			this.y = 0;
			this.w = 80;
			this.h = 10;
		}
	});

	// Forked from Twoway
	Crafty.c("Player", {

		init: function () {
			this.requires("Multiway, Jumper");
		},

		player: function (speed, jumpSpeed) {
			// Set multiway with horizontal speed only
			var hSpeed = speed || this._speed;
			this.multiway({x: hSpeed}, {
				RIGHT_ARROW: 0,
				LEFT_ARROW: 180,
				D: 0,
				A: 180,
				Q: 180
			});

			this.jumper(jumpSpeed || speed * 2 || this._jumpSpeed, [
				Crafty.keys.UP_ARROW,
				Crafty.keys.SPACE,
			]);

			return this;
		}
	});

	var callback = function() {

		// Add some blocks in steps going up with some gaps in between
		var distanceBetween = 180;
		var distanceUp = 60;

		var startX = 0;
		var startY = 600;

		while (startX < 760 && startY > 100) {
			var block = Crafty.e("Block").color("green");
			block.x = startX;
			block.y = startY;
			startX += distanceBetween + block.w;
			startY -= distanceUp;
		}

		var fox = Crafty.e('2D, Canvas, Gravity, runner_start, KeyboardState, SpriteAnimation, Player')
			.attr({x: 5, y: 600})  // This sets initial position
			.player(180, 200)
			.gravity("Block")
			.reel("running", 1000, [[0,0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
					       [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]])
			.bind('UpdateFrame', function () {
				// Detect that the fox fell off the screen.
				if (this.y >= 800) {
					this.x = 5;
					this.y = 550;
				}	
			});
		fox.flip("X");
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

