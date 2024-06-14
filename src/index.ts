// src/index.ts
const SCRIPT_NAME = '/js/script.js';
const ENDPOINT = '/api/event';

export default {
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname.endsWith(SCRIPT_NAME)) {
            return fetch('https://plausible.io/js/plausible.js');
        } else if (url.pathname.endsWith(ENDPOINT)) {
            return fetch('https://plausible.io/api/event', {
                method: 'POST',
                headers: request.headers,
                body: request.body,
            });
        }

        return new Response('Not found', { status: 404 });
    },
};