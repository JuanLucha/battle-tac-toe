export class Enemy {
  public id: number
  public playerId: number
  public sprite: PIXI.Sprite
  public texture: PIXI.Texture

  constructor(texture: PIXI.Texture, playerId: number, id: number) {
    this.id = id
    this.playerId = playerId
    this.texture = texture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.name = this.id.toString()
  }

  public elimitate(): void {
    this.sprite.visible = false
  }
}