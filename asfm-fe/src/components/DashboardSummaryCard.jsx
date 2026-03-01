import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

function DashboardSummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="icon">{icon}</span>}
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="text-2xl font-semibold">{value}</div>
      </CardHeader>

      {subtitle && (
        <CardContent>
          <CardDescription>{subtitle}</CardDescription>
        </CardContent>
      )}
    </Card>
  );
}

export default DashboardSummaryCard;
