// define pixel size of each window
export const BANNER_PIXEL = [ 370, 148 ];//main area width and height
export const NOTE_PIXEL = [ BANNER_PIXEL[0], 60 ];//note area height

export const MAIN_EDITOR_PIXEL = [ BANNER_PIXEL[0], 160 ];//height
export const MAIN_EDITOR_L_PIXEL = [ 50, MAIN_EDITOR_PIXEL[1] ];//width

export const MAIN_EDITOR_R_PIXEL = [ MAIN_EDITOR_PIXEL[0] - MAIN_EDITOR_L_PIXEL[0], MAIN_EDITOR_PIXEL[1] ];
export const MAIN_EDITOR_T_PIXEL = [ MAIN_EDITOR_R_PIXEL[0], 16 ];

export const MAIN_EDITOR_T_TAB_COUNT = 5;
export const MAIN_EDITOR_T_TAB_PIXEL = [ MAIN_EDITOR_T_PIXEL[0] / MAIN_EDITOR_T_TAB_COUNT, MAIN_EDITOR_T_PIXEL[1] ];

export const MAIN_EDITOR_B_PIXEL = [ MAIN_EDITOR_PIXEL[0] - MAIN_EDITOR_L_PIXEL[0], 12 ];
export const MAIN_EDITOR_M_PIXEL = [ MAIN_EDITOR_R_PIXEL[0], MAIN_EDITOR_R_PIXEL[1] - MAIN_EDITOR_T_PIXEL[1] - MAIN_EDITOR_B_PIXEL[1] ];

export const SIDE_EDITOR_PIXEL = [ 120, BANNER_PIXEL[1] + NOTE_PIXEL[1] + MAIN_EDITOR_PIXEL[1] ];//sidebar width
export const CANVAS_PIXEL = [ BANNER_PIXEL[0] + SIDE_EDITOR_PIXEL[0], SIDE_EDITOR_PIXEL[1] ];//canvas total size

export const ASPECT = CANVAS_PIXEL[0] / CANVAS_PIXEL[1];