import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 blur-[120px] rounded-full" />
      </div>

      <div className="z-10 w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
            <h1 className="font-serif text-5xl md:text-6xl text-gold">Mbinga</h1>
            <p className="text-white/40 uppercase tracking-[0.4em] text-xs">Admin Portal</p>
        </div>

        <LoginForm />
        
        <p className="text-white/20 text-xs font-light">
            Restricted Access · Authorized Personnel Only
        </p>
      </div>
    </main>
  );
}
