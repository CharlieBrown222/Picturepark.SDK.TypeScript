import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// LIBRARIES
import {
    Content, Output, OutputSearchRequest, OutputService, OutputRenderingState, fetchAll
} from '@picturepark/sdk-v1-angular';

@Injectable({
    providedIn: 'root'
})
export class DownloadFallbackService {

    // DOWNLOAD CONTENT SUBJECT
    downloadSubject = new Subject<Output[]>();

    constructor(
        private outputService: OutputService
    ) {}

    public async download(contents: Content[]): Promise<void> {

        const outputSubscription = fetchAll(req => this.outputService.search(req), new OutputSearchRequest({
            contentIds: contents.map(i => i.id),
            renderingStates: [ OutputRenderingState.Completed ],
            limit: 1000
        })).subscribe(outputs => {

            // SEND RESULTS TO SUBSCRIBERS
            this.downloadSubject.next(outputs.results);

            outputSubscription.unsubscribe();

        });
    }

    // DOWNLOAD CONTENT SUBSCRIBER
    downloadContentSubscriber(): Observable<Output[]> {
        return this.downloadSubject.asObservable();
    }
}
