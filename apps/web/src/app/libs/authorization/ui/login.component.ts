import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { take } from "rxjs";
import { LoginDto } from "../api/login.dto";
import { AuthorizationService } from "../utils/authorization.service";

@Component({
  selector: "easy-bsb-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;

  error?: string;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authorizationService: AuthorizationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control(null, Validators.required),
      password: this.formBuilder.control(null, Validators.required),
    });
  }

  submit($event: MouseEvent | SubmitEvent): void {
    $event.stopPropagation();
    $event.preventDefault();

    const payload: LoginDto = this.loginForm.getRawValue();
    this.authorizationService
      .login(payload)
      .pipe(take(1))
      .subscribe({
        next: () => this.router.navigate(["/"]),
        error: (response: HttpErrorResponse) => {
          this.error = response.error.message;
        },
      });
  }
}
