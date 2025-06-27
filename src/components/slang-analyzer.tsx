"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Globe, Loader2, Users } from "lucide-react";

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

const SlangTerm = ({ slang }: { slang: IdentifySlangOutput[0] }) => (
  <Popover>
    <PopoverTrigger asChild>
      <span className="underline decoration-accent decoration-2 underline-offset-2 cursor-pointer font-semibold text-primary">
        {slang.term}
      </span>
    </PopoverTrigger>
    <PopoverContent className="w-80 shadow-xl">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none text-primary">{slang.term}</h4>
          <p className="text-sm text-muted-foreground">{slang.meaning}</p>
        </div>
        <div className="grid gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Globe className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
            <div>
              <h5 className="font-semibold text-foreground">Country of Origin</h5>
              <p className="font-semibold text-accent">{slang.countryOfOrigin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
            <div>
              <h5 className="font-semibold text-foreground">Age Range</h5>
              <p className="font-semibold text-accent">{slang.estimatedAgeRange}</p>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const renderAnalyzedText = (text: string, analysis: IdentifySlangOutput) => {
  if (!analysis || analysis.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
  }

  const slangMap = new Map(analysis.map((item) => [item.term, item]));
  
  const sortedTerms = [...analysis]
    .map((s) => s.term)
    .sort((a, b) => b.length - a.length);

  if (sortedTerms.length === 0) {
      return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
  }

  const escapedTerms = sortedTerms.map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'g');
  const parts = text.split(regex).filter(Boolean);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        const slangDetail = slangMap.get(part);
        if (slangDetail) {
          return <SlangTerm key={i} slang={slangDetail} />;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
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
    if (!isDetectionEnabled) {
      setResult(null);
      setInputText(values.text);
      return;
    };

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
              <Button type="submit" className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Text"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && !isLoading && (
        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Hover over the highlighted terms to see details.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderAnalyzedText(inputText, result)}
            </CardContent>
          
            {result.length > 0 && (
              <>
                <CardHeader className="pt-0">
                  <CardTitle>Slang Glossary</CardTitle>
                  <CardDescription>A quick reference for the detected slang.</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4">
                    {result.map((slang, index) => (
                      <div key={index}>
                        <dt className="font-semibold text-primary">{slang.term}</dt>
                        <dd className="text-muted-foreground">{slang.briefDefinition}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </>
            )}
        </Card>
      )}
    </div>
  );
}
