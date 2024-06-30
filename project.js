let ragdoll;
let platforms = [];
let gravity = 0.18;
let ragdollSpeed = 1;
let platformSpeed = 1;
let offset = 0;
let acceleration = 5;
let isMousePressed = false;
let gameOver = false;
let score = 0;
let gameState = 'start';
let speedIncrement = 0.001; // Speed increment value
let bounceSpeedIncrement = 0.2; // Additional speed increment for each bounce
let img;
let ragdollImg; // Declare the ragdoll image
let cannon;
let spin = 0;
let fixedDistance = 250; // Fixed horizontal distance between platforms
let launchTime = 10; // Time for the ragdoll to be in launch state
let comicFont; // Declare the font variable
let gameOverTime = 0; // Add a variable to track game over time
let musicSound;
let launchSound;
let failSound;
let musicPlaying = false; // Track if the music is playing
let failSoundPlayed = false; // Add this at the beginning of your code
let monsterSound;
let fallSound;
let highestScore = 0; // Variable to store the highest score
let up = true;
let updown = 0;





function preload(){
  comicFont = loadFont('Playground.ttf'); // Load the font file
  musicSound = loadSound('basic.mp3');
  launchSound = loadSound('cannon2.mp3');
  failSound = loadSound('fail.mp3');
  monsterSound = loadSound('monstercatch.mp3');
  fallSound = loadSound('fallSound.mp3');
}

function setup() {
  createCanvas(1280, 720);
  resetGame();
  img = loadImage('monster.png');
  ragdollImg = loadImage('ragdoll.png'); // Load the ragdoll image
  cannon = loadImage('cannon.png');
}

function draw() {
  if (gameState === 'start') {
    displayStartScreen();
    return;
  } else if (gameState === 'launch') {
    displayLaunch();
    if (!musicPlaying) { // Check if the music is not already playing
      musicSound.loop(); // Use loop() instead of play() for continuous play
      musicSound.setVolume(0.3); // Set the volume (0.0 to 1.0)
      musicPlaying = true; // Set the flag to indicate the music is playing
    }
    return;
  } else if (gameState === 'gameOver') {
    if (millis() - gameOverTime < 1000) { // Check if 1 second has passed
      // Display the current scene
      background(220);
      translate(-offset, 0);
      
      for (let i = platforms.length - 1; i >= 0; i--) {
        platforms[i].update();
        platforms[i].display();
      }
      
      ragdoll.display();
      displayScore();
      displayDeathEffect(); // Display death effect during the delay period
    } else {
      displayGameOver();
    }
    return;
  }

  background(220);
  translate(-offset, 0);

  ragdoll.update();
  ragdoll.display();

  for (let i = platforms.length - 1; i >= 0; i--) {
    platforms[i].update();
    platforms[i].display();
    if (ragdoll.hits(platforms[i])) {
      if (ragdoll.y + ragdoll.r < platforms[i].y) {
        score++;
        ragdoll.bounce();
        ragdoll.y = platforms[i].y - platforms[i].h - ragdoll.r; // Reset the ragdoll's position on top of the platform
      } else {
        // Prevent the ragdoll from moving through the platform
        ragdoll.y = platforms[i].y - ragdoll.r;
        ragdoll.yspeed = 0;
      }
    }
    if (platforms[i].hasObstacle && ragdoll.hitsObstacle(platforms[i])) {
      // gameOver and gameState change already handled in hitsObstacle
    }
    if (platforms[i].x + platforms[i].w < offset + 200) {
      platforms.splice(i, 1);
      let lastPlatformX = platforms[platforms.length - 1].x; // Get the last platform's x position
      let platformX = lastPlatformX + fixedDistance + 100; // Fixed distance between platforms
      let platformY = 720;
      let platformH = random(200, 300);
      let platformW = random(50, 350);
      
      platforms.push(new Platform(platformX, platformY, platformH, platformW));
    }
  }

  offset += ragdollSpeed;

  displayScore();

  // Increase the ragdollSpeed gradually
  ragdollSpeed += speedIncrement;
}

function mousePressed() {
  if (mouseButton === LEFT) {
    isMousePressed = true;
    if (gameState === 'start') {
      gameState = 'launch';
      ragdoll.launch(); // Launch the ragdoll when the game starts
      
      if (musicSound.isPlaying()) {
        musicSound.stop(); // Stop the music sound if it is already playing
      }
      musicSound.loop(); // Use loop() instead of play() for continuous play
      musicSound.setVolume(0.3); // Set the volume (0.0 to 1.0)
      musicPlaying = true; // Set the flag to indicate the music is playing
    }
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    isMousePressed = false;
  }
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
    resetGame();
  } else if (gameState === 'start' && key === ' ') {
    gameState = 'launch';
    ragdoll.launch(); // Launch the ragdoll when the game starts
  }
}

function resetGame() {
  offset = 0;
  isMousePressed = false;
  gameOver = false;
  score = 0;
  ragdollSpeed = 1; // Reset the ragdoll speed
  ragdoll = new Ragdoll();
  platforms = [];
  let lastPlatformX = width / 2 - 500; // Start closer to the middle of the canvas

  for (let i = 0; i < 10; i++) {
    let platformX = lastPlatformX + fixedDistance + 50; // Fixed distance between platforms
    let platformY = 720;
    let platformH = random(200, 300);
    let platformW = random(50, 350);

    platforms.push(new Platform(platformX, platformY, platformH, platformW));
    lastPlatformX = platformX; // Update last platform position
  }
  gameState = 'start';
  musicPlaying = false; // Reset the music playing flag
  failSoundPlayed = false; // Reset the fail sound played flag

  if (musicSound.isPlaying()) {
    musicSound.stop(); // Stop the music sound if it is playing
  }
}


function displayStartScreen() {
  background(220);
  fill(255);
  textSize(70);
  textFont(comicFont);
  text('RAGDOLL',width/2,100+updown);
  fill(217,242,67);
  textSize(100);
  textFont(comicFont);
  text('FALL',width/2,170+updown);
  fill(255, 0, 0);
  if(up){
    updown+=0.5;
    if(updown>10){
      up = false;
    }
  }else{
    updown -= 0.5;
    if(updown<-10){
      up = true;
    }
  }
  
  // Make the font size change over time
  let fontSize = 20 + 5 * sin(millis() / 200);
  textSize(fontSize);
  textFont(comicFont);
  textAlign(CENTER, CENTER);
  text("Press 'Space' or 'Left Click' to Launch", width / 2, 270);

  // Draw the cannon (circle) and ragdoll inside it
  imageMode(CENTER);
  image(cannon, width/2, height / 2, 100, 100);
  fill(196, 31, 14);
  rect(565, 410, 150, 400, 30, 30, 0, 0);
}

function displayLaunch() {
  background(220);
  ragdoll.update();
  ragdoll.display();

  launchTime--;

  if (launchTime <= 0) {
    gameState = 'playing';
    launchTime = 10;
  }
}

function displayGameOver() {
  background(0);
  fill(255);
  textSize(100);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  textSize(20);
  text("Press 'R' to Restart", width / 2, height / 2 + 75);
  text(`Score: ${score}`, width / 2, height / 2 + 150);
  text(`Highest Score: ${highestScore}`, width / 2, height / 2 + 225);
  
  if (!failSoundPlayed) { // Check if the fail sound has not been played
    failSound.play(); // Play the fail sound effect
    failSoundPlayed = true; // Set the flag to indicate the sound has been played
  }
  
  if (musicSound.isPlaying()) {
    musicSound.stop(); // Stop the music sound if it is playing
  }
}


function displayScore() {
  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 1120 + offset, 10);
  text(`Highest Score: ${highestScore}`, 10 + offset, 10);
  if (score > highestScore) {
    highestScore = score;
  }

}

function displayDeathEffect() {
  fill(255, 0, 0, 150); // Red tint
  rect(0, 0, 0, 0);
}
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, -5);
    this.vy = random(-2, -0.5);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  display() {
    noStroke();
    fill(214,134,67, this.alpha);
    ellipse(this.x, this.y, 10);
  }

  isFinished() {
    return this.alpha < 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticle(x, y) {
    this.particles.push(new Particle(x, y));
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    for (let particle of this.particles) {
      particle.display();
    }
  }
}

class ExplosionEffect {
  constructor(x, y) {
    this.particles = [];
    for (let i = 0; i < 50; i++) { // Increase number of particles for a more intense effect
      this.particles.push(new ExplosionParticle(x, y));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    for (let particle of this.particles) {
      particle.display();
    }
  }

  isFinished() {
    return this.particles.length === 0;
  }
}

class ExplosionParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-5, 5);
    this.vy = random(-5, 5);
    this.alpha = 100;
    this.size = random(10,20); // Random size for variation
    this.color = color(random(255), random(255), random(255), this.alpha); // Random color
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
    this.color.setAlpha(this.alpha);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.alpha < 0;
  }
}


class Ragdoll {
  constructor() {
    this.x = width/2;
    this.y = height / 2; // Start inside the cannon
    this.r = 20;
    this.yspeed = 0;
    this.bounceCooldown = 0;
    this.rotation = 0; // Initialize rotation
    this.xspeed = 0;
    this.particleSystem = new ParticleSystem(); // Add particle system
    this.hitEffects = []; // Array to store hit effects
  }

  update() {
    if (gameState === 'launch') {
      this.x += this.xspeed;
      this.y += this.yspeed;
    } else if (gameState === 'playing') {
      if (isMousePressed) {
        this.yspeed += gravity + acceleration;
      } else {
        this.yspeed += gravity;
      }
      this.y += this.yspeed;

      // Check if ragdoll is about to hit the ground
      if (this.y > height - this.r) {
        gameOver = true;
        gameOverTime = millis(); // Set the game over time
        gameState = 'gameOver';
        this.triggerDeathEffect(); // Trigger death effect
        fallSound.play(); // Play the fall sound effect
      }

      if (this.bounceCooldown > 0) {
        this.bounceCooldown--;
      }

      // Check for platform collision before updating y position
      for (let i = 0; i < platforms.length; i++) {
        if (this.hits(platforms[i])) {
          if (this.y + this.r < platforms[i].y) {
            score++;
            this.bounce();
            this.y = platforms[i].y - platforms[i].h - this.r; // Reset the ragdoll's position on top of the platform
            this.hitEffects.push(new ExplosionEffect(this.x + offset, this.y)); // Trigger hit effect
          } else {
            // Game over if ragdoll hits the platform from below or side
            gameOver = true;
            gameOverTime = millis(); // Set the game over time
            gameState = 'gameOver';
            this.triggerDeathEffect(); // Trigger death effect
          }
        }
        if (platforms[i].hasObstacle && this.hitsObstacle(platforms[i])) {
          // gameOver and gameState change already handled in hitsObstacle
        }
      }
    }

    // Update the particle system
    this.particleSystem.addParticle(this.x + offset, this.y);
    this.particleSystem.update();

    // Update and remove finished hit effects
    for (let i = this.hitEffects.length - 1; i >= 0; i--) {
      this.hitEffects[i].update();
      if (this.hitEffects[i].isFinished()) {
        this.hitEffects.splice(i, 1);
      }
    }
  }

  display() {
    push();
    translate(this.x + offset, this.y);
    rotate(this.rotation);
    this.rotation += 0.02;
    imageMode(CENTER);
    image(ragdollImg, 0, 0, this.r * 4, this.r * 4); // Display the ragdoll image
    pop();

    // Display the particle system
    this.particleSystem.display();

    // Display hit effects
    for (let hitEffect of this.hitEffects) {
      hitEffect.display();
    }
  }

  hits(platform) {
    return (
      // this.bounceCooldown === 0 &&
      this.y + this.r > platform.y - platform.h &&
      this.y - this.r < platform.y &&
      this.x + offset > platform.x &&
      this.x + offset < platform.x + platform.w
    );
  }

  hitsObstacle(platform) {
    if (dist(this.x + offset, this.y, platform.obstacleX, platform.obstacleY) < this.r + platform.obstacleR) {
      gameOver = true;
      gameOverTime = millis(); // Set the game over time
      gameState = 'gameOver';
      this.triggerDeathEffect(); // Trigger death effect
      monsterSound.play(); // Play the monster sound effect
      return true;
    }
    return false;
  }

  bounce() {
    this.yspeed = -12;
    // this.bounceCooldown = 5; // Add a cooldown period to prevent immediate rebounce
    ragdollSpeed += bounceSpeedIncrement; // Increase the ragdoll speed with each bounce
  }

  launch() {
    this.yspeed = -5; // Initial vertical speed
    this.xspeed = 10; // Initial horizontal speed
    launchSound.play(); // Play the launch sound effect
    // launchSound.setVolume(5.0);
  }

  triggerDeathEffect() {
    // You can add any additional death effect logic here
  }
}


class Platform {
  constructor(x, y, h, w) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.obstacleR = 20; // Obstacle radius
    this.obstacleX = this.x + this.w / 2; // Initial obstacle position
    this.obstacleY = this.y - this.h - this.obstacleR;
    this.hasObstacle = random() < 0.3; // 30% chance to have an obstacle
    this.obstacleSpeed = 2; // Speed at which the obstacle moves
    this.obstacleDirection = 1; // Direction of the obstacle's movement
  }

  update() {
    // Move the obstacle back and forth
    if (this.hasObstacle) {
      this.obstacleX += this.obstacleSpeed * this.obstacleDirection;
      if (this.obstacleX < this.x || this.obstacleX > this.x + this.w) {
        this.obstacleDirection *= -1;
        this.obstacleX = constrain(this.obstacleX, this.x, this.x + this.w);
      }
    }
  }

  display() {
    fill(196, 31, 14);
    noStroke();
    rect(this.x, this.y - this.h, this.w, this.h, 10, 10, 0, 0);
    if (this.hasObstacle) {
      imageMode(CENTER);
      image(img, this.obstacleX, this.obstacleY, this.obstacleR * 2 + 20, this.obstacleR * 2 + 20); // Display the obstacle
    }
  }
}
