export function injectScript(url: string): void
{
    const element = document.documentElement;

    const script = document.createElement("script");
    script.src = url;

    element.append(script);
}
