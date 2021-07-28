export class Result {
    success: boolean;
}

export class ResultSuccess<T extends any> extends Result {
    data: T;
}

export class ResultError extends Result {
    msg: string;
}

// function checkSame(obj, typeToCheck) {
//     let objKeys = Object.keys(obj).sort()
//     return Object.keys(typeToCheck).every((key) => key in objKeys)
// }