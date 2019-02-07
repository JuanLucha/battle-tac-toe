import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'

const stepSize: number = 30

export class Weapon {
  public playerId: number
  public rotation: number = 0
  public sprite: PIXI.Sprite
  public target: Enemy
  public texture: PIXI.Texture

  constructor(texture: PIXI.Texture, playerId: number, rotation: number = 0) {
    this.playerId = playerId
    this.rotation = rotation
    this.texture = texture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(400, 400)
    this.sprite.scale.set(0.1, 0.1)
  }

  public clone(): Weapon {
    return new Weapon(this.texture.clone(), this.playerId, this.rotation)
  }

  public moveToTarget(): void {
    console.log(this.targetIsUp(), )
    if (this.targetIsRight()) {
      this.sprite.x += stepSize
    } else if (this.targetIsLeft()) {
      this.sprite.x -= stepSize
    }
    if (this.targetIsUp()) {
      this.sprite.y -= stepSize
    } else if (this.targetIsDown()) {
      this.sprite.y += stepSize
    }
  }

  public resetPosition(x: number, y: number): void {
    this.sprite.x = x
    this.sprite.y = y
  }

  public rotate(rotationAmount: number): void {
    this.sprite.rotation += rotationAmount
  }

  private targetIsDown(): boolean {
    return this.sprite.y < this.target.sprite.y + this.target.sprite.parent.y + this.target.sprite.height / 2
  }

  private targetIsLeft(): boolean {
    return this.sprite.x > this.target.sprite.x + this.target.sprite.parent.x + this.target.sprite.width / 2
  }

  private targetIsRight(): boolean {
    return this.sprite.x < this.target.sprite.x + this.target.sprite.parent.x + this.target.sprite.width / 2
  }

  private targetIsUp(): boolean {
    return this.sprite.y > this.target.sprite.y + this.target.sprite.parent.y + this.target.sprite.height / 2
  }
}