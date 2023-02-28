import { GameScene } from "../scenes/Game";

export class Bullet extends Phaser.Physics.Matter.Sprite {
  speed: number;
  timeout: number;
  constructor(
    scene: GameScene,
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    angle: number
  ) {
    super(world, x, y, "bullet", undefined, {
      angle: Phaser.Math.DegToRad(angle),
      friction: 0,
      frictionAir: 0,
      mass: 5,
    });
    this.speed = 2;

    const initialVelocity = new Phaser.Math.Vector2(0, 0);

    this.setVelocity(initialVelocity.x, initialVelocity.y);
    this.thrustRight(0.08 * this.speed);

    this.timeout = setTimeout(() => {
      this.explode();
    }, 2000);

    this.setOnCollide(() => {
      this.explode();
    });
  }

  explode() {
    this.destroy();
    clearTimeout(this.timeout);
  }
}
