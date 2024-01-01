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
const box = document.querySelector(".box")
const brushes = document.querySelector(".Brushes")
const Color2 = document.querySelector(".color1");
const Color3 = document.querySelector(".color2");
const newCanva = document.querySelector(".moreCanva");

let startX, startY, endX, endY,selectedShape;
// indicadores de lo que se esta ejecutado
let Drawing = false;
let Drawing2 = false;
let erasing = false; 
let shape = false;
let list_draw = [];

const updateOffset = () => {
  const rect = canvas.getBoundingClientRect();
  offsetX = rect.left;
  offsetY = rect.top;
};

const Draw = (endX, endY) => {
  ctxt.beginPath();
  ctxt.moveTo(startX, startY);
  ctxt.lineWidth = Rage.value;
  ctxt.strokeStyle = Color1.value;
  ctxt.lineCap = "round";
  ctxt.lineJoin = "round";
  ctxt.lineTo(endX, endY);
  ctxt.stroke();
  startX = endX;
  startY = endY;
};

const multiplesBrushes = ()=>{
  ctxt.beginPath();
  ctxt.moveTo(startX, startY);
  ctxt.lineTo(endX, endY);
  ctxt.lineWidth = Rage.value;
  ctxt.strokeStyle = Color2.value;
  ctxt.lineCap = "round";
  ctxt.lineJoin = "round";
  ctxt.stroke();
  let tempStartx = startX
  let tempStarty = startY
  startX = endX;
  startY = endY;
  // Abajo
  ctxt.beginPath();
  ctxt.moveTo(tempStartx- canvas.offsetLeft + 100, tempStarty- canvas.offsetTop + 100);
  ctxt.lineTo(endX - canvas.offsetLeft + 100, endY - canvas.offsetTop + 100);
  ctxt.strokeStyle = Color3.value;
  ctxt.stroke();
}

shapes.forEach(btn => {
  btn.addEventListener('click', function() {
    selectedShape = this.getAttribute('data-shape');
    Drawing = false
    erasing = false
    shape = true
    shapes.forEach(innercolor => {
      innercolor.style.background = "";
    })
    this.style.background = "#3498db"
    brush.style.background = ""
    del.style.background = ""
    brushes.style.Background = ""
  });
});
canvas.addEventListener("mouseover",()=> Drawing = false);

updateOffset();
// Limpia todo el lienzo
clear.addEventListener("click", () => ctxt.clearRect(0, 0, canvas.width, canvas.height));

// Cambiamos el color de fondo
Background.addEventListener("change", () => canvas.style.background = Background.value);

// Activamos el borrado
del.addEventListener("click", () => {
  del.style.background = "#c0392b"
  erasing = true; 
  Drawing = false;
  shape = false;
  Drawing2 = false;
});
// Activamos el pincel
brush.addEventListener("click", () =>{
  brush.style.background = "#3498db"
  Drawing = true
  Drawing2 = false;
  shape = false;
  erasing = false
});
brushes.addEventListener("click", () =>{
  brushes.style.background = "#3498db"
  Drawing2 = true;
  Drawing = true;
  shape = false;
  erasing = false
});

canvas.addEventListener("mousedown", (e)=>{
  Drawing = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

canvas.addEventListener("mousemove", (e)=>{
  if (!Drawing) return;
  endX = e.clientX - offsetX;
  endY = e.clientY - offsetY;

  if (erasing) ctxt.clearRect(endX - 5, endY - 5, Rage.value, Rage.value); 
  else if(shape);
  else if(Drawing2) multiplesBrushes(endX, endY);
  else Draw(endX, endY);
});
canvas.addEventListener("mouseup", (e)=>{
  if (shape) {
    const width = endX - startX;
    const height = endY - startY;
    ctxt.fillStyle = Color1.value;
    switch (selectedShape) {
      case 'rectangle':
        ctxt.lineWidth = Rage.value;
        ctxt.strokeStyle = Color1.value;
        if(box.checked) ctxt.fillRect(startX, startY, width, height);
        else ctxt.strokeRect(startX, startY, width, height);
          break;

      case 'circle':
        ctxt.lineWidth = Rage.value;
        ctxt.strokeStyle = Color1.value;
        const radius = Math.sqrt(width * width + height * height);
        ctxt.beginPath();
        ctxt.arc(startX, startY, radius, 0, 2 * Math.PI);
        if(box.checked)ctxt.fill();
        else ctxt.stroke();
        break;

      case 'triangle':
        ctxt.lineWidth = Rage.value;
        ctxt.strokeStyle = Color1.value;
        ctxt.beginPath();
        ctxt.moveTo(startX, startY);
        ctxt.lineTo(endX, endY);
        ctxt.lineTo(2 * startX - endX, endY);
        ctxt.closePath();
        if(box.checked) ctxt.fill()
        else ctxt.stroke();
        break;

      case "linea":
        ctxt.lineWidth = Rage.value;
        ctxt.strokeStyle = Color1.value;
        ctxt.beginPath();
        ctxt.moveTo(startX, startY);
        ctxt.lineTo(endX, endY);
        ctxt.stroke();
        break;
      case "oval":
        ctxt.lineWidth = Rage.value;
        ctxt.strokeStyle = Color1.value;
        let width2 = Math.abs(endX - startX);
        let height2 = Math.abs(endY - startY);
        let centerX = startX + (endX - startX) / 2;
        let centerY = startY + (endY - startY) / 2;
        ctxt.beginPath();
        ctxt.ellipse(centerX, centerY, width2 / 2, height2 / 2, 0, 0, 2 * Math.PI);
        if(box.checked)ctxt.fill();
        else ctxt.stroke();
        break;
      }
  }
  Drawing = false;
});
