export abstract class AbstractError {
    errorOccurred: boolean;
    errorMessage: string = 'Page Not Found';
    errorCode: number;

    showError(statusCode=404, message?) {
        this.errorCode = statusCode;
        if (message != undefined) {
            this.errorMessage = message;
        }
        this.errorOccurred = true;
    }

    hideError() {
        this.errorOccurred = false;
    }
}