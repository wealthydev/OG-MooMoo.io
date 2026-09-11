export async function getKey(name) {
    let result = { name: name }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return "WebGL not supported";

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (debugInfo) {
        result.agent = navigator.userAgent;
        result.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);


        return result;
    } else {
        return "Debug info extension not available";
    }
}