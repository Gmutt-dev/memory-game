import { useEffect, useState, useMemo } from "react";
import "../styles/GameBoard.css";
import {
  generateRandomNumbersSet,
  randomShuffleArray,
} from "../helpers/helperFunctions";
import { ScoreCard } from "./ScoreCard";
import { PlayCard } from "./PlayCard";
import { PlayCardSpace } from "./PlayCardSpace";
import { SliderOptionInput } from "./SliderOptionInput";

const CARD_LIST_URL =
  "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100000";
const difficultyOptions = Object.freeze([
  "easy",
  "normal",
  "hard",
  "very hard",
]);
const DIFFICULTY_FACTOR = 4;
const MAX_PLAYCARDS = 1000;
const POKEBALL_IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

export function GameBoard() {
  const [playCardDeck, setPlayCardDeck] = useState([]);
  const [difficulty, setDifficulty] = useState("normal"); // "easy" || "normal" || "hard" || "very hard"

  const cardsByDifficulty =
    (difficultyOptions.indexOf(difficulty) + 1) * DIFFICULTY_FACTOR;

  const score = useMemo(
    () =>
      playCardDeck.reduce(
        (points, card) => (card.clickCount > 0 ? points + 1 : points),
        0
      ),
    [playCardDeck]
  );

  // "setup" || "playing" || "won" || "lost"
  const roundStatus = useMemo(() => {
    if (score === cardsByDifficulty) return "won";
    if (playCardDeck.some((card) => card.clickCount > 1)) return "lost";
    if (playCardDeck.some((card) => card.isDrawn)) return "playing";
    else return "setup";
  }, [playCardDeck, score, cardsByDifficulty]);

  function handleStartRoundButtonClick() {
    const randomCardIdDraw = [
      ...generateRandomNumbersSet(
        cardsByDifficulty,
        0,
        MAX_PLAYCARDS - 1 // limited, as high number cards don't necessarily have images available yet
      ),
    ];
    setPlayCardDeck(
      playCardDeck.map((card) =>
        randomCardIdDraw.includes(card.id) ? { ...card, isDrawn: true } : card
      )
    );
  }

  function handleNewRestartRoundButtonClick() {
    setPlayCardDeck(
      playCardDeck.map((card) => ({ ...card, isDrawn: false, clickCount: 0 }))
    );
  }

  function handleDifficultyChange(e, newOption) {
    setDifficulty(newOption);
  }

  function handlePlayCardClick(e) {
    if (roundStatus === "playing") {
      const clickedPlayCardId = Number.parseInt(e.currentTarget.dataset.id);

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
          <>
            <div className="placeholder"></div>
            <button type="button" onClick={handleNewRestartRoundButtonClick}>
              New/Restart Round
            </button>
          </>
        )}
        <ScoreCard score={score} />
      </header>
      <div className="playcard-container">
        {(() => {
          switch (roundStatus) {
            case "setup":
              return Array(cardsByDifficulty)
                .fill()
                .map((element, index) => <PlayCardSpace key={index} />);
            case "playing":
              return randomShuffleArray(
                playCardDeck
                  .filter((card) => card.isDrawn === true)
                  .map((card) => (
                    <PlayCard
                      key={crypto.randomUUID()} // Using random key instead of card.id to 'force' React to rerender on DOM after every card click, otherwise the CSS flip animation doesn't always work on all playcards
                      id={card.id}
                      url={card.url}
                      name={card.name}
                      backImgUrl={POKEBALL_IMAGE_URL}
                      clickCount={card.clickCount}
                      handlePlayCardClick={handlePlayCardClick}
                    />
                  ))
              );
            case "won":
              return "YOU WIN";
            case "lost":
              return playCardDeck
                .filter((card) => card.clickCount > 1)
                .map((card) => (
                  <PlayCard
                    key={card.id}
                    id={card.id}
                    url={card.url}
                    name={card.name}
                    clickCount={card.clickCount}
                    handlePlayCardClick={handlePlayCardClick}
                  />
                ));
          }
        })()}
      </div>
    </div>
  );
}
