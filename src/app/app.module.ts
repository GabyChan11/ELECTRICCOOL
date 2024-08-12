import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { initializeApp } from 'firebase/app';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


export const firebaseConfig = {
  apiKey: "AIzaSyAFO_Dj2ZYStxeGv2LC3dvHwajXoAytlxA",
  authDomain: "login-firebase-5f0e6.firebaseapp.com",
  databaseURL: "https://login-firebase-5f0e6-default-rtdb.firebaseio.com",
  projectId: "login-firebase-5f0e6",
  storageBucket: "login-firebase-5f0e6.appspot.com",
  messagingSenderId: "566622465313",
  appId: "1:566622465313:web:8a4179a70bd0a71f5e2260",
  measurementId: "G-BKC4NBKSRV"
};

initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({ mode: 'md' }), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
