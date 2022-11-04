import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  constructor(public router: Router, public route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  async save(form: NgForm) {
    if (form.invalid) {
      return;
    }

    await this.redirect();
  }

  async redirect() {
    await this.router.navigate(['..', 'signed', 'tabs', 'tab1'],{
      relativeTo: this.route
    });
  }

}
