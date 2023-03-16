import { GameScene } from "../scenes/Game";
import { Bullet, BulletGroup } from "./Bullet";

export type TInputs = {
  up: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  fire: Phaser.Input.Keyboard.Key;
};

export default class Tank extends Phaser.Physics.Arcade.Sprite {
  inputs: TInputs;
  speed: number;
  bullet: Bullet | undefined;
  bulletGroup: BulletGroup;
  fired: boolean;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bulletGroup: BulletGroup
  ) {
    super(scene, x, y, "mainSpritesheet", "tank-yellow-1.png");
    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.speed = 90;
    this.fired = false;
    this.bulletGroup = new BulletGroup(this.scene);

    this.inputs = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      fire: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      ),
    };
  }
  preUpdate(): void {
    if (this.inputs.right.isDown) {
      this.angle = 0;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    } else if (this.inputs.left.isDown) {
      this.angle = -180;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    } else if (this.inputs.up.isDown) {
      this.angle = -90;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    } else if (this.inputs.down.isDown) {
      this.angle = 90;
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.speed,
        this.body.velocity as Phaser.Math.Vector2
      );
    } else {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        0,
        this.body.velocity as Phaser.Math.Vector2
      );
    }

    if (this.inputs.fire.isDown && !this.fired) {
      this.fire();
      this.fired = true;
    }
  }

  fire() {
    this.anims.play("tankMove");
    const fireOffset = new Phaser.Math.Vector2()
      .setToPolar(this.rotation - 90, 15)
      .rotate(Phaser.Math.PI2 / 3);
    this.bulletGroup.shoot(
      this.x + fireOffset.x,
      this.y + fireOffset.y,
      this.angle,
      () => {
        this.fired = false;
      },
      "player"
    );
  }
}
