import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import "./index.css";
import React from "react";
import { create } from "../../src/react";

import mascot from "./assets/zustand-mascot.svg";

import "./index.css";

const useStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

const Counter = () => {
  const count = useStore((s) => s.count);
  const inc = useStore((s) => s.inc);

  return (
    <>
      <span className="text-3xl">{count}</span>
      <button className="bg-[#252b37] font-bold py-2 px-4 rounded" onClick={inc}>
        +1
      </button>
    </>
  );
};

function App() {
  return (
    <div className="grid place-items-center gap-6">
      <a href="https://zustand-demo.pmnd.rs/" target="_blank" rel="noreferrer">
        <img
          src={mascot}
          alt="Zustand mascot"
          className="w-36"
          style={{
            filter: "drop-shadow(0 0 2em #582d3e)",
          }}
        />
      </a>

      <h1 className="text-5xl font-bold">Mini Zustand</h1>

      <Counter />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
