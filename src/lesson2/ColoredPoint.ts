import {
    loadShaderFromFile
} from '../../lib/webgl-tool.js';

import {
    getWebGLContext,
} from '../../lib/cuon-utils.js';

async function main() {
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('webgl');
    let gl = getWebGLContext(canvas, undefined);

    const fsFilePath: string = '../src/shader/ColoredPoint.fs';
    const vsFilePath: string = '../src/shader/ColoredPoint.vs';

    let res = await loadShaderFromFile(gl, vsFilePath, fsFilePath);

    if(res instanceof Error){
        console.log(res);
        return res;
    }
    // get attribut and uniform
    let a_position = gl.getAttribLocation(res, 'a_Position');
    let u_fragColor = gl.getUniformLocation(res, "u_FragColor");
    
    let mouseClickFucntion = click(gl, canvas, a_position, u_fragColor);
    canvas.onmousedown = (event) => {
        mouseClickFucntion(event);
    }
    gl.clearColor(0.,0.,0.,1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function click( gl: WebGLRenderingContext, canvas: HTMLCanvasElement, a_Position, u_FragColor): Function{
    let clickPointCol = [];
    let clickColor = [];
    let width = canvas.width;
    let height = canvas.height;
    let left = canvas.getBoundingClientRect().left;
    let top = canvas.getBoundingClientRect().top;
    return function(event: MouseEvent){
        let x: number = ((event.clientX - left) - height / 2) / (height / 2);
        let y: number = (width / 2 - (event.clientY - top)) / (width / 2);
        clickPointCol.push([x,y]);
        clickColor.push([(x+1)/2.0, (y+1)/2.0]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(let i: number = 0; i < clickColor.length; i ++){
            let pointArr= clickPointCol[i];
            let colorArr = clickColor[i];
            gl.vertexAttrib3f(a_Position, pointArr[0], pointArr[1], 0.0);
            gl.uniform4f(u_FragColor, colorArr[0], colorArr[1], 0.0, 1.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}
main();