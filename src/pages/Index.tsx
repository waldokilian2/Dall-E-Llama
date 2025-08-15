import Chat from "@/components/Chat";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background"> {/* Use theme-aware background */}
      {/* Background glowing gradients (animation removed) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>
      {/* Main chat container with glass effect */}
      <div className="relative z-10 w-full max-w-3xl h-[90vh] rounded-xl overflow-hidden backdrop-filter backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <Chat />
      </div>
    </div>
  );
};

export default Index;