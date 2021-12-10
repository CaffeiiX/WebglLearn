var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initGL, loadShaderFromFile, getLocation } from '../../lib/webgl-tool.js';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // init gl
    const gl = initGL('webgl');
    const fsFile = '../src/shader/MultiTexure.fs';
    const vsFile = '../src/shader/MultiTexure.vs';
    let program = yield loadShaderFromFile(gl, vsFile, fsFile);
    if (program instanceof Error)
        return;
    // get location
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_TexCoord = getLocation(gl, program, 'a_TexCoord');
    const u_Sampler0 = getLocation(gl, program, 'u_Sampler0', false);
    const u_Sampler1 = getLocation(gl, program, 'u_Sampler1', false);
    // init buffer
    let vertexData = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);
    // load img
    let imgSky = new Image();
    let imgCircle = new Image();
    // init texure
    let texture0 = gl.createTexture();
    let texture1 = gl.createTexture();
    imgSky.onload = () => {
        loadTexure(texture0, u_Sampler0, imgSky, 0);
    };
    imgCircle.onload = () => {
        loadTexure(texture1, u_Sampler1, imgCircle, 1);
    };
    let tex0 = false;
    let tex1 = false;
    const loadTexure = (texture, u_Sampler, image, textureID) => {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        if (textureID == 0) {
            gl.activeTexture(gl.TEXTURE0);
            tex0 = true;
        }
        else {
            gl.activeTexture(gl.TEXTURE1);
            tex1 = true;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture); //纹理属性
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //配置纹理参数 类型 填充方法 填充取值 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //纹理图像分配给纹理对象 金字塔纹理 /内部格式 / 格式 / 类型 图像
        gl.uniform1i(u_Sampler, textureID); //传数据
        gl.clearColor(0., 0., 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (tex0 && tex1) {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    };
    imgCircle.src = "../../resources/circle.gif";
    imgSky.src = "../../resources/sky.jpg";
});
main();
