let canvas = document.getElementById('canvas-top');
let button = document.getElementById('button');
let button_q = document.getElementById('button_q');
let button_r = document.getElementById('button_r');
let heading = document.getElementById('heading');
let gif = document.getElementById('gif');
let score_text = document.getElementById('score');
let highest_text = document.getElementById('highest');
let level = document.getElementById('hardness');
let form = document.getElementById('level');

const c = canvas.getContext('2d');

let shoot = 0;
let game_quit = 0;
let score = 0;
let ext = 0;


canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: 200,
  y: canvas.height - 200,
  check: 0,
  checked: 0

};

const mouse_down = {
x: 200,
y: canvas.height - 200,
};

addEventListener('mouseup', event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  if(!mouse.checked) {
    mouse.check = 1;
  }
});

addEventListener('mousemove', event => {
  mouse_down.x = event.clientX;
  mouse_down.y = event.clientY;
});

addEventListener('mousedown', ()=> {
shoot = 1;
})

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

class Shell {
  constructor(x, y, radius, colour) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.colour = colour;
      this.x_vel = 0;
      this.y_vel = 0;
      this.gravity = 0;
      this.x_fut_vel = 0;
      this.y_fut_vel = 0;
      this.fut_gravity = 0;

      this.update = () => {
          if(mouse.check){
              this.x_vel = -(mouse.x - x)*0.1;
              this.y_vel = -(y - mouse.y)*0.1;
              this.gravity = 0.1;
              mouse.check = 0;
              mouse.checked = 1;
          }

          this.x += this.x_vel;
          this.y -= this.y_vel;
          this.y_vel -=this.gravity;
          if(this.x + this.radius >= canvas.width || this.y + this.radius >= canvas.height){
              init();
          }
          this.draw();
      };

      this.draw = () => {
          c.beginPath();
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          c.fillStyle = this.colour;
          c.fill();
          c.closePath();

          if(!mouse.checked && shoot){
              c.setLineDash([20,10]);
              c.beginPath();
              c.moveTo(this.x, this.y);
              c.lineTo(mouse_down.x, mouse_down.y);
              c.stroke();
              c.closePath();

              this.x_fut_vel = -(mouse_down.x - x)*0.1;
              this.y_fut_vel = -(y - mouse_down.y)*0.1;
              this.fut_gravity = 0.1
              c.beginPath();
              c.moveTo(this.x, this.y);
              c.quadraticCurveTo(this.x + (this.x_fut_vel * this.y_fut_vel)/this.fut_gravity , this.y - (this.y_fut_vel * this.y_fut_vel)/this.fut_gravity , this.x + 2 * (this.x_fut_vel * this.y_fut_vel)/this.fut_gravity , this.y);
              c.stroke();
              c.closePath();
          }
      };
  };
}




class Target {
  constructor(x, y, radius, colour, y_vel) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.y_vel = y_vel;
    this.radians = 0;


    this.update = () => {
      this.radians += this.y_vel;
      this.y = y + Math.cos(this.radians * 0.035) * 350;
      this.draw();
    }

    this.draw = () => {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.colour;
      c.fill();
      c.closePath();
    };
  };
}

let shell;
let target;
function init() {
  shell = new Shell(200, canvas.height - 200, 10, 'blue');
  target = new Target(canvas.width - 50, canvas.height / 2, 30, 'red', 1, 1.6);
  mouse.checked = 0;
 shoot = 0;
}

function start() {
  game_quit = 0;
  button.style.display = 'none';
  button_r.style.display = 'none';
  heading.style.display = 'none';
  form.style.display = 'none';
  canvas.style.display = 'block';
  button_q.style.display = 'block';
  gif.style.display = 'none';
  if(level.value == 'easy') {
    ext = 50;
  } else if(level.value == 'medium') {
    ext = 25;
  } else {
    ext = 0;
  }
  init();
  animate();
}

function reset() {
  let answer = confirm('want reset?');
  if(answer) {
    localStorage.setItem('score', 0);
    alert('game reset');
  }
}


function stop() {
  game_quit = 1;
  button.style.display = 'block';
  button_r.style.display = 'block';
  heading.style.display = 'block';
  form.style.display = 'block';
  canvas.style.display = 'none';
  button_q.style.display = 'none';
  gif.style.display = 'block';
  score_text.textContent = ``;
  highest_text.textContent = ``;
  score = 0;
}

function checkCollision() {
  let distance = Math.sqrt(Math.pow(shell.x - target.x, 2) + Math.pow(shell.y - target.y, 2));
 if(distance <= shell.radius + target.radius + ext) {
   let audio = new Audio();
   audio.src = 'https://raw.githubusercontent.com/ZeroOctave/ZeroOctave-Javascript-Projects/main/assets/Audio/shell_game/collide.wav';
   audio.play();
   init();
   score++;
   if(score>localStorage.getItem('score')) {
     localStorage.setItem('score', score);
   }
 }
}

function animate() {
  if(game_quit) {
    return;
  }

  requestAnimationFrame(animate);
  checkCollision();
  c.clearRect(0, 0, canvas.width, canvas.height );
  shell.update();
  target.update();
  score_text.textContent = `score: ${score}`;
  highest_text.textContent = `highest score: ${localStorage.getItem('score')}`;
}