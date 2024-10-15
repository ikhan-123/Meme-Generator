
"use client";
import Image from "next/image";
import React, { useState } from "react";
import { saveAs } from 'file-saver';


interface Meme {
  box_count: number;
  name: string;
  id: string;
  url: string;
}

const creatememe = ({ searchParams }: { searchParams: Meme }) => {
  const [generateMemeImage, setGenerateMemeImage] = useState<string | null>(null);
  const [inputTexts, setInputTexts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleInutChange = (index: number, value: string) => {
    setInputTexts(prev => ({ ...prev, [`text_${index}`]: value }))
  }
  console.log(creatememe);




  const generateMeme = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filledInputs = Object.values(inputTexts).filter(text => text.trim() !== '');
    const boxesParams = filledInputs.map((text, index) => `boxes[${index}][text]=${encodeURIComponent(text)}`).join('&');
    const apiUrl = `https://api.imgflip.com/caption_image?template_id=${searchParams.id}&username=irfanjs&password=Khan@890&${boxesParams}`;

    try {
      const response = await fetch(apiUrl)
      const data = await response.json();
      if (data.success) {
        setGenerateMemeImage(data.data.url)
      } else {
        alert('Error geneting meme: ' + data.error_message);
      }
    } catch (error) {
      alert('Error generating meme: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const gettingNumberOfInput = (): JSX.Element[] => {
    const inputs: JSX.Element[] = [];
    for (let i = 0; i < searchParams.box_count; i++) {
      inputs.push(
        <input
          type="text"
          key={i}
          placeholder={`Text ${i + 1}`}
          value={inputTexts[`text_${i}`] || ''}
          onChange={(e) => handleInutChange(i, e.target.value)}
          className="w-full p-3 my-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
        />
      );
    }
    return inputs;
  };

  const handleDownload = () => {
    if (generateMemeImage) {
      saveAs(generateMemeImage, 'meme.png');
    }
  };

  

 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="flex flex-col sm:flex-row flex-wrap gap-8 px-4 w-full max-w-5xl justify-center">
        {/* Meme Template Card */}
        <div className="flex flex-col items-center bg-black rounded-lg shadow-lg ">
          <Image src={searchParams.url} alt='Meme Template' width={500} height={300} className="rounded-t-lg" />
          <form onSubmit={generateMeme} className="w-full p-4">
            {gettingNumberOfInput()}
            <button
              type='submit'
              className={`w-full py-3 px-4 mt-4 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold rounded-md shadow-md `}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Meme'}
            </button>
          </form>
        </div>

        {generateMemeImage && (
          <div className="flex flex-col items-center bg-black rounded-lg shadow-lg ">
            <Image src={generateMemeImage} alt='Generated Meme' width={500} height={300} className="rounded-lg" />
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
            >
              Download Meme
            </button>
          </div>
        )}

      </div>
    </div>
























    // <div>
    //   <h1>Create Meme</h1>
    //   <Image
    //     src={props.searchParams.url}
    //     alt="Meme Template"
    //     height={200}
    //     width={200}
    //   />
    //   <form onSubmit={generateMeme}>
    //     {getInputs()}
    //     <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
    //       Generate
    //     </button>
    //   </form>
    //   {memeImage && (
    //     <Image src={memeImage} alt="Generated Meme" />
    //   )}
    // </div>
  );
};

export default creatememe;
