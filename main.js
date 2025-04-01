var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

// Set the "actual" size of the canvas
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// Scale the context to ensure correct drawing operations
ctx.scale(dpr, dpr);

// Set the "drawn" size of the canvas
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

cellSize = 600/8
previewSize = 600/15

mouseX = 0
mouseY = 0

mouseX_last = 0
mouseY_last = 0

mouseX_last_last = 0
mouseY_last_last = 0

function nothing(x) {
    return x
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    let j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

board = [
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 1, 0, 0, 0], 
    [0, 0, 0, 0, 1, 0, 0, 0], 
    [0, 0, 0, 0, 1, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0]
]

board_last = [
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0]
]

boards = [board]
turns = 0

function drawPlayArea() {
    ctx.strokeRect(0, 0, 600, 600)
}


function drawGrid() {
    ctx.strokeStyle = "#aaaaaa"
    for (i = 0; i < 8; i++) {
        ctx.moveTo(cellSize * i, 0)
        ctx.lineTo(cellSize * i, 600)
        ctx.moveTo(0, cellSize * i)
        ctx.lineTo(600, cellSize * i)
    }
    ctx.stroke()
}

function drawBoard() {
    ctx.strokeStyle = "black"
    ctx.fillStyle = "black"

    for (y = 0; y < board.length; y++) {
        for (x = 0; x < board[0].length; x++) {
            if (board[y][x] == 1) {
                ctx.strokeStyle = "black"
                ctx.fillStyle = "black"
            } else if (board[y][x] == 2) {
                ctx.strokeStyle = "#999999"
                ctx.fillStyle = "#999999"
                board[y][x] = 0
            } else {
                ctx.strokeStyle = "white"
                ctx.fillStyle = "white"
            }
            ctx.fillRect(cellSize*x + 2, cellSize*y + 2, cellSize - 4, cellSize - 4)
        }
    }
}

// vertical lines
v3 = [
    [1],
    [1],
    [1]
]

v4 = [
    [1],
    [1],
    [1],
    [1]
]

v5 = [
    [1],
    [1],
    [1],
    [1],
    [1]
]

// horizontal lines
h3 = [
    [1, 1, 1]
]

h4 = [
    [1, 1, 1, 1]
]

h5 = [
    [1, 1, 1, 1, 1]
]

// squares
sq2 = [
    [1, 1],
    [1, 1]
]

sq3 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]

// small arrows
arrowNW = [
    [1, 1],
    [1, 0]
]

arrowNE = [
    [1, 1],
    [0, 1]
]

arrowSE = [
    [0, 1],
    [1, 1]
]

arrowSW = [
    [1, 0],
    [1, 1]
]

// big arrows
bigarrowNW = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]
]

bigarrowNE = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1]
]

bigarrowSE = [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1]
]

bigarrowSW = [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
]

// L
l0 = [
    [0, 0, 1],
    [1, 1, 1]
]

l1 = [
    [1, 0],
    [1, 0],
    [1, 1]
]

l2 = [
    [1, 1, 1],
    [1, 0, 0]
]

l3 = [
    [1, 1],
    [0, 1],
    [0, 1]
]

// J
j0 = [
    [1, 0, 0],
    [1, 1, 1]
]

j1 = [
    [1, 1],
    [1, 0],
    [1, 0]
]

j2 = [
    [1, 1, 1],
    [0, 0, 1]
]

j3 = [
    [0, 1],
    [0, 1],
    [1, 1]
]

// S
s0 = [
    [0, 1, 1],
    [1, 1, 0]
]

s1 = [
    [1, 0],
    [1, 1],
    [0, 1]
]

// Z
z0 = [
    [1, 1, 0],
    [0, 1, 1]
]

z1 = [
    [0, 1],
    [1, 1],
    [1, 0]
]

// T
t0 = [
    [0, 1, 0],
    [1, 1, 1]
]

t1 = [
    [1, 0],
    [1, 1],
    [1, 0]
]

t2 = [
    [1, 1, 1],
    [0, 1, 0]
]

t3 = [
    [0, 1],
    [1, 1],
    [0, 1]
]

// rectangles
r23 = [
    [1, 1],
    [1, 1],
    [1, 1]
]

r32 = [
    [1, 1, 1],
    [1, 1, 1]
]

allPieces = [
    v3, v4, v5, 
    h3, h4, h5, 
    sq2, sq3, 
    arrowNE, arrowNW, arrowSE, arrowSW, 
    bigarrowNE, bigarrowNW, bigarrowSE, bigarrowSW,
    l0, l1, l2, l3,
    j0, j1, j2, j3,
    s0, s1,
    z0, z1,
    t0, t1, t2, t3,
    r23, r32
]

queue = []

piece = []

function generateQueue() {
    _ = [...allPieces]
    bag = shuffleArray(_)
    queue = Array(3)
    queue[0] = bag.pop()
    queue[1] = bag.pop()
    queue[2] = bag.pop()
    console.log(queue)
}

function drawQueue() {
    ctx.clearRect(600/15*16-2, 0, 600/15*5, 600/15*22)
    previewSize = 600/15
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'black'
    for (i = 0; i < 3; i++) {
        drawX = 16
        drawY = i * 7
        for (y = 0; y < queue[i].length; y++) {
            for (x = 0; x < queue[i][0].length; x++) {
                if (queue[i][y][x] == 1) {
                    ctx.fillRect((drawX + x) * previewSize - 1, (drawY + y) * previewSize - 1, previewSize - 2, previewSize - 2)
                }
            }
        }
        ctx.strokeRect(drawX * previewSize, drawY * previewSize, 5 * previewSize, 5 * previewSize)
    }
}

function drawGhostPiece() {
    x_offset = Math.floor(piece[0].length / 2)
    y_offset = Math.floor(piece.length / 2)
    ctx.strokeStyle = "#999999"
    ctx.fillStyle = "#999999"
    if (
        (mouseX >= x_offset && mouseX <= 8 - (piece[0].length - x_offset)) &&
        (mouseY >= y_offset && mouseY <= 8 - (piece.length - y_offset))
    ) {
        for (y = 0; y < piece.length; y++) {
            for (x = 0; x < piece[y].length; x++) {
                if (board[mouseY + y - y_offset][mouseX + x - x_offset] != 1) {
                    if (piece[y][x] == 1 && board[mouseY + y - y_offset][mouseX + x - x_offset] != 1) {
                        board[mouseY + y - y_offset][mouseX + x - x_offset] = 2
                    } else if (piece[y][x] == 0) {
                        board[mouseY + y - y_offset][mouseX + x - x_offset] = 0
                    }
                }
            }
        }
    }
}

function checkForClear() {
    fullRow = [1, 1, 1, 1, 1, 1, 1, 1]
    for (i = 0; i < board.length; i++) {
        if (
            board[i][0] == 1 && 
            board[i][1] == 1 && 
            board[i][2] == 1 && 
            board[i][3] == 1 && 
            board[i][4] == 1 && 
            board[i][5] == 1 && 
            board[i][6] == 1 && 
            board[i][7] == 1
        ) {
            board[i] = [0, 0, 0, 0, 0, 0, 0, 0]
        }

        if (
            board[0][i] == 1 &&
            board[1][i] == 1 &&
            board[2][i] == 1 &&
            board[3][i] == 1 &&
            board[4][i] == 1 &&
            board[5][i] == 1 &&
            board[6][i] == 1 &&
            board[7][i] == 1
        ) {
            board[0][i] = 0
            board[1][i] = 0
            board[2][i] = 0
            board[3][i] = 0
            board[4][i] = 0
            board[5][i] = 0
            board[6][i] = 0
            board[7][i] = 0
        }
        
    }
}


function placePiece(e) {
    console.log('placing piece')

    board_last = [...board]
    board_new = [...board]

    overlap = false
    changed = Array()


    x_offset = Math.floor(piece[0].length / 2)
    y_offset = Math.floor(piece.length / 2)
    mouseX = Math.floor(e.offsetX / cellSize)
    mouseY = Math.floor(e.offsetY / cellSize)

    if (
        (mouseX >= x_offset && mouseX <= 8 - (piece[0].length - x_offset)) &&
        (mouseY >= y_offset && mouseY <= 8 - (piece.length - y_offset))
    ) {
        for (y = 0; y < piece.length; y++) {
            for (x = 0; x < piece[0].length; x++) {
                if (piece[y][x] == 1) {
                    changed.push([mouseY + y - y_offset, mouseX + x - x_offset])
                }
            }
        }
    }

    console.log('changed', changed)
    for (i = 0; i < changed.length; i++) {
        console.log(changed[i])
        console.log(board[changed[i][0]][changed[i][1]])
        console.log(board[changed[i][0]][changed[i][1]] == 1)
        if (board[changed[i][0]][changed[i][1]] == 1) {
            overlap = true
            break
        }
    }

    if (!overlap) {
        for (i = 0; i < changed.length; i++) {
            board[changed[i][0]][changed[i][1]] = 1
        }
    }

    console.log('overlap', overlap)



    overlap = false


    checkForClear()
    drawGraphics()
}

function choosePiece(e) {
    console.log('choose piece')
    if (e.offsetX / previewSize >= 15) {
        if (e.offsetY / previewSize >= 0 && e.offsetY / previewSize < 5.2) {
            console.log('top piece')
            piece = [...queue[0]]
        } else if (e.offsetY / previewSize >= 7 && e.offsetY / previewSize < 12) {
            console.log('middle piece')
            piece = [...queue[1]]
        } else if (e.offsetY / previewSize >= 14 && e.offsetY / previewSize < 19) {
            console.log('bottom piece')
            piece = [...queue[2]]

        }
    }
    console.log(e.offsetX / previewSize, e.offsetY / previewSize)
}


function mouseMove(e) {
    
    mouseX = Math.floor(e.offsetX / cellSize)
    mouseY = Math.floor(e.offsetY / cellSize)

    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    // if (mouseX_last != mouseX || mouseY_last != mouseY) {
    //     drawGraphics()
    // }
    drawGraphics()
    
    mouseX_last = mouseX
    mouseY_last = mouseY
    
}

function mouseDown(e) {
    if (0 <= mouseX && mouseX <= 7 && 0 <= mouseY && mouseY <= 7) {
        placePiece(e)
    } else {
        choosePiece(e)
    }
}

drawPlayArea()
drawGrid()
generateQueue()

function drawGraphics() {
    drawBoard()

    if (0 <= mouseX && mouseX < 8 && 0 <= mouseY && mouseY < 8) {
        drawGhostPiece()
    }
    drawQueue()
}


canvas.addEventListener('mousemove', mouseMove)
canvas.addEventListener('mousedown', (event) => { mouseDown(event) })