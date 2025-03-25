import { useState, FormEvent, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EncircleButton from './ui/EncircleButton';
import { useProjects, ProjectData, ProjectType, FolderPosition, ProjectCategory } from '../context/ProjectContext';
import LoadingIndicator from './ui/LoadingIndicator';
import { testNotionConnection } from '../utils/notionService';

// Import type definitions for Netlify Identity Widget
// The full type definitions are in src/types/netlify-identity-widget.d.ts
declare global {
  interface Window {
    netlifyIdentity: {
      on: (event: string, callback: Function) => void;
      open: (command?: string) => void;
      currentUser: () => any;
    };
  }
}

// Define a type for drag state
interface DragState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
}

const ProjectAdmin = () => {
  const { projects, addProject, updateProject, deleteProject, resetProjects, reorderProjects, isLoading, refreshProjects } = useProjects();
  const [editingProject, setEditingProject] = useState<Partial<ProjectData> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for drag and drop
  const [dragState, setDragState] = useState<DragState>({
    draggedIndex: null,
    dragOverIndex: null
  });
  
  // State for Netlify widget
  const [netlifyCmsReady, setNetlifyCmsReady] = useState(false);
  
  // State for Notion connection
  const [notionConnectionStatus, setNotionConnectionStatus] = useState<'untested' | 'connected' | 'error'>('untested');
  const [isTesting, setIsTesting] = useState(false);

  // Check if Netlify Identity is available
  useEffect(() => {
    // Check for Netlify Identity
    if (window.netlifyIdentity) {
      setNetlifyCmsReady(true);
    }
  }, []);

  // Function to open Netlify CMS
  const openNetlifyCms = () => {
    // If Netlify Identity exists, open it
    if (window.netlifyIdentity) {
      const user = window.netlifyIdentity.currentUser();
      
      if (!user) {
        // Trigger login if not logged in
        window.netlifyIdentity.open('login');
      } else {
        // If logged in, navigate to admin
        window.location.href = '/admin/';
      }
    } else {
      // Fallback if Netlify Identity isn't loaded
      window.location.href = '/admin/';
    }
  };

  // Initial empty project form
  const emptyProject: Omit<ProjectData, 'id'> = {
    fileName: '',
    projectTitle: '',
    projectImg: '',
    description: '',
    type: 'computational',
    position: 'left',
    category: 'computer',
    authorNames: '',
    repoLink: '',
  };

  // Test Notion connection
  const handleTestNotionConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testNotionConnection();
      setNotionConnectionStatus(result ? 'connected' : 'error');
    } catch (error) {
      console.error('Error testing Notion connection:', error);
      setNotionConnectionStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  // Handle form submission for adding/editing a project
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!editingProject) return;
    
    // Handle file upload if a file was selected
    const fileInput = fileInputRef.current;
    let projectImg = editingProject.projectImg || '';
    
    if (fileInput?.files?.length) {
      // In a real app, this would upload the file to a server and get a URL back
      // For demo purposes, we'll create a fake URL
      const file = fileInput.files[0];
      projectImg = URL.createObjectURL(file);
      
      // Note: This URL will only be valid during the current session
      // In a real app, you would upload this to a server
      console.log(`File selected: ${file.name} (${file.type}, ${file.size} bytes)`);
    }
    
    if (editingProject.id !== undefined) {
      // Update existing project
      updateProject({
        ...editingProject, 
        projectImg,
        id: editingProject.id
      } as ProjectData);
    } else {
      // Add new project
      addProject({
        ...editingProject,
        projectImg,
      } as Omit<ProjectData, 'id'>);
    }
    
    // Reset form
    setEditingProject(null);
    setIsAdding(false);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProject) return;
    
    const { name, value } = e.target;
    setEditingProject({
      ...editingProject,
      [name]: value
    });
  };

  // Start editing a project
  const handleEdit = (project: ProjectData) => {
    setEditingProject({ ...project });
    setIsAdding(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start adding a new project
  const handleAdd = () => {
    setEditingProject({ ...emptyProject });
    setIsAdding(true);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete a project
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  // Refresh projects from Notion
  const handleRefresh = async () => {
    await refreshProjects();
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDragState({ ...dragState, draggedIndex: index });
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragState.draggedIndex === null) return;
    if (dragState.draggedIndex !== index) {
      setDragState({ ...dragState, dragOverIndex: index });
    }
  };

  const handleDrop = () => {
    if (dragState.draggedIndex !== null && dragState.dragOverIndex !== null && dragState.draggedIndex !== dragState.dragOverIndex) {
      reorderProjects(dragState.draggedIndex, dragState.dragOverIndex);
    }
    setDragState({ draggedIndex: null, dragOverIndex: null });
  };

  const handleDragEnd = () => {
    setDragState({ draggedIndex: null, dragOverIndex: null });
  };

  // Get row class based on drag state
  const getRowClass = (index: number) => {
    let classes = "border-b hover:bg-gray-50 cursor-move";
    
    if (dragState.draggedIndex === index) {
      classes += " opacity-50 bg-blue-50";
    }
    
    if (dragState.dragOverIndex === index && dragState.draggedIndex !== index) {
      classes += " border-t-2 border-blue-500";
    }
    
    return classes;
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading projects..." />;
  }

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col">
          {/* Page Title and Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl">Project Administration</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={resetProjects}
                className="text-sm text-gray-600 hover:text-black transition-colors underline"
              >
                Reset to Defaults
              </button>
              <button 
                onClick={openNetlifyCms}
                className="text-sm text-gray-600 hover:text-black transition-colors underline ml-4"
              >
                Open CMS Admin
              </button>
              <EncircleButton 
                to="/computer/projects"
                variant="content"
              >
                back to projects
              </EncircleButton>
            </div>
          </div>
          
          {/* Notion Integration Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg mb-6 border border-blue-200">
            <div className="flex items-start md:items-center flex-col md:flex-row">
              <div className="flex-grow">
                <h2 className="text-lg font-medium mb-1">Project Management with Notion</h2>
                <p className="text-sm text-gray-700">
                  Your projects are loaded from a Notion database and cached locally.
                  <br />Changes made in Notion will be reflected here when you refresh.
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    notionConnectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                    notionConnectionStatus === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <span className={`w-2 h-2 mr-1.5 rounded-full ${
                      notionConnectionStatus === 'connected' ? 'bg-green-400' :
                      notionConnectionStatus === 'error' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`}></span>
                    {notionConnectionStatus === 'connected' ? 'Connected to Notion' :
                     notionConnectionStatus === 'error' ? 'Connection Error' :
                     'Connection Status Unknown'}
                  </span>
                </div>
              </div>
              <div className="mt-3 md:mt-0 flex space-x-2">
                <button 
                  onClick={handleTestNotionConnection}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Test Connection
                    </>
                  )}
                </button>
                <button 
                  onClick={handleRefresh}
                  className="px-3 py-2 bg-cyan-600 text-white rounded-md text-sm hover:bg-cyan-700 transition-colors flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh Projects
                </button>
              </div>
            </div>
          </div>
          
          {/* Project List */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Projects</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleAdd}
                  className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
                >
                  Add New Project
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Order</th>
                    <th className="px-4 py-2 text-left">File Name</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr 
                      key={project.id} 
                      className={getRowClass(index)}
                      draggable={true}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="8" y1="6" x2="16" y2="6"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                              <line x1="8" y1="18" x2="16" y2="18"></line>
                            </svg>
                          </span>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-2">{project.fileName}</td>
                      <td className="px-4 py-2">{project.projectTitle}</td>
                      <td className="px-4 py-2">{project.type}</td>
                      <td className="px-4 py-2">{project.category}</td>
                      <td className="px-4 py-2">{project.position}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button 
                          onClick={() => handleEdit(project)}
                          className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Project Form (shows when editing or adding) */}
          {editingProject && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h2 className="text-xl mb-4">
                {isAdding ? 'Add New Project' : 'Edit Project'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">File Name (Tab Label)</label>
                    <input
                      type="text"
                      name="fileName"
                      value={editingProject.fileName || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Title</label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={editingProject.projectTitle || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Type</label>
                    <select
                      name="type"
                      value={editingProject.type || 'computational'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="computational">Computational</option>
                      <option value="written">Written</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Category</label>
                    <select
                      name="category"
                      value={editingProject.category || 'computer'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="computer">Computer</option>
                      <option value="research">Research</option>
                      <option value="both">Both</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      In Notion, you can select multiple categories (Computer, Research, or both).
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Project Image</label>
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Current image: {editingProject.projectImg || 'None'}
                        </p>
                      </div>
                      {editingProject.projectImg && (
                        <div className="w-16 h-16 border border-gray-200">
                          <img 
                            src={editingProject.projectImg}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Handle error by setting a placeholder
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editingProject.description || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={3}
                      required
                    />
                  </div>
                  
                  {editingProject.type === 'written' ? (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Author Names</label>
                      <input
                        type="text"
                        name="authorNames"
                        value={editingProject.authorNames || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Repository Link</label>
                      <input
                        type="url"
                        name="repoLink"
                        value={editingProject.repoLink || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsAdding(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 transition-colors"
                  >
                    {isAdding ? 'Add Project' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Notion Information Panel */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-lg font-bold mb-3">Using Notion for Project Management</h2>
            
              
              <div>
                <h3 className="text-md font-medium mb-2">Getting Started</h3>
                <p className="text-sm mb-3">
                  Projects are stored in a Notion database and loaded via the Notion API. 
                  Use the test and refresh buttons to check connection status and update content.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRefresh}
                    className="bg-cyan-600 text-white px-4 py-2 text-sm rounded hover:bg-cyan-700 transition-colors"
                  >
                    Refresh Projects
                  </button>
                  <button
                    onClick={handleTestNotionConnection}
                    className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
            
            
            

            {/* Add new section for GitHub image hosting */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-md font-medium mb-2">Image Hosting with GitHub</h3>
              <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-3">
                <p className="text-sm">
                  <strong>Important:</strong> For permanent image links, use GitHub-hosted images in the Notion database 
                  instead of uploading images directly to Notion.
                </p>
              </div>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Upload your image to a GitHub repository (via GitHub web interface)</li>
                <li>Get the GitHub Pages URL for your image:
                  <code className="block bg-gray-100 p-2 text-xs mt-1 rounded">
                    https://[username].github.io/[repo-name]/path/to/image.jpg
                  </code>
                </li>
                <li>In the Notion database, add this URL to the ProjectImage field
                  <ul className="list-disc ml-5 text-xs mt-1">
                    <li>Use "Link" or "External" option when adding the image</li>
                    <li>Do not upload the image directly to Notion</li>
                  </ul>
                </li>
                <li>Refresh projects to see the change</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectAdmin; 