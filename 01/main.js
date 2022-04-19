
// Main settings
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1280;
canvas.height = 720;

//VARS
var controller = new Controller()

var world   = new World()

var game    = new Game()

var engine  = new Engine(game, world, controller, 24)

//Initialize
engine.Initialize()

//Begin Play
engine.BeginPlay()

//TickEvent
engine.Render()



