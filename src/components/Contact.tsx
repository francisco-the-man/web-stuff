import contactCard from '../assets/contact-card.png';

const Contact = () => {
  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="max-w-md w-full">
            <img 
              src={contactCard} 
              alt="Contact Card - Email me at averylou@stanford.edu" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact; 