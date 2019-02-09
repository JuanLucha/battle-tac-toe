import { Subject } from 'rxjs'
import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'

export class Weapon {
  public onEnemyHit: Subject<boolean> = new Subject()
  public hitTexture: PIXI.Texture
  public playerId: number
  public rotation: number = 0
  public sprite: PIXI.Sprite
  public target: Enemy
  public texture: PIXI.Texture

  constructor(texture: PIXI.Texture, hitTexture: PIXI.Texture, playerId: number, playerColor: number, rotation: number = 0) {
    this.playerId = playerId
    this.rotation = rotation
    this.texture = texture
    this.hitTexture = hitTexture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.tint = playerColor
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(400, 400)
    this.sprite.scale.set(weaponSize, weaponSize)
  }

  public clone(): Weapon {
    return new Weapon(this.texture.clone(), this.hitTexture.clone(), this.playerId, this.sprite.tint, this.rotation)
  }

  public moveToTarget(): void {
    if (this.sprite.scale.x > weaponSize) {
      this.sprite.scale.x -= 0.1
      this.sprite.scale.y -= 0.1

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
    } else {
      this.sprite.texture = this.hitTexture
      this.sprite.rotation = hitRotation
      this.onEnemyHit.next(true)
    }
  }

  public resetState(x: number, y: number): void {
    this.sprite.scale.set(3, 3)
    this.sprite.x = x
    this.sprite.y = y + this.sprite.height / 8
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

// Constants
const hitRotation: number = 4.5
const stepSize: number = 30
const weaponSize: number = 0.5
