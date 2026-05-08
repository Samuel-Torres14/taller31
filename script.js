//obtiene el canvas y el contexto a dibujar
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

console.log("Canvas conectado correctamente");

//limites de la ventana de recorte
let xMin = 150;
let yMin = 100;
let xMax = 550;
let yMax = 350;

//dibujar ventana de recorte
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

//dibuja la linea
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

//punntos en la region
const INSIDE = 0;
const LEFT = 1;
const RIGHT = 2;
const BOTTOM = 4;
const TOP = 8;

//calcula la posicion del punto
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

//algoritmo de recorte
function cohenSutherland(x1,y1,x2,y2){

    // codigos de los extremos
    let code1 = computeCode(x1,y1);
    let code2 = computeCode(x2,y2);

    let accept = false;

    while(true){

        //linea completamente adentro
        if((code1 | code2) === 0){

            accept = true;
            break;
        }

        //linea completamente fuera
        else if((code1 & code2) !== 0){

            break;
        }

        //linea parcialmente adentro
        else{

            let codeOut;
            let x,y;

            //selecciona punto externo
            if(code1 !== 0)
                codeOut = code1;
            else
                codeOut = code2;

            //interseccion superior
            if(codeOut & TOP){

                x = x1 + (x2 - x1) * (yMax - y1) / (y2 - y1);
                y = yMax;
            }

            //interseccion inferior
            else if(codeOut & BOTTOM){

                x = x1 + (x2 - x1) * (yMin - y1) / (y2 - y1);
                y = yMin;
            }

            //interseccion derecha
            else if(codeOut & RIGHT){

                y = y1 + (y2 - y1) * (xMax - x1) / (x2 - x1);
                x = xMax;
            }

            //interseccion izquierda
            else if(codeOut & LEFT){

                y = y1 + (y2 - y1) * (xMin - x1) / (x2 - x1);
                x = xMin;
            }

            //actualizar el primer punto
            if(codeOut === code1){

                x1 = x;
                y1 = y;
                code1 = computeCode(x1,y1);
            }

            //actualizar el segundo punto
            else{

                x2 = x;
                y2 = y;
                code2 = computeCode(x2,y2);
            }
        }
    }

    //retorna resultado
    return {
        accept,
        x1,
        y1,
        x2,
        y2
    };
}


let escenaActual = 0;

//casos de prueba
const escenas = [

    {
        nombre:"Caso 1: Línea dentro",
        linea:{x1:200,y1:150,x2:450,y2:300}
    },

    {
        nombre:"Caso 2: Línea fuera",
        linea:{x1:50,y1:50,x2:100,y2:80}
    },

    {
        nombre:"Caso 3: Cruce izquierda",
        linea:{x1:50,y1:250,x2:300,y2:250}
    },

    {
        nombre:"Caso 4: Cruce derecha",
        linea:{x1:450,y1:200,x2:700,y2:200}
    },

    {
        nombre:"Caso 5: Línea atravesando viewport",
        linea:{x1:50,y1:50,x2:700,y2:450}
    }
];

//dibuja la escena
function renderizar(){

    //limpia el canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawViewport();

    const escena = escenas[escenaActual];

    const l = escena.linea;

    // Línea original
    drawLine(
        l.x1,
        l.y1,
        l.x2,
        l.y2,
        "gray",
        1
    );

    //aplica el recorte
    const recorte = cohenSutherland(
        l.x1,
        l.y1,
        l.x2,
        l.y2
    );

    // Línea recortada
    if(recorte.accept){

        drawLine(
            recorte.x1,
            recorte.y1,
            recorte.x2,
            recorte.y2,
            "red",
            3
        );
    }

    // TEXTO DEL CASO ACTUAL
    document.getElementById("casoTexto").innerText =
        escena.nombre;
}
//botones para las escenas
function siguienteEscena(){

    escenaActual++;

    if(escenaActual >= escenas.length)
        escenaActual = 0;

    renderizar();
}

function anteriorEscena(){

    escenaActual--;

    if(escenaActual < 0)
        escenaActual = escenas.length - 1;

    renderizar();
}

//cambia la ventana de recorte
function actualizarVentana(){

    xMin = parseInt(document.getElementById("xmin").value);
    yMin = parseInt(document.getElementById("ymin").value);
    xMax = parseInt(document.getElementById("xmax").value);
    yMax = parseInt(document.getElementById("ymax").value);

    //dibuja la primera escena
    renderizar();
}