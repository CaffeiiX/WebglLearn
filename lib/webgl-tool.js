import {
    initShaders
} from '../lib/cuon-utils.js'

async function loadShaderFromFile(gl, vsFileName, fsFileName) {
    if(!gl) {
        console.log("failed to get the rendering context for WebGL");
        return new Error("gl not exists");
    }
    let vsData = await fetch(vsFileName);
    let fsData = await fetch(fsFileName);
    if (vsData.ok && fsData.ok) {
        let vs_shader = await vsData.text();
        let fs_shader = await fsData.text();
        //init shaders of gl
        if (!initShaders(gl, vs_shader, fs_shader)) {
            console.log("init shader fail");
            return new Error("init shader fail");
        }
        return [vs_shader, fs_shader];
    }
    return new Error("load file fail");
}

export {loadShaderFromFile};