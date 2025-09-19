const windowObject = [];
var drawObject = [];
var currentObject = [];

//const windowList = [];
var currentWindow = [];

var windowList = [
	{
		name: "banner",
		type: "window",
		canDraw: true,
		placement: "banner",
		size: [ null, null ],
		pos: [ null, null ],
		distance: null
	}
];

function update_windowList() {
	//
}

function createWindow() {
	windowList.length = 0;

	// windowDetector
	windowList.push({
		type: "windowDetector",
		//canDraw: false,
		name: "banner",
		placement: "banner",
		size: [ texelX(BANNER_PIXEL[0]), texelY(BANNER_PIXEL[1]) ],// width & height
		pos: [ texelX(0, "banner"), texelY(0, "banner") ],// position of the object
		distance: undefined
	});
	windowList.push({
		type: "windowDetector",
		//canDraw: false,
		name: "note",
		placement: "note",
		size: [ texelX(NOTE_PIXEL[0]), texelY(NOTE_PIXEL[1]) ],
		pos: [ texelX(0, "note"), texelY(0, "note") ],
		distance: undefined
	});
	windowList.push({
		type: "windowDetector",
		//canDraw: false,
		name: "mainEditor",
		placement: "mainEditor",
		size: [ texelX(MAIN_EDITOR_PIXEL[0]), texelY(MAIN_EDITOR_PIXEL[1]) ],
		pos: [ texelX(0, "mainEditor"), texelY(0, "mainEditor") ],
		distance: undefined
	});
	windowList.push({
		type: "windowDetector",
		//canDraw: false,
		name: "sideEditor",
		placement: "sideEditor",
		size: [ texelX(SIDE_EDITOR_PIXEL[0]), texelY(SIDE_EDITOR_PIXEL[1]) ],
		pos: [ texelX(0, "sideEditor"), texelY(0, "sideEditor") ],
		distance: undefined
	});
}

function createObject() {

	windowObject.length = 0;
	
	// windowDetector
	windowObject.push({
		type: "windowDetector",
		canDraw: false,
		name: "banner",
		placement: "banner",
		size: [ texelX(BANNER_PIXEL[0]), texelY(BANNER_PIXEL[1]) ],// width & height
		pos: [ texelX(0, "banner"), texelY(0, "banner") ],// position of the object
		distance: undefined
	});
	windowObject.push({
		type: "windowDetector",
		canDraw: false,
		name: "note",
		placement: "note",
		size: [ texelX(NOTE_PIXEL[0]), texelY(NOTE_PIXEL[1]) ],
		pos: [ texelX(0, "note"), texelY(0, "note") ],
		distance: undefined
	});
	windowObject.push({
		type: "windowDetector",
		canDraw: false,
		name: "mainEditor",
		placement: "mainEditor",
		size: [ texelX(MAIN_EDITOR_PIXEL[0]), texelY(MAIN_EDITOR_PIXEL[1]) ],
		pos: [ texelX(0, "mainEditor"), texelY(0, "mainEditor") ],
		distance: undefined
	});
	windowObject.push({
		type: "windowDetector",
		canDraw: false,
		name: "sideEditor",
		placement: "sideEditor",
		size: [ texelX(SIDE_EDITOR_PIXEL[0]), texelY(SIDE_EDITOR_PIXEL[1]) ],
		pos: [ texelX(0, "sideEditor"), texelY(0, "sideEditor") ],
		distance: undefined
	});


	windowObject.push({
		type: "button",
		canDraw: true,
		name: "objectExample",
		placement: "mainEditor",
		size: [ texelX(15), texelY(50) ],// width & height
		pos: [ texelX(0, "mainEditor"), texelY(0, "mainEditor") ],// position of the object
		distance: undefined
	});


	windowObject.push({
		type: "button",
		canDraw: true,
		name: "objectExample2",
		placement: "mainEditor",
		size: [ texelX(15), texelY(50) ],// width & height
		pos: [ texelX(30, "mainEditor"), texelY(0, "mainEditor") ],// position of the object
		distance: undefined
	});
}