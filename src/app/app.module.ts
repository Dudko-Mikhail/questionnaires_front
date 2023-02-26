import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ChangePasswordComponent} from './component/page/change-password/change-password.component';
import {EditProfileComponent} from './component/page/edit-profile/edit-profile.component';
import {FieldsComponent} from './component/page/fields/fields.component';
import {LoginComponent} from './component/page/login/login.component';
import {NotFoundComponent} from './component/page/not-found/not-found.component';
import {QuestionnairesComponent} from './component/page/questionnaires/questionnaires.component';
import {ResponsesComponent} from './component/page/responses/responses.component';
import {SignUpComponent} from './component/page/sign-up/sign-up.component';
import {NavigationComponent} from './component/navigation/navigation.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {httpInterceptorProviders} from "./interceptor";
import {PaginationComponent} from './component/pagination/pagination.component';
import {AddEditFieldComponent} from './component/modal/add-edit-field/add-edit-field.component';
import {ContinueRegistrationComponent} from './component/modal/continue-registration/continue-registration.component';
import {UnknownErrorComponent} from './component/unknown-error/unknown-error.component';
import {QuestionnaireComponent} from './component/page/questionnaire/questionnaire.component';
import {CongratulationsComponent} from './component/page/congratulations/congratulations.component';

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    FieldsComponent,
    LoginComponent,
    NotFoundComponent,
    QuestionnairesComponent,
    ResponsesComponent,
    SignUpComponent,
    NavigationComponent,
    PaginationComponent,
    AddEditFieldComponent,
    ContinueRegistrationComponent,
    UnknownErrorComponent,
    QuestionnaireComponent,
    CongratulationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
