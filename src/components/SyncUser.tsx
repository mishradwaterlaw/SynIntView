// src/components/SyncUser.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SyncUser() {
  const { data: session, status } = useSession();
  const sync = useMutation(api.users.syncUser);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    // Only run if we have a user and haven't synced in this component instance yet
    if (status === "authenticated" && session?.user?.email && !isSynced) {
      sync({
        name: session.user.name ?? "Anonymous",
        email: session.user.email,
        image: session.user.image ?? "",
      })
      .then(() => setIsSynced(true))
      .catch((err) => console.error("Sync failed:", err));
    }
  }, [session, status, sync, isSynced]);

  // Return null so this component doesn't render anything or block the UI
  return null;
}