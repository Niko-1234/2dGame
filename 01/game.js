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
    this.JumpAnim.FallRight.src  = "img/_FallRight.png"
    this.JumpAnim.FallLeft.src   = "img/_FallLeft.png"
    this.Attack1Anim = {
        Left:  new Image(),
        Right: new Image()
    }
    this.Attack1Anim.Right.src  = "img/_Attack_Right.png"
    this.Attack1Anim.Left.src   = "img/_Attack_Left.png"
    this.Attack2Anim = {
        Left:  new Image(),
        Right: new Image()
    }
    this.Attack2Anim.Right.src  = "img/_Attack2_Right.png"
    this.Attack2Anim.Left.src   = "img/_Attack2_Left.png"

    this.ObjWidth = 40
    this.width = 120
    this.height = 80  
    this.frameX = 0
    this.frameY = 0
    this.CurrImg = this.MovAnim.IdleRight
    this.NextImg = new Image()
    this.bRightMove = true
    this.GracAcc = 2
    this.bIsFalling = true
    this.bHCollision = false
    this.bAttack = false
    this.bNextAttack = false
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
                this.bHCollision = true
                break;
            case "no":
                this.bIsFalling = true
                this.bHCollision = false
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

    SetFrame(Frame){
        switch (Frame) {
            case "first":
                this.frameX = 0
                break;
            case "last":
                this.frameX = (this.GetImgFrames(this.CurrImg) - 1)
                break;
            default:
                break;
        }
    }

    ResetFrames(){
        if(this.bRightMove){
            this.SetFrame("first")
        } else {
            this.SetFrame("last")
        }
    }

    SetCurrentAnimation(){
        var OldImg = this.CurrImg
        if (this.bAttack){
            this.SetAttackAnimation()
        } else {
            this.SetMovemetAnimation()
        }
        if (OldImg != this.CurrImg){
            this.ResetFrames()
        }
    }

    SetAttackAnimation(){
        //In First Frame Set Attack Animation
        if ((this.bRightMove && this.frameX == 0) || (!this.bRightMove && (this.frameX == this.GetImgFrames(this.CurrImg) - 1))){
            if (this.CurrImg == this.Attack1Anim.Right || 
                this.CurrImg == this.Attack1Anim.Left) {
                if (this.bRightMove) this.CurrImg = this.Attack2Anim.Right
                else                 this.CurrImg = this.Attack2Anim.Left
            } else {
                if (this.bRightMove) this.CurrImg = this.Attack1Anim.Right
                else                 this.CurrImg = this.Attack1Anim.Left
            }
        //In Last Frame clear attack Flags
        } else if ((!this.bRightMove && this.frameX == 0) || (this.bRightMove && (this.frameX  == this.GetImgFrames(this.CurrImg) - 1))){
            this.bAttack = false
            if (this.bNextAttack){
                this.bAttack = true
            }
            this.bNextAttack = false
        }
    }
    SetMovemetAnimation(){
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
    }

    OnUpdate() {
        super.OnUpdate()
        if (this.bAttack) this.dx = 0
        else              this.dx = this.HMove.right + this.HMove.left
        this.x = this.x + (this.dx * this.Speed)
        this.y = this.y + (this.dy * this.GracAcc)
        this.LeftRightMovement()
        this.Gravitation()
        this.SetCurrentAnimation()
        this.drawSprite(this.CurrImg, this.width * this.frameX, 0, this.width, this.height, (this.x - (this.width)), (this.y - this.height * 2) , this.width * 2, this.height * 2)
        if(this.bRightMove){
            this.frameX++
            if(this.frameX >= this.GetImgFrames(this.CurrImg)){
                this.SetFrame("first")
            }
        } else {
            this.frameX--
            if(this.frameX < 0){
                this.SetFrame("last")
            }
        }
    }

    Attack() {
        if (this.bAttack){
            this.bNextAttack = true
        } else {
            this.bAttack = true
            this.ResetFrames()
        }
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
                if (this.bHCollision) {
                    this.x++
                    this.bHCollision = false
                }
                break
            case 'MoveLeftStart':
                this.HMove.left = -1
                if (this.bHCollision) {
                    this.x--
                    this.bHCollision = false
                }
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
            case 'Attack':
                super.Attack()
            default:
                break
        }
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
        this.GameWorld.SetPlayerChar(new PlayerPawn(canvas.width/2, canvas.height/2, 5, 'blue', 10))
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