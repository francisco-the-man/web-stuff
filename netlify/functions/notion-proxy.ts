import { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';

// Debug environment variables
console.log('Netlify function - Environment variables check:');
console.log('- NOTION_API_KEY exists:', !!process.env.NOTION_API_KEY);
console.log('- NOTION_DATABASE_ID exists:', !!process.env.NOTION_DATABASE_ID);
console.log('- VITE_NOTION_API_KEY exists:', !!process.env.VITE_NOTION_API_KEY);
console.log('- VITE_NOTION_DATABASE_ID exists:', !!process.env.VITE_NOTION_DATABASE_ID);

// Get API key and database ID, checking both normal and VITE_ prefixed variables
const getEnvVar = (name: string): string => {
  // First try without VITE_ prefix (standard for Netlify functions)
  const normalVar = process.env[name];
  if (normalVar) return normalVar;
  
  // Then try with VITE_ prefix
  const viteVar = process.env[`VITE_${name}`];
  if (viteVar) return viteVar;
  
  // Return empty string if not found
  console.warn(`Environment variable ${name} not found`);
  return '';
};

const NOTION_API_KEY = getEnvVar('NOTION_API_KEY');
const NOTION_DATABASE_ID = getEnvVar('NOTION_DATABASE_ID');

// Initialize Notion client only if API key is available
let notion: Client | null = null;
if (NOTION_API_KEY) {
  try {
    notion = new Client({
      auth: NOTION_API_KEY
    });
    console.log('Notion client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Notion client:', error);
  }
}

export const handler: Handler = async (event) => {
  // Always set the proper content type for JSON responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  console.log(`Received ${event.httpMethod} request:`, event.path);

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight response' }),
    };
  }

  // Check if Notion client is initialized
  if (!notion) {
    console.error('Notion API key not found in environment variables');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Notion API not configured. Missing API key in environment variables.' 
      }),
    };
  }

  try {
    // Clean up database ID by removing any query parameters or view parameters
    const cleanDatabaseId = NOTION_DATABASE_ID.split('?')[0];
    console.log(`Querying Notion database: ${cleanDatabaseId}`);
    
    // Check if database ID is available
    if (!cleanDatabaseId) {
      throw new Error('Notion database ID not found in environment variables');
    }
    
    // Query the database with filters to get active projects
    const response = await notion.databases.query({
      database_id: cleanDatabaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Active'
        }
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending'
        },
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    });

    console.log(`Found ${response.results.length} projects in Notion database`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.results),
    };
  } catch (error) {
    console.error('Notion API Error:', error);
    
    // Ensure error is properly serialized
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch from Notion',
        message: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      }),
    };
  }
}; 