import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        };
    },
    usePathname() {
        return '';
    },
}));

// Mock web APIs globally
global.Response = class Response {
    constructor(body, init) {
        this._body = body;
        this._init = init || {};
        this.status = init?.status || 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = new Headers(init?.headers);
    }

    async json() {
        return JSON.parse(this._body);
    }

    static json(data, init) {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: { 'content-type': 'application/json' }
        });
    }
};

global.Request = class Request {
    constructor(input, init = {}) {
        this.url = input;
        this.method = init.method || 'GET';
        this.headers = new Headers(init.headers);
    }
};

global.Headers = class Headers {
    constructor(init) {
        this._headers = new Map();
        if (init) {
            Object.entries(init).forEach(([key, value]) => {
                this._headers.set(key.toLowerCase(), value);
            });
        }
    }

    get(name) {
        return this._headers.get(name.toLowerCase()) || null;
    }

    set(name, value) {
        this._headers.set(name.toLowerCase(), value);
    }
};

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json(data, init) {
            const response = Response.json(data, init);
            Object.defineProperty(response, 'json', {
                value: async () => data
            });
            return response;
        }
    }
}));

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/test'; 