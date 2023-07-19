import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      currentControls: window.matchMedia ? "touch" : "keyboard",

      cameraSetup: false,

      setCameraSetup: (setup) => {
        set(() => {
          return { cameraSetup: setup };
        });
      },

      cameraTarget: { x: 0, y: 3, z: 3 },

      cameraPosition: { x: 0, y: 0, z: 0 },

      setCameraPosition: (position) => {
        set(() => {
          return { cameraPosition: position };
        });
      },

      cameraDistance: 1,

      setCameraDistance: (distance) => {
        set((state) => {
          const cameraPosition = { ...state.cameraPosition };

          cameraPosition.x = (distance * 10) / 7;
          cameraPosition.z = (distance * 7) / 10;

          state.setCameraPosition(cameraPosition);

          return {
            cameraDistance: distance,
          };
        });
      },

      increaseCameraDistance: () => {
        set((state) => {
          const cameraDistance = state.cameraDistance;

          if (cameraDistance < 2) {
            const newCameraDistance = cameraDistance + 0.1;
            state.setCameraDistance(newCameraDistance);
          }
        });
      },

      decreaseCameraDistance: () => {
        set((state) => {
          const cameraDistance = state.cameraDistance;

          if (cameraDistance > 0) {
            const newCameraDistance = cameraDistance - 0.1;
            state.setCameraDistance(newCameraDistance);
          }
        });
      },

      nipplePos: { x: 0, y: 0 },

      setNipplePos: ({ x, y }) => {
        set(() => {
          return { nipplePos: { x, y } };
        });
      },

      resetNipplePos: () => {
        set(() => {
          return { nipplePos: { x: 0, y: 0 } };
        });
      },

      bombPressed: false,

      setBombPressed: (pressed) => {
        set(() => {
          return { bombPressed: pressed };
        });
      },

      lastBomb: 0,

      setLastBomb: (time) => {
        set(() => {
          return { lastBomb: time };
        });
      },

      switchControls: () => {
        set((state) => {
          return state.currentControls === "touch"
            ? { currentControls: "keyboard" }
            : { currentControls: "touch" };
        });
      },
    };
  })
);
