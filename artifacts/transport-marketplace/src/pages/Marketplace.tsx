import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useRequests, useCurrentUser } from "@/hooks/use-marketplace";
import { RequestCard } from "@/components/RequestCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Marketplace() {
  const { data: user } = useCurrentUser();
  const { data: requests, isLoading } = useRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cargoFilter, setCargoFilter] = useState("all");

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    let filtered = requests;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.pickupLocation.toLowerCase().includes(lower) || 
        r.dropoffLocation.toLowerCase().includes(lower) ||
        r.customerName.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (cargoFilter !== "all") {
      filtered = filtered.filter(r => r.cargoType.toLowerCase() === cargoFilter.toLowerCase());
    }

    // Usually marketplace only shows open requests for providers to bid on
    // but for demo purposes we let them see others if they explicitly filter
    if (statusFilter === "all" && user?.role === "provider") {
       filtered = filtered.filter(r => r.status === "open");
    }

    return filtered;
  }, [requests, searchTerm, statusFilter, cargoFilter, user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Load Marketplace</h1>
        <p className="text-muted-foreground mt-1">Find and bid on available transport requests.</p>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by location or customer..." 
            className="pl-9 bg-background border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 md:w-auto w-full">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cargoFilter} onValueChange={setCargoFilter}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Cargo Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cargo</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="perishables">Perishables</SelectItem>
              <SelectItem value="machinery">Machinery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No requests found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
