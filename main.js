//this waits for the html to become fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')// i am telling my js file to look at my html file to grab the element with the class name grid
    const width = 8 //tellin my js file that i want the width to be 8 from now on
    const squares = []// keeps track of each square that's made and it gets stored in the empty array
    const agtFaces = [ //stores judges face images
        'url(images/sofia.png)',
        'url(images/simon.png)',
        'url(images/heidi.png)',
        'url(images/howie.png)',
        'url(images/terry.png)',
        'url(images/mel.png)'
    ]

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
    createBoard() // now we call the function to actually build the board and see if it works

    function dragStart(){
        faceBeingDragged = this.style.backgroundImage //faceBeingDropped has the faces of the judges stored in it's arr. this refers to the selected div/square that was just clicked and started being dragged
        squareIdBeingDragged = parseInt(this.id) // this.id gets the id of the attr. of the square being dragged
    }

    function dragOver(e){ //this function will run when a dragged item is moved over a drop target
        e.preventDefault() //this function allows the dragged item to be dropped on the target square
    }
    // both dragOver and dragEnter functions work together to allow the drop action

    function dragEnter(e){ // this runs when the dragged item enters a drop target
        e.preventDefault() // this allows the drop e to work on this square
    }
    
    function dragDrop(){ // this runs when you drop the dragged face onto another square
        faceBeingReplaced = this.style.backgroundImage // 
        squareBeingReplaced = parseInt(this.id) // gets the id of the square and converts it to a number for future use

        this.style.backgroundImage = faceBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = faceBeingReplaced // we set the square of the face dragged from to show the face replaced, swaps the 2 faces
    }

    function dragEnd(){ // runs when the drag operation finishes

    }

    squares.forEach(square => { // loops through each square in the squares arr. it listens for certain drag and drop e and calls the functions when those e happen
        square.addEventListener('dragstart', dragStart) // when player starts dragging a square dragStart runs
        square.addEventListener('dragover', dragOver) // when dragged item is moved over a square dragOver runs
        square.addEventListener('dragenter', dragEnter) // when a dragged item enters a square dragEnter runs
        square.addEventListener('dragdrop', dragDrop) // when the dragged item is dropped on a square dragDrop runs
        square.addEventListener('dragend', dragEnd) // when the drag finishes dragEnd runs
    })

    
   
})
// this is part of my boiler plate set up
