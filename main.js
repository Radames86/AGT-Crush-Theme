//this waits for the html to become fully loaded
// console.log('DOM fully loaded')
document.addEventListener('DOMContentLoaded', () => {
    agtCrushGame()
})

function agtCrushGame() {
    const grid = document.querySelector(".grid")// i am telling my js file to look at my html file to grab the element with the class name grid
    const scorerDisplay = document.querySelector("#score") // selects score display element 
    const timerDisplay = document.querySelector("#timer") // selects timer display element
    const width = 8 //tellin my js file that i want the width to be 8(columns) from now on 
    const squares = []// keeps track of each square that's made and it gets stored in the empty array
    let score = 0 // initializes players score
    let timeLeft = 180 // starts timer countdown of 3 min

    const agtFaces = [ //stores judges face images
        'url(./images/sofia.png)',
        'url(./images/simon.png)',
        'url(./images/heidi.png)',
        'url(./images/howie.png)',
        'url(./images/terry.png)',
        'url(./images/mel.png)'
    ]
    const agtBuzzer = [ // array of buzzer imgs (special items)
        'url(./images/golden-buzzer.jpg)',
        'url(./images/red-buzzer.jpg)'
    ]

    //this func builds visual grid
    function createBoard() {
        // console.log('Creating board')
        for (let i = 0; i < width * width; i++) { // here we are looping over something 64 times (8 rows * 8 columns) incrementing by 1 each time from 0 
            const square = document.createElement('div')//with createElement we are creating a new div for each square // we're creating a div everytime it loops 
            square.setAttribute('draggable', true) // we're allowing it to become draggable
            square.setAttribute('id', i) // we're giving it a unique id (0-63)

            let randomFace = Math.floor(Math.random() * agtFaces.length) //this picks a judges face or image at random
            square.style.backgroundImage = agtFaces[randomFace] // this sets the square's background
            grid.appendChild(square) // we add the div to html grid container
            squares.push(square)// we push the square into the array called squares // stores the square in arr.
        }
    }
    createBoard() // calls the function to actually buil the board

    // variables to track drag events
    let squareBeingDragged
    let squareBeingDraggedId
    let squareBeingDraggedImage

    let squareBeingReplaced
    let squareBeingReplacedId
    let squareBeingReplacedImage





    squares.forEach(square => {
        square.setAttribute('draggable', true)
        square.addEventListener('dragstart', dragStart)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('dragenter', dragEnter)
        square.addEventListener('drop', dragDrop)
        square.addEventListener('dragend', dragEnd)

    })

        //manages the game countdown timer
    function startTimer(){
        const timerId = setInterval(() =>{
            if(timeLeft <= 0){ // checks if time is up
                clearInterval(timerId) // stops the timer
                console.log('Time is up! Game Over.')
                alert("Time's up! Game Over") // notify player
                return
            }
            timeLeft-- // decrement timer by 1
            timerDisplay.textContent = timeLeft // updates timer user interface
        }, 1000) // run every second
    }startTimer() // starts the timer immediately


    // records info when drag starts
    function dragStart() {
        squareBeingDragged = this // current square
        squareBeingDraggedId = parseInt(this.id) // store its id as num
        squareBeingDraggedImage = this.style.backgroundImage // store its face
        console.log("Drag start:", squareBeingDraggedId, squareBeingDraggedImage) //debugs log
    }
    function dragOver(e) {
        e.preventDefault() // allows dropping 
    }

    function dragEnter(e) {
        e.preventDefault() // also allows dropping 
    }

    function dragLeave() {
        // placeholder for potential future use
    }

    // checks if any valid match pattern exists
    function isMatchFound() {
        return (
            checkRowForFive() ||
            checkColumnForFive() ||
            checkLShape() ||
            checkRowForFour() ||
            checkRowForThree() ||
            checkColumnForThree()
        )
    }

    // records info when drop occurs
    function dragDrop() {
        squareBeingReplaced = this // the square is dropped onto
        squareBeingReplacedId = parseInt(this.id) // stores its id
        squareBeingReplacedImage = this.style.backgroundImage // stores its face
        console.log("Drag drop:", squareBeingReplacedId, squareBeingDraggedImage)
    }
    console.log(squareBeingDraggedId, squareBeingReplacedId) // logs undefined until drag happens

   function dragEnd() {
    console.log("Dragged ID:", squareBeingDraggedId, "→ Replaced ID:", squareBeingReplacedId)
    const validMoves = [ // allowed swap positions surrounding the selected square
        squareBeingDraggedId - 1,
        squareBeingDraggedId - width,
        squareBeingDraggedId + 1,
        squareBeingDraggedId + width
    ];

    const isValidMove = validMoves.includes(squareBeingReplacedId); // checks if swap is neighboring

    console.log('Drag end:', {
        draggedId: squareBeingDraggedId,
        replaceID: squareBeingReplacedId,
        isValidMove: isValidMove
    });

    // swaps back if no square is replaced or the move is invalid
    if (!squareBeingReplaced || !isValidMove) {
        console.log('Invalid move, reverting...');
        if (squareBeingDragged && squareBeingReplaced) {
            squares[squareBeingDraggedId].style.backgroundImage = squareBeingDraggedImage;
            squares[squareBeingReplacedId].style.backgroundImage = squareBeingReplacedImage;
        }
        resetDragVars();
        return;
    }

    // Swap images temporarily
    squares[squareBeingDraggedId].style.backgroundImage = squareBeingReplacedImage;
    squares[squareBeingReplacedId].style.backgroundImage = squareBeingDraggedImage;

    // Checks for any matches
    const isMatch = isMatchFound();
    console.log('Match found:', isMatch);

    if (!isMatch) {
        console.log('No match, reverting... swap');
        squares[squareBeingDraggedId].style.backgroundImage = squareBeingDraggedImage;
        squares[squareBeingReplacedId].style.backgroundImage = squareBeingReplacedImage;
    } else {
        console.log('Match found! Move accepted.');
        moveFacesDown(); // drop pieces after a match
    }

    resetDragVars(); // clears drag state
}

    // resets drag traking variables to null
    function resetDragVars() {
        squareBeingDragged = null
        squareBeingReplaced = null
        squareBeingDraggedId = null
        squareBeingReplacedId = null
        squareBeingDraggedImage = null
        squareBeingReplacedImage = null
    }

        // parse judge name from img url
    function getJudgeName(imageUrl) {
        if (!imageUrl || imageUrl === "") return "" // early exit if empty
        const match = imageUrl.match(/\/images\/(.*?)\./) //regex to capture filename
        return match ? match[1] : ""
    }
    console.log(getJudgeName('url("./images/simon.png")')) //tests parse function

    // makes tiles fall down to fill empty slots, then refills top row
    function moveFacesDown() {
        let moved
        do {
            moved = false
            for (let i = (width * width) - width - 1; i >= 0; i--) {
                if (squares[i + width].style.backgroundImage === "" && squares[i].style.backgroundImage !== "") {
                    console.log(`Moving piece from ${i} down to ${i + width}`)
                    squares[i + width].style.backgroundImage = squares[i].style.backgroundImage // drops piece
                    squares[i].style.backgroundImage = "" // clears original slot
                    moved = true
                }
            }
        } while (moved)

        // this refills the top row with new random faces if empty
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomFace = Math.floor(Math.random() * agtFaces.length)
                squares[i].style.backgroundImage = agtFaces[randomFace]
                console.log(`Refiiling top row square ${i} with new face`)
            }
        }
    } console.log("Completed movesFacesDown function ")

    // parse buzzer type from img url
    function getBuzzerType(imageUrl) {
        if (!imageUrl) return ""

        const match = imageUrl.match(/\/([a-z]+)-buzzer\.(png|jpg|jpeg)/i)
        const result = match ? match[1] : ""

        console.log("Extracted buzzer from:", imageUrl, "→", result) 
        return result
    }
    console.log(getBuzzerType('url("./images/golden-buzzer.jpg")')) // test parser

    // test function to clear a 3 by 3 area around index
    function activateAgtFaces(index) {
        const neighbors = [
            index,
            index - 1, index + 1,
            index - width, index + width,
            index - width - 1, index - width + 1,
            index + width - 1, index + width + 1
        ]

        neighbors.forEach(i => {
            if (squares[i]) {
                squares[i].style.backgroundImage = "" // clears img
                squares[i].dataset.special = "" // clears special marker
                console.log(`Cleared square at index ${i}`)
            }
        })
    }
    activateAgtFaces(10) // test-clears around tile 10


    // tests function to clear entire row/column based on buzzer
    function activateBuzzerBlast(index, direction) {
        if (!squares[index]) return

        const image = squares[index].style.backgroundImage
        const isGolden = image.includes("golden-buzzer.jpg")
        const isRed = image.includes("red-buzzer.jpg")

        if (!isGolden && !isRed) return

        if (direction === "horizontal") {
            const rowStart = Math.floor(index / width) * width
            for (let i = rowStart; i < rowStart + width; i++) {
                if (squares[i]) {
                    squares[i].style.backgroundImage = ""
                    squares[i].dataset.special = ""
                }
            }
        } else if (direction === "vertical") {
            for (let i = index; i < width * width; i += width) {
                if (squares[i]) {
                    squares[i].style.backgroundImage = ""
                    squares[i].dataset.special = ""
                }
            }
        }
    }
    activateBuzzerBlast(20, "horizontal") // tests blast row at index 20


        // function to find 5 in a row horizontally
    function checkRowForFive() {
        const notValid = []
        for (let i = 0; i < 64; i++) {
            if (i % width > width - 5) notValid.push(i) // skip i near row ends
        }
        for (let i = 0; i < 64; i++) {
            if (notValid.includes(i)) continue

            const rowOfFive = [i, i + 1, i + 2, i + 3, i + 4]
            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            if (rowOfFive.every(index =>
                squares[index] && squares[index].style.backgroundImage === decidedFace && !isBlank
            )) {
                rowOfFive.forEach(index => {
                    squares[index].style.backgroundImage = "" // clears match
                })
                return true
            }
        }
        return false
    }

    // function to find 5 in a column
    function checkColumnForFive() {
        for (let i = 0; i < 24; i++) {
            let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4]
            let decidedFace = squares[i].style.backgroundImage
            let isBlank = decidedFace === ""

            if (columnOfFive.every(function (index) {
                return squares[index].style.backgroundImage === decidedFace && !isBlank
            })) {
                columnOfFive.forEach(function (index) {
                    squares[index].style.backgroundImage = ""
                })
                return true
            }
        }
        return false
    }

    // function to find 4 ina row // creates buzzer
    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            const notValid = [ // indices near ends
                5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31,
                37, 38, 39, 45, 46, 47, 53, 54, 55
            ]
            if (notValid.includes(i)) continue

            if (rowOfFour.every(index =>
                squares[index].style.backgroundImage === decidedFace && !isBlank
            )) {
                console.log("Row of Four at:", rowOfFour)

                score += 4 // increases score
                scorerDisplay.innerHTML = score // updates user interface

                const buzzerImage = agtBuzzer[Math.floor(Math.random() * agtBuzzer.length)]

                const specialIndex = rowOfFour[Math.floor(Math.random() * 4)]
                squares[specialIndex].style.backgroundImage = buzzerImage
                squares[specialIndex].dataset.special = "buzzer" // marks special square

                console.log("Buzzer created at index", specialIndex, ":", buzzerImage)

                rowOfFour.forEach(index => {
                    if (index !== specialIndex) {
                        squares[index].style.backgroundImage = ""
                        squares[index].dataset.special = ""
                    }
                    
                })
                return true
            }
        }
        return false
    }


    // function to find 4 in a column // similar to row
    function checkColumnForFour() {
        for (let i = 0; i < 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedFace && !isBlank)) {
                console.log("Column of 4 match at:", columnOfFour)

                score += 4
                scorerDisplay.innerHTML = score

                const buzzerImage = agtBuzzer[Math.floor(Math.random() * agtBuzzer.length)]

                const specialIndex = columnOfFour[Math.floor(Math.random() * 4)]
                squares[specialIndex].style.backgroundImage = buzzerImage
                squares[specialIndex].dataset.special = "buzzer"

                console.log("Buzzer created at index", specialIndex, ":", buzzerImage)

                columnOfFour.forEach(index => {
                    if (index !== specialIndex) {
                        squares[index].style.backgroundImage = ""
                        squares[index].dataset.special = ""
                    }
                })
                return true
            }
        }
        return false
    }

    // similar logic for three in row same as four and five
    function checkRowForThree() {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            const notValid = [
                6, 7, 14, 15, 22, 23, 30, 31,
                38, 39, 46, 47, 54, 55, 62, 63
            ]
            if (notValid.includes(i)) continue

            if (rowOfThree.every(index =>
                squares[index] && squares[index].style.backgroundImage === decidedFace && !isBlank
            )) {
                //this clears matched squares
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = "" // clear
                })
                return true
            }
        }
        return false // makes sure to return false if no match is found
    }

    //vertical three oin column match with buzzer
    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const judgeImage = squares[i].style.backgroundImage
            const isBlank = judgeImage === ""

            const judgeName = getJudgeName(judgeImage) // extract face name

            if (columnOfThree.every(index => {
                const img = squares[index].style.backgroundImage
                return !isBlank && getJudgeName(img) === judgeName
            })) {
                console.log("Column of 3 matched at", columnOfThree)

                score += 3
                scorerDisplay.innerHTML = score

                const specialIndex = columnOfThree[Math.floor(Math.random() * 3)]
                const buzzerImage = agtBuzzer[Math.floor(Math.random() * agtBuzzer.length)]

                columnOfThree.forEach(index => {
                    if (index === specialIndex) {
                        squares[index].style.backgroundImage = buzzerImage
                        squares[index].dataset.special = "buzzer"

                        console.log("Col3: Buzzer created at", index)
                    } else {
                        squares[index].style.backgroundImage = ""
                        squares[index].dataset.special = ""
                    }
                })
                return true
            }
        }
        return false
    }

    // detects L-shaped matches of 5
    function checkLShape() {
        for (let i = 0; i < 64; i++) {
            let decidedFace = squares[i].style.backgroundImage
            let isBlank = decidedFace === ""

            let shape1 = [i, i + 1, i + 2, i + width, i + width * 2] // L pointing down-right
            let shape2 = [i, i - 1, i - 2, i + width, i + width * 2] // L pointing down-left
            let shape3 = [i, i + 1, i + 2, i - width, i - width * 2] // L pointing up-right
            let shape4 = [i, i - 1, i - 2, i - width, i - width * 2] // L ponting up-left
            let shape5 = [i, i + width, i + width * 2, i + width * 2 + 1, i + width * 2 + 2] // L rotated in mirror L
            let shape6 = [i, i + width, i + width * 2, i + width * 2 - 1, i + width * 2 - 2] // L rotated in mirror L upside down

            let allShapes = [shape1, shape2, shape3, shape4, shape5, shape6]

            for (let j = 0; j < allShapes.length; j++) {
                let shape = allShapes[j]

                if (shape.every(function (index) {
                    return index >= 0 && index < 64 &&
                        squares[index].style.backgroundImage === decidedFace && !isBlank
                })) {
                    shape.forEach(function (index) {
                        squares[index].style.backgroundImage = "" // clears L-shaped pieces
                    })
                    return true
                }
            }

        }
        return false
    }

    // main game loop: continually checks for matches and gravity
    window.setInterval(function () {

        checkColumnForFive()
        checkRowForFive()
        checkLShape()
        checkColumnForFour()
        checkRowForFour()
        checkColumnForThree()
        checkRowForThree()
        moveFacesDown() // keeps board updated constantly

    }, 100)





} // ends agtCrushGame()
