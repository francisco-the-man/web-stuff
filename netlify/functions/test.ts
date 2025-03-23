import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: "Test function is working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }),
  };
}; 