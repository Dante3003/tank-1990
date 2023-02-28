import Phaser from "phaser";

import { GameScene } from "./scenes/Game";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 880,
  height: 700,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [GameScene],
};

export default new Phaser.Game(config);
