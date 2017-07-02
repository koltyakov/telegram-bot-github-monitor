export const trimMultistring = (str: string): string => {
    return str.split('\n').map((s: string) => {
        return s.trim();
    }).join('\n');
};
