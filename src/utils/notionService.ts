import { ProjectData, ProjectType, FolderPosition, ProjectCategory } from '../context/ProjectContext';

// Helper to get the correct function URL based on environment
const getFunctionUrl = (functionPath: string): string => {
  // When running under Netlify Dev, we need to use the full URL including port
  if (import.meta.env.DEV) {
    // Check if we're on localhost and properly format the URL
    if (window.location.hostname === 'localhost') {
      // When running on localhost:5173 (Vite dev server),
      // Netlify Functions are typically served on localhost:8888
      return `http://localhost:8888/.netlify/functions/${functionPath}`;
    } else {
      // If we're on a different host but still in dev mode
      return `${window.location.origin}/.netlify/functions/${functionPath}`;
    }
  }
  
  // In production, we can use relative URLs
  return `/.netlify/functions/${functionPath}`;
};

// Array of positions to cycle through
const positions: FolderPosition[] = ['left', 'middle', 'right'];

// Function to map Notion properties to ProjectData fields
const mapNotionPageToProject = (page: any, index: number): ProjectData => {
  try {
    // Extract properties from Notion page
    const properties = page.properties || {};
    
    // Helper to safely extract property values
    const getValue = (propertyName: string, type: string, defaultValue: any = '') => {
      const property = properties[propertyName];
      if (!property) return defaultValue;
      
      switch (type) {
        case 'title':
          return property.title && property.title.length > 0 
            ? property.title[0].plain_text || defaultValue
            : defaultValue;
        case 'rich_text':
          return property.rich_text && property.rich_text.length > 0 
            ? property.rich_text[0].plain_text || defaultValue
            : defaultValue;
        case 'url':
          return property.url || defaultValue;
        case 'select':
          return property.select && property.select.name 
            ? property.select.name
            : defaultValue;
        case 'multi_select':
          return property.multi_select && Array.isArray(property.multi_select)
            ? property.multi_select.map((option: any) => option.name)
            : [];
        case 'files':
          // Handle files with improved URL extraction
          if (property.files && property.files.length > 0) {
            // Check if it's an external URL (preferred - won't expire)
            if (property.files[0].type === 'external' && property.files[0].external) {
              return property.files[0].external.url || defaultValue;
            }
            // Or a Notion-hosted file (will expire)
            else if (property.files[0].type === 'file' && property.files[0].file) {
              // Log a warning about expiring URL
              console.warn(`Project ${index} is using a Notion-hosted image which will expire. Consider using an external image URL.`);
              return property.files[0].file.url || defaultValue;
            }
            // Or an empty file array
            else {
              return defaultValue;
            }
          }
          return defaultValue;
        default:
          return defaultValue;
      }
    };
    
    // Handle multiple select for Category
    const determineCategory = (): ProjectCategory => {
      const categoryProperty = properties['Category'];
      
      // If property doesn't exist or isn't a multi_select, default to computer
      if (!categoryProperty || !categoryProperty.multi_select) {
        return 'computer';
      }
      
      // Extract selected options
      const selections = categoryProperty.multi_select.map((option: any) => option.name.toLowerCase());
      
      // Check selected categories
      const hasComputer = selections.includes('computer');
      const hasResearch = selections.includes('research');
      
      // Determine category based on selections
      if (hasComputer && hasResearch) {
        return 'both';
      } else if (hasResearch) {
        return 'research';
      } else {
        // Default to computer if neither or only computer is selected
        return 'computer';
      }
    };
    
    // Automatically assign position based on index
    const position: FolderPosition = positions[index % positions.length];
    
    // Get project image URL
    const projectImgUrl = getValue('ProjectImage', 'files', '/vite.svg');
    
    // Log out image URL source for debugging
    if (projectImgUrl !== '/vite.svg') {
      const isGitHubUrl = projectImgUrl.includes('github.io') || 
                          projectImgUrl.includes('githubusercontent.com');
      console.log(`Project ${index + 1} using ${isGitHubUrl ? 'GitHub' : 'Notion'} hosted image: ${
        projectImgUrl.substring(0, 50)}...`);
    }
    
    // Build the project data object
    return {
      id: index + 1,
      fileName: getValue('Name', 'title', `Project ${index + 1}`),
      projectTitle: getValue('ProjectTitle', 'rich_text', `Untitled Project ${index + 1}`),
      description: getValue('Description', 'rich_text', 'No description provided'),
      projectImg: projectImgUrl,
      type: getValue('Type', 'select', 'computational') as ProjectType,
      position: position, // Automatically assigned based on index
      category: determineCategory(), // Using our new function
      authorNames: getValue('AuthorNames', 'rich_text', ''),
      repoLink: getValue('RepoLink', 'url', '')
    };
  } catch (error) {
    console.error(`Error mapping Notion page to project:`, error);
    return {
      id: index + 1,
      fileName: `Error Project ${index + 1}`,
      projectTitle: 'Error Loading Project',
      description: 'There was an error loading this project from Notion',
      projectImg: '/vite.svg',
      type: 'computational',
      position: positions[index % positions.length], // Still assign position even in error case
      category: 'computer',
      repoLink: '#'
    };
  }
};

export const fetchProjectsFromNotion = async (): Promise<ProjectData[]> => {
  try {
    console.log("Fetching projects from Notion...");
    const timestamp = new Date().getTime(); // Add timestamp to avoid caching
    const functionUrl = getFunctionUrl(`notion-proxy?timestamp=${timestamp}`);
    
    console.log(`Calling Netlify function at: ${functionUrl}`);
    
    const response = await fetch(functionUrl);
    
    // Check if the response is OK
    if (!response.ok) {
      console.error(`Notion proxy returned error status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error response:", errorText.substring(0, 200));
      throw new Error(`Failed to fetch from Notion: ${response.statusText}`);
    }
    
    // Parse the JSON response
    const results = await response.json();
    
    if (!Array.isArray(results)) {
      console.error("Response is not an array:", results);
      return [];
    }
    
    console.log(`Successfully fetched ${results.length} projects from Notion`);
    
    // Map the Notion data to our ProjectData interface
    return results.map((page, index) => mapNotionPageToProject(page, index));
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    return [];
  }
};

export const testNotionConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing connection to Notion via Netlify function...");
    
    // Add a timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    const functionUrl = getFunctionUrl(`notion-proxy?_=${timestamp}`);
    console.log(`Testing Notion connection at: ${functionUrl}`);
    
    const response = await fetch(functionUrl);
    
    // Log response details for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log(`Response headers:`, Object.fromEntries([...response.headers.entries()]));
    
    // First check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from function:", errorText.substring(0, 200) + (errorText.length > 200 ? '...' : ''));
      throw new Error(`Function returned error ${response.status}: ${response.statusText}`);
    }
    
    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Unexpected content type: ${contentType}`);
      // Log the first part of the response to see what's coming back
      const textResponse = await response.text();
      console.error("Non-JSON response:", textResponse.substring(0, 200) + (textResponse.length > 200 ? '...' : ''));
      throw new Error('Function did not return JSON data');
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data)) {
      console.warn("Unexpected response format:", data);
      return false;
    }
    
    console.log("✅ Successfully connected to Notion database!");
    console.log(`✅ Found ${data.length} projects in the database.`);
    
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to Notion:", error);
    return false;
  }
};

// Add this new function to test basic function connectivity
export const testNetlifyFunctions = async (): Promise<boolean> => {
  try {
    console.log("Testing basic Netlify function connectivity...");
    
    // Add a timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    const functionUrl = getFunctionUrl(`test?_=${timestamp}`);
    console.log(`Testing function at: ${functionUrl}`);
    
    // Use explicit fetch options to handle CORS correctly
    const response = await fetch(functionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Don't send credentials for cross-origin requests to avoid CORS preflight issues
      credentials: 'same-origin',
      mode: 'cors',
      cache: 'no-cache',
    });
    
    // Log response details for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Log available response headers
    const headersObj = Object.fromEntries([...response.headers.entries()]);
    console.log(`Response headers:`, headersObj);
    
    // Check if the response is OK
    if (!response.ok) {
      let errorMessage = `Function returned error ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        console.error("Error response body:", errorText.substring(0, 300) + (errorText.length > 300 ? '...' : ''));
        if (errorText.includes("<!DOCTYPE html>")) {
          errorMessage += " (received HTML instead of JSON - likely a routing issue)";
        }
      } catch (textError) {
        console.error("Could not read error response text:", textError);
      }
      throw new Error(errorMessage);
    }
    
    // Attempt to parse the JSON data
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      const textResponse = await response.text();
      console.error("Raw response:", textResponse.substring(0, 300) + (textResponse.length > 300 ? '...' : ''));
      throw new Error("Failed to parse JSON response from function");
    }
    
    console.log("✅ Test function response:", data);
    
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to test function:", error);
    
    // Additional diagnostic information
    console.log("📊 Diagnostic info:");
    console.log("- Current origin:", window.location.origin);
    console.log("- Current URL:", window.location.href);
    console.log("- Development mode:", import.meta.env.DEV ? "Yes" : "No");
    console.log("- Browser:", navigator.userAgent);
    
    return false;
  }
};