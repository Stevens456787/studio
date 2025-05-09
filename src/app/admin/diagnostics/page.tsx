import DiagnosticTool from '@/components/admin/DiagnosticTool';
import { ShieldCheck } from 'lucide-react';

export default function AdminDiagnosticsPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-6 bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <ShieldCheck className="h-8 w-8" />
          Technician Diagnostic Portal
        </h1>
        <p className="mt-3 text-md text-muted-foreground">
          Utilize our AI-powered tool to help diagnose equipment issues based on customer descriptions.
        </p>
      </section>
      
      <DiagnosticTool />

      <section className="mt-10 p-4 bg-secondary/50 rounded-md text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground mb-1">Usage Guidelines:</h4>
        <ul className="list-disc list-inside space-y-1">
            <li>This tool provides suggestions based on the input. Always use your professional judgment.</li>
            <li>The AI's suggestions are not a replacement for thorough on-site inspection.</li>
            <li>Ensure the problem description is as detailed as possible for best results.</li>
        </ul>
      </section>
    </div>
  );
}
