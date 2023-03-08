import { GameScene } from "../scenes/Game";
import { randomInRange } from "../utils/random";
import { Bullet } from "./Bullet";

const directions = {};

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
    super(world, x, y, "tank", "tankBody_red_outline");
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
    }, 1000 * randomInRange(0.5, 1.5));

    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: ({ bodyB }) => {
        // @ts-ignore
        if (bodyB.label === "bullet") {
          this.die();
        }
      },
    });
  }
  protected preUpdate(): void {
    console.log(this.direction);
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
        this.angle - 90
      );
      this.scene.add.existing(this.bullet);
    }
  }
  die() {
    clearInterval(this.moveInterval);
    clearInterval(this.fireInterval);
    this.destroy();
  }
}
