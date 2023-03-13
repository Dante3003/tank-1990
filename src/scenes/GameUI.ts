import { Scene } from "phaser";
import gameEvents from "../events/game";

export class GameUI extends Scene {
  score: number;
  constructor() {
    super({ key: "GameUI" });

    this.score = 0;
  }

  create() {
    const scoreLabel = this.add.text(+this.game.config.width / 2, 40, "0", {
      fontSize: "32px",
    });

    gameEvents.on("updateScore", (score: number) => {
      this.score += score;
      scoreLabel.text = this.score.toString();
    });

    gameEvents.on("gameOver", () => {
      const gameOverLabel = this.add.text(
        +this.game.config.width / 2,
        +this.game.config.height,
        "Game Over",
        {
          fontSize: "42px",
        }
      );
      gameOverLabel.setOrigin(0.5, 0.5);
      this.tweens.add({
        targets: gameOverLabel,
        y: +this.game.config.height / 2,
        ease: "Power1",
        duration: 3000,
        repeat: 0,
        onComplete: () => {
          this.scene.run("GameOver");
          this.scene.stop("GameScene");
          this.scene.stop("GameUI");
        },
      });
    });
  }
}
