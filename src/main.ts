import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

import { GameScene } from "./scenes/Game";
import { GameUI } from "./scenes/GameUI";
import { GameOver } from "./scenes/GameOver";

const pluginConfig = {
  // The plugin class:
  plugin: PhaserMatterCollisionPlugin,
  // Where to store in Scene.Systems, e.g. scene.sys.matterCollision:
  key: "matterCollision" as "matterCollision",
  // Where to store in the Scene, e.g. scene.matterCollision:
  mapping: "matterCollision" as "matterCollision",
};

declare module "phaser" {
  interface Scene {
    [pluginConfig.mapping]: PhaserMatterCollisionPlugin;
  }
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Scenes {
    interface Systems {
      [pluginConfig.key]: PhaserMatterCollisionPlugin;
    }
  }
}

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
  plugins: {
    scene: [pluginConfig],
  },
  scene: [GameScene, GameUI, GameOver],
};

export default new Phaser.Game(config);
