import { APP_INITIALIZER, ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';

import { SentryConfig } from './models/sentry-config.model';
import { NgxSentryService } from './ngx-sentry.service';

/* eslint-disable */
export function initializeSentry(sentryService: NgxSentryService): () => Promise<void> {
    const res = (): Promise<any> => {
        return sentryService.init();
    };
    return res;
}
export function initializeTracing(): () => Promise<void> {
    const res = (): Promise<void> => {
        return Promise.resolve();
    };
    return res;
}
/* eslint-enable */

@NgModule()
export class NgxSentryModule {
    public static forRoot(config: SentryConfig): ModuleWithProviders<NgxSentryModule> {
        return {
            ngModule: NgxSentryModule,
            providers: [
                {
                    provide: ErrorHandler,
                    useValue: Sentry.createErrorHandler(config?.errorHandlerOptions ? config?.errorHandlerOptions : {
                        showDialog: true
                    })
                },
                {
                    provide: Sentry.TraceService,
                    deps: [Router]
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initializeTracing,
                    deps: [Sentry.TraceService],
                    multi: true
                },
                {
                    provide: 'sentryConfig',
                    useValue: config
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initializeSentry,
                    deps: [NgxSentryService],
                    multi: true
                },
                NgxSentryService
            ]
        };
    }
}
