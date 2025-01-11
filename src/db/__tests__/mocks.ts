import { Photo, Project } from '../types';
import { jest } from '@jest/globals';
import { EventEmitter } from 'events';

// Mock photo data
export const mockPhotos: Photo[] = [
    {
        id: 'photo1',
        desktop_blob: 'https://example.com/photo1.jpg',
        mobile_blob: 'https://example.com/photo1-mobile.jpg',
        gallery_blob: 'https://example.com/photo1-gallery.jpg',
        sequence: 1,
        caption: 'Test Photo 1',
        projectId: 'nature'
    },
    {
        id: 'photo2',
        desktop_blob: 'https://example.com/photo2.jpg',
        mobile_blob: 'https://example.com/photo2-mobile.jpg',
        gallery_blob: 'https://example.com/photo2-gallery.jpg',
        sequence: 2,
        caption: 'Test Photo 2',
        projectId: 'nature'
    }
];

// Mock project data
export const mockProjects: Project[] = [
    {
        id: 'nature',
        title: 'Nature Photography',
        description: 'Beautiful nature shots',
        isPublished: true,
        slug: 'nature'
    },
    {
        id: 'urban',
        title: 'Urban Photography',
        description: 'City life captured',
        isPublished: false,
        slug: 'urban'
    }
];

// Create a mock SQL result that matches Neon's format
const createMockSqlResult = (rows: any[]) => ({
    rows,
    rowCount: rows.length,
    command: 'SELECT',
    fields: [],
    oid: null,
    rowAsArray: false,
    ok: true,
    map: function(callback: (row: any) => any) {
        return this.rows.map(callback);
    }
});

// Mock SQL tagged template literal function
export const mockSql = jest.fn((query: any, ...params: any[]) => {
    // Default implementation returns empty result
    return Promise.resolve(createMockSqlResult([]));
});

// Mock modules
jest.mock('@neondatabase/serverless', () => ({
    neon: () => mockSql
}));

jest.mock('../client', () => {
    const poolEmitter = new EventEmitter();
    const pool = {
        ...poolEmitter,
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return {
        __esModule: true,
        sql: mockSql,
        default: mockSql,
        pool
    };
});

// Setup database mocks
export const setupDatabaseMocks = () => {
    // Reset all mocks before setup
    jest.resetModules();
    mockSql.mockReset();
    
    // Default implementation returns empty result
    mockSql.mockImplementation((query: any, ...params: any[]) => {
        return Promise.resolve(createMockSqlResult([]));
    });

    // Mock fetch globally
    global.fetch = jest.fn(() => Promise.resolve({ 
        ok: true,
        json: () => Promise.resolve([])
    })) as jest.Mock;

    // Mock XMLHttpRequest
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        readyState: 4,
        status: 200,
        response: '[]'
    };
    
    // @ts-ignore
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    return { sql: mockSql };
};

// Helper to clear mocks between tests
export const clearDatabaseMocks = () => {
    mockSql.mockClear();
    (global.fetch as jest.Mock).mockClear();
};

// Add a test to prevent the "no tests" warning
describe('Database Mocks', () => {
    it('provides mock data and functions', () => {
        expect(mockPhotos).toBeDefined();
        expect(mockProjects).toBeDefined();
        expect(mockSql).toBeDefined();
        expect(setupDatabaseMocks).toBeDefined();
        expect(clearDatabaseMocks).toBeDefined();
    });
}); 