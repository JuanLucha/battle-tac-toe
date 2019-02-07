import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'
import { Weapon } from './weapon'

export class Ninja {
  public playerId: number
  public score: number
  public weapon: Weapon

  constructor(weaponTexture: PIXI.Texture, playerId: number) {
    this.playerId = playerId
    this.score = 0
    this.weapon = new Weapon(weaponTexture, playerId)
  }

  public attack(startPositionX: number, startPositionY: number, enemy: Enemy, afterAnimationCallback: Function): void {
    this.weapon.target = enemy
    this.weapon.resetState(startPositionX, startPositionY)
  }
}