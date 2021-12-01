var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadShaderFromFile } from '../../lib/webgl-tool.js';
import { getWebGLContext, } from '../../lib/cuon-utils.js';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = document.getElementById('webgl');
        let gl = getWebGLContext(canvas, undefined);
        const fsFilePath = '../src/shader/ColoredPoint.fs';
        const vsFilePath = '../src/shader/ColoredPoint.vs';
        let res = yield loadShaderFromFile(gl, vsFilePath, fsFilePath);
        if (res instanceof Error) {
            console.log(res);
            return res;
        }
        // get attribut and uniform
        let a_position = gl.getAttribLocation(res, 'a_Position');
        let u_fragColor = gl.getUniformLocation(res, "u_FragColor");
        let mouseClickFucntion = click(gl, canvas, a_position, u_fragColor);
        canvas.onmousedown = (event) => {
            mouseClickFucntion(event);
        };
        gl.clearColor(0., 0., 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
    });
}
function click(gl, canvas, a_Position, u_FragColor) {
    let clickPointCol = [];
    let clickColor = [];
    let width = canvas.width;
    let height = canvas.height;
    let left = canvas.getBoundingClientRect().left;
    let top = canvas.getBoundingClientRect().top;
    return function (event) {
        let x = ((event.clientX - left) - height / 2) / (height / 2);
        let y = (width / 2 - (event.clientY - top)) / (width / 2);
        clickPointCol.push([x, y]);
        clickColor.push([(x + 1) / 2.0, (y + 1) / 2.0]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let i = 0; i < clickColor.length; i++) {
            let pointArr = clickPointCol[i];
            let colorArr = clickColor[i];
            gl.vertexAttrib3f(a_Position, pointArr[0], pointArr[1], 0.0);
            gl.uniform4f(u_FragColor, colorArr[0], colorArr[1], 0.0, 1.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    };
}
main();
