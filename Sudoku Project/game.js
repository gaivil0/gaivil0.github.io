/**  Sudoku Generator + Solver + UI */

/** ---------- Establish Brand New Copy ---------- */
/** Grid represent a 2D array (a list of lists) where each row is a 1D array of 9 numbers */
/** Takes the 2D array "grid" and returns a brand-new (deepCopy) 2D array, where each row is a independent copy, so new changes to the copy won't affect the original */

function deepCopy(grid) {									/* function takes in one parameter name "grid" */
	return grid.map(function (row) {						/* .map() loops over every element of the "grid" array, collects all these new rows into a new array (which becomes deepCopy) */
		return row.slice();									/* .slice() makes shallow copies of every element of the "row" array */
	});
}

/** ---------- Check Core Rule of Sudoku ---------- */
/** Each 3×3 box must contain the numbers 1 through 9 exactly once — no repeats */
/** Math Explanation: rows 0, 1, 2 all give 0 (top box), rows 3, 4, 5 give 1 (middle box), rows 6, 7, 8 give 2 (bottom box) */
/** Checks if both cells have the same “box row index” AND the same “box column index” */
/** Later used in the Highlighter section */

function inSameBox(r, c, rr, cc) {							/* function takes in four parameters: (r, c) of the first cell; (rr, cc) of the second cell */
	return Math.floor(r / 3) === Math.floor(rr / 3) &&		/* divides the row number by 3 and rounds down */
		Math.floor(c / 3) === Math.floor(cc / 3);			/* divides the column number by 3 and rounds down*/
}															/* returns a boolean value (true or false) */

/** ---------- Safety Checks ---------- */
/** Is it okay to place num in this row/column/box? These functions scans each row/column/box and if the number already exist return false, else true */
/** grid[x][y] coordinates means: [x] = row index (0-8), [y] = column index(0-8) */
/** Math Explanation: 
 * Rows 0~2 → i % 3 is 0,1,2; i - (i % 3) becomes 0
 * Rows 3~5 → becomes 3
 * Rows 6~8 → becomes 6 
 * Same applies to the columns */
/* Later used in the fillRemaining() function */

function rowOK(grid, r, num) {
	for (let j = 0; j < 9; j++)								/* row check */
		if (grid[r][j] === num)								/* if the row already has "num" in any column j */
			return false;
	return true;
}

function colOK(grid, c, num) {								/* column check */
	for (let i = 0; i < 9; i++)								/* if the column already has "num" in any row i*/
		if (grid[i][c] === num)
			return false;
	return true;
}

function boxOK(grid, r0, c0, num) {							/* (r0, c0): the top-left cell of the 3×3 subgrid cell box for check */
	for (let i = 0; i < 3; i++)								/* i and j loops from 0 to 2, walking through every cell in that 3×3 area */
		for (let j = 0; j < 3; j++)
			if (grid[r0 + i][c0 + j] === num) return false;
	return true;
}

function safe(grid, i, j, num) {							/* combined saftey check: see math explanation above */
	return rowOK(grid, i, num) &&							/* (i % 3) and (j % 3) determines the coordinates of the top-left cell of the 3x3 box */
		colOK(grid, j, num) &&								/* outputs a boolean value */
		boxOK(grid, i - (i % 3), j - (j % 3), num);
}

/** ---------- Fill Functions ---------- */
/** Math Explanation: 
 * generates a number between [0,1); 
 * scale-up that number by multiplying 9 to it; 
 * rounds down to the nearest whole number; 
 * add 1 to shift index 0-8 to 1-9  */

function fillBox(grid, row, col) {							/* Fill one 3x3 subgrid with random numbers*/
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++) {
			let num;
			do {
				num = Math.floor(Math.random() * 9) + 1;	/* generates a random number in range [0, 9], see math explanation above */
			} while (!boxOK(grid, row, col, num));			/* keep generating random number until it comeup with one that isn't already used in that 3x3 box */
			grid[row + i][col + j] = num;					/* when a valid number is found, assign it to the current cell */
		}
}

/** The three 3x3 boxes lie on the main diagonal of the Sudoku board (top-left → center → bottom-right) 
 * They don’t share rows or columns with each other, so each box can be filled independently using only the boxOK rule (no row/column conflicts across them yet) 
 * After these are filled, the rest of the puzzle can be completed by backtracking (fillRemaining) with full row/col/box constraints */

function fillDiagonal(grid) {								/* this function loops i over 0, 3, 6 */
	for (let i = 0; i < 9; i += 3) fillBox(grid, i, i);		/* (i, i) represent top-left cell of the three boxes on the diagonal plane: (0, 0) (3, 3) (6, 6)*/
}

/** Backtrack & Recursion */

function fillRemaining(grid, i = 0, j = 0) {				/* */
	if (i === 9)											/* Rows have index 0~8; If i hits 9, it means the program passed the last row and that the grid is fully filled: success */
		return true;

	if (j === 9) 											/* Columns also have index 0~8; If j hits 9, the program moves to the (next row, column 0) */
		return fillRemaining(grid, i + 1, 0);				/* continue to fill the remaining cells; i + 1 is used to adjust index offset */

	if (grid[i][j] !== 0) 									/* if a cell is already filled with a number, skip to the next column*/
		return fillRemaining(grid, i, j + 1);

	for (let num = 1; num <= 9; num++) {					/* the program tries every number between 1~9 */
		if (safe(grid, i, j, num)) {						/* calls the safe() function created previously to check its placement against row, column, and 3x3 box constraints */
			grid[i][j] = num;								/* if safe() = true; put the number temporarily in that cell coordinate */
			if (fillRemaining(grid, i, j + 1))				/* if the recalled function returns true; it means successful path and stop here */
				return true;
			grid[i][j] = 0;									/* otherwise (deadend), backtrack: set that cell value back to 0; and try the next number */
		}
	}														/* backtrack and try the next number in the foor loop */
	return false;											/* outside the for-loop block, it only runs after the for loop has tried all numbers 1–9 and none worked */
}

/** ---------- Remove K Digits ---------- */
/** remove digits means replacing them with 0 to represent an empty cell */
/** The const keyword means that once a value is assigned to a const variable, its reference cannot be reassigned to a different value */
/** Math Explanation: 
 * row index "i" = integer division of idx by 9, rounds down to the nearest whole number
 * column index "j" = remainder after dividing idx by 9
 */

function removeKDigits(grid, k) {
	while (k > 0) {											/* keep looping until the prorgam removed exactly k amount of cells from the grid */
		const idx = Math.floor(Math.random() * 81);			/* generates a random number in range [0, 80], representing the 81 cells in the game board */
		const i = Math.floor(idx / 9), j = idx % 9;			/* maps the 1D cell index to the 2D grid coordinates (i, j); see math explanation */
		if (grid[i][j] !== 0) {								/* checks if the cell is not already empty */
			grid[i][j] = 0; k--;							/* set the grid number to 0 meaning empty; decrease k by 1*/
		}
	}
}

/** ---------- Generate puzzle ---------- */
/** Build a complete and valid Sudoku solution; Make a copy as the official solution; Make another copy and remove k numbers; return both */
/** The nullish coalescing ( ?? ) operator is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined */

function generatePuzzle(difficulty = "easy") {				/* function default difficulty is set to easy */
	const blanks = { easy: 35, medium: 45, hard: 55 };		/* how many cells to remove for each level of difficulty; define object's property names */
	const k = blanks[difficulty] ?? blanks.easy;			/* if blanks[difficulty] is undefined or null, fall back to blanks.easy */

	let completeBoard = [];									/* creates an empty array with variable name completeBoard */
	for (let rowIndex = 0; rowIndex < 9; rowIndex++) {		/* set rowIndex counter to 0, increment the counter by 1 while it's less than 9 */
		let rowArray = [];									/* this holds one row of the Sudoku board, will become a row with 9 zeros for now */
		for (let colIndex = 0; colIndex < 9; colIndex++) {	/* set colIndex counter to 0, increment the counter by 1 while it's less than 9 */
			rowArray.push(0);								/* add 0 to the end of the array, eventually having nine 0s in the row */
		}
		completeBoard.push(rowArray);						/* add the completed row arrays to the board */
	}

	fillDiagonal(completeBoard);							/* call the function to fill 3 diagonal 3x3 boxes */
	fillRemaining(completeBoard, 0, 0);						/* call the function to fill remaining cells */

	const solution = deepCopy(completeBoard);				/* create a new copy to be the official solution */
	const puzzle = deepCopy(completeBoard);					/* create another new copy to be th puzzle, so that "solution" stays untouched */
	removeKDigits(puzzle, k);								/* remove numbers from the puzzle board according to the selected difficulty */

	return { puzzle, solution };							/* return puzzle board and solution board wherever it is called */
}

/** ---------- UI ---------- */
/** Caching Document Object Model elements, so that you can call it once, store the result in a variable and then reuse it */

const boardEl = document.getElementById('board');			/* look up the element with id="board" (expected to be the Sudoku grid container) */
const difficultyEl = document.getElementById('difficulty');	/* cache the <select> element with id "difficulty" */
const btnNew = document.getElementById('newGame');			/* cache the "New Game" button element */
const btnSolve = document.getElementById('solve');			/* cache the "Solve" button element */
const btnClearErr = document.getElementById('clearErrors');	/* cache the “Clear Errors” button element (to remove red highlighted wrong input）*/

/** Global state holders that the UI and event listeners can always refer to without having to regenerate or re-fetch data */
/** Local variables puzzlewill die when the function ends, so if no variable anywhere is pointing to the 2D array, the memory is marked as unused and eventually freed */
/** Start with empty("null") until a puzzle is loaded */
let currentPuzzle = null;									/* the starting puzzle board that the player got at first */
let currentSolution = null;									/* instant answer check (right, wrong) */

/** ---------- Board Render ---------- */

function renderBoard(puzzle, solution) {
	boardEl.innerHTML = '';									/* clear the board container (boardEl) so we can render from scratch each time */
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			const cell = document.createElement('div');		/* create a <div> element to represent one grid cell visually */
			cell.className = 'cell';						/* assign the CSS class "cell" so it gets the correct board styling */
			cell.dataset.row = r;							/* store the row (r) and column (c) as data attributes on the <div> for later reference (like data-row="0" and data-col="3") */
			cell.dataset.col = c;

			const input = document.createElement('input');	/* create an <input> element inside the cell, allowing the user to type a number */
			input.setAttribute('inputmode', 'numeric');		/* suggest a numeric keyboard on mobile device */
			input.setAttribute('pattern', '[1-9]*');		/* add a pattern attribute that only allows digits 1–9 (no zero, no letters) */
			input.setAttribute('maxlength', '1');			/* restrict user to type only one character */

			if (puzzle[r][c] !== 0) {						/* check if the puzzle already has a given number in that cell coordinate */
				cell.classList.add('given');				/* add a "given" CSS class so that the given puzzle cells can be styles differently */
				input.value = puzzle[r][c];					/* fills the puzzle with given numbers */
				input.readOnly = true;						/* disable edit for given numbers */
			}

			/** Input typing: clean check + live check */
			input.addEventListener('input', (e) => {		/* add a listener for any change to the input */
				const v = e.target.value
					.replace(/[^1-9]/g, '');				/* take whatever the player typed and remove all non-1–9 characters using a regular expression */
				e.target.value = v;							/* update the input value to the cleaned version */
				cell.classList.remove('wrong', 'right');	/* clears any previous "wrong" or "right" class before re-checking the new value */
				if (v.length === 1) {						/* only check correctness if exactly one digit is present*/
					(Number(v) === solution[r][c]) 			/* compare the entered digit to the solution’s correct digit at (r, c) */
						? cell.classList.add('right') 		/* add "right" CSS class to cell */
						: cell.classList.add('wrong');		/* add "wrong" CSS class to cell */
				}
			});

			/** Highlight row/col/box for BOTH givens and editables */
			/** Aarrow function wrapper lets you call another function later, only when the event is detected, instead of calling it immediately during setup */

			input.addEventListener('focus', () => highlightRCB(r, c, cell));	/* when the input gains focus (clicked or selected by keyboard arrows), call highlightRCB(r, c, cell) to highlight */
			input.addEventListener('blur', clearHighlights);					/* when the input loses focus, remove any highlighting from the board */
			cell.addEventListener('click', () => highlightRCB(r, c, cell)); 	/* clicking the cell can also highlight */

			cell.appendChild(input);						/* place the <input> inside the <div> cell */
			boardEl.appendChild(cell);						/* add the completed cell to the board container */
		}
	}
}

/** ---------- Highlighter ---------- */

function highlightRCB(r, c, activeCell) {					/* function takes in three parameter: row index, column index, and the DOM element the user clicked on */
	clearHighlights();										/* get rid of any previous highligh so that highlighter won't overlap */
	const cells = boardEl.querySelectorAll('.cell');		/* get all cells from the parent board container*/
	cells.forEach(cell => {									/* loop through each cell */
		const rr = Number(cell.dataset.row);				/* extract its row index */
		const cc = Number(cell.dataset.col);				/* extract its column index */
		if (rr === r || cc === c ||
			inSameBox(r, c, rr, cc)) {						/* if any of these condition is true, the cell is a part of that highlight group */
			cell.classList.add('highlight');				/* apply "highlight" CSS style to cell */
		}
	});
	activeCell.classList.add('active-cell');				/* apply "active-cell" CSS style to cell */
}

function clearHighlights() {								/* remove "highlight" and "active-cell" CSS classes from the cell */
	boardEl.querySelectorAll('.cell').forEach(cell =>
		cell.classList.remove('highlight', 'active-cell')
	);
}

/** ---------- Clear Errors ---------- */

function clearErrors() {									/* remove wrong answers from the board */
	boardEl
		.querySelectorAll('.cell.wrong')					/* select all cell that currently have .wrong class */
		.forEach(cell => {									/* loop through each wrong cell */
			cell.classList.remove('wrong');					/* remove "wrong" CSS class from the cell */
			const input = cell.querySelector('input');		/* find the input inside the cell */
			if (input && !input.readOnly) 					/* if input exist and it is not a given number (read-only) */
				input.value = '';							/* clear the input value */
		});
}

/** ---------- New Game ---------- */

function newGame() {
	const diff = difficultyEl.value;						/* get the current difficulty setting */
	const { puzzle, solution } = generatePuzzle(diff);		/* run the function and unpack the returned object into two separate variables, "puzzle" and "solution" */
	currentPuzzle = puzzle;									/* store puzzle to a global variable */
	currentSolution = solution;								/* store solution to a global variable */
	renderBoard(puzzle, solution);							/* clear board UI, create the grid HTML, place numbers for givens, set up event listeners for empty cells */
}

/** ---------- Buttons ---------- */

btnNew.addEventListener('click', newGame);					/* New Game Button, when clicked run newGame() function */

btnSolve.addEventListener('click', () => {					/* Solve Button */
	if (!currentSolution) return;							/* if there’s no stored solution yet, stop immediately (maybe the game hasn’t started) */
	boardEl.querySelectorAll('.cell').forEach(cell => {		/* loop through every cell of the board */
		const r = Number(cell.dataset.row);					/* read the data-row attributes, convert them to numbers */
		const c = Number(cell.dataset.col);					/* read the data-col attributes, convert them to numbers */
		const input = cell.querySelector('input');			/* get the cell input element */
		input.value = currentSolution[r][c];				/* fill in correct answer */
		cell.classList.remove('wrong');						/* remove any "wrong" cell class */
		if (!cell.classList.contains('given'))
			cell.classList.add('right');					/* mark all player editable cells "right" so they visually all display black color */
	});
	clearHighlights();										/* remove highlight */
});

btnClearErr.addEventListener('click', clearErrors);			/* Clear Errors Button, when clicked run clearErrors() function */

/** ---------- Launch Game! ---------- */

newGame();

/** ---------- Game Success? ---------- */
/** Returns true if every cell is filled with the correct number (matches currentSolution) */

function isPuzzleSolved() {
	const cells = boardEl.querySelectorAll('.cell');		/* grab all board cells */
	for (const cell of cells) {
		const r = Number(cell.dataset.row);					/* read the data-row attributes, convert them to numbers */
		const c = Number(cell.dataset.col);					/* read the data-col attributes, convert them to numbers */
		const input = cell.querySelector('input');			/* find the input of the cell */
		if (!input) return false;							/* if the cell is missing input ("null"), return false */

		const val = input.value.trim();						/* remove whitespace at both ends of the user input, must be 1 digit entry between 1~9 */
		if (val === '' ||
			Number(val) !== currentSolution[r][c]) {		/* check with the solution board if anything is not matching, return false */
			return false;
		}
	}
	return true;											/* if the loop never fit a failure, return true */
}

/** ---------- Render Congrats Pop-up Window ---------- */

function renderCongrats() {

	/* Clear the board */
	boardEl.innerHTML = "";

	/* 1. Fullscreen confetti background */
	const confetti = document.createElement('div');
	confetti.className = 'confetti-bg';
	confetti.style.backgroundImage = "url('confetti.gif')"; /* <-- GIF sourcing path */
	document.body.appendChild(confetti);

	/* 2. Overlay content container */
	const overlay = document.createElement('div');
	overlay.className = 'congrats-overlay';
	overlay.style.background = '#ffffff';

	/* Title */
	const title = document.createElement('h2');
	title.textContent = 'Congratulations! 🎉';

	/* Cute Image */
	const centerImg = document.createElement('img');
	centerImg.src = 'sudokupics/J1.png'; /* <-- cute picture of Jigglypuff */
	centerImg.alt = 'Jigglypuff says congradulations';
	centerImg.style.width = '120px';
	centerImg.style.margin = '20px 0';

	/* Message */
	const msg = document.createElement('p');
	msg.innerHTML = 'You solved the puzzle perfectly! Ready for another one? <br> 完美解题！准备好再挑战一次了吗？';


	/* Button */
	const again = document.createElement('button');
	again.className = 'btn btn-pink mt-3';
	again.type = 'button';
	again.textContent = 'New Game';
	again.addEventListener('click', () => {
		document.body.removeChild(confetti);
		document.body.removeChild(overlay);
		newGame();
	});

	/* Assemble the overlay */
	overlay.appendChild(title);
	overlay.appendChild(centerImg);
	overlay.appendChild(msg);
	overlay.appendChild(again);

	/* Add overlay to body */
	document.body.appendChild(overlay);
}

/** ---------- Show Congrats Window? ---------- */
/** Check the board; if solved, clear highlights and shows the Congrats screen */

function maybeShowCongrats() {
	if (isPuzzleSolved()) {
		renderCongrats();
	}
}

/** ---------- Congrats Check & User Actions ---------- */

/* 1) After user typed input each time in the board, check if solved */
if (boardEl) {
	boardEl.addEventListener('input', () => {
		// Debounce a tick so the input value is finalized
		setTimeout(maybeShowCongrats, 0);
	});
}

/* 2) After clicking "Solve", the board is filled and show congrats window */
btnSolve.addEventListener('click', () => {
	// Allow your existing solve code to run first
	setTimeout(() => {
		if (isPuzzleSolved()) renderCongrats();
	}, 0);
});

/** ---------- Arrow Key & WASD Navigation ---------- */

function focusCell(r, c) {
	r = Math.max(0, Math.min(8, r));						/* clamp row into 0-8 */
	c = Math.max(0, Math.min(8, c));						/* clamp column into 0-8 */
	const cellEl = boardEl.querySelector(					/* JavaScript’s backtick + ${...} is like Python’s f-string */
		`.cell[data-row="${r}"][data-col="${c}"]`			/* find the cell with matching row index and column index */
	);

	const input = cellEl?.querySelector('input');			/* a safeguard that It stops crashes when the target cell / focus input isn’t found */

	if (input) {
		input.focus({ preventScroll: true });				/* focus without scorlling the page */
		if (!cellEl.classList.contains('given')) {			/* only select input if the cell is not a pre-filled given */
			setTimeout(() => input.select(), 0);			/* delay the .select() call so the input is fully focused before highlighting */
		}
	}
}

if (boardEl) {
	boardEl.addEventListener('keydown', (e) => {			/* listen for key presses anywhere inside the board */
		const targetInput =
			e.target.closest('.cell')						/* start with the element that triggered the event (e.target) and find the nearest class cell */
				?.querySelector('input');					/* if result is "null" stop right now, otherwise grab the actual editable field */

		if (!targetInput) return;							/* exit if not from a cell/input */

		const cell = targetInput.closest('.cell');			/* get the containing cell where event is detected */
		const r = Number(cell.dataset.row);					/* read the data-row attributes, convert them to numbers */
		const c = Number(cell.dataset.col);					/* read the data-column attributes, convert them to numbers */
		const key = e.key;									/* determine which key was pressed, use to decide what navigation to follow */

		if (
			key === 'ArrowUp' || key === 'w' || key === 'W' ||
			key === 'ArrowDown' || key === 's' || key === 'S' ||
			key === 'ArrowLeft' || key === 'a' || key === 'A' ||
			key === 'ArrowRight' || key === 'd' || key === 'D'
		) {
			e.preventDefault();								/* stop the caret from moving inside the input */
			let nr = r, nc = c;								/* start with current cell coordinates */

			switch (key) {									/* adjust nr and nc based on action direction */
				case 'ArrowUp': case 'w': case 'W': nr = r - 1; break;
				case 'ArrowDown': case 's': case 'S': nr = r + 1; break;
				case 'ArrowLeft': case 'a': case 'A': nc = c - 1; break;
				case 'ArrowRight': case 'd': case 'D': nc = c + 1; break;
			}

			if (nr < 0 || nr > 8 || nc < 0 || nc > 8) return; /* ignore moves that exceed the 9x9 board size */
			focusCell(nr, nc);								/* move focus to new coordinates */
		}

		// Enter = down / Shift+Enter = up
		if (key === 'Enter') {
			e.preventDefault();
			focusCell(r + (e.shiftKey ? -1 : 1), c);
		}

		// Tab = right / Shift+Tab = left
		if (key === 'Tab') {
			e.preventDefault();
			focusCell(r, c + (e.shiftKey ? -1 : 1));
		}
	});
}

console.log("yay! success!")