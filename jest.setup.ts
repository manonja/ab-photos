import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock fetch for Node.js environment
global.fetch = jest.fn(() => Promise.resolve({ 
    ok: true,
    json: () => Promise.resolve([])
})) as jest.Mock;

// Mock Cloudflare environment
Object.defineProperty(globalThis, 'runtime', {
    value: {
        env: 'test',
        environment: 'test'
    }
});

// Create a proper Response-like object
const createNextResponse = (data: any, init: ResponseInit = {}) => {
    const response = new Response(JSON.stringify(data), init);
    const status = init.status || 200;
    
    return {
        ...response,
        status,
        json: () => Promise.resolve(data),
        headers: new Headers(init.headers || {}),
        ok: status >= 200 && status < 300
    };
};

// Mock NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data: any, init?: ResponseInit) => {
            return createNextResponse(data, init);
        })
    }
}));

// Silence console warnings in tests
console.warn = jest.fn();

// Mock Neon database environment
process.env.DATABASE_URL = 'postgres://fake:fake@fake.neon.tech/neondb';

// Mock all network requests
jest.mock('node-fetch');

// Set up global beforeEach
beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
}); 