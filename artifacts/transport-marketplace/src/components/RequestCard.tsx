import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Package, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { TransportRequest } from "@/data/mockDb";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";

export function RequestCard({ request, hideCustomerName = false }: { request: TransportRequest, hideCustomerName?: boolean }) {
  return (
    <Card className="hover-elevate overflow-hidden border-border/50 group">
      <CardHeader className="p-5 pb-3 bg-muted/30 border-b border-border/50">
        <div className="flex justify-between items-start mb-2">
          <StatusBadge status={request.status} />
          <span className="text-xs text-muted-foreground font-medium">
            Posted {format(new Date(request.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Pickup</p>
            <p className="font-semibold text-foreground truncate" title={request.pickupLocation}>{request.pickupLocation}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1 text-right">
            <p className="text-sm text-muted-foreground flex items-center justify-end gap-1.5"><MapPin className="h-3.5 w-3.5" /> Dropoff</p>
            <p className="font-semibold text-foreground truncate" title={request.dropoffLocation}>{request.dropoffLocation}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 grid grid-cols-2 gap-y-4 gap-x-2">
        {!hideCustomerName && (
          <div className="col-span-2 flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {request.customerName.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{request.customerName}</span>
          </div>
        )}
        
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Package className="h-3.5 w-3.5" /> Cargo</p>
          <p className="text-sm font-medium">{request.cargoType}</p>
          <p className="text-xs text-muted-foreground">{request.weight} kg</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><Calendar className="h-3.5 w-3.5" /> Deadline</p>
          <p className="text-sm font-medium">{format(new Date(request.deliveryDate), 'MMM d, yyyy')}</p>
        </div>
        
        <div className="col-span-2 pt-2 mt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><DollarSign className="h-3.5 w-3.5" /> Budget</p>
          <p className="text-lg font-display font-bold text-primary">${request.budget.toLocaleString()}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Link href={`/requests/${request.id}`} className="w-full">
          <Button className="w-full group-hover:bg-primary/90 transition-colors">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
