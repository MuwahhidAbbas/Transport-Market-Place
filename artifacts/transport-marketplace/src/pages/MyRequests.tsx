import { useRequests, useCurrentUser } from "@/hooks/use-marketplace";
import { RequestCard } from "@/components/RequestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyRequests() {
  const { data: requests, isLoading } = useRequests();
  const { data: user } = useCurrentUser();

  if (user?.role !== "customer") {
    return <div className="p-8 text-center">Access denied. Customers only.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground mt-1">Manage your active and past transport listings.</p>
        </div>
        <Link href="/requests/new">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> New Request</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : requests && requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <RequestCard key={req.id} request={req} hideCustomerName={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-border/50 shadow-sm">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            You haven't posted any transport requests. Create your first listing to start receiving bids.
          </p>
          <Link href="/requests/new">
            <Button size="lg"><PlusCircle className="mr-2 h-5 w-5" /> Post First Request</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
