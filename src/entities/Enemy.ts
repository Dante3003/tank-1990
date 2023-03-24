import gameEvents from "../events/game";
import { GameScene } from "../scenes/Game";
import { randomInRange } from "../utils/random";
import { Bullet, BulletGroup } from "./Bullet";
import Explosion from "./Explosion";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  bullet!: Bullet;
  scene: GameScene;
  speed: number;
  direction!: number;
  moveInterval: number;
  fireInterval: number;
  bulletGroup: BulletGroup;
  fired: boolean;
  constructor(
    scene: GameScene,
    x: number,
    y: number,
    bulletGroup: BulletGroup
  ) {
    super(scene, x, y, "mainSpritesheet", "tank_basic-1.png");
    this.scene = scene;
    this.bulletGroup = bulletGroup;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.speed = 80;
    this.fired = false;

    this.moveInterval = setInterval(() => {
      this.direction = randomInRange(1, 4);
    }, 1500);
    this.fireInterval = setInterval(() => {
      this.fire();
    }, 1000 * randomInRange(1.2, 3.5));

    this.once("destroy", () => {
      clearInterval(this.moveInterval);
      clearInterval(this.fireInterval);
    });
  }
  protected preUpdate(): void {
    if (this.direction === 1) {
      this.angle = 0;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    }
    if (this.direction === 2) {
      this.angle = -180;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    }
    if (this.direction === 3) {
      this.angle = -90;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    }
    if (this.direction === 4) {
      this.angle = 90;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    }
  }
  fire() {
    if (!this.fired) {
      this.fired = true;
      const fireOffset = new Phaser.Math.Vector2()
        .setToPolar(this.rotation - 90, this.width / 2)
        .rotate(Phaser.Math.PI2 / 3);
      this.bulletGroup.shoot(
        this.x + fireOffset.x,
        this.y + fireOffset.y,
        this.angle,
        () => {
          this.fired = false;
        }
      );
    }
  }
  public die() {
    gameEvents.emit("updateScore", 500);
    clearInterval(this.moveInterval);
    clearInterval(this.fireInterval);
    const explosion = new Explosion(this.scene, this.x, this.y);
    this.scene.add.existing(explosion);
    this.destroy();
  }
}
