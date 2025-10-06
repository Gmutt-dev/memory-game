import { useEffect, useState } from "react";
import "../styles/PlayCard.css";

export function PlayCard({ url, name, handlePlayCardClick }) {
  const [imgUrl, setImgUrl] = useState();
  const [loadStatus, setLoadStatus] = useState("loading");

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setImgUrl(data.sprites.front_shiny);
        setLoadStatus("success");
      })
      .catch(() => setLoadStatus(`error`));
  });

  return (
    <div className="playcard" onClick={handlePlayCardClick}>
      {(() => {
        switch (loadStatus) {
          case "loading":
            return <p>"Loading..."</p>;
          case "error":
            return <p>"Error while loading"</p>;
          case "success":
            return (
              <>
                <img src={imgUrl} alt={`Image of ${name.toUpperCase()}`} />
                <p>{name.toUpperCase()}</p>
              </>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
