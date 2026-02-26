"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CallControls,
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { Users, LayoutList } from "lucide-react";
import LoaderUI from "./LoaderUI";
import { Button } from "./ui/button";
import InterviewerPostits from "./InterviewerPostits";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor"; // Ensure you've created this file

type LayoutType = "grid" | "speaker-left" | "speaker-right";

export default function MeetingRoom() {
  const { id } = useParams();
  const router = useRouter();
  const call = useCall();
  
  const [layout, setLayout] = useState<LayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  useEffect(() => {
    if (!call) return;
    const unsubscribe = call.state.participants$.subscribe((participants) => {
      const screenSharing = participants.some((p) => p.screenShareStream);
      setIsSharingScreen(screenSharing);
    });
    return () => unsubscribe.unsubscribe();
  }, [call]);

  useEffect(() => {
    if (participants.length > 1) {
      console.log("A participant has joined the room.");
    }
  }, [participants.length]);

  if (callingState !== CallingState.JOINED) return <LoaderUI />;

  const renderLayout = () => {
    if (isSharingScreen) {
      return <SpeakerLayout participantsBarPosition="right" />;
    }
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden text-white bg-slate-900">
      {/* 1. Main Workspace: Flex container to split screen horizontally */}
      <div className="flex size-full">
        
        {/* LEFT/CENTER: Code Editor (The core workspace) */}
        <div className="flex-[2] h-full border-r border-slate-800">
          <CodeEditor interviewId={id as any} />
        </div>

        {/* RIGHT SIDE: Video and Notes stack vertically */}
        <div className="flex-1 flex flex-col min-w-[350px] bg-slate-900">
          
          {/* Top Half: Video Feeds */}
          <div className="relative h-1/2 w-full p-2 border-b border-slate-800 flex items-center justify-center">
            <div className="size-full">
               {renderLayout()}
            </div>
            
            {/* Conditional Participant Sidebar overlay */}
            {showParticipants && (
              <div className="absolute inset-y-0 right-0 z-10 w-full bg-slate-800/95 p-4 overflow-y-auto">
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            )}
          </div>

          {/* Bottom Half: Interviewer Feedback/Notes */}
          <div className="h-1/2 w-full">
             <InterviewerPostits interviewId={id as any} />
          </div>
        </div>
      </div>

      {/* Control Bar: Fixed at bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 p-4 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 z-20">
        <CallControls onLeave={() => router.push("/dashboard")} />
        <EndCallButton />
        
        <Button 
          onClick={() => setLayout((prev) => (prev === "grid" ? "speaker-left" : "grid"))}
          className="bg-slate-700 hover:bg-slate-600 p-3 rounded-full"
        >
          <LayoutList size={20} />
        </Button>

        <Button 
          onClick={() => setShowParticipants((prev) => !prev)}
          className="bg-slate-700 hover:bg-slate-600 p-3 rounded-full"
        >
          <Users size={20} />
        </Button>
      </div>
    </section>
  );
}