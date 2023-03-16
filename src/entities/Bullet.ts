import { GameScene } from "../scenes/Game";
import Explosion from "./Explosion";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  timeout!: number;
  owner: string;
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "mainSpritesheet", "bullet.png");
    this.speed = 200;
    this.scene = scene;
    this.owner = "unknown";

    this.scene.add.existing(this);

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

  shoot(x: number, y: number, angle: number, owner?: string): void {
    this.body.reset(x, y);
    this.owner = owner || this.owner;
    this.angle = Phaser.Math.DegToRad(angle);
    this.setActive(true);
    this.setVisible(true);
    this.setBounce(1, 1);
    this.scene.physics.velocityFromRotation(
      this.angle,
      this.speed,
      this.body.velocity
    );
    setTimeout(() => {
      this.destroy(true);
    }, 5000);
  }
}

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  hasActiveChild: boolean;
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      classType: Bullet,
      key: "bullet",
      active: false,
      visible: false,
    });
    this.maxSize = 5;

    this.hasActiveChild = false;
  }
  shoot(
    x: number,
    y: number,
    angle: number,
    onDestroy?: () => void,
    owner?: string
  ) {
    const bullet = this.get(x, y, "bullet") as Bullet;
    if (bullet) {
      this.hasActiveChild = true;
      bullet.shoot(x, y, angle, owner);
      bullet.once("destroy", () => {
        this.hasActiveChild = false;
        onDestroy?.();
      });
    }
  }
}
