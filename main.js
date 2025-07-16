//this waits for the html to become fully loaded
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
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerId)
                endGame()
            }
        }, 1000)
    }

    //this func builds grid
    function createBoard() {
        for (let i = 0; i < width * width; i++) { // here we are looping over something 64 times (8 rows * 8 columns) incrementing by 1 each time from 0
            const square = document.createElement('div')//with createElement we are creating the div element in our html using js // we're creating a div everytime it loops 
            square.setAttribute('draggable', true) // we're allowing it to become draggable
            square.setAttribute('id', i) // we're giving it a unique id

            let randomFace = Math.floor(Math.random() * agtFaces.length) //this picks ajudges face or image at random
            square.style.backgroundImage = agtFaces[randomFace]
            grid.appendChild(square) // we add the div to html grid
            squares.push(square)// we push the square into the array called squares
        }
    }


    function updateScore(points) {
        score += points
        document.querySelector('#score').textContent = score
    }

    function checkRowForThree() {
        let matchFound = false
        let matches = []

        for (let i = 0; i < 64; i++) {
            const rowEnd = Math.floor(i / width) * width + (width - 2)
            if (i > rowEnd) continue

            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            if (squares[i].style.backgroundImage === decidedFace &&
                squares[i + 1].style.backgroundImage === decidedFace &&
                squares[i + 2].style.backgroundImage === decidedFace &&
                !isBlank
            ) {
                matches.push(i, i + 1, i + 2)
                matchFound = true
            }
        }

        matches = [...new Set(matches)]

        const allGolden = matches.length === 3 && matches.every(index => isGoldenBuzzer(squares[index].style.backgroundImage))

        if (allGolden) {
            matches.forEach(index => {
                squares[index].classList.add('gold-explosion')
                setTimeout(() => squares[index].classList.remove('gold-explosion'), 800)
            })
            updateScore(10)
        }

        matches.forEach(index => {
            if (squares[index].dataset.isBuzzer === "true") {
                updateScore(5)
            }
            squares[index].style.backgroundImage = ""
            squares[index].dataset.isBuzzer = "false"
        })
        if (matches.length > 0 && !allGolden) updateScore(matches.length)

        return matchFound;
    }


    function checkColumnForThree() {
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
                matches.push(i, i + width, i + width * 2)
                matchFound = true
            }
        }
        matches = [...new Set(matches)]

        const allGolden = matches.length === 3 && matches.every(index => isGoldenBuzzer(squares[index].style.backgroundImage))

        if (allGolden) {
            matches.forEach(index => {
                squares[index].classList.add('gold-explosion')
                setTimeout(() => squares[index].classList.remove('gold-explosion'), 800)
            })
            updateScore(10)
        }
        matches.forEach(index => {
            if (squares[index].dataset.isBuzzer === "true") {
                updateScore(5)
            }
            squares[index].style.backgroundImage = ""
            squares[index].dataset.isBuzzer = "false"
        })
        if (matches.length > 0) updateScore(matches.length)
        return matchFound
    }


    function moveFacesDown() {
        for (let i = 0; i < 56; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i + width].dataset.isBuzzer = squares[i].dataset.isBuzzer
                squares[i].style.backgroundImage = ""
                squares[i].dataset.isBuzzer = "false"
            }
        }
    }

    function refillTopRow() {
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomNum = Math.random()
                if (randomNum < 0.15) {
                    let buzzerIndex = Math.floor(Math.random() * agtBuzzer.length)
                    squares[i].style.backgroundImage = agtBuzzer[buzzerIndex]
                    squares[i].dataset.isBuzzer = "true"
                } else {
                    let randomFace = Math.floor(Math.random() * agtFaces.length)
                    squares[i].style.backgroundImage = agtFaces[randomFace]
                    squares[i].dataset.isBuzzer = "false"
                }
            }

        }
    }





    function endGame() {
        gameActive = false;
        alert('Time is up! Level cleared!')
    }

    function gameLoop() {
        if (!gameActive) return; // stops the loop if game ended

        const rowMatch = checkRowForThree();
        const colMatch = checkColumnForThree();

        if (rowMatch || colMatch) {
            moveFacesDown();
            refillTopRow();

            setTimeout(gameLoop, 60);
        } else {
            setTimeout(gameLoop, 30);
        }
    }

    let faceBeingDragged
    let squareIdBeingDragged
    let faceBeingReplaced
    let squareBeingReplaced


    function dragStart() {
        if (!gameActive) return;
        faceBeingDragged = this.style.backgroundImage //faceBeingDropped has the faces of the judges stored in it's arr. this refers to the selected div/square that was just clicked and started being dragged
        squareIdBeingDragged = parseInt(this.id) // this.id gets the id of the attr. of the square being dragged
    }

    function dragOver(e) { //this function will run when a dragged item is moved over a drop target
        e.preventDefault() //this function allows the dragged item to be dropped on the target square
    }
    // both dragOver and dragEnter functions work together to allow the drop action

    function dragEnter(e) { // this runs when the dragged item enters a drop target
        e.preventDefault() // this allows the drop e to work on this square
    }

    function dragDrop() { // this runs when you drop the dragged face onto another square
        faceBeingReplaced = this.style.backgroundImage // 
        squareBeingReplaced = parseInt(this.id) // gets the id of the square and converts it to a number for future use

        this.style.backgroundImage = faceBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = faceBeingReplaced // we set the square of the face dragged from to show the face replaced, swaps the 2 faces

        const tempBuzzer = squares[squareBeingReplaced].dataset.isBuzzer
        squares[squareBeingReplaced].dataset.isBuzzer = squares[squareIdBeingDragged].dataset.isBuzzer
        squares[squareIdBeingDragged].dataset.isBuzzer = tempBuzzer

    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ]
        let isValidMove = validMoves.includes(squareBeingReplaced)

        if (squareBeingReplaced && isValidMove) {
            let wasMatch = checkRowForThree() || checkColumnForThree()

            if (!wasMatch) {
                squares[squareBeingReplaced].style.backgroundImage = faceBeingReplaced
                squares[squareIdBeingDragged].style.backgroundImage = faceBeingDragged

                const tempBuzzer = squares[squareBeingReplaced].dataset.isBuzzer
                squares[squareBeingReplaced].dataset.isBuzzer = squares[squareIdBeingDragged].dataset.isBuzzer
                squares[squareIdBeingDragged].dataset.isBuzzer = tempBuzzer
            }
        } else {
            squares[squareBeingReplaced].style.backgroundImage = faceBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage = faceBeingDragged

            const tempBuzzer = squares[squareBeingReplaced].dataset.isBuzzer
                squares[squareBeingReplaced].dataset.isBuzzer = squares[squareIdBeingDragged].dataset.isBuzzer
                squares[squareIdBeingDragged].dataset.isBuzzer = tempBuzzer
        }

        faceBeingDragged = null
        squareIdBeingDragged = null
        faceBeingReplaced = null
        squareBeingReplaced = null
    }

    createBoard() // now we call the function to actually build the board and see if it works
    squares.forEach(square => { // loops through each square in the squares arr. it listens for certain drag and drop e and calls the functions when those e happen
        square.addEventListener('dragstart', dragStart) // when player starts dragging a square dragStart runs
        square.addEventListener('dragover', dragOver) // when dragged item is moved over a square dragOver runs
        square.addEventListener('dragenter', dragEnter) // when a dragged item enters a square dragEnter runs
        square.addEventListener('drop', dragDrop) // when the dragged item is dropped on a square dragDrop runs
        square.addEventListener('dragend', dragEnd) // when the drag finishes dragEnd runs
    })

    startTimer()
    gameLoop()

    function gameLoop() {
        if (!gameActive) return;
        const rowMatch = checkRowForThree()
        const colMatch = checkColumnForThree()

        if (rowMatch || colMatch) {
            moveFacesDown()

            setTimeout(() => {
                refillTopRow()
                gameLoop()
            }, 300)
        } else {
            setTimeout(gameLoop, 100)
        }
    }




})
// this is part of my boiler plate set up