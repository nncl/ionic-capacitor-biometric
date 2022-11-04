import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeBiometric } from 'capacitor-native-biometric';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: [ './sign-in.page.scss' ],
})
export class SignInPage implements OnInit {
  item: any = {};

  constructor(public router: Router, public route: ActivatedRoute,
              public alertController: AlertController) {
  }

  async ngOnInit() {
    // TODO Only once after the app has been opened
    await this.checkCredentialsAvailability();
  }

  async checkCredentialsAvailability() {
    console.log('checkCredentialsAvailability'); // FIXME
    try {
      const result = await NativeBiometric.getCredentials({
        server: 'www.example.com',
      });

      if (result) {
        await this.verifyCredentials();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async verifyCredentials() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: "For easy log in",
        title: "Log in",
        subtitle: "Maybe add subtitle here?",
        description: "Maybe a description too?",
      });

      await this.redirect();
    } catch (e) {
      const { role } = await this.presentAlert();

      if (role === 'confirm') {
        await this.verifyCredentials();
      }
    }
  }

  async save(form: NgForm) {
    if (form.invalid) {
      await this.checkCredentialsAvailability();
      return;
    }

    await this.redirect();
  }

  async redirect() {
    await this.router.navigate([ '..', 'signed', 'tabs', 'tab1' ], {
      relativeTo: this.route
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Hey!',
      message: 'Looks like you are having trouble, would you like to try again?',
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
