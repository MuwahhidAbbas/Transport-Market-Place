import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  
  switch (status.toLowerCase()) {
    case "open":
      colorClass = "bg-blue-100 text-blue-700 border-blue-200";
      break;
    case "accepted":
      colorClass = "bg-green-100 text-green-700 border-green-200";
      break;
    case "completed":
      colorClass = "bg-gray-100 text-gray-700 border-gray-200";
      break;
    case "pending":
      colorClass = "bg-amber-100 text-amber-700 border-amber-200";
      break;
    case "rejected":
      colorClass = "bg-red-100 text-red-700 border-red-200";
      break;
  }

  return (
    <Badge variant="outline" className={`capitalize shadow-none ${colorClass}`}>
      {status}
    </Badge>
  );
}
