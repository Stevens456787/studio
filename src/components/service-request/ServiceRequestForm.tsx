'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Send,
  Loader2,
  User,
  Phone,
  MapPin,
  MessageSquareWarning,
  Clock,
  Snowflake,
  Zap,
  Droplets,
  Plug,
  Wrench,
  Home,
  PhoneCall,
  MessageSquare,
  MessageCircle,
  Mail,
  Camera,
  UploadCloud,
  Trash2,
  DollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  CONTACT_METHOD_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  ServiceRequestSchema,
  type ServiceRequestFormValues,
} from '@/lib/schemas';
import { submitServiceRequest } from '@/app/actions/service';
import { useToast } from '@/hooks/use-toast';
import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ToastAction } from '@/components/ui/toast';

type ServiceCategoryValue = (typeof SERVICE_CATEGORY_OPTIONS)[number];
type ContactMethodValue = (typeof CONTACT_METHOD_OPTIONS)[number];

const categoryCards: Array<{
  value: ServiceCategoryValue;
  label: string;
  description: string;
  Icon: LucideIcon;
}> = [
  { value: 'HVAC', label: 'HVAC & Cooling', description: 'Air conditioning, ventilation, heating checks.', Icon: Snowflake },
  { value: 'Electrical', label: 'Electrical', description: 'Wiring, breakers, smart switches, outages.', Icon: Zap },
  { value: 'Plumbing', label: 'Plumbing', description: 'Leaks, clogs, pumps, water pressure issues.', Icon: Droplets },
  { value: 'Appliances', label: 'Appliances', description: 'Washers, fridges, ovens, generators.', Icon: Plug },
  { value: 'Smart Home', label: 'Smart Home', description: 'CCTV, Wi-Fi, IoT device setup & tuning.', Icon: Home },
];

const contactMethodCards: Array<{
  value: ContactMethodValue;
  label: string;
  description: string;
  Icon: LucideIcon;
}> = [
  { value: 'phone', label: 'Phone Call', description: 'Best for urgent coordination.', Icon: PhoneCall },
  { value: 'sms', label: 'SMS / Text', description: 'Quick updates without calls.', Icon: MessageSquare },
  { value: 'whatsapp', label: 'WhatsApp', description: 'Media & chat-friendly updates.', Icon: MessageCircle },
  { value: 'email', label: 'Email', description: 'Detailed written summaries.', Icon: Mail },
];

const timeSlots = [
  'Morning (9 AM - 12 PM)',
  'Afternoon (1 PM - 5 PM)',
  'Evening (6 PM - 9 PM)',
];

const MAX_MEDIA_SIZE_MB = 25;
const MAX_MEDIA_SIZE_BYTES = MAX_MEDIA_SIZE_MB * 1024 * 1024;
const budgetFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function ServiceRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(ServiceRequestSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      problemDescription: '',
      preferredDate: undefined,
      preferredTimeSlot: undefined,
      serviceCategories: [],
      preferredContactMethod: 'phone',
      estimatedBudget: 150,
      mediaDataUri: undefined,
    },
  });

  const clearMediaState = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      form.setValue('mediaDataUri', undefined);
      clearMediaState();
      return;
    }

    if (file.size > MAX_MEDIA_SIZE_BYTES) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Please upload a file smaller than ${MAX_MEDIA_SIZE_MB}MB.`,
      });
      form.setValue('mediaDataUri', undefined);
      clearMediaState();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUri = reader.result as string;
      form.setValue('mediaDataUri', dataUri, { shouldDirty: true });
      setMediaPreview(dataUri);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    form.setValue('mediaDataUri', undefined, { shouldDirty: true });
    clearMediaState();
  };

  async function onSubmit(values: ServiceRequestFormValues) {
    setIsSubmitting(true);
    const result = await submitServiceRequest(values);
    setIsSubmitting(false);

    if (result.success) {
      const trackingId = result.requestId;
      toast({
        title: 'Request submitted',
        description: trackingId
          ? `We received your request. Save ID ${trackingId} to track progress anytime.`
          : result.message,
        action: trackingId ? (
          <ToastAction altText="Track this service request" onClick={() => router.push(`/track/${trackingId}`)}>
            Track now
          </ToastAction>
        ) : undefined,
      });
      form.reset();
      clearMediaState();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="e.g. +1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Address
              </FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. 123 Main St, Anytown, USA 12345" {...field} />
              </FormControl>
              <FormDescription>Include estate, gate code, or notable landmarks.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                What needs attention?
              </FormLabel>
              <FormDescription>Select all applicable categories so we route the right specialist.</FormDescription>
              <FormControl>
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryCards.map(({ value, label, description, Icon }) => {
                    const checked = field.value?.includes(value) ?? false;
                    return (
                      <label
                        key={value}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border p-4 shadow-sm transition hover:border-primary/60',
                          checked && 'border-primary bg-primary/5 shadow-md'
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            if (isChecked === true) {
                              field.onChange([...(field.value ?? []), value]);
                            } else {
                              field.onChange((field.value ?? []).filter((category) => category !== value));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-semibold">
                            <Icon className="h-4 w-4 text-primary" />
                            {label}
                          </div>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredContactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  Preferred Contact Method
                </FormLabel>
                <FormDescription>We’ll keep you updated this way during dispatch and arrival.</FormDescription>
                <FormControl>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3">
                    {contactMethodCards.map(({ value, label, description, Icon }) => (
                      <Label
                        key={value}
                        htmlFor={`contact-${value}`}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:border-primary/60',
                          field.value === value && 'border-primary bg-primary/5 shadow-md'
                        )}
                      >
                        <RadioGroupItem value={value} id={`contact-${value}`} className="mt-1" />
                        <div>
                          <div className="flex items-center gap-2 font-semibold">
                            <Icon className="h-4 w-4 text-primary" />
                            {label}
                          </div>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Estimated Budget
                </FormLabel>
                <FormDescription>This helps dispatch match you with the right technician and parts.</FormDescription>
                <FormControl>
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Approximate spend</span>
                      <span className="font-semibold">{budgetFormatter.format(field.value ?? 0)}</span>
                    </div>
                    <Slider
                      min={0}
                      max={2000}
                      step={50}
                      value={[field.value ?? 0]}
                      onValueChange={(value) => field.onChange(value[0] ?? 0)}
                      aria-label="Estimated budget"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{budgetFormatter.format(0)}</span>
                      <span>{budgetFormatter.format(2000)}</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="problemDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MessageSquareWarning className="h-4 w-4" />
                Problem Description
              </FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Describe the issue in detail..." {...field} />
              </FormControl>
              <FormDescription>Include model numbers, noises, smells, or recent work completed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mediaDataUri"
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photo / Video (optional)
              </FormLabel>
              <FormDescription>Upload a quick photo or short video (max {MAX_MEDIA_SIZE_MB}MB) to help diagnostics.</FormDescription>
              <FormControl>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-md border border-dashed border-muted-foreground/40 px-4 py-3 text-sm text-muted-foreground hover:border-primary">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="h-4 w-4" />
                      <span>Attach file</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleMediaChange}
                    />
                  </label>
                  {mediaPreview && (
                    <div className="space-y-2">
                      <div className="overflow-hidden rounded-md border">
                        {mediaType === 'video' ? (
                          <video src={mediaPreview} controls className="aspect-video w-full" />
                        ) : (
                          <img src={mediaPreview} alt="Attachment preview" className="aspect-video w-full object-cover" />
                        )}
                      </div>
                      <Button type="button" variant="ghost" className="gap-2 text-sm" onClick={removeMedia}>
                        <Trash2 className="h-4 w-4" />
                        Remove file
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Preferred Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? <span>{format(field.value, 'PPP')}</span> : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredTimeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Preferred Time Slot
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Request Technician
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
