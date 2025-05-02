"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useState } from "react";
import { ConnectAndSIWE } from "./components/ConnectAndSIWE";
import { useRouter } from "next/navigation";
import Image from "next/image";

import doge from "../public/cow.jpg";

const dummyMemes = [
  { id: "1", name: "DogeCoin", image: doge },
  { id: "2", name: "PepeCoin", image: doge },
  { id: "3", name: "ShibaMoon", image: doge },
  { id: "4", name: "ElonDoge", image: doge },
  { id: "5", name: "ElonDoge", image: doge },
  { id: "6", name: "ElonDoge", image: doge },
  { id: "7", name: "ElonDoge", image: doge },
  { id: "8", name: "ElonDoge", image: doge },
];

export default function Page() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const router = useRouter();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [generatedImage, setGeneratedImage] = useState(doge);

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [setFrameReady, isFrameReady]);

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
              <Image
                src={generatedImage}
                alt="Generated Meme"
                className="w-full h-60 object-cover rounded mb-2 mt-4"
              />
              <div className="flex justify-between">
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded"
                  onClick={() => setGeneratedImage(doge)}
                >
                  Generate Image
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => setIsUploadOpen(false)}
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
