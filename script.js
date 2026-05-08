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

function drawLine(x1,y1,x2,y2,color="black",grosor=2){

    ctx.beginPath();

    ctx.moveTo(x1,y1);

    ctx.lineTo(x2,y2);

    ctx.strokeStyle = color;

    ctx.lineWidth = grosor;

    ctx.stroke();
}

// Linea de prueba

drawLine(50,50,700,400,"gray",2);

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

function computeCode(x,y){

    let code = INSIDE;

    if(x < xMin)
        code |= LEFT;

    else if(x > xMax)
        code |= RIGHT;

    if(y < yMin)
        code |= BOTTOM;

    else if(y > yMax)
        code |= TOP;

    return code;
}

function cohenSutherland(x1,y1,x2,y2){

    let code1 = computeCode(x1,y1);
    let code2 = computeCode(x2,y2);

    let accept = false;

    while(true){

        // Aceptación trivial
        if((code1 | code2) === 0){

            accept = true;
            break;
        }

        // Rechazo trivial
        else if((code1 & code2) !== 0){

            break;
        }
        else{
            break;
        }
    }

    return accept;
}
