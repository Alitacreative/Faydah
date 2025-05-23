import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleMapsLoaderService {
    private apiKey = '';
    private isLoaded = false;

    load(): Promise<void> {
        if (this.isLoaded) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                this.isLoaded = true;
                resolve();
            };
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    }
}
