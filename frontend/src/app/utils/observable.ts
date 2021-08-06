import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ResultError } from '../models/result';

function isApiError(error): boolean {
    let keys = Object.keys(error);
    return keys.includes('success') && keys.includes('msg');
}

export function contract<T>(observable: Observable<T>): Promise<T> {
    return new Promise( (resolve, reject) => {
        observable.pipe(take(1)) // Only subscribe to the first value
            .subscribe( (result: T) => {
                resolve(result); // All goes well -> resolve with result of type T
                return;
            }, (error) => {
                if (isApiError(error.error)) {
                    let result = error.error as ResultError;
                    if (error instanceof HttpErrorResponse) {
                        result.statusCode = error.status;
                    }
                    reject( result ); // Error occurred/created on the api server -> throw error with the msg
                } else {
                    reject( error ); // Error occurred elsewhere and is real javascript error
                }
                return;
            }
        );
    });
}