class Actor {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.dx = 0
        this.dy = 0
    }

    //Actor screen pointer TO DELETE
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
    constructor(x ,y ,radius, color, speed, World){
    super(x, y, radius, color)
    this.GameWorld = World
    this.dx = 0
    this.dy = 0
    this.HMove = {
        left: 0,
        right: 0
    }
    this.VMove = {
        up: 0,
        down: 0
    }
    this.Speed = speed
    this.MovAnim = {
        IdleRight:  new Image(),
        IdleLeft:   new Image(),
        RunRight:   new Image(),
        RunLeft:    new Image()
    }
    this.MovAnim.IdleRight.src  = "img/Knight/_IdleRight.png"
    this.MovAnim.IdleLeft.src   = "img/Knight/_IdleLeft.png"
    this.MovAnim.RunRight.src   = "img/Knight/_RunRight.png"
    this.MovAnim.RunLeft.src    = "img/Knight/_RunLeft.png"
    this.JumpAnim = {
        JumpStart:  new Image(),
        FallRight:  new Image(),
        FallLeft:   new Image(),
        JumpEnd:    new Image()
    }
    this.JumpAnim.FallRight.src  = "img/Knight/_FallRight.png"
    this.JumpAnim.FallLeft.src   = "img/Knight/_FallLeft.png"
    this.JumpAnim.FallRight.src  = "img/Knight/_FallRight.png"
    this.JumpAnim.FallLeft.src   = "img/Knight/_FallLeft.png"
    this.Attack1Anim = {
        Left:  new Image(),
        Right: new Image()
    }
    this.Attack1Anim.Right.src  = "img/Knight/_Attack_Right.png"
    this.Attack1Anim.Left.src   = "img/Knight/_Attack_Left.png"
    this.Attack2Anim = {
        Left:  new Image(),
        Right: new Image()
    }
    this.Attack2Anim.Right.src  = "img/Knight/_Attack2_Right.png"
    this.Attack2Anim.Left.src   = "img/Knight/_Attack2_Left.png"

    this.DeathAnim = {
        Left:  new Image(),
        Right: new Image()
    }
    this.DeathAnim.Right.src  = "img/Knight/_Death_Right.png"
    this.DeathAnim.Left.src   = "img/Knight/_Death_Left.png"

    this.ObjWidth = 40
    this.width = 120
    this.height = 80  
    this.frameX = 0
    this.frameY = 0
    this.CurrImg = this.MovAnim.IdleRight
    this.bRightMove = true
    this.GracAcc = 2
    this.bIsFalling = true
    this.bHCollision = false
    this.bAttack = false
    this.bNextAttack = false
    this.AnimSlow = 2
    this.SlowCounter = 0
    this.AttackRange = 0
    this.MaxHealth = 100
    this.Health = this.MaxHealth
    this.DamageCause = 50
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
        this.SlowCounter = 0
    }

    GetFrame(){
        //0 -> first frame
        //1 -> last frame
        //2 -> greather than last
        //3 -> middle frame
        if (this.SlowCounter <= 0){
            if ( this.bRightMove &&  this.frameX == 0) {return 0}
            if (!this.bRightMove && (this.frameX == this.GetImgFrames(this.CurrImg) - 1)) {return 0}
            if (this.frameX == Math.ceil(this.GetImgFrames(this.CurrImg)/2)) {return 3}
        } 
        if (this.SlowCounter >= (this.AnimSlow - 1)){ 
            if (!this.bRightMove && this.frameX == 0) {return 1}
            if ( this.bRightMove  && (this.frameX == this.GetImgFrames(this.CurrImg) - 1)) {return 1}
        }
        if (!this.bRightMove && (this.frameX < 0)) {return 2}
        if ( this.bRightMove && (this.frameX > this.GetImgFrames(this.CurrImg) - 1)) {return 2}
        return -1
    }

    SetCurrentAnimation(){
        var OldImg = this.CurrImg
        if (this.Health <= 0){
            this.SetDieAnimation()
        } 
        else if (this.bAttack){
            this.SetAttackAnimation()
        } else {
            this.SetMovemetAnimation()
        }
        if (OldImg != this.CurrImg){
            this.ResetFrames()
        }
    }

    SetDieAnimation(){
        if (this.bRightMove) this.CurrImg = this.DeathAnim.Right
        else                 this.CurrImg = this.DeathAnim.Left
        if (this.GetFrame() == 1 && this instanceof EnemyPawn){
            console.log("Delete it")
            this.GameWorld.DeleteActor(this)
        }
    }

    SetAttackAnimation(){
        //In First Frame Set Attack Animation
        var AnimFrame = this.GetFrame()
        if (AnimFrame == 0){
            if (this.CurrImg == this.Attack1Anim.Right || 
                this.CurrImg == this.Attack1Anim.Left) {
                if (this.bRightMove) this.CurrImg = this.Attack2Anim.Right
                else                 this.CurrImg = this.Attack2Anim.Left
            } else {
                if (this.bRightMove) this.CurrImg = this.Attack1Anim.Right
                else                 this.CurrImg = this.Attack1Anim.Left
            }
        //In Last Frame clear attack Flags
        } else if (AnimFrame == 1){
            this.bAttack = false
            if (this.bNextAttack){
                this.bAttack = true
            }
            this.bNextAttack = false
        } else if (AnimFrame == 3) {
            this.TryDealDamage()
        }
    }

    TryDealDamage(){
        let StartPoint = {x: this.x, y: this.y}
        if(this.bRightMove) StartPoint.x += this.AttackRange/2
        else                StartPoint.x -= this.AttackRange/2
        var AffectedPawns = []
        AffectedPawns = this.GameWorld.OverlapActors(StartPoint, this.AttackRange/2, this)
        AffectedPawns.forEach(Pawn => {
            Pawn.TakeDamage(this.DamageCause)
        });
    }

    TakeDamage(DamageValue){
        this.Health = Math.max(this.Health - DamageValue, 0)
        console.log("PawnHealth: ", this.Health)
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

        if (this.bAttack     || 
            this.bHCollision ||
            this.Health <= 0) 
            this.dx = 0
        else 
            this.dx = this.HMove.right + this.HMove.left

        this.x = this.x + (this.dx * this.Speed)
        this.y = this.y + (this.dy * this.GracAcc)
        this.LeftRightMovement()
        this.Gravitation()
        this.SetCurrentAnimation()
        this.drawSprite(this.CurrImg, this.width * this.frameX, 0, this.width, this.height, (this.x - (this.width)), (this.y - this.height * 2) , this.width * 2, this.height * 2)
        this.SlowCounter++
        //Anim Frame increase
        if (this.GetFrame() == 1 && this.Health <= 0) //if pawn is death dont increase frames
        {
            //dont increase
        } else if (this.SlowCounter >= this.AnimSlow){ //incrase frames
            this.SlowCounter = 0
            if (this.bRightMove) {this.frameX++}
            else                 {this.frameX--}
        }

        //Loop Animation
        if (this.GetFrame() == 2){
            this.ResetFrames()
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
                this.Attack()
            default:
                break
        }
    }
}

class PlayerPawn extends Pawn{
    constructor(x ,y ,radius, color, speed, World){
        super(x ,y ,radius, color, speed, World)
        this.AttackRange = 100
    }
}

class EnemyPawn extends Pawn{
    constructor(x ,y ,radius, color, speed, World, Range){
        super(x ,y ,radius, color, speed, World)
        this.GameWorld = World
        this.PlayerChar = this.GameWorld.GetPlayerChar()

        this.MovAnim.IdleRight.src  = "img/Skelet/Skelet_Idle_R.png"
        this.MovAnim.IdleLeft.src   = "img/Skelet/Skelet_Idle_L.png"
        this.MovAnim.RunRight.src   = "img/Skelet/Skelet_Run_R.png"
        this.MovAnim.RunLeft.src    = "img/Skelet/Skelet_Run_L.png"

        this.JumpAnim.FallRight.src  = "img/Skelet/Skelet_Idle_R.png"
        this.JumpAnim.FallLeft.src   = "img/Skelet/Skelet_Idle_L.png"

        this.Attack1Anim.Right.src  = "img/Skelet/Skelet_Attack1_R.png"
        this.Attack1Anim.Left.src   = "img/Skelet/Skelet_Attack1_L.png"

        this.Attack2Anim.Right.src  = "img/Skelet/Skelet_Attack2_R.png"
        this.Attack2Anim.Left.src   = "img/Skelet/Skelet_Attack2_L.png"

        this.DeathAnim.Right.src  = "img/Skelet/Skelet_Die_R.png"
        this.DeathAnim.Left.src   = "img/Skelet/Skelet_Die_L.png"

        this.width = 80
        this.height = 60 
        this.AgresionRange = 250
        this.AttackRange = Range
        this.MoveRange = 0  
        this.MoveWay = 0  
        this.AnimSlow = 3
    }

    MoveTo(X, Range) {
        // X     - move to point
        // Range - acceptable range
        if (Math.abs(X - this.x) > Range){
            if (X - this.x > 0) {
                this.Input("MoveLeftEnd")
                this.Input("MoveRightStart")
            } else {
                this.Input("MoveRightEnd")
                this.Input("MoveLeftStart")
            }
        } else {
            this.Input("MoveLeftEnd")
            this.Input("MoveRightEnd")
        }
    }

    VectorLength(Sx, Sy, Ex ,Ey){
        var Length = 0
        Length = Math.sqrt(Math.pow(Ex - Sx, 2) + Math.pow(Ey - Sy, 2))
        return Length
    }

    AIControll(){ //Simple AI control
        var DistanceToPlayer = this.VectorLength(this.PlayerChar.x, this.PlayerChar.y, this.x, this.y)
        if (DistanceToPlayer <= this.AgresionRange)//If Player is close
        {
            if (DistanceToPlayer < this.AttackRange){//If player is in attack range
                this.Input("MoveLeftEnd")
                this.Input("MoveRightEnd")
                if (Math.random() > 0.95) this.Attack()
            } else {
                this.MoveTo(this.PlayerChar.x, this.AttackRange) //Move to player
            }
        } 
        else
        {
            if (this.MoveRange <= 0){ //Find Random Point
                this.MoveRange = Math.random() * 200
                this.MoveWay = this.MoveRange * (Math.random() - 0.5)
            }
            if (Math.abs(this.MoveWay) < 40){ //Random Wait or go 
                this.MoveTo(this.x, 10) //Wait
            } else {
                this.MoveTo(this.x + this.MoveWay, 0) //Move to Random
            }
            this.MoveRange -= this.Speed // Distanecte and Time substitute
        }
    }
    OnUpdate(){
        super.OnUpdate()
        this.AIControll()
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
        this.GameWorld.SetPlayerChar(new PlayerPawn(canvas.width/2, canvas.height/2, 5, 'blue', 10, this.GameWorld))
        this.SpawnPawn(this.GameWorld.GetPlayerChar())
        this.SpawnPawn(new EnemyPawn(canvas.width/3, canvas.height/3, 5, 'green', 10, this.GameWorld, 80))
        //platform
        this.SpawnColisionArea(new CollisionBox(880,(canvas.height - 260),400,50,'red'))
        //box
        this.SpawnColisionArea(new CollisionBox(0,(canvas.height - 260),100,100,'red'))
        //floor
        this.SpawnColisionArea(new CollisionBox(0,(canvas.height - 200),canvas.width,100,'red'))
    }

    PlayerInput(InputEvent){
        this.GameWorld.GetPlayerChar().Input(InputEvent)
    }

}