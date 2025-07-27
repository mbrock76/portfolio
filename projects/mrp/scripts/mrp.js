//post-load main
function init(){

	//-------------GLOBAL VARIABLES--------------
	var mobile = false;
	var span = `<div class="mrp-por-content-line"></div>`;
	var saviconImages = ["img/savicon.png", "img/savicon_green.png", "img/savicon_red.png"];
	
	//login
	var user = {name: "", pwd: 0, date: 0, remember: false};
	
	//mrp
	var partNums = {steel: 1, fasteners: 2, springs: 3, coating: 4, packaging: 5, widgetA: 6, widgetB: 7, widgetC: 8};
	var partNames = ["","steel","fasteners","springs","coating","packaging", "widgetA", "widgetB", "widgetC"];
	var deptNames = ["SOR", "INV", "CNC", "DBR", "QC", "PNT", "ASM", "QC", "SHI"];
	// var steps = ["00", "10", "20", "30", "40", "50", "60", "70", "80"];
	var scriptNames = {
		post_user: "scripts/post_user.php",
		post_por: "scripts/post_por.php",
		post_scrap: "scripts/post_scrap.php",
		post_sor: "scripts/post_sor.php",
		post_rou: "scripts/post_rou.php",
		post_bol: "scripts/post_bol.php",
		post_chat: "scripts/post_chat.php",
		post_scores: "scripts/update_scores.php",
		update_inv: "scripts/update_inv.php",
		update_por: "scripts/update_pors.php",
		update_sor: "scripts/update_sors.php",
		update_bols: "scripts/update_bols.php",
		get_pors: "scripts/get_pors.php",
		get_invs: "scripts/get_invs.php",
		get_sors: "scripts/get_sors.php",
		get_scrap: "scripts/get_scrap.php",
		get_bols: "scripts/get_bols.php",
		get_chat: "scripts/get_chat.php",
		get_hangman: "scripts/get_hangman.php"};

	var partQty = {
		widgetA: {
			steel: 1,
			fasteners: 1,
			springs: 0,
			coating: 1,
			packaging: 1},
		widgetB: {
			steel: 2,
			fasteners: 2,
			springs: 1,
			coating: 2,
			packaging: 1},
		widgetC: {
			steel: 3,
			fasteners: 2,
			springs: 2,
			coating: 3,
			packaging: 1}
	};

	var partDesc = {
		widgetA: {
			10: "",
			20: `<div class="mrp-rou-part-desc"><b>FILE:</br>MACHINE:</br>DOCUMENTS:</br>NOTES:</b></div>&nbsp;&nbsp;&nbsp;
				<div class="mrp-rou-part-desc">widgetA.tap</br>all</br>widgetA.png, feedspeeds.xlsx</br>-</div>`,
			30: `<div class="mrp-rou-part-desc">Standard deburr.</div>`,
			40: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> qc_sop_A.docx, widgetA.xlsx</div>`,
			50: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> coatings.xlsx</div>`,
			60: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> assembly_A.png</div>`,
			70: `<div class="mrp-content-part-desc"><b>DOCUMENTS:</b>widgetA.xlsx</div>`},
		widgetB: {
			10: "",
			20: `<div class="mrp-rou-part-desc"><b>FILE:</br>MACHINE:</br>DOCUMENTS:</br>NOTES:</b></div>&nbsp;&nbsp;&nbsp;
				<div class="mrp-rou-part-desc">widgetB.tap</br>all</br>widgetB.png, feedspeeds.xlsx</br>-</div>`,
			30: `<div class="mrp-rou-part-desc">Standard deburr.</div>`,
			40: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> qc_sop_B.docx, widgetB.xlsx</div>`,
			50: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> coatings.xlsx</div>`,
			60: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> assembly_B.png</div>`,
			70: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b>widgetB.xlsx</div>`},
		widgetC: {
			10: "",
			20: `<div class="mrp-rou-part-desc"><b>FILE:</br>MACH:</br>DOCS:</br>NOTES:</b></div>&nbsp;&nbsp;&nbsp;
				<div class="mrp-rou-part-desc">widgetC.tap</br>HAAS 500ss only.</br>widgetC.png, feedspeeds.xlsx</br>tech to dial in.</div>`,
			30: `<div class="mrp-rou-part-desc">Non-standard deburr, hole position critical!</div>`,
			40: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> qc_sop_C.docx, widgetC.xlsx</div>`,
			50: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> coatings.xlsx</div>`,
			60: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b> assembly_C.png</div>`,
			70: `<div class="mrp-rou-part-desc"><b>DOCUMENTS:</b>widgetC.xlsx</div>`}
		};
	var pors = [];
	var invs = [];
	var sors = [];
	var scraps = [];
	var mrpTimer;
	var milliday = 86400000;
	
	
	//-----------EVENT LISTENERS--------------
	window.addEventListener("resize", toggleCss);
	document.getElementById("hidden").addEventListener("click", hideElement);
	
	//mrp login elements
	document.getElementById("mrp-login-username").addEventListener("input", valUsername);
	document.getElementById("mrp-login-password").addEventListener("input", valPassword);
	document.getElementById("mrp-login-login").addEventListener("click", login);

	// navbar section: "home" button, loads the about/welcome page, login/username: show login form or logout
	document.getElementById("logo").addEventListener("click", toggleContent);
	document.getElementById("loginout").addEventListener("click", logInOut);
	document.getElementById("loginout").addEventListener("mouseover", toggleNameLogout);
	document.getElementById("loginout").addEventListener("mouseout", toggleNameLogout);
	document.getElementById("savicon").addEventListener("click", rememberMe);
	document.getElementById("savicon").addEventListener("mouseover", saviconColor);
	document.getElementById("savicon").addEventListener("mouseout", saviconColor);

	// nav button listeners to toggle visibility of related content
	const buttons = Array.from(document.getElementById("nav-buttons").children);

	buttons.forEach(function(button){
		button.addEventListener("click", toggleContent);
	});
	
	//mrp router buttons
	document.getElementById("mrp-rou-content-qty").addEventListener("input", valMrpQty);
	document.getElementById("mrp-rou-content-scrap").addEventListener("click", mrpRouScrap);
	document.getElementById("mrp-rou-content-comp").addEventListener("click", mrpRouComp);
	document.getElementById("mrp-rou-content-qty").addEventListener("input", valMrpQty);
	
	//mrp inventory buttons
	document.getElementById("mrp-inv-content-qty").addEventListener("input", valMrpQty);
	document.getElementById("mrp-inv-content-aisle").addEventListener("change", mrpInvRecSelect);
	document.getElementById("mrp-inv-content-col").addEventListener("change", mrpInvRecSelect);
	document.getElementById("mrp-inv-content-row").addEventListener("change", mrpInvRecSelect);
	document.getElementById("mrp-inv-content-scrap").addEventListener("click", mrpInvsScrap);
	document.getElementById("mrp-inv-content-move").addEventListener("click", mrpInvsMove);
	
	//mrp receiving buttons
	document.getElementById("mrp-rec-content-qty").addEventListener("input", valMrpQty);
	document.getElementById("mrp-rec-content-scrap").addEventListener("click", mrpRecScrap);
	document.getElementById("mrp-rec-content-receive").addEventListener("click", mrpRecReceive);
	
	//mrp shipping buttons
	document.getElementById("mrp-shi-content-add").addEventListener("click", addBol);
	document.getElementById("mrp-shi-content-new").addEventListener("click", newBol);
	document.getElementById("mrp-shi-content-ship").addEventListener("click", shipBol);
	document.getElementById("mrp-shi-content-bol").addEventListener("click", createBol);
	
	//mrp purchase order buttons
	document.getElementById("mrp-por-content-create-qty").addEventListener("input", valMrpQty);
	document.getElementById("mrp-por-content-create-submit").addEventListener("click", createNewPor);
	document.getElementById("mrp-por-content-cancel").addEventListener("click", removePor);
	
	//mrp sales order buttons
	document.getElementById("mrp-sor-content-create-qty").addEventListener("input", valMrpQty);
	document.getElementById("mrp-sor-content-create").addEventListener("click", createSor);
	document.getElementById("mrp-sor-content-cancel").addEventListener("click", cancelSor);
	document.getElementById("mrp-sor-content-release").addEventListener("click", releaseSor);
	
	//mrp document listeners
	var tempDocs = document.getElementsByClassName("mrp-doc-content-picthumb");
	for(let i = 0; i < tempDocs.length; i++){
		document.getElementById(tempDocs[i].id).addEventListener("click", expandPic);
	}

	//--------------FUNCTIONS-----------------	
	//initiate states
	toggleCss();
	hideChildren("hidden");
	loadMrp();
	
	//switches between desktop and mobile view, mostly to fit buttons
	function toggleCss(){
		
		if(window.innerWidth < window.innerHeight){
			document.getElementById("css").href = "css/mrp-vrt.css";
			document.getElementById("contents").style.margin = "0 5% 0 5%";
			mobile = true;
			tttSize = 80;			
			
			document.getElementById("mrp-inv-content-buttons").innerHTML = 
				`<div class="mrp-content-lines">
					<div>Filter:</br>
						<input type="checkbox" id="mrp-inv-content-filter"></input>
					</div>
					<div>
						<label for="mrp-inv-content-col">Location:</label></br>
						<select name="mrp-inv-content-aisle" id="mrp-inv-content-aisle" style="width:50px;">
							<option value="ALL">ALL</option>
							<option value="REC">REC</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
							<option value="D">D</option>
							<option value="E">E</option>
							<option value="F">F</option>
						</select>
						<select name="mrp-inv-content-col" id="mrp-inv-content-col" style="width:50px;">
							<option value="ALL">ALL</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
						</select>
						<select name="mrp-inv-content-row" id="mrp-inv-content-row" style="width:50px;">
							<option value="ALL">ALL</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
							<option value="D">D</option>
							<option value="E">E</option>
							<option value="F">F</option>
						</select>
					</div>
					<div>
						<label for="mrp-inv-content-items">Desc:</label></br>
						<select name="mrp-inv-content-items" id="mrp-inv-content-items" style="width:70px;">
							<option value="ALL">ALL</option>
							<option value="steel">steel</option>
							<option value="fasteners">fasteners</option>
							<option value="springs">springs</option>
							<option value="coating">coating</option>
							<option value="packaging">packaging</option>
						</select>
					</div>
				</div>
				<div class="mrp-content-lines">
					<div>
						<label for="mrp-inv-content-totals">Totals: </label>
						<input type="checkbox" id="mrp-inv-content-totals"></input>
					</div>
					<div>
						<label for="mrp-inv-content-qty">Qty: </label>
						<input type="text" name="mrp-inv-content-qty" id="mrp-inv-content-qty" placeholder="All?" size="2"></input>
					</div>
					<button type="button" id="mrp-inv-content-scrap">scrap</button><button type="button" id="mrp-inv-content-move">move</button>
				</div>`;
				
			document.getElementById("mrp-rou-content-buttons").innerHTML =
				`<div class="mrp-content-lines">
					<div>Filter: </br>
						<input type="checkbox" id="mrp-rou-content-filter"></input>
					</div>
					<div>
						<label for="mrp-rou-content-dept">Loc: </label></br>
						<select name="mrp-rou-content-dept" id="mrp-rou-content-dept" style="width:60px;">
							<option value="ALL">ALL</option>
							<option value="INV">Inventory</option>
							<option value="CNC">CNC</option>
							<option value="DBR">Deburr</option>
							<option value="QC">QC</option>
							<option value="PNT">Paint</option>
							<option value="ASM">Assembly</option>
						</select>
					</div>
					<div id="rou-desktop">
						<label for="mrp-rou-content-qty">Qty: </label></br>
						<input type="text" name="mrp-rou-content-qty" id="mrp-rou-content-qty" placeholder="All?" size="2"></input>
					</div>
					<div></br>
						<button type="button" id="mrp-rou-content-scrap">scrap</button>
					</div>
					<div></br>
						<button type="button" id="mrp-rou-content-comp">complete</button>
					</div>
				</div>`;
				
			document.getElementById("mrp-sor-content-buttons").innerHTML =
				`<div class="mrp-content-lines">
					<div>
						<label for="mrp-sor-content-filter">Filter:</label></br>
						<input type="checkbox" id="mrp-sor-content-filter"></input>
					</div>
					<div>
						<label for="mrp-sor-content-status">Status:</label></br>
						<select name="mrp-sor-content-status" id="mrp-sor-content-status" style="width:80px;">
							<option value="ALL">ALL</option>
							<option value="SOR">unreleased</option>
							<option value="PRO">in process</option>
							<option value="CAN">cancelled</option>
							<option value="SHI">shipped</option>
						</select>
					</div>
					<div>
						<label for="mrp-sor-content-items">Item:</label></br>
						<select name="mrp-sor-content-items" id="mrp-sor-content-items" style="width:80px;">
							<option value="ALL">ALL</option>
							<option value="6">widgetA</option>
							<option value="7">widgetB</option>
							<option value="8">widgetC</option>
						</select>
					</div>
					<div>
						<label for="mrp-sor-content-create-qty">Qty:</label></br>
						<input type="text" name="mrp-sor-content-create-qty" id="mrp-sor-content-create-qty" size="2" maxlength="1"></input>
					</div>
				</div>
				<div class="mrp-content-lines">
					<div>
						<button type="button" id="mrp-sor-content-cancel">cancel</button>
					</div>
					<div>
						<button type="button" id="mrp-sor-content-create">create</button>
					</div>
					<div>
						<button type="button" id="mrp-sor-content-release">release</button>
					</div>
				</div>
				`;
				document.getElementById("mrp-shi-content-buttons").innerHTML =
					`<div class="mrp-content-lines">
						<div>Filter:</br>
							<input type="checkbox" id="mrp-shi-content-filter"></input>
						</div>
						<div id="mrp-shi-content-bols-wrapper">
							<label for="mrp-shi-content-bols">Bols:</label></br>
							<select name="mrp-shi-content-bols" id="mrp-shi-content-bols" style="width:50px;">
								<option value="ALL">ALL</option>
							</select>
						</div>
						<div>
							<label for="mrp-shi-content-date">Date:</label></br>
							<input type="date" id="mrp-shi-content-date" name="mrp-shi-content-date">
						</div>
					</div>
					<div class="mrp-content-lines">
						<div>
							<label for="mrp-shi-content-carriers">Carriers:</label>
							<select name="mrp-shi-content-carriers" id="mrp-shi-content-carriers" style="width:70px;">
								<option value="ALL">ALL</option>
								<option value="UPS">UPS</option>
								<option value="FedEx">FedEx</option>
								<option value="Conway">Conway</option>
								<option value="Swift">Swift</option>
								<option value="Holland">Holland</option>
								<option value="Estes">Estes</option>
							</select>
						</div>
						<div>
							<label for="mrp-shi-content-items">Item:</label>
							<select name="mrp-shi-content-items" id="mrp-shi-content-items" style="width:70px;">
								<option value="ALL">ALL</option>
								<option value="6">widgetA</option>
								<option value="7">widgetB</option>
								<option value="8">widgetC</option>
							</select>
						</div>
					</div>
					<div class="mrp-content-lines">
						<button type="button" id="mrp-shi-content-add">Add</button>
						<button type="button" id="mrp-shi-content-new">New</button>
						<button type="button" id="mrp-shi-content-bol">Bol</button>
						<button type="button" id="mrp-shi-content-ship">Ship</button>
					</div>`;
					
		}
		else{
			document.getElementById("css").href = "css/mrp-hrz.css";
			mobile = false;
			tttSize = 100;
			
			document.getElementById("mrp-inv-content-buttons").innerHTML = 
				`<div class="mrp-content-lines">
					<div>Filter:</br>
						<input type="checkbox" id="mrp-inv-content-filter"></input>
					</div>
					<div>
						<label for="mrp-inv-content-col">Location:</label></br>
						<select name="mrp-inv-content-aisle" id="mrp-inv-content-aisle" style="width:50px;">
							<option value="ALL">ALL</option>
							<option value="REC">REC</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
							<option value="D">D</option>
							<option value="E">E</option>
							<option value="F">F</option>
						</select>
						<select name="mrp-inv-content-col" id="mrp-inv-content-col" style="width:50px;">
							<option value="ALL">ALL</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
						</select>
						<select name="mrp-inv-content-row" id="mrp-inv-content-row" style="width:50px;">
							<option value="ALL">ALL</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
							<option value="D">D</option>
							<option value="E">E</option>
							<option value="F">F</option>
						</select>
					</div>
					<div>
						<label for="mrp-inv-content-items">Desc:</label></br>
						<select name="mrp-inv-content-items" id="mrp-inv-content-items" style="width:70px;">
							<option value="ALL">ALL</option>
							<option value="steel">steel</option>
							<option value="fasteners">fasteners</option>
							<option value="springs">springs</option>
							<option value="coating">coating</option>
							<option value="packaging">packaging</option>
						</select>
					</div>
					<div>
						<label for="mrp-inv-content-totals">Totals: </label></br>
						<input type="checkbox" id="mrp-inv-content-totals"></input>
					</div>
					<div>
						<label for="mrp-inv-content-qty">Qty: </label></br>
						<input type="text" name="mrp-inv-content-qty" id="mrp-inv-content-qty" placeholder="All?" size="2"></input>
					</div>
					<div></br>
						<button type="button" id="mrp-inv-content-scrap">scrap</button>
					</div>
					<div></br>
						<button type="button" id="mrp-inv-content-move">move</button>
					</div>
				</div>`;
				
			document.getElementById("mrp-rou-content-buttons").innerHTML =
				`<div class="mrp-content-lines">
					<div>Filter: 
						<input type="checkbox" id="mrp-rou-content-filter"></input>
					</div>
					<div>
						<label for="mrp-rou-content-dept">Loc: </label>
						<select name="mrp-rou-content-dept" id="mrp-rou-content-dept" style="width:60px;">
							<option value="ALL">ALL</option>
							<option value="INV">Inventory</option>
							<option value="CNC">CNC</option>
							<option value="DBR">Deburr</option>
							<option value="QC">QC</option>
							<option value="PNT">Paint</option>
							<option value="ASM">Assembly</option>
						</select>
					</div>
					<div>
						<label for="mrp-rou-content-qty">Qty: </label>
						<input type="text" name="mrp-rou-content-qty" id="mrp-rou-content-qty" placeholder="All?" size="2"></input>
					</div>

					<button type="button" id="mrp-rou-content-scrap">scrap</button>

					<button type="button" id="mrp-rou-content-comp">complete</button>
				</div>`;
				
			document.getElementById("mrp-sor-content-buttons").innerHTML =
				`<div class="mrp-content-lines">
					<div>
						<label for="mrp-sor-content-filter">Filter:</label></br>
						<input type="checkbox" id="mrp-sor-content-filter"></input>
					</div>
					<div>
						<label for="mrp-sor-content-status">Status:</label></br>
						<select name="mrp-sor-content-status" id="mrp-sor-content-status" style="width:80px;">
							<option value="ALL">ALL</option>
							<option value="SOR">unreleased</option>
							<option value="PRO">in process</option>
							<option value="CAN">cancelled</option>
							<option value="SHI">shipped</option>
						</select>
					</div>
					<div>
						<label for="mrp-sor-content-items">Item:</label></br>
						<select name="mrp-sor-content-items" id="mrp-sor-content-items" style="width:80px;">
							<option value="ALL">ALL</option>
							<option value="6">widgetA</option>
							<option value="7">widgetB</option>
							<option value="8">widgetC</option>
						</select>
					</div>
					<div>
						<label for="mrp-sor-content-create-qty">Qty:</label></br>
						<input type="text" name="mrp-sor-content-create-qty" id="mrp-sor-content-create-qty" size="2" maxlength="1"></input>
					</div>
					<div>
						</br>
						<button type="button" id="mrp-sor-content-cancel">cancel</button>
					</div>
					<div>
						</br>
						<button type="button" id="mrp-sor-content-create">create</button>
					</div>
					<div>
						</br>
						<button type="button" id="mrp-sor-content-release">release</button>
					</div>
				</div>`;
				
				document.getElementById("mrp-shi-content-buttons").innerHTML =
					`<div class="mrp-content-lines">
						<div>Filter:</br>
							<input type="checkbox" id="mrp-shi-content-filter"></input>
						</div>
						<div id="mrp-shi-content-bols-wrapper">
							<label for="mrp-shi-content-bols">Bols:</label></br>
							<select name="mrp-shi-content-bols" id="mrp-shi-content-bols" style="width:50px;">
								<option value="ALL">ALL</option>
							</select>
						</div>
						<div>
							<label for="mrp-shi-content-date">Date:</label></br>
							<input type="date" id="mrp-shi-content-date" name="mrp-shi-content-date">
						</div>
						<div>
							<label for="mrp-shi-content-carriers">Carriers:</label></br>
							<select name="mrp-shi-content-carriers" id="mrp-shi-content-carriers" style="width:70px;">
								<option value="ALL">ALL</option>
								<option value="UPS">UPS</option>
								<option value="FedEx">FedEx</option>
								<option value="Conway">Conway</option>
								<option value="Swift">Swift</option>
								<option value="Holland">Holland</option>
								<option value="Estes">Estes</option>
							</select>
						</div>
						<div>
							<label for="mrp-shi-content-items">Item:</label></br>
							<select name="mrp-shi-content-items" id="mrp-shi-content-items" style="width:70px;">
								<option value="ALL">ALL</option>
								<option value="6">widgetA</option>
								<option value="7">widgetB</option>
								<option value="8">widgetC</option>
							</select>
						</div>
					</div>
					<div class="mrp-content-lines">
						<button type="button" id="mrp-shi-content-add">Add</button>
						<button type="button" id="mrp-shi-content-new">New</button>
						<button type="button" id="mrp-shi-content-bol">Bol</button>
						<button type="button" id="mrp-shi-content-ship">Ship</button>
					</div>`;
		}
	}
	
	function hideChildren(myId){

		const children = Array.from(document.getElementById(myId).children);

		children.forEach(function(each){
			each.style.display = "none";
		});
	}

	//show/hide toggle for each mrp section
	function toggleContent(e){

		const target = document.getElementById(e.target.id);

		//check whether its the homepage button
		if(target.id == "logo"){

			hideChildren("contents");

			//change all buttons to not focused
			const buttons = Array.from(document.getElementById("nav-buttons").children);

			buttons.forEach(function(button){

				if(button.classList.contains("navBtnFocus")){
					
					button.classList.replace("navBtnFocus", "navBtn");
				}
			});

			document.getElementById("content-about").style.display = "block";
		
		}else{ //a nav button was clicked

			//hide about first
			document.getElementById("content-about").style.display = "none";

			const temp = e.target.id.split("-");

			// switch target button on/off
			if(target.classList.contains("navBtn")){

				target.classList.replace("navBtn", "navBtnFocus");

				// display the associated content block
				document.getElementById("content-" + temp[1]).style.display = "flex";

			}else{

				target.classList.replace("navBtnFocus", "navBtn");

				// hide the associated content block
				document.getElementById("content-" + temp[1]).style.display = "none";
			}
		}
	}
	
	//force input to be numeric for quantity
	function valMrpQty(e){
		let temp = document.getElementById(e.target.id).value.replace(/[^0-9]/g, "");
		document.getElementById(e.target.id).value = temp;
	}
	
	//sanitize input
	function valUsername(){
		
		const temp = document.getElementById("mrp-login-username").value.replace(/[^a-z0-9_]/gi, "");
		document.getElementById("mrp-login-username").value = temp;
	}	
	
	//sanitize input
	function valPassword(){
		
		const temp = document.getElementById("mrp-login-password").value.replace(/[^a-z0-9_]/gi, "");
		document.getElementById("mrp-login-password").value = temp;
	}
	
	//show the login form or log out
	function logInOut(){

		if(document.getElementById("loginout").innerText == "Login"){

			hideChildren("hidden");
			document.getElementById("mrp-login").style.display = "flex";
			document.getElementById("hidden").style.display = "flex";
		}else{

			logout();
		}
	}

	// changes the username to "logout?" on mouse hover to describe click action
	function toggleNameLogout(e){

		if(e.target.innerText != "Login"){

			if(e.target.innerText != "Logout?"){
				e.target.innerText = "Logout?";
			}else{
				e.target.innerText = user.name;
			}
		}
	}

	//all purpose function to either log in or create a new user and log in
	function login(){

		const name = document.getElementById("mrp-login-username").value;
		const pwd = document.getElementById("mrp-login-password").value;
		
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
		
		localStorage.removeItem("mrp-user");
		user = {name: "", date: 0, remember: false};
		
		loadMrp();
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
		
		// check the stored state variable which correlates to icon color
		if(savicon.dataset.value == "0"){

			user.remember = true;
			localStorage.setItem("mrp-user", JSON.stringify(user));

		}else{

			user.remember = false;
			localStorage.removeItem("mrp-user");
		}

		savicon.src = saviconImages[Math.abs(parseInt(savicon.dataset.value) - 1)];
		savicon.dataset.value = Math.abs(parseInt(savicon.dataset.value) - 1);
	}
	
	//initial loading for the mrp section, checks for username
	function loadMrp(){
		
		const loginout = document.getElementById("loginout");
		const savicon = document.getElementById("savicon");
		const temp = localStorage.getItem("mrp-user");

		//check if the user opted to be remembered
		if(temp != null){ user = JSON.parse(temp); }
		
		//check if the user is still logged in or remembered
		if(user.name){

			loginout.innerText = user.name;
			savicon.dataset.value = user.remember * 1;
			savicon.src = saviconImages[parseInt(savicon.dataset.value)];
			savicon.style.display = "inline-block";
			document.getElementById("nav-buttons").style.display = "flex";

		//if they are logged out and forgotten, load the login form
		}else{
			
			loginout.innerText = "Login";
			savicon.style.display = "none";
			document.getElementById("nav-buttons").style.display = "none";
		}
		
		hideChildren("contents");
		document.getElementById("content-about").style.display = "block";

		clearInterval(mrpTimer);
		mrpTimer = setInterval(refreshMrp, 3000);
	}
	
	//call functions that query the database with callback functions to populate tables
	function refreshMrp(){

		get(setScrap, scriptNames.get_scrap);
		get(setPors, scriptNames.get_pors);
		get(setInvs, scriptNames.get_invs);
		get(setSors, scriptNames.get_sors);
		get(setBols, scriptNames.get_bols);
	}
	
	//creates rows for each sales order step, with appropriate instructions/buttons for the department employees to use
	function loadRou(){
		
		let myString = "";
		let tempQty = document.getElementsByClassName("mrp-rou-pick-qty");
		let myRouQuantities = Array.from(tempQty);
		let tempCheckbox = document.getElementsByClassName("rous");
		let myRowElements = Array.from(tempCheckbox);
		let tempSelect = document.getElementsByClassName("mrp-rou-pick-loc");
		let myRouSelects = Array.from(tempSelect);
		let myFocus = document.activeElement;

		myString += span;
		if(mobile){
			myString += `<table class="outer-table table-data"><tr><th></th><th>ID:</th><th>Dept:</th><th>Qty:</th></tr>`;
		}else{
			myString += `<table class="outer-table table-data"><tr><th></th><th>ID:</th><th>Dept:</th><th id="mrp-rou-table-th">Description:</th><th>Qty:</th></tr>`;
		}
		
		//main loop to generate a table row for each sales order
		for(let i = 0; i < sors.length; i++){
			
			//excludes any sales order that is not in production
			if(isNaN(sors[i].step)){
				continue;
			}
			
			//filter by department 
			if(document.getElementById("mrp-rou-content-filter").checked == true){
				let myDept = document.getElementById("mrp-rou-content-dept").value;
				if(myDept != "ALL"){
					if(myDept != deptNames[parseInt(sors[i].step.substr(0,1))]){
						continue;
					}
				}
			}
			
			//gathers locations for material
			let locs = [[],[],[],[],[],[]];
			for(let j = 0; j < invs.length; j++){
				if(parseInt(invs[j].qty) > 0 && invs[j].loc != "REC"){

					locs[parseInt(invs[j].partID)].push(invs[j].loc);
				}
			}
			
			//builds the description string, which may be the table for picking orders
			let descString = "";
			if(sors[i].step == "10"){

				descString += `<table class="mrp-rou-table-desc-table"><tr><th>Item:</th><th>Loc:</th><th>Qty:</th><th>Pick:</th><th>Totals:</th></tr>`;
				for(let j = 1; j < locs.length; j++){
					descString += `<tr><td> ${partNames[j]}: </td>`;
					descString += `<td><select class="mrp-rou-pick-loc" id="mrp-rou-pick-${sors[i].id.toString()}-${j}-loc">`;
					for(let k = 0; k < locs[j].length; k++){
						descString += `<option value="${locs[j][k]}">${locs[j][k]}</option>`;
					}
					descString += `</select></td>`;
					descString += `<td><input type="text" class="mrp-rou-pick-qty" id="mrp-rou-pick-${sors[i].id.toString()}-${j}-qty" placeholder="All?" size="2"></input></td>`;
					descString += `<td><button type="button" class="mrp-rou-pick-confirm" id="mrp-rou-pick-${sors[i].id.toString()}-${j}-confirm"><b>+</b></button></td>`;
					descString += `<td>${sors[i].pickQty[j-1]}/${(partQty[partNames[sors[i].partID]][partNames[j]] * sors[i].qty)}</td></tr>`;
				}
				descString += `</table>`;
				partDesc[partNames[sors[i].partID]][sors[i].step] = descString;
			}
			
			myString += `<tr><td><input type="checkbox" class="rous" id="rou${sors[i].id}" value="${sors[i].id}"></td>`;
			myString += `<td>${sors[i].id}</td>`;
			myString += `<td>${deptNames[parseInt(sors[i].step.substr(0,1))]}</td>`;
			if(mobile){
				myString += `<td>${sors[i].stepQty[parseInt(sors[i].step.substr(0,1)) + (parseInt(sors[i].step.substr(0,1))-1)]}/${sors[i].qty}</td></tr>`;
				myString += `<tr><td colspan="4">${partDesc[partNames[sors[i].partID]][sors[i].step]}</td>`;
			}else{
				myString += `<td>${partDesc[partNames[sors[i].partID]][sors[i].step]}</td>`;
				myString += `<td>${sors[i].stepQty[parseInt(sors[i].step.substr(0,1)) + (parseInt(sors[i].step.substr(0,1))-1)]}/${sors[i].qty}</td>`;
			}
			myString += `</tr>`;
		}
		myString += `</table>`;
		
		document.getElementById("mrp-rou-content-data").innerHTML = myString;
		
		//attach the event listeners to the buttons created above, for the pick function
		let tempButtons = document.getElementsByClassName("mrp-rou-pick-confirm");
		let myRouButtons = Array.from(tempButtons);
		for(let i = 0; i < myRouButtons.length; i++){
			document.getElementById(myRouButtons[i].id).addEventListener("click", function(){mrpRouPick(myRouButtons[i].id)});
		}
		
		//recheck any boxes that were checked
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){
				document.getElementById(myRowElements[i].id).checked = true;
			}
		}
		
		if(myFocus.id){
			document.getElementById(myFocus.id).focus();
		}
		
		//reselect drop down menu locations and also populate the quantity fields, for the pick function
		for(let i = 0; i < myRouSelects.length; i++){
			document.getElementById(myRouSelects[i].id).value = myRouSelects[i].value;
			document.getElementById(myRouQuantities[i].id).value = myRouQuantities[i].value;
			document.getElementById(myRouQuantities[i].id).addEventListener("input", valMrpQty);
		}
	}
	
	//pick function for each item in a sales order: will decrement inventory at selected location and increment the quantity in the order
	function mrpRouPick(e){

		let temp = e.split("-");
		let tempID = `${temp[3]}-${temp[4]}`;
		let mySorID = temp[3];
		let myLoc = document.getElementById(`mrp-rou-pick-${tempID}-loc`).value;
		let myQty = parseInt(document.getElementById(`mrp-rou-pick-${tempID}-qty`).value);
		document.getElementById(`mrp-rou-pick-${tempID}-qty`).value = "";
		let myInvID = 0;
		let sorObj = {};
		let invObj = {};
		
		//get the sales order Object
		for(let i = 0; i < sors.length; i++){
			if(mySorID == sors[i].id){
				sorObj = sors[i];
			}
		}
		
		//find the inventory location
		for(let i = 0; i < invs.length; i++){
			if(invs[i].loc == myLoc && invs[i].partID == parseInt(tempID.charAt(tempID.length-1))){
				myInvID = i;
			}
		}
		
		
		if(sorObj.pickQty[parseInt(temp[4])-1] != (partQty[partNames[sorObj.partID]][partNames[parseInt(temp[4])]] * sorObj.qty)){
			
			//force quantity in bounds
			if(isNaN(myQty) || myQty >= ((partQty[partNames[sorObj.partID]][partNames[parseInt(temp[4])]] * sorObj.qty) - sorObj.pickQty[parseInt(temp[4])-1])){
				
				if(invs[myInvID].qty <= ((partQty[partNames[sorObj.partID]][partNames[parseInt(temp[4])]] * sorObj.qty) - sorObj.pickQty[parseInt(temp[4])-1])){
					myQty = invs[myInvID].qty;
				}else{
					myQty = (partQty[partNames[sorObj.partID]][partNames[parseInt(temp[4])]] * sorObj.qty) - sorObj.pickQty[parseInt(temp[4])-1];
				}
			}else{
				
				if(myQty > invs[myInvID].qty){
					myQty = invs[myInvID].qty;
				}
			}

			sorObj.pickQty[parseInt(temp[4])-1] += myQty;
			sorObj.stepQty = sorObj.stepQty.toString();
			sorObj.pickQty = sorObj.pickQty.toString();
			invObj.qty = -myQty;
			invObj.id = myInvID + 1;
			post(sorObj, scriptNames.update_sor);
			post(invObj, scriptNames.update_inv);
		}else{
			alert("The required quantity is already picked.");
		}
	}
	
	function mrpRouScrap(){

		let myQty = parseInt(document.getElementById("mrp-rou-content-qty").value);
		let temp = document.getElementsByClassName("rous");
		let myRowElements = Array.from(temp);
		let rouObj = {
			compQty: 0,
			lot: "",
			serial: ""
		};
			
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked == true){
				
				for(let j = 0; j < sors.length; j++){
					if(myRowElements[i].value == sors[j].id){
						
						if(sors[j].step != "10"){
							rouObj.sorID = myRowElements[i].value;
							rouObj.step = sors[j].step;
							rouObj.emp = user.name;
							sorObj = sors[j];
							let tempNum = parseInt(sorObj.step.charAt(0));
							if(isNaN(myQty) || myQty > sorObj.qty){
								myQty = sorObj.stepQty[tempNum * 2 -1];
							}
							
							rouObj.scrapQty = myQty;
							sorObj.stepQty[tempNum * 2 -2] += myQty;
							sorObj.stepQty[tempNum * 2 -1] -= myQty;
							if(sorObj.stepQty[tempNum * 2 -1] == 0){
								if(tempNum < 7){
									tempNum += 1;
									sorObj.step = tempNum.toString() + "0";
								}else{
									sorObj.step = "SHI";
								}
							}

							sorObj.qty = sors[j].qty - myQty;
							if(sorObj.qty == 0){
								sorObj.step = "CAN";
							}
							sorObj.stepQty = sorObj.stepQty.toString();
							sorObj.pickQty = sorObj.pickQty.toString();
							
							post(rouObj, scriptNames.post_rou);
							post(sorObj, scriptNames.update_sor);
						}else{
							alert("There is nothing to scrap yet.\nThe order can be cancelled from the Sales Order tab.");
						}
					}
				}
			}
		}
	}
	
	//decrements and increments a given quantity from one step to another
	function mrpRouComp(){
		
		let myQty = parseInt(document.getElementById("mrp-rou-content-qty").value);
		let temp = document.getElementsByClassName("rous");
		let myRowElements = Array.from(temp);
		
		let rouObj = {
			lot: "",
			serial: "",
			emp: user.name
		};

		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked == true){
				
				for(let j = 0; j < sors.length; j++){
					if(myRowElements[i].value == sors[j].id){
						
						sorObj = sors[j];
						rouObj.sorID = myRowElements[i].value;
						rouObj.step = sorObj.step;
						rouObj.scrapQty = 0;
						
						let tempNum = parseInt(sorObj.step.charAt(0));
						if(isNaN(myQty) || myQty >= sorObj.qty){
							myQty = sorObj.stepQty[tempNum * 2 -1];
						}
						rouObj.compQty = myQty;
						
						sorObj.post = true;
						if(sorObj.step == "10"){
							for(let k = 0; k < sorObj.pickQty.length; k++){
								if(sorObj.pickQty[k] != (partQty[partNames[sorObj.partID]][partNames[k+1]] * sorObj.qty)){
									sorObj.post = false;
								}
							}
						}
						
						sorObj.stepQty[tempNum * 2 - 1] -= myQty;
						sorObj.stepQty[tempNum * 2 + 1] += myQty;
						if(sorObj.stepQty[tempNum * 2 -1] == 0){
							if(tempNum < 7){
								tempNum += 1;
								sorObj.step = tempNum.toString() + "0";
							}else{
								sorObj.step = "SHI";
							}
						}
										
						if(sorObj.post){
							sorObj.stepQty = sors[j].stepQty.toString();
							sorObj.pickQty = sors[j].pickQty.toString();
							post(rouObj, scriptNames.post_rou);
							post(sorObj, scriptNames.update_sor);
						}else{
							alert("Order #" + sorObj.id + " has not been picked.");
						}
					}
				}
			}
		}
	}
	
	function loadInvs(){
		
		let myString = "";
		let myScraps = "";
		let locArray = [];
		let desc;
		let totals = {
			steel: {
				inv: 0,
				por: 0,
				sor: 0,
				scrap: 0},
			fasteners: {
				inv: 0,
				por: 0,
				sor: 0,
				scrap: 0},
			springs: {
				inv: 0,
				por: 0,
				sor: 0,
				scrap: 0},
			coating: {
				inv: 0,
				por: 0,
				sor: 0,
				scrap: 0},
			packaging: {
				inv: 0,
				por: 0,
				sor: 0,
				scrap: 0}
		};
		
		//string headers
		myString += span;
		myScraps += span;
		myString += `<table class="outer-table table-data"><tr><th></th><th>Loc:</th><th>partID:</th><th>desc:</th><th>qty:</th></tr>`;
		myScraps += `<table class="outer-table table-data"><tr><th>PartID:</th><th>Desc:</th><th>Inv:</th><th>Pors:</th><th>Sors:</th><th>Scrap:</th></tr>`;
		
		//regular string generation
		for(let i = 0; i < invs.length; i++){
			if(invs[i].qty == 0){
				continue;
			}
			
			totals[partNames[invs[i].partID]].inv += parseInt(invs[i].qty);
			
			if(document.getElementById("mrp-inv-content-filter").checked == true){
				let locArray = [document.getElementById("mrp-inv-content-aisle").value, document.getElementById("mrp-inv-content-col").value, document.getElementById("mrp-inv-content-row").value];
				desc = document.getElementById("mrp-inv-content-items").value;
				
				if(locArray[0] == "REC"){
					if(invs[i].loc != "REC"){
						continue;
					}
				}else{
					if(locArray[0] != "ALL" && locArray[0] != invs[i].loc.substr(0,1)){
						continue;
					}
					if(locArray[1] != "ALL" && locArray[1] != invs[i].loc.substr(1,1)){
						continue;
					}
					if(locArray[2] != "ALL" && locArray[2] != invs[i].loc.substr(2,1)){
						continue;
					}
				}
				
				if(desc != "ALL" && partNums[desc] != invs[i].partID){
					continue;
				}
			}
			
			myString += `<tr><td><input type="checkbox" class="invs" id="inv${invs[i].id}" value="${i}"></td>`;
			myString += `<td>${invs[i].loc}</td>`;
			myString += `<td>${invs[i].partID}</td>`;
			myString += `<td>${partNames[invs[i].partID]}</td>`;
			myString += `<td>${invs[i].qty}</td>`;
			myString += `</tr>`;
		}
		myString += `</table>`;
		
		//generates the scrap string
		for(let i = 0; i < sors.length; i++){
			let myQty = parseInt(sors[i].qty);
			for(let j = 1; j < 6; j++){
				totals[partNames[j]].sor += partQty[partNames[sors[i].partID]][partNames[j]] * myQty;
			}
		}
		
		for(let i = 0; i < pors.length; i++){
			totals[partNames[pors[i].partID]].por += parseInt(pors[i].qty);
		}
		
		for(let i = 0; i < scraps.length; i++){
			totals[partNames[scraps[i].partID]].scrap += parseInt(scraps[i].qty);
		}

		for(let i = 1; i < 6; i++){

			myScraps += `<tr><td>${i}</td>`;
			myScraps += `<td>${partNames[i]}</td>`;
			myScraps += `<td>${totals[partNames[i]].inv}</td>`;
			myScraps += `<td>${totals[partNames[i]].por}</td>`;
			myScraps += `<td>${totals[partNames[i]].sor}</td>`;
			myScraps += `<td>${totals[partNames[i]].scrap}</td>`;
			myScraps += `</tr>`;
		}
		myScraps += `</table>`;
		
		let temp = document.getElementsByClassName("invs");
		let myRowElements = Array.from(temp);

		//switch loader
		if(document.getElementById("mrp-inv-content-totals").checked == true){
			document.getElementById("mrp-inv-content-data").innerHTML = myScraps;
		}else{
			document.getElementById("mrp-inv-content-data").innerHTML = myString;
			for(let i = 0; i < myRowElements.length; i++){
				if(myRowElements[i].checked){
					document.getElementById(myRowElements[i].id).checked = true;
				}
			}
		}
	}
	
	function mrpInvRecSelect(){
		if(document.getElementById("mrp-inv-content-aisle").value == "REC"){
			document.getElementById("mrp-inv-content-col").value = "ALL";
			document.getElementById("mrp-inv-content-row").value = "ALL";
		}
	}
	
	//subtracts a quantity from a location and submits a scrap log entry
	function mrpInvsScrap(){
		
		let myQty = parseInt(document.getElementById("mrp-inv-content-qty").value);

		let temp = document.getElementsByClassName("invs");
		let myRowElements = Array.from(temp);
		
		if(myRowElements.length > 0){
			for(let i = 0; i < myRowElements.length; i++){

				if(myRowElements[i].checked){
					
					let tempID = parseInt(myRowElements[i].value);

					let invObj = {
						id: parseInt(tempID + 1),
						qty: 0};
						
					if(!myQty || myQty >= parseInt(invs[tempID].qty)){
						invObj.qty = parseInt(-invs[tempID].qty);
					}else{
						invObj.qty = -myQty;
					}
					
					post(invObj, scriptNames.update_inv);
				}
			}
		}
	}
	
	//subtracts a quantity from one location and adds it to another
	function mrpInvsMove(){
		
		let myQty = parseInt(document.getElementById("mrp-inv-content-qty").value);
		let locArray = [document.getElementById("mrp-inv-content-aisle").value, document.getElementById("mrp-inv-content-col").value, document.getElementById("mrp-inv-content-row").value];
		let temp = document.getElementsByClassName("invs");
		let myRowElements = Array.from(temp);
		let move = false;
		let newObj = {
			id: 0,
			loc: "",
			partID: 0,
			qty: 0};

		if(locArray[0] == "REC"){
			newObj.loc = "REC";
			move = true;
		}else if(!locArray.includes("ALL")){
			newObj.loc = locArray[0] + locArray[1] + locArray[2];
			move = true;
		}else{
			alert("Select a valid location to move the inventory to.");
			move = false;
		}
		
		if(move){
			
			for(let i = 0; i < myRowElements.length; i++){

				if(myRowElements[i].checked){
					
					let tempID = parseInt(myRowElements[i].value);
					invObj = invs[tempID];
					newObj.partID = invObj.partID;
					
					for(let j = 0; j < invs.length; j++){
						if(newObj.loc == invs[j].loc && newObj.partID == invs[j].partID){
							newObj.id = invs[j].id;
						}
					}

					if(isNaN(myQty) || myQty >= invs[tempID].qty){
						myQty = invs[tempID].qty;
					}
					invObj.qty = -myQty;
					newObj.qty = myQty;
					
					post(invObj, scriptNames.update_inv);
					post(newObj, scriptNames.update_inv);
				}
			}
		}
	}
	
	//create an html table of data from purchase orders 
	function loadRecs(){
		
		let isGray = true;
		let myString = "";
		let temp = document.getElementsByClassName("recs");
		let myRowElements = Array.from(temp);
		let myDate = new Date();
		let recDate = new Date();

		myString += span;
		myString += `<table class="outer-table table-data"><tr><th></th><th>order#</th><th>partID</th><th>desc.</th><th>qty.</th><th>order date</th><th>del. date</th></tr>`;
		
		for(let i = 0; i < pors.length; i++){
			
			recDate.setFullYear(parseInt(pors[i].recDate.substr(0,4)));
			recDate.setMonth(parseInt(pors[i].recDate.substr(5,2))-1);
			recDate.setDate(parseInt(pors[i].recDate.substr(8)));
			
			if(isGray){
				myString += `<tr class="gray-row">`;
				isGray = false;
			}else{
				myString += `<tr>`;
				isGray = true;
			}
			
			/*if(myDate.getTime() > recDate.getTime()){
				myString += `<td><input type="checkbox" class="recs" id="rec${i}" value="${pors[i].id}"></td>`;
			}else{
				myString += `<td></td>`;
			}*/
			myString += `<td><input type="checkbox" class="recs" id="rec${pors[i].id}" value="${pors[i].id}"></td>`;
			myString += `<td>${pors[i].id}</td>`;
			myString += `<td>${pors[i].partID}</td>`;
			myString += `<td>${partNames[pors[i].partID]}</td>`;
			myString += `<td>${pors[i].qty}</td>`;
			myString += `<td>${pors[i].ordDate.substr(5)}</td>`;
			myString += `<td>${pors[i].recDate.substr(5)}</td>`;
			myString += `</tr>`;
		}
		myString += `</table>`;
		
		document.getElementById("mrp-rec-content-data").innerHTML = myString;
		
		for(let i = 0; i < myRowElements.length; i++){
			
			if(myRowElements[i].checked){
				document.getElementById(myRowElements[i].id).checked = true;
			}
		}
	}
	
	//remove a quantity from purchase orders, typically due to damage during shipping
	function mrpRecScrap(){
		
		let myQty = parseInt(document.getElementById("mrp-rec-content-qty").value);
		let recObj = {
			id: 0,
			partID: 0,
			qty: 0,
			scrap: 0,
			emp: user.name};
			
		let temp = document.getElementsByClassName("recs");
		let myRowElements = Array.from(temp);
		
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){

				recObj.id = parseInt(myRowElements[i].value);
				recObj.partID = parseInt(pors[i].partID);
				
				if(!myQty || myQty >= parseInt(pors[i].qty)){
					recObj.scrap = parseInt(pors[i].qty);
					post(recObj, scriptNames.post_scrap);
					deleteRow(myRowElements[i].value, "por");
				}else{
					recObj.qty = parseInt(pors[i].qty) - parseInt(myQty);
					recObj.scrap = myQty;
					post(recObj, scriptNames.update_por);
					post(recObj, scriptNames.post_scrap);
				}
			}
		}
	}
	
	//moves accepted delivery quantity to the inventory table in location "rec", the inventory clerks can now see it and move it physically
	function mrpRecReceive(){
		
		let myQty = parseInt(document.getElementById("mrp-rec-content-qty").value);
		let temp = document.getElementsByClassName("recs");
		let myRowElements = Array.from(temp);
	
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){
				
				let recObj = {
					id: parseInt(myRowElements[i].value),
					loc: "REC",
					partID: parseInt(pors[i].partID),
					qty: 0};

				if(!myQty || myQty >= parseInt(pors[i].qty)){
					recObj.qty = parseInt(pors[i].qty);
					deleteRow(recObj.id, "por");
					recObj.id = parseInt("108" + pors[i].partID);
					post(recObj, scriptNames.update_inv);
				}else{
					recObj.qty = parseInt(pors[i].qty) - parseInt(myQty);
					post(recObj, scriptNames.update_por);
					recObj.qty = myQty;
					recObj.id = parseInt("108" + pors[i].partID);
					post(recObj, scriptNames.update_inv);
				}
			}
		}
	}
	
	//loads sales orders at the shipping step
	function loadShips(){
		
		let isGray = true;
		let myString = "";
		let myBol = document.getElementById("mrp-shi-content-bols");
		let myBolString = `<label for="mrp-shi-content-bols">Bols:</label></br>
							<select name="mrp-shi-content-bols" id="mrp-shi-content-bols" style="width:50px;">
								<option value="ALL">ALL</option>`;
		for(let i = 0; i < bols.length; i++){
			if(bols[i].step == "SHI"){
				myBolString += `<option value="${bols[i].id}">${bols[i].id}</option>`;
			}
		}
		myBolString += `</select>`;
		document.getElementById("mrp-shi-content-bols-wrapper").innerHTML = myBolString;
		document.getElementById("mrp-shi-content-bols").value = myBol.value;
		if(!isNaN(myBol.value)){
			myBol.value = parseInt(myBol.value);
		}

		let myDate = document.getElementById("mrp-shi-content-date").value;
		let myCarrier = document.getElementById("mrp-shi-content-carriers").value;
		let myItem = document.getElementById("mrp-shi-content-items").value;
		let temp = document.getElementsByClassName("ships");
		let myRowElements = Array.from(temp);
		
		myString += span;
		myString += `<table class="outer-table table-data"><tr><th></th><th>ID</th><th>Desc</th><th>Qty</th><th>Bol</th><th>Carrier</th><th>Date</th></tr>`;

		for(let i = 0; i < sors.length; i++){
			
			if(sors[i].step != "SHI"){
				continue;
			}

			if(document.getElementById("mrp-shi-content-filter").checked == true){
				
				if(myBol.value != "ALL"){
					if(myBol.value != sors[i].bol){
						continue;
					}
				}
				
				if(myDate != ""){
					if(sors[i].bol == 0){
						continue;
					}else if(myDate != bols[sors[i].bol - 1].shipDate){
						continue;
					}
				}
				if(myCarrier != "ALL"){
					if(myCarrier != bols[sors[i].bol - 1].carrier){
						continue;
					}
				}
				if(myItem != "ALL"){
					if(parseInt(myItem) != sors[i].partID){
						continue;
					}
				}
			}
			
			if(isGray){
				myString += `<tr class="gray-row">`;
				isGray = false;
			}else{
				myString += `<tr>`;
				isGray = true;
			}
			
			myString += `<td><input type="checkbox" class="ships" id="shi${sors[i].id}" value="${sors[i].id}"></td>`;
			myString += `<td>${sors[i].id}</td>`;
			myString += `<td>${partNames[sors[i].partID]}</td>`;
			myString += `<td>${sors[i].qty}</td>`;
			if(sors[i].bol > 0){
				myString += `<td>${sors[i].bol}</td>`;
				myString += `<td>${bols[sors[i].bol - 1].carrier}</td>`;
				myString += `<td>${bols[sors[i].bol - 1].shipDate.substr(5)}</td>`;
			}else{
				myString += `<td>-</td>`;
				myString += `<td>-</td>`;
				myString += `<td>-</td>`;
			}
			myString += `</tr>`;
		}
		myString += `</table>`;
		
		document.getElementById("mrp-shi-content-data").innerHTML = myString;
		
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){
				document.getElementById(myRowElements[i].id).checked = true;
			}
		}
	}
	
	//adds a sales order to a bill of lading, records it in both the sales order and bill of lading tables
	function addBol(){
		
		let myBol = document.getElementById("mrp-shi-content-bols").value;
		let temp = document.getElementsByClassName("ships");
		let myRowElements = Array.from(temp);
		let sorObj = {};
		let bolObj = bols[myBol - 1];
		
		if(myBol == "ALL"){
			alert("You must select a bill of lading.");
		}else{
			
			for(let i = 0; i < myRowElements.length; i++){
				
				if(myRowElements[i].checked){
					
					sorObj = sors[sors.findIndex(e => e.id == myRowElements[i].value)];

					if(myBol != sorObj.bol){
						
						//check if sales order is assigned to a different bol, and remove it
						if(sorObj.bol > 0){
							let oldBolObj = bols[sorObj.bol -1];
							let myIndex = oldBolObj.sors.indexOf(sorObj.bol);
							oldBolObj.sors.splice(myIndex, 1);
							oldBolObj.sors = oldBolObj.sors.toString();
							post(oldBolObj, scriptNames.update_bols);
						}
						
						sorObj.bol = parseInt(myBol);
						sorObj.stepQty = sorObj.stepQty.toString();
						sorObj.pickQty = sorObj.pickQty.toString();
						post(sorObj, scriptNames.update_sor);

						if(bolObj.sors){
							bolObj.sors.push(sorObj.id);
						}else{
							bolObj.sors = sorObj.id;
						}
						bolObj.post = true;
					}else{
						alert(`Order ${sorObj.id} is already assigned to that bill of lading.`);
					}
				}
			}
		}
		
		if(bolObj.post){
			bolObj.sors = bolObj.sors.toString();
			post(bolObj, scriptNames.update_bols);
		}
	}
	
	//creates a new bill of lading with no orders associated with it
	function newBol(){
		
		let myDate = document.getElementById("mrp-shi-content-date").value;
		let myCarrier = document.getElementById("mrp-shi-content-carriers").value;
		
		if(myDate){
			
			if(myCarrier != "ALL"){
				
				let bolObj = {
					carrier: myCarrier,
					shipDate: myDate
				};
				post(bolObj, scriptNames.post_bol);
				
			}else{
				alert("You must select a shipping company.");
			}
			
		}else{
			alert("You must select a shipping date.");
		}

	}
	
	//populate a pdf with data and save it for display
	function createBol(){
		
		let myBol = document.getElementById("mrp-shi-content-bols").value;
		
		if(myBol != "ALL"){
			let bolObj = bols[myBol - 1];
			
			document.getElementById("picDiv").innerHTML = `<iframe id="pdf" src="dox/blank_bol.pdf"></iframe>`;
			document.getElementById("picDiv").style.display = "flex";
			
			/*let jobj = JSON.stringify(bolObj);
		
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function(){
				if (this.readyState == 4 && this.status == 200){
					alert(xhttp.responseText);
				}
			};
			xhttp.open("POST", "scripts/create_bol.php", true);
			xhttp.setRequestHeader("Content-type", "application/json");
			xhttp.send(jobj);*/
		}else{
			alert("You must select a bill of lading.");
		}
	}
	
	//removes all sors associated with a given bill of lading from the SHI status, marking them as shipped to the customer
	function shipBol(){
		
		let myBol = document.getElementById("mrp-shi-content-bols").value;
		let myDate = new Date();
		let shipDate = new Date();

		if(myBol != "ALL"){
			
			shipDate.setFullYear(parseInt(bols[myBol - 1].shipDate.substring(0,4)));
			shipDate.setMonth(parseInt(bols[myBol - 1].shipDate.substring(5,7))-1);
			shipDate.setDate(parseInt(bols[myBol - 1].shipDate.substring(8)));
			shipDate.setHours(0,0,0,0);
			
			if(shipDate.getTime() <= myDate.getTime()){
				
				for(let i = 0; i < bols[myBol - 1].sors.length; i++){
					
					let sorObj = sors[sors.findIndex(e => e.id == bols[myBol - 1].sors[i])];
					sorObj.step = "$$$";
					sorObj.stepQty = sorObj.stepQty.toString();
					sorObj.pickQty = sorObj.pickQty.toString();
					post(sorObj, scriptNames.update_sor);
				}
				
				let bolObj = bols[myBol -1];
				bolObj.step = "$$$";
				bolObj.sors = bolObj.sors.toString();
				post(bolObj, scriptNames.update_bols);
				
			}else{
				alert("It is not yet the shipping day.");
			}
		}else{
			alert("You must select a bill of lading.");
		}
		
	}
	
	//insert a new entry into the por table
	function createNewPor(){
		
		let myDate = new Date();
		let newDate = new Date();
		
		//set the order date and calculate a receiving date that doesnt fall on the weekend
		if(myDate.getDay() < 4){
			newDate.setTime(myDate.getTime() + (milliday*2));
		}else{
			newDate.setTime(myDate.getTime() + (milliday *(6- myDate.getDay() + 3)));
		}

		//create the object for the purchase order
		let por = {
			partID: partNums[document.getElementById("mrp-por-content-create-items").value], 
			emp: user.name, 
			ordDate: myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate(),
			recDate: newDate.getFullYear() + "-" + (newDate.getMonth()+1) + "-" + newDate.getDate(),
			qty: parseInt(document.getElementById("mrp-por-content-create-qty").value)};
			
		//validate input and call the php post function
		if(por.qty && por.qty != 0){
			post(por, scriptNames.post_por);
		}else{
			alert("Qty must be > 0.");
		}
	}
	
	//create a table of all purchase orders
	function loadPors(){

		let isGray = true;
		let myString = "";
		let temp = document.getElementsByClassName("pors");
		let myRowElements = Array.from(temp);
		
		myString += span;
		myString += `<table class="outer-table table-data"><tr><th></th><th>order#</th><th>desc.</th><th>qty.</th><th>emp.</th><th>order date</th><th>del. date</th></tr>`;
		
		for(let i = 0; i < pors.length; i++){
			
			if(isGray){
				myString += `<tr class="gray-row">`;
				isGray = false;
			}else{
				myString += `<tr>`;
				isGray = true;
			}
			
			myString += `<td><input type="checkbox" class="pors" id="por${pors[i].id}" value="${pors[i].id}"></td>`;
			myString += `<td>${pors[i].id}</td>`;
			myString += `<td>${partNames[pors[i].partID]}</td>`;
			myString += `<td>${pors[i].qty}</td>`;
			myString += `<td>${pors[i].emp}</td>`;
			myString += `<td>${pors[i].ordDate.substr(5)}</td>`;
			myString += `<td>${pors[i].recDate.substr(5)}</td>`;
			myString += `</tr>`;
			
		}
		myString += `</table>`;
		
		document.getElementById("mrp-por-content-data").innerHTML = myString;
		
		for(let i = 0; i < myRowElements.length; i++){
			
			if(myRowElements[i].checked){
				document.getElementById(myRowElements[i].id).checked = true;
			}
		}
	}
	
	//calls a function to delete entries from the purchase order table
	function removePor(){
		
		let temp = document.getElementsByClassName("pors");
		let myRowElements = Array.from(temp);
		
		for(let i = 0; i < myRowElements.length; i++){
			
			if(myRowElements[i].checked){
				deleteRow(myRowElements[i].value, "por");
			}
		}
	}
	
	//adds an entry to the sales order table
	function createSor(){
		
		let myQty = document.getElementById("mrp-sor-content-create-qty").value;
		let sorObj = {
			partID: document.getElementById("mrp-sor-content-items").value,
			orderQty: document.getElementById("mrp-sor-content-create-qty").value,
			qty: document.getElementById("mrp-sor-content-create-qty").value,
			emp: user.name};
			
		if(!sorObj.orderQty){
			alert("Please enter a quantity.");
		}else if(isNaN(sorObj.partID)){
			alert("Please select a part.");
		}else{
			post(sorObj, scriptNames.post_sor);
		}
	}
	
	//creates a filtered list of sales orders and displays it
	function loadSors(){
		
		let isGray = true;
		let myString = "";
		let myStatus = document.getElementById("mrp-sor-content-status").value;
		let myItem = document.getElementById("mrp-sor-content-items").value;
		let temp = document.getElementsByClassName("sors");
		let myRowElements = Array.from(temp);
		

		myString += span;
		myString += `<table class="outer-table table-data"><tr><th></th><th>ID</th><th>Desc</th><th>Qty</th><th>Status</th><th>Emp</th><th>Date</th></tr>`
		
		for(let i = 0; i < sors.length; i++){
			
			if(document.getElementById("mrp-sor-content-filter").checked == true){
				
				if(myStatus != "ALL"){
					if(document.getElementById("mrp-sor-content-status").value == "PRO"){
						
						if(isNaN(parseInt(sors[i].step))){
							continue;
						}
					}else if(document.getElementById("mrp-sor-content-status").value != sors[i].step){
						continue;
					}
				}
				if(myItem != "ALL"){
					
					if(parseInt(myItem) != sors[i].partID){
						continue;
					}
				}
			}
			
			if(isGray){
				myString += `<tr class="gray-row">`;
				isGray = false;
			}else{
				myString += `<tr>`;
				isGray = true;
			}
			
			myString += `<td><input type="checkbox" class="sors" id="sor${sors[i].id}" value="${sors[i].id}"></td>`;
			myString += `<td>${sors[i].id}</td>`;
			myString += `<td>${partNames[sors[i].partID]}</td>`;
			myString += `<td>${sors[i].qty}/${sors[i].orderQty}</td>`;
			myString += `<td>${sors[i].step}</td>`;
			myString += `<td>${sors[i].emp}</td>`;
			myString += `<td>${sors[i].orderDate.substr(5)}</td>`;
			myString += `</tr>`;
		}
		myString += `</table>`;
		
		document.getElementById("mrp-sor-content-data").innerHTML = myString;
		
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){
				document.getElementById(myRowElements[i].id).checked = true;
			}
		}
	}
	
	//modify entries from the sales order table
	function cancelSor(){
		
		let temp = document.getElementsByClassName("sors");
		let myRowElements = Array.from(temp);
		let sorObj = {};
		
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){
				
				let sorObj = sors[sors.findIndex(e => e.id == myRowElements[i].value)];

				sorObj.post = false;
				sorObj.qty = 0;
				if(sorObj.step != "CAN" && sorObj.step != "$$$"){
					sorObj.post = true;
					sorObj.step = "CAN";
					for(let k = 1; k < 16; k+=2){
						sorObj.stepQty[k-1] += sorObj.stepQty[k];
						sorObj.stepQty[k] = 0;
					}
				}
				
				if(sorObj.post){
					
					sorObj.pickQty = sorObj.pickQty.toString();
					sorObj.stepQty = sorObj.stepQty.toString();
					post(sorObj, scriptNames.update_sor);
				}else{
					alert(`This order has already ${((sorObj.step == "CAN") ? "been cancelled." : "shipped.")}`);
				}
			}
		}
	}
	
	//changes the sales order step to the first production step, making it appear in the router section
	function releaseSor(){
		
		let temp = document.getElementsByClassName("sors");
		let myRowElements = Array.from(temp);
		let sorObj = {};
		
		for(let i = 0; i < myRowElements.length; i++){
			if(myRowElements[i].checked){
				
				sorObj = sors[sors.findIndex(e => e.id == myRowElements[i].value)];
				
				sorObj.post = false;
				sorObj.pickQty = sorObj.pickQty.toString();
				sorObj.stepQty[1] = sorObj.qty;
				sorObj.stepQty = sorObj.stepQty.toString();
				if(sorObj.step == "SOR"){
					sorObj.post = true;
					sorObj.step = "10";
				}
				
				if(sorObj.post){
					post(sorObj, scriptNames.update_sor);
				}else{
					alert("Order must be in SOR to be released to production.");
				}
			}
		}
	}
	
	//shows a full screen pic
	function expandPic(e){
		
		document.getElementById("picDiv").innerHTML = `<img id="picture" src="${e.target.src}" alt="error">`;
		document.getElementById("picDiv").style.display = "flex";
		document.getElementById("hidden").style.display = "flex";

	}
	
	//hides the fullscreen pic element
	function hideElement(e){

		if(e.target.id == "hidden"){
			e.target.style.display = "none";
			hideChildren(e.target.id);
		}
		
	}	

	//----php functions----
	//generic remove row, uses an id and a table name:
	function deleteRow(myId, myTable){
		
		let myObj = {
			id: myId,
			table: myTable};
			
		let jobj = JSON.stringify(myObj);
		
		let xhttp = new XMLHttpRequest();
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

			//don't store the plain password
			user.pwd = "";

			document.getElementById("loginout").innerText = user.name;

			//set the floppy disk value and use that to set the image
			const savicon = document.getElementById("savicon");
			savicon.dataset.value = user.remember * 1;
			savicon.src = saviconImages[parseInt(savicon.dataset.value)];

			hideChildren("hidden");
			document.getElementById("hidden").style.display = "none";
			loadMrp();

		}
	}
	
	//parses purchase order records, calls the loaders
	function setPors(myData){

		pors = JSON.parse('[' + myData.replace(/}{/g, '},{') + ']');
		loadPors();
		loadRecs();
	}
	
	//parses inventory data, calls the loader
	function setInvs(myData){
		
		invs = JSON.parse('[' + myData.replace(/}{/g, '},{') + ']');
		loadInvs();
	}
	
	//parse the json string and sets the global array of sales order data, also changes two csv strings to arrays within it
	function setSors(myData){
		
		sors = JSON.parse('[' + myData.replace(/}{/g, '},{') + ']');
		for(let i = 0; i < sors.length; i++){
			let tempStepQty = sors[i].stepQty.split(",");
			sors[i].stepQty = tempStepQty.map(Number);
			let tempPickQty = sors[i].pickQty.split(",");
			sors[i].pickQty = tempPickQty.map(Number);
			sors[i].id = parseInt(sors[i].id);
			sors[i].partID = parseInt(sors[i].partID);
			sors[i].orderQty = parseInt(sors[i].orderQty);
			sors[i].qty = parseInt(sors[i].qty);
		}
		loadSors();
		loadRou();
	}
	
	//parses the json string and sets the global array of scrap data
	function setScrap(myData){
		scraps = JSON.parse('[' + myData.replace(/}{/g, '},{') + ']');
	}
	
	//parses the json string and sets the global array for bills of lading data
	function setBols(myData){
		bols = JSON.parse('[' + myData.replace(/}{/g, '},{') + ']');

		for(let i = 0; i < bols.length; i++){
			
			if(bols[i].sors){
				let tempBolQty = bols[i].sors.split(",");
				bols[i].sors = tempBolQty.map(Number);
			}
			bols[i].id = parseInt(bols[i].id);
			bols[i].bol = parseInt(bols[i].bol);
		}
		
		loadShips();
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