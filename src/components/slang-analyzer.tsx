"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { analyzeSlang } from "@/app/actions";
import type { IdentifySlangOutput } from "@/ai/flows/identify-slang";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  text: z.string().min(1, { message: "Please enter some text to analyze." }),
});

const SlangTerm = ({ slang, text }: { slang: IdentifySlangOutput[0]; text: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <span className="underline decoration-accent decoration-2 underline-offset-2 cursor-pointer font-semibold text-primary">
        {text.substring(slang.startIndex, slang.endIndex)}
      </span>
    </PopoverTrigger>
    <PopoverContent className="w-80 shadow-xl">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none text-primary">{slang.term}</h4>
          <p className="text-sm text-muted-foreground">{slang.meaning}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-foreground">Origin</h5>
            <p className="text-muted-foreground">{slang.countryOfOrigin}</p>
          </div>
          <div>
            <h5 className="font-semibold text-foreground">Age Range</h5>
            <p className="text-muted-foreground">{slang.estimatedAgeRange}</p>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const renderAnalyzedText = (text: string, analysis: IdentifySlangOutput) => {
  if (analysis.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
  }

  const sortedSlang = [...analysis].sort((a, b) => a.startIndex - b.startIndex);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedSlang.forEach((slang, index) => {
    if (slang.startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, slang.startIndex));
    }
    parts.push(<SlangTerm key={index} slang={slang} text={text} />);
    lastIndex = slang.endIndex;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => (
        <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </div>
  );
};


export function SlangAnalyzer() {
  const [result, setResult] = React.useState<IdentifySlangOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [inputText, setInputText] = React.useState('');
  const [isDetectionEnabled, setIsDetectionEnabled] = React.useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "That new track is fire, it really slaps. No cap." },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isDetectionEnabled) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setInputText(values.text);

    try {
      const slangResult = await analyzeSlang({ text: values.text });
      setResult(slangResult || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Analyzer</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="detection-switch"
                checked={isDetectionEnabled}
                onCheckedChange={setIsDetectionEnabled}
              />
              <Label htmlFor="detection-switch">Enable</Label>
            </div>
          </div>
          <CardDescription>Enter text below to identify and learn about slang.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., That party was totally lit, no cap."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !isDetectionEnabled} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Identify Slang'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            {result.length > 0 ? (
              <CardDescription>We found {result.length} slang term(s). Hover over the highlighted words for details.</CardDescription>
            ) : (
              <CardDescription>No slang terms were found in your text.</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-lg bg-background/50 text-lg">
              {renderAnalyzedText(inputText, result)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
