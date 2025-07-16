//this waits for the html to become fully loaded
// console.log('DOM fully loaded')
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')// i am telling my js file to look at my html file to grab the element with the class name grid
    const timerDisplay = document.querySelector('#timer')
    const width = 8 //tellin my js file that i want the width to be 8 from now on
    const squares = []// keeps track of each square that's made and it gets stored in the empty array
    const agtFaces = [ //stores judges face images
        'url(./images/sofia.png)',
        'url(./images/simon.png)',
        'url(./images/heidi.png)',
        'url(./images/howie.png)',
        'url(./images/terry.png)',
        'url(./images/mel.png)'
    ]
    const agtBuzzer = [
        'url(./images/golden-buzzer.jpg)',
        'url(./images/red-buzzer.jpg)'
    ]
    let score = 0;
    let timeLeft = 180;
    let timerId;
    let gameActive = true;


    function isGoldenBuzzer(imageUrl) {
        return imageUrl === agtBuzzer[0]
    }

    function startTimer() {
        // console.log('Timer started')
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            // console.log('Time left:')

            if (timeLeft <= 0) {
                clearInterval(timerId)
                endGame()
            }
        }, 1000)
    }

    //this func builds grid
    function createBoard() {
        // console.log('Creating board')
        for (let i = 0; i < width * width; i++) { // here we are looping over something 64 times (8 rows * 8 columns) incrementing by 1 each time from 0
            const square = document.createElement('div')//with createElement we are creating the div element in our html using js // we're creating a div everytime it loops 
            square.setAttribute('draggable', true) // we're allowing it to become draggable
            square.setAttribute('id', i) // we're giving it a unique id

            let randomFace = Math.floor(Math.random() * agtFaces.length) //this picks ajudges face or image at random
            square.style.backgroundImage = agtFaces[randomFace]
            square.dataset.isBuzzer = "false" //new code-----
            grid.appendChild(square) // we add the div to html grid
            squares.push(square)// we push the square into the array called squares
        }
    }


    function updateScore(points) {
        score += points
        // console.log(`Score updated by ${points}, total score:`, score)
        document.querySelector('#score').textContent = score
    }

    function checkRowForThree() {
        // console.log('Checking row of three')
        let matchFound = false
        let matches = []

        for (let i = 0; i < 64; i++) {
            const rowStart = Math.floor(i / width) * width
            const rowEnd = rowStart + (width - 3)
            if (i > rowEnd) continue

            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            if (
                squares[i + 1] &&
                squares[i + 2] &&
                squares[i].style.backgroundImage === decidedFace &&
                squares[i + 1].style.backgroundImage === decidedFace &&
                squares[i + 2].style.backgroundImage === decidedFace &&
                !isBlank
            ) {
                // console.log(`Row match at indexes: ${1}, ${i + 1}, ${i + 2}`)
                matches.push(i, i + 1, i + 2)
                matchFound = true
            }
        }

        matches = [...new Set(matches)]

        const allGolden = matches.length === 3 && matches.every(index => isGoldenBuzzer(squares[index].style.backgroundImage))

        if (allGolden) {
            // console.log('Golden buzzer match!')
            matches.forEach(index => {
                squares[index].classList.add('gold-explosion')
                setTimeout(() => squares[index].classList.remove('gold-explosion'), 800)
            })
            updateScore(10)
        }

        matches.forEach(index => {
            if (squares[index].dataset.isBuzzer === "true") updateScore(5)
            squares[index].style.backgroundImage = ""
            squares[index].dataset.isBuzzer = "false"
        })
        if (matches.length > 0 && !allGolden) updateScore(matches.length)

        return matchFound;
    }


    function checkColumnForThree() {
        // console.log('Checking column for three')
        let matchFound = false
        let matches = []

        for (let i = 0; i < 47; i++) {

            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            if (
                squares[i + width].style.backgroundImage === decidedFace &&
                squares[i + width * 2].style.backgroundImage === decidedFace &&
                !isBlank
            ) {
                // console.log(`Column match at indexes: ${i}, ${i + width}, ${i + width * 2}`)
                matches.push(i, i + width, i + width * 2)
                matchFound = true
            }
        }
        matches = [...new Set(matches)]

        const allGolden = matches.length === 3 && matches.every(index => isGoldenBuzzer(squares[index].style.backgroundImage))

        if (allGolden) {
            // console.log('Golden buzzer column match!')
            matches.forEach(index => {
                squares[index].classList.add('gold-explosion')
                setTimeout(() => squares[index].classList.remove('gold-explosion'), 800)
            })
            updateScore(10)
        }
        matches.forEach(index => {
            if (squares[index].dataset.isBuzzer === "true") updateScore(5)
            squares[index].style.backgroundImage = ""
            squares[index].dataset.isBuzzer = "false"
        })
        if (matches.length > 0 && !allGolden) updateScore(matches.length)
        return matchFound
    }


    function moveFacesDown() {
        console.log('Moving faces down')
        for (let i = (width * width) - width - 1; i >= 0; i--) {
            let currentIndex = i

            while (
                currentIndex + width < width * width &&
                squares[currentIndex + width].style.backgroundImage === "" &&
                squares[currentIndex].style.backgroundImage !== ""
            ) {
                squares[currentIndex + width].style.backgroundImage = squares[currentIndex].style.backgroundImage
                squares[currentIndex + width].dataset.isBuzzer = squares[currentIndex].dataset.isBuzzer

                squares[currentIndex].style.backgroundImage = ""
                squares[currentIndex].dataset.isBuzzer = "false"

                currentIndex += width
            }
        }
    }



    function refillTopRow() {
        // console.log('Refilling top row')
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomNum = Math.random()
                if (randomNum < 0.15) {
                    let buzzerIndex = Math.floor(Math.random() * agtBuzzer.length)
                    squares[i].style.backgroundImage = agtBuzzer[buzzerIndex]
                    squares[i].dataset.isBuzzer = "true"
                    console.log(`Refilled square ${i} with Buzzer`)
                } else {
                    let randomFace = Math.floor(Math.random() * agtFaces.length)
                    squares[i].style.backgroundImage = agtFaces[randomFace]
                    squares[i].dataset.isBuzzer = "false"
                    console.log(`Refilled square ${i} with face`)
                }
            }

        }
    }





    function endGame() {
        console.log('Game ended')
        gameActive = false;
        alert('Time is up! Try again!')
    }

    function gameLoop() {
        if (!gameActive) return; // stops the loop if game ended
        // console.log('Game loop running')


        const loopUntilStable = () => {
            const rowMatch = checkRowForThree();
            const colMatch = checkColumnForThree();


            if (rowMatch || colMatch) {
                console.log("Match found, progressing drops and refill...")
                moveFacesDown();
                refillTopRow()

                setTimeout(loopUntilStable, 200)
            } else {
                setTimeout(gameLoop, 100)
            }

        }
        loopUntilStable()
    }

    let faceBeingDragged
    let squareIdBeingDragged
    let faceBeingReplaced
    let squareBeingReplaced


    function dragStart() {
        if (!gameActive) return;
        faceBeingDragged = this.style.backgroundImage //faceBeingDropped has the faces of the judges stored in it's arr. this refers to the selected div/square that was just clicked and started being dragged
        squareIdBeingDragged = parseInt(this.id) // this.id gets the id of the attr. of the square being dragged

        // console.log("dragStart:")
        // console.log(" - Face being dragged:", faceBeingDragged)
        // console.log(" - Square ID being dragged:", squareIdBeingDragged)
    }

    function dragOver(e) { //this function will run when a dragged item is moved over a drop target
        e.preventDefault() //this function allows the dragged item to be dropped on the target square
        // console.log("dragOver: hovering over square", e.target.id)
    }
    // both dragOver and dragEnter functions work together to allow the drop action

    function dragEnter(e) { // this runs when the dragged item enters a drop target
        e.preventDefault() // this allows the drop e to work on this square
        // console.log("dragEnter: entered square", e.target.id)
    }

    function dragDrop() { // this runs when you drop the dragged face onto another square
        faceBeingReplaced = this.style.backgroundImage // 
        squareBeingReplaced = parseInt(this.id) // gets the id of the square and converts it to a number for future use

        // console.log("dragDrop:")
        // console.log(" - Face being replaced:", faceBeingReplaced)
        // console.log(" - Square ID being replaced", squareBeingReplaced)

        this.style.backgroundImage = faceBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = faceBeingReplaced // we set the square of the face dragged from to show the face replaced, swaps the 2 faces

        const temp = squares[squareBeingReplaced].dataset.isBuzzer
        squares[squareBeingReplaced].dataset.isBuzzer = squares[squareIdBeingDragged].dataset.isBuzzer
        squares[squareIdBeingDragged].dataset.isBuzzer = temp

        // console.log(" - Swapped images between squares", squareIdBeingDragged, "and", squareBeingReplaced)

    }

    function dragEnd() {
        if (squareBeingReplaced === null) return

        // console.log("dragEnd:")
        // console.log(" - Checking move validity...")

        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ]
        let isValidMove = validMoves.includes(squareBeingReplaced)

        // console.log(" - Is valid move?", isValidMove)

        if (isValidMove) {
            let wasMatch = checkRowForThree() || checkColumnForThree()

            // console.log(" - Was match after drop?", wasMatch)

            if (!wasMatch) {
                squares[squareBeingReplaced].style.backgroundImage = faceBeingReplaced
                squares[squareIdBeingDragged].style.backgroundImage = faceBeingDragged

                const temp = squares[squareBeingReplaced].dataset.isBuzzer
                squares[squareBeingReplaced].dataset.isBuzzer = squares[squareIdBeingDragged].dataset.isBuzzer
                squares[squareIdBeingDragged].dataset.isBuzzer = temp

                // console.log(" - No match. Reverted swap.")
            } else {
                gameLoop()
            }
        } else {
            squares[squareBeingReplaced].style.backgroundImage = faceBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage = faceBeingDragged

            const temp = squares[squareBeingReplaced].dataset.isBuzzer
            squares[squareBeingReplaced].dataset.isBuzzer = squares[squareIdBeingDragged].dataset.isBuzzer
            squares[squareIdBeingDragged].dataset.isBuzzer = temp

            // console.log(" - Invalid move. Reverted swap")
        }

        faceBeingDragged = null
        squareIdBeingDragged = null
        faceBeingReplaced = null
        squareBeingReplaced = null
    }

    createBoard() // now we call the function to actually build the board and see if it works



    squares.forEach(square => { // loops through each square in the squares arr. it listens for certain drag and drop e and calls the functions when those e happen
        //    console.log('Setting up drag events for square ID:', square.id)

        square.addEventListener('dragstart', dragStart) // when player starts dragging a square dragStart runs
        square.addEventListener('dragover', dragOver) // when dragged item is moved over a square dragOver runs
        square.addEventListener('dragenter', dragEnter) // when a dragged item enters a square dragEnter runs
        square.addEventListener('drop', dragDrop) // when the dragged item is dropped on a square dragDrop runs
        square.addEventListener('dragend', dragEnd) // when the drag finishes dragEnd runs
    })

    startTimer()
    setInterval(gameLoop, 100)






})
// this is part of my boiler plate set up