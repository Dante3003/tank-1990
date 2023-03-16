import Phaser from "phaser";

import { GameScene } from "./scenes/Game";
import { GameUI } from "./scenes/GameUI";
import { GameOver } from "./scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 880,
  height: 700,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [GameScene, GameUI, GameOver],
};

export default new Phaser.Game(config);
