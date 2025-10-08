import { useEffect, useState } from "react";
import "../styles/GameBoard.css";
import {
  generateRandomNumbersSet,
  randomShuffleArray,
} from "../helpers/helperFunctions";
import { ScoreCard } from "./ScoreCard";
import { PlayCard } from "./PlayCard";
import { CardSpace } from "./CardSpace";
import { SliderOptionInput } from "./SliderOptionInput";

const CARD_LIST_URL =
  "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100000";
const difficultyOptions = ["easy", "normal", "hard"];
const cardsByDifficulty = new Map([
  ["easy", 2 * 2],
  ["normal", 3 * 3],
  ["hard", 4 * 4],
]);

export function GameBoard() {
  const [playCardDeck, setPlayCardDeck] = useState([]);
  const [roundStatus, setRoundStatus] = useState("setup"); // "setup" || "playing" || "won" || "lost"
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("normal"); // "easy" || "normal" || "hard"

  function handleStartRoundButtonClick() {
    const randomCardIdDraw = [
      ...generateRandomNumbersSet(
        cardsByDifficulty.get(difficulty),
        0,
        playCardDeck.length - 1
      ),
    ];
    setPlayCardDeck(
      playCardDeck.map((card) =>
        randomCardIdDraw.includes(card.id) ? { ...card, isDrawn: true } : card
      )
    );
    setRoundStatus("playing");
  }

  function handleNewRestartRoundButtonClick() {
    setPlayCardDeck(playCardDeck.map((card) => ({ ...card, isDrawn: false })));
    setScore(0);
    setRoundStatus("setup");
  }

  function handleDifficultyChange(e, newOption) {
    setDifficulty(newOption);
  }

  function handlePlayCardClick(e) {
    if (roundStatus === "playing") {
      const clickedPlayCardId = Number.parseInt(e.currentTarget.dataset.id);
      if (
        playCardDeck.find((card) => card.id === clickedPlayCardId).clickCount >
        0
      )
        setRoundStatus("lost");
      else {
        const newScore = score + 1;
        setScore(newScore);
        if (newScore === cardsByDifficulty.get(difficulty))
          setRoundStatus("won");
      }

      setPlayCardDeck(
        playCardDeck.map((card) => {
          return card.id !== clickedPlayCardId
            ? card
            : { ...card, clickCount: card.clickCount + 1 };
        })
      );
    }
  }

  useEffect(() => {
    fetch(CARD_LIST_URL)
      .then((response) => response.json())
      .then((data) => {
        const cardDetailsArray = data.results;

        setPlayCardDeck(
          cardDetailsArray.map((result, index) => ({
            id: index,
            name: result.name,
            url: result.url,
            clickCount: 0,
            isDrawn: false,
          }))
        );
      })
      .catch((error) =>
        alert(
          `Error fetching Pokemon list:, ${error}. Please reload the page to try again.`
        )
      );
  }, []);

  return playCardDeck.length === 0 ? (
    "Retrieving playcards"
  ) : (
    <div className="gameboard">
      <header className="gameboard-header">
        {roundStatus === "setup" ? (
          <>
            <SliderOptionInput
              initialOption={difficulty}
              options={difficultyOptions}
              labelText="Difficulty"
              onChange={handleDifficultyChange}
            />
            <button type="button" onClick={handleStartRoundButtonClick}>
              Start Round
            </button>
          </>
        ) : (
          <button type="button" onClick={handleNewRestartRoundButtonClick}>
            New/Restart Round
          </button>
        )}
        <ScoreCard score={score} />
      </header>
      <div className="playcard-container">
        {roundStatus === "setup"
          ? Array(cardsByDifficulty.get(difficulty))
              .fill()
              .map((element, index) => <CardSpace key={index} />)
          : roundStatus === "win"
            ? "YOU WIN"
            : randomShuffleArray(
                playCardDeck
                  .filter((card) => card.isDrawn === true)
                  .map((card) => (
                    <PlayCard
                      key={card.id}
                      id={card.id}
                      url={card.url}
                      name={card.name}
                      clickCount={card.clickCount}
                      handlePlayCardClick={handlePlayCardClick}
                    />
                  ))
              )}
      </div>
    </div>
  );
}
