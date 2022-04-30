class World {
    constructor() {      
        this.actors = []
        this.ColisionsBoxes = []
        this.Pawns = []
        this.PlayerChar
    }

    OnUpdate() {
        var WorldMove = (this.PlayerChar.x - canvas.width/2)
        this.actors.forEach(actor => {
            actor.OnUpdate()
            actor.x -= WorldMove //keep pleyr in the middle of the screen
        })
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
        var i = 0
        this.actors.forEach(actor => {
            if (actor == ActorToDelete){
                delete this.actors[i]
                return
            }
            i++
        })
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