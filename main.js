//this waits for the html to become fully loaded
// console.log('DOM fully loaded')
document.addEventListener('DOMContentLoaded', () => {
    agtCrushGame()
})
function agtCrushGame() {
    const grid = document.querySelector(".grid")// i am telling my js file to look at my html file to grab the element with the class name grid
    const scorerDisplay = document.querySelector("#score")
    const width = 8 //tellin my js file that i want the width to be 8 from now on
    const squares = []// keeps track of each square that's made and it gets stored in the empty array
    let score = 0

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

    //this func builds grid
    function createBoard() {
        // console.log('Creating board')
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
    createBoard()

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

    function dragStart() {
        squareBeingDragged = this
        squareBeingDraggedId = parseInt(this.id)
        squareBeingDraggedImage = this.style.backgroundImage
        console.log("Drag start:", squareBeingDraggedId, squareBeingDraggedImage)
    }
    function dragOver(e) {
        e.preventDefault()
    }

    function dragEnter(e) {
        e.preventDefault()
    }

    function dragLeave() {

    }

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

    function dragDrop() {
        squareBeingReplaced = this
        squareBeingReplacedId = parseInt(this.id)
        squareBeingReplacedImage = this.style.backgroundImage
        console.log("Drag drop:", squareBeingReplacedId, squareBeingDraggedImage)
    }
    console.log(squareBeingDraggedId, squareBeingReplacedId)

    function dragEnd() {
        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const isValidMove = validMoves.includes(squareBeingReplacedId)

        console.log('Drag end:', {
            draggedId: squareBeingDraggedId,
            replaceID: squareBeingReplacedId,
            isValidMove: isValidMove
        })

        if (!squareBeingReplaced || isValidMove) {
            console.log('Invalid move, reverting...')
            if (squareBeingDragged && squareBeingReplaced) {
                squares[squareBeingDraggedId].style.backgroundImage = squareBeingDraggedImage
                squares[squareBeingReplacedId].style.backgroundImage = squareBeingReplacedImage
            }
            resetDragVars()
            return
        }
        // this swaps images temporarily
        squares[squareBeingDraggedId].style.backgroundImage = squareBeingReplacedImage
        squares[squareBeingReplacedId].style.backgroundImage = squareBeingDraggedImage

        // this checks for matches
        const isMatch = isMatchFound()
        console.log('Match found:', isMatch)

        if (!isMatch) {
            console.log('No match, reverting... swap')
            squares[squareBeingDraggedId].style.backgroundImage = squareBeingDraggedImage
            squares[squareBeingReplacedId].style.backgroundImage = squareBeingReplacedImage
        } else {
            console.log('Match found! Move accepted.')
            moveFacesDown()
        }
        resetDragVars
    }

    function resetDragVars() {
        squareBeingDragged = null
        squareBeingReplaced = null
        squareBeingDraggedId = null
        squareBeingReplacedId = null
        squareBeingDraggedImage = null
        squareBeingReplacedImage = null
    }

    function getJudgeName(imageUrl) {
        if (!imageUrl || imageUrl === "") return ""
        const match = imageUrl.match(/\/images\/(.*?)\./)
        return match ? match[1] : ""
    }
    console.log(getJudgeName('url("./images/simon.png")'))

    function moveFacesDown() {
        let moved
        do {
            moved = false
            for (let i = (width * width) - width - 1; i >= 0; i--) {
                if (squares[i + width].style.backgroundImage === "" && squares[i].style.backgroundImage !== "") {
                    console.log(`Moving piece from ${i} down to ${i + width}`)
                    squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                    squares[i].style.backgroundImage = ""
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


    function getBuzzerType(imageUrl) {
        if (!imageUrl) return ""

        const match = imageUrl.match(/\/([a-z]+)-buzzer\.(png|jpg|jpeg)/i)
        const result = match ? match[1] : ""

        console.log("Extracted buzzer from:", imageUrl, "→", result) //find another way to console.log
        return result
    }
    console.log(getBuzzerType('url("./images/golden-buzzer.jpg")'))

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
                squares[i].style.backgroundImage = ""
                squares[i].dataset.special = ""
                console.log(`Cleared square at index ${i}`)
            }
        })
    }
    activateAgtFaces()

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
    activateBuzzerBlast()


    function checkRowForFive() {
        const notValid = []
        for (let i = 0; i < 64; i++) {
            if (i % width > width - 5) notValid.push(i)
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
                    squares[index].style.backgroundImage = ""
                })
                return true
            }
        }
        return false
    }


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


    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedFace = squares[i].style.backgroundImage
            const isBlank = decidedFace === ""

            const notValid = [
                5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31,
                37, 38, 39, 45, 46, 47, 53, 54, 55
            ]
            if (notValid.includes(i)) continue

            if (rowOfFour.every(index =>
                squares[index].style.backgroundImage === decidedFace && !isBlank
            )) {
                console.log("Row of Four at:", rowOfFour)

                score += 4
                scorerDisplay.innerHTML = score

                const buzzerImage = agtBuzzer[Math.floor(Math.random() * agtBuzzer.length)]

                const specialIndex = rowOfFour[Math.floor(Math.random() * 4)]
                squares[specialIndex].style.backgroundImage = buzzerImage
                squares[specialIndex].dataset.special = "buzzer"

                console.log("Buzzer created at index", specialIndex, ":", buzzerImage)

                rowOfFour.forEach(index => {
                    if (index !== specialIndex) {
                        squares[index].style.backgroundImage = ""
                        squares[index].dataset.special = ""
                    }
                })
            }
        }
    }



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
            }
        }
    }


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
                    squares[index].style.backgroundImage = ""
                })
                return true
            }
        }
        return false // makes sure to return false if no match is found
    }


    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const judgeImage = squares[i].style.backgroundImage
            const isBlank = judgeImage === ""

            const judgeName = getJudgeName(judgeImage)

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
            }
        }
    }


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
                        squares[index].style.backgroundImage = ""
                    })
                    return true
                }
            }

        }
        return false
    }

    window.setInterval(function () {

        checkColumnForFive()
        checkRowForFive()
        checkLShape()
        checkColumnForFour()
        checkRowForFour()
        checkColumnForThree()
        checkRowForThree()
        moveFacesDown()

    }, 100)





}
