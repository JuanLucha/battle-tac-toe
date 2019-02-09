export class Enemy {
  public id: number
  public playerId: number
  public sprite: PIXI.Sprite
  public texture: PIXI.Texture

  private deathSound: Howl

  constructor(texture: PIXI.Texture, deathSound: Howl, playerId: number, id: number) {
    this.id = id
    this.playerId = playerId
    this.texture = texture
    this.deathSound = deathSound
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.name = this.id.toString()
  }

  public elimitate(): void {
    this.deathSound.play()
    this.sprite.visible = false
  }
}