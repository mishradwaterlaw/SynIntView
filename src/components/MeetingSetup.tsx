// src/components/MeetingSetup.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  DeviceSettings, 
  VideoPreview, 
  useCall 
} from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

export default function MeetingSetup({ 
  setIsSetupComplete 
}: { 
  setIsSetupComplete: (value: boolean) => void 
}) {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  
  // useCall() is a specialized hook that finds the 
  // active StreamCall context we created in the [id]/page.tsx
  const call = useCall();

  if (!call) {
    throw new Error("useCall must be used within StreamCall component");
  }

  useEffect(() => {
    // If the user toggles the checkbox to "Mute", 
    // we tell the Stream engine to disable hardware access.
    if (isMicCamToggledOn) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggledOn, call.camera, call.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white bg-black">
      <h1 className="text-2xl font-bold">Setup</h1>
      
      {/* This component automatically renders the user's camera feed */}
      <VideoPreview />

      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        
        {/* DeviceSettings provides the gear icon to change inputs */}
        <DeviceSettings />
      </div>

      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join(); // Actually joins the meeting room
          setIsSetupComplete(true); // Switches the UI to the MeetingRoom
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
}