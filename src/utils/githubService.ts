import { Octokit } from 'octokit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// GitHub configuration
const githubToken = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME || 'francisco-the-man';
const repo = process.env.GITHUB_REPO || 'web-stuff';
const branch = process.env.GITHUB_BRANCH || 'main';

// Initialize Octokit
const octokit = githubToken ? new Octokit({
  auth: githubToken,
}) : null;

/**
 * Check if GitHub integration is configured
 */
export function isGitHubConfigured(): boolean {
  return !!githubToken;
}

/**
 * Get the SHA of the latest commit on the branch
 */
async function getLatestCommitSha(): Promise<string> {
  try {
    if (!octokit) throw new Error('GitHub is not configured');
    
    const { data } = await octokit.rest.repos.getBranch({
      owner: username,
      repo,
      branch,
    });
    
    return data.commit.sha;
  } catch (error) {
    console.error('Error getting latest commit SHA:', error);
    throw error;
  }
}

/**
 * Get the current file content and its SHA
 */
async function getFileContent(path: string): Promise<{ content: string, sha: string }> {
  try {
    if (!octokit) throw new Error('GitHub is not configured');
    
    const { data } = await octokit.rest.repos.getContent({
      owner: username,
      repo,
      path: `my-personal-website/${path}`,
      ref: branch,
    });
    
    // @ts-ignore - we know data has content property in this case
    const content = Buffer.from(data.content, 'base64').toString();
    
    return {
      // @ts-ignore - we know data has sha property in this case
      sha: data.sha,
      content,
    };
  } catch (error) {
    if ((error as any).status === 404) {
      return { content: '', sha: '' };
    }
    console.error(`Error getting file content for ${path}:`, error);
    throw error;
  }
}

/**
 * Update a file in the repository
 */
export async function updateFile(
  path: string, 
  content: string, 
  message: string = 'Update file via admin interface'
): Promise<boolean> {
  try {
    if (!octokit) throw new Error('GitHub is not configured');
    
    // First get the current file to get its SHA
    const { sha } = await getFileContent(path);
    
    // Create or update the file
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: username,
      repo,
      path: `my-personal-website/${path}`,
      message,
      content: Buffer.from(content).toString('base64'),
      sha: sha || undefined, // If it's a new file, don't include SHA
      branch,
    });
    
    console.log(`Successfully updated ${path}`);
    return true;
  } catch (error) {
    console.error(`Error updating file ${path}:`, error);
    return false;
  }
}

/**
 * Create a project file in the _projects directory
 */
export async function createOrUpdateProjectFile(
  fileName: string,
  projectData: any
): Promise<boolean> {
  try {
    const path = `src/_projects/${fileName}.json`;
    const content = JSON.stringify(projectData, null, 2);
    const message = `Update project: ${projectData.projectTitle}`;
    
    return await updateFile(path, content, message);
  } catch (error) {
    console.error('Error creating/updating project file:', error);
    return false;
  }
}

/**
 * Delete a file from the repository
 */
export async function deleteFile(
  path: string,
  message: string = 'Delete file via admin interface'
): Promise<boolean> {
  try {
    if (!octokit) throw new Error('GitHub is not configured');
    
    // First get the current file to get its SHA
    const { sha } = await getFileContent(path);
    
    if (!sha) {
      console.error(`File ${path} not found`);
      return false;
    }
    
    await octokit.rest.repos.deleteFile({
      owner: username,
      repo,
      path: `my-personal-website/${path}`,
      message,
      sha,
      branch,
    });
    
    console.log(`Successfully deleted ${path}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${path}:`, error);
    return false;
  }
}

/**
 * Delete a project file from the _projects directory
 */
export async function deleteProjectFile(
  fileName: string,
  projectTitle: string
): Promise<boolean> {
  try {
    const path = `src/_projects/${fileName}.json`;
    const message = `Delete project: ${projectTitle}`;
    
    return await deleteFile(path, message);
  } catch (error) {
    console.error('Error deleting project file:', error);
    return false;
  }
}

export default {
  updateFile,
  createOrUpdateProjectFile,
  deleteFile,
  deleteProjectFile,
  isGitHubConfigured,
};