import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ResultError } from '../models/result';


export function contract<T>(observable: Observable<T>): Promise<T> {
    return new Promise( (resolve, reject) => {
        observable.pipe(take(1)) // Only subscribe to the first value
            .subscribe( (result: T) => {
                resolve(result); // All goes well -> resolve with result of type T
                return;
            }, (error) => {
                let tryResult = error.error as ResultError; // Try to cast to error type
                if (tryResult !== undefined) {                    
                    if (error instanceof HttpErrorResponse) {
                        tryResult.statusCode = error.status;
                    }
                    reject( tryResult ); // Error occurred/created on the api server -> throw error with the msg
                } else {
                    reject( error ); // Error occurred elsewhere and is real javascript error
                }
                return;
            }
        );
    });
}