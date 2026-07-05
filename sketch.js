/* sketch.js */
const gridContainer = document.getElementById("grid-container");
const MAX_CELL = 100;

let currentRow;
let currentCol;
let gridSize;

/**
 * Adds a cell to the colored class. This function will always target the current (x,y) positioned cell.
 */
function drawCurrentCell() {
    // Drawing is always according to the current row and column
    let drawCell = document.querySelector(`#cell-${currentRow}-${currentCol}`);
    if (!drawCell) return; // Do nothing if non-selected or invalid cell

    drawCell.classList.add("grid-cell-drawn");
}

/**
 * Handles a draw event when any of the arrow keys are pressed. Will proceed to "draw" one cell, then move the position
 * of the draw pointer
 * @param event The direction of the key pressed
 */
function handleDrawEvent(event) {
    if (
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
    ) {
        return;
    }

    event.preventDefault();

    // Then proceed to move the position of the draw pointer after drawing
    if (event.key === "ArrowUp") {
        currentRow--;
    } else if (event.key === "ArrowDown") {
        currentRow++;
    } else if (event.key === "ArrowLeft") {
        currentCol--;
    } else if (event.key === "ArrowRight") {
        currentCol++;
    } else {
        return; // Do nothing if not an arrow key
    }

    drawCurrentCell();

    // Bounds check: Make sure the draw pointer does not flow off the gird
    currentRow = Math.max(0, Math.min(currentRow, gridSize - 1));
    currentCol = Math.max(0, Math.min(currentCol, gridSize - 1));
}


/**
 * Creates a grid of square div cells in the specified DOM section.
 * @param {number} size the size of the grid to be created
 * @return {number} 0 on success, -1 on failure to create a grid
 */
function createGrid(size) {
    if (size > MAX_CELL || size <= 0) {
        console.log("ERROR. Grid size specified invalid.");
        return -1;
    }

    for (let row = 0; row < size; row++) {
        // Each row has 16 cells. Each column has 16
        let newRow = document.createElement('div');
        newRow.className = "grid-row";
        newRow.id = `row-${String(row)}`;
        gridContainer.append(newRow);

        for (let col = 0; col < size; col++) {
            let newCell = document.createElement('div');
            // newCell.textContent = `${String(col)}`; /* Debug */
            newCell.className = "grid-cell";
            newCell.id = `cell-${row}-${col}`;

            newRow.appendChild(newCell);
        }
    }

    // Then set the starting position of the "sketch pen". Etch-a-sketch always begins at the center of the pad
    gridSize = size;
    currentRow = Math.floor(gridSize / 2);
    currentCol = Math.floor(gridSize / 2);

    return 0;
}

/**
 * Resets a sketch grid to blank unhovered state. Removes any black cells from the grid
 */
function clearGrid() {
    // Returns a list of all DOM elements matching this selector
    const allCells = document.querySelectorAll(".grid-cell");

    allCells.forEach(cell => {
        cell.classList.remove("grid-cell-drawn");
    });
}

/**
 * Completely destroys and removes a grid from the DOM.
 */
function deleteGrid() {
    gridContainer.innerHTML = "";
}

/**
 * Completely resets the sketch grid, then prompts the user for a new grid size and creates one of that size.
 */
function resetSketch() {
    clearGrid();
    // Then proceed to ask user for new grid size, handle validation
    let input = prompt("Enter size of new sketchpad: ");
    deleteGrid();

    let size; /* Parsed input number */
    while (true) {
        if (input === null) {
            return; // user pressed Cancel
        }

        if (input.trim() === "") {
            input = prompt("Please enter a number:");
            continue;
        }

        // Now do number validation checks
        size = Number(input);

        if (!Number.isInteger(size)) {
            input = prompt("Please enter a whole number:");
            continue;
        }

        if (size <= 0 || size > 100) {
            input = prompt("Please enter a number between 1 and 100:");
            continue;
        }
        break;
    }
    createGrid(size);
}

/**
 * Runs the etch a sketch program!
 */
function main() {
    // Page starts off with a 16x16 grid.
    createGrid(16);

    // Install listener to enable draw functionality
    document.addEventListener("keydown", handleDrawEvent);

    // Install button function to clear th grid
    const resetButton = document.querySelector("#reset-button");
    const newButton = document.querySelector("#new-button");
    resetButton.addEventListener("click", clearGrid);
    newButton.addEventListener("click", resetSketch);

}

main();