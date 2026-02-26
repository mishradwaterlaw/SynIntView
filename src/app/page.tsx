import { auth, signIn, signOut } from "@/auth";
import { SyncUser } from "@/components/SyncUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, Code2, Users2, ShieldCheck } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      {session && <SyncUser />}

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6">
          Technical Interviews, <br /> Redefined.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          A high-performance ecosystem for real-time coding, high-fidelity video, 
          and instant feedback syncing.
        </p>

        {!session ? (
          <Card className="max-w-md mx-auto bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Get Started</CardTitle>
              <CardDescription>Sign in to host or join an interview</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={async () => { "use server"; await signIn("github"); }}>
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-500 gap-2">
                  <Code2 size={20} /> Continue with GitHub
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-blue-400 font-medium">Welcome back, {session.user?.name}</p>
            <div className="flex gap-4">
              <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="/dashboard">Enter Dashboard</a>
              </Button>
              <form action={async () => { "use server"; await signOut(); }}>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <FeatureCard icon={<Laptop className="text-blue-400" />} title="Live Code Sync" desc="Real-time Monaco editor with zero-latency synchronization." />
        <FeatureCard icon={<Users2 className="text-cyan-400" />} title="WebRTC Video" desc="Low-latency video grid powered by Stream Video SDK." />
        <FeatureCard icon={<ShieldCheck className="text-emerald-400" />} title="Convex Data" desc="Instant feedback persistence and reliable interview state." />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}