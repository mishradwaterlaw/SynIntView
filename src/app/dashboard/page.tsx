"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { createStreamCall } from "@/actions/stream.actions";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Video, Calendar, UserCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  const createInterview = useMutation(api.interviews.createInterview);
  
  // 1. Fetch Candidates and Existing Interviews
  const candidates = useQuery(api.users.getCandidates, { 
    currentUserEmail: session?.user?.email ?? "" 
  });
  const interviews = useQuery(api.interviews.getInterviewerList, { 
    interviewerId: session?.user?.id as any 
  });

  const handleTestSchedule = async (candidateId: string, candidateEmail: string) => {
    setLoading(true);
    try {
      const callId = await createStreamCall([candidateEmail]);
      await createInterview({
        title: "Technical Interview",
        description: "Initial Screening",
        startTime: Date.now() + 86400000, 
        status: "upcoming",
        streamCallId: callId,
        candidateId: candidateId as any,
        interviewerId: session?.user?.id as any,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* SECTION 1: UPCOMING INTERVIEWS (The "Action" Area) */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Video className="text-blue-400" /> Active Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews?.filter(i => i.status !== "completed").map((interview) => (
              <Card key={interview._id} className="bg-slate-900/50 border-slate-800 border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-xl">{interview.title}</CardTitle>
                    <Badge className="bg-blue-600">Upcoming</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-400 text-sm">Join the WebRTC room to start the assessment.</p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/meeting/${interview._id}`}>
                      Start Interview
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 2: CANDIDATE DIRECTORY */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-300">
            <UserCheck className="text-emerald-400" /> Candidate Directory
          </h2>
          <div className="grid gap-4">
            {candidates?.map((c) => (
              <div key={c._id} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex justify-between items-center hover:bg-slate-800/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{c.name}</p>
                    <p className="text-xs text-slate-500 italic">{c.role || "Candidate"}</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  disabled={loading}
                  onClick={() => handleTestSchedule(c._id, c.email)}
                >
                  {loading ? <Loader2 className="animate-spin size-4" /> : <Calendar className="size-4 mr-2" />}
                  Schedule
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}