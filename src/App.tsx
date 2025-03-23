import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import Computer from './components/Computer';
import Projects from './components/Projects';
import Research from './components/Research';
import ProjectAdmin from './components/ProjectAdmin';
import Creative from './components/Creative';
import PhysicalMedia from './components/PhysicalMedia';
import Clothing from './components/Clothing';
import Footer from './components/Footer';
import { ChaosProvider } from './context/ChaosContext';
import { ProjectProvider } from './context/ProjectContext';
import ChaosEffect from './components/ChaosEffect';

function App() {
  // Get the base path from the environment or use the default
  const basePath = import.meta.env.BASE_URL || '/';
  
  return (
    <Router basename={basePath}>
      <ChaosProvider>
        <ProjectProvider>
          <div className="flex flex-col min-h-screen bg-white text-black font-ibm-plex-mono">
            <Navbar />
            <div 
              id="main-content" 
              className="flex-grow relative"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/computer" element={<Computer />} />
                <Route path="/computer/projects" element={<Projects />} />
                <Route path="/research" element={<Research />} />
                <Route path="/research/projects" element={<Research />} />
                <Route path="/computer/projects/admin" element={<ProjectAdmin />} />
                <Route path="/creative" element={<Creative />} />
                <Route path="/creative/physical-media" element={<PhysicalMedia />} />
                <Route path="/creative/clothing" element={<Clothing />} />
              </Routes>
            </div>
            <Footer />
            <ChaosEffect containerId="main-content" />
          </div>
        </ProjectProvider>
      </ChaosProvider>
    </Router>
  );
}

export default App;
