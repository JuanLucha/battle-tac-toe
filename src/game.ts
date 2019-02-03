import * as PIXI from 'pixi.js'

export class Game {
  private app
  constructor() {}

  public start(): void {
    let height: number = window.innerHeight
    let width: number = window.innerWidth

    this.app = new PIXI.Application({height: height, width: width});
    document.body.appendChild(this.app.view);
  }

}