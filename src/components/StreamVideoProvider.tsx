"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { streamTokenProvider } from "@/actions/stream.actions";
import LoaderUI from "./LoaderUI"; // Ensure you have the Loader component from the video

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (!apiKey) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: session.user.email!, // Use email as unique ID
        name: session.user.name || session.user.email!,
        image: session.user.image || undefined,
      },
      tokenProvider: streamTokenProvider,
    });

    setVideoClient(client);

    return () => {
      client.disconnectUser();
      setVideoClient(undefined);
    };
  }, [session, status]);

  if (!videoClient) return <LoaderUI />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};