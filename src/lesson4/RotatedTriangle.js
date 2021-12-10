var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initBuffer, initGL, loadShaderFromFile, getLocation } from "../../lib/webgl-tool.js";
import { Matrix4 } from "../../lib/cuon-matrix.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let gl = initGL('webgl');
        let fsFile = "../src/shader/RotatedTriangle.fs";
        let vsFile = "../src/shader/RotatedTriangle.vs";
        let res = yield loadShaderFromFile(gl, vsFile, fsFile);
        if (res instanceof Error) {
            console.log(res);
            return;
        }
        let program = res;
        // get location
        let a_Position = getLocation(gl, program, 'a_Position');
        let u_xformMatrix = getLocation(gl, program, 'u_xformMatrix', false);
        if (a_Position === null || u_xformMatrix === null)
            return;
        //buffer
        let vetices = new Float32Array([0.0, 0.5, -0.4, -0.3, 0.4, -0.3]);
        let bufferArgs = [gl.ARRAY_BUFFER, gl.ARRAY_BUFFER, gl.STATIC_DRAW, 2, gl.FLOAT, false, 0, 0];
        let n = initBuffer(gl, [a_Position, vetices, bufferArgs]);
        function drawTriangle(progress) {
            let modelMatrix = new Matrix4(undefined);
            modelMatrix.setRotate(progress, 0, 0, 1);
            gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);
            gl.clearColor(0., 0., 0., 1.);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, n[0]);
        }
        ;
        let animate = new animateClass(rotate, drawTriangle, 5000);
        animate.animate();
        // button
        let up = document.getElementById('UP');
        let down = document.getElementById('DOWN');
        up.onclick = () => { animate.speedUp(); };
        down.onclick = () => { animate.speedDown(); };
    });
}
class animateClass {
    constructor(timing, draw, duration) {
        this.timing = timing;
        this.draw = draw;
        this.duration = duration;
    }
    animate() {
        let start = performance.now();
        const animate = (time) => {
            let timeFraction = (time - start) / this.duration;
            if (timeFraction > 1)
                timeFraction %= 1;
            //计算当前动画状态
            let progress = this.timing(timeFraction);
            this.draw(progress);
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
        // requestAnimationFrame(function animate(time: number) {
        //     let timeFraction: number = (time - start) / _this.duration;
        //     if (timeFraction > 1) timeFraction %= 1;
        //     //计算当前动画状态
        //     let progress = _this.timing(timeFraction);
        //     _this.draw(progress);
        //     if (timeFraction < 1) {
        //         requestAnimationFrame(animate);
        //     }
        // })
    }
    speedUp() {
        this.duration = this.duration <= 100 ? this.duration : this.duration - 100;
    }
    speedDown() {
        this.duration = this.duration += 100;
    }
}
// function animate(timing: Function, draw: Function, duration: number) {
//     let start = performance.now();
//     requestAnimationFrame(function animate(time: number) {
//         let timeFraction: number = (time - start) / duration;
//         if (timeFraction > 1) timeFraction %= 1;
//         //计算当前动画状态
//         let progress = timing(timeFraction);
//         draw(progress);
//         if (timeFraction < 1) {
//             requestAnimationFrame(animate);
//         }
//     })
// }
function rotate(timeFraction) {
    return timeFraction * 360.0;
}
main();
