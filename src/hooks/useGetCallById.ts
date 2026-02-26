import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient(); // Access the Stream client we set up in providers

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      // Fetch calls where the ID matches our URL parameter
      const { calls } = await client.queryCalls({
        filter_conditions: { id },
      });

      if (calls.length > 0) setCall(calls[0]);

      setIsCallLoading(false);
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};