import * as PIXI from 'pixi.js'
import { Weapon } from './weapon'

export class Ninja {
  public playerNumber: number
  public score: number
  public weapon: Weapon

  constructor(weaponTexture: PIXI.Texture, playerNumber: number) {
    this.playerNumber = playerNumber
    this.score = 0
    this.weapon = new Weapon(weaponTexture, playerNumber)
  }
}