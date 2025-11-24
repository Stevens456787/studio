'use client';

import { useRef, useState, useTransition } from 'react';
import { createTechnician } from '@/app/actions/technicians';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const MAX_DOC_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OnboardingForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    specialties: '',
    coverageAreas: '',
    certifications: '',
    availabilityStatus: 'available_now',
    capacity: 3,
    verificationDocs: [] as string[],
  });
  const [docNames, setDocNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const specialties = form.specialties.split(',').map(s => s.trim()).filter(Boolean);
        const coverageAreas = form.coverageAreas.split(',').map(s => s.trim()).filter(Boolean);
        const certifications = form.certifications.split(',').map(s => s.trim()).filter(Boolean);

        let uploadedUrls: string[] = [];
        if (files.length) {
          try {
            const uploads = files.map(async file => {
              const path = `technicians/${Date.now()}-${file.name}`;
              const storageRef = ref(storage, path);
              await uploadBytes(storageRef, file);
              return getDownloadURL(storageRef);
            });
            uploadedUrls = await Promise.all(uploads);
          } catch (uploadError) {
            console.error('Upload failed, falling back to inline data', uploadError);
            toast({
              title: 'Upload failed',
              description: 'Storing documents inline for now. Consider retrying uploads later.',
              variant: 'destructive',
            });
            uploadedUrls = await Promise.all(files.map(fileToDataUri));
          }
        }

        const result = await createTechnician({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          specialties,
          coverageAreas,
          certifications,
          verificationDocs: uploadedUrls,
          availabilityStatus: form.availabilityStatus as any,
          capacity: Number(form.capacity) || 1,
        });

        if (result.success) {
          toast({ title: 'Submitted', description: 'Your profile is pending review.' });
          setForm({
            fullName: '',
            phone: '',
            email: '',
            specialties: '',
            coverageAreas: '',
            certifications: '',
            availabilityStatus: 'available_now',
            capacity: 3,
            verificationDocs: [],
          });
          setDocNames([]);
          setFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          toast({ title: 'Failed', description: result.message ?? 'Please try again.', variant: 'destructive' });
        }
      } catch (error) {
        console.error('Onboarding submit failed', error);
        toast({ title: 'Error', description: 'Could not submit your profile. Please try again.', variant: 'destructive' });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Technician Onboarding</CardTitle>
        <CardDescription>Share your specialties and coverage areas to join the FieldAssist roster.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => update('phone', e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Email (optional)</Label>
            <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Specialties (comma-separated)</Label>
              <Textarea
                value={form.specialties}
                onChange={e => update('specialties', e.target.value)}
                placeholder="HVAC, Plumbing, Smart Home"
              />
            </div>
            <div className="space-y-1">
              <Label>Coverage Areas (comma-separated)</Label>
              <Textarea
                value={form.coverageAreas}
                onChange={e => update('coverageAreas', e.target.value)}
                placeholder="Westlands, CBD, Upper Hill"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Certifications (comma-separated)</Label>
            <Textarea
              value={form.certifications}
              onChange={e => update('certifications', e.target.value)}
              placeholder="NITA Level 2, EcoXpert"
            />
          </div>
          <div className="space-y-2">
            <Label>Upload verification (ID, certifications, school papers) — max 25MB each</Label>
            <label className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center text-sm font-medium text-primary hover:bg-primary/10">
              <span>
                Choose file(s)
                <span className="text-xs text-muted-foreground block">Images or PDF, multiple allowed</span>
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={async event => {
                const files = Array.from(event.target.files || []);
                if (!files.length) {
                  setFiles([]);
                  setDocNames([]);
                  return;
                }

                const tooLarge = files.find(f => f.size > MAX_DOC_SIZE_BYTES);
                if (tooLarge) {
                    toast({
                      title: 'File too large',
                      description: `${tooLarge.name} exceeds 25MB.`,
                      variant: 'destructive',
                    });
                    event.target.value = '';
                    return;
                  }

                  setFiles(files);
                  setDocNames(files.map(f => f.name));
                }}
              />
            </label>
            {docNames.length > 0 && (
              <p className="text-xs text-muted-foreground">Attached: {docNames.join(', ')}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Availability</Label>
              <Select value={form.availabilityStatus} onValueChange={value => update('availabilityStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available_now">Available now</SelectItem>
                  <SelectItem value="next_slot">Next slot</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Capacity (jobs)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.capacity}
                onChange={e => update('capacity', e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full md:w-auto">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit for Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
