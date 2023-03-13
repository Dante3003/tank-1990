export function createExplosionAnimation(
  animator: Phaser.Animations.AnimationManager
) {
  animator.create({
    key: "explosion",
    frames: animator.generateFrameNames("mainSpritesheet", {
      prefix: "explosion-",
      start: 1,
      end: 3,
      suffix: ".png",
    }),
    frameRate: 24,
    repeat: 0,
  });
}

export function createFlashAnimation(
  animator: Phaser.Animations.AnimationManager
) {
  animator.create({
    key: "flashLight",
    frames: animator.generateFrameNames("mainSpritesheet", {
      prefix: "flash-",
      start: 1,
      end: 4,
      suffix: ".png",
    }),
    frameRate: 12,
  });
}
