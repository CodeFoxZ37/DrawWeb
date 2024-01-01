const txti = document.querySelector(".textInterface")
const text = document.querySelector(".Text");
const number = document.querySelector(".Number");
const colorTxt = document.querySelector(".colorText");
const btn = document.querySelector(".Btntext");
let cursorx = 0;
let cursory = 0;

canvas.addEventListener("dblclick",(e)=>{
  cursorx = e.clientX - offsetX;
  cursory = e.clientY - offsetY;
  txti.style.display = "block";
  txti.style.top = `${e.clientY}px`;
  txti.style.left = `${e.clientX}px`;
  
})

btn.addEventListener("click", ()=>{
  ctxt.font = `${number.value}px Arial`
  ctxt.fillStyle = `${colorTxt.value}`;
  ctxt.fillText(`${text.value}`, cursorx, cursory)
  txti.style.display = "none"
});
canvas.addEventListener("click",()=> txti.style.display = "none")
canvas.addEventListener("click",()=> txti.style.display = "none")

document.querySelector(".download").addEventListener("click", function() {
  const computedStyle = getComputedStyle(canvas); 
  const backgroundColor = computedStyle.backgroundColor;

  // Crear un canvas temporal para no modificar el original
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtxt = tempCanvas.getContext("2d");

  // Rellenar con el color de fondo
  tempCtxt.fillStyle = backgroundColor;
  tempCtxt.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Dibujar la imagen original del canvas en el canvas temporal
  tempCtxt.drawImage(canvas, 0, 0);

  // Crear un enlace temporal para simular la descarga
  const link = document.createElement('a');
  link.href = tempCanvas.toDataURL("image/png");
  link.download = "dibujo.png";
  link.click();
});