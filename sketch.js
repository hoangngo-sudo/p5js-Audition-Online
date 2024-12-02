// sketch.js
// Audition Online

// Minh Ngo

// Reference for adding js confetti effect at the end of the game
// Demo: https://loonywizard.github.io/js-confetti/
// GitHub Repository: https://github.com/loonywizard/js-confetti?tab=readme-ov-file for more information

// Original server-side game website version 1:https://au.vtc.vn/
// Official server-side game website version 2:https://au2pc.vtcgame.vn/

// example gameplay that I used to play back in 2012:https://www.youtube.com/watch?v=1_CfktSym0E

//-Game-State-Variables-----------------
//--------------------------------------

let stage = 0; // Tracks the current stage of the game

//-Fade-Effect-Variables-----------------
//---------------------------------------

let fade = 0; // Controls the opacity of text elements for fade-in and fade-out effects
let fadeAmount = 1; // Determines the rate at which 'fade' changes (positive for fade-in, negative for fade-out)

//-Script and Instruction Variables------
//---------------------------------------

let scriptCount = 0; // Index to track the current script/message being displayed in the intro
const scripts = [
  `Welcome to p5js Audition Online`,                               // Introduction message
  `We are here to help you become a professional audition dancer`, 
  `Make your move and show your talent`,                           
  `Always remember that practice makes perfect`,                   
  `Now, without further ado, let's practice together`,
];

let instruction = `In order to become a professional dancer, you need to learn through practicing basic routines and knowing your moves. This small game will help you to practice your reflexes. The game will generate random moves each time you play in a routine. To win this game, you would have to remember the moves and the order of each move. There are arrows to help you which key you should press when you see a specific move. You have three hearts representing your trials, and you have to complete a routine within a frame of time to secure these hearts. The game will end when you lose all your hearts. This game is a small version of the actual game. In the actual game, you have to remember each move and its corresponding order (arrow). The more times you play, the sooner you will become a professional audition dancer. Good luck! 

(Press ESC to continue)`; // Detailed instruction


//-Game-Assets-Variables----------------
//--------------------------------------

let move1, move2, move3, move4; // Objects to store different dance move images (combos)
let z; // Random index to select a combo from the 'combo' array
let combo; // Array holding all available combos
let arrows; // Array holding arrow images used for indicating player input
let standardHeight; // Standard height for images to maintain consistency
let font; // Variable to store the custom font

//-Sound-Variables----------------------
//--------------------------------------

// Arrays to store preloaded sound files
let preloadedSoundFiles = [];    // Stores background music tracks
let preloadedGameSounds = [];    // Stores gameplay-related sound effects
let currentGameSound;            // Reference to the currently playing game sound
let stage5SoundPlayed = false;   // Flag to ensure sounds are played only once in stage 5

let award, hand_clapping, lose;  // Sound variables for different game events
let backgroundImage;             // Background image for the game
var awaitImg;                    // Loading GIF image displayed during loading screens
let loadingStartTime = null;     // Timestamp when the loading screen starts

//-Gameplay-Variables-------------------
//--------------------------------------

let characterCount = 0;    // Counter for displaying characters progressively in the 'showCharr' function
let lives = 5;             // Player's remaining lives (represented as hearts)
let hit = 0;               // Number of correct moves made by the player in the current routine
let userKey = -1;          // Stores the player's last key input
let routine;               // Array storing the sequence of moves generated for the player to follow
let routineLength = 4;     // Initial length of the dance routine
let pass = true;           // Indicates if the player successfully passed the routine
let isStartGame = true;    // Flag to check if the game has just started
let score = 0;             // Player's current score
let win = false;           // Indicates if the player has won the game
let timePerRoutine = 4000; // Time allocated per routine (4 seconds)
let bgsong;                // Variable to hold the currently playing background music

//-UI element variables-----------------
//--------------------------------------

let nameInput;     // Input field for the player's name
let userName = ''; // Variable to store the player's entered name
let submitButton;  // Button to submit the entered name
let restartButton; // Button to restart the game after it ends
let quitButton;    // Button to quit the game and return to the start screen
let jsConfetti;    // Instance of JSConfetti for confetti effects at the end of the game

//-Sound-files-array--------------------
//--------------------------------------

const soundFiles = [
  'assets/main1.mp3', // Background music track 1
  'assets/main2.mp3', // Background music track 2
  'assets/main3.mp3', // Background music track 3
];

const gameSounds = [
  'assets/Turbo - Black Cat.mp3',                       // Gameplay sound 1
  'assets/Audition - How to Say.mp3',                   // Gameplay sound 2
  'assets/Audition - Mr. Detective.mp3',                // Gameplay sound 3
  'assets/Audition - You Are Here No More.mp3',         // Gameplay sound 4
  'assets/Audition - Tuyết Yêu Thương.m4a',             // Gameplay sound 5
  'assets/Audition - Please Tell Me Why FreeStyle.m4a', // Gameplay sound 6
  'assets/Audition - Never Say Goodbye.m4a',            // Gameplay sound 7
  'assets/BIGBANG - LIES.m4a'                           // Gameplay sound 8
];

//-Preload-function---------------------
//--------------------------------------

function preload() {
  // Load the custom font from the assets folder
  font = loadFont('assets/OpenSans-VariableFont_wdth,wght.ttf');

  // Load dance move images
  img1 = loadImage('assets/HatsuneMiku3.png'); // Dance move image 1
  img2 = loadImage('assets/HatsuneMiku2.png'); // Dance move image 2
  img3 = loadImage('assets/HatsuneMiku4.png'); // Dance move image 3
  img4 = loadImage('assets/HatsuneMiku1.png'); // Dance move image 4

  // Load arrow images for indicating player input
  downArrow = loadImage('assets/downArrow.png');   // Down arrow image
  upArrow = loadImage('assets/upArrow.png');       // Up arrow image
  rightArrow = loadImage('assets/rightArrow.png'); // Right arrow image
  leftArrow = loadImage('assets/leftArrow.png');   // Left arrow image

  // Load logo images
  logo = loadImage('assets/auditionLogo.png');    // Main logo image
  logo2 = loadImage('assets/auditionLogo2.png');  // Secondary logo image

  // Load caution image
  caution = loadImage('assets/caution.png'); // Caution PNG image displayed in stage 0

  // Load sound effects
  award = loadSound('assets/award.wav');                     // Sound played when the player wins
  backgroundImage = loadImage('assets/main_background.jpg'); // Main background image
  hand_clapping = loadSound('assets/hand_clapping.wav');     // Sound effect for hand clapping
  lose = loadSound('assets/lose.wav');                       // Sound played when the player loses

  // Load loading screen GIF
  awaitImg = loadImage('assets/await.gif'); // Loading GIF image

  // Preload Background Music (soundFiles)
  for (let i = 0; i < soundFiles.length; i++) { // Loop through each background music file
    let s = loadSound(soundFiles[i]); // Load the sound file
    preloadedSoundFiles.push(s);      // Add the loaded sound to the preloadedSoundFiles array
  }

  // Preload Gameplay Sounds (gameSounds)
  for (let i = 0; i < gameSounds.length; i++) { // Loop through each gameplay sound file
    let s = loadSound(gameSounds[i]); // Load the gameplay sound file
    preloadedGameSounds.push(s);      // Add the loaded sound to the preloadedGameSounds array
  }
}

//-Setup-function-----------------------
//--------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fits the entire window
  imageMode(CENTER);                        // Set image mode to CENTER for consistent positioning
  textAlign(CENTER);                        // Set text alignment to CENTER
  frameRate(60);                            // Set the frame rate to 60 frames per second
  textSize(30);                             // Set the default text size to 30 pixels
  textFont(font);                           // Apply the custom font to all text elements

  // Resize images to fit the window dimensions proportionally
  img1.resize(0, windowWidth / 8);          // Resize img1 to 1/8th of the window's width.
  img2.resize(0, windowWidth / 10);         // Resize img2 to 1/10th of the window's width.
  img3.resize(0, windowWidth / 8);          // Resize img3 to 1/8th of the window's width.
  img4.resize(0, windowWidth / 8);          // Resize img4 to 1/8th of the window's width.
  leftArrow.resize(0, windowWidth / 30);    // Resize leftArrow to 1/30th of the window's width
  rightArrow.resize(0, windowWidth / 30);   // Resize rightArrow to 1/30th of the window's width
  upArrow.resize(0, windowWidth / 30);      // Resize upArrow to 1/30th of the window's width
  downArrow.resize(0, windowWidth / 30);    // Resize downArrow to 1/30th of the window's width
  logo2.resize(0, windowHeight / 6);        // Resize logo2 to 1/6th of the window's height

  arrows = [leftArrow, upArrow, rightArrow, downArrow]; // Create an array of arrow images for easy access
  z = int(random(0, 3)); // Select a random integer between 0 and 2 to choose a combo

  // Define combo objects containing dance move images
  move1 = {
    moves: [img1, img2, img3, img4] // Combo 1 contains four different dance move images
  };

  move2 = {
    moves: [img1, img2, img3, img4] // Combo 2 contains the same four dance move images
  };

  move3 = {
    moves: [img1, img2, img3, img4] // Combo 3 contains the same four dance move images 
  };

  combo = [move1, move2, move3]; // Array holding all combo objects
  standardHeight = img3.height;  // Set a standard height based on img3 for consistent image sizing

  setInterval(checkRoutine, timePerRoutine); // Set a recurring interval to call 'checkRoutine' every 'timePerRoutine'

//-Create-buttons-----------------------
//--------------------------------------

  nameInput = createInput(''); // Create an input field for the player's name
  nameInput.position((windowWidth / 2.10) - 130, windowHeight / 2); // Position the input field near the center
  nameInput.size(200); // Set the width of the input field to 200 pixels
  nameInput.attribute('placeholder', 'Enter Your Name'); // Set placeholder text for the input field
  nameInput.class('input-field'); // Assign CSS class 'input-field' for styling

  submitButton = createButton(''); // Create a submit button for the player's name
  submitButton.html('<span>GO!</span>'); // Set the HTML content of the button to display 'GO!'
  submitButton.position((windowWidth / 2.10) + 70, windowHeight / 2); // Position the button next to the input field
  submitButton.mousePressed(submitName); // Assign the 'submitName' function to be called when the button is pressed
  submitButton.class('btn effect'); // Assign CSS classes 'btn' and 'effect' for styling

  restartButton = createButton(''); // Create a restart button for restarting the game
  restartButton.html('<span>Restart</span>'); // Set the HTML content of the button to display 'Restart'
  restartButton.position(windowWidth / 2 + 60, windowHeight / 2 + 100); // Position the button below the center
  restartButton.mousePressed(restartGame); // Assign the 'restartGame' function to be called when the button is pressed
  restartButton.class('btn effect'); // Assign CSS classes 'btn' and 'effect' for styling
  restartButton.hide(); // Initially hide the restart button until it's needed

  quitButton = createButton(''); // Create a quit button for exiting the game
  quitButton.html('<span>Quit</span>'); // Set the HTML content of the button to display 'Quit'
  quitButton.position(windowWidth / 2 - 180, windowHeight / 2 + 100); // Position the button below the center, to the left
  quitButton.mousePressed(quitGame); // Assign the 'quitGame' function to be called when the button is pressed
  quitButton.class('btn effect'); // Assign CSS classes 'btn' and 'effect' for styling
  quitButton.hide(); // Initially hide the quit button until it's needed

  if (stage !== 0) { // If the game is not in the initial stage (stage 0)
    nameInput.hide();   // Hide the name input field
    submitButton.hide(); // Hide the submit button
  }

  if (stage == 5) { // If the game is in stage 5 (endgame)
    restartButton.show(); // Show the restart button
    quitButton.show();    // Show the quit button
  }

  jsConfetti = new JSConfetti(); // Initialize the JSConfetti instance for confetti effects

  let bgSound = random(preloadedSoundFiles); // Randomly select a background music track from the preloaded sounds
  if (bgSound.isLoaded()) { // Check if the selected background music is fully loaded
    bgSound.loop();    // Play the background music in a loop
    bgsong = bgSound;  // Assign the playing background music to 'bgsong' for future reference
  }

  currentGameSound = null; // Initialize 'currentGameSound' as null since no game sound is playing
}

//-Submit-name-function-----------------
//--------------------------------------

function submitName() {
  let enteredName = nameInput.value().trim(); // Retrieve and trim the value entered in the name input field

  if (enteredName !== "") { // If the entered name is not empty
    userName = enteredName; // Store the entered name in 'userName'

    nameInput.hide();    // Hide the name input field after submission
    submitButton.hide(); // Hide the submit button after submission

    userStartAudio();     // Start user audio (required for some browsers to play sound)
    stage++;              // Advance the game to the next stage
  }
}

//-Restart-name-function----------------
//--------------------------------------

function restartGame() { // Function to reset and restart the game
  // Stop any currently playing game sound
  if (currentGameSound && currentGameSound.isPlaying()) {
    currentGameSound.stop(); // Stop the currently playing game sound if it exists
  }

  stage = 6;                // Set the stage to 6 (loading screen)
  score = 0;                // Reset the player's score to 0
  lives = 5;                // Reset the player's lives to 5
  routineLength = 4;        // Reset the routine length to its initial value of 4
  hit = 0;                  // Reset the hit counter to 0
  isStartGame = true;       // Set the flag to indicate the game is starting
  win = false;              // Reset the win flag to false
  characterCount = 0;       // Reset the character counter to 0
  userKey = -1;             // Reset the user's key input to -1 (no input)
  routine = [];             // Clear the current dance routine array
  restartButton.hide();     // Hide the restart button after restarting the game
  fade = 0;                 // Reset the fade value to 0 for text effects
  stage5SoundPlayed = false; // Reset the flag to allow sounds to be played again in stage 5
  loadingStartTime = null;  // Reset the loading start time for future loading screens
  submitButton.hide();      // Hide the submit button after restarting the game
  quitButton.hide();        // Hide the quit button after restarting the game
}

//-Quit-name-function-------------------
//--------------------------------------

function quitGame() { // Function to quit the game and return to the start screen
  stage = 0;                // Reset the game stage to 0 (start screen)
  score = 0;                // Reset the player's score to 0
  lives = 5;                // Reset the player's lives to 5
  routineLength = 4;        // Reset the routine length to its initial value of 4
  hit = 0;                  // Reset the hit counter to 0
  isStartGame = true;       // Set the flag to indicate the game is starting
  win = false;              // Reset the win flag to false
  characterCount = 0;       // Reset the character counter to 0
  userKey = -1;             // Reset the user's key input to -1 (no input)
  routine = [];             // Clear the current dance routine array
  restartButton.hide();     // Hide the restart button after quitting the game
  quitButton.hide();        // Hide the quit button after quitting the game
  fade = 0;                 // Reset the fade value to 0 for text effects
  stage5SoundPlayed = false; // Reset the flag to allow sounds to be played again in stage 5

  // Restart background music by selecting a new random track
  let bgSound = random(preloadedSoundFiles); // Randomly select a background music track
  if (bgSound.isLoaded()) { // Check if the selected background music is fully loaded
    bgSound.loop();    // Play the background music in a loop
    bgsong = bgSound;  // Assign the playing background music to 'bgsong' for future reference
  }

  loadingStartTime = null; // Reset the loading start time for future loading screens
}

//-Check-Routine-function---------------
//--------------------------------------

function checkRoutine() {
  if (stage == 4) { // Only execute if the game is in stage 4 (active gameplay stage)
    if (isStartGame) { // If the game has just started
      generateRoutine(); // Generate a new dance routine for the player to follow
      isStartGame = false; // Set the flag to false to prevent regenerating the routine multiple times

      selectAndPlayGameSound(); // Select and play a random game sound effect
    } else { // If the game has already started and a routine is in progress
      if (routineLength != hit) { // If the player did not complete the routine successfully
        lives -= 1; // Deduct one life from the player
      } else { // If the player successfully completed the routine
        score++; // Increment the player's score by one
      }

      // Check for game over conditions
      if (lives <= 0) { // If the player has no lives left
        stage++; // Advance the game to the next stage (typically game over stage)
        stopGameSound(); // Stop any currently playing game sounds
      } else if (score >= 10) { // If the player's score reaches or exceeds 10
        stage++; // Advance the game to the winning stage
        win = true; // Set the win flag to true
        stopGameSound(); // Stop any currently playing game sounds
      } else if (score != 0 && score % 4 == 0) { // Every 4 successful routines, increase difficulty
        routineLength += 2; // Increase the length of the routine by 2
      }

      if (stage != 5) { // If the game is not in stage 5
        hit = 0;        // Reset the hit counter for the next routine
        userKey = -1;   // Reset the user's key input
        generateRoutine(); // Generate a new dance routine for the player to follow
      }
    }
  }
}

//-Generate-routine-function------------
//--------------------------------------

function generateRoutine() {
  routine = []; // Initialize an empty array to store the dance routine
  for (let i = 0; i < routineLength; i++) { // Loop 'routineLength' times to generate moves
    let num = int(random(0, 4)); // Generate a random integer between 0 and 3 (inclusive)
    routine.push(num); // Add the generated move index to the 'routine' array
  }
  pass = false; // Reset the pass status (not utilized in the provided code)
}

//-Key-pressed-function-----------------
//--------------------------------------

function keyPressed() {
  if (keyCode == ENTER && stage == 0) { // If the ENTER key is pressed during stage 0
    submitName(); // Call the function to submit the player's name
  } else if (keyCode == LEFT_ARROW) { // If the LEFT_ARROW key is pressed
    userKey = 0; // Map LEFT_ARROW to move index 0
  } else if (keyCode == UP_ARROW) { // If the UP_ARROW key is pressed
    userKey = 1; // Map UP_ARROW to move index 1
  } else if (keyCode == RIGHT_ARROW) { // If the RIGHT_ARROW key is pressed
    userKey = 2; // Map RIGHT_ARROW to move index 2
  } else if (keyCode == DOWN_ARROW) { // If the DOWN_ARROW key is pressed
    userKey = 3; // Map DOWN_ARROW to move index 3
  } else if (keyCode == ESCAPE && stage == 3) { // If the ESCAPE key is pressed during stage 3
    stage = 6; // Transition the game to stage 6 (loading stage)
  } else if (keyCode == ESCAPE && stage != 4) { // If the ESCAPE key is pressed and not during gameplay
    stage++; // Advance the game to the next stage
  } 
}

//-Draw-function------------------------
//--------------------------------------

function draw() {
  // Draw the main background image centered on the canvas
  image(backgroundImage, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);

  if (stage == 0) {
    imageMode(CENTER); // Set image mode to CENTER for consistent positioning
    image(logo, windowWidth / 2, windowHeight / 2 - 150); // Display the main logo image slightly above the center

    push(); // Save the current drawing style settings

    text('copyright'); // Display the text 'copyright' (likely a placeholder or incomplete implementation)

    push(); // Save the current drawing style settings again
    imageMode(CORNER); // Change image mode to CORNER for positioning from the top-left
    // Draw the caution image at position (20, windowHeight - cautionHeight - 30)
    // with width set to windowWidth / 6 and height maintaining aspect ratio
    image(
      caution, 
      20, 
      windowHeight - ((caution.height / caution.width) * windowWidth / 6) - 30,
      windowWidth / 6, 
      (caution.height / caution.width) * windowWidth / 6
    );
    pop(); // Restore the previous drawing style settings

    // Display the name input field and submit button
    nameInput.show();    // Show the name input field
    submitButton.show(); // Show the submit button
  } 

  else if (stage == 1) {
    intro(); // Call the function to display introductory messages
    if (!bgsong.isPlaying()) { // If background music is not playing
      bgsong.loop(); // Loop the background music
    } // Added closing brace here (seems misplaced in the original code)
  } 

  else if (stage == 2) {
    instructionShow(); // Call the function to display game instructions
  } 

  else if (stage == 3) {
    showCharr(); // Call the function to display character moves and prompts
  } 

  else if (stage == 4) {
    if (!isStartGame) { // If the game has already started and a routine is active
      charrRoutine();    // Display the current dance routine
      scoreGenerate();   // Display the player's score and remaining lives

      // Display a progress bar at the bottom of the screen
      let baseHue = (frameCount * 50) % 360; // Calculate a dynamic hue value based on frame count
      fill(baseHue, 255, 255); // Set the fill color with the dynamic hue for the progress bar
      rectMode(CORNER);       // Set rectangle mode to CORNER for positioning
      // Draw the progress bar representing the player's progress in the current routine
      rect(0, windowHeight - 50, (windowWidth / routineLength) * hit, windowHeight / 30);

      // Check if the player's last key input matches the expected move in the routine
      if (userKey == routine[hit]) {
        hit++;          // Increment the hit counter as the player made a correct move
        userKey = -1;   // Reset the user's key input after a successful hit
      } else if (userKey != -1 && userKey != routine[hit]) { // If the player made an incorrect move
        hit = 0;        // Reset the hit counter as the player failed to follow the routine
      }
    }
    bgsong.pause(); // Pause the background music during active gameplay
  } 

  else if (stage == 5) {
    if (bgsong.isPlaying()) { // If background music is still playing
      bgsong.stop(); // Stop the background music
    }
    
    if (!stage5SoundPlayed) { // If the endgame sounds have not been played yet
      if (win) { // If the player has won the game
        award.play();         // Play the award sound effect
        hand_clapping.play(); // Play the hand clapping sound effect
        // Add confetti with cherry blossom emojis
        jsConfetti.addConfetti({
          emojis: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸'],
          emojiSize: 40
        })
        .then(() => jsConfetti.addConfetti({
          emojis: ['🌸', '🎊', '🎊', '🎊', '🎊', '🌸'],
          emojiSize: 40
        }))
        .then(() => jsConfetti.addConfetti({
          emojis: ['🫵', '🫵', '🫵', '🫵', '🫵', '🫵'],
          emojiSize: 40
        }));
      } else { // If the player has lost the game
        lose.play(); // Play the lose sound effect
      }
      stage5SoundPlayed = true; // Set the flag to true to prevent sounds from playing again
    }

    // Display the endgame message and secondary logo
    imageMode(CENTER); // Ensure images are drawn from their center
    image(logo2, 110, 100); // Display the secondary logo at position (110, 100)
    fill(255, 255, 255); // Set fill color to white for text
    textAlign(CENTER);    // Align text to the center
    textSize(windowHeight / 20); // Set text size relative to window height
    restartButton.show(); // Show the restart button for the player to play again
    quitButton.show();    // Show the quit button for the player to exit the game
    if (win) { // If the player has won
      text(`${userName}, you won the routine`, windowWidth / 2, windowHeight / 2); // Display win message with player's name
    } else { // If the player has lost
      text(`${userName}, you need to try harder :(`, windowWidth / 2, windowHeight / 2); // Display lose message with player's name
    }
  } 

  else if (stage == 6) {
    displayLoadingScreen(); // Call the function to display the loading screen
  }
}

//-Intro-function-----------------------
//--------------------------------------

function intro() {
  fill(255, 255, 255, fade); // Set text color to white with fade transparency
  text(scripts[scriptCount], windowWidth / 2, windowHeight / 2); // Display the current script at the center
  fadeIO(); // Update fade values

  // Move to the next script when fade reaches zero
  if (scriptCount < scripts.length && fade <= 0) {
    scriptCount++; // Increment the script index to display the next message
    fade = 0;      // Reset the fade value for the next message
  }

  // Advance to the next stage after all scripts are displayed
  if (scriptCount == scripts.length) {
    stage++; // Move the game to the next stage 
    fade = 0; // Reset the fade value
  }
}

//-Justify-text-function----------------
//--------------------------------------

function drawJustifiedText(txt, x, y, w) {
  let words = txt.split(' '); // Split the input text into an array of words
  let lines = [];             // Initialize an array to hold lines of text
  let currentLine = '';      // Initialize a string to build the current line
  textSize(26);              // Set the text size to 26 pixels

  // Split words into lines based on the specified width 'w'
  for (let i = 0; i < words.length; i++) {
    let word = words[i]; // Get the current word
    let newLine;         // Variable to hold the potential new line

    if (currentLine === '') { // If the current line is empty
      newLine = word;         // Start the new line with the current word
    } else {
      newLine = currentLine + ' ' + word; // Append the current word to the existing line
    }

    let newWidth = textWidth(newLine); // Calculate the width of the new line

    if (newWidth > w && currentLine !== '') { // If the new line exceeds the specified width
      lines.push(currentLine); // Add the current line to the 'lines' array
      currentLine = word;     // Start a new line with the current word
    } else {
      currentLine = newLine;  // Otherwise, update the current line to include the new word
    }
  }

  if (currentLine !== '') { // After processing all words, if there's any remaining text
    lines.push(currentLine); // Add the remaining text as the last line
  }

  let lineHeight = textAscent() + textDescent() + 2; // Calculate the height of each line based on text metrics

  // Draw each line of text with justification
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]; // Get the current line

    if (i === lines.length - 1) { // If it's the last line
      // Last line: left align without justification
      textAlign(LEFT); // Set text alignment to LEFT
      text(line, x, y + i * lineHeight); // Draw the text at the specified position
    } else { // For all other lines
      let wordsInLine = line.split(' '); // Split the line into individual words

      if (wordsInLine.length === 1) { // If there's only one word in the line
        // Single word: left align without justification
        textAlign(LEFT); // Set text alignment to LEFT
        text(line, x, y + i * lineHeight); // Draw the text at the specified position
      } else { // If there are multiple words in the line
        // Multiple words: apply justification by adjusting spacing between words
        let totalWordWidth = 0; // Initialize total width of all words in the line

        for (let word of wordsInLine) {
          totalWordWidth += textWidth(word); // Sum the widths of all words
        }

        // Calculate the additional space to distribute between words for justification
        let spaceWidth = (w - totalWordWidth) / (wordsInLine.length - 1);
        let currentX = x; // Initialize the starting X position for the first word

        // Draw each word with the calculated spacing
        for (let j = 0; j < wordsInLine.length; j++) {
          textAlign(LEFT); // Ensure text alignment is LEFT for each word
          text(wordsInLine[j], currentX, y + i * lineHeight); // Draw the word at the current position
          currentX += textWidth(wordsInLine[j]) + spaceWidth; // Move the X position for the next word
        }
      }
    }
  }
}

//-Instruction-function-----------------
//--------------------------------------

function instructionShow() {
  fill(255, 255, 255, fade); // Set text color to white with fade transparency

  // Define the dimensions of the text box where instructions will be displayed
  let x = windowWidth / 6;            // X-coordinate for the text box
  let y = windowHeight / 6;           // Y-coordinate for the text box
  let w = windowWidth - windowWidth * (2 / 6); // Width of the text box, leaving 1/6th margin on each side

  // Draw the instructions text with justification
  drawJustifiedText(instruction, x, y, w);

  if (fade <= 255) { // If the fade value has not reached maximum opacity
    fade += 3;       // Increment the fade value to create a fade-in effect
  }
}

//-Show-character-moves-function--------
//--------------------------------------

function showCharr() {
  // Display the user's name at the top center of the screen
  fill(255, 255, 255); // Set text color to white
  textAlign(CENTER);    // Align text to the center
  textSize(windowHeight / 30); // Set text size relative to window height for responsiveness
  text(`PLAYER: ${userName}`, windowWidth / 2, windowHeight / 10); // Display the player's name

  // Display combo movements
  if (characterCount >= 1) { // If at least one character has been displayed
    let numMoves = combo[z].moves.length; // Get the number of moves in the selected combo
    let imgWidth = combo[z].moves[0].width; // Get the width of the first move image
    let margin = 50; // Define a margin from the edges of the screen

    // Calculate X positions dynamically to evenly distribute move images across the screen
    let xPositions = calculateXPositions(numMoves, imgWidth, windowWidth, margin);
    let yMovePos = windowHeight / 2; // Y-coordinate where move images will be displayed

    for (let i = 0; i < numMoves; i++) { // Loop through each move in the combo
      let xPos = xPositions[i]; // Get the X position for the current move
      image(combo[z].moves[i], xPos, yMovePos); // Display the move image at the calculated position
    }
  }

  if (characterCount >= 2) { // If at least two characters have been displayed
    let numMoves = arrows.length; // Get the number of arrow images
    let imgWidth = arrows[0].width; // Get the width of the first arrow image
    let margin = 100; // Define a larger margin for arrow images

    // Calculate X positions dynamically to evenly distribute arrow images across the screen
    let xPositions = calculateXPositions(numMoves, imgWidth, windowWidth, margin);
    let yMovePos = windowHeight / 2; // Y-coordinate where move images are displayed
    // Calculate Y-coordinate for arrow images based on move image position and sizes
    let yArrowPos = calculateArrowYPosition(yMovePos, combo[z].moves[0].height, arrows[0].height, 20);

    for (let i = 0; i < numMoves; i++) { // Loop through each arrow image
      let xPos = xPositions[i]; // Get the X position for the current arrow
      image(arrows[i], xPos, yArrowPos); // Display the arrow image at the calculated position
    }
  }

  if (characterCount >= 3) { // If at least three characters have been displayed
    fill(255, 255, 255); // Set text color to white
    text('Press ESC to start', windowWidth / 2, windowHeight / 1.1); // Display prompt to start the game
  }

  if (fade % 30 == 0) { // Every 30 frames, increment the character count
    characterCount += 1; // Increment the character counter to display more elements
  }
  fade += 1; // Increment the fade value for future use (not directly utilized here)
}

//-Calculate-X-pos-function-------------
//--------------------------------------

function calculateXPositions(numMoves, imgWidth, windowWidth, margin = 50) {
  let totalImgWidth = numMoves * imgWidth; // Calculate the total width occupied by all images
  let availableSpace = windowWidth - 2 * margin - totalImgWidth; // Calculate the available horizontal space after margins and images
  let spacing;
  if (numMoves > 1) {
    spacing = availableSpace / (numMoves - 1);
  } else {
    spacing = 0;
  }

  let positions = []; // Initialize an array to store X positions
  for (let i = 0; i < numMoves; i++) { // Loop through the number of moves
    let xPos = margin + imgWidth / 2 + i * (imgWidth + spacing); // Calculate the X position for each image
    positions.push(xPos); // Add the calculated X position to the array
  }
  return positions; // Return the array of X positions
}

//-Calculate-Y-pos-function-------------
//--------------------------------------

function calculateArrowYPosition(yMove, moveHeight, arrowHeight, offset = 20) {
  // Calculate the Y position for arrow images based on move image position and sizes
  return yMove + (moveHeight / 2) + offset + (arrowHeight / 2);
}

//-Character-routine-display-function---
//--------------------------------------

function charrRoutine() {
  let numMoves = routineLength; // Number of moves in the current routine
  let imgWidth = combo[z].moves[0].width; // Width of move images (assuming all move images have the same width)
  let margin = 50; // Margin from the edges of the screen

  // Calculate dynamic X positions to evenly distribute move and arrow images across the screen
  let xPositions = calculateXPositions(numMoves, imgWidth, windowWidth, margin);
  let yMovePos = windowHeight / 2; // Y-coordinate where move images will be displayed
  // Calculate Y-coordinate for arrow images based on move image position and sizes
  let yArrowPos = calculateArrowYPosition(yMovePos, combo[z].moves[0].height, arrows[0].height, 20);

  for (let i = 0; i < numMoves; i++) { // Loop through each move in the routine
    let xPos = xPositions[i]; // Get the X position for the current move
    let moveIndex = routine[i]; // Get the move index from the routine array

    // Display the move image at the calculated position
    image(combo[z].moves[moveIndex], xPos, yMovePos);

    // Display the corresponding arrow below the move image
    image(arrows[moveIndex], xPos, yArrowPos);
  }
}

//-Score-and-lives-function-------------
//--------------------------------------

function scoreGenerate() {
  fill(255, 255, 255); // Set text color to white
  textSize(20); // Set text size to 20 pixels
  // Display the player's remaining lives (hearts) at a specific position
  text(`HEARTS: ${lives}`, windowWidth / 2.025 - (windowHeight / 50) * 6, windowHeight / 1.1);
  // Display the player's current score at a specific position
  text(`SCORE: ${score}`, windowWidth / 2.025  + (windowHeight / 50) * 7, windowHeight / 1.1);
}

//-FadeIO-function----------------------
//--------------------------------------

function fadeIO() {
  if (fade <= 0) fadeAmount = 3; // If fade is fully transparent or below, start fading in by increasing 'fadeAmount'
  if (fade > 255) fadeAmount = -3; // If fade exceeds full opacity, start fading out by decreasing 'fadeAmount'
  fade += fadeAmount; // Update the fade value based on 'fadeAmount'
}

//-Select-GameSound-function------------
//--------------------------------------

// Selects a random game sound from 'preloadedGameSounds' and plays it in a loop
function selectAndPlayGameSound() {
  // Stop any currently playing game sound
  if (currentGameSound && currentGameSound.isPlaying()) {
    currentGameSound.stop(); // Stop the current game sound if it's playing
  }

  // Select a random game sound from the preloaded gameplay sounds
  currentGameSound = random(preloadedGameSounds);

  // Play the selected game sound if it's loaded successfully
  if (currentGameSound && currentGameSound.isLoaded()) {
    currentGameSound.loop(); // Play the game sound in a loop
  }
}

//-Stop-game-sound-function-------------
//--------------------------------------

// Stops the currently playing game sound, if any
function stopGameSound() {
  if (currentGameSound && currentGameSound.isPlaying()) {
    currentGameSound.stop(); // Stop the game sound if it's playing
  }
}

//-Display-loadingscreen-function-------
//--------------------------------------

function displayLoadingScreen() {
  imageMode(CENTER); // Set image mode to CENTER for consistent positioning
  image(awaitImg, windowWidth / 2, windowHeight / 2 - 25); // Draw the loading GIF slightly above the center

  // Use 'millis()' to track the elapsed time since the loading screen started
  if (!loadingStartTime) { // If 'loadingStartTime' has not been set yet
    loadingStartTime = millis(); // Initialize 'loadingStartTime' with the current timestamp
  }

  let loadingDuration = 2000; // Duration to display the loading screen in milliseconds (1 second)
  if (millis() - loadingStartTime > loadingDuration) { // If the elapsed time exceeds 'loadingDuration'
    stage = 4; // Transition the game to stage 4 gameplay
    loadingStartTime = null; // Reset 'loadingStartTime'
  }
}
