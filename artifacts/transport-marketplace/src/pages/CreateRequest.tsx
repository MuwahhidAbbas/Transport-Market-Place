import { useState } from "react";
import { useLocation } from "wouter";
import { CalendarIcon, Package, Truck, MapPin, DollarSign, AlignLeft } from "lucide-react";
import { useCreateRequest } from "@/hooks/use-marketplace";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateRequest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useCreateRequest();

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    cargoType: "",
    weight: "",
    deliveryDate: "",
    budget: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, cargoType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.cargoType || !formData.deliveryDate || !formData.budget) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    createMutation.mutate({
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      cargoType: formData.cargoType,
      weight: Number(formData.weight) || 0,
      deliveryDate: formData.deliveryDate,
      budget: Number(formData.budget),
      notes: formData.notes
    }, {
      onSuccess: (data) => {
        toast({ title: "Success", description: "Transport request posted successfully!" });
        setLocation(`/requests/${data.id}`);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Post a Request</h1>
        <p className="text-muted-foreground mt-1">Enter shipment details to receive competitive bids from providers.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg border-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Route Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input 
                id="pickupLocation" name="pickupLocation" 
                placeholder="e.g. Chicago, IL" 
                value={formData.pickupLocation} onChange={handleChange}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffLocation">Dropoff Location *</Label>
              <Input 
                id="dropoffLocation" name="dropoffLocation" 
                placeholder="e.g. Detroit, MI" 
                value={formData.dropoffLocation} onChange={handleChange}
                className="bg-background"
              />
            </div>
          </CardContent>

          <CardHeader className="bg-muted/30 border-y border-border/50 pb-6 mt-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Cargo Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cargoType">Cargo Type *</Label>
              <Select value={formData.cargoType} onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Perishables">Perishables</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Total Weight (kg)</Label>
              <div className="relative">
                <Input 
                  id="weight" name="weight" type="number" 
                  placeholder="0" 
                  value={formData.weight} onChange={handleChange}
                  className="bg-background pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Target Delivery Date *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="deliveryDate" name="deliveryDate" type="date" 
                  value={formData.deliveryDate} onChange={handleChange}
                  className="bg-background pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Target Budget ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="budget" name="budget" type="number" 
                  placeholder="0.00" 
                  value={formData.budget} onChange={handleChange}
                  className="bg-background pl-10"
                />
              </div>
            </div>
          </CardContent>

          <CardHeader className="bg-muted/30 border-y border-border/50 pb-6 mt-2">
            <CardTitle className="flex items-center gap-2">
              <AlignLeft className="h-5 w-5 text-primary" /> Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Special Requirements or Instructions</Label>
              <Textarea 
                id="notes" name="notes" 
                placeholder="e.g. Requires liftgate, fragile items, strict appointment times..." 
                rows={4}
                value={formData.notes} onChange={handleChange}
                className="bg-background resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="p-6 bg-muted/10 border-t border-border mt-2 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="px-8 text-base shadow-md">
              {createMutation.isPending ? "Posting..." : "Post Request"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
