// todo
// state.window  size for pixel size, sizePrint for texeledSize

import * as config from "./config.js";
import * as state from "./state.js";
import * as utils from "./utils.js";
import { texelX, texelY, textPreset } from "./utils.js";


const canvas = document.getElementById('dazw-team-build');
const c = canvas.getContext('2d');


//var mouseClick = 0;
// for console log debug
canvas.addEventListener('mousedown', (e) => {
	console.log( state.window );
	state.mouse.isMouseDown = true;
	//console.log( "window: " + state.mouse.window );
})

var mainEditorT_Update = false;
canvas.addEventListener('mouseup', (e) => {
	//console.log( state.editorM_Vanilla );
	//console.log( state.ui_texture );
	//utils.reportPixelSize();

	state.mouse.isMouseDown = false;
	mainEditorT_Update = false;

	// mainEditorT_tab detect & process
	if ( state.mouse.window === "mainEditorT" && state.mouse.drag.isDragging === false ) {
		let currentTab = mainEditorT_tab;
		let target = state.window.find(item => item.name === "mainEditorT");
		let windowOffset = target.offsetPrint;//screened coord
		let mousePos = [ state.mouse.x, state.mouse.y ];//screened coord

		let tabData = target.element.find(item => item.name === "bg_mainEditorT_tab");
		let sizePixel = [ tabData.sizePixel[0] * tabData.render.transform.scale[0], tabData.sizePixel[1] * tabData.render.transform.scale[1] ];//tab size in pixle   [64, 16]

		for ( let i = 0; i < config.MAIN_EDITOR_T_TAB_COUNT - 2; i++ ) {
			if ( utils.calculateDistance( ...mousePos, texelX(sizePixel[0]), texelY(sizePixel[1]), windowOffset[0] + texelX(i * sizePixel[0]), windowOffset[1] ) == 0 ) {
				mainEditorT_tab = i;
			}
		}
		//
		if ( currentTab !== mainEditorT_tab ) {
			console.log( "Tab switched: " + mainEditorT_tab );
			tabData.render.transform.offset[0] = 0 + mainEditorT_tab * tabData.sizePixel[0];
			mainEditorT_Update = true;
		};

	};
	//console.log( "current tab: " + mainEditorT_tab );
})

// update mouse x y
canvas.addEventListener('mousemove', (e) => {
	//if ( state.mouse.drag.isDragging ) {
	//	console.log( "isDragging: " + state.mouse.drag.isDragging );
	//};

	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// update state.mouse
	let rect = canvas.getBoundingClientRect();
	state.mouse.x = ( e.clientX - rect.left );
	state.mouse.y = ( e.clientY - rect.top );

	// uodate state.mouse.drag
	if ( state.mouse.isMouseDown ) {
		if ( state.mouse.drag.isDragging === false ) {
			state.mouse.drag.startPos = [ state.mouse.x, state.mouse.y ];
		};
		state.mouse.drag.isDragging = true;
		state.mouse.drag.distance = [ state.mouse.x - state.mouse.drag.startPos[0], state.mouse.y - state.mouse.drag.startPos[1] ];
	} else if ( ( state.mouse.drag.distance[0] > 0 || state.mouse.drag.distance[0] < 0 ) ){
		console.log( "run dragged code, or create a flag" );
		state.mouse.drag.isDragging = false;
		state.mouse.drag.distance = [ 0, 0 ];
	} else {
		state.mouse.drag.isDragging = false;
		state.mouse.drag.distance = [ 0, 0 ];
	}

	// update state.window[i].distance
	// and state.mouse.window, show which window are mouse current on
	//
	// should be avoid, but if multiple window in state.window have 0 distance
	// state.mouse.window will on output name of the last window that match
	state.window.forEach((e) => {
		let mousePos = [ state.mouse.x, state.mouse.y ];
		let distance = utils.calculateDistance( ...mousePos, ...e.sizePrint, ...e.offsetPrint );
		e.distance = distance;
		if ( distance === 0 ) { state.mouse.window = e.name; }
	});



	// cursor style
	if (
		state.mouse.window === "note" &&
		state.window.find(item => item.name === "note").distance == 0 ) {
			canvas.style.cursor = "text";
	} else {
			canvas.style.cursor = "default";
	};

})




function resizeRedraw() {
	utils.resizeCanvasToContain();

	// update state.window
	state.window.forEach((e) => {
		e.sizePrint = [ texelX(e.sizePixel[0]), texelY(e.sizePixel[1]) ];
		e.offsetPrint = [ texelX(0,e.name), texelY(0,e.name) ];
	});

	canvasDraw();
}
let canvasIsDrawing = false;
var mainEditorT_tab = 0;
function canvasDraw() {
	if ( canvasIsDrawing ) {
		return;// function is already running, exist
	}
	canvasIsDrawing = true;
	setTimeout(() => {
		canvasIsDrawing = false;
	},5);



	c.clearRect(0,0,...state.canvas.size);
	c.imageSmoothingEnabled = false;

	state.canvas.size = [ state.canvas.document.width, state.canvas.document.height ];




	// colored window area for DEBUG
	c.fillStyle = "#2b2b2b88";
	c.fillRect( texelX(0,"sideEditor"), texelY(0,"sideEditor"), texelX(config.SIDE_EDITOR_PIXEL[0]), texelY(config.SIDE_EDITOR_PIXEL[1]) );
	//
	c.fillStyle = "#be444488";
	c.fillRect( texelX(0,"note"), texelY(0,"note"), texelX(config.NOTE_PIXEL[0]), texelY(config.NOTE_PIXEL[1]) );



	let updateEditorM = [];
	updateEditorM.push(state.ui_texture[2]);
	if ( mainEditorT_tab === 1 ) {

		let freeSpace = [ ...config.MAIN_EDITOR_M_PIXEL ];//screended pixel
		freeSpace[0] = freeSpace[0] - 2 * texelX(state.editorM_Vanilla.padding[0]);
		freeSpace[1] = freeSpace[1] - 2 * texelY(state.editorM_Vanilla.padding[1]);// currently unused
		state.editorM_Vanilla.freeSpace = freeSpace;
		//
		let getGab = freeSpace[0] / ( state.editorM_Vanilla.column + 1);
		state.editorM_Vanilla.gap[0] = Math.round( getGab / ( state.editorM_Vanilla.column - 1 ) );
		//
		let cardPixel = [ ...state.editorM_Vanilla.cardPixel ];// sizePixel

		//let windowOffset = utils.getWindowOffset("mainEditorM");
		let offset = [ cardPixel[0] + state.editorM_Vanilla.gap[0], cardPixel[1] + state.editorM_Vanilla.gap[1] ];

		//console.log(offset);
		let tempList = JSON.parse(JSON.stringify(state.unit_default));
		//tempList.sort((a, b) => a.name.localeCompare(b.name));// sort by name
		{
			let j = 0;
			let k = 0;
			for ( let i = 0; i < tempList.length; i++ ) {
				if ( i > 0 && i % state.editorM_Vanilla.column === 0 ) {
					k++;
					j = 0;
				};
				let alignCenter = [
					( state.editorM_Vanilla.cardPixel[0] - tempList[i].sizePixel[0] ) / 2,
					state.editorM_Vanilla.cardPixel[1] - tempList[i].sizePixel[1]
				];

				tempList[i].render.transform.scale = [ 0.8, 0.8 ];
				let scaleOffsetAdjust = [
					tempList[i].sizePixel[0] * ( 1 - tempList[i].render.transform.scale[0]) / 2,
					tempList[i].sizePixel[1] * ( 1 - tempList[i].render.transform.scale[1] )
				];

				let manualShiftedUp = -3;

				tempList[i].oldOffset = [ state.editorM_Vanilla.gap[0] + j * offset[0], state.editorM_Vanilla.gap[1] + k * offset[1] ];
				tempList[i].render.transform.offset[0] = state.editorM_Vanilla.gap[0] + j * offset[0] + alignCenter[0] + scaleOffsetAdjust[0];
				tempList[i].render.transform.offset[1] = state.editorM_Vanilla.gap[1] + k * offset[1] + alignCenter[1] + scaleOffsetAdjust[1] + manualShiftedUp;
				j++;
			}
		}

		if (state.mouse.isMouseDown === true) console.log(tempList);





		updateEditorM.push(...tempList);
	}
	//
	state.window.find(item => item.name === "mainEditorM").element = [];
	for (const element of updateEditorM ) {
		state.window.find(item => item.name === "mainEditorM").element.push(element)
	}





	// draw every window's element
	if ( state.window.length > 0 ) {
		for ( let j = 0, jlen = state.window.length; j < jlen; j++ ) {

			if ( state.window[j].element.length > 0 ) {

				// limit drawImage to window area
				// define a path
				if (
					state.window[j].name === "mainEditorM" ||
					state.window[j].name === "sideEditor"
				) {
					c.save();
					c.beginPath();
					c.rect( ...state.window[j].offsetPrint, ...state.window[j].sizePrint );
					c.closePath();
					c.clip();
				} 

				for ( let i = 0, len = state.window[j].element.length; i < len; i++ ) {
					let current = state.window[j].element[i];

					// draw additional bg for vanilla unit card
					if (current.type === "unit" && mainEditorT_tab === 1 && current.oldOffset) {
						let unitBg = state.ui_texture.find(item => item.name === "bg_mainEditorM_Vanilla");
						utils.drawImageTexel( c, 
							unitBg.src,
							...unitBg.sizePixel,
							...current.oldOffset,
							state.window[j].name
						);
						//console.log(current);
						//console.log(current.oldOffset);
					};
					
					switch(current.render.method) {
						case "pixel":
							utils.drawImageTexel( c,
								current.src,
								current.sizePixel[0] * current.render.transform.scale[0],
								current.sizePixel[1] * current.render.transform.scale[1],
								...current.render.transform.offset,
								//current.render.transform.offset[0] / current.render.transform.scale[0],
								//current.render.transform.offset[1] / current.render.transform.scale[1],
								state.window[j].name
							);
							break;
						case "none":
							utils.drawImageTexel2( c,
								current.src,
								current.sizePixel[0] * current.render.transform.scale[0],
								current.sizePixel[1] * current.render.transform.scale[1],
								...current.render.transform.offset,
								state.window[j].name
							);
							break;
						case "expand":
							let thisSize = [ current.sizePixel[0] * current.render.transform.scale[0], current.sizePixel[1] * current.render.transform.scale[1] ];
							let thisRatio = thisSize[0] / thisSize[1];
							let windowRatio = state.window[j].size[0] / state.window[j].size[1];
							
							let expandFactor;
							if ( thisRatio < windowRatio ) {
								expandFactor = state.window[j].sizePixel[0] / thisSize[0];
							} else {
								expandFactor = state.window[j].sizePixel[1] / thisSize[1];
							};

							utils.drawImageTexel2( c,
								current.src,
								thisSize[0] * expandFactor,
								thisSize[1] * expandFactor,
								...current.render.transform.offset,
								//0, 0,
								state.window[j].name
							);
							break;

					};

				}

				// limit drawImage to window area
				// remove path
				if (
					state.window[j].name === "mainEditorM" ||
					state.window[j].name === "sideEditor"
				) {
					c.restore();
				}

			};

		};

	}
	// utils.drawImageTexel( c,
	// 	state.window[0].element[0].src,
	// 	...state.window[0].element[0].size,
	// 	...state.window[0].element[0].render.transform.offset,
	// 	state.window[0].name
	// );



	// window text for DEBUG
	c.fillStyle = "rgba(255, 255, 255, 0.29)";
	c.font = texelX(20) + "px fontTitle";
	//c.fillText("mainEditor", texelX(5,"mainEditor"), texelY(5 + 10,"mainEditor") );
	c.fillText("sideEditor", texelX(5,"sideEditor"), texelY(5 + 10,"sideEditor") );
	c.fillText("note", texelX(5,"note"), texelY(5 + 10,"note") );
	//c.fillText("banner", texelX(5,"banner"), texelY(5 + 10,"banner") );


	// mainEditorB text
	textPreset( c, "#7b8b8cff", 14, "fontTitle", "right" );
	c.fillText("by Creator Cook: ouo", texelX(config.MAIN_EDITOR_B_PIXEL[0] - 8,"mainEditorB"), texelY(config.MAIN_EDITOR_B_PIXEL[1] - 2,"mainEditorB") );
	
	// mainEditorT tab text
	{
		const tabs = [ "UNIT CARD", "VANILLA", "CUSTOM" ];
		const defaultColor = "#7b8b8cff";
		const activeColor = "#b4d0dbff";
		textPreset( c, defaultColor, 14, "fontTitle", "center" );

		for (let i = 0; i < tabs.length; i++) {
			c.fillStyle = mainEditorT_tab === i ? activeColor : defaultColor;
			c.fillText(tabs[i], texelX( config.MAIN_EDITOR_T_TAB_PIXEL[0]/2 + config.MAIN_EDITOR_T_TAB_PIXEL[0] * i, "mainEditorT" ), texelY( config.MAIN_EDITOR_T_TAB_PIXEL[1] - 4, "mainEditorT") )
		}
	}
	c.textAlign = "left";

	
	// testFix
	const testFix = [ texelX(config.MAIN_EDITOR_T_PIXEL[0]/5), texelY(config.MAIN_EDITOR_T_PIXEL[1]), texelX(config.MAIN_EDITOR_T_PIXEL[0]/5,"mainEditorT"), texelY(0,"mainEditorT") ];//width, height, startingX & Y
	//
	const testBox = [ texelX(20), texelY(20), state.mouse.x - texelX(20/2), state.mouse.y - texelY(20/2) ];
	//
	// c.fillStyle = "#00000062";
	// if ( utils.boxCollision( ...testFix, ...testBox ) ) {
	// 	c.fillStyle = "#4bb83362"
	// }
	// c.fillRect( testFix[2], testFix[3], testFix[0], testFix[1]);
	// testBox
	c.strokeStyle = "black";
	c.strokeRect( testBox[2], testBox[3], testBox[0], testBox[1] );
	// mouse indicator
	c.strokeStyle = "red";
	c.strokeRect( state.mouse.x, state.mouse.y, texelX(10), texelY(10) );

	// draw text for debug
	// preparation
	c.font = texelX(5) + "px Arial";
	let textBgPadding = [ 5, 3 ];// text padding, width, height
	let newLineOffset = [ 0, 18 ];
	let startPrintOffset = [ 32, 13 ];// starting offset
	startPrintOffset = [ startPrintOffset[0] + state.mouse.x, startPrintOffset[1] + state.mouse.y ];
	let printText;
	let measureLength;
	let textSize = [];

	function forMouseDebug(isFirstLine) {
		if ( isFirstLine !== true ) {
			startPrintOffset = [ startPrintOffset[0] + newLineOffset[0], startPrintOffset[1] + newLineOffset[1] ];
		}

		measureLength = c.measureText( printText );
		textSize = [ measureLength.width, measureLength.actualBoundingBoxAscent + measureLength.actualBoundingBoxDescent ];
		//
		c.fillStyle = "#0000002d";
		c.fillRect( startPrintOffset[0] - textBgPadding[0], startPrintOffset[1] - textBgPadding[1] - textSize[1], textSize[0] + textBgPadding[0]*2, textSize[1] + textBgPadding[1]*2 );
		//
		c.fillStyle = "#ffffffff";
		c.fillText( printText, ...startPrintOffset );
	};

	// mouse x, y
	printText = "mouse: [ " + Math.round(state.mouse.x) + ", " + Math.round(state.mouse.y) + " ]";
	forMouseDebug(true);
	// mouse pixel x, y (Texel)
	printText = "mouse pixel: [ " + Math.round( state.mouse.x * config.CANVAS_PIXEL[0] / state.canvas.size[0] ) + ", " + Math.round(state.mouse.y * config.CANVAS_PIXEL[1] / state.canvas.size[1]) + " ]";
	forMouseDebug();
	// mouse down
	printText = "isMouseDown: " + state.mouse.isMouseDown;
	forMouseDebug();
	// mouse isDragging
	printText = "isDragging: " + state.mouse.drag.isDragging;
	forMouseDebug();
	// state.mouse.drag.distance
	printText = "drag.distance: [ " + state.mouse.drag.distance + " ]";
	forMouseDebug();
	// window 0 distance name
	let zeroDistanceList = state.window.filter( e => e.distance == 0 );
	let zeroDistanceListName = [];
	zeroDistanceList.forEach(function(item) {
		zeroDistanceListName.push(item.name)
	});
	printText = "window: " + zeroDistanceListName.join(", ");
	forMouseDebug();

}

function Circle(x,y,radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;

	this.draw = function() {
		c.beginPath();
		c.arc(x,y,radius,0,Math.PI*2,false);
		c.strokeStyle = "blue";
		c.stroke();
	}
}

// resize listener
window.addEventListener('load', resizeRedraw);
window.addEventListener('resize', resizeRedraw);
canvas.addEventListener('mousedown', canvasDraw);
canvas.addEventListener('mouseup', canvasDraw);
canvas.addEventListener('mousemove', canvasDraw);

// https://www.youtube.com/watch?v=yq2au9EfeRQ&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=5