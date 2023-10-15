import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { ListedUserComponent } from './components/admin-view/listed-user/listed-user.component';
import { DataService } from './classes/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginViewComponent } from './components/login-view/login-view.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ColorPkrModalComponent } from './components/user-view/color-pkr-modal/color-pkr-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    UserViewComponent,
    AdminViewComponent,
    ListedUserComponent,
    LoginViewComponent,
    ColorPkrModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [
      DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
