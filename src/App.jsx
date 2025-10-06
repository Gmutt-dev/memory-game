import "./App.css";
import { GameBoard } from "./components/GameBoard";

function App() {
  return (
    <div className="app">
      <h1>Memory Game</h1>
      <p>
        Click on any card to begin. Cards will be reshuffled on each selection.
        Do not select the same card twice!
      </p>
      <p>
        One point is awarded per unique card clicked. Game restarts if the same
        card is clicked twice.
      </p>
      <GameBoard />
    </div>
  );
}

export default App;
