# Pacman Game with Human and AI Modes

## Overview

This is a **React-based Pacman game** that supports:

* **User Mode:** Play the game manually using keyboard controls.
* **Bot Mode:** Watch an AI bot navigate the map to collect all pellets while avoiding ghosts. The bot can be trained using the **NEAT (NeuroEvolution of Augmenting Topologies)** algorithm to improve its gameplay.

## Features

* **Dynamic Gameplay:** Supports both human players and AI bot-controlled players.
* **Training Mode:** Train the bot using NEAT to optimize its performance.
* **Interactive Interface:** Intuitive controls and visuals for an engaging experience.
* **Customizable Maps:** Maps can be designed or modified using the game's blueprint configuration.

## File Structure

```
Pacman/
├── package.json               # Project dependencies and scripts
├── NEAT.md                    # Details about NEAT algorithm implementation
├── src/
│   ├── App.jsx                # Main application entry point
│   ├── index.jsx              # ReactDOM rendering
│   ├── images/                # Game assets and icons
│   ├── logic/                 # Core game logic
│   │   ├── bot/               # Bot AI logic and pathfinding
│   │   ├── controllers/       # Player and ghost controllers
│   │   ├── gameLoop.js        # Main game loop
│   │   ├── simulator/         # Bot training logic and simulator
│   │   └── world/             # Map and world definitions
│   ├── components/            # React components for UI and gameplay
│   ├── store/                 # Contexts for game and simulator states
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

* **Node.js** (v16+)
* **npm** or **yarn**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/pacman-game.git
   cd pacman-game
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Game

1. Start the development server:

   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Gameplay

### User Mode

* Use keyboard controls:

  * `W` or `Up Arrow`: Move Up
  * `A` or `Left Arrow`: Move Left
  * `S` or `Down Arrow`: Move Down
  * `D` or `Right Arrow`: Move Right
* Collect all pellets to win while avoiding ghosts.

### Bot Mode

* Let the AI bot play the game.
* The bot uses the NEAT algorithm to train and improve its gameplay.
* Start the simulator to watch the bot learn and evolve.

### Simulator

* Access the simulator panel to:

  * View bot training logs.
  * Monitor the bot's fitness score and progress.
  * Resume or pause training.

## NEAT Algorithm

Refer to [NEAT.md](./NEAT.md) for detailed implementation and training parameters.

## Development Notes

### Key Components

* **Game Logic:** Core gameplay handled in `logic/`.
* **AI Training:** Uses `logic/simulator/` and `logic/bot/` for bot AI.
* **React Components:** UI and controls in `components/`.

### Customization

* Modify game maps in `logic/world/data/blueprints.json`.
* Adjust bot training parameters in `logic/bot/config.js`.

## Contributing

Feel free to open issues or submit pull requests to improve this project.

## License

This project is licensed under the MIT License.
