import * as config from "./config.js";
import * as state from "./state.js";

export function getWindowConfigKey(window) {
	const keyMap = {
		banner: "BANNER_PIXEL",
		note: "NOTE_PIXEL",
		mainEditor: "MAIN_EDITOR_PIXEL",
		mainEditorL: "MAIN_EDITOR_L_PIXEL",
		mainEditorR: "MAIN_EDITOR_R_PIXEL",
		mainEditorT: "MAIN_EDITOR_T_PIXEL",
		mainEditorM: "MAIN_EDITOR_M_PIXEL",
		mainEditorB: "MAIN_EDITOR_B_PIXEL",
		sideEditor: "SIDE_EDITOR_PIXEL",
	};
	return keyMap[window] || "BANNER_PIXEL";
}
export function getWindowOffset(window) {
	const offset = {
		note: [ 0, config.BANNER_PIXEL[1] ],
		mainEditor: [ 0, config.BANNER_PIXEL[1] + config.NOTE_PIXEL[1] ],
		mainEditorL: [ 0, config.BANNER_PIXEL[1] + config.NOTE_PIXEL[1] ],
		mainEditorR: [ config.MAIN_EDITOR_L_PIXEL[0], config.BANNER_PIXEL[1] + config.NOTE_PIXEL[1] ],
		mainEditorT: [ config.MAIN_EDITOR_L_PIXEL[0], config.BANNER_PIXEL[1] + config.NOTE_PIXEL[1] ],
		mainEditorM: [ config.MAIN_EDITOR_L_PIXEL[0], config.BANNER_PIXEL[1] + config.NOTE_PIXEL[1] + config.MAIN_EDITOR_T_PIXEL[1] ],
		mainEditorB: [ config.MAIN_EDITOR_L_PIXEL[0], config.CANVAS_PIXEL[1] - config.MAIN_EDITOR_B_PIXEL[1] ],
		sideEditor: [ config.BANNER_PIXEL[0], 0 ],
		banner: [ 0, 0 ],
		canvas: [ 0, 0 ],
	};
	return offset[window] || [ 0, 0 ];
}

export function reportPixelSize() {
	let list = ["state.window[i].sizePixel"];
	let fromList = state.window;
	for ( let i = 0; i < fromList.length; i++ ) {
		let content = fromList[i].name + "   " + (fromList[i].sizePixel[0] || "undefined") + ", " + (fromList[i].sizePixel[1] || "undefined");
		list.push(content);
	}
	let printText = list.join("\n   ");
	console.log( printText );
}

// text preset
export function textPreset(c, hex, px, font, align) {
	c.fillStyle = hex;
	if ( px !== undefined && font !== undefined ) { 
		c.font = texelX(px) + "px " + font;
	};
	c.textAlign = align || "left";
}

// return a coordinate based on this size
export function texelX(pixel, window) {
	let offset = getWindowOffset(window)[0];
	return ( pixel + offset ) * state.canvas.size[0] / config.CANVAS_PIXEL[0]
}
export function texelY(pixel, window) {
	let offset = getWindowOffset(window)[1];
	return ( pixel + offset ) * state.canvas.size[1] / config.CANVAS_PIXEL[1]
}

// use example in canvas.js
// utils.drawImageTexel( c, "./path/image.ong", width, height, posX, posY, "window_name" )
export function drawImageTexel( c, img, width, height, x, y, window ) {
	if ( img && img.complete && img.naturalWidth !== 0 ) {
		c.drawImage( img, texelX(x, window), texelY(y, window), texelX(width), texelY(height) )
	}
}
// render method, none
export function drawImageTexel2( c, img, width, height, x, y, window ) {
	if ( img && img.complete && img.naturalWidth !== 0 ) {
		c.drawImage( img, texelX(x, window), texelY(y,window) , width, height )
	}
}

// use to resize canvas under a div container, while following aspect ratio
export function resizeCanvasToContain() {
	state.div.document = document.getElementById('dazw-team-build-container');
	state.canvas.document = document.getElementById('dazw-team-build');

	state.div.size = [ state.div.document.clientWidth, state.div.document.clientHeight ];

	state.canvas.size = [ state.div.size[0], state.div.size[0] / config.ASPECT ];
	if (state.canvas.size[1] > state.div.size[1]) {
		state.canvas.size = [ state.div.size[1] * config.ASPECT, state.div.size[1] ];
	}

	// Resize, this will clear canvas content
	[ state.canvas.document.width, state.canvas.document.height ] = state.canvas.size;
}

// calculate nearest distance from point to rectangle
// use top left corner of rectangle for positioning, rectangle don't rotate
export function calculateDistance( pointX, pointY, recWidth, recHeight, recX, recY ) {
	const closestX = Math.max(recX, Math.min(pointX, recX + recWidth));
	const closestY = Math.max(recY, Math.min(pointY, recY + recHeight));

	const dx = pointX - closestX;
	const dy = pointY - closestY;

	return Math.sqrt(dx * dx + dy * dy);
}

// detect when two rectangle object collide
// x & y is the top left corner of rectangle
export function boxCollision( obj1_width, obj1_height, obj1_x, obj1_y, obj2_width, obj2_height, obj2_x, obj2_y ) {
	if (
		obj1_x + obj1_width >= obj2_x &&
		obj1_x <= obj2_x + obj2_width &&
		obj1_y + obj1_height >= obj2_y &&
		obj1_y <= obj2_y + obj2_height
	)
		return true
}

// get natural width and height of image from src
export function getImageNaturalSize(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			resolve({
				size: [ img.naturalWidth, img.naturalHeight ]
			})
		};

		img.onerror = () => {
			reject(new Error("Could not load image at " + src ));
		};

		img.src = src;
	})
}
// push entry to a element list under where it belong
export async function handleImageInfo(info, belonging) {
	try {
		const dimensions = await getImageNaturalSize(info.src);
		info.sizePixel = dimensions.size;
		state.window.find(item => item.name === belonging).element.push(info);
	} catch(error) {
		console.error(error);
		throw error;
	}
}
// push entry to belonging list
// currently should be unused by any
export async function handleImageLibrary(info, belonging) {
	try {
		const dimensions = await getImageNaturalSize(info.src);
		info.sizePixel = dimensions.size;
		belonging.push(info);
	} catch(error) {
		console.error(error);
		throw error;
	}
}
