"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { predictiveMaintenanceSchedule, PredictiveMaintenanceScheduleOutput } from '@/ai/flows/predictive-maintenance-schedule';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wrench, Sparkles, Calendar, CheckCircle2, Info, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

export default function MaintenancePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictiveMaintenanceScheduleOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    medicineId: '',
    medicineName: '',
    category: '',
    usageDescription: '',
    manufacturerSpecifications: '',
    historicalFailureData: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await predictiveMaintenanceSchedule({
        ...formData,
        historicalFailureData: formData.historicalFailureData.split(',').map(s => s.trim())
      });
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: "AI generated smart insights.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Check API keys or backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="manager" title="AI Analytics Dashboard">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">📊 AI Predictive Dashboard</h1>
          <p className="text-muted-foreground">Smart maintenance + inventory intelligence</p>
        </div>
        <BarChart3 className="w-10 h-10 text-primary opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <Card className="rounded-2xl shadow-md border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Input Parameters
            </CardTitle>
            <CardDescription>Provide machine/medicine data</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">

              <Input placeholder="Medicine ID"
                onChange={e => setFormData({...formData, medicineId: e.target.value})} />

              <Input placeholder="Medicine Name"
                onChange={e => setFormData({...formData, medicineName: e.target.value})} />

              <Textarea placeholder="Usage Description"
                onChange={e => setFormData({...formData, usageDescription: e.target.value})} />

              <Input placeholder="Manufacturer Specs"
                onChange={e => setFormData({...formData, manufacturerSpecifications: e.target.value})} />

              <Textarea placeholder="History (comma separated)"
                onChange={e => setFormData({...formData, historicalFailureData: e.target.value})} />

              <Button type="submit" className="w-full py-5 rounded-xl">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                Analyze with AI
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* RIGHT PANEL */}
        <div className="space-y-4">

          {!result ? (
            <Card className="p-10 text-center border-dashed">
              <Sparkles className="mx-auto mb-4 opacity-40" />
              <p>No AI insights yet</p>
            </Card>
          ) : (
            <>
              {/* INSIGHTS */}
              <Card className="bg-gradient-to-r from-purple-100 to-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle>📊 AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap">
                    {result.insights || "No insights available"}
                  </pre>
                </CardContent>
              </Card>

              {/* RECOMMENDATION */}
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>💡 Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.overallRecommendations}
                </CardContent>
              </Card>

              {/* SCHEDULE */}
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>📅 Maintenance Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.schedule.map((item, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <p className="font-semibold">{item.task}</p>
                      <p className="text-xs text-muted-foreground">{item.frequency}</p>
                      <Badge>{item.dueDate}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}