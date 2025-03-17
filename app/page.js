"use client";

import { useState, useEffect } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Info, MapPin, Github, XCircle } from "lucide-react";
import RealisticEarth from "@/components/RealisticEarth";

export default function Home() {
  const [locationStatus, setLocationStatus] = useState("denied");
  const [infoOpen, setInfoOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 4.5, y: -2, z: 6 });

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const phi = (90 - latitude) * (Math.PI / 180);
        const theta = (longitude + 180) * (Math.PI / 180);

        const x = Math.round(-3 * Math.sin(phi) * Math.cos(theta));
        const y = Math.round(3 * Math.cos(phi));

        setCameraPosition({ x, y, z: 6 });
        setLocationStatus("allowed");
        setLocationOpen(false);
      },
      () => {
        setLocationStatus("denied");
        setLocationOpen(false);
      }
    );
  };

  return (
    <main className="relative w-full h-screen">
      <NavigationMenu.Root className="absolute top-5 left-5 z-50 bg-gray-900 p-3 rounded-xl shadow-lg">
        <NavigationMenu.List className="flex space-x-4">
          <NavigationMenu.Item>
            <Dialog.Root open={infoOpen} onOpenChange={setInfoOpen}>
              <Dialog.Trigger className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-all">
                <Info size={20} />
                <span>Info</span>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-xl max-w-md border border-gray-700 transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-semibold text-white">
                      🌍 About the Project
                    </Dialog.Title>
                    <Dialog.Close className="text-gray-400 hover:text-white">
                      <XCircle size={24} />
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="mt-3 text-gray-300 leading-relaxed">
                    This project is a study of globe integrations using{" "}
                    <b>Three.js</b>. It is part of a larger future project that
                    aims to visualize real-time global interactions.
                  </Dialog.Description>
                  <button
                    onClick={() => setInfoOpen(false)}
                    className="mt-5 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white transition-all"
                  >
                    Got it! 🚀
                  </button>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Dialog.Root open={locationOpen} onOpenChange={setLocationOpen}>
              <Dialog.Trigger className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-all">
                <MapPin size={20} />
                <span>Location</span>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-xl max-w-md border border-gray-700 transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-semibold text-white">
                      📍 Location Permission
                    </Dialog.Title>
                    <Dialog.Close className="text-gray-400 hover:text-white">
                      <XCircle size={24} />
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="mt-3 text-gray-300 leading-relaxed">
                    We need permission to access your location to position you
                    on the globe. This is used only for visualization purposes.
                  </Dialog.Description>
                  <div className="flex mt-5 space-x-3">
                    <button
                      onClick={() => {
                        setLocationStatus("denied");
                        setLocationOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white transition-all"
                    >
                      Deny ❌
                    </button>
                    <button
                      onClick={handleLocation}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-white transition-all"
                    >
                      Allow ✅
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <a
              href="https://github.com/fonteeboa/next-globe-vis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-all"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <RealisticEarth
        locationStatus={locationStatus}
        cameraPosition={cameraPosition}
      />
    </main>
  );
}
