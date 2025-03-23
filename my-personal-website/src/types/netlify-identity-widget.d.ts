// Type definitions for netlify-identity-widget
// This adds the netlifyIdentity property to the Window interface

interface NetlifyIdentityUser {
  id: string;
  user_metadata: {
    full_name: string;
    [key: string]: any;
  };
  email: string;
  [key: string]: any;
}

interface NetlifyIdentityWidget {
  on: (event: string, callback: Function) => void;
  open: (command?: string) => void;
  close: () => void;
  currentUser: () => NetlifyIdentityUser | null;
  logout: () => void;
  init: (options?: any) => void;
  store: {
    user: NetlifyIdentityUser | null;
    settings: any;
    [key: string]: any;
  };
}

declare global {
  interface Window {
    netlifyIdentity: NetlifyIdentityWidget;
  }
}

export {}; 