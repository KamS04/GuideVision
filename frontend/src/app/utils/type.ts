export function isInstanceOf(obj, cls): boolean {
    let def = new cls();
    let objKeys = Object.keys(obj);
    let clsKeys = Object.keys(def);

    return clsKeys.every( (k) => objKeys.includes(k)) &&
        clsKeys.every( (k) => typeof(obj[k]) == typeof(def[k]) && Array.isArray(obj[k]) == Array.isArray(def[k]) );
}