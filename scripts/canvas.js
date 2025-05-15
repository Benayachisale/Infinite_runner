const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const height = window.innerHeight;
const width = window.innerWidth;
canvas.height = height;
canvas.width = width;

function draw() {
    ctx.clearRect(0, 0, width, height)
    requestAnimationFrame(draw)
        GAME.background()

   // graph()
    platform.renderPlatforms()
    GAME.timerReset()
    animateParticles()
    user.update()
    drawMenu()
    button.renderButtons()
    
    
    //adding time
    if(GAME.pause || GAME.over)
    GAME.timer+=0
    else 
    GAME.timer++
    
    
    controlSpeed()
    print()
    
    //console.log(GAME.speed)
}

//game settings
const GAME = {
    over: false,
    pause: 0,
    timer:0,
    timerReset:()=>{
        if(this.timer>1000000){
            this.timer=0
        }
        
    },
    background:()=>{
  // Gradient for sky
  let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, '#87CEEB'); // Light blue at top
  gradient.addColorStop(0.5, '#ADD8E6'); // Pastel blue in middle
  gradient.addColorStop(1, '#F2C464'); // Warm yellow-orange at bottom

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw sun
  ctx.fillStyle = "transparent"; // Warm yellow-orange
  ctx.beginPath();
  ctx.arc(ctx.canvas.width / 2, 700, 300, 0, 2 * Math.PI);
  ctx.fill();
},
    speed:2,
    speedRate:100,
    copyright:"Game developed by Benaya Chisale 2025©",
    distance:0
}

//local storage
const storage=JSON.parse(localStorage.getItem('db'))||{
    plays:0,
    highScore:0,
    timeSpent:0,
    tutored:false
}

console.log(calculateTime(storage.timeSpent))
class player {
    constructor() {
        this.height = 100;
        this.width = 70
        this.x = (width-this.width)/2
        this.y =100


        //bounding rect
        this.color = "transparent"

        //gravitation
        this.gravity = 2.5
        this.velocityY = 0


        this.jumping = false;
        this.jumpTimer=0;
        this.maxJumptime=10;
        this.jumpValue=35;
        //event listeners
        document.addEventListener('touchstart', ()=> {
            this.jumping=true;

        })

        document.addEventListener('touchend', ()=> {
this.jumping=false
        })
       //sprite
       this.timer=0 
       this.frameRate=7
       this.framesX=6 
       this.currentFrameX=0;
       this.frameHeight=97
       this.frameWidth=85
       this.frameX=0
       this.frameY=0 
       this.image=new Image()
       this.image.src="img/sprite.png";
    }

    update() {
        this.draw()
        this.drawSprite() 
        this.physics()
        this.jump()
        this.gameOver()
    }

    //boolean methods
    onSurface() {
        return this.y+this.height > height

    }
    
onPlatform(){
 return platforms.some((platform)=> checkCollision(this,platform))
}

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    
    
    drawSprite(){
        ctx.drawImage(this.image,this.frameX,this.frameY,this.frameWidth,this.frameHeight,this.x,this.y,this.width,this.height)
        
        //logic here
        
        //preserving time 
    this.timer++
    if(this.timer>1000)
    this.timer=0;
    
    let addend=Math.round(GAME.speed)/8;
    //looping
    if(this.timer%(this.frameRate)==0 && !GAME.over && !GAME.pause){
        this.currentFrameX=(this.currentFrameX+1)%this.framesX;
      //  console.log("Frame:",this.currentFrameX)
        this.frameX=this.currentFrameX*this.frameWidth;
    }
    
    }
    
physics(){
  if(!GAME.pause && !GAME.over){
  if (!this.onPlatform()) {
    this.velocityY += this.gravity
    this.y += this.velocityY
  } else {
    this.velocityY = 0
    platforms.forEach((platform) => {
      if (checkCollision(this, platform)) {
        if (this.x + this.width > platform.x && this.x < platform.x + platform.width) {
          if (platform.y-(this.y+this.height) <5) { // Check if player is slightly below platform top
            this.y = platform.y - this.height
          }
        }
      }
      
    })
  }
  }
  
}
jump(){
             if(!GAME.pause && !GAME.over){

        if(this.jumping){
    this.y-=this.jumpValue;
        
           this.jumpTimer++ 
     if(this.jumpTimer>this.maxJumptime){
        this.jumping=false
        this.jumpTimer=0
            }
    }
             }
    }
    
    gameOver(){
        if(!GAME.over && this.y-this.height>height){
            GAME.over=true
            
            //adding plays 
            storage.plays++;
            localStorage.setItem('db',JSON.stringify(storage));
            window.location.reload()
        }
    }

}

class platform{
     constructor(x=width){ 
        this.width=300
        this.height = Math.floor(Math.random() * 100) + 50
        this.x=x
        this.y=(height-this.height)-100;
        
        this.color="transparent"
        this.image=new Image()
        this.images=["img/p1.png","img/p2.png"]
    //    this.image.src=this.images[Math.floor(Math.random()*this.images.length)]
    this.image.src=this.height>70?this.images[1]:this.images[0]
        this.coins = [
  new coin(this.x + this.width / 2 - 10, this.y - 20)
];    
}
     
     update(){
        this.draw()
        this.movePlatforms()
        this.drawCoins()
        
     }
     draw(){
         ctx.fillStyle=this.color;
         ctx.fillRect(this.x,this.y,this.width,this.height)
         ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
     }
     
     static renderPlatforms(){

         platforms.forEach((platform,index)=>{
             platform.update()
             if(platform.x+platform.width<0){
                 platforms.splice(index,1)
             }
         })
         if(!GAME.pause && !GAME.over){
       
    //Generating platforms
    let distance=-10;
    if(platforms[platforms.length-1].x<distance-GAME.speed){
        platforms.push(new platform())
       // console.log(platforms.length)
    }
         }
     }
     
     movePlatforms(){
         if(!GAME.pause && !GAME.over){
         if(user.jumping)
         this.x-=8+GAME.speed
         else
         this.x-=GAME.speed
     }
     }
     
     drawCoins(){
         this.coins.forEach((coin,index)=>{
             coin.update()
             
             if(checkCollision(user,coin)){
                 createBurst(user.x+(user.width/2),user.y+(user.height/2))
                 this.coins.splice(index,1)
             }
         })
     }
}


class coin{
    constructor(x,y){
        this.x=x-20
        this.y=y-30
        this.width=40
        this.height=40
        this.color="gold"
        this.image=new Image()
        this.image.src="img/coin1.png"
    }
    
    update(){
        this.draw()
        this.moveCoin()
    }
    
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    moveCoin(){
        if(!GAME.over && !GAME.pause){
        if(user.jumping){
            this.x-=8+GAME.speed
        }else{
            this.x-=GAME.speed
        }
        }
    }
}

class button{
    constructor(x,y,action){
        this.x=x
        this.y=y 
        this.height=50 
        this.width=50
        
        this.color="blue"
        this.action=action;
        this.image=new Image()
        this.image.src="img/gameui0.png"
        
    }
    update(){
        this.draw()
        this.addImage()
    }
    draw(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
    
    static renderButtons(){
              for(let i=0;i<buttons.length;i++){
            let button=buttons[i];
            button.update()
        }

    }
    
    addImage(){
       switch(this.action){
           case 1:
    ctx.drawImage(this.image,261,72,58,61,this.x,this.y,this.width,this.height)
    this.color="transparent"
         break
       }
    }
}

class Particle {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.alpha = 1; // Initial opacity
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha})`;
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= 0.02; // Gradually fade out
  }
}

//instances
const user = new player();
const platforms=[new platform(100)]
const buttons=[new button(50,50,1)]
const particles=[]



//functions

function createBurst(x, y) {
  for (let i = 0; i < 50; i++) {
    const radius = Math.random() * 5+ 1;
    const dx = (Math.random() - 0.5) * 5;
    const dy = (Math.random() - 0.5) * 5;
    const color = [Math.random() * 255, Math.random() * 255, Math.random() * 255]; // Random color
    particles.push(new Particle(x, y, dx, dy, radius, color));
  }
}
function animateParticles(){
    for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();

    // Remove particles that have faded out
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
    }
}
const print=()=>{
        ctx.textAlign = 'center'; // Center text horizontally
ctx.textBaseline = 'middle'; // Center text vertically
ctx.font = '24px bold'; // Set font size and style

let color=GAME.pause?"green":GAME.over?"red":"rgba(0,0,0,0.1)";

ctx.fillStyle = color; // Set text color

// Calculate the center of the canvas
let x = ctx.canvas.width / 2;
let y = ctx.canvas.height / 2;

// Draw the text

let text=GAME.pause?"GAME PAUSED":GAME.over?"GAME OVER":"INFINITE RUNNER"
ctx.fillText(text, x, y);
   // console.log(this.timer)
   
   
   //debugging zone 
 /*  ctx.fillStyle="red"
ctx.font="24px monospace"
ctx.fillText(-10-GAME.speed,300,200);*/


   ctx.fillStyle="rgba(0,0,0,0.5)";
ctx.font="15px thin"
ctx.fillText(GAME.copyright,210,50)

//speed text 
let value=GAME.speed>=1000?"Kilometes":"Metres";
let speedText=`DISTANCE: ${GAME.distance} ${value}`;

ctx.fillStyle="black";
ctx.font="15px thin";
ctx.fillText(speedText,width/2,24)
    }
const controlSpeed=()=>{
        if(GAME.timer%GAME.speedRate==0){
            GAME.speed+=0.25
        //   console.log(GAME.timer%GAME.speedRate)
        }
        //adding distance
                if(GAME.timer%30==0){
            GAME.distance+=1
        }
        
        //calculating time
        if(GAME.timer%60==0){
            storage.timeSpent++;
            localStorage.setItem('db',JSON.stringify(storage));
        }
    }

function drawMenu(){
    if(GAME.pause){
        ctx.fillStyle="rgba(0,0,0,0.5)";
        
const box={
    height:300,
    width:300
}
        ctx.fillRect((width-box.width)/2,(height-box.height)/2,box.width ,box.height);
  ctx.textAlign = 'center'; // Center text horizontally
ctx.textBaseline = 'middle'; // Center text vertically
ctx.font = '18px thin'; // Set font size and style

let color="white"

ctx.fillStyle = color;
// Set text color

ctx.fillText(`Number of Plays: ${storage.plays} times`,width/2,box.height+24)
ctx.fillText(`You played for:  ${calculateTime(storage.time)}`,width/2,box.height+45)


    }
}
function calculateTime() {
  let time = storage.timeSpent;
  let timeString = "";

  if (time < 60) {
    timeString = `${time} second${time === 1 ? '' : 's'}`;
  } else if (time < 3600) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timeString = `${minutes} minute${minutes === 1 ? '' : 's'} ${seconds} second${seconds === 1 ? '' : 's'}`;
  } else if (time < 86400) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    timeString = `${hours} hour${hours === 1 ? '' : 's'} ${minutes} minute${minutes === 1 ? '' : 's'}`;
  } else if (time < 31536000) {
    let days = Math.floor(time / 86400);
    let hours = Math.floor((time % 86400) / 3600);
    timeString = `${days} day${days === 1 ? '' : 's'} ${hours} hour${hours === 1 ? '' : 's'}`;
  } else {
    let years = Math.floor(time / 31536000);
    let days = Math.floor((time % 31536000) / 86400);
    timeString = `${years} year${years === 1 ? '' : 's'} ${days} day${days === 1 ? '' : 's'}`;
  }

  return timeString;
}
draw()


canvas.addEventListener("touchstart",(e)=>{
      const touch=e.touches[0]
  const x=touch.clientX
  const y=touch.clientY
      for(let i=0;i<buttons.length;i++){
            let button=buttons[i];
            if(isTouchInsideBox(x,y,button)){
          // console.log(button.action)
            switch (button.action) {
            case 1:
            GAME.pause=!GAME.pause
                break;
            
            default:
        console.log("invalid action")
        }
            }
        }
        
    })


//Reusable functions
function checkCollision(box1, box2) {
    if (
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y
    ) {
        return true;
    }
    return false;
}

function isTouchInsideBox(x, y,box) {
 return x >= box.x && x <= box.x + box.width &&
 y >= box.y && y <= box.y + box.height;
        }

