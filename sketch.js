//Global array of scripArrays
let scriptures = [];
//Global array of Buttons
let buttons = [];
//Global object to hold results from the loadJSON call
let data = {};
//Global counter to keep track of what draw function displays
//0 = Selection screen initial state
//1 = Selection screen waiting state
//2 = Scriptest screen initial state
//3 = Scriptest screen waiting state
let pageCount = 0;
//Global variable to keep current scripture
let currentScrip = [];
//Global background value1
let bgColor1 = 'PowderBlue';
//Global background value2
let bgColor2 = 'LightYellow';
//Global canvas variable
let cnv;
//Global variable to display scrip lines
let counter;

function preload(){
	data = loadJSON('/db.json');
}


function setup() {
  // put setup code here
	cnv = createCanvas(1000,800);
	counter = 1;
	background(bgColor1);
	loadData();
}

function draw(){
	if(pageCount == 0){
		createButtons();
		pageCount = 1;
	}else if(pageCount == 2){
		scripTest();
	}else if(pageCount == 3){
		textAlign(CENTER,CENTER);
		textSize(20);
		for(let i = 0; i < counter; i++){
			text(currentScrip[i], width/2, 50 + 30 *i);
		}
	}
}

//creates buttons from the scriptures array and pushes them into the buttons array
function createButtons(){
	console.log('drawButtons called');
	for(let i = 0; i < scriptures.length; i++){
		let button = createButton(scriptures[i][0]);
		if(i <= 14){
			button.position(50, 50 + 30*i);
		} else if(i > 14 && i < 30){
			button.position(350, 50 + 30*(i-15));  
		} else{
			button.position(650, 50 + 30*(i-30));
		}
		button.mousePressed(()=>{
			currentScrip = scriptures[i];
			pageCount = 2;
		});
		buttons.push(button);
	}
	let button = createButton('Random Scripture');
	button.position(350, height-100);
	button.mousePressed(()=>{
		currentScrip = random(scriptures);
		pageCount = 2;
	})
}

//creates buttons for the scripture test page
function createTestButtons(){
	console.log('drawTestButtons called');
	let returnButton = createButton('Return to selection screen');
	returnButton.position(width/2 + 100, height - 100);
	returnButton.mousePressed(()=>{
		removeElements();
		background(bgColor1);
		counter = 1;
		pageCount = 0;
	})
	
	let tryAgainButton = createButton('Try again');
	tryAgainButton.position(width/2 - 200, height - 100);
	tryAgainButton.mousePressed(()=>{
		removeElements();
		counter = 1;
		pageCount = 2;
	})
	
	let nextLineButton = createButton('Next line');
	nextLineButton.position(width/2 - 50, height - 100);
	nextLineButton.mousePressed(()=>{
		if(counter < currentScrip.length){
			counter++;
		}
	})
}

//Displays the current scripture one line at a time. Takes the currentScrip
//as an argument.
function displayScrip(scrip){
	
}

//Convert saved JSON Scripture Data into scripArrays
function loadData(){
	console.log('loadData called');
	let scripData = data['scriptures'];
	for(let i = 0; i < scripData.length; i++){
		//Get each object in the array
		let scripArray = scripData[i];
		scriptures.push(scripArray);
	}
}

//Tests you on a scripture
function scripTest(){
	console.log('scripTest called');
	removeElements();
	background(bgColor2);
	createTestButtons();
	pageCount = 3;
}
