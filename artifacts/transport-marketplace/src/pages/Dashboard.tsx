import { Link } from "wouter";
import { PlusCircle, Activity, PackageCheck, DollarSign, LayoutList } from "lucide-react";
import { useCurrentUser, useDashboardMetrics, useRequests } from "@/hooks/use-marketplace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { RequestCard } from "@/components/RequestCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: user } = useCurrentUser();
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: requests, isLoading: requestsLoading } = useRequests();

  if (!user) return null;
  const isCustomer = user.role === "customer";

  const recentRequests = requests?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-primary/5 border border-primary/10 p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {isCustomer 
                ? "Manage your transport requests and review incoming offers from trusted providers."
                : "Browse available loads and submit competitive bids to grow your business."}
            </p>
          </div>
          {isCustomer && (
            <Link href="/requests/new">
              <Button size="lg" className="shadow-lg shadow-primary/25 rounded-xl text-base h-12 px-6">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post New Request
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Active Requests"
          icon={Activity}
          value={metrics?.activeRequests}
          loading={metricsLoading}
        />
        <MetricCard
          title={isCustomer ? "Offers Received" : "Bids Submitted"}
          icon={LayoutList}
          value={metrics?.totalOffers}
          loading={metricsLoading}
        />
        <MetricCard
          title="Completed Jobs"
          icon={PackageCheck}
          value={metrics?.completedJobs}
          loading={metricsLoading}
        />
        <MetricCard
          title="Avg Offer Price"
          icon={DollarSign}
          value={metrics?.avgPrice}
          prefix="$"
          loading={metricsLoading}
        />
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent {isCustomer ? 'Requests' : 'Available Loads'}</h2>
          <Link href={isCustomer ? "/my-requests" : "/marketplace"} className="text-primary font-medium hover:underline flex items-center">
            View all <LayoutList className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {requestsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        ) : recentRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRequests.map(req => (
              <RequestCard key={req.id} request={req} hideCustomerName={isCustomer} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <PackageCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No recent activity</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                {isCustomer ? "You haven't posted any transport requests recently." : "There are no new requests available in the marketplace."}
              </p>
              {isCustomer && (
                <Link href="/requests/new">
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Request</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, icon: Icon, value, prefix = "", loading }: any) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading || value === undefined ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-3xl font-display font-bold text-foreground">
            <AnimatedCounter value={value} prefix={prefix} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
