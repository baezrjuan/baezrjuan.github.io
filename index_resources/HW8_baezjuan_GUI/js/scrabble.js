/*
 91.461 Assignment: Scrabble hw8
 Juan Baez, UMass Lowell Computer Science, juan_baez@student.uml.edu
*/

var tiles = {
	"A": {total: 9, used: 0, score:1},
	"B": {total: 2, used: 0, score:3},
	"C": {total: 2, used: 0, score:3},
	"D": {total: 4, used: 0, score:2},
	"E": {total: 12, used: 0, score:1},
	"F": {total: 2, used: 0, score:4},
	"G": {total: 3, used: 0, score:2},
	"H": {total: 2, used: 0, score:4},
	"I": {total: 9, used: 0, score:1},
	"J": {total: 1, used: 0, score:8},
	"K": {total: 1, used: 0, score:5},
	"L": {total: 4, used: 0, score:1},
	"M": {total: 2, used: 0, score:3},
	"N": {total: 6, used: 0, score:1},
	"O": {total: 8, used: 0, score:1},
	"P": {total: 2, used: 0, score:3},
	"Q": {total: 1, used: 0, score:10},
	"R": {total: 6, used: 0, score:1},
	"S": {total: 4, used: 0, score:1},
	"T": {total: 6, used: 0, score:1},
	"U": {total: 4, used: 0, score:1},
	"V": {total: 2, used: 0, score:4},
	"W": {total: 2, used: 0, score:4},
	"X": {total: 1, used: 0, score:8},
	"Y": {total: 2, used: 0, score:4},
	"Z": {total: 1, used: 0, score:10},
    "Blank": {total: 2, used: 0, score:0}
};

var current_tiles = [];
var slot_letters = {};
var score = 0;
var double_word_score_tiles = 0;
var dict_words = [];
function initTiles() {
	console.log("SETTING TILES...");
	setupTileRack();
	drawTiles();
	setupSlots();
}

function setupSlots() {
	//SETUP BOARD SLOTS
	for (var i = 1; i <= 15; i++) {
		var slot = document.createElement('div');
		slot.id = "slot"+i.toString();
		slot.className = "slot";
		document.getElementById("slots").appendChild(slot);
		$("#"+slot.id).droppable({
            drop: function(event, ui) {
            	drop(event);
            },
            over: function(event, ui) {
                event.target.style.backgroundColor = "yellow";
				event.target.style.opacity = "50%";
            },
            out: function(event, ui) {
              	event.target.style.backgroundColor = "";
				event.target.style.opacity = "100%";
            }
        });
	}
}
function logTiles() {
	console.log(current_tiles);
	console.log(tiles);
	console.log("\n");
}

function setupTileRack() {
	//SETUP TILE RACK POSITIONS
	for (var i = 1; i <= 7; i++) {
		var pos = document.createElement('div');
		pos.id = "tilePos_"+i.toString();
		pos.className = "slot";
		document.getElementById("tiles").appendChild(pos);
	} 
}

function drawTiles() {
	//SETUP TILES
	current_tiles = []; 
	for (var i = 1; i <= 7; i++) {
		var tile = Object.keys(tiles)[Math.floor(Math.random() * 26) + 1];
		console.log("Grabbed tile "+tile+" with a total of "+tiles[tile].total.toString());
		//check if any tiles are still available
		var tile_found = false;
		for (var n = 0; n < Object.keys(tiles).length; n++) {
			if (tiles[Object.keys(tiles)[n]].total != 0) {
				console.log("TILE FOUND: "+Object.keys(tiles)[n]+" = "+tiles[Object.keys(tiles)[n]].total.toString());
				tile_found = true;
				break;
			}
		}
		//if tiles are available, and while the total of the retrieved tile is 0, get a new tile until it has a valid total > 0
		if (tile_found) {
			while (tiles[tile].total == 0)
				tile = Object.keys(tiles)[Math.floor(Math.random() * 26)];
			//create tile img element
			var tile_img = document.createElement('img');
			tile_img.id = "tile_"+i.toString();
			tile_img.className = "tile";
			tile_img.src = "img/Scrabble_Tile_"+tile+".jpg";
			tile_img.style.width = "100%";
			tile_img.style.height = "100%";
			document.getElementById("tilePos_"+i.toString()).appendChild(tile_img);
			// make tile element draggable with events when drag starts and drag stops
			$("#"+tile_img.id).draggable({
				start: function(event, ui) {
					drag(event);
				}, 
				stop: function(event, ui) {
					stop_drag(event);
				}
			});
			//remove tile from storage and add it as used
			tiles[tile].total -= 1;
			tiles[tile].used += 1;
			current_tiles.push(tile);
		}
	}
	logTiles();
}

function submit() {
	var word_valid = true;
	console.log("dict", dict_words);
	if (dict_words.length != 0)
		word_valid = checkWord();

	var word_score = 0;
	for (var i = 0; i < Object.keys(slot_letters).length; i++) {
		var letter = slot_letters[Object.keys(slot_letters)[i]];
		console.log("SLOT", Object.keys(slot_letters)[i]);
		if (Object.keys(slot_letters)[i] == "slot3") {
			word_score += tiles[letter].score;
			double_word_score_tiles += 1;
		}
		else if (Object.keys(slot_letters)[i] == "slot7")
			word_score += (tiles[letter].score * 2);
		else if (Object.keys(slot_letters)[i] == "slot9")
			word_score += (tiles[letter].score * 2);
		else if (Object.keys(slot_letters)[i] == "slot13") {
			word_score += tiles[letter].score;
			double_word_score_tiles += 1;
		}
		else
			word_score += tiles[slot_letters[Object.keys(slot_letters)[i]]].score;
	}
	slot_letters = {};
	for (var i = 0; i < double_word_score_tiles; i++)
		word_score *= 2;
	double_word_score_tiles = 0;
	$("#slots").html("");
	setupSlots();
	if (word_valid)
		score += word_score;
	else 
		$("#error").html("<span style='color: red;'><b>Not a real word!</b> <i>(Dictionary is in use)</i></span>");
	$("#score").html("SCORE: "+score.toString());
	$("#tiles").html('');
	drawNewTiles();
}

function reset() {
	location.reload();
}

//draw new set of tiles
function drawNewTiles() {
	$("#tiles").html("");
	setupTileRack();
	drawTiles();
}

//https://www.w3schools.com/tags/att_global_draggable.asp
//Drag and Drop functions
var current_drag_elem = null;
function drag(ev) {
	$("#error").html("Drag-and-drop tiles onto the board spaces!");
	var letter = ev.target.src.split("/")[ev.target.src.split("/").length-1].split("_")[2].split(".")[0];
	console.log("Dragging " + letter);
	current_drag_elem = document.getElementById(ev.target.id).cloneNode();
}
function stop_drag(ev) {
	var letter = ev.target.src.split("/")[ev.target.src.split("/").length-1].split("_")[2].split(".")[0];
	console.log("Drag stopped for "+ letter + "\n\n");
	$("#"+ev.target.id).css('top', 0);
	$("#"+ev.target.id).css('left', 0);
}

function drop(ev) {
	ev.target.style.backgroundColor = "";
	ev.target.style.opacity = "100%"; 
	var letter = event.target.src.split("/")[event.target.src.split("/").length-1].split("_")[2].split(".")[0];
	document.getElementById("tilePos_"+current_drag_elem.id.split("_")[1]).removeChild(document.getElementById(current_drag_elem.id));
	
	
	if (document.getElementById(ev.target.id).childNodes.length == 0) {
		console.log(letter + " dropped to " +ev.target.id);
		document.getElementById(ev.target.id).appendChild(current_drag_elem);
	}
	$("#"+current_drag_elem.id).css('top', 0);
	$("#"+current_drag_elem.id).css('left', 0);

	slot_letters[ev.target.id] = letter;

	ev.preventDefault();
}

function setDictionary(words) {
	dict_words = words;
	console.log("Word Dictionary uploaded!");
}
function checkWord() {
	var current_word = "";
	var slot_nodes = document.getElementById("slots").childNodes;
	for (var i = 0; i < slot_nodes.length; i++) {
		if (slot_nodes[i].childNodes.length > 0) {
			var letter = slot_nodes[i].childNodes[0].src.split('_')[slot_nodes[i].childNodes[0].src.split('_').length-1].split('.')[0];
			console.log(letter);
			current_word += letter;
		}
		else 
			current_word += " ";
	}
	console.log("WORD", current_word)
 
	var word_found = false;
	for (var i = 0; i < dict_words.length; i++) {
		if (current_word.toLowerCase().trim() === dict_words[i].toLowerCase().trim())
			word_found = true;
	}

	console.log("WORD FOUND", word_found)
	return word_found;
}

