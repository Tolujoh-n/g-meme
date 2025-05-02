"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ConnectAndSIWE } from "../../components/ConnectAndSIWE";
import cow from "../../../public/cow.jpg";
import doge from "../../../public/cow.jpg";
import pig from "../../../public/cow.jpg";

const dummyMemes = [
  {
    id: "1",
    name: "DogeCoin",
    image: cow,
    remixes: [cow, pig, doge, cow],
  },
  {
    id: "2",
    name: "PepeCoin",
    image: cow,
    remixes: [cow, pig],
  },
];

interface MemeDetailsParams {
  id: string;
}

export default function MemeDetails({ params }: { params: MemeDetailsParams }) {
  const { id } = params; // dynamic segment
  const searchParams = useSearchParams(); // query params
  const remixMode = searchParams.get("remix") === "true";

  const [isRemixOpen, setIsRemixOpen] = useState(remixMode);
  const [description, setDescription] = useState("");
  const [genImage, setGenImage] = useState("https://via.placeholder.com/300");

  const meme = dummyMemes.find((m) => m.id === id);
  if (!meme) return <div className="p-10 text-white">Meme not found.</div>;

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

      <main className="p-4 text-white">
        <div className="">
          <Image
            src={meme.image}
            alt={meme.name}
            className="w-full h-[300px] rounded mb-4"
          />
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{meme.name}</h1>
            <div className="flex gap-4">
              <button className="bg-blue-600 py-2 px-4 rounded">
                Buy Token
              </button>
              <button
                className="bg-yellow-500 py-2 px-4 rounded"
                onClick={() => setIsRemixOpen(true)}
              >
                Remix
              </button>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6 mt-6">Remix Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {meme.remixes.map((src, i) => (
              <Image key={i} src={src} alt="image" className="rounded" />
            ))}
          </div>
        </div>

        {isRemixOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white p-6 border border-gray-300 rounded  w-full ml-2 mr-2 max-w-md">
              <img
                src={genImage}
                className="w-full h-60 object-cover rounded mb-2"
              />
              <textarea
                placeholder="Description"
                className="w-full border text-black px-2 py-1 mb-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    setGenImage("https://via.placeholder.com/300?text=Remix+AI")
                  }
                >
                  Generate
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => setIsRemixOpen(false)}
                >
                  Save
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
