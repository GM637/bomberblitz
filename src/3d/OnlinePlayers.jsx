import { createRef, useEffect, useState } from "react";
import { onPlayerJoin } from "playroomkit";

import SocketPlayer from "./SocketPlayer";

export default function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    onPlayerJoin(async (player) => {
      const ref = createRef();

      const currPlayer = (
        <SocketPlayer
          key={player.id}
          ref={ref}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          animation={"Idle"}
        />
      );

      setPlayers((players) => [...players, currPlayer]);

      player.onQuit(() => {
        setPlayers((players) => players.filter((p) => p === currPlayer));
      });
    });
  }, []);

  return <group>{players}</group>;
}
