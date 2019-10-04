
export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export const omit = <T>(obj: T, k: keyof T): T => {
    if (!obj[k]) {
        return obj;
    }
    const clone = { ...obj };
    delete clone[k];
    return clone;
};
