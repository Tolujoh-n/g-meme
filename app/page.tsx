"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useState } from "react";
import { ConnectAndSIWE } from "./components/ConnectAndSIWE";
import { useRouter } from "next/navigation";
import Image from "next/image";
import API_URL from "./config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import doge from "../public/cow.jpg";

type Meme = {
  _id: string;
  name: string;
  description: string;
  image: string; // Image path or URL
};

export default function Page() {
  const [memes, setMemes] = useState<Meme[]>([]);

  const { setFrameReady, isFrameReady } = useMiniKit();
  const router = useRouter();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        const data = await res.json();
        setMemes(data);
      } catch (err) {
        console.error("Failed to load memes", err);
      }
    };

    fetchMemes();
  }, []);

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [setFrameReady, isFrameReady]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);

    setTimeout(() => {
      // Simulate image generation after 2 seconds
      setGeneratedImage("/cow.jpg"); // This can be dynamic later
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      image: generatedImage,
      galleries: [],
    };

    try {
      const res = await fetch(`${API_URL}/api/gallery/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Meme uploaded successfully!");
        setIsUploadOpen(false);
        setForm({ name: "", description: "" });
        setGeneratedImage(null);
      } else {
        console.error("Failed to upload meme.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center p-5 border-b border-gray-700">
        <div className="text-xl font-bold">
          <a href="/">G-meme</a>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectAndSIWE />
        </div>
      </nav>

      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Meme Gallery</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsUploadOpen(true)}
          >
            Upload Meme
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {memes.map((meme) => (
            <div
              key={meme._id}
              className="bg-gray-800 rounded p-2 cursor-pointer hover:scale-105 transition"
              onClick={() => router.push(`/memes/${meme._id}`)}
            >
              <img
                src={`${API_URL}/uploads/${meme.image.replace(/^\/+/, "")}`}
                alt={meme.name}
                className="rounded w-full h-48 object-cover"
                width={300}
                height={200}
              />
              <h3 className="mt-2 font-semibold">{meme.name}</h3>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-blue-600 py-1 rounded text-sm">
                  Buy Token
                </button>
                <button
                  className="flex-1 bg-yellow-500 py-1 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/memes/${meme._id}?remix=true`);
                  }}
                >
                  Remix
                </button>
              </div>
            </div>
          ))}
        </div>

        {isUploadOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white p-6 border border-gray-300 rounded  w-full ml-2 mr-2 max-w-md">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
                onClick={() => setIsUploadOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-4">Upload Meme</h2>
              <input
                type="text"
                placeholder="Meme Name"
                className="w-full text-black border px-2 py-1 mb-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                placeholder="Meme Description"
                className="w-full text-black border px-2 py-1 mb-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <p>
                <b>Example: </b> A cartoonish Bitcoin whale hoarding coins while
                people chase after it, comedic style.
              </p>

              <div className="w-full h-60 border border-dashed border-gray-500 flex items-center justify-center rounded mb-4 relative">
                {isGenerating ? (
                  <span className="text-white text-sm">Loading image...</span>
                ) : generatedImage ? (
                  <Image
                    src={generatedImage}
                    alt="Generated Meme"
                    className="w-full h-full object-cover rounded"
                    width={500}
                    height={300}
                  />
                ) : (
                  <span className="text-gray-500">
                    Image will appear here after generation
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Image"}
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={handleSubmit}
                  disabled={!generatedImage || isGenerating}
                >
                  Mint Meme
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-gray-500 mt-8 mb-8">
        BUILT ON BASE WITH MINIKIT
        <br></br>
        <br></br>
      </footer>
    </div>
  );
}
