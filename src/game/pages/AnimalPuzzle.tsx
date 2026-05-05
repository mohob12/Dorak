"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnimalPuzzle = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6fbff] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl items-center justify-center">
        <Card className="w-full max-w-2xl rounded-[2rem] border-0 bg-white/95 shadow-[0_20px_60px_rgba(104,140,255,0.18)]">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd8a8] text-[#d9891f]">
              <PawPrint className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900">Animal Puzzle</CardTitle>
            <CardDescription className="mx-auto max-w-md text-base text-slate-600">
              This game mode is ready as a placeholder so the app can load without errors.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 pb-8">
            <div className="rounded-3xl bg-[#f8fbff] px-5 py-4 text-center text-slate-700">
              <p className="flex items-center justify-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-[#4f6bed]" />
                Animal puzzle content can be added here next.
              </p>
            </div>

            <Button
              onClick={() => navigate("/")}
              className="rounded-full bg-[#4f6bed] px-8 py-6 text-base font-semibold hover:bg-[#3f5ad7]"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AnimalPuzzle;