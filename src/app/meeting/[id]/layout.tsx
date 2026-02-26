// src/app/meeting/[id]/layout.tsx
import { StreamVideoProvider } from "@/components/StreamVideoProvider";

export default function MeetingLayout({ children }: { children: React.ReactNode }) {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}