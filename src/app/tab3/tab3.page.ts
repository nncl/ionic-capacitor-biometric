import { Component, OnInit } from '@angular/core';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: [ 'tab3.page.scss' ]
})
export class Tab3Page implements OnInit {
  credentials = null;

  constructor(public platform: Platform) {
  }

  async ngOnInit() {
    await this.getCredentials();
  }

  async getCredentials() {
    const isNative = this.platform.is('capacitor');

    if (!isNative) {
      return;
    }

    try {
      const result = await NativeBiometric.getCredentials({
        server: 'www.example.com',
      });

      this.credentials = !!result;
    } catch (e) {
      console.error(e);
    }
  }

  updateCredentials() {
    const { credentials } = this;

    if (credentials) {
      return this.saveCredentials();
    }

    this.deleteCredentials();
  }

  async saveCredentials() {
    try {
      const result = await NativeBiometric.setCredentials({
        username: "username",
        password: "password",
        server: "www.example.com",
      });

      console.log(result); // FIXME
      // Save response to not ask again
      localStorage.setItem('credentialsPrompted', 'true');
    } catch (e) {
      console.error(e); // FIXME
    }
  }

  async deleteCredentials() {
    try {
      const result = await NativeBiometric.deleteCredentials({
        server: "www.example.com",
      });

      console.log(result); // FIXME
    } catch (e) {
      console.error(e);
    }
  }

}
