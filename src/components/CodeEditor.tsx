"use client";

import Editor from "@monaco-editor/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function CodeEditor({ interviewId }: { interviewId: Id<"interviews"> }) {
  const interview = useQuery(api.interviews.getInterviewById, { id: interviewId });
  const updateCode = useMutation(api.interviews.updateCode);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCode({ id: interviewId, code: value });
    }
  };

  return (
    <div className="h-full w-full border-r border-slate-700">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={interview?.code || "// Start coding here..."}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}