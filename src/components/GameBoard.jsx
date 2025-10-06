import "../styles/GameBoard.css";

export function GameBoard() {
  return (
    <div className="gameboard">
      <ScoreCard />
      <div className="playcard-container">
        {/* mapped array of <PlayCard/>'s */}
      </div>
    </div>
  );
}
