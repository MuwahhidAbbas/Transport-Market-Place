import { useState } from "react";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { MapPin, Package, Calendar, DollarSign, ArrowRight, User as UserIcon, Star, MessageSquare, Clock, CheckCircle2, Truck } from "lucide-react";
import { useRequest, useOffers, useCurrentUser, useSubmitOffer, useAcceptOffer } from "@/hooks/use-marketplace";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RequestDetail() {
  const [, params] = useRoute("/requests/:id");
  const requestId = params?.id || "";
  
  const { data: user } = useCurrentUser();
  const { data: request, isLoading: reqLoading } = useRequest(requestId);
  const { data: offers, isLoading: offersLoading } = useOffers(requestId);
  
  const submitOffer = useSubmitOffer();
  const acceptOffer = useAcceptOffer();
  const { toast } = useToast();

  const [offerForm, setOfferForm] = useState({ price: "", days: "", message: "" });
  const [showOfferForm, setShowOfferForm] = useState(false);

  if (!user || reqLoading) {
    return <div className="space-y-6"><Skeleton className="h-64 w-full rounded-2xl" /><Skeleton className="h-96 w-full rounded-2xl" /></div>;
  }

  if (!request) {
    return <div className="text-center py-20 text-muted-foreground">Request not found</div>;
  }

  const isCustomer = user.role === "customer";
  const isOwner = isCustomer && request.customerId === user.id;
  const hasSubmittedOffer = offers?.some(o => o.providerId === user.id);
  const acceptedOffer = offers?.find(o => o.status === "accepted");
  
  const canSubmitOffer = !isCustomer && request.status === "open" && !hasSubmittedOffer;

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOffer.mutate({
      requestId,
      price: Number(offerForm.price),
      estimatedDeliveryDays: Number(offerForm.days),
      message: offerForm.message,
    }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Your bid has been submitted successfully." });
        setShowOfferForm(false);
      }
    });
  };

  const handleAcceptOffer = (offerId: string) => {
    acceptOffer.mutate({ requestId, offerId }, {
      onSuccess: () => {
        toast({ title: "Offer Accepted", description: "The provider has been notified." });
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Load #{request.id.substring(4).toUpperCase()}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            Posted {format(new Date(request.createdAt), 'MMM d, yyyy')} by 
            <span className="font-medium text-foreground flex items-center gap-1">
              <UserIcon className="h-3 w-3" /> {request.customerName}
            </span>
          </p>
        </div>
        
        {canSubmitOffer && !showOfferForm && (
          <Button size="lg" onClick={() => setShowOfferForm(true)} className="shadow-lg shadow-primary/20">
            Submit a Bid
          </Button>
        )}
      </div>

      {/* Request Details Card */}
      <Card className="shadow-sm border-border/60 overflow-hidden">
        <div className="bg-primary/5 p-6 md:p-8 border-b border-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 justify-center">
            <div className="text-center w-full md:w-auto">
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Pickup</p>
              <p className="text-2xl font-bold">{request.pickupLocation}</p>
            </div>
            
            <div className="hidden md:flex flex-1 items-center justify-center relative">
              <div className="w-full h-0.5 bg-primary/20 absolute"></div>
              <div className="bg-white border border-primary/20 rounded-full p-3 z-10 text-primary relative">
                <Truck className="h-6 w-6" />
              </div>
            </div>
            
            <div className="text-center w-full md:w-auto">
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Dropoff</p>
              <p className="text-2xl font-bold">{request.dropoffLocation}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="h-4 w-4" /> <span className="text-sm font-medium">Cargo Type</span>
            </div>
            <p className="font-semibold">{request.cargoType}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{request.weight} kg</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" /> <span className="text-sm font-medium">Target Date</span>
            </div>
            <p className="font-semibold">{format(new Date(request.deliveryDate), 'MMM d, yyyy')}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" /> <span className="text-sm font-medium">Target Budget</span>
            </div>
            <p className="font-semibold text-lg text-primary">${request.budget.toLocaleString()}</p>
          </div>
          
          <div className="col-span-2 md:col-span-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Special Instructions</h4>
            <p className="text-foreground leading-relaxed">{request.notes || "No special instructions provided."}</p>
          </div>
        </CardContent>
      </Card>

      {/* Offer Submission Form */}
      {showOfferForm && (
        <Card className="border-primary/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <CardHeader>
            <CardTitle>Submit Your Bid</CardTitle>
          </CardHeader>
          <form onSubmit={handleOfferSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bid Amount ($)</Label>
                  <Input required type="number" min="1" value={offerForm.price} onChange={e => setOfferForm({...offerForm, price: e.target.value})} placeholder="e.g. 2400" />
                </div>
                <div className="space-y-2">
                  <Label>Est. Delivery Time (Days)</Label>
                  <Input required type="number" min="1" value={offerForm.days} onChange={e => setOfferForm({...offerForm, days: e.target.value})} placeholder="e.g. 3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message to Customer</Label>
                <Textarea required rows={3} value={offerForm.message} onChange={e => setOfferForm({...offerForm, message: e.target.value})} placeholder="Describe your service, equipment, and why they should choose you..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 bg-muted/20 border-t border-border mt-4 py-4">
              <Button type="button" variant="ghost" onClick={() => setShowOfferForm(false)}>Cancel</Button>
              <Button type="submit" disabled={submitOffer.isPending}>
                {submitOffer.isPending ? "Submitting..." : "Confirm Bid"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Offers Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          Offers <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">{offers?.length || 0}</span>
        </h2>
        
        {offersLoading ? (
          <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : !offers || offers.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No offers have been submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* If there's an accepted offer, show it at the top distinctively */}
            {acceptedOffer && (
              <Card className="border-green-500/30 bg-green-50/30 dark:bg-green-950/10 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ACCEPTED BID
                </div>
                <CardContent className="p-6">
                  <OfferRow offer={acceptedOffer} isCustomer={isCustomer} isOwner={isOwner} isAccepted={true} />
                </CardContent>
              </Card>
            )}

            {/* List other offers */}
            {offers.filter(o => o.id !== acceptedOffer?.id).map((offer) => (
              <Card key={offer.id} className={`transition-all ${offer.providerId === user.id ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-6">
                  <OfferRow 
                    offer={offer} 
                    isCustomer={isCustomer} 
                    isOwner={isOwner} 
                    isAccepted={false}
                    onAccept={() => handleAcceptOffer(offer.id)}
                    accepting={acceptOffer.isPending}
                    isRequestOpen={request.status === "open"}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OfferRow({ offer, isCustomer, isOwner, isAccepted, onAccept, accepting, isRequestOpen }: any) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
            {offer.providerName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-base leading-tight">{offer.providerName}</p>
            <div className="flex items-center text-xs text-amber-500 font-medium">
              <Star className="h-3.5 w-3.5 fill-current mr-1" />
              {offer.providerRating} Rating
            </div>
          </div>
        </div>
        <p className="text-sm text-foreground/80 pl-13 italic border-l-2 border-muted ml-5">
          "{offer.message}"
        </p>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2 bg-muted/30 md:bg-transparent p-4 md:p-0 rounded-lg">
        <div className="text-left md:text-right">
          <p className="text-2xl font-bold text-primary">${offer.price.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground flex items-center md:justify-end gap-1 mt-1">
            <Clock className="h-3 w-3" /> {offer.estimatedDeliveryDays} days transit
          </p>
        </div>
        
        {isOwner && isRequestOpen && !isAccepted && (
          <Button size="sm" className="w-full md:w-auto" onClick={onAccept} disabled={accepting}>
            Accept Offer
          </Button>
        )}
        {!isRequestOpen && !isAccepted && offer.status === "rejected" && (
          <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded">Declined</span>
        )}
      </div>
    </div>
  );
}
