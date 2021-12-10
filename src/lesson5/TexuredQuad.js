var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initGL, loadShaderFromFile, getLocation } from "../../lib/webgl-tool.js";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // init gl
    const gl = initGL('webgl');
    const fsFile = "../src/shader/TexuredQuad.fs";
    const vsFile = "../src/shader/TexuredQuad.vs";
    let program = yield loadShaderFromFile(gl, vsFile, fsFile);
    if (program instanceof Error)
        return;
    // get location
    let a_Position = getLocation(gl, program, "a_Position");
    let a_TexCoord = getLocation(gl, program, 'a_TexCoord');
    if (a_Position === null || a_TexCoord === null)
        return;
    // init buffer
    let vertexData = new Float32Array([
        -0.5, 0.5, 0.0, 2.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 2.0, 2.0,
        0.5, -0.5, 2.0, 0.0
    ]);
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);
    // init vertex
    let texture = gl.createTexture();
    let u_Sampler = getLocation(gl, program, 'u_Sampler', false);
    let image = new Image();
    image.onload = () => {
        //处理加载得到的图像
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0); //开启纹理
        gl.bindTexture(gl.TEXTURE_2D, texture); //纹理属性
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //配置纹理参数 类型 填充方法 填充取值 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //纹理图像分配给纹理对象 金字塔纹理 /内部格式 / 格式 / 类型 图像
        gl.uniform1i(u_Sampler, 0); //传数据
        gl.clearColor(0., 0., 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        return true;
    };
    image.src = "../../resources/sky.jpg";
});
main();
