/* eslint-disable no-undef, no-unused-vars */

// DECLARACIONES
let canvas;
let canvasHeight = 120;
let canvasWidth;
const URL_AUDIO = "ASM - Tutorial 7 - audio.ogg"; 
let velocidad;
let volumen;
let soundFile;
let medidaAmplitud;
let diametroCirculo;
let reverberacion;

// Variables de posición actual y posición de destino
let circuloX, circuloY;
let destinoX, destinoY;

function preload() {
  soundFormats("ogg");
  soundFile = loadSound(URL_AUDIO);
}

function setup() {
  canvasWidth = windowWidth;
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container");

  velocidad = 1.0;
  volumen = 0.5;
  soundFile.pause();

  medidaAmplitud = new p5.Amplitude();

 
  circuloX = windowWidth / 2;
  circuloY = 60;
  destinoX = circuloX;
  destinoY = circuloY;

  // Configuración de reverberación
  reverberacion = new p5.Reverb();
  reverberacion.disconnect();
  reverberacion.process(soundFile, 2, 1);
  reverberacion.drywet(0.8);
}

function draw() {
  background(128, 128, 128);

  // Animación del movimiento hacia la nueva posición usando lerp()
  // 0.05 define la velocidad del suave desplazamiento (ajustable entre 0 y 1)
  circuloX = lerp(circuloX, destinoX, 0.05);
  circuloY = lerp(circuloY, destinoY, 0.05);

  let amplitudAudio = medidaAmplitud.getLevel();
  diametroCirculo = map(amplitudAudio, 0, 1, 0, 200);

  fill(255, 0, 0);
  circle(circuloX, circuloY, diametroCirculo);
}

windowResized = function () {
  canvasWidth = windowWidth;
  resizeCanvas(canvasWidth, canvasHeight);
};

function keyTyped() {
  if (key === "p") {
    if (soundFile.isPlaying()) {
      soundFile.pause();
    } else {
      soundFile.play();
    }
  } else if (key === ">" && soundFile.isPlaying()) {
    velocidad += 0.1;
    soundFile.rate(velocidad);
  } else if (key === "<" && soundFile.isPlaying()) {
    velocidad -= 0.1;
    soundFile.rate(velocidad);
  } else if (key === "+" && soundFile.isPlaying()) {
    volumen += 0.1;
    soundFile.setVolume(volumen);
  } else if (key === "-" && soundFile.isPlaying()) {
    volumen -= 0.1;
    soundFile.setVolume(volumen);
  }
}

function mouseClicked() {
  // Medir distancia usando la posición actual del círculo
  let d = dist(circuloX, circuloY, mouseX, mouseY);

  if (d <= diametroCirculo / 2) {
    // Clic dentro del círculo: activa reverberación
    reverberacion.connect();
  } else {
    // Clic fuera del círculo: desactiva reverberación y establece la nueva meta
    reverberacion.disconnect();
    destinoX = mouseX;
    destinoY = mouseY;
  }
}