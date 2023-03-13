import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  create() {
    const text = this.add.text(
      +this.game.config.width / 2,
      +this.game.config.height / 2,
      "Game Over",
      {
        fontSize: "44px",
      }
    );
    text.setOrigin(0.5, 0.5);
  }
}
