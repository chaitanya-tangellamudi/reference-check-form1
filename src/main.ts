import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig, // Keep your existing config
  providers: [
    ...appConfig.providers || [], // Ensure other providers are retained
    importProvidersFrom(HttpClientModule) // ✅ Add HttpClientModule
  ]
}).catch((err) => console.error(err));
