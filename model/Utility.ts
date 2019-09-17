export function tryParseJson(text: string): Object {
    try {
        const json = JSON.parse(text);
        return json;
    } catch (e) {
        return null;
    }
}