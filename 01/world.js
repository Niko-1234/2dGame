class World {
    constructor() {      
        this.actors = []
        this.ColisionsBoxes = []
        this.Pawns = []
        this.PlayerChar
        this.GlobalXOrigin = 0
        this.PlayerPoints = 0
    }

    OnUpdate() {
        var WorldMove = (this.PlayerChar.x - canvas.width/2)
        this.actors.forEach(actor => {
            actor.OnUpdate()
            actor.x -= WorldMove //keep pleyr in the middle of the screen
        })
        this.GlobalXOrigin -= WorldMove
    }

    OverlapActors(StartPoint, Range, PawnToOmit){
        var OverlappedPawns = []
        this.Pawns.forEach(pawn => {
            if((pawn.x <= (StartPoint.x + Range) && pawn.x >= (StartPoint.x - Range)) &&
               (pawn.y <= (StartPoint.y + Range) && pawn.y >= (StartPoint.y - Range))){
                if (pawn != PawnToOmit) {
                    OverlappedPawns.push(pawn) 
                }
            }
        })
        return OverlappedPawns
    }

    DeleteActor(ActorToDelete){
        for (var i = 0; i < this.Pawns.length; i++){
            if (this.Pawns[i] == ActorToDelete){
                delete this.Pawns[i]
                this.Pawns.splice(i,1)
            }
        }
        for (var i = 0; i < this.actors.length; i++){
            if (this.actors[i] == ActorToDelete){
                delete this.actors[i]
                this.actors.splice(i,1)
            }
        }

        console.log(this.actors.length,this.Pawns.length)
    }

    AddActor(actor) {
        this.actors.push(actor)
    }

    AddColisionBox(actor) {
        this.actors.push(actor)
        this.ColisionsBoxes.push(actor)
    }

    AddPawn(actor) {
        this.actors.push(actor)
        this.Pawns.push(actor)
    }

    GetActors() {
        return this.actors
    }

    SetPlayerChar(actor) {
        this.PlayerChar = actor
    }

    GetPlayerChar() {
        return this.PlayerChar
    }

    GetPawns() {
        return this.Pawns
    }

    GetCollisionBoxes() {
        return this.ColisionsBoxes
    }
}