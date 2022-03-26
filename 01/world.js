class World {
    constructor() {      
        this.ators = []
        this.ColisionsBoxes = []
        this.Pawns = []
        this.PlayerChar
    }

    AddActor(actor) {
        this.ators.push(actor)
    }

    AddColisionBox(actor) {
        this.ators.push(actor)
        this.ColisionsBoxes.push(actor)
    }

    AddPawn(actor) {
        this.ators.push(actor)
        this.Pawns.push(actor)
    }

    GetActors() {
        return this.ators
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