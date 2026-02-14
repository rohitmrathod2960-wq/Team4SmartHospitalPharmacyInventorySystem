"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { predictiveMaintenanceSchedule, PredictiveMaintenanceScheduleOutput } from '@/ai/flows/predictive-maintenance-schedule';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wrench, Sparkles, Calendar, CheckCircle2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MaintenancePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictiveMaintenanceScheduleOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    equipmentId: 'EQ-204',
    equipmentName: 'Excavator 3000',
    category: 'Heavy Machinery',
    usageDescription: 'Used for heavy-duty digging 12 hours/day in a dusty environment.',
    manufacturerSpecifications: 'Service every 1000 hours or 6 months, whichever comes first.',
    historicalFailureData: 'Motor failure at 5000 hours, Bearing replacement 6 months ago.'
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
        title: "Schedule Generated",
        description: "AI analysis complete.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while generating the schedule.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="manager" title="Predictive Maintenance">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Maintenance Tool</h1>
          <p className="text-muted-foreground mt-1">Harness GenAI to predict and schedule equipment servicing.</p>
        </div>
        <Sparkles className="w-12 h-12 text-secondary animate-pulse opacity-50 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Equipment Parameters
            </CardTitle>
            <CardDescription>Input data for AI predictive analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Equipment ID</Label>
                  <Input value={formData.equipmentId} onChange={e => setFormData({...formData, equipmentId: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.equipmentName} onChange={e => setFormData({...formData, equipmentName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Usage Description</Label>
                <Textarea 
                  rows={3}
                  placeholder="Describe intensity, environment, hours..."
                  value={formData.usageDescription} 
                  onChange={e => setFormData({...formData, usageDescription: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Manufacturer Specifications</Label>
                <Input value={formData.manufacturerSpecifications} onChange={e => setFormData({...formData, manufacturerSpecifications: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>History (Comma separated)</Label>
                <Textarea 
                  rows={2}
                  placeholder="Past failures, replacements..."
                  value={formData.historicalFailureData} 
                  onChange={e => setFormData({...formData, historicalFailureData: e.target.value})} 
                />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 rounded-xl py-6 shadow-lg shadow-secondary/20" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Run Predictive Analysis
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {result ? (
            <>
              <Card className="border-none shadow-lg bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl overflow-hidden border-2 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    AI Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed italic">&quot;{result.overallRecommendations}&quot;</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Suggested Schedule
                </h3>
                {result.schedule.map((task, i) => (
                  <Card key={i} className="border-none shadow-sm rounded-xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-lg font-bold text-xs shrink-0 h-12 w-12 flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm">{task.task}</h4>
                          <Badge variant="outline" className="text-[10px]">{task.dueDate}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{task.notes || 'No extra notes provided.'}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase text-primary">
                          <Info className="w-3 h-3" />
                          {task.frequency}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-muted rounded-2xl opacity-40">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="font-medium">No analysis data yet.</p>
              <p className="text-xs max-w-[240px] mt-1">Fill out the equipment parameters and click &apos;Run Analysis&apos; to generate a schedule.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
