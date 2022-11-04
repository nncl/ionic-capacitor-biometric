import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { NativeBiometric } from 'capacitor-native-biometric';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: [ 'tab1.page.scss' ]
})
export class Tab1Page implements OnInit {

  constructor(public platform: Platform, public alertController: AlertController) {
  }

  async ngOnInit() {
    const hasCredentialsPrompted = localStorage.getItem('credentialsPrompted');
    const isNative = this.platform.is('capacitor');

    if (hasCredentialsPrompted || !isNative) {
      return;
    }

    await this.checkCredentialsAvailability();
  }

  async checkCredentialsAvailability() {
    try {
      const result = await NativeBiometric.isAvailable();

      if (result.isAvailable) {
        await this.askForStoreCredentials();
      }
    } catch (e) {
      console.error(e); // FIXME
    }
  }

  async askForStoreCredentials() {
    try {
      await this.getCredentials();
    } catch (e) {
      console.error(e); // FIXME
      const { role } = await this.presentAlert();

      if (role === 'confirm') {
        await this.saveCredentials();
      }

      // Save response to not ask again
      localStorage.setItem('credentialsPrompted', 'true');
    }
  }

  // TODO
  async getCredentials() {
    return NativeBiometric.getCredentials({
      server: 'www.example.com',
    });
  }

  async saveCredentials() {
    try {
      const result = await NativeBiometric.setCredentials({
        username: "username",
        password: "password",
        server: "www.example.com",
      });

      console.log(result); // FIXME
    } catch (e) {
      console.error(e); // FIXME
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Hey!',
      message: 'Would you like to sign in with biometric credentials?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
    });

    await alert.present();

    return alert.onDidDismiss();
  }

}
