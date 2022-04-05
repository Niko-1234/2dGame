class Engine{
    constructor(Game, World, Controller, fps) {
        this.GameLogic = Game
        this.GameWorld = World
        this.GameController = Controller
        this.GameFPS = fps
        this.FPSInterval = 1000/this.GameFPS
        this.Then = Date.now()
        this.Now = Date.now()
        this.StartTime = this.Then
        this.Elapsed = Date.now()
        this.ColsisionMap = new Image()
        this.ColsisionMap.src = "img/red.png"
    }

    CheckCollisions(Pawns, ColisionBoxes) {
        Pawns.forEach(pawn => {
            var PawnCollisions = 0
            ColisionBoxes.forEach(box => {
                if ((pawn.x + pawn.ObjWidth/2) >=   box.x                && 
                    (pawn.x - pawn.ObjWidth/2) <=  (box.x + box.width)   && 
                     pawn.y                    >=  box.y                && 
                    (pawn.y - pawn.height)     <  (box.y + box.height)){
                    var TopDiff = Math.abs(pawn.y - box.y)
                    var BottomDiff = Math.abs((pawn.y - pawn.height) - (box.y + box.height))
                    var LeftDiff = Math.abs((pawn.x + pawn.ObjWidth/2) - box.x)
                    var RightDiff = Math.abs((pawn.x - pawn.ObjWidth/2) - (box.x + box.width))
                    switch (Math.min(TopDiff,BottomDiff,LeftDiff,RightDiff)){
                        case TopDiff:
                            pawn.y = box.y
                            pawn.Collision("down")
                            break;
                        case BottomDiff:
                            pawn.y = box.y + box.height + pawn.height
                            pawn.Collision("top")
                            break;
                        case LeftDiff:
                            pawn.x = box.x - pawn.ObjWidth/2
                            pawn.Collision("left")
                            break;
                        case RightDiff:
                            pawn.x = box.x + box.width + pawn.ObjWidth/2
                            pawn.Collision("right")
                            break;
                    }
                } else {
                    PawnCollisions++
                }
            })
            if (PawnCollisions == ColisionBoxes.length) {
                pawn.Collision("no")
            }
        })
    }

    Initialize() {
        this.GameLogic.Initialize(this.GameWorld)
    }

    //Start Game
    BeginPlay() {
        this.GameLogic.BeginPlay()
        // this.GameLogic.InputEvents()
        window.addEventListener("keydown", (event) => {
            this.GameLogic.PlayerInput(this.GameController.InputDown(event.key))
        })
        window.addEventListener("keyup", (event) => {
            this.GameLogic.PlayerInput(this.GameController.InputUP(event.key))
        })
        window.addEventListener("click", (event) => {
            this.GameLogic.PlayerInput(this.GameController.LMB())
        })
        this.Then = Date.now()
        this.StartTime = this.Then
    }

    //Tick event
    Render() {
        requestAnimationFrame(() => this.Render())
        this.Now = Date.now()
        this.Elapsed = this.Now - this.Then
        if (this.Elapsed > this.FPSInterval){
            this.Then = this.Now - (this.Elapsed % this.FPSInterval)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            this.CheckCollisions(this.GameWorld.GetPawns(), this.GameWorld.GetCollisionBoxes())
            this.GameWorld.OnUpdate()
        }
    }
}