import "../styles/ScoreCard.css";
import { useState } from "react";
export function ScoreCard({ score }) {
  const [bestScore, setBestScore] = useState(0);
  if (score > bestScore) setBestScore(score);
  return (
    <div className="scorecard">
      <p>Current Score: {score} pts</p>
      <p>Best Score: {bestScore} pts</p>
    </div>
  );
}
