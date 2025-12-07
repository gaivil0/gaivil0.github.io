# Super Sudoku - Design Concept

## 1. Overview

Super Sudoku is a browser-based web application built with **HTML**, **CSS**, **Bootstrap** and **JavaScript**.  
The project’s structure is organized to keep presentation and logic in separate files for easier maintenance.  
It provides an interactive Sudoku experience with puzzle generation, solving, and visual feedback, all running entirely in the browser.

---

## 2. Core Components

### **HTML**
- `index.html` – Landing page with title, short description, and navigation to the game, the user manual, and this document.
- `game.html` – Game page containing:
  - Toolbar for difficulty selection and action buttons.
  - An empty `#board` container that is filled by JavaScript.

### **CSS**
- `style.css` – Styles for the landing page.
- `gamestyle.css` – Styles for the game page, including:
  - CSS Grid layout for the 9×9 board.
  - Variables for color theming.
  - Classes for different cell states (`given`, `right`, `wrong`, `highlight`, `active-cell`).
  - Responsive scaling using CSS `clamp()` for fonts and elements.

### **JavaScript (`game.js`)**
- **Puzzle Generation**
  - Creates a complete Sudoku solution using a backtracking approach.
  - Fills the three diagonal 3×3 boxes first (`fillDiagonal`), then completes the rest of the grid (`fillRemaining`).
  - Removes a set number of cells (`removeKDigits`) depending on selected difficulty.
- **Rendering**
  - `renderBoard()` builds the board and sets up `<input>` elements for user input.
  - Coordinates are stored in `data-row` and `data-col` attributes for easier reference.
- **User Interaction**
  - **Highlighting**: `highlightRCB()` marks the selected cell’s row, column, and 3×3 box.
  - **Live correctness check**: Inputs are compared to the stored solution in real time.
  - **Error clearing**: `clearErrors()` removes incorrect entries while keeping correct ones.
  - **Keyboard navigation**: Supports Arrow keys, WASD, Enter, Tab, and their Shift variations.
- **Celebration Screen**
  - `renderCongrats()` displays a `confetti.gif` background and an overlay with a congratulatory image and message.
  - Triggered by `maybeShowCongrats()` once the puzzle is completed correctly.

---

## 3. Design Decisions

1. **Puzzle Creation Order**  
   The puzzle generation follows a two-phase approach:  
   - First, fill the three diagonal 3×3 boxes, since they don’t share rows or columns. This allows random number placement without additional row/column checks.  
   - Then, use a backtracking algorithm to fill the remaining cells, ensuring compliance with Sudoku rules (no duplicates in any row, column, or box).  

2. **Difficulty Selection**  
   Difficulty levels are implemented by changing the number of cells removed (`removeKDigits`).  
   This is a simple method:  
   - **Easier** more pre-filled given numbers  
   - **Harder** more empty spaces  

3. **Rendering Approach**  
   Each cell is created in JavaScript using `document.createElement()` rather than being hardcoded in HTML.  
   This allows:  
   - Re-rendering the entire board easily when starting a new game.  
   - Assigning data attributes (`data-row`, `data-col`) for cell identification without manual indexing.  
   - Binding event listeners at creation time for efficiency.

4. **Input Validation & Feedback**  
   Instead of validating the entire board periodically, each cell validates itself upon change (`input` event).  
   - Correct entries turn the text black (`right` class), incorrect ones turn red (`wrong` class).  
   - This approach avoids unnecessary checks on unchanged cells and gives immediate feedback to the player.

5. **Keyboard Navigation Design**  
   Supporting various keyboard navigation features ensures flexibility for different player habits.  
   - `Arrow Keys` + `WASD`
   - `Enter`/`Shift+Enter` and `Tab`/`Shift+Tab` add vertical and horizontal navigation shortcuts.  
   - Focus management uses `focusCell()` to ensure valid row/column indices and prevent crashes.

6. **Highlighting Mechanism**  
   The highlighting system identifies all cells in the same row, column, or box as the selected cell. This feature helps users to clearly see if a number will fit in that highlighted cell. 
   - Implemented with a single `highlightRCB()` function using the `inSameBox()` helper for box detection.  
   - Highlights are cleared before every new highlight to avoid stacking visual states.

7. **Clear Errors Function**  
   The **Clear Errors** button specifically targets cells marked `wrong`.  
   - It leaves correct player entries intact, preventing accidental loss of progress.  
   - Implemented by looping over `.cell.wrong` and clearing only editable cells (not given numbers).

8. **Celebration Overlay Design**  
   Instead of modifying the board directly, a full-screen overlay (`congrats-overlay`) is created and appended to `document.body`.  
   - Keeps the celebration independent from the board structure.  
   - Overlay can be removed cleanly before starting a new game.  
   - Using local assets (`confetti.gif`, `J1.png`) ensures consistent appearance across devices.

9. **Styling with CSS Grid**  
   The board uses `display: grid` with `grid-template-columns: repeat(9, 1fr)`.  
   - Allows equal cell sizing regardless of screen size.  
   - Thicker borders for 3×3 sections are applied via attribute selectors for clarity.

---

## 4. Potential Future Improvements

- **Smarter Difficulty Levels** – Base difficulty on puzzle logic complexity rather than number of blanks.
- **Move History** – Add undo and redo.
- **Game Timer** – Track how long each puzzle takes.
- **Save User Info** – Store the user’s unfinished puzzles and update their personal puzzle streak count.

---

## 5. Reference

In any Sudoku game, the most challenging and crucial element is puzzle generation, and I knew from the start that implementing an efficient algorithm wouldn’t be simple. 

To help myself get started, I turned to **GeeksforGeeks** as a trusted educational resource. Their articles clarified how backtracking operates in a grid-based puzzle and introduced the strategy of pre-filling diagonal boxes to minimize conflicts before the backtracking process completes the remaining cells.

For the visual design inspiration, I referenced many existing sudoku games. This helped me decide which usability features to include, like a highlight system and error clearing. From there, I continue to personalized everything.


