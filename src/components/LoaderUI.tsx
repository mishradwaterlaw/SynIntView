// src/components/LoaderUI.tsx
import { Loader2 } from "lucide-react";

const LoaderUI = () => {
  return (
    <div className="flex-center h-screen w-full">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );
};

export default LoaderUI;