import { useState } from 'react';
import { Camera, Download, RefreshCw, Sparkles } from 'lucide-react';
import './GoogleNanoBanana.css'; // Link to custom styles

const GoogleNanoBanana = () => {
  const [prompt, setPrompt] = useState('A futuristic cityscape at night with neon lights');
  const [style, setStyle] = useState('realistic');
  const aspectRatio = '1:1';
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ url: string, id: number }[]>([]);
  const [error, setError] = useState('');

  const styles = [
    'realistic', 'anime',
  ];


  const generateImage = async () => {
    setIsLoading(true);
    setError('');

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer vk-5m7aMvz9Hwnmnixr8Sdz3aqkSjNQZUPlK13Dhqt2bv5gs");
      const formdata = new FormData();
      formdata.append("prompt", prompt);
      formdata.append("style", style);
      formdata.append("aspect_ratio", aspectRatio);
      formdata.append("seed", "1");

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      } as any;

      const response = await fetch("https://api.vyro.ai/v2/image/generations", requestOptions);

      console.log({response})
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the body correctly
      let result: any;
      
      try {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        result = { url: imageUrl };
        // Attempt to parse JSON
      } catch (e) {
        // If it’s not JSON, maybe it’s a blob (image stream)
        
      }
      
      // Handle the different response formats
      if (result.images && Array.isArray(result.images)) {
        setGeneratedImages(result.images);
      } else if (result.image_url) {
        setGeneratedImages([{ url: result.image_url, id: Date.now() }]);
      } else if (result.url) {
        setGeneratedImages([{ url: result.url, id: Date.now() }]);
      } else {
        console.log("API Response:", result);
        setError("Unexpected response format from API");
      }
      
    //   if (result.images && Array.isArray(result.images)) {
    //     setGeneratedImages(result.images);
    //   } else if (result.image_url) {
    //     setGeneratedImages([{ url: result.image_url, id: Date.now() }]);
    //   } else if (result.url) {
    //     setGeneratedImages([{ url: result.url, id: Date.now() }]);
    //   } else {
    //     console.log('API Response:', result);
    //     setError('Unexpected response format from API');
    //   }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(`Failed to generate image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="container-fluid py-5 bg-gradient">
      <div className="container">
        <div className="text-center text-white mb-5">
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            <Sparkles className="icon-yellow" />
            <h1 className="fw-bold display-5">Vyro AI Image Generator</h1>
            <Sparkles className="icon-yellow" />
          </div>
          <p className="lead">Create stunning AI-generated images with advanced customization</p>
        </div>

        <div className="row g-4">
          {/* Controls */}
          <div className="col-lg-6">
            <div className="card bg-dark text-white border-light rounded-4 shadow p-4">
              <h2 className="h4 mb-4 d-flex align-items-center gap-2">
                <Camera className="me-2" />
                Generation Settings
              </h2>

              {/* Prompt */}
              <div className="mb-3">
                <label className="form-label">Prompt</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want..."
                />
              </div>

              {/* Style */}
              <div className="mb-3">
                <label className="form-label">Style</label>
                <select
                  className="form-select"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  {styles.map(s => (
                    <option key={s} value={s}>{s.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={isLoading || !prompt.trim()}
                onClick={generateImage}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="spinner-border spinner-border-sm" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-6">
            <div className="card bg-dark text-white border-light rounded-4 shadow p-4">
              <h2 className="h4 mb-4">Generated Images</h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {generatedImages.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <Camera size={48} className="mb-3" />
                  <p>No images generated yet. Click "Generate Image" to get started.</p>
                </div>
              ) : (
                generatedImages.map((image, index) => (
                  <div key={image.id || index} className="mb-4 position-relative">
                    <img
                      src={image.url}
                      alt={`Generated ${index + 1}`}
                      className="img-fluid rounded shadow"
                      onError={(e) => {
                        console.error('Image failed to load:', (e.target as any).src);
                        (e.target as any).style.display = 'none';
                      }}
                    />
                    <button
                      className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                      onClick={() => downloadImage(image.url, index)}
                      title="Download image"
                    >
                      <Download />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleNanoBanana;
