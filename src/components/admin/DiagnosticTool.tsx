'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Lightbulb, Wrench, Loader2, AlertCircle } from 'lucide-react';
import { DiagnosticFormSchema, type DiagnosticFormValues } from '@/lib/schemas';
import { getAIDiagnosis } from '@/app/actions/diagnostics';
import { useState } from 'react';
import type { DiagnoseProblemOutput } from '@/ai/flows/diagnose-problem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function DiagnosticTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseProblemOutput | null>(null);

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(DiagnosticFormSchema),
    defaultValues: {
      problemDescription: '',
    },
  });

  async function onSubmit(values: DiagnosticFormValues) {
    setIsLoading(true);
    setError(null);
    setDiagnosisResult(null);

    const result = await getAIDiagnosis(values);

    if (result.success && result.data) {
      setDiagnosisResult(result.data);
    } else {
      setError(result.message || 'Failed to get diagnosis.');
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BrainCircuit className="h-7 w-7 text-primary" />
            AI-Powered Diagnostic Assistant
          </CardTitle>
          <CardDescription>
            Enter the user's problem description to get potential issues and required tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="problemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Problem Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="e.g., 'The air conditioner is making a loud rattling noise and not cooling properly. It started yesterday after a power outage.'"
                        {...field}
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Diagnosing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Get Diagnosis
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {diagnosisResult && (
        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-xl">Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Potential Issues
              </h3>
              {diagnosisResult.potentialIssues && diagnosisResult.potentialIssues.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-2 bg-secondary/30 p-4 rounded-md">
                  {diagnosisResult.potentialIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific potential issues identified. More details might be needed.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-gray-600" />
                Potentially Required Tools
              </h3>
              {diagnosisResult.requiredTools && diagnosisResult.requiredTools.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-2 bg-secondary/30 p-4 rounded-md">
                  {diagnosisResult.requiredTools.map((tool, index) => (
                    <li key={index}>{tool}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific tools identified. Standard diagnostic kit may be required.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
