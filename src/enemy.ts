export class Enemy {
  public id: number
  public playerNumber: number
  public sprite: PIXI.Sprite
  public texture: PIXI.Texture

  constructor(texture: PIXI.Texture, playerNumber: number, id: number) {
    this.id = id
    this.playerNumber = playerNumber
    this.texture = texture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.name = this.id.toString()
  }
}