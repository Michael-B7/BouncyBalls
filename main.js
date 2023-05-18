// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.balls = [];
  this.immune = false;
}

Ball.prototype.draw = function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
  ctx.fill();
}

Ball.prototype.pop = function(index){
  // while(this.size < 100){
  //   this.size ++;
  // }
  balls.splice(index, 1);

  for(let i=0; i<this.balls.length; i++){
    this.balls[i].x = this.x;
    this.balls[i].y = this.y;
    this.balls[i].immune = true;
    balls.push(this.balls[i]);
  }
  // console.log("popped")
}

Ball.prototype.update = function(){
  if((this.x + this.size) >= width){
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function(index) {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        if(balls[j].immune){
          return;
        }
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        if(this.size > balls[j].size){
          this.size += balls[j].size/4;
          this.balls.push(balls[j])
          if(this.size > 50){
            console.log(this.size)
            this.pop(index);
            // console.log("popped")
          }
          balls.splice(j, 1);
          // console.log("removed")
          return;
        }else{
          balls[j].size += this.size/4;
          balls[j].balls.push(this);
          if(balls[j].size > 50){
            console.log(balls[j].size)
            balls[j].pop(j);
            // console.log("popped")
          }
          balls.splice(index, 1);
          // console.log("removed")
          return;
        }        
      }else{
        this.immune = false;
      }
    }
  }
}


let balls = [];

while (balls.length < 50) {
  let size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );

  balls.push(ball);
}

function loop(){
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect(i);
  }

  // setInterval()

  requestAnimationFrame(loop);
}

loop();