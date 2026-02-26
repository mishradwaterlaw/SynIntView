// src/components/InterviewerPostits.tsx
"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";


export default function InterviewerPostits({ interviewId }: { interviewId: Id<"interviews"> }) {
  // 1. Get existing notes from Convex
  const interview = useQuery(api.interviews.getInterviewById, { id: interviewId });
  const updateNotes = useMutation(api.interviews.updateInterviewNotes);
  
  const [localNotes, setLocalNotes] = useState("");

  // Sync local state when the database data loads
  useEffect(() => {
    if (interview?.notes) setLocalNotes(interview.notes);
  }, [interview?.notes]);

  const handleTextChange = (text: string) => {
    setLocalNotes(text);
    // 2. Debounced-style update: In a real app, you'd debounce this. 
    // For now, it updates Convex directly.
    updateNotes({ id: interviewId, notes: text });
  };

  return (
    <div className="h-full flex flex-col p-4 bg-slate-800 border-l border-slate-700 w-80">
      <h2 className="text-white font-bold mb-4">Interviewer Notes</h2>
      <textarea
        className="flex-1 bg-slate-900 text-white p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Type candidate feedback here..."
        value={localNotes}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      <p className="text-xs text-slate-400 mt-2 italic">Auto-saving to Convex...</p>
    </div>
  );
}