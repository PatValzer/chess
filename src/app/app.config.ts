// Angular application configuration for providers and routing
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Suggestion: Add additional providers for state management or feature modules as needed
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Handles global errors
    provideZonelessChangeDetection(),     // Improves performance
    provideRouter(routes),                 // Sets up app routing
    provideHttpClient()
  ]
};
