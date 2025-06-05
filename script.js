const canvas = document.getElementById("canvas");
const ctxt = canvas.getContext("2d");
const Color1 = document.querySelector(".inputColor");
const Background = document.querySelector(".inputColor2");
const Rage = document.querySelector(".inputRange");
const RageValue = document.querySelector(".rangeValue");
const clear = document.querySelector(".clear");
const brush = document.querySelector(".Brush");
const del = document.querySelector(".Delete");
const shapes = document.querySelectorAll('.shape, .Brush, .Delete, .Brushes');
const box = document.querySelector(".box");
const Color2 = document.querySelector(".color1");
const Color3 = document.querySelector(".color2");
const newCanva = document.querySelector(".moreCanva");

let startX, startY, endX, endY, selectedShape;
// Indicadores de lo que se está ejecutando
let Drawing = false;
let Drawing2 = false;
let erasing = false; 
let shape = false;
let list_draw = [];

const updateCanvasSize = () => {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctxt.scale(window.devicePixelRatio, window.devicePixelRatio);
  offsetX = rect.left;
  offsetY = rect.top;
  canvas.style.background = Background.value; // Inicializa el fondo al redimensionar
};

// Función para dibujar una línea y almacenar el trazo
const Draw = (endX, endY) => {
  ctxt.beginPath();
  ctxt.moveTo(startX, startY);
  ctxt.lineWidth = Rage.value;
  ctxt.strokeStyle = Color1.value;
  ctxt.lineCap = "round";
  ctxt.lineJoin = "round";
  ctxt.lineTo(endX, endY);
  ctxt.stroke();
  
  // Almacena el trazo en list_draw
  list_draw.push({
    shape: 'brush',
    startX,
    startY,
    endX,
    endY,
    lineWidth: Rage.value,
    color: Color1.value
  });
  
  startX = endX;
  startY = endY;
};

// Función para redibujar todas las figuras y trazos almacenados
const redrawShapes = () => {
  ctxt.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.background = Background.value; // Restaura el fondo
  list_draw.forEach(shapeData => {
    ctxt.lineWidth = shapeData.lineWidth;
    ctxt.strokeStyle = shapeData.color;
    ctxt.fillStyle = shapeData.color;
    switch (shapeData.shape) {
      case 'brush':
        ctxt.beginPath();
        ctxt.moveTo(shapeData.startX, shapeData.startY);
        ctxt.lineCap = "round";
        ctxt.lineJoin = "round";
        ctxt.lineTo(shapeData.endX, shapeData.endY);
        ctxt.stroke();
        break;
      case 'rectangle':
        if (shapeData.filled) {
          ctxt.fillRect(shapeData.startX, shapeData.startY, shapeData.width, shapeData.height);
        } else {
          ctxt.strokeRect(shapeData.startX, shapeData.startY, shapeData.width, shapeData.height);
        }
        break;
      case 'circle':
        ctxt.beginPath();
        ctxt.arc(shapeData.startX, shapeData.startY, shapeData.radius, 0, 2 * Math.PI);
        if (shapeData.filled) {
          ctxt.fill();
        } else {
          ctxt.stroke();
        }
        break;
      case 'triangle':
        ctxt.beginPath();
        ctxt.moveTo(shapeData.startX, shapeData.startY);
        ctxt.lineTo(shapeData.endX, shapeData.endY);
        ctxt.lineTo(2 * shapeData.startX - shapeData.endX, shapeData.endY);
        ctxt.closePath();
        if (shapeData.filled) {
          ctxt.fill();
        } else {
          ctxt.stroke();
        }
        break;
      case 'linea':
        ctxt.beginPath();
        ctxt.moveTo(shapeData.startX, shapeData.startY);
        ctxt.lineTo(shapeData.endX, shapeData.endY);
        ctxt.stroke();
        break;
      case 'oval':
        ctxt.beginPath();
        ctxt.ellipse(
          shapeData.centerX,
          shapeData.centerY,
          shapeData.width / 2,
          shapeData.height / 2,
          0,
          0,
          2 * Math.PI
        );
        if (shapeData.filled) {
          ctxt.fill();
        } else {
          ctxt.stroke();
        }
        break;
    }
  });
};

// Configuración de los botones de formas
shapes.forEach(btn => {
  btn.addEventListener('click', function() {
    selectedShape = this.getAttribute('data-shape');
    Drawing = false;
    erasing = false;
    shape = true;
    shapes.forEach(innercolor => {
      innercolor.style.background = "";
    });
    this.style.background = "#3498db";
    brush.style.background = "";
    del.style.background = "";
    canvas.style.background = Background.value; // Restaura el fondo al seleccionar una forma
    redrawShapes(); // Redibuja para asegurar que el fondo y las figuras se mantengan
  });
});

canvas.addEventListener("mouseover", () => Drawing = false);

// Inicializa el canvas y el fondo
updateCanvasSize();
canvas.style.background = Background.value; // Establece el fondo inicial

// Limpia todo el lienzo
clear.addEventListener("click", () => {
  ctxt.clearRect(0, 0, canvas.width, canvas.height);
  list_draw = []; // Limpia el historial de figuras y trazos
  canvas.style.background = Background.value; // Restaura el fondo
});

// Cambiamos el color de fondo
Background.addEventListener("change", () => {
  canvas.style.background = Background.value;
  redrawShapes(); // Redibuja las figuras con el nuevo fondo
});

// Activamos el borrado
del.addEventListener("click", () => {
  del.style.background = "#c0392b";
  erasing = true; 
  Drawing = false;
  shape = false;
  Drawing2 = false;
});

// Activamos el pincel
brush.addEventListener("click", () => {
  brush.style.background = "#3498db";
  Drawing = true;
  Drawing2 = false;
  shape = false;
  erasing = false;
});

canvas.addEventListener("mousedown", (e) => {
  Drawing = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!Drawing) return;
  endX = e.clientX - offsetX;
  endY = e.clientY - offsetY;

  if (erasing) {
    ctxt.clearRect(endX - 5, endY - 5, Rage.value, Rage.value);
  } else if (shape) {
    // Redibuja el lienzo con las figuras previas
    redrawShapes();
    // Dibuja la vista previa de la figura
    ctxt.lineWidth = Rage.value;
    ctxt.strokeStyle = Color1.value;
    ctxt.fillStyle = Color1.value;
    const width = endX - startX;
    const height = endY - startY;
    switch (selectedShape) {
      case 'rectangle':
        if (box.checked) {
          ctxt.fillRect(startX, startY, width, height);
        } else {
          ctxt.strokeRect(startX, startY, width, height);
        }
        break;
      case 'circle':
        const radius = Math.sqrt(width * width + height * height);
        ctxt.beginPath();
        ctxt.arc(startX, startY, radius, 0, 2 * Math.PI);
        if (box.checked) {
          ctxt.fill();
        } else {
          ctxt.stroke();
        }
        break;
      case 'triangle':
        ctxt.beginPath();
        ctxt.moveTo(startX, startY);
        ctxt.lineTo(endX, endY);
        ctxt.lineTo(2 * startX - endX, endY);
        ctxt.closePath();
        if (box.checked) {
          ctxt.fill();
        } else {
          ctxt.stroke();
        }
        break;
      case 'linea':
        ctxt.beginPath();
        ctxt.moveTo(startX, startY);
        ctxt.lineTo(endX, endY);
        ctxt.stroke();
        break;
      case 'oval':
        const width2 = Math.abs(endX - startX);
        const height2 = Math.abs(endY - startY);
        const centerX = startX + (endX - startX) / 2;
        const centerY = startY + (endY - startY) / 2;
        ctxt.beginPath();
        ctxt.ellipse(centerX, centerY, width2 / 2, height2 / 2, 0, 0, 2 * Math.PI);
        if (box.checked) {
          ctxt.fill();
        } else {
          ctxt.stroke();
        }
        break;
    }
  } else {
    Draw(endX, endY);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (shape) {
    const width = endX - startX;
    const height = endY - startY;
    const shapeData = {
      shape: selectedShape,
      startX,
      startY,
      endX,
      endY,
      width,
      height,
      lineWidth: Rage.value,
      color: Color1.value,
      filled: box.checked,
      centerX: startX + (endX - startX) / 2, // Para óvalos
      centerY: startY + (endY - startY) / 2, // Para óvalos
      radius: Math.sqrt(width * width + height * height), // Para círculos
    };
    list_draw.push(shapeData); // Almacena la figura
    redrawShapes(); // Redibuja todas las figuras
  }
  Drawing = false;
});