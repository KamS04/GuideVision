import { isInstanceOf } from "./type";

export function validate(newQuery, currQuery): boolean {
    return newQuery !== undefined && newQuery.length > 0 && newQuery != currQuery;
}

export async function validateSearchCache<T>(key: any, expectedResultType: new() => T, searchQuery: string) {
    let rawCache = localStorage.getItem(key);
    if (rawCache) {
        let cache = await JSON.parse(rawCache);

        if (cache.query == searchQuery) {

            if (Array.isArray(cache.results)) {

                if (cache.results.every( (it) => isInstanceOf(it, expectedResultType) )) {
                    let newLimit = cache.limit;

                    if (newLimit !== undefined) {

                        let newOffset = cache.offset;
                        if (newOffset !== undefined) {
                            return {
                                limit: newLimit,
                                offset: newOffset,
                                results: cache.results
                            }
                        }
                    }
                }
            }
        }
    }

    return undefined;
}