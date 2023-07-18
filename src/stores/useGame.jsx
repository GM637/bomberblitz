import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      currentControls: window.matchMedia ? "touch" : "keyboard",

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
