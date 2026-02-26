// src/app/meeting/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";
import LoaderUI from "@/components/LoaderUI";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import { useGetCallById } from "@/hooks/useGetCallById";

export default function MeetingPage() {
  const { id } = useParams(); // Grabs the call ID from the URL
  const { status } = useSession();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // We need a specific "Call" object from Stream to manage the video state
  const { call, isCallLoading } = useGetCallById(id as string);

  if (status === "loading" || isCallLoading) return <LoaderUI />;

  if (!call) return <p className="text-center font-bold">Call not found</p>;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}