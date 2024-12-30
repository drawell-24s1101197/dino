/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//恐竜を表示させるプログラム
const dinoImg = new Image();
dinoImg.src = 'image/dino.png';
dinoImg.onload = () => {
    ctx.drawImage(dinoImg, 0, 320)
}