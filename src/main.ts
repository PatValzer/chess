
// Entry point for Angular application bootstrap
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Suggestion: Consider adding error reporting service for production errors
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err)); // TODO: Replace with centralized error handler for better diagnostics
