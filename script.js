const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

console.log("Canvas conectado correctamente");

let xMin = 150;
let yMin = 100;
let xMax = 550;
let yMax = 350;

function drawViewport(){

    ctx.strokeStyle = "blue";

    ctx.strokeRect(
        xMin,
        yMin,
        xMax - xMin,
        yMax - yMin
    );
}

ctx.clearRect(0,0,canvas.width,canvas.height);

drawViewport();