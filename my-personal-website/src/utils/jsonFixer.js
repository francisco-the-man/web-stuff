#!/usr/bin/env node

/**
 * JSON Fixer Utility
 * 
 * This script scans all JSON files in the _projects directory and fixes any issues:
 * - Removes BOM characters
 * - Fixes JSON formatting
 * - Ensures proper field validation
 * 
 * Run with: node src/utils/jsonFixer.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to projects directory
const PROJECTS_DIR = path.join(__dirname, '..', '_projects');

// Function to validate and fix a single JSON file
function fixJsonFile(filePath) {
  console.log(`Checking ${filePath}...`);
  
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove BOM character if present
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.substring(1);
      console.log(`  - Removed BOM character`);
    }
    
    // Remove any leading/trailing whitespace
    content = content.trim();
    
    // Parse the JSON
    let data;
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      console.error(`  ❌ JSON Parse Error in ${filePath}: ${parseError.message}`);
      
      // Try to fix common issues
      content = content.replace(/'/g, '"'); // Replace single quotes with double quotes
      content = content.replace(/,\s*}/g, '}'); // Remove trailing commas
      content = content.replace(/,\s*\]/g, ']'); // Remove trailing commas in arrays
      
      try {
        data = JSON.parse(content);
        console.log(`  ✅ Fixed JSON parsing issues`);
      } catch (retryError) {
        console.error(`  ❌ Unable to fix JSON, manual intervention required`);
        return false;
      }
    }
    
    // Validate required fields
    const requiredFields = ['id', 'fileName', 'projectTitle', 'description', 'projectImg', 'type', 'position', 'category'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.warn(`  ⚠️ Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate conditional fields based on type
    if (data.type === 'written' && !data.authorNames) {
      console.warn(`  ⚠️ Written project missing authorNames field`);
      data.authorNames = ""; // Add empty placeholder
    }
    
    if (data.type === 'computational' && !data.repoLink) {
      console.warn(`  ⚠️ Computational project missing repoLink field`);
      data.repoLink = "#"; // Add placeholder link
    }
    
    // Ensure projectImg starts with /
    if (data.projectImg && !data.projectImg.startsWith('/')) {
      data.projectImg = '/' + data.projectImg;
      console.log(`  ✅ Fixed image path to start with /`);
    }
    
    // Write the fixed content back to the file
    const fixedContent = JSON.stringify(data, null, 2);
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`  ✅ Updated file with fixed content`);
      return true;
    } else {
      console.log(`  ✓ No issues found, file is valid`);
      return true;
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  console.log(`🔍 Scanning projects directory: ${PROJECTS_DIR}`);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.log(`Creating projects directory: ${PROJECTS_DIR}`);
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
  
  // Get all .json files in the directory
  const files = fs.readdirSync(PROJECTS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(PROJECTS_DIR, file));
  
  console.log(`Found ${files.length} JSON project files`);
  
  // Process each file
  let fixedCount = 0;
  let errorCount = 0;
  
  files.forEach(file => {
    const result = fixJsonFile(file);
    if (result) {
      fixedCount++;
    } else {
      errorCount++;
    }
    console.log(''); // Add empty line for readability
  });
  
  console.log(`✅ Process complete. Fixed: ${fixedCount}, Errors: ${errorCount}`);
}

// Run the main function
main(); 