import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideClientHydration(
      withEventReplay() // use hydration with v18 event replay
    ),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
