import { useMyBids, useCurrentUser, useRequest } from "@/hooks/use-marketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { Anchor, ArrowRight, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";

export default function MyBids() {
  const { data: bids, isLoading } = useMyBids();
  const { data: user } = useCurrentUser();

  if (user?.role !== "provider") {
    return <div className="p-8 text-center">Access denied. Providers only.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
        <p className="text-muted-foreground mt-1">Track the status of your submitted offers.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : bids && bids.length > 0 ? (
        <div className="grid gap-4">
          {bids.map(bid => (
            <BidCard key={bid.id} bid={bid} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-border/50 shadow-sm">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Anchor className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No bids submitted</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            You haven't bid on any loads yet. Browse the marketplace to find opportunities.
          </p>
          <Link href="/marketplace">
            <Button size="lg">Browse Marketplace</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function BidCard({ bid }: { bid: any }) {
  // Fetch request data to show location details
  const { data: request } = useRequest(bid.requestId);

  return (
    <Card className="hover-elevate transition-all overflow-hidden border-border/60">
      <div className="flex flex-col md:flex-row">
        <div className="p-5 md:w-1/3 bg-muted/20 border-b md:border-b-0 md:border-r border-border/60 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Offer Status</span>
            <StatusBadge status={bid.status} />
          </div>
          <div className="text-3xl font-bold text-primary mb-1">${bid.price.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Submitted {format(new Date(bid.submittedAt), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {request ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{request.customerName}</span>
                  <span>•</span>
                  <span>{request.cargoType} ({request.weight}kg)</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <span className="truncate max-w-[200px]" title={request.pickupLocation}>{request.pickupLocation}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[200px]" title={request.dropoffLocation}>{request.dropoffLocation}</span>
                </div>
              </div>
            ) : (
              <div className="mb-4"><Skeleton className="h-12 w-full" /></div>
            )}
            
            <div className="text-sm bg-muted/30 p-3 rounded-lg text-muted-foreground italic border-l-2 border-primary/30">
              "{bid.message}"
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Link href={`/requests/${bid.requestId}`}>
              <Button variant="outline" size="sm" className="gap-2">
                View Request <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
