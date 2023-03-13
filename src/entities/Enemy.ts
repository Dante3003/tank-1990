import gameEvents from "../events/game";
import { GameScene } from "../scenes/Game";
import { randomInRange } from "../utils/random";
import { Bullet } from "./Bullet";
import Explosion from "./Explosion";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
  bullet!: Bullet;
  scene: GameScene;
  speed: number;
  direction!: number;
  moveInterval: number;
  fireInterval: number;
  constructor(
    scene: GameScene,
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number
  ) {
    super(world, x, y, "mainSpritesheet", "tank-yellow-1.png");
    this.scene = scene;
    this.scene.add.existing(this);

    this.speed = 0.8;
    this.setDisplaySize(32, 32);
    this.setSize(32, 32);

    this.moveInterval = setInterval(() => {
      this.direction = randomInRange(1, 4);
    }, 1500);
    this.fireInterval = setInterval(() => {
      this.fire();
    }, 1000 * randomInRange(1.2, 3.5));

    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: ({ bodyB, gameObjectB }) => {
        // @ts-ignore
        if (bodyB.label === "bullet" && gameObjectB?.owner !== "enemy") {
          const explosion = new Explosion(
            scene,
            // @ts-ignore
            this.x,
            // @ts-ignore
            this.y,
            2
          );
          scene.add.existing(explosion);
          // @ts-ignore
          bodyB?.gameObject?.destroy();
          this.die();
        }
      },
    });

    this.once("destroy", () => {
      clearInterval(this.moveInterval);
      clearInterval(this.fireInterval);
    });
  }
  protected preUpdate(): void {
    if (this.direction === 1) {
      this.x += this.speed;
      this.angle = 0;
    }
    if (this.direction === 2) {
      this.x -= this.speed;
      this.angle = -180;
    }
    if (this.direction === 3) {
      this.y -= this.speed;
      this.angle = -90;
    }
    if (this.direction === 4) {
      this.y += this.speed;
      this.angle = 90;
    }
  }
  fire() {
    if (!this.bullet?.active) {
      const fireOffset = new Phaser.Math.Vector2()
        .setToPolar(this.rotation - 90, 30)
        .rotate(Phaser.Math.PI2 / 3);
      this.bullet = new Bullet(
        this.scene,
        this.scene.matter.world,
        this.x + fireOffset.x,
        this.y + fireOffset.y,
        this.angle - 90,
        "enemy"
      );
      this.scene.add.existing(this.bullet);
    }
  }
  die() {
    gameEvents.emit("updateScore", 500);
    clearInterval(this.moveInterval);
    clearInterval(this.fireInterval);
    this.destroy();
  }
}
