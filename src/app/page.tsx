import { SlangAnalyzer } from "@/components/slang-analyzer";
import { SlangScopeIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-4">
          <SlangScopeIcon className="h-12 w-12 text-primary" />
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground mb-12">
          Your modern guide to understanding internet slang. Paste any text to get instant definitions, origins, and usage demographics. Never be out of the loop again.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <SlangAnalyzer />
      </div>

      <footer className="text-center mt-16 text-sm text-muted-foreground">
        <p>Powered by Gemini AI. Built with Next.js.</p>
      </footer>
    </main>
  );
}
