//Base Actor of the game
class Actor {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.dx = 0
        this.dy = 0
    }

    //Actor screen pointer for DEBUG
    draw() {
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()
    }

    OnUpdate() {
        this.draw()
    }
}

//Collision Area witch Pawns cant go thru
class CollisionBox extends Actor {
    constructor(x, y, width, height, color, src) {
        super(x, y, 0, color)
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
        this.BoxTexture = new Image()
        this.BoxTexture.src = src
    }

    //Draw colision area for debug
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width,this.height)
    }

    drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
        ctx.drawImage(img , sX, sY, sW, sH, dX, dY, dW, dH)
    }

    OnUpdate(){
        super.OnUpdate()
        this.drawSprite(this.BoxTexture, 0 ,0, this.width, this.height, this.x, this.y, this.width, this.height)
        // this.draw() //used For debug
    }
}

//Widged joinet to pawn
class HealthBar {
    constructor (x, y, color) {
        this.x
        this.y
        this.Ox = x //x offset
        this.Oy = y //y offset
        this.width = 100
        this.height = 5
        this.MaxWidth = this.width
        this.MaxHeight = this.height
        this.color = color
        this.border = 2
    }

    OnUpdate(){
        ctx.fillStyle = 'rgb(20,20,20)'
        ctx.fillRect(this.x - this.Ox - this.border, this.y - this.Oy - this.border, this.MaxWidth + this.border*2, this.MaxHeight + this.border*2)
        ctx.fillStyle = this.color
        ctx.fillRect(this.x - this.Ox, this.y - this.Oy, this.width, this.height)
    }
}

class ParticleEffect {
    constructor () {
        this.x = 0
        this.y = 0
        this.bloodImg1 = {
            L: new Image(),
            R: new Image()
        }
        this.bloodImg2 = {
            L: new Image(),
            R: new Image()
        }
        this.Images = [this.bloodImg1, this.bloodImg2]
        this.Images[0].R.src = "img/blood/blood_1_R.png"
        this.Images[0].L.src = "img/blood/blood_1_L.png"
        this.Images[1].R.src = "img/blood/blood_2_R.png"
        this.Images[1].L.src = "img/blood/blood_2_L.png"
        this.h = 128 
        this.w = 128
        this.Frame = 0
        this.MaxFrames = 4
        this.AnimSlowCount = 0
        this.AnimationSlow = 3
        this.bRight = false
        this.CurrAnim = this.Images[0].R
        this.bPlay = false
        this.XOff = this.x - this.w/4
    }

    drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
        ctx.drawImage(img , sX, sY, sW, sH, dX, dY, dW, dH)
    }

    PlayEffect(bR) {
        this.bRight = bR
        if (bR) this.Frame = 0
        else    this.Frame = this.MaxFrames
        this.bPlay = true
        this.SetParticleOffset()
        this.SelectProperImg()
    }

    SetParticleOffset(){
        if (this.bRight){
            this.XOff = this.x - this.w * 0.2
        } else {
            this.XOff = this.x - this.w * 0.9
        }
    }

    SelectProperImg(){
        //Draw Effect
        var Rand = Math.ceil(Math.random() * this.Images.length) - 1
        console.log(Rand)
        if (this.bRight) this.CurrAnim = this.Images[Rand].R
        else             this.CurrAnim = this.Images[Rand].L
    }

    OnUpdate(){
        if (this.bPlay){
            this.drawSprite(this.CurrAnim, this.w * this.Frame, 0, this.w, this.h, this.XOff , this.y - this.h, this.w, this.h)
            this.AnimSlowCount++
            if (this.AnimSlowCount >= this.AnimationSlow){
                this.AnimSlowCount = 0
                if (this.bRight) this.Frame++
                else             this.Frame--
                    
            }
            if (this.bRight){
                if (this.Frame >= this.MaxFrames){
                    this.Frame = 0
                    this.bPlay = false
                }
            } else {
                if (this.Frame <= 0){
                    this.Frame = this.MaxFrames
                    this.bPlay = false
                }
            }
        }
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

    this.BloodSplash = new ParticleEffect()
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
        } else if (this.bAttack){
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
            this.GameWorld.PlayerPoints += 10
            this.GameWorld.DeleteActor(this)
        } else if (this.GetFrame() == 1 && this instanceof PlayerPawn) {
            window.location.reload();
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
            Pawn.TakeDamage(this.DamageCause, this.bRightMove)
        });
    }

    TakeDamage(DamageValue, bSide){
        if (this.Health > 0){
            this.Health = Math.max(this.Health - DamageValue, 0)
            this.BloodSplash.PlayEffect(bSide)
            console.log("PawnHealth: ", this.Health)
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
        this.FrameHandle()

        // HP Update
        if (this.PawnHealth){
        this.PawnHealth.x = this.x
        this.PawnHealth.y = this.y
        this.PawnHealth.width = this.Health/this.MaxHealth*100
        this.PawnHealth.OnUpdate()
        }
        // Blood Splash Update
        this.BloodSplash.x = this.x
        this.BloodSplash.y = this.y
        this.BloodSplash.OnUpdate()
    }

    FrameHandle(){
        this.SlowCounter++
        //Anim Frame increase
        if (!(this.GetFrame() == 1 && this.Health <= 0)) //if pawn is death dont increase frames
        {
            if (this.SlowCounter >= this.AnimSlow){ //incrase frames
                this.SlowCounter = 0
                if (this.bRightMove) {this.frameX++}
                else                 {this.frameX--}
            }
            //Loop Animation
            if (this.GetFrame() == 2){
                this.ResetFrames()
            }
        }   
    }

    Attack() {
        if (this.Health <= 0) return
        if (this.bAttack){
            this.bNextAttack = true
        } else {
            this.bAttack = true
            this.ResetFrames()
        }
    }

    Jump() {
        if (this.Health <= 0) return
        if (!this.bIsFalling){
            this.y--
            this.dy = -12
            this.frameX = 0
            this.bIsFalling = true
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
                this.Jump()
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

        this.HPBarColor = "rgb(100, 195, 50)"
        this.PawnHealth = new HealthBar(50, 110, this.HPBarColor)
    }
}

class EnemyPawn extends Pawn{
    constructor(x ,y ,radius, color, speed, World, Range, ID){
        super(x ,y ,radius, color, speed, World)
        this.GameWorld = World
        this.PlayerChar = this.GameWorld.GetPlayerChar()
        this.id = ID

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
        this.DamageCause = 20
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
                this.MoveTo(this.PlayerChar.x, this.AttackRange - 5) //Move to player
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

    TryDealDamage(){
        let StartPoint = {x: this.x, y: this.y}
        if(this.bRightMove) StartPoint.x += this.AttackRange/2
        else                StartPoint.x -= this.AttackRange/2
        if (this.PlayerChar.x <= StartPoint.x + this.AttackRange/2 && this.PlayerChar.x >= StartPoint.x - this.AttackRange/2 &&
            this.PlayerChar.y <= StartPoint.y + this.AttackRange/2 && this.PlayerChar.y >= StartPoint.y - this.AttackRange/2)
            this.PlayerChar.TakeDamage(this.DamageCause, this.bRightMove)
    }

    OnUpdate(){
        super.OnUpdate()
        this.AIControll()
    }
}

class Widget {
    constructor() {
        
    }
    OnUpdate(points){
        var text = points
        ctx.font = "30px Arial";
        ctx.fillStyle = 'white'
        ctx.fillText("score: " + text, 10, 50); 
    }
}

class Game {
    constructor (){
        this.GameWorld
        this.GameFPS = 0
        this.Unit = 0
        this.EnemyCounter = 0
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

    Initialize(world, fps) {
        this.GameWorld = world
        this.GameFPS = fps
        this.FPSCounter = 0
        this.SecCounter = 0
        this.PointsText = new Widget()
        this.Unit = 128
    }
    
    BeginPlay() {
        //SPAWN WORLD STATIC MESHES
        //floor1,2,3
        const FloorHeight = this.Unit
        const TowerHeight = this.Unit*4
        const Platformtexture = "img/platform/platform.png"
        this.SpawnColisionArea(new CollisionBox(0,(canvas.height - FloorHeight),canvas.width,FloorHeight,'blue',Platformtexture))
        this.SpawnColisionArea(new CollisionBox(-canvas.width,(canvas.height - FloorHeight),canvas.width,FloorHeight,'blue',Platformtexture))
        this.SpawnColisionArea(new CollisionBox(canvas.width,(canvas.height - FloorHeight),canvas.width,FloorHeight,'blue',Platformtexture))

        //left tower
        this.SpawnColisionArea(new CollisionBox(-canvas.width*1.5,(canvas.height - TowerHeight),this.Unit*6.5,TowerHeight,'blue',Platformtexture))
        //right tower
        this.SpawnColisionArea(new CollisionBox(canvas.width*2,(canvas.height - TowerHeight),this.Unit*6.5,TowerHeight,'blue',Platformtexture))

        const PlatformWidth = this.Unit*4
        const PlatformHeight = this.Unit*0.25
        //left platform
        this.SpawnColisionArea(new CollisionBox(-canvas.width + this.Unit*1.5,(canvas.height - this.Unit*2),PlatformWidth,PlatformHeight,'blue',Platformtexture))
        //middle platforms
        this.SpawnColisionArea(new CollisionBox(0,(canvas.height - this.Unit*2),PlatformWidth,PlatformHeight,'blue',Platformtexture))
        this.SpawnColisionArea(new CollisionBox(this.Unit*4,(canvas.height - this.Unit*3),PlatformWidth*1.5,PlatformHeight,'blue',Platformtexture))
        //right platform
        this.SpawnColisionArea(new CollisionBox(canvas.width + this.Unit*4,(canvas.height - this.Unit*2),PlatformWidth*1.5,PlatformHeight,'blue',Platformtexture))

        //boxes
        const Boxtexture = "img/platform/box.png"
        const BoxWidth = this.Unit
        const BoxHeight = this.Unit
        this.SpawnColisionArea(new CollisionBox(canvas.width + this.Unit*1,(canvas.height - this.Unit*2),BoxWidth,BoxHeight,'blue',Boxtexture))

        //SPAWN PLAYER 
        this.GameWorld.SetPlayerChar(new PlayerPawn(canvas.width/2, canvas.height - this.Unit, 5, 'red', 10, this.GameWorld))
        this.SpawnPawn(this.GameWorld.GetPlayerChar())
    }

    //Game Tick event
    OnUpdate(){
        this.FPSCounter++
        if(this.FPSCounter == this.GameFPS){
            this.FPSCounter = 0
            this.SecCounter++
        }

        if (this.SecCounter == 5){
            this.SpawnEnemyRandom()
        }
        this.PointsText.OnUpdate(this.GameWorld.PlayerPoints)
    }

    //Spawn Enemy in random side off the screen
    SpawnEnemyRandom(){
        this.EnemyCounter++
        this.SecCounter = 0
        var Side = Math.random() - 0.5
        var SpawnX = 300
        var SpawnRScreen = canvas.width + SpawnX
        var SpawnLScreen = -SpawnX
        var RightEndMap = this.GameWorld.GlobalXOrigin + canvas.width*2
        var LeftEndMap = this.GameWorld.GlobalXOrigin - canvas.width*1.5 + this.Unit*7
        if (Side < 0)  {
            if (SpawnLScreen < LeftEndMap) {Side *= -1}
        } else {
            if (SpawnRScreen > RightEndMap) {Side *= -1}
        }
        if (Side < 0){
            this.SpawnPawn(new EnemyPawn(SpawnLScreen, canvas.height/3, 5, 'green', 10, this.GameWorld, 60 + Math.random()*30,this.EnemyCounter))
        }else{
            this.SpawnPawn(new EnemyPawn(SpawnRScreen, canvas.height/3, 5, 'green', 10, this.GameWorld, 60 + Math.random()*30,this.EnemyCounter))
        }
    }

    //Move input from Engine to PlayerChar
    PlayerInput(InputEvent){
        this.GameWorld.GetPlayerChar().Input(InputEvent)
    }

}