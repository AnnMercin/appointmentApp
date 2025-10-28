import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavBar } from './shared/nav-bar/nav-bar';
import { SideNav } from './shared/side-nav/side-nav';
import { Footer } from './shared/footer/footer';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  declarations: [
    App,
    NavBar,
    SideNav,
    Footer,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatIcon
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
