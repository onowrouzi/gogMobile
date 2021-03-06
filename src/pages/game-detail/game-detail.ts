import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Loading, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { GameResult } from '../../models/GameResult';
import { GamePrice } from '../../models/GamePrice';
import { WebViewProvider } from '../../providers/web-view/web-view';
import { GameQueryProvider } from '../../providers/game-query/game-query';

@Component({
  selector: 'page-game-detail',
  templateUrl: 'game-detail.html',
})
export class GameDetailPage {
  @ViewChild(Content) content: Content;
  game: GameResult;
  price: GamePrice;
  loaded: boolean;
  loadScreen: Loading;
  fullDescription: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private _viewCtrl: ViewController, private _gamesProvider: GameQueryProvider,
              private _sanitizer: DomSanitizer, private _webviewProvider: WebViewProvider) {
    this.loadScreen = loadingCtrl.create({content: 'Retrieving Game Info...'});
    this.loadScreen.present();
    this.price = this.navParams.get('price');
    const gameId = this.navParams.get('gameId');
    this.getGameDetail(gameId);
  }

  async getGameDetail(gameId) {
    this.game = (await this._gamesProvider.getGameDetail(gameId)) as GameResult;
    if (this.game.videos && this.game.videos.length > 0) {
      this.game.videos.forEach((v) => {
        v.video_url = this.trustSrc(v.video_url);
      });
    }
    if (this.game.screenshots && this.game.screenshots.length > 0) {
      this.game.screenshots.forEach((ss) => {
        ss.formatter_template_url = ss.formatter_template_url.replace('{formatter}', '200');
      });
    }
    this.loaded = true;
    this.loadScreen.dismiss();
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }

  trustSrc(src) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  goPurchase() {
    if (this.game && this.game.links && this.game.links.product_card) {
      this._webviewProvider.show(this.game.links.product_card);
    }
  }
}
