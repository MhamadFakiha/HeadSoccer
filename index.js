
import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import { distance,angle,renew,rotate,randbetween } from "./Player.js"

let canvas = document.querySelector('canvas');

let c = canvas.getContext('2d')
let ball;
let player;
let enemy;

function resize_window(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    respown();
    
}
resize_window()
window.addEventListener('resize',resize_window)



export function respown(){
    ball = new Ball(c) 
    player = new Player(canvas.width/10+canvas.height/13,canvas.height*(1-1/10),canvas.height/13,'','')
    enemy = new Player(canvas.width-canvas.width/10-canvas.height/10,canvas.height*(1-1/10),canvas.height/13,'','')
}
respown()
console.log(ball)

const leftkick = new Image();
leftkick.src = 'Media/leftkick.png';
const rightkick = new Image();
rightkick.src = 'Media/rightkick.png';

function playerdokick(){
    c.drawImage(leftkick,player.x+player.radius,player.y,player.radius,player.radius);
}
function enemydokick(){
    c.drawImage(rightkick,enemy.x-enemy.radius,enemy.y,enemy.radius,enemy.radius);
}

let playerkick = false;
let enemykick = false;

window.addEventListener('keydown',(event)=>{
    switch (event.key){
        case 'd':
            player.pressed['right'] = true
            player.last_key = 'right'
            break;
        case 'a':
            player.pressed['left'] = true
            player.last_key = 'left'
            break;
        case 'w':
            player.pressed['up'] = true
            break;
        case 's':
            player.pressed['kick'] = true
            playerkick = true;
            break;
        case 'ArrowRight':
            enemy.pressed['right'] = true
            enemy.last_key = 'right'
            break;
        case 'ArrowLeft':
            enemy.pressed['left'] = true
            enemy.last_key = 'left'
            break;
        case 'ArrowUp':
            enemy.pressed['up'] = true
            break;
        case 'ArrowDown':
            enemy.pressed['kick'] = true
            enemykick = true;
            break;
        default:
            break
    }
})

window.addEventListener('keyup',function(event){
    switch (event.key){
        case 'd':
            player.pressed['right'] = false
            player.last_key = 'left'
            break;
        case 'a':
            player.pressed['left'] = false
            player.last_key = 'right'
            break;
        case 'w':
            player.pressed['up'] = false
            break;
        case 's':
            player.pressed['kick'] = false
            playerkick=false
            break;
        case 'ArrowRight':
            enemy.pressed['right'] = false
            enemy.last_key = 'left'
            break;
        case 'ArrowLeft':
            enemy.pressed['left'] = false
            enemy.last_key = 'right'
            break;
        case 'ArrowUp':
            enemy.pressed['up'] = false
            break;
        case 'ArrowDown':
            enemy.pressed['kick'] = false
            enemykick = false;
            break;
    }
})
let player1 = new Image();
let player2 = new Image();
export function images(){

player1.src = 'Media/'+document.getElementById("player1").innerHTML+'left.png';

player2.src = 'Media/'+document.getElementById("player2").innerHTML+'right.png'

}
const rightgoal = new Image();
rightgoal.src='Media/rightgoal.png'
const leftgoal = new Image();
leftgoal.src='Media/leftgoal.png'
const ball_img = new Image()
ball_img.src = 'Media/ball.png'  
var rotationVelocity = 0

let startTime = null;
let elapsedTime = 0;

let timer = document.getElementById("timer");
let minute = 60
let minuteaddition = false;
let animationId = null;

let end = document.getElementById("end")

export function animate(timestamp){
    animationId = requestAnimationFrame(animate)
    c.clearRect(0,0,window.innerWidth,window.innerHeight)

    if (!startTime) {
        startTime = timestamp;
    }

    if(!ball.goal)
    {
        timer.innerHTML = minute - Math.floor((elapsedTime)/1000);
        elapsedTime = timestamp - startTime;
        minuteaddition=false;
    }
    else if (!minuteaddition){
        minuteaddition = true;
        minute+=3;
    }

    if(parseInt(timer.innerHTML)==0){
        endGame();
        cancelAnimationFrame(animationId);
        animationId = null;
    }


    c.drawImage(player1, player.x - player.radius/1.5, player.y - player.radius,
    player.radius*2,player.radius*2);
    c.drawImage(player2, enemy.x - enemy.radius/1.5, enemy.y - enemy.radius,
    enemy.radius*2,enemy.radius*2);
    player.update(c,enemy,'left',ball)
    enemy.update(c,player,'right',ball)
    ball.update(c,player,enemy)

    if(playerkick)
        playerdokick();
    if(enemykick)
        enemydokick();    
    c.save()
    c.translate(ball.x,ball.y);
    c.rotate(rotationVelocity)
    c.drawImage(ball_img,-ball.radius,-ball.radius,
        ball.radius*2,ball.radius*2)
    c.restore()
    rotationVelocity+=0.03*ball.velocity.dx ;
    
    c.drawImage(rightgoal,canvas.width-canvas.width/10,canvas.height-canvas.height/2.8,
    canvas.width/10,canvas.height/2.8)
    c.drawImage(leftgoal,0,canvas.height-canvas.height/2.8,
    canvas.width/10 ,canvas.height/2.8)

        }
//animate();

const player_score = document.getElementById('player');
const enemy_score = document.getElementById('enemy');
function endGame(){

    var result;
    var player = document.getElementById('player1').innerHTML.toUpperCase();
    var enemy = document.getElementById('player2').innerHTML.toUpperCase()


    var matchResult = {
        player1: player,
        player2 : enemy,
        scores: { player1: parseInt(player_score.innerHTML),
                    player2: parseInt(enemy_score.innerHTML)}
    };

    if(parseInt(player_score.innerHTML) == parseInt(enemy_score.innerHTML)){
        end.innerHTML = "DRAW<br>but Messi<br>won the world<br>Cup";}
    else if(parseInt(player_score.innerHTML) > parseInt(enemy_score.innerHTML)){
        end.innerHTML = "Winner is <br>" + player;
        
    }
    else{
        end.innerHTML = "Winner is <br>" + enemy;}
    // Store match result in localStorage
    var previousResults = JSON.parse(localStorage.getItem('matchResults')) || [];
    previousResults.push(matchResult);
    localStorage.setItem('matchResults', JSON.stringify(previousResults));

    document.getElementById('return').style.display = 'flex';
    document.getElementById('again').style.display = 'flex';
    
}

