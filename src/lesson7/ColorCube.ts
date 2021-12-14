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
    var vertices = new Float32Array([   // 顶点的位置坐标数据
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);

    var colors = new Float32Array([     // 顶点的颜色
        0.4, 0.4, 0.4,  0.4, 0.4, 0.4,  0.4, 0.4, 0.4,  0.4, 0.4, 0.4,  // v0-v1-v2-v3 front(blue)
        0.9, 0.9, 0.9,  0.9, 0.9, 0.9,  0.9, 0.9, 0.9,  0.9, 0.9, 0.9,  // v0-v3-v4-v5 right(green)
        0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  // v0-v5-v6-v1 up(red)
        0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  // v1-v6-v7-v2 left
        0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  // v7-v4-v3-v2 down
        0.8, 0.8, 0.8,  0.8, 0.8, 0.8,  0.8, 0.8, 0.8,  0.8, 0.8, 0.8   // v4-v7-v6-v5 back
    ]);

    var indices = new Uint8Array([       // 绘制的索引
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    let verticesBuffer = gl.createBuffer();
    let colorBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 3* FSIZE, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 3*FSIZE, 0);
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