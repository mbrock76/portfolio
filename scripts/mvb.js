// post-load main
function init(){
	
	// -------------GLOBAL VARIABLES--------------
	var mobile = false;
	
	// login
	var user = {name: "", pwd: "", date: 0, remember: false};
	var saviconImages = ["img/savicon.png", "img/savicon_green.png", "img/savicon_red.png"];
	var scriptNames = {
		post_user: "scripts/post_user.php",
		post_chat: "scripts/post_chat.php",
		post_scores: "scripts/update_scores.php",
		get_chat: "scripts/get_chat.php",
		get_hangman: "scripts/get_hangman.php"};

	// TODO: workaround, can't split a regex with string delimiters in it
	var emailRegex;
	fetch("scripts/regex_email.txt")
		.then((response) => response.text())
		.then((text) => {
			emailRegex = new RegExp(text, "gi");
		});
	
	// --games variables--
	var gameNavTitleContent = {
		chat: "games-nav-chat",
		game: "games-nav-buttons",
		info: "games-nav-info"
	};
	var gameNavTitle = Object.keys(gameNavTitleContent);
	var gameNavLeft = ["hidden", "visible", "visible"];
	var gameNavRight = ["visible", "visible", "hidden"];
	var gameNames = ["hangman", "ttt", "bird", "hat"];
	var gamesTimer;
	var pos = {
		x: 0,
		y: 0
	};
	
	var chats = [];
	var lines = [];
	
	// hangman
	var hangmanWords = [[],[],[]];
	var hangmanWord = "";
	var hangmanArray = [];
	var hangmanHit = [];
	var hangmanMiss = [];
	var hangmanActive = false;
	var hangmanMissCount = 0;
	
	// tictactoe
	var tttBoard = [["","",""],["","",""],["","",""]];
	var tttActive = false;
	var tttMyTurn = false;
	var tttMoveCount = 0;
	var tttSize = 100;
	var ttt3 = [];
	var ttt2x = [];
	var ttt2o = [];
	
	var tttCanvas = document.getElementById('ttt-canvas');
	var tttCtx = tttCanvas.getContext('2d');
	var tttRect;
	var tttImgBG = new Image();
	var tttImgx = new Image();
	var tttImgo = new Image();
	var tttEndx = new Image();
	var tttEndo = new Image();
	tttImgBG.src = `img/ttt_bg.png`;
	tttImgx.src = `img/ttt_x.png`;
	tttImgo.src = `img/ttt_o.png`;
	tttEndx.src = `img/tttEndx.png`;
	tttEndo.src = `img/tttEndo.png`;
	
	toggleCss();
	getUsers();
	hideChildren("hidden");
	
	// -----------EVENT LISTENERS--------------
	// keeps the navbar at the top
	window.addEventListener("scroll", setNavPos);
	window.addEventListener("resize", toggleCss);

	//tabs to switch content visibility 
	document.getElementById("about").addEventListener("click", setNavBtnFocus);
	document.getElementById("projects").addEventListener("click", setNavBtnFocus);
	document.getElementById("games").addEventListener("click", setNavBtnFocus);
	
	// --ABOUT--
	// about listeners for showing and hiding the resume/email elements
	document.getElementById("about-contact-links-resume").addEventListener("click", showHidden);
	document.getElementById("about-contact-links-email").addEventListener("click", showHidden);
	document.getElementById("hidden").addEventListener("click", hideElement);

	// actions within the email element
	document.getElementById("email-from").addEventListener("input", valEmail);
	document.getElementById("email-send").addEventListener("click", sendEmail);

	// --PROJECTS--
	
	// --GAMES--
	// login box
	document.getElementById("games-login-username").addEventListener("input", valUsername);
	document.getElementById("games-login-password").addEventListener("input", valPassword);
	document.getElementById("games-login-login").addEventListener("click", login);
	document.getElementById("games-user-logout").addEventListener("click", logout);
	document.getElementById("games-user-savicon").addEventListener("click", rememberMe);
	document.getElementById("games-user-savicon").addEventListener("mouseover", saviconColor);
	document.getElementById("games-user-savicon").addEventListener("mouseout", saviconColor);
	
	//the side arrows that shift the content between chat/game/scores
	document.getElementById("games-nav-left").addEventListener("click", changePanel);
	document.getElementById("games-nav-right").addEventListener("click", changePanel);
	
	//the icons that load a game
	document.getElementById("games-nav-buttons-hangman").addEventListener("click", switchGame);
	document.getElementById("games-nav-buttons-ttt").addEventListener("click", switchGame);
	document.getElementById("games-nav-buttons-bird").addEventListener("click", switchGame);
	document.getElementById("games-nav-buttons-hat").addEventListener("click", switchGame);
	
	//submit a chat message to the server
	document.getElementById("games-panel-chat-text-enter").addEventListener("click", postChat);
	
	//hangman
	document.getElementById("games-panel-game-hangman-buttons-new").addEventListener("click", newHangman);
	document.getElementById("games-panel-game-hangman-buttons-quit").addEventListener("click", quitHangman);
	document.getElementById("hangman-guess").addEventListener("click", guessHangman);
	document.getElementById("hangman-input").addEventListener("input", valGuess);
	
	//tic tac toe
	document.getElementById("games-panel-game-ttt-buttons-new").addEventListener("click", tttNew);
	document.getElementById("games-panel-game-ttt-buttons-quit").addEventListener("click", tttQuit);
	document.getElementById("ttt-canvas").addEventListener("click", tttClick);
	document.getElementById("ttt-canvas").addEventListener("touchstart", tttClick, false);

	//--------------FUNCTIONS-----------------
	//a toggle to keep the navbar at the top upon scrolling down
	function setNavPos(){
		
		const navheight = document.getElementById("title").getBoundingClientRect().bottom;
		
				
		if (navheight < 1){
			document.getElementById("nav").style.position = "fixed";
			document.getElementById("navgradient").style.display = "block";
		}
		else{
			document.getElementById("nav").style.position = "relative";
			document.getElementById("navgradient").style.display = "none";
		}
	}
	
	//switches between desktop and mobile view, mostly to fit buttons
	function toggleCss(){

		document.getElementById("games-content").style.minHeight = `${window.innerHeight}px`;
		
		if(window.innerWidth < window.innerHeight){

			document.getElementById("css").href = "css/vrt.css";
			mobile = true;
			tttSize = 80;
					
		}else{

			document.getElementById("css").href = "css/hrz.css";
			mobile = false;
			tttSize = 100;
			
		}
	}
	
	function hideChildren(myId){

		const children = Array.from(document.getElementById(myId).children);

		children.forEach(function(each){
			each.style.display = "none";
		});
	}
	
	//toggles the "focus" of the navbar tabs, hides all html tags and then displays the content of the one that was clicked
	function setNavBtnFocus(e){

		const target = document.getElementById(e.target.id);

		if(target.classList.contains("navBtn")){

			hideChildren("center");
			const children = Array.from(document.getElementById("nav").children);

			children.forEach(function(each){

				if(each.classList.contains("navBtnFocus")){
					
					each.classList.remove("navBtnFocus");
					each.classList.add("navBtn");
				}

			});

			target.classList.add("navBtnFocus");
			target.classList.remove("navBtn");
			document.getElementById(e.target.id + "-content").style.display = "inline-block";
			clearInterval(gamesTimer);//TODO: replace with websocket

			eval(`load${e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1)}()`);
		}
	}
	
	//unhide the hidden div and display either the resume or email form
	function showHidden(e){
		
		if(e.target.id == "about-contact-links-resume"){
			document.getElementById("resume").style.display = "block";
		}else{
			document.getElementById("email-container").style.display = "flex";
		}

		document.getElementById("hidden").style.display = "flex";
	}

	//hides the fullscreen pic/email element and clears it
	function hideElement(e){
		
		if(e.target.id == "hidden"){
			e.target.style.display = "none";
			hideChildren(e.target.id);
		}
	}

	//checks email input against a regular expression for proper format
	function valEmail(e){

		if(!e.target.value || e.target.value.match(emailRegex)){
			
			e.target.style.border = "2px solid #5bc2ea";
		}else{
			
			e.target.style.border = "2px solid red";
			e.target.style.outline = "none";
		}
	}
	
	// gather form input
	function sendEmail(){
		
		// gather the form data
		const formElements = [document.getElementById("email-from"), document.getElementById("email-subject"),
							document.getElementById("email-message")];

		const emailObj = {

			sender_email: formElements[0].value,
			subject: formElements[1].value,
			message_body: formElements[2].value
		}

		// check that the email is validated and all fields are filled out, then send
		if(formElements[0].style.border == "2px solid red"){
			
			alert("Please fix the format errors in the email field.");
			
		}else if(Object.values(emailObj).some(value => !value)){
			
			alert("Please fill out all of the fields before sending.");

		}else{

			// Perform the Fetch POST request
			fetch('scripts/send_email.php', {

				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(emailObj)
				
			}).then(response => {

				if (!response.ok) {

					throw new Error('Network response was not ok');
				}
				return response.text;

			}).then(data => {

				alert('Email sent successfully!');
				formElements.forEach(each => {
					each.value = "";
				});
				document.getElementById("emailDiv").style.display = "none";

			}).catch(error => {

				console.error('There was a problem with the fetch operation:', error);
				alert('Error sending email.');

			});
		}
	}
	
	//sanitize input
	function valUsername(){
		
		let temp = document.getElementById("games-login-username").value.replace(/[^a-z0-9_]/gi, "");
		document.getElementById("games-login-username").value = temp;
	}	
	
	//sanitize input
	function valPassword(){
		
		let temp = document.getElementById("games-login-password").value.replace(/[^a-z0-9_]/gi, "");
		document.getElementById("games-login-password").value = temp;
	}
	
	//all purpose function to either log in or create a new user and log in
	function login(){
		
		const name = document.getElementById("games-login-username").value;
		const pwd = document.getElementById("games-login-password").value;
		
		if(!name){
			alert("You must enter a username.");
		}else if(!pwd){
			alert("You must enter a password.");
		}else{
			user.name = name;
			user.pwd = pwd;
			user.date = Date.now();
			checkUser(setUser, user);
		}
	}
	
	//logs out the user, returns elements to a log in screen state
	function logout(){
		
		localStorage.removeItem("mvb-user");
		user = {name: "", date: 0, remember: false};
		hideChildren("games-content");
		
		document.getElementById("games-user-savicon").src = "img/savicon.png";
		document.getElementById("games-login").style.display = "inline-block";
	}

	//changes the color of the savicon on hover to indicate the click action
	function saviconColor(e){
		
		const savicon = document.getElementById(e.target.id);

		savicon.src = (e.type == "mouseover") ? saviconImages[parseInt(savicon.dataset.value) + 1] : 
													saviconImages[parseInt(savicon.dataset.value)];
	}
	
	//saves or clears the user in local storage, colors the save icon
	function rememberMe(e){
		
		const savicon = document.getElementById(e.target.id);
		
		if(savicon.dataset.value == "0"){
			user.remember = true;
			localStorage.setItem("mvb-user", JSON.stringify(user));

		}else{
			user.remember = false;
			localStorage.removeItem("mvb-user");
			savicon.src = "img/savicon.png";
		}

		savicon.src = saviconImages[Math.abs(parseInt(savicon.dataset.value) - 1)];
		savicon.dataset.value = Math.abs(parseInt(savicon.dataset.value) - 1);
	}
	
	// --ABOUT--
	// nothing to load, changed logic, see setNavBtnFocus()
	function loadAbout(){
		console.log("about");
	}
	
	// --PROJECTS--
	// nothing to load, changed logic, see setNavBtnFocus()
	function loadProjects(){
		console.log("projects");
	}
	
	// --GAMES--
	//games main function, gets called, see setNavBtnFocus()
	function loadGames(){
			
		if(mobile){

			let myPos = parseInt(document.getElementById("games-nav-title").dataset.value);
			document.getElementById(`games-panel-${gameNavTitle[myPos]}`).style.display = "block";
		}
		
		get(setHangman, scriptNames.get_hangman);

		const temp = localStorage.getItem("mvb-user");
		const savicon = document.getElementById("games-user-savicon");
		hideChildren("games-content");
		
		//check if the user opted to be remembered
		if(temp != null){ user = JSON.parse(temp); }
		
		//check if the user is still logged in or remembered
		if(user.name){

			document.getElementById("games-user-name").innerHTML = user.name;
			savicon.dataset.value = user.remember * 1;
			savicon.src = saviconImages[parseInt(savicon.dataset.value)];

			document.getElementById("games-wrapper").style.display = "inline-block";

			setUserScores();

		//if they are logged out and forgotten, load the login form
		}else{
			
			document.getElementById("games-login").style.display = "inline-block";
		}
		
		tttCanvas.width = tttSize * 3;
		tttCanvas.height = tttSize * 3;

		gamesTimer = setInterval(refreshGames, 3000);
	}
	
	//pulls chat data, calls the load function
	function refreshGames(){
		get(setChat, scriptNames.get_chat);
		getUsers();
		loadInfo();
	}
	
	//makes divs with chat info
	function loadChat(){
		
		let mystring = "";
		for(let i = 0; i < chats.length; i++){
			
			if(user.date < chats[i].timestamp){
				let myTimestamp = new Date(chats[i].timestamp);
				mystring += `<div class="chatlines" id="greyline"><div id="chatname">&nbsp;${chats[i].name}:</div>
							<div id="chattimestamp">${myTimestamp.toLocaleString()}</div></div>
							<div class="chatlines" id="whiteline">&nbsp;&nbsp;${chats[i].msg}</div>`;
			}
		}
		document.getElementById("games-panel-chat-msgs").innerHTML = mystring;
	}
	
	//populate div tags with user names and and high scores
	function loadInfo(){
		
		let highScores = [];
		let startDivs = [];
		
		startDivs[0] = `<table id="scores-table"><tr>
							<td colspan="2" class="games-panel-info-title">Hangman:</td>
						</tr><tr>
							<td class="games-panel-info-left">You:</td>
							<td class="games-panel-info-right">${user.hangman}</td>
						</tr>`;
							
		startDivs[1] =  `<tr>
							<td colspan="2" class="games-panel-info-title">TicTacToe:</td>
						</tr><tr>
							<td class="games-panel-info-left">You:</td>
							<td class="games-panel-info-right">${user.ttt}</td>
						</tr>`;
							
		startDivs[2] = `<tr>
							<td colspan="2" class="games-panel-info-title">Bird Bomber:</td>
						</tr><tr>
							<td class="games-panel-info-left">You:</td>
							<td class="games-panel-info-right">${user.bird}</td>
						</tr>`;
							
		startDivs[3] = `<tr>
							<td colspan="2" class="games-panel-info-title">High Hat:</td>
						</tr><tr>
							<td class="games-panel-info-left">You:</td>
							<td class="games-panel-info-right">${user.hat}</td>
						</tr>`;
							
		
		//sorts lines, used to be a seperate function, see old.js
		for(let i = 0; i < startDivs.length; i++){
			
			lines.sort((a,b) => {
				return b[gameNames[i]] - a[gameNames[i]];
			});

			for(let j = 0; j < 5; j++){
				
				startDivs[i] += `<tr>
									<td class="games-panel-info-left">${lines[j].name}:</td>
									<td class="games-panel-info-right">${lines[j][gameNames[i]]}</td>
								</tr>`;
			}
		}
		
		startDivs[3] += `</table>`;
		let tempstring = startDivs.join("");
		document.getElementById("games-panel-info").innerHTML = tempstring;
	}
	
	//uses a stored number in the title div to shift contents left/right, 
	function changePanel(e){
		
		let myPos = parseInt(document.getElementById("games-nav-title").dataset.value);

		document.getElementById(`games-panel-${gameNavTitle[myPos]}`).style.display = "none";
		
		myPos += parseInt(e.target.dataset.value);
		
		hideChildren("games-nav-title");
		
		document.getElementById(gameNavTitleContent[gameNavTitle[myPos]]).style.display = "block";
		document.getElementById("games-nav-title").dataset.value = myPos;
		
		document.getElementById("games-nav-left").style.visibility = gameNavLeft[myPos];
		document.getElementById("games-nav-right").style.visibility = gameNavRight[myPos];
		
		document.getElementById(`games-panel-${gameNavTitle[myPos]}`).style.display = "block";
	}

	//show/hide toggle for the games buttons
	function switchGame(myId){

		let temp = myId.target.id.split("-");
		let myGameName = temp[temp.length -1];
		
		for(let i = 0; i < gameNames.length; i++){
			document.getElementById(`games-nav-buttons-${gameNames[i]}`).style.outline = "none";
		}
		
		hideChildren("games-panel-game");
		
		document.getElementById(myId.target.id).style.outline = "2px solid black";
		document.getElementById(`games-panel-game-${myGameName}`).style.display = "block";
	}
	
	//----hangman----
	//initializes a hangman game
	function newHangman(){

		document.getElementById("hangman-msg").innerHTML = "";
		let wordLength = parseInt(document.getElementById("games-panel-game-hangman-buttons-size").value);
		hangmanWord = hangmanWords[wordLength-4][Math.floor(Math.random() * hangmanWords[wordLength-4].length)];
		hangmanArray = Array.from(hangmanWord);
		hangmanMissCount = 0;
		hangmanMiss = [];
		hangmanHit = [];
		hangmanActive = true;
		let myString = "";
		
		for(let i = 0; i < hangmanArray.length; i++){

			myString += `<div class="hangman-letters" id="letter-${i}">_</div>`;
		}
		
		document.getElementById("games-panel-game-hangman-word").innerHTML = myString;
		document.getElementById("hangman-pic").src = "img/hangman-0.png";
		document.getElementById("hangman-missed").innerHTML = "";
		
	}
	
	//ends an active hangman, doesnt reset it: see newHantman()
	function quitHangman(){
		
		if(hangmanActive){
			document.getElementById("hangman-msg").innerHTML = "";
			let myString = "";
			
			hangmanActive = false;
			
			for(let i = 0; i < hangmanArray.length; i++){
				
				myString += `<div class="hangman-letters" id="letter-${i}">${hangmanArray[i]}</div>`;
			}
			
			document.getElementById("games-panel-game-hangman-word").innerHTML = myString;
			document.getElementById("hangman-pic").src = "img/hangman-6.png";
			document.getElementById("hangman-msg").innerHTML = "Bummer, play again?";
		}
	}
	
	//process user input, main loop
	function guessHangman(){
		
		document.getElementById("hangman-msg").innerHTML = "";
		let myLetter = document.getElementById("hangman-input").value.toLowerCase();
		let myFound = false;
		let myWin = true;
		
		//check for empty string
		if(!myLetter){
			
		}else if(!hangmanActive){//check for game over
			
			alert("Please start a new game.");

		}else if(hangmanMiss.includes(myLetter) || hangmanHit.includes(myLetter)){//check for a previous entry
			
			alert("Duplicate guess.");
		}else{
			
			for(let i = 0; i < hangmanArray.length; i++){//main loop, sets flags
				
				if(myLetter == hangmanArray[i]){
					
					document.getElementById(`letter-${i}`).innerHTML = hangmanArray[i];
					myFound = true;
				}
				
				if(document.getElementById(`letter-${i}`).innerHTML == "_"){
					
					myWin = false;
				}
			}
			
			//handle flags
			if(!myFound){
			
				hangmanMissCount++;
				hangmanMiss.push(myLetter);
				document.getElementById("hangman-missed").innerHTML = hangmanMiss.join(",");
			}else{
				
				hangmanHit.push(myLetter);
			}
			
			if(hangmanMiss.length == 6){
				
				quitHangman();
			}
			
			if(myWin){
				
				hangmanActive = false;
				user.hangman += (hangmanArray.length * 2) - hangmanMissCount;
				post(user, scriptNames.post_scores);
				document.getElementById("hangman-pic").src = `img/you_win.png`;
				document.getElementById("hangman-msg").innerHTML = `Final score: ${(hangmanArray.length * 2) - hangmanMissCount}`;
			}
		}
		
		if(hangmanActive){
			document.getElementById("hangman-pic").src = `img/hangman-${hangmanMiss.length}.png`;
		}
		document.getElementById("hangman-input").value = "";
	}
	
	//force alpha input for hangman
	function valGuess(){
		let temp = document.getElementById("hangman-input").value.replace(/[^a-z]/gi, "");
		document.getElementById("hangman-input").value = temp;
	}
	
	//----tic tac toe----
	//set new game variables
	function tttNew(){
		
		tttBoard = [["","",""],["","",""],["","",""]];
		tttCtx.clearRect(0,0, tttCanvas.width, tttCanvas.height);
		document.getElementById("ttt-msg").innerHTML = "";

		tttActive = true;
		tttMoveCount = 0;
		
		if(document.getElementById("games-panel-game-ttt-buttons-turn").value == "2"){
			tttMyTurn = false;
			setTimeout(tttCpuTurn, 1000);
		}else{
			tttMyTurn = true;
		}
	}
	
	//stop the game, doesnt set variables
	function tttQuit(){
		
		if(tttActive){
			tttActive = false;
			document.getElementById("ttt-msg").innerHTML = `Bummer, try again?`;
		}
	}
	
	//click function for the whole canvas
	function tttClick(e){
		
		e.preventDefault();
		
		let myPos = {
			x: 0,
			y: 0
		};

		tttRect = tttCanvas.getBoundingClientRect();
		
		if(e.clientX){
			
			myPos.x = Math.floor((e.clientX - tttRect.left)/ tttSize);
			myPos.y = Math.floor((e.clientY - tttRect.top)/ tttSize);
		}else if(e.touches[0].clientX){
			
			myPos.x = Math.floor((e.touches[0].clientX - tttRect.left)/ tttSize);
			myPos.y = Math.floor((e.touches[0].clientY - tttRect.top)/ tttSize);
		}else{
			alert("Interface not supported.");
		}

		if(tttActive && tttMyTurn){
			
			if(tttBoard[myPos.y][myPos.x] == ""){
				
				tttBoard[myPos.y][myPos.x] = "x";
				tttDraw();
				tttMoveCount++;
				tttCheck();
				tttMyTurn = false;
			}else{
				alert("not empty");
			}
		}
			
		if(tttActive){
			setTimeout(tttCpuTurn, 1000);
		}
	}
	
	//made seperate to facilitate a sleep in between user turn and cpu's
	function tttCpuTurn(){
		
		
		
		if(tttActive && !tttMyTurn){
			if(ttt2x.length == 2){
				tttBoard[ttt2x[0]][ttt2x[1]] = "o";
			}else if(ttt2o.length == 2){
				tttBoard[ttt2o[0]][ttt2o[1]] = "o";
			}else{
				
				let myEmptySquares = [];
				for(let y = 0; y < 3; y++){
					for(let x = 0; x < 3; x++){
						
						if(tttBoard[y][x] == ""){
							myEmptySquares.push([y,x]);
						}
					}
				}
				
				if(myEmptySquares.length != 0){
					let tempNum = Math.floor(Math.random() * myEmptySquares.length);
					tttBoard[myEmptySquares[tempNum][0]][myEmptySquares[tempNum][1]] = "o";
				}
			}
			tttMyTurn = true;
		}
		
		tttDraw();
		tttCheck();
	}
	
	//creates rows to be inspected by the handle function
	function tttCheck(){
		
		ttt3 = [];
		ttt2x = [];
		ttt2o = [];
		let tempArray = [];
		let isFull = 0;
		
		for(let i = 0; i < 3; i++){
			
			tempArray = [[],[]];
			
			//verticals
			for(let j = 0; j < 3; j++){
				
				tempArray[0][j] = tttBoard[j][i];
				tempArray[1][j] = [j,i];
				
				if(tttBoard[i][j] != ""){
					isFull++;
				}
			}
			tttHandleArray(tempArray);
			
			//horizontals
			tempArray = [[],[]];
			tempArray[0] = tttBoard[i];
			tempArray[1] = [[i,0],[i,1],[i,2]];
			tttHandleArray(tempArray);
			
			//diagonals
			if(i < 2){
				tempArray = [[],[]];
				tempArray[0][0] = tttBoard[0][i*2];
				tempArray[0][1] = tttBoard[1][1];
				tempArray[0][2] = tttBoard[2][Math.abs(i-1)*2];
				tempArray[1] = [[0,i*2],[1,1],[2,Math.abs(i-1)*2]];
				tttHandleArray(tempArray);
			}
		}
		
		if(tttActive && isFull == 9){
			tttQuit();
		}
	}
	
	//checks each line and sets the other arrays used for the cpu ai
	function tttHandleArray(myArray){

		if(tttActive){

			let myValues = ["x", "o"];
			
			for(let i = 0; i < myValues.length; i++){
				
				let myCount = 0;
				
				for(let j = 0; j < myArray[0].length; j++){
					
					if(myValues[i] == myArray[0][j]){
						
						myCount++;
					}
				}

				switch(myCount){
					
					case 3:
						ttt3 = myArray;
						tttEndGame(myValues[i]);
						break;
					case 2:
						if(myArray[0].includes("")){
							
							if(myValues[i] == "x"){
								ttt2o = myArray[1][myArray[0].indexOf("")];
							}else{
								ttt2x = myArray[1][myArray[0].indexOf("")];
							}
						}
						break;
				}
			}
		}
	}
	
	//ends the game with an animation
	function tttEndGame(myVal){
		
		tttActive = false;
		for(let i = 0; i < 3; i++){
			
			tttCtx.drawImage(eval(`tttEnd${myVal}`), ttt3[1][i][1] * tttSize, ttt3[1][i][0] * tttSize, tttSize, tttSize);
		};
		
		let myScore = 15 - tttMoveCount;
		
		if(myVal == "o"){
			document.getElementById("ttt-msg").innerHTML = `Bummer, try again?`;
		}else{
			document.getElementById("ttt-msg").innerHTML = `You win! Final score: ${myScore}`;
			user.ttt += myScore;
			post(user, scriptNames.post_scores);
		}
	}
	
	//draws images for tictactoe, iterating through the game board and positioning them by the size factor
	function tttDraw(){
		
		tttCtx.clearRect(0,0, tttCanvas.width, tttCanvas.height);
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				
				if(tttBoard[i][j]){

					tttCtx.drawImage(eval(`tttImg${tttBoard[i][j]}`), j * tttSize, i * tttSize, tttSize, tttSize);
				}
			}
		}
	}
	
	//gets text input and submits it with a seconds since epoch timestamp
	function postChat(){
		
		let chatMsg = document.getElementById("games-panel-chat-text-input").value.trim();
		let tempNum = Date.now();
		
		chatObj = {
			name: user.name,
			msg: chatMsg,
			timestamp: tempNum.toString()
		};
		
		if(chatMsg){
			post(chatObj, scriptNames.post_chat);
			document.getElementById("games-panel-chat-text-input").value = "";
		}
	}
	

	//----php functions----
	//generic remove row, uses an id and a table name:
	function deleteRow(myId, myTable){
		
		const myObj = {
			id: myId,
			table: myTable};
			
		const jobj = JSON.stringify(myObj);
		
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				alert(xhttp.responseText);
			}
		};
		xhttp.open("POST", "scripts/delete_row.php", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(jobj);
	}
	
	//check to see if the user exists first, then send the response to the callback setUser()
	function checkUser(myCallback, myObj){

		const jobj = JSON.stringify(myObj);
		
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				myCallback(this.responseText);
			}
		};

		xhttp.open("POST", "scripts/check_user.php", true);
		xhttp.send(jobj);
	}
	
	//take the database response and then fork
	function setUser(myData){

		if(myData == "wrong password"){
			
			alert("Incorrect user/password combination.");
			
		}else{
			
			//registration catch, display corresping welcome message
			if(myData == "not found"){

				post(user, scriptNames.post_user);
				alert("Welcome " + user.name + "!");
			}else{
				alert("Welcome back " + user.name + "!");
			}

			hideChildren("games-content");

			//don't save the plain password
			user.pwd = "";

			document.getElementById("games-user-name").innerHTML = user.name;

			//set the floppy disk value and use that to set the image
			const savicon = document.getElementById("games-user-savicon");
			savicon.dataset.value = user.remember * 1;
			savicon.src = saviconImages[parseInt(savicon.dataset.value)];

			document.getElementById("games-wrapper").style.display = "inline-block";
			setUserScores();
		}
	}
	
	function setUserScores(){
		
		let myUser = lines[lines.findIndex(e => e.name == user.name)];
		user.id = parseInt(myUser.id);
		user.hangman = parseInt(myUser.hangman);
		user.ttt = parseInt(myUser.ttt);
		user.bird = parseInt(myUser.bird);
		user.hat = parseInt(myUser.hat);
	}
	
	//parses the saved chat messages, calls the loader
	function setChat(myData){
		
		chats = JSON.parse('[' + myData.replace(/}{/g, '},{') + ']');
		for(let i = 0; i < chats.length; i++){
			chats[i].id = parseInt(chats[i].id);
			chats[i].timestamp = parseInt(chats[i].timestamp);
		}
		loadChat();
	}
	
	//just grabs strings of words from a text file and slots them in an array by length
	function setHangman(myData){
		
		let temparray = myData.split(",");

		for(let i = 0; i < temparray.length; i++){
			hangmanWords[temparray[i].length-4].push(temparray[i]);
		}
	}
	
	function getUsers() {

		fetch("scripts/get_users.php")
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.text();
			})
			.then(text => {
				lines = JSON.parse('[' + text.replace(/}{/g, '},{') + ']');
			})
			.catch(error => {
				console.error('Fetch error:', error);
			});
	}
	
	
	//pulls a tables data and sends it to the appropriate callback function which sets it up
	function get(myCallback, myScript){
		
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				myCallback(this.responseText);
			}
		};

		xhttp.open("GET", myScript, true);
		xhttp.send();
		
	}
	
	//send the json string to the appropriate php script to insert data into the table
	function post(myObj, myScript){

		let jobj = JSON.stringify(myObj);
		
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				alert(xhttp.responseText);
			}
		};
		xhttp.open("POST", myScript, true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(jobj);
	}
	
	//fetch(url).then((response) -> myCallback(response.json()))
}