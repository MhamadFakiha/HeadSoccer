var accelaration = 0.3
var friction = 0.8
import { distance } from "./Player.js"
import { respown } from "./index.js";

let player_score = document.getElementById('player');
let enemy_score = document.getElementById('enemy');
let goal_text = document.getElementById('goal');
let audio = document.getElementById('GoalAudio');
let backaudio = document.getElementById('myAudio');

export class Ball {
    constructor(c) {
        var side = Math.random()
        this.x = c.canvas.width / 2
        this.y = 2 * 20
        this.velocity = {
            dx: side>0.5?-2:2,
            dy: 1
        }
        this.radius = c.canvas.height/25;
        this.collidedWithPlayer = false;
        this.collidedWithEnemy = false;
        this.rotateAngle=0;
        this.goal = false;
        goal_text.style.display = 'none'
    }

    draw(c) {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        this.rotateAngle+=0.1
        //c.fillStyle = 'red'
        //c.fill()
        //c.stroke()
    }

    update(c, player, enemy) {

        //Border of goal
        if(this.x - this.radius < c.canvas.width/10){
            if(Math.floor(this.y+this.radius) < Math.floor(c.canvas.height*(1-1/2.8))+this.radius
            && Math.floor(this.y+this.radius) > Math.floor(c.canvas.height*(1-1/2.8))-this.radius){
                this.velocity.dx*=-1
                this.velocity.dy*=-1
                if(this.velocity.dx< 1 && this.velocity.dy < 1){
                    this.x = this.radius+5;
                    this.y = c.canvas.height/2;
                    this.velocity.dx = 5;
                }
            }
            else if (Math.floor(this.y+this.radius) > Math.floor(c.canvas.height*(1-1/2.8))+this.radius
            && !this.goal){
                setTimeout(respown,3000);
                goal_text.style.display = 'block'
                this.goal = true;
                enemy_score.innerHTML = parseInt(enemy_score.innerHTML) + 1;
                audio.play();
                backaudio.volume=0.3;
            }
        }
        if(this.x + this.radius > c.canvas.width*(1-1/10)){
            if(Math.floor(this.y+this.radius) < Math.floor(c.canvas.height*(1-1/2.8))+this.radius
            && Math.floor(this.y+this.radius) > Math.floor(c.canvas.height*(1-1/2.8))-this.radius){
                this.velocity.dx*=-1
                this.velocity.dy*=-1
                if(this.velocity.dx< 1 && this.velocity.dy < 1){
                    this.x = c.canvas.width - this.radius - 5;
                    this.y = c.canvas.height/2;
                    this.velocity.dx = -5;
                }
            }
            else if (Math.floor(this.y+this.radius) > Math.floor(c.canvas.height*(1-1/2.8))+this.radius
            && !this.goal){
                setTimeout(respown,3000);
                goal_text.style.display = 'block'
                this.goal = true;
                player_score.innerHTML = parseInt(player_score.innerHTML) + 1;
                audio.play();
                backaudio.volume=0.3;
            }
        }

        if (this.x >= c.canvas.width - this.radius - this.velocity.dx || this.x <= this.radius - this.velocity.dx)
            this.velocity.dx *= -1
        if (this.y >= c.canvas.heigth - this.radius - this.velocity.dy || this.y <= this.radius - this.velocity.dy)
            this.velocity.dy *= -1
        if (this.y > c.canvas.height - this.radius - this.velocity.dy)
            this.velocity.dy = -this.velocity.dy * friction
        else
            this.velocity.dy += accelaration

        this.velocity.dx *= 0.995

        if (distance(this, player) < this.radius + player.radius && !this.collidedWithPlayer) {
            const oldX = this.x;
            const oldY = this.y;

            // Update the ball's position based on its velocity
            this.y += this.velocity.dy;
            this.x += this.velocity.dx;

            // Check for collisions with the canvas boundaries
            if (this.x + this.radius >= c.canvas.width || this.x - this.radius <= 0) {
                
                // Reverse the horizontal velocity to prevent passing through the left or right borders
                this.velocity.dx *= -1;
                // Reset the ball's position to the old position
                this.x = oldX;
            }

            if (this.y + this.radius >= c.canvas.height) {
                
                // Ball hits the bottom border
                this.velocity.dy = -this.velocity.dy * friction;
                // Reset the ball's position to the old position
                this.y = oldY;

                // Ensure the ball doesn't overlap with the player
                if (this.x > player.x - player.radius && this.x < player.x + player.radius) {
                    // Adjust the ball's y-coordinate only if the player is moving
                    if (player.velocity.dx !== 0 || player.velocity.dy !== 0) {
                        this.y = c.canvas.height - this.radius - player.radius;
                    }
                }
            }
            // Draw the ball after all collision checks are
            this.y -= this.velocity.dy;
            this.x -= this.velocity.dx;


            const dx = this.x - player.x;
            const dy = this.y - player.y;
            const collisionAngle = Math.atan2(dy, dx);
            const relativeSpeed = Math.sqrt(player.velocity.dx ** 2 + player.velocity.dy ** 2);

            if (player.velocity.dx == 0 && player.velocity.dy == 0) {
                
                // Player is immobile in both directions
                this.velocity.dx *= -1;
                this.velocity.dy *= -1;
                this.velocity.dy *= friction
            } else if (player.velocity.dx == 0) {
               
                // Player is immobile in the horizontal direction
                this.velocity.dx *= -1;
                this.velocity.dy = player.velocity.dy || relativeSpeed;
            } else if (player.velocity.dy == 0) {
                if(diffsigne(this.velocity.dx,player.velocity.dx)
                || Math.abs(this.velocity.dx)<Math.abs(player.velocity.dx)){
                // Player is immobile in the vertical direction
                this.velocity.dx = player.velocity.dx*1.2;
                this.velocity.dy *= -1;}
                else{
                    this.velocity.dx =-this.velocity.dx*1.2;
                }
            } else {

                // Update the ball's velocity based on the player's velocity
                this.velocity.dx = relativeSpeed * Math.cos(collisionAngle)*1.2;
                this.velocity.dy = relativeSpeed * Math.sin(collisionAngle)*1.2;
            }
            this.collidedWithPlayer = true
        }
        else if (distance(this, player) > this.radius + player.radius ){
            this.collidedWithPlayer = false 
            
        }




        if (distance(this, enemy) < this.radius + enemy.radius && !this.collidedWithEnemy) {
            const oldX = this.x;
            const oldY = this.y;

            // Update the ball's position based on its velocity
            this.y += this.velocity.dy;
            this.x += this.velocity.dx;

            // Check for collisions with the canvas boundaries
            if (this.x + this.radius >= c.canvas.width || this.x - this.radius <= 0) {
                
                // Reverse the horizontal velocity to prevent passing through the left or right borders
                this.velocity.dx *= -1;
                // Reset the ball's position to the old position
                this.x = oldX;
            }

            if (this.y + this.radius >= c.canvas.height) {
                
                // Ball hits the bottom border
                this.velocity.dy = -this.velocity.dy * friction;
                // Reset the ball's position to the old position
                this.y = oldY;

                // Ensure the ball doesn't overlap with the enemy
                if (this.x > enemy.x - enemy.radius && this.x < enemy.x + enemy.radius) {
                    // Adjust the ball's y-coordinate only if the enemy is moving
                    if (enemy.velocity.dx !== 0 || enemy.velocity.dy !== 0) {
                        this.y = c.canvas.height - this.radius - enemy.radius;
                    }
                }
            }

            // ... (other code)

            // Draw the ball after all collision checks are
            this.y -= this.velocity.dy;
            this.x -= this.velocity.dx;


            const dx = this.x - enemy.x;
            const dy = this.y - enemy.y;
            const collisionAngle = Math.atan2(dy, dx);
            const relativeSpeed = Math.sqrt(enemy.velocity.dx ** 2 + enemy.velocity.dy ** 2);

            if (enemy.velocity.dx == 0 && enemy.velocity.dy == 0) {
                
                // enemy is immobile in both directions
                this.velocity.dx *= -1;
                this.velocity.dy *= -1;
                this.velocity.dy *= friction
            } else if (enemy.velocity.dx == 0) {
               
                // enemy is immobile in the horizontal direction
                this.velocity.dx *= -1;
                this.velocity.dy = enemy.velocity.dy || relativeSpeed;
            } else if (enemy.velocity.dy == 0) {
                if(diffsigne(this.velocity.dx,enemy.velocity.dx) 
                || Math.abs(this.velocity.dx)<Math.abs(enemy.velocity.dx)){
                    console.log("fet")
                    // enemy is immobile in the vertical direction
                    this.velocity.dx = enemy.velocity.dx*1.2;
                    this.velocity.dy *= -1;}
                    else{
                        this.velocity.dx =-this.velocity.dx*1.2;
                    }
            } else {

                // Update the ball's velocity based on the enemy's velocity
                this.velocity.dx = relativeSpeed * Math.cos(collisionAngle)*1.2;
                this.velocity.dy = relativeSpeed * Math.sin(collisionAngle)*1.2;
            }
            this.collidedWithEnemy = true
        }
        else if (distance(this, enemy) > this.radius + enemy.radius ){
            this.collidedWithEnemy = false 
            
        }

        this.y += this.velocity.dy
        this.x += this.velocity.dx
        this.draw(c)
    }
}

function signe(x) {
    if (x >= 0) return 1
    return -1;
}

function diffsigne(x, y) {
    if (x * y < 0)
        return true
    else
        return false
}
