// Configuration for Netlify Functions
module.exports = {
  // All functions in the netlify/functions directory will be treated as serverless functions
  // This is the default behavior, but it's good to be explicit
  directory: 'netlify/functions',
  
  // Include any external modules that might be needed by functions
  includeDirs: ['node_modules/@netlify/functions', 'node_modules/@notionhq/client'],
  
  // Configure Node.js version for functions
  node_bundler: 'esbuild',
  
  // Inject environment variables from .env file when running locally
  injectEnv: true,
  
  // Configure per-function options
  config: {
    // Example for specific function configuration
    'notion-proxy': {
      // Set a higher timeout for the Notion API calls, which can sometimes be slow
      timeout: 30 // 30 seconds
    }
  }
}; 