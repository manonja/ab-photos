declare module '@tryghost/content-api' {
  interface BrowseParams {
    limit?: string | number;
    page?: number;
    order?: string;
    filter?: string;
    include?: string | string[];
    fields?: string | string[];
  }

  interface ReadParams {
    id?: string;
    slug?: string;
    include?: string | string[];
    fields?: string | string[];
  }

  interface GhostContentAPIOptions {
    url: string;
    key: string;
    version: string;
    host?: string;
  }

  interface GhostAPI {
    posts: {
      browse: (options?: BrowseParams) => Promise<any[]>;
      read: (options: ReadParams) => Promise<any>;
    };
    tags: {
      browse: (options?: BrowseParams) => Promise<any[]>;
      read: (options: ReadParams) => Promise<any>;
    };
    authors: {
      browse: (options?: BrowseParams) => Promise<any[]>;
      read: (options: ReadParams) => Promise<any>;
    };
    pages: {
      browse: (options?: BrowseParams) => Promise<any[]>;
      read: (options: ReadParams) => Promise<any>;
    };
    settings: {
      browse: (options?: BrowseParams) => Promise<any>;
    };
  }

  export default function GhostContentAPI(options: GhostContentAPIOptions): GhostAPI;
} 