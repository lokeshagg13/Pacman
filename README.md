# 🌟 Pacman Game with Human and AI Modes 🕹️

## Overview

Welcome to the **React-based Pacman game**! 🟡 This project supports both **manual gameplay** and **AI-driven gameplay** with exciting features:

- 🧑‍💻 **User Mode:** Play manually with intuitive keyboard controls.
- 🤖 **Bot Mode:** Watch an AI bot learn to collect pellets and avoid ghosts. The bot leverages the **NEAT Algorithm** to evolve and improve.

---

## ✨ Features

- 🎮 **Dynamic Gameplay:** Switch between human and AI-controlled players.
- 🧠 **Training Mode:** Train the bot using NEAT for optimized performance.
- 🎨 **Interactive Interface:** Smooth visuals and intuitive controls for fun gaming.
- 🗺️ **Customizable Maps:** Design or modify maps using the blueprint configuration.

---

## 📂 File Structure

```plaintext
Pacman/
├── package.json               # 📦 Project dependencies and scripts
├── NEAT.md                    # 📄 NEAT algorithm implementation details
├── src/
│   ├── App.jsx                # 🏁 Main application entry point
│   ├── index.jsx              # ⚛️ ReactDOM rendering
│   ├── images/                # 🖼️ Game assets and icons
│   ├── logic/                 # 🔧 Core game logic
│   │   ├── bot/               # 🤖 Bot AI logic and pathfinding
│   │   ├── controllers/       # 🎮 Player and ghost controllers
│   │   ├── gameLoop.js        # 🔄 Main game loop
│   │   ├── simulator/         # 🏋️‍♂️ Bot training logic
│   │   └── world/             # 🌍 Map and world definitions
│   ├── components/            # 🖥️ React components
│   ├── store/                 # 📥 Contexts for game and simulator states
└── README.md                  # 📘 Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v16+) 🛠️
- **npm** or **yarn** 🧶

### 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/pacman-game.git
   cd pacman-game
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### ▶️ Running the Game

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` 🌐

---

## 🎮 Gameplay

### **User Mode** 🧑‍💻

- Use keyboard controls:

  - `W` or `Up Arrow`: ⬆️ Move Up
  - `A` or `Left Arrow`: ⬅️ Move Left
  - `S` or `Down Arrow`: ⬇️ Move Down
  - `D` or `Right Arrow`: ➡️ Move Right

- Goal: Collect all pellets and avoid ghosts! 👻

### **Bot Mode** 🤖

- Let the AI bot take over.
- The bot uses the NEAT algorithm to train and evolve its gameplay.
- Start the simulator to watch its progress.

### **Simulator** 🏋️‍♂️

- Access the simulator panel to:

  - 🔍 View bot training logs.
  - 📊 Monitor the bot's fitness scores.
  - ⏯️ Resume or pause training.

---

## 🧠 NEAT Algorithm

For detailed NEAT implementation and training parameters, refer to [NEAT.md](./resources/NEAT.md).

---

## 🛠️ Development Notes

### **Key Components**

- 🔧 **Game Logic:** Core gameplay handled in `logic/`.
- 🤖 **AI Training:** Uses `logic/simulator/` and `logic/bot/` for training the bot.
- 🖥️ **React Components:** UI elements and controls in `components/`.

### **Customization** ✏️

- 🗺️ **Game Maps:** Modify maps in `logic/world/data/blueprints.json`.
- 🎛️ **Config Parameters:** Adjust game parameters in `logic/gameConfig.js`. See [GAMECONFIG.md](./resources/GAMECONFIG.md) for details.
- 🤖 **Bot Training:** Update training settings in `logic/bot/config.js`.

---

## 🤝 Contributing

We ❤️ contributions! Open issues or submit pull requests to improve this project.

---

## 📜 License

This project is licensed under the MIT License.
