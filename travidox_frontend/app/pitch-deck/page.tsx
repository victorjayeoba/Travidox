import fs from 'fs';
import path from 'path';
import PitchDeckViewer from '../../components/pitch-deck/PitchDeckViewer';

const getSlides = () => {
  const dir = path.join(process.cwd(), 'pitch_deck');
  
  try {
    const filenames = fs.readdirSync(dir).sort();
    
    const slides = filenames
      .filter((name) => name.endsWith('.md'))
      .map((filename) => {
        const content = fs.readFileSync(path.join(dir, filename), 'utf8');
        return { filename, content };
      });

    return slides;
  } catch (error) {
    console.error('Error reading pitch deck files:', error);
    return [];
  }
};

const PitchDeckPage = () => {
  const slides = getSlides();

  if (!slides || slides.length === 0) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">No Slides Found</h1>
                <p className="text-gray-600">Could not find pitch deck files. Please check the `pitch_deck` directory.</p>
                <p className="text-sm text-gray-500 mt-2">Looking in: {path.join(process.cwd(), 'pitch_deck')}</p>
            </div>
        </div>
    );
  }

  return <PitchDeckViewer slides={slides} />;
};

export default PitchDeckPage; 