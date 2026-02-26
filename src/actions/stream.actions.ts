// src/actions/stream.actions.ts
"use server";

import { auth } from "@/auth"; 
import { StreamClient } from "@stream-io/node-sdk"; 

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

// ADD 'export' HERE
export const streamTokenProvider = async () => {
  const session = await auth();

  if (!session?.user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("No API key found");
  if (!apiSecret) throw new Error("No API secret found");

  const client = new StreamClient(apiKey, apiSecret);

  const userId = session.user.email ?? session.user.id;
  
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.generateUserToken({ user_id: userId!, exp, issued });

  return token;
};

// ADD 'export' HERE
export const createStreamCall = async (participantIds: string[]) => {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const client = new StreamClient(apiKey!, apiSecret!);

  const callId = crypto.randomUUID(); 
  
  // Using .video.call for the Node SDK
  const call = client.video.call("default", callId);

  await call.getOrCreate({
    data: {
      created_by_id: session.user?.email!,
      members: participantIds.map((id) => ({ user_id: id, role: "call_member" })),
    },
  });

  return callId;
};