import * as PIXI from 'pixi.js'
import { Weapon } from './weapon'

export class Ninja {
  public score: number
  public weapon: Weapon

  constructor(weaponTexture: PIXI.Texture) {
    this.score = 0
    this.weapon = new Weapon(weaponTexture)
  }
}