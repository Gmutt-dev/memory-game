import "./App.css";
import { GameBoard } from "./components/GameBoard";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Memory Game</h1>
        <section>
          <p className="instructions">
            <span>Instructions:</span>
          </p>
          <ol className="instruction-list">
            <li>Click on any card to begin.</li>
            <li>Cards will be reshuffled on each selection.</li>
            <li>Do not select the same card twice!</li>
            <li>One point is awarded per unique card clicked.</li>
            <li>Game restarts if the same card is clicked twice.</li>
          </ol>
        </section>
      </header>
      <GameBoard />
    </div>
  );
}

export default App;
