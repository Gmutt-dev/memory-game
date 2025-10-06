import { useEffect, useState } from "react";
import "../styles/GameBoard.css";
import { generateRandomNumbersSet } from "../helpers/helperFunctions";
import { ScoreCard } from "./ScoreCard";
import { PlayCard } from "./PlayCard";

const CARD_LIST_URL =
  "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100000";
const NUMBER_OF_PLAYCARDS = 6;

export function GameBoard() {
  const [playCardDeck, setPlayCardDeck] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [score, setScore] = useState(0);

  function handlePlayCardClick(e) {
    if (gameStatus === "playing") {
      const clickedPlayCardId = Number.parseInt(e.currentTarget.dataset.id);
      if (
        playCardDeck.find((card) => card.id === clickedPlayCardId).clickCount >
        0
      )
        setGameStatus("lost");
      else setScore((prev) => prev + 1);
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
        const firstRoundDraw = generateRandomNumbersSet(
          NUMBER_OF_PLAYCARDS,
          1,
          cardDetailsArray.length
        );
        setPlayCardDeck(
          cardDetailsArray.map((result, index) => ({
            id: index + 1,
            name: result.name,
            url: result.url,
            clickCount: 0,
            isDrawn: firstRoundDraw.has(index + 1) ? true : false,
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
    "Loading"
  ) : (
    <div className="gameboard">
      <ScoreCard score={score} />
      <div className="playcard-container">
        {playCardDeck
          .filter((card) => card.isDrawn === true)
          .map((card) => (
            <PlayCard
              key={card.id}
              id={card.id}
              url={card.url}
              name={card.name}
              handlePlayCardClick={handlePlayCardClick}
            />
          ))}
      </div>
    </div>
  );
}
