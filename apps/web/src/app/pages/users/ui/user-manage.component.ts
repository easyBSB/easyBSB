import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";

@Component({
  selector: "easy-bsb-user-manage",
  templateUrl: "./user-manage.component.html",
  styleUrls: ["./user-manage.component.scss"],
})
export class UserManageComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: this.formBuilder.control(null, Validators.required),
      password: this.formBuilder.control(null, Validators.required),
      role: this.formBuilder.control("read", Validators.required),
    });
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.userForm.valid) {
      this.httpClient
        .post("/api/users", {
          ...this.userForm.getRawValue(),
        })
        .pipe(take(1))
        .subscribe({
          next: () =>
            this.router.navigate([".."], { relativeTo: this.activatedRoute }),
          error: (error: HttpErrorResponse) => console.error(error.message),
        });
    }
  }
}
