# Super Sudoku - User Manual

Super Sudoku is a browser-based, interactive Sudoku game with multiple difficulty levels, live correctness checking, keyboard navigation, and a little surprise window upon completion. It is implemented by using HTML, CSS, Bootstrap, and JavaScript.

---

## 📦 Project Structure

```
project-folder/
│
├── index.html          # Landing home page (introduction, words of encouragement, navigation)
├── game.html           # Game interface
├── game.js             # Game logic & UI handling
├── style.css           # Styles for landing page
├── gamestyle.css       # Styles for game page & Sudoku board
├── sudokupics/         # Folder for game images/icons
│     ├── sudoku1.png   # Sudoku logo
│     └── J1.png        # Jigglypuff image
├── confetti.gif        # Animation background
├── DESIGN.md           # Technical Implementations
└── README.md           # This documentation


```

All required assets (images, GIFs) should be in the same folder as referenced in the HTML/JS files.

---

## ⚙️ How to Run

1. **Download or clone the repository** to your local machine.
2. Ensure the folder structure is preserved, especially the `sudokupics/` and other image/GIF files.
3. Open `index.html` in your preferred web browser (double-click or right-click → “Open With” → Browser).
4. Click the **Start Now** button to navigate to the game page (`game.html`).


---

## 🕹️ How to Play

### **Starting a Game**
- On the game page, choose your difficulty from the dropdown:
  - **Easy Peasy** – 35 empty cells
  - **Normal** – 45 empty cells
  - **Sudoku Master** – 55 empty cells
- Click **New Game** to generate a fresh puzzle.

### **Controls**
- **Mouse:** Click a cell to enter a number, highlight its row, column, and 3×3 box.  
- **Keyboard:**
  - Type digits **1–9** to fill a cell.
  - **Arrow keys / WASD** to move between cells.
  - **Enter / Shift+Enter**: move down / up.
  - **Tab / Shift+Tab**: move right / left.

### **Features**
- **Live Correctness Check:** Numbers turn red if wrong, black if correct.
- **Clear Errors:** Removes all incorrect entries at once.
- **Solve:** Instantly fills the board with the correct solution.
- **Highlighting:** Active cell’s row, column, and box are highlighted for easier tracking.
- **Congrats Window:** When solved, a confetti animation and pop-up window appear.

---

## 🖌️ Customization

### **Styling**
- Colors, fonts, and layout can be modified in `gamestyle.css` and `style.css`.
- Board border colors and highlight colors are set in CSS variables at the top of `gamestyle.css`:
  ```css
  --pink-highlight: #ffe6f0;
  --pink-active: #ffd1e1;
  --grid-border: rgb(252, 136, 155);
  ```

### **Assets**
- Change the logo by replacing `sudokupics/sudoku1.png`.
- Change the celebration animation by replacing `confetti.gif`.
- Change the pop-up image by replacing `J1.png`.

---

## 🔍 Technical Notes

- **Puzzle Generation:** Uses backtracking to fill a valid Sudoku board, then removes `k` cells based on difficulty.
- **Solver:** Backtracking-based solution checker is also used for the “Solve” button.
- **UI Rendering:** All cells are dynamically generated in `renderBoard()` in `game.js`.
- **Responsiveness:** Layout adapts to different screen sizes using Bootstrap and `clamp()` in CSS.

---

## ❌ Troubleshooting

- **Board doesn’t load:**  
  Make sure `game.js` is properly linked in `game.html` and your browser allows running local JavaScript.
- **Missing images:**  
  Confirm all asset files (logo, GIF, pop-up image) are in the correct paths as referenced in HTML/JS.

---

## 👩‍💻 Credits

- Developed by **Olivia Gan**, 2025.  
- [Bootstrap 5](https://getbootstrap.com/) for responsive layout and UI components.
- GeeksforGeeks for Sudoku game algorithm reference
- ChatGPT for troubleshooting and explore more efficient approches
