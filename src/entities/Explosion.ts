export default class Explosion extends Phaser.Physics.Matter.Sprite {
  emitter: any;
  constructor(scene: Phaser.Scene, x: number, y: number, scale = 1) {
    super(scene.matter.world, x, y, "mainSpritesheet", "explosion-1.png", {
      isSensor: true,
      isStatic: true,
    });
    this.setScale(scale);

    // this.emitter = this.scene.explosionParticles.createEmitter({
    //   x: x,
    //   y: y,
    //   speed: { min: -200, max: 200 },
    //   angle: { min: 0, max: 360 },
    //   alpha: { start: 1, end: 0 },
    //   scale: { start: 1 + scale * 0.5, end: 0.3 },
    //   lifespan: 300 * scale,
    // });
    // this.emitter.explode(20 * scale);

    // scene.sound.play('explosion1', {
    //     volume: 0.3 + scale * 0.3,
    //     rate: Phaser.Math.RND.realInRange(1.9, 2.3) - scale * 0.5,
    //     detune: Phaser.Math.RND.realInRange(-100, 100) - scale * 500,
    // })

    // scene.cameras.main.shake(100 * scale, 0.008 * (1 + scale * 0.3));

    this.anims.play("explosion");
    this.once("animationcomplete", () => {
      this.destroy();
    });
  }
}
