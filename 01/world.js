class World {
    constructor() {      
        this.actors = []
        this.ColisionsBoxes = []
        this.Pawns = []
        this.PlayerChar
    }

    OnUpdate() {
        this.actors.forEach(actor => {
            actor.OnUpdate()
            actor.x -= (this.PlayerChar.dx * this.PlayerChar.Speed) 
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