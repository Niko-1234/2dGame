class Controller {
    constructor(){
    }

    InputDown(key){
        switch (key) {
            case 'w':
                return "MoveUpStart"
            case 's':
                return "MoveDownStart"
            case 'd':
                return "MoveRightStart"
            case 'a':
                return "MoveLeftStart"
            case ' ':
                return "JumpStart"
            default:
                return "None"
        }
    }

    InputUP(key){
        switch (key) {
            case 'w':
                return "MoveUpEnd"
            case 's':
                return "MoveDownEnd"
            case 'd':
                return "MoveRightEnd"
            case 'a':
                return "MoveLeftEnd"
            default:
                return "None"
        }
    }
}