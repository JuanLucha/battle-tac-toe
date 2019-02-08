import { Enemy } from './enemy'
import * as PIXI from 'pixi.js'
import { Weapon } from './weapon'

export class Ninja {
  public playerColor: number
  public playerId: number
  public score: number
  public weapon: Weapon

  constructor(weaponTexture: PIXI.Texture, playerId: number, playerColor: number) {
    this.playerColor = playerColor
    this.playerId = playerId
    this.score = 0
    this.weapon = new Weapon(weaponTexture, playerId)
  }

  public attack(startPositionX: number, startPositionY: number, enemy: Enemy, weapon: Weapon): void {
    weapon.resetState(startPositionX, startPositionY)
    weapon.target = enemy
  }
}