import { Inject, Injectable } from '@angular/core';
import { Integrations } from "@sentry/tracing";
import * as Sentry from "@sentry/angular";

import { SentryConfig } from './models/sentry-config.model';

@Injectable()
export class NgxSentryService {

    constructor(
        @Inject('sentryConfig') private config: SentryConfig
    ) { }

    /**
     * Init sentry configuration.
     * This function is automatically called on module initialisation.
     */
    init(): Promise<void> {
        if (!this.config?.dsn) {
            console.warn('No Sentry DSN found. Ignore it.');
            return Promise.resolve();
        }

        const options = Object.assign({
            autoSessionTracking: true,
            integrations: [
                new Integrations.BrowserTracing({
                    tracingOrigins: this.config?.tracingOrigins ? this.config?.tracingOrigins : ['*'],
                    routingInstrumentation: Sentry.routingInstrumentation,
                }),
            ],
        },  this.config);

        Sentry.init(options)
        return Promise.resolve();
    }

    /**
     * Set user for sentry trace
     * @param user 
     */
    setUser(user?: Sentry.User): void {
        Sentry.configureScope((scope) => scope.setUser(user ? user : null));
    }
}
