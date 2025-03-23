import { useState, FormEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import EncircleButton from './ui/EncircleButton';
import { useProjects, ProjectData, ProjectType, FolderPosition, ProjectCategory } from '../context/ProjectContext';

const ProjectAdmin = () => {
  const { projects, addProject, updateProject, deleteProject, resetProjects } = useProjects();
  const [editingProject, setEditingProject] = useState<Partial<ProjectData> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    deleteProject(id);
  };

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
              <a 
                href="/admin/" 
                className="text-sm text-gray-600 hover:text-black transition-colors underline ml-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open CMS Admin
              </a>
              <EncircleButton 
                to="/computer/projects"
                variant="content"
              >
                back to projects
              </EncircleButton>
            </div>
          </div>
          
          {/* Project List */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Projects</h2>
              <button 
                onClick={handleAdd}
                className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
              >
                Add New Project
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">File Name</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{project.id}</td>
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
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Folder Position</label>
                    <select
                      name="position"
                      value={editingProject.position || 'left'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="left">Left</option>
                      <option value="middle">Middle</option>
                      <option value="right">Right</option>
                    </select>
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
          
          {/* Implementation Notes */}
          <div className="border-t border-gray-200 pt-6 mt-4">
            <h2 className="text-lg mb-2">Implementation Notes</h2>
            <p className="text-sm mb-4">
              This admin interface now uses localStorage to persist your changes between sessions. In a production environment, you would:
            </p>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li>Connect to a backend API for CRUD operations</li>
              <li>Implement secure file uploads to a storage service</li>
              <li>Add authentication and authorization</li>
              <li>Include validation and error handling</li>
              <li>Add pagination for large project collections</li>
              <li>Implement search and filtering</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectAdmin; 