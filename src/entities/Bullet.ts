import { GameScene } from "../scenes/Game";
import Explosion from "./Explosion";

export class Bullet extends Phaser.Physics.Matter.Sprite {
  speed: number;
  timeout!: number;
  owner: string;
  constructor(
    scene: GameScene,
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    angle: number,
    owner = "unknown"
  ) {
    super(world, x, y, "mainSpritesheet", "bullet.png", {
      angle: Phaser.Math.DegToRad(angle),
      friction: 0,
      frictionAir: 0,
      mass: 5,
      label: "bullet",
    });
    this.owner = owner;
    this.speed = 2;
    this.scene = scene;

    const initialVelocity = new Phaser.Math.Vector2(0, 0);
    this.setVelocity(initialVelocity.x, initialVelocity.y);

    this.thrustRight(0.08 * this.speed);
    this.scene.add.existing(this);

    this.scene.matterCollision.addOnCollideActive({
      objectA: this,
      callback: () => {
        this.explode();
      },
    });

    this.timeout = setTimeout(() => {
      this.explode();
    }, 2000);
  }

  explode() {
    if (!this.active) {
      return;
    }
    const explosion = new Explosion(this.scene, this.x, this.y);
    this.scene.add.existing(explosion);
    this.destroy();
    clearTimeout(this.timeout);
  }

  fire() {
    this.thrustRight(0.08 * this.speed);

    this.timeout = setTimeout(() => {
      this.explode();
    }, 2000);
  }
}
