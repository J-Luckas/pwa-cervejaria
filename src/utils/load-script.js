export function loadScript(id, path) {

    const script = document.createElement('script');

    script.src = path;
    script.type = 'module';
    script.id = id;

    document.body.appendChild(script);
}
