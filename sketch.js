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

let fade = 0;       // Controls the opacity of text elements for fade-in and fade-out effects
let fadeAmount = 1; // Determines the rate at which 'fade' changes (positive for fade-in, negative for fade-out)

//-Script-Variables----------------------
//---------------------------------------

const translations = {
  en: {
    1: "Welcome to p5js Audition Online",
    2: "We are here to help you become a professional audition dancer", 
    3: "Make your move and show your talent",
    4: "Always remember that practice makes perfect",
    5: "Now, without further ado, let's practice together",
    6: "Enter Your Name",
    7: "GO!",
    8: "Translate!",
    9: "Restart",
    10: "Quit",
    11: "(Press ESC to continue)",
    12: `In order to become a professional audition dancer, you need to learn through practicing basic routines and knowing your moves. This small game will help you to practice your reflexes. The game will generate random moves each time you play in a routine. To win this game, you would have to remember the moves and the order of each move. There are arrows to help you which key you should press when you see a specific move. You have ten hearts representing your trials, and you have to complete a routine within a frame of time to secure these hearts. The game will end when you lose all your hearts. This game is a small version of the actual game. In the actual game, you have to remember each move and its corresponding order (arrow). The more times you play, the sooner you will become a professional audition dancer. Good luck! 

(Press ESC to continue)`
  },
  vi: {
    1: "Chào mừng đến với p5js Audition Online",
    2: "Tôi ở đây để giúp bạn trở thành một dân nhảy audition chuyên nghiệp",
    3: "Hãy thể hiện tài năng của bạn ở đây nào!",
    4: "Luôn nhớ rằng luyện tập thường xuyên sẽ giúp bạn đạt kết quả tốt nhất",
    5: "Không còn gì để nói nữa, hãy cùng nhau bắt tay vào việc nào!!",
    6: "Điền tên của bạn",
    7: "Bắt đầu chơi!",
    8: "Phiên dịch",
    9: "Chơi lại",
    10: "Thoát",
    11: "(Nhấn ESC để tiếp tục)",
    12: `Để trở thành một dân nhảy audition chuyên nghiệp, bạn cần học qua việc luyện tập các bài cơ bản và nắm vững các bước nhảy của mình. Trò chơi này sẽ giúp bạn luyện tập phản xạ của mình. Trò chơi sẽ tạo ra các bước nhảy ngẫu nhiên mỗi lần bạn chơi trong một chuỗi. Để thắng được trò chơi này, bạn phải nhớ các bước nhảy và thứ tự của từng bước. Có các mũi tên để giúp bạn biết phím nào bạn nên nhấn khi bạn thấy một bước nhảy cụ thể. Bạn có mười trái tim đại diện cho thử thách của mình, và bạn phải hoàn thành một chuỗi trong một khung thời gian để bảo đảm những trái tim này. Trò chơi sẽ kết thúc khi bạn mất hết trái tim. Trò chơi này là phiên bản nhỏ của trò chơi thực tế. Trong trò chơi thực tế, bạn phải nhớ từng bước nhảy và thứ tự tương ứng của nó (mũi tên). Càng chơi nhiều lần, bạn càng sớm trở thành một dân nhảy audition chuyên nghiệp. Chúc may mắn! 
    
    (Nhấn ESC để tiếp tục)`
  }
};
let currentLanguage = 'en'; // Default language
let langTexts = translations[currentLanguage];
let scriptCount = 0; // Index to track the current script/message being displayed in the intro
let translateButton;
let scripts = [
  translations[currentLanguage][1],
  translations[currentLanguage][2],
  translations[currentLanguage][3],
  translations[currentLanguage][4],
  translations[currentLanguage][5]
];

let instruction;


//-Game-Assets-Variables----------------
//--------------------------------------

let move1, move2, move3, move4;    // Objects to store different dance move images (combos)
let z;                             // Random index to select a combo from the 'combo' array
let combo;                         // Array holding all available combos
let arrows;                        // Array holding arrow images used for indicating player input
let standardHeight;                // Standard height for images to maintain consistency
let font;                          // Variable to store the custom font

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
let lives = 10;            // Player's remaining lives
let hit = 0;               // Number of correct moves made by the player in the current routine
let userKey = -1;          // Stores the player's last key input
let routine;               // Array storing the sequence of moves generated for the player to follow
let routineLength = 4;     // Initial length of the dance routine
let pass = true;           // Indicates if the player successfully passed the routine
let isStartGame = true;    // Flag to check if the game has just started
let score = 0;             // Player's current score
let win = false;           // Indicates if the player has won the game
let timePerRoutine = 3500; // Time allocated per routine (3.5 seconds)
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
  'assets/Turbo - Black Cat.mp3',                       // Gameplay sound1
  'assets/Audition - How to Say.mp3',                   // Gameplay sound2
  'assets/Audition - Mr. Detective.mp3',                // Gameplay sound3
  'assets/Audition - You Are Here No More.mp3',         // Gameplay sound4
  'assets/Audition - Tuyết Yêu Thương.m4a',             // Gameplay sound5
  'assets/Audition - Please Tell Me Why FreeStyle.m4a', // Gameplay sound6
  'assets/Audition - Never Say Goodbye.m4a',            // Gameplay sound7
  'assets/BIGBANG - LIES.m4a'                           // Gameplay sound8
];

//-Preload-function---------------------
//--------------------------------------

function preload() {
  // Load the custom font from the assets folder
  font = loadFont('assets/OpenSans-VariableFont_wdth,wght.ttf');

  // Load dance move images
  img1 = loadImage('assets/HatsuneMiku3.png'); // Dance move1
  img2 = loadImage('assets/HatsuneMiku2.png'); // Dance move2
  img3 = loadImage('assets/HatsuneMiku4.png'); // Dance move3
  img4 = loadImage('assets/HatsuneMiku1.png'); // Dance move4

  // Load arrow images for indicating player input
  downArrow = loadImage('assets/downArrow.png');   // Down arrow image
  upArrow = loadImage('assets/upArrow.png');       // Up arrow image
  rightArrow = loadImage('assets/rightArrow.png'); // Right arrow image
  leftArrow = loadImage('assets/leftArrow.png');   // Left arrow image

  // Load logo images
  logo = loadImage('assets/auditionLogo.png');    // Main logo image
  logo2 = loadImage('assets/auditionLogo2.png');  // Secondary logo image

  // Load caution image
  caution = loadImage('assets/caution.png'); // 

  // Load sound effects
  award = loadSound('assets/award.wav');                     // Sound played when the player wins
  backgroundImage = loadImage('assets/main_background.jpg'); // Main background image
  hand_clapping = loadSound('assets/hand_clapping.wav');     // Sound effect for hand clapping
  lose = loadSound('assets/lose.wav');                       // Sound played when the player loses

  // Load loading screen GIF
  awaitImg = loadImage('assets/await.gif');

  // Preload Background Music (soundFiles)
  for (let i = 0; i < soundFiles.length; i++) { // Loop through each background music file
    let s = loadSound(soundFiles[i]);           // Load the sound file
    preloadedSoundFiles.push(s);                // Add the loaded sound to the preloadedSoundFiles array
  }

  // Preload Gameplay Sounds (gameSounds)
  for (let i = 0; i < gameSounds.length; i++) {  // Loop through each gameplay sound file
    let s = loadSound(gameSounds[i]);            // Load the gameplay sound file
    preloadedGameSounds.push(s);                 // Add the loaded sound to the preloadedGameSounds array
  }
}

//-Setup-function-----------------------
//--------------------------------------

function setup() {
  resizeCanvas(windowWidth, windowHeight); 
  imageMode(CENTER);                        
  textAlign(CENTER);                        
  frameRate(80);                            
  textSize(windowHeight / 26);              
  textFont(font);                          

  instruction = langTexts[12];


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
    moves: [img1, img2, img3, img4] 
  };

  move2 = {
    moves: [img1, img2, img3, img4] 
  };

  move3 = {
    moves: [img1, img2, img3, img4] 
  };

  combo = [move1, move2, move3]; // Array holding all combo objects
  standardHeight = img3.height;  // Set a standard height based on img3 for consistent image sizing

  setInterval(checkRoutine, timePerRoutine); // Set a recurring interval to call 'checkRoutine' every 'timePerRoutine'

//-Create-buttons-----------------------
//--------------------------------------

  nameInput = createInput('');                                          // Create an input field for the player's name
  nameInput.position((windowWidth / 2.10) - 130, windowHeight / 2);     // Position the input field near the center
  nameInput.size(200);                                                  // Set the width of the input field to 200 pixels
  nameInput.attribute('placeholder', langTexts[6]);                     // Set placeholder text for the input field
  nameInput.class('input-field');                                       // Assign CSS class 'input-field'

  submitButton = createButton('');                                      // Create a submit button for the player's name
  submitButton.html('<span>' + langTexts[7] + '</span>'); 
  submitButton.position((windowWidth / 2.10) + 70, windowHeight / 2);   // Position the button next to the input field
  submitButton.mousePressed(submitName);                                // When pressed, call the 'submitName' function
  submitButton.class('btn effect');                                     // Assign CSS classes 'btn' and 'effect'

  restartButton = createButton('');                                     // Create a restart button for restarting the game
  restartButton.html('<span>' + langTexts[9] + '</span>'); 
  restartButton.position(windowWidth / 2 + 60, windowHeight / 2 + 100); // Position the button below the center
  restartButton.mousePressed(restartGame);                              // When pressed, call the 'restartGame' function
  restartButton.class('btn effect');                                    // Assign CSS classes 'btn' and 'effect'
  restartButton.hide();                                                 // Initially hide the restart button

  quitButton = createButton('');                                        // Create a quit button for exiting the game
  quitButton.html('<span>' + langTexts[10] + '</span>');                // Set the HTML content of the button to display 'Quit'
  quitButton.position(windowWidth / 2 - 180, windowHeight / 2 + 100);   // Position the button below the center, to the left
  quitButton.mousePressed(quitGame);                                    // When pressed, call the 'quitGame' function
  quitButton.class('btn effect');                                       // Assign CSS classes 'btn' and 'effect'
  quitButton.hide();                                                    // Initially hide the quit button

  if (stage !== 0) {     // If the game is not in the initial stage (stage 0)
    nameInput.hide();    // Hide the name input field
    submitButton.hide(); // Hide the submit button
  }

  if (stage == 5) {       // If the game is in stage 5 (endgame)
    restartButton.show(); // Show the restart button
    quitButton.show();    // Show the quit button
  }

  let toggleInput = select('#toggle-language');
  toggleInput.changed(handleLanguageToggle);

  // Show or hide the toggle based on the current stage
  if (stage === 0) {
    select('.switch').show();
  } else {
    select('.switch').hide();
  }

  jsConfetti = new JSConfetti();              // Initialize the JSConfetti instance for confetti effects

  let bgSound = random(preloadedSoundFiles);  // Randomly select a background music track from the preloaded sounds
  if (bgSound.isLoaded()) {                   // Check if the selected background music is fully loaded
    bgSound.setVolume(0.5);                   
    bgSound.loop();                           
    bgsong = bgSound;
  }

  currentGameSound = null; // Initialize 'currentGameSound' as null since no game sound is playing
}

function handleLanguageToggle() {
  let toggleInput = select('#toggle-language');
  if (toggleInput.checked()) {
    currentLanguage = 'vi';
  } else {
    currentLanguage = 'en';
  }
  applyTranslations();
}

function applyTranslations() {
  langTexts = translations[currentLanguage];
  scripts = [
    langTexts[1],
    langTexts[2],
    langTexts[3],
    langTexts[4],
    langTexts[5]
  ];
  scriptCount = 0;
  fade = 255;

  instruction = langTexts[12];

  if (stage === 0) {
    // Update placeholder text for name input
    nameInput.attribute('placeholder', langTexts[6]);

    // Update button labels
    submitButton.html('<span>' + langTexts[7] + '</span>');

  }

  if (stage === 5) {
    quitButton.html('<span>' + langTexts[10] + '</span>');
    restartButton.html('<span>' + langTexts[9] + '</span>');
  }
}

//-Submit-name-function-----------------
//--------------------------------------

function submitName() {
  let enteredName = nameInput.value().trim(); // Retrieve and trim the value entered in the name input field

  if (enteredName !== "") { // If the entered name is not empty
    userName = enteredName; // Store the entered name in 'userName'

    nameInput.hide();    // Hide the name input field after submission
    submitButton.hide(); // Hide the submit button after submission

    userStartAudio();     // Start user audio
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

  stage = 6;                 // Set the stage to 6 (loading screen)
  score = 0;                 // Reset the player's score to 0
  lives = 10;                // Reset the player's lives to 5
  routineLength = 4;         // Reset the routine length to its initial value of 4
  hit = 0;                   // Reset the hit counter to 0
  isStartGame = true;        // Set the flag to indicate the game is starting
  win = false;               // Reset the win flag to false
  characterCount = 0;        // Reset the character counter to 0
  userKey = -1;              // Reset the user's key input to -1 (no input)
  routine = [];              // Clear the current dance routine array
  restartButton.hide();      // Hide the restart button after restarting the game
  fade = 0;                  // Reset the fade value to 0 for text effects
  stage5SoundPlayed = false; // Reset the flag to allow sounds to be played again in stage 5
  loadingStartTime = null;   // Reset the loading start time for future loading screens
  submitButton.hide();       // Hide the submit button after restarting the game
  quitButton.hide();         // Hide the quit button after restarting the game
}

//-Quit-name-function-------------------
//--------------------------------------

function quitGame() {        // Function to quit the game and return to the start screen
  stage = 0;                 // Reset the game stage to 0 (start screen)
  score = 0;                 // Reset the player's score to 0
  lives = 10;                // Reset the player's lives to 5
  routineLength = 4;         // Reset the routine length to its initial value of 4
  hit = 0;                   // Reset the hit counter to 0
  isStartGame = true;        // Set the flag to indicate the game is starting
  win = false;               // Reset the win flag to false
  characterCount = 0;        // Reset the character counter to 0
  userKey = -1;              // Reset the user's key input to -1 (no input)
  routine = [];              // Clear the current dance routine array
  restartButton.hide();      // Hide the restart button after quitting the game
  quitButton.hide();         // Hide the quit button after quitting the game
  fade = 0;                  // Reset the fade value to 0 for text effects
  stage5SoundPlayed = false; // Reset the flag to allow sounds to be played again in stage 5

  // Restart background music by selecting a new random track
  let bgSound = random(preloadedSoundFiles); // Randomly select a background music track
  if (bgSound.isLoaded()) { 
    bgSound.volume(0.5);
    bgSound.play();    
    bgsong = bgSound;
  }

  loadingStartTime = null; // Reset the loading start time
}

//-Check-Routine-function---------------
//--------------------------------------

function checkRoutine() {
  if (stage == 4) { 
    if (isStartGame) {                            // If the game has just started
      generateRoutine();                          // Generate a new dance routine for the player to follow
      isStartGame = false;                        // Set the flag to false to prevent regenerating the routine multiple times

      selectAndPlayGameSound();                   // Select and play a random game sound effect
    } else {                                      // If the game has already started and a routine is in progress
      if (routineLength != hit) {                 // If the player did not complete the routine successfully
        lives -= 1;                               // Deduct one life from the player
      } else {                                    // If the player successfully completed the routine
        score++;                                  // Increment the player's score by one
      }

      // Check for game over conditions
      if (lives <= 0) { 
        stage++; 
        stopGameSound(); 
      } else if (score >= 12) { 
        stage++; 
        win = true; 
        stopGameSound(); 
      } else if (score != 0 && score % 4 == 0 && routineLength < 8) { 
        routineLength += 2; 
      }

      if (stage != 5) { 
        hit = 0;        
        userKey = -1;   
        generateRoutine();
      }
    }
  }
}

//-Generate-routine-function------------
//--------------------------------------

function generateRoutine() {
  routine = [];                             // Initialize an empty array to store the dance routine
  for (let i = 0; i < routineLength; i++) { // Loop 'routineLength' times to generate moves
    let num = int(random(0, 4));            // Generate a random integer between 0 and 3 (inclusive)
    routine.push(num);                      // Add the generated move index to the 'routine' array
  }
}

//-Key-pressed-function-----------------
//--------------------------------------

function keyPressed() {
  if (keyCode == ENTER && stage == 0) {           // If the ENTER key is pressed during stage 0
    submitName();                                 // Call the function to submit the player's name
  } else if (keyCode == LEFT_ARROW) {             // If the LEFT_ARROW key is pressed
    userKey = 0;                                  // Map LEFT_ARROW to move index 0
  } else if (keyCode == UP_ARROW) {               // If the UP_ARROW key is pressed
    userKey = 1;                                  // Map UP_ARROW to move index 1
  } else if (keyCode == RIGHT_ARROW) {            // If the RIGHT_ARROW key is pressed
    userKey = 2;                                  // Map RIGHT_ARROW to move index 2
  } else if (keyCode == DOWN_ARROW) {             // If the DOWN_ARROW key is pressed
    userKey = 3;                                  // Map DOWN_ARROW to move index 3
  } else if (keyCode == ESCAPE && stage == 3) {   // If the ESCAPE key is pressed during stage 3
    stage = 6;                                    // Transition the game to stage 6
  } else if (keyCode == ESCAPE && stage != 4) {   // If the ESCAPE key is pressed and not during gameplay
    stage++;                                      // Advance the game to the next stage
  } 
}

//-Draw-function------------------------
//--------------------------------------

function draw() {
  image(backgroundImage, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);

  if (stage == 0) {
    imageMode(CENTER);                                
    image(logo, windowWidth / 2, windowHeight / 2 - 150); 
    
    fill(255, 255, 255);
    textSize(windowHeight / 26);
    text('© 2024 made by p5js', windowWidth / 2, windowHeight / 2 + 300);

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
    select('.switch').show();
  } 

  else if (stage == 1) {
    intro(); // Call the function to display introductory messages
    if (!bgsong.isPlaying()) { // If background music is not playing
      bgsong.loop(); // Loop the background music
    }
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
      rect(0, windowHeight - 10, (windowWidth / routineLength) * hit, windowHeight / 30);

      // Check if the player's last key input matches the expected move in the routine
      if (userKey == routine[hit]) {
        hit++;          // Increment the hit counter as the player made a correct move
        userKey = -1;   // Reset the user's key input after a successful hit
      } else if (userKey != -1 && userKey != routine[hit]) { // If the player made an incorrect move
        hit = 0;        // Reset the hit counter to 0
      }
    }
    bgsong.stop(); // Pause the background music during active gameplay
  } 

  else if (stage == 5) {
    if (bgsong.isPlaying()) { // If background music is still playing
      bgsong.stop(); // Stop the background music
    }
    
    if (!stage5SoundPlayed) {             // If the endgame sounds have not been played yet
      if (win) {                          // If the player has won the game
        award.play();                     // Play the award sound effect
        hand_clapping.play();             // Play the hand clapping sound effect
                                          
        jsConfetti.addConfetti({          // Add confetti effect with multiple emojis
          emojis: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸'],
          emojiSize: 60
        })
        .then(() => jsConfetti.addConfetti({
          emojis: ['🎊', '🎊', '🎊', '🎊', '🎊', '🎊'],
          emojiSize: 60
        }))
        .then(() => jsConfetti.addConfetti({
          emojis: ['🎊', '🎊', '🎊', '🎊', '🎊', '🎊'],
          emojiSize: 60
        }));
      } else { // If the player has lost the game
        lose.play(); // Play the lose sound effect
      }
      stage5SoundPlayed = true; // Set the flag to true to prevent sounds from playing again
    }

    // Display the endgame message and secondary logo
    imageMode(CENTER); 
    image(logo2, 110, 100);
    fill(255, 255, 255); 
    textAlign(CENTER);    
    textSize(windowHeight / 26); 
    restartButton.show();   
    quitButton.show();    
    if (win) { // If the player has won
      let winMessage;
      if (langTexts[1].includes('Welcome')) {
        winMessage = "you won the routine";
      } else {
        winMessage = "Bạn đã thắng";
      }
      text(`${userName}, ${winMessage}`, windowWidth / 2, windowHeight / 2 + 50); // Display win message with player's name
    } else { // If the player has lost
      let loseMessage;
      if (langTexts[1].includes('Welcome')) {
        loseMessage = "you need to try harder :(";
      } else {
        loseMessage = "bạn cần cố gắng hơn :(";
      }
      text(`${userName}, ${loseMessage}`, windowWidth / 2, windowHeight / 2 + 50); // Display lose message with player's name
    }
  } 

  else if (stage == 6) {
    displayLoadingScreen(); // Call the function to display the loading screen
  }

  if (stage === 0) {
    select('.switch').show();
  }
  else {
    select('.switch').hide();
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
  // Split the text into paragraphs based on newline characters
  const paragraphs = txt.split('\n');
  const lineHeight = textAscent() + textDescent() + 2;
  let currentY = y;

  for (let p = 0; p < paragraphs.length; p++) {
    const words = paragraphs[p].split(' ');
    const lines = [];
    let currentLine = '';

    // Build lines without exceeding maxWidth
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let testLine = currentLine;

      if (currentLine === '') {
        testLine = word;
      } else {
        testLine = currentLine + ' ' + word;
      }

      if (textWidth(testLine) > w && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    // Add the last line of the paragraph
    if (currentLine !== '') {
      lines.push(currentLine);
    }

    // Draw each line with justification
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isLastLine = (i === lines.length - 1);
      const wordsInLine = line.split(' ');

      if (isLastLine || wordsInLine.length === 1) {
        // Left align the last line or lines with a single word
        textAlign(LEFT);
        text(line, x, currentY);
      } else {
        // Justify other lines by distributing extra space between words
        let totalWordWidth = 0;
        for (let j = 0; j < wordsInLine.length; j++) {
          totalWordWidth += textWidth(wordsInLine[j]);
        }

        const spaceWidth = (w - totalWordWidth) / (wordsInLine.length - 1);
        let currentX = x;

        for (let j = 0; j < wordsInLine.length; j++) {
          textAlign(LEFT);
          text(wordsInLine[j], currentX, currentY);
          currentX += textWidth(wordsInLine[j]) + spaceWidth;
        }
      }

      currentY += lineHeight;
    }

    // Add extra space after each paragraph except the last one
    if (p < paragraphs.length - 1) {
      currentY += lineHeight / 2;
    }
  }
}

function drawBlurredRect(x, y, w, h, radius, alpha) {
  push();
  noStroke();
  
  // Semi-transparent background with reduced opacity
  fill(0, 0, 0, alpha); // Consistent dark background with fixed opacity
  rect(x, y, w, h, radius);
  
  pop();
}

//-Instruction-function-----------------
//--------------------------------------

function instructionShow() {
  const margin = 60;
  const x = windowWidth / 6;
  const y = windowHeight / 6;
  const w = windowWidth - (windowWidth * (2 / 6));
  const h = windowHeight - (windowHeight * (2 / 6));
  
  // Draw blurred background first
  drawBlurredRect(x - margin, y - margin, 
                  w + (margin * 2), h + (margin * 4), 
                  10, 90); // Fixed opacity value 
  
  // Draw text with full opacity
  fill(255, 255, 255); // Solid white color without fade
  drawJustifiedText(instruction, x, y, w);
}

//-Show-character-moves-function--------
//--------------------------------------

function showCharr() {
  // Display the user's name at the top center of the screen
  fill(255, 255, 255); 
  textAlign(CENTER);    
  textSize(windowHeight / 26); 
  text(`PLAYER: ${userName}`, windowWidth / 2, windowHeight / 10);      

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
    text(langTexts[11], windowWidth / 2, windowHeight / 1.1); // Display prompt to start the game
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
  textSize(26); // Set text size to 20 pixels
  // Display the player's remaining lives (hearts) at a specific position
  let heartsText;
  let scoreText;

  if (langTexts[6].includes('Enter')) {
    heartsText = "HEARTS: ";
    scoreText = "SCORE: ";
  } else {
    heartsText = "SỐ TIM: ";
    scoreText = "SỐ ĐIỂM: ";
  }

  text(`${heartsText}${lives}`, windowWidth / 2.025 - (windowHeight / 50) * 6, windowHeight / 1.1);
  text(`${scoreText}${score}`, windowWidth / 2.025  + (windowHeight / 50) * 7, windowHeight / 1.1);


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
    currentGameSound.loop();
  }
}

//-Stop-game-sound-function-------------
//--------------------------------------

// Stops the currently playing game sound, if any
function stopGameSound() {
  if (currentGameSound && currentGameSound.isPlaying()) {
    currentGameSound.stop();
  }
}

//-Display-loadingscreen-function-------
//--------------------------------------

function displayLoadingScreen() {
  imageMode(CENTER);
  
  // Display loading GIF animation
  image(awaitImg, windowWidth / 2, windowHeight / 2 - 25);

  // Initialize loading start time if not set
  if (!loadingStartTime) {
    loadingStartTime = millis();
  }

  // Calculate loading progress
  let loadingDuration = 3000; // 2 seconds total loading time
  let elapsed = millis() - loadingStartTime;
  let progress = min(elapsed / loadingDuration, 1);

  // Draw loading text with dots animation
  fill(255);
  textAlign(CENTER);
  textSize(windowHeight / 30);
  let dots = '.'.repeat(floor((millis() / 500) % 4));
  let loadingText;
  if (langTexts[8].includes('Translate')) {
    loadingText = "Loading";
  } else {
    loadingText = "Đang tải";
  }
  text(`${loadingText}${dots}`, windowWidth / 2, windowHeight / 2 + 50);

  // Draw loading progress bar
  let barWidth = windowWidth / 5;
  let barHeight = 10;
  stroke(255);
  noFill();
  rect(windowWidth/2 - barWidth/2, windowHeight/2 + 80, barWidth, barHeight);
  fill(255);
  noStroke();
  rect(windowWidth/2 - barWidth/2, windowHeight/2 + 80, barWidth * progress, barHeight);

  // Add loading tips
  let tips = [];
  if (translations[currentLanguage][1].includes('Welcome')) {
    tips.push("Use arrow keys to match the dance moves");
    tips.push("Watch your remaining hearts");
    tips.push("Perfect your timing to score higher");
  } else {
    tips.push("Sử dụng phím mũi tên để bắt chước các bước nhảy cho phù hợp");
    tips.push("Theo dõi số trái tim còn lại");
    tips.push("Hoàn thiện thời gian của bạn để ghi điểm cao hơn");
  }

  let currentTip = tips[floor((millis() / 2000) % tips.length)];
  textSize(windowHeight / 40);
  fill(200);
  text(currentTip, windowWidth / 2, windowHeight/2 + 120);

  // Transition to gameplay when loading completes
  if (elapsed > loadingDuration) {
    stage = 4;
    loadingStartTime = null;
  }
}


//-FadeIO-function----------------------
//--------------------------------------
function fadeIO() {
  if (fade <= 0) {
    fadeAmount = 3;
  }                   // If fade is fully transparent or below, start fading in by increasing 'fadeAmount'
  if (fade > 255) {
    fadeAmount = -3;
  }                   // If fade exceeds full opacity, start fading out by decreasing 'fadeAmount'
  fade += fadeAmount; // Update the fade value based on 'fadeAmount'
}
