import { createRef, useEffect, useState } from "react";
import { Joystick, onPlayerJoin } from "playroomkit";
import * as THREE from "three";

import mobileRevTriangle from "../assets/trianglerev.png";
import jumpIcon from "../assets/jump.png";
import bombIcon from "../assets/bomb.png";

import Character from "./Character";
import SocketPlayer from "./SocketPlayer";

export default function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    onPlayerJoin(async (player) => {
      const profile = player.getProfile();

      console.log("player joined: ", profile.name);

      const ref = createRef();

      const controls = new Joystick(player, {
        buttons: [
          { id: "jump", icon: jumpIcon },
          { id: "bomb", icon: bombIcon },
        ],
      });

      controls.config.buttons.forEach((button) => {
        button.css.border.height = "1000px";
        button.css.border.width = "100px";

        button.css.element.height = "120px";
        button.css.element.width = "120px";
      });

      const remotePlayer = (
        <SocketPlayer
          key={player.id}
          ref={ref}
          initialPosition={
            new THREE.Vector3(
              Math.floor(Math.random() * 10),
              1,
              Math.floor(Math.random() * 10)
            )
          }
          controls={controls}
        />
      );

      setPlayers((players) => [...players, remotePlayer]);

      player.onQuit(() => {
        console.log("player left: ", profile.name);

        setPlayers((players) => players.filter((p) => p.key !== player.id));
      });
    });
  }, []);

  return <group>{players}</group>;
}
