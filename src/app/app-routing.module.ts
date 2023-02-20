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
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: '/questionnaires', pathMatch: "full"},
  {path: 'questionnaires', component: QuestionnairesComponent, title: 'questionnaires'},
  {path: 'sign-up', component: SignUpComponent, title: 'sign-up'},
  {path: 'login', component: LoginComponent, title: 'login'},
  {path: 'responses', component: ResponsesComponent, title: 'responses', canActivate: [AuthGuard]},
  {path: 'fields', component: FieldsComponent, title: 'fields', canActivate: [AuthGuard]},
  {path: 'profile/edit', component: EditProfileComponent, title: 'edit profile', canActivate: [AuthGuard]},
  {path: 'profile/change-password', component: ChangePasswordComponent, title: 'change password', canActivate: [AuthGuard]},
  {path: '**', component: NotFoundComponent, title: 'not found'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
