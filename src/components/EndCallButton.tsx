// src/components/EndCallButton.tsx
"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  // Engineering Check: Only the person who created the call (Interviewer) 
  // should see the "End Call for All" button.
  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await call.endCall(); // This terminates the WebRTC session for ALL peers
    router.push("/dashboard");
  };

  return (
    <Button onClick={endCall} className="bg-red-600 hover:bg-red-700 font-bold">
      End Call for Everyone
    </Button>
  );
}