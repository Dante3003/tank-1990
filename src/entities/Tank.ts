import { GameScene } from "../scenes/Game";
import { Bullet } from "./Bullet";

export type TInputs = {
  up: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  fire: Phaser.Input.Keyboard.Key;
};

export default class Tank extends Phaser.Physics.Matter.Sprite {
  scene: GameScene;
  inputs: TInputs;
  speed: number;
  bullet: Bullet | undefined;
  constructor(
    scene: GameScene,
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number
  ) {
    super(world, x, y, "tank", "tankBody_blue_outline");
    this.scene = scene;
    this.scene.add.existing(this);
    // this.scene.matter.add.gameObject(this);
    this.speed = 0.8;

    // TODO: remove this lines
    this.setDisplaySize(50, 50);
    this.setSize(50, 50);
    // this.rotation = -Math.PI / 2;

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
  protected preUpdate(): void {
    if (this.inputs.right.isDown) {
      this.x += this.speed;
      this.angle = 0;
    } else if (this.inputs.left.isDown) {
      this.x -= this.speed;
      this.angle = -180;
    } else if (this.inputs.up.isDown) {
      this.y -= this.speed;
      this.angle = -90;
    } else if (this.inputs.down.isDown) {
      this.y += this.speed;
      this.angle = 90;
    }

    if (this.inputs.fire.isDown) {
      console.log(this.angle);
      if (this.bullet?.active) {
        return;
      }
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
}
