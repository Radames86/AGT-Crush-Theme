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

   
})
// this is part of my boiler plate set up
