
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Lightbulb, Wrench, Loader2, AlertCircle, FileUp, XCircle, Video, Image as ImageIcon } from 'lucide-react';
import { DiagnosticFormSchema, type DiagnosticFormValues } from '@/lib/schemas';
import { getAIDiagnosis } from '@/app/actions/diagnostics';
import { useState, useRef, type ChangeEvent } from 'react';
import type { DiagnoseProblemOutput } from '@/ai/flows/diagnose-problem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';


export default function DiagnosticTool() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseProblemOutput | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const MAX_FILE_SIZE_MB = 50;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const form = useForm<DiagnosticFormValues>({
        resolver: zodResolver(DiagnosticFormSchema),
        defaultValues: {
            problemDescription: '',
            mediaDataUri: undefined,
        },
    });

    const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setMediaPreview(null);
                setMediaType(null);
                form.setValue('mediaDataUri', undefined);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setMediaPreview(dataUri);
                if (file.type.startsWith('image/')) {
                    setMediaType('image');
                } else if (file.type.startsWith('video/')) {
                    setMediaType('video');
                } else {
                    setMediaType(null); // Should not happen with accept filter
                }
                form.setValue('mediaDataUri', dataUri);
            };
            reader.readAsDataURL(file);
        } else {
            setMediaPreview(null);
            setMediaType(null);
            form.setValue('mediaDataUri', undefined);
        }
    };

    const removeMedia = () => {
        setMediaPreview(null);
        setMediaType(null);
        form.setValue('mediaDataUri', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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
                        Enter the problem description and optionally upload an image or short video (max {MAX_FILE_SIZE_MB}MB) to get potential issues and required tools.
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

                            <FormField
                                control={form.control}
                                name="mediaDataUri"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base flex items-center gap-2">
                                            <FileUp className="h-5 w-5" />
                                            Upload Image or Video (Optional, Max {MAX_FILE_SIZE_MB}MB)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/png, image/jpeg, image/webp, video/mp4, video/webm, video/quicktime"
                                                onChange={handleMediaChange}
                                                ref={fileInputRef}
                                                className="text-base file:mr-6 file:py-1n file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {mediaPreview && (
                                <div className="relative group w-full max-w-md mx-auto border p-2 rounded-md shadow-inner bg-muted/20">
                                    {mediaType === 'image' && mediaPreview && (
                                        <Image
                                            src={mediaPreview}
                                            alt="Problem preview"
                                            width={400}
                                            height={300}
                                            className="rounded-md object-contain max-h-[300px] w-full"
                                        />
                                    )}
                                    {mediaType === 'video' && mediaPreview && (
                                        <video
                                            src={mediaPreview}
                                            controls
                                            className="rounded-md object-contain max-h-[300px] w-full"
                                        />
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={removeMedia}
                                        className="absolute top-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity z-10"
                                        aria-label="Remove media"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}

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
