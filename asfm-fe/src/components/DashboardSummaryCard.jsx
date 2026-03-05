import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardSummaryCard({ title, value="-", subtitle="Could not load Data", icon, 
  cardClassName = "",
  cardHeaderClassName = "",
  cardTitleClassName = "",
 }) {
  return (
    <Card className={cn("w-full", cardClassName)}>
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2" , cardHeaderClassName)}>
        <CardTitle className={cn("text-sm font-medium text-muted-foreground", cardTitleClassName)}>
          {title}
        </CardTitle>
        {icon && (
          <span className="h-5 w-5 text-muted-foreground" aria-hidden="true">
            {icon}
          </span>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {value ?? "—"}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
export default DashboardSummaryCard;
