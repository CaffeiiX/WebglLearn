import { loadShaderFromFile, initGL, getLocation } from "../../lib/webgl-tool.js";
import { Matrix4, Vector3 } from "../../lib/cuon-matrix.js";

const main: Function = async () => {
    const gl = initGL('webgl');
    const vsFile = '../src/shader/PointLightCube_perFragment.vs';
    const fsFile = '../src/shader/PointLightCube_perFragment.fs';

    let program = await loadShaderFromFile(gl, vsFile, fsFile);
    if (program instanceof Error) return;

    // location 
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_Color = getLocation(gl, program, 'a_Color');
    const u_MvpMatrix = getLocation(gl, program, 'u_MvpMatrix', false);
    const u_ModelMatrix = getLocation(gl, program, 'u_ModelMatrix', false);
    const u_LightColor = getLocation(gl, program, 'u_LightColor', false);
    const u_LightPosition = getLocation(gl, program, 'u_LightPosition', false);
    const u_AmbientLight = getLocation(gl, program, 'u_AmbientLight', false);
    const a_Normal = getLocation(gl, program, 'a_Normal');
    const u_NormalMatrix = getLocation(gl, program, 'u_NormalMatrix', false);
    // buffer and data

    const vertices = new Float32Array([   // 顶点的位置坐标数据
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([     // 顶点的颜色
        1., 0., 0., 1., 0., 0., 1., 0., 0., 1., 0., 0.,  // v0-v1-v2-v3 front(blue)
        1., 0., 0., 1., 0., 0., 1., 0., 0., 1., 0., 0.,  // v0-v3-v4-v5 right(green)
        1., 0., 0., 1., 0., 0., 1., 0., 0., 1., 0., 0.,  // v0-v5-v6-v1 up(red)
        1., 0., 0., 1., 0., 0., 1., 0., 0., 1., 0., 0.,  // v1-v6-v7-v2 left
        1., 0., 0., 1., 0., 0., 1., 0., 0., 1., 0., 0.,  // v0-v5-v6-v1 up(red)
        1., 0., 0., 1., 0., 0., 1., 0., 0., 1., 0., 0.   // v4-v7-v6-v5 back
    ]);

    const normals = new Float32Array([    // 法向量
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
    ]);

    const indices = new Uint8Array([       // 绘制的索引
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    let verticesBuffer = gl.createBuffer();
    let colorBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();
    let normalBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 3 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 3 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 3 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    //light
    gl.uniform3f(u_LightColor, 1, 1., 1.);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    gl.uniform3f(u_LightPosition, 0., 3., 4.);

    //matrix
    let modelMatrix: Matrix4 = new Matrix4(undefined);
    modelMatrix.setTranslate(0., 0.0, 0.);
    render(() => {
        let mvpMatrix: Matrix4 = new Matrix4(undefined);
        mvpMatrix.setPerspective(30, 1, 1, 100);
        mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

        modelMatrix.rotate(0.3, 0., 1., 0.);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        mvpMatrix.multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        let normalMatrix: Matrix4 = new Matrix4(undefined);
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        gl.clearColor(0., 0., 0., 1.);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    })

}
const render = (animate: Function) => {
    requestAnimationFrame(function animation() {
        animate();
        requestAnimationFrame(animation);
    })
}

main();