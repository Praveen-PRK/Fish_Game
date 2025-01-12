// Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameSpeed = 1;
let gameOver = false;

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();    // Here we are getting the coordinates of canvas that we will subtract from actual mouse coordinate to get the position of mouse with respect to canvas not according to screen.
// console.log(canvasPosition);


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
};
canvas.addEventListener('mousedown',function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;      // Previously when it was event.x or y these were getting the coordinates according to whole screen but we want coordinates with respect to canvas. So for that we are subtracting the canvas coordinates with actual mouse coordinate, to get the position of mouse with respect to canvas not according to screen.
    mouse.y = event.y - canvasPosition.top;
    // console.log(mouse.X,mouse.Y);
    // console.log(event);
});
canvas.addEventListener('mouseup',function(){
    mouse.click = false;
});

// Player
const playerLeft = new Image();
playerLeft.src = 'fish_left1.png';
const playerRight = new Image();
playerRight.src = 'fish_right1.png';



class Player {
    constructor(){  // These are the properties of the player
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 40;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 1060;    // This is the width of the actual image in px.
        this.spriteHeight = 594;    // This is the height of the actual image in px.
    }
    update(){
        const dx = this.x - mouse.x;    // Distance from horizontal X
        const dy = this.y - mouse.y;    // Distance from vertical Y 
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
        if(mouse.x != this.x){
            this.x-=dx/30;
        }
        if(mouse.y != this.y){
            this.y-=dy/30;
        }

    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
        }
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        const imageWidth = this.radius * 3.8;  // Set image width to the diameter of the player
        const imageHeight = imageWidth * (this.spriteHeight / this.spriteWidth);

        if(this.x>=mouse.x){
            // ctx.drawImage(playerLeft,this.frameX, this.frameY, this.spriteWidth/3, this.spriteHeight/2.8, this.x-85, this.y-100, this.spriteWidth/2.3, this.spriteHeight/2.3);
            ctx.drawImage(
                playerLeft,
                this.frameX, this.frameY,
                this.spriteWidth, this.spriteHeight,
                -imageWidth+90, -imageHeight+43,  // Center the image
                imageWidth, imageHeight            // Set the width and height based on radius
            );
        }
        else{
            // ctx.drawImage(playerRight,this.frameX, this.frameY, this.spriteWidth/3.8, this.spriteHeight/2.8, this.x-100, this.y-90, this.spriteWidth/2.6, this.spriteHeight/2.3);
            ctx.drawImage(
                playerRight,
                this.frameX, this.frameY,
                this.spriteWidth, this.spriteHeight,
                -imageWidth+90, -imageHeight+43,  // Center the image
                imageWidth, imageHeight            // Set the width and height based on radius
            );
        }
        ctx.restore();
    }
}
const player = new Player();


// Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = 'buble_pop_two_01.png'
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius  = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        /* ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke(); */
        ctx.drawImage(bubbleImage,this.x-69,this.y-70,this.radius*2.77,this.radius*2.77);
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'bubble1.mp3';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'bubble2.mp3';

function handleBubbles(){
    if (gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
        console.log(bubblesArray.length);
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if(bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i,1);
            i--;
        }
        else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
            // (console.log('collision'));
            if (!bubblesArray[i].counted) {
                if (bubblesArray[i].sound == 'sound1'){
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }
                score++;
                bubblesArray[i].counted = true;
                bubblesArray.splice(i,1);
                i--;
            }
        }
        
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        
        
    }
}


// Repeating background
const background = new Image();
background.src = 'wave1bg.png';
background.style.margin = 0;

const BG = {
    x1:0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground(){
    BG.x1 -= gameSpeed;
    if (BG.x1 < -BG.width) {BG.x1 = BG.width}
    BG.x2 -= gameSpeed;
    if (BG.x2 < -BG.width) {BG.x2 = BG.width}
    ctx.drawImage(background,BG.x1,BG.y, BG.width, BG.height);
    ctx.drawImage(background,BG.x2,BG.y, BG.width, BG.height);
}



// Enemies
const enemyImage = new Image();
enemyImage.src = 'EnemyFishL1.png';

class Enemy {
    constructor(){
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 300);
        this.radius = 45;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0
        this.frameY = 0
        this.spriteWidth = 324;    // This is the width of the actual image in px.
        this.spriteHeight = 278;    // This is the height of the actual image in px.
    }
    draw(){
        /* ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        ctx.fill(); */
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth , this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-56,this.y-65,this.spriteWidth / 2.3, this.spriteHeight/2.3)
    }
    update(){
        this.x -= this.speed;
        if (this.x < 0 - this.radius*2){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 90);
            this.speed = Math.random() * 2 + 2;
        }
        if (gameFrame % 5 == 0){
            this.frame++;
            // if (this.frame>=5) {this.frame = 0};
            // if (this.frame == 2 || this.frame == 5){
            //     this.frame = 0;
            // } else {
            //     this.frameX++;
            // }
            // if (this.frame <2) {this.frameY = 0}
            // else if (this.frame <6 ) {this.frameY = 1}
            // else this.frameY = 0;

            this.frameX = this.frame % 3; 
            if(this.frame % 4 == 0) this.frameY++;
            if(this.frame % 9 == 0)this.frameY = 0;
            this.frame++;
        }

        // Collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius){
            handleGameOver();
        }
    }
}

const enemy1 = new Enemy();
function handleEnemies(){
    enemy1.draw();
    enemy1.update();
}


// Game Over
function handleGameOver(){
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, you reached score '+ score, 105,250);
    gameOver = true;
}

// Animation Loop
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score,10,50);
    gameFrame++;
    // console.log(gameFrame);
    if (!gameOver) {requestAnimationFrame(animate)};
}
animate();


window.addEventListener('resize',function(){
    canvasPosition = canvas.getBoundingClientRect();
});
