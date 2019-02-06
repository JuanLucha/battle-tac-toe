import * as PIXI from 'pixi.js'

export class Weapon {
  public playerId: number
  public rotation: number = 0
  public sprite: PIXI.Sprite
  public texture: PIXI.Texture

  constructor(texture: PIXI.Texture, playerId: number, rotation: number = 0) {
    this.playerId = playerId
    this.rotation = rotation
    this.texture = texture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(400, 400)
  }

  public clone(): Weapon {
    return new Weapon(this.texture.clone(), this.playerId, this.rotation)
  }

  public rotate(rotationAmount: number): void {
    this.sprite.rotation += rotationAmount
  }
}