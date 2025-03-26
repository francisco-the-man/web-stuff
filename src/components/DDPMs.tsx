import EncircleButton from './ui/EncircleButton';

const DDPMs = () => {
  return (
    <main className="py-6 px-4 flex flex-col min-h-screen">
      <div className="container mx-auto max-w-4xl flex-grow">
        {/* Page Title and Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl">DDPMs</h1>
          <div className="flex space-x-4">
            <EncircleButton 
              to="/research"
              variant="nav"
            >
              back
            </EncircleButton>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="w-full h-[calc(150vh-200px)]"> 
          <iframe
            src="/projects/dedicated-pages/DDPMs.pdf"
            className="w-full h-full"
            title="DDPMs PDF"
          />
        </div>
      </div>
    </main>
  );
};

export default DDPMs; 