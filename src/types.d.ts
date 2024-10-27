// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class<T, Arguments extends unknown[] = any[]> = {
    prototype: Pick<T, keyof T>;
    new (...arguments_: Arguments): T;
} & Pick<typeof T, keyof typeof T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T, Arguments extends unknown[] = any[]> = new (
    ...arguments_: Arguments
) => T;
