import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "../shared/material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DialogComponent} from "./dialog/dialog.component";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  entryComponents: [
    DialogComponent
  ],
  declarations: [
    AppComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule

  ],
  providers: [],

  bootstrap: [AppComponent]

})
export class AppModule { }
