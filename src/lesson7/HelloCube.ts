import {
    loadShaderFromFile, initGL, getLocation
} from '../../lib/webgl-tool.js'
import { Matrix4 } from '../../lib/cuon-matrix.js'
const main = async () => {
    const gl = initGL('webgl');
    const vsFile = '../src/shader/HelloCube.vs';
    const fsFile = '../src/shader/HelloCube.fs';

    let program = await loadShaderFromFile(gl, vsFile, fsFile);
    if(program instanceof Error ) return;

    // location 
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_Color = getLocation(gl, program, 'a_Color');
    const u_MvpMatrix = getLocation(gl, program, 'u_MvpMatrix', false);
    // buffer and data
    var verticesColors = new Float32Array([
        // 设置顶点和颜色（偷的顶点代码位置）
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ]);

    //顶点索引
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // 前
        0, 3, 4,   0, 4, 5,    // 右
        0, 5, 6,   0, 6, 1,    // 上
        1, 6, 7,   1, 7, 2,    // 左
        7, 4, 3,   7, 3, 2,    // 下
        4, 7, 6,   4, 6, 5     // 后
    ]);


    let vertexBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6* FSIZE, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6* FSIZE, 3* FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    //matrix
    let mvpMatrix: Matrix4 = new Matrix4(undefined);
    mvpMatrix.setPerspective(30,1,1,100);
    mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clearColor(0.,0.,0.,1.);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    // gl.drawArrays(gl.TRIANGLES,0,9);
}
main();