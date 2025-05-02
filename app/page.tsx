"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useState } from "react";
import { ConnectAndSIWE } from "./components/ConnectAndSIWE";
import { useRouter } from "next/navigation";
import Image from "next/image";
import API_URL from "./config";

import aaa from "../public/aaa.jpg";
import bbb from "../public/bbb.jpg";
import ccc from "../public/ccc.jpg";
import ddd from "../public/ddd.jpg";
import eee from "../public/eee.jpg";
import fff from "../public/fff.jpg";
import ggg from "../public/ggg.png";
import hhh from "../public/hhh.jpg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import doge from "../public/iii.jpg";

const dummyMemes = [
  { id: "1", name: "NebulaBit", image: aaa },
  { id: "2", name: "QuantumPaw", image: bbb },
  { id: "3", name: "EchoSphere", image: ccc },
  { id: "4", name: "ZenithChain", image: ddd },
  { id: "5", name: "SolisToken", image: eee },
  { id: "6", name: "AetherSwap", image: fff },
  { id: "7", name: "NimbusByte", image: ggg },
  { id: "8", name: "VertexPay", image: hhh },
];

export default function Page() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const router = useRouter();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
          {dummyMemes.map((m) => (
            <div
              key={m.id}
              className="bg-gray-800 rounded p-2 cursor-pointer hover:scale-105 transition"
              onClick={() => router.push(`/memes/${m.id}`)}
            >
              <Image
                src={m.image}
                alt={m.name}
                className="rounded w-full h-48 object-cover"
              />
              <h3 className="mt-2 font-semibold">{m.name}</h3>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-blue-600 py-1 rounded text-sm">
                  Buy Token
                </button>
                <button
                  className="flex-1 bg-yellow-500 py-1 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/memes/${m.id}?remix=true`);
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

              <div className="flex justify-between">
                <p>
                  <b>Token Address: </b>{" "}
                  0x1234567890abcdef1234567890abcdef12345678
                </p>
                <button
                  className="bg-yellow-600 text-white px-3 py-1 rounded"
                  onClick={() => setIsUploadOpen(false)}
                  aria-label="Close"
                >
                  Close
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
