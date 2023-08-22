var acceleration = 0.9
var friction = 0.9


export class Player{
    
   
    constructor(x,y,radius,last_key,pressed){
    this.x = x
    this.y = y
    this.velocity = {
        dx : 0,
        dy : 0
    }
    this.radius = radius
    this.last_key = last_key
    this.pressed = {
        'right' : false,
        'left' : false
    }
}

    draw(c){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,2*Math.PI)
        //c.stroke()
    }

    update(c,player,leftorright,ball){
        this.draw(c)

        //Gravity
        if(this.y>=c.canvas.height-this.radius-this.velocity.dy)
            this.velocity.dy = 0 
        else
            this.velocity.dy+=acceleration
        
        if(this.pressed['up'] && this.y>=c.canvas.height-this.radius-this.velocity.dy)
            this.velocity.dy -=c.canvas.height/48;
            
        //kick the ball
        if(ball.y>this.y && Math.abs(this.x-ball.x)<=this.radius+2*ball.radius && this.pressed['kick']
            && leftorright=='left')
            {
                ball.velocity.dy = 10;
                ball.velocity.dx = 15;}
        if(ball.y>this.y && Math.abs(this.x-ball.x)<=this.radius+2*ball.radius && this.pressed['kick']
        && leftorright=='right')
            {
            ball.velocity.dy = -10;
            ball.velocity.dx = -15;}
        
        if(this.pressed['left'] && this.last_key=='left' && this.x>this.radius){
            if(Math.abs(this.x-player.x)>this.radius*2)
                this.velocity.dx = -4
            else
                this.velocity.dx = 0
            
            if(leftorright == 'left')
                this.velocity.dx = -4
            }
        else if (this.pressed['right'] && this.last_key == 'right' && this.x<c.canvas.width-this.radius)
            {if(Math.abs(this.x-player.x)>this.radius*2)
                this.velocity.dx = 4
            else
                this.velocity.dx = 0

            if(leftorright == 'right')
                this.velocity.dx = 4
        
            }
        else 
            this.velocity.dx = 0
        this.x += this.velocity.dx
        this.y += this.velocity.dy
    }
}

export function randbetween(x,y){
    return Math.random()*(y-x-1)+x
}

export function distance(c1,c2){
    var d = Math.pow(c1.x-c2.x,2) + Math.pow(c1.y-c2.y,2)
    d = Math.sqrt(d)
    return d
}

export function rotate(circle,teta){
    const vx = circle.velocity.dx
    const vy = circle.velocity.dy
    circle.velocity.dx = vx * Math.cos(teta) - vy * Math.sin(teta)
    circle.velocity.dy = vx * Math.sin(teta) + vy * Math.cos(teta)
    
}


export function renew(circle1,circle2,teta){
    rotate(circle1,teta)
    rotate(circle2,teta)
    const v = circle1.velocity.dx
    circle1.velocity.dx = circle2.velocity.dx
    circle2.velocity.dx = v
    rotate(circle1,-teta)
    rotate(circle2,-teta)
}

export function angle(circle1,circle2){
    
    return -Math.atan((circle1.y-circle2.y)/(circle1.x-circle2.x))
}