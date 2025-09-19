import * as config from "./config.js";
import * as utils from "./utils.js";
import { texelX, texelY } from "./utils.js";

export const mouse = {
	x: undefined,
	drag: {
		isDragging: false,
		startPos: [ undefined, undefined ],
		distance: [ 0, 0 ]
	},
	isScrolling: false,
	isLeftClicked: false,
	isMouseDown: false,
	y: undefined,
	window: undefined
};

export const div = {
	document: undefined,
	size: [ undefined, undefined ]
};

export const canvas = {
 	document: undefined,
 	size: [ undefined, undefined ]
};

export const window = [
	{	name: "banner",
		sizePixel: [ ...config.BANNER_PIXEL ],
		//sizePrint: [ texelX(config.BANNER_PIXEL[0]), texelY(config.BANNER_PIXEL[1]) ],
		//offsetPrint: [ texelX(0,"banner"), texelY(0, "banner") ],// the amount to top left of the window
		//distance: undefined, // distance to mouse
		element: []
	},
	{	name: "note",
		sizePixel: [ ...config.NOTE_PIXEL ],
		element: []
	},
	{	name: "mainEditor",
		sizePixel: [ ...config.MAIN_EDITOR_PIXEL ],
		element: []
	},
	{	name: "mainEditorL",
		sizePixel: [ ...config.MAIN_EDITOR_L_PIXEL ],
		element: []
	},
	{	name: "mainEditorR",
		sizePixel: [ ...config.MAIN_EDITOR_R_PIXEL ],
		element: []
	},
	{	name: "mainEditorM",
		sizePixel: [ ...config.MAIN_EDITOR_M_PIXEL ],
		element: []
	},
	{	name: "mainEditorT",
		sizePixel: [ ...config.MAIN_EDITOR_T_PIXEL ],
		element: []
	},
	{	name: "mainEditorB",
		sizePixel: [ ...config.MAIN_EDITOR_B_PIXEL ],
		element: []
	},
	{	name: "sideEditor",
		sizePixel: [ ...config.SIDE_EDITOR_PIXEL ],
		element: []
	}
]

export const editorM_Vanilla = {
	freeSpace: [ undefined, undefined ],
    padding: [ 7, 5 ],
    column: 8,
    cardPixel: [ 34, 60 ],
    gap: [ undefined, 3 ],//gap between column and row
};


export const ui_texture = createUnitLibrary("ui_texture", [
	{
		name: "bg_mainEditorL",
		src: "./assets/bg_mainEditorL.png"
	},
	{
		name: "bg_mainEditorT",
		src: "./assets/bg_mainEditorT.png"
	},
	{
		name: "bg_mainEditorM",
		src: "./assets/bg_mainEditorM.png"
	},
	{
		type: "button",
		name: "bg_mainEditorT_tab",
		src: "./assets/bg_mainEditorT_tab.png"
	},
	{
		name: "bg_mainEditorB",
		src: "./assets/bg_mainEditorB.png"
	},
	{
		name: "bg_mainEditorM_Vanilla",
		src: "./assets/bg_mainEditorM_Vanilla.png"
	}
])

export const banner_bg = createUnitLibrary("banner_bg", [
	{
		name: "bg_preset1",
		src: "./assets/banner/bg_preset1.png"
		//sizePixel: [],// handle by getting naturalWidth and naturalHeight
	}
])
//
export const unit_default = createUnitLibrary("unit_default", [
	{
		name: "sonya",
		src: "./assets/h_sonya.png",
		render: {
			transform: {
				offset: [ 0, 0 ],//27 30
			}
		}
	},
	{
		name: "nancy",
		src: "./assets/h_paramedicVolt.png",
		sizePixel: [34,60]
	},
	{
		name: "soldier",
		src: "https://deadahead.wiki.gg/images/4/4e/Soldier_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "pepper",
		src: "https://deadahead.wiki.gg/images/c/c1/Pepper_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "agents",
		src: "https://deadahead.wiki.gg/images/5/56/Agents_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "abby",
		src: "https://deadahead.wiki.gg/images/a/a6/Builder_Abby_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "polina",
		src: "https://deadahead.wiki.gg/images/2/22/Sniper_Polina_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "redneck",
		src: "https://deadahead.wiki.gg/images/c/cc/Redneck_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "lester",
		src: "https://deadahead.wiki.gg/images/1/1b/Lester_Sprite.png",
		//sizePixel: [34,60]
	},
	{
		name: "medkit",
		src: "https://deadahead.wiki.gg/images/4/44/Medkit_Sprite.png",
		//sizePixel: [34,60]
	}
])

function createUnitLibrary(name, data) {
  const library = data;
  library.name = name;
  return library;
}

// get and write sizePixel back
async function initLibrary(listLibrary) {
	
	try {
		for ( const unit of listLibrary ) {
			if ( listLibrary.name === "unit_default" ) {
				unit.type = unit.type || "unit";
			}

			// create persistent image object only once
			if (!unit.img) {
				unit.img = new Image();
				unit.img.src = unit.src;
				await new Promise((resolve) => {
					if (unit.img.complete && unit.img.naturalWidth !== 0) {
						resolve();
					} else {
						unit.img.onload = resolve;
						unit.img.onerror = resolve;// fail gracefully
					}
				})
			}
			// set sizePixel from loaded image
			unit.sizePixel = unit.sizePixel || [unit.img.naturalWidth, unit.img.naturalHeight];
			
			// set default value if not exist
			unit.render = unit.render || {};
			unit.render.method = unit.render.method || "pixel";// pixel, none, expand
			unit.render.transform = unit.render.transform || {};
			unit.render.transform.scale = unit.render.transform.scale || [1, 1];
			unit.render.transform.offset = unit.render.transform.offset || [0, 0];
			unit.render.transform.mirror = unit.render.transform.mirror || false;// do nothing atm, may not implement

		}
	} catch(error) {
		console.error("An error occurred during initialization: ", error);
	}
}
//
async function initElements() {
	utils.handleImageInfo(banner_bg[0], "banner");
	utils.handleImageInfo(ui_texture[0], "mainEditorL" );
	//utils.handleImageInfo(ui_texture[2], "mainEditorM" );
	//utils.handleImageInfo(unit_default[1], "mainEditorM" );// testing

	utils.handleImageInfo(ui_texture[1], "mainEditorT" );
	utils.handleImageInfo(ui_texture[3], "mainEditorT" );
	utils.handleImageInfo(ui_texture[4], "mainEditorB" );
	//
	utils.handleImageInfo(unit_default[0], "banner");
	utils.handleImageInfo(unit_default[1], "banner");
	//
	utils.handleImageInfo(unit_default[1], "sideEditor");
}

async function handleLibrary() {
	try {
		// get sizePixel, and set default value of others if not exist
		await initLibrary(banner_bg);
		await initLibrary(ui_texture);
		await initLibrary(unit_default);

		// push to state.window[i].element
		await initElements();
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

handleLibrary();
