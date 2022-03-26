class Actor {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.dx = 0
        this.dy = 0
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    OnUpdate() {
        this.draw()
    }
}

class CollisionBox extends Actor {
    constructor(x, y, width, height, color) {
        super(x, y, 0, color)
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color
    }
}

class Pawn extends Actor {
    constructor(x ,y ,radius, color, speed){
    super(x, y, radius, color)
    this.dx = 0
    this.dy = 0
    this.Speed = speed
    this.MovAnim = {
        IdleRight:  new Image(),
        IdleLeft:   new Image(),
        RunRight:   new Image(),
        RunLeft:    new Image()
    }
    this.MovAnim.IdleRight.src  = "img/_IdleRight.png"
    this.MovAnim.IdleLeft.src   = "img/_IdleLeft.png"
    this.MovAnim.RunRight.src   = "img/_RunRight.png"
    this.MovAnim.RunLeft.src    = "img/_RunLeft.png"
    this.JumpAnim = {
        JumpStart:  new Image(),
        FallRight:  new Image(),
        FallLeft:   new Image(),
        JumpEnd:    new Image()
    }
    this.JumpAnim.FallRight.src  = "img/_FallRight.png"
    this.JumpAnim.FallLeft.src   = "img/_FallLeft.png"
    this.Attack1Anim = {
        Left:  new Image(),
        Right:  new Image()
    }
    this.JumpAnim.FallRight.src  = "img/_FallRight.png"
    this.JumpAnim.FallLeft.src   = "img/_FallLeft.png"

    this.ObjWidth = 40
    this.width = 120
    this.height = 80  
    this.frameX = 0
    this.frameY = 0
    this.CurrImg = this.MovAnim.IdleRight
    this.bRightMove = true
    this.GracAcc = 2
    this.bIsFalling = true
    }

    Collision(side){
        switch (side) {
            case "down":
                this.bIsFalling = false
                this.dy = 0
                break;
            case "top":
                this.dy = 0
                break;
            case "left":
            case "right":
                this.dx = 0
                break;
            case "no":
                this.bIsFalling = true
            default:
                break;
        }
    }

    drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
        ctx.drawImage(img , sX, sY, sW, sH, dX, dY, dW, dH)
    }

    GetImgFrames(img){
        var frmes = img.width/this.width
        return frmes
    }

    LeftRightMovement(){
        if (this.dx > 0){
            this.bRightMove = true
        } else if (this.dx < 0){
            this.bRightMove = false
        }
    }
    
    Gravitation(){
        var lastdy = this.dy
        if(this.bIsFalling){
            this.dy++
            this.bIsFalling = true
        } else {
            this.dy = 0
            if(lastdy < 0){
                this.bIsFalling = true
            } else {
                this.bIsFalling = false
            }
        }
    }

    SetCurrentAnimation(){
        var OldImg = this.CurrImg
        if (this.dx == 0 && this.dy == 0 && !this.bIsFalling){
            if (this.bRightMove) {
                this.CurrImg = this.MovAnim.IdleRight
            } else {
                this.CurrImg = this.MovAnim.IdleLeft
            }
        } else if (this.bIsFalling){
            if (this.bRightMove) {
                this.CurrImg = this.JumpAnim.FallRight
            } else {
                this.CurrImg = this.JumpAnim.FallLeft
            }
        } else {
            if (this.bRightMove) {
                this.CurrImg = this.MovAnim.RunRight
            } else {
                this.CurrImg = this.MovAnim.RunLeft
            }
        }
        if (OldImg != this.CurrImg){
            this.frameX = 0
        }
    }

    OnUpdate() {
        super.OnUpdate()
        // ctx.drawImage(this.PawnImage, 0 ,0 , this.width, this.height)
        this.x = this.x + (this.dx * this.Speed)
        this.y = this.y + (this.dy * this.GracAcc)
        this.LeftRightMovement()
        this.Gravitation()
        this.SetCurrentAnimation()
        if(this.bRightMove){
            this.frameX++
            if(this.frameX >= this.GetImgFrames(this.CurrImg)){
                this.frameX = 0
            }
        } else {
            if(this.frameX <= 0){
                this.frameX = (this.GetImgFrames(this.CurrImg) - 1)
            }
            this.frameX--
        }
        this.drawSprite(this.CurrImg, this.width * this.frameX, 0, this.width, this.height, (this.x - (this.width*2)/2), (this.y - this.height * 2) , this.width * 2, this.height * 2)
    }
}

class PlayerPawn extends Pawn{
    constructor(x ,y ,radius, color, speed){
        super(x ,y ,radius, color, speed)
        this.HMove = {
            left: 0,
            right: 0
        }
        this.VMove = {
            up: 0,
            down: 0
        }
    }

    Input(InputEventValue) {
        switch (InputEventValue) {
            case 'MoveRightStart':
                this.HMove.right = 1
                break
            case 'MoveLeftStart':
                this.HMove.left = -1
                break
            case 'MoveRightEnd':
                this.HMove.right = 0
                break
            case 'MoveLeftEnd':
                this.HMove.left = 0
                break
            case 'JumpStart':
                if (!this.bIsFalling){
                    this.y--
                    this.dy = -10
                    this.frameX = 0
                    this.bIsFalling = true
                }
                break
            default:
                break
        }
        this.dx = this.HMove.right + this.HMove.left
    }
}

class Game {
    constructor (){
        this.GameWorld
    }

    SpawnActor(actor) {
        this.GameWorld.AddActor(actor)
    }

    SpawnPawn(actor) {
        this.GameWorld.AddPawn(actor)
    }

    SpawnColisionArea(actor) {
        this.GameWorld.AddColisionBox(actor)
    }

    Initialize(world) {
        this.GameWorld = world
    }
    
    BeginPlay() {
        this.GameWorld.SetPlayerChar(new PlayerPawn(canvas.width/2, canvas.height/2, 5 , 'blue', 10))
        this.SpawnPawn(this.GameWorld.GetPlayerChar())
        //floor
        this.SpawnColisionArea(new CollisionBox(0,(canvas.height - 200),canvas.width,100,'red'))
        //platform
        this.SpawnColisionArea(new CollisionBox(880,(canvas.height - 260),400,50,'red'))
    }

    PlayerInput(InputEvent){
        this.GameWorld.GetPlayerChar().Input(InputEvent)
    }

}