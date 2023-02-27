import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from "./component/page/sign-up/sign-up.component";
import {LoginComponent} from "./component/page/login/login.component";
import {ResponsesComponent} from "./component/page/responses/responses.component";
import {FieldsComponent} from "./component/page/fields/fields.component";
import {EditProfileComponent} from "./component/page/edit-profile/edit-profile.component";
import {QuestionnairesComponent} from "./component/page/questionnaires/questionnaires.component";
import {ChangePasswordComponent} from "./component/page/change-password/change-password.component";
import {NotFoundComponent} from "./component/page/not-found/not-found.component";
import {AuthenticatedGuard} from "./guard/authenticated.guard";
import {QuestionnaireComponent} from "./component/page/questionnaire/questionnaire.component";
import {CongratulationsComponent} from "./component/page/congratulations/congratulations.component";
import {Unauthenticated} from "./guard/unauthenticated.guard";
import {ForgotPasswordComponent} from "./component/page/forget-password/forgot-password.component";
import {ResetPasswordComponent} from "./component/page/reset-password/reset-password.component";
import {ContinueRegistrationComponent} from "./component/page/continue-registration/continue-registration.component";

const routes: Routes = [
  {path: '', redirectTo: '/questionnaires', pathMatch: "full"},
  {path: 'questionnaires', component: QuestionnairesComponent, title: 'questionnaires', canActivate: [Unauthenticated]},
  {
    path: 'questionnaires/:id',
    component: QuestionnaireComponent,
    title: 'questionnaire',
    canActivate: [Unauthenticated]
  },
  {
    path: 'congratulations',
    component: CongratulationsComponent,
    title: 'congratulations',
    canActivate: [Unauthenticated] // todo add special guard
  },
  {path: 'sign-up', component: SignUpComponent, title: 'sign-up', canActivate: [Unauthenticated]},
  {path: 'login', component: LoginComponent, title: 'login', canActivate: [Unauthenticated]},
  {path: 'responses', component: ResponsesComponent, title: 'responses', canActivate: [AuthenticatedGuard]},
  {path: 'fields', component: FieldsComponent, title: 'fields', canActivate: [AuthenticatedGuard]},
  {path: 'profile/edit', component: EditProfileComponent, title: 'edit profile', canActivate: [AuthenticatedGuard]},
  {
    path: 'profile/change-password',
    component: ChangePasswordComponent,
    title: 'change password',
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'forgot password',
    canActivate: [Unauthenticated]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'reset password',
    canActivate: [Unauthenticated] // todo add special guard
  },
  {path: 'continue-registration', component: ContinueRegistrationComponent, title: 'continue registration'},
  {path: '**', component: NotFoundComponent, title: 'not found'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
