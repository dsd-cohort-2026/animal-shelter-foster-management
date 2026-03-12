import { fetchMedicationItem } from '@/services/medicalLogCardService';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, Clipboard, Pill } from 'lucide-react';

const formatLogCategory = (category) => {
  if (!category) return 'General';
  return category[0] + category.slice(1).toLowerCase();
};

const formatTimestamp = (value) => {
  if (!value) return 'Unknown date';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function MedicalLogCard({ log }) {
  const [item, setItem] = useState(null);
  const logCategory = formatLogCategory(log?.category);
  const formattedDate = formatTimestamp(log?.logged_at);

  useEffect(() => {
    async function load() {
      // This is broken, needs medical-log creation and BE services to be updated
      const itemData = await fetchMedicationItem(log.medication_id);
      if (!itemData) return setItem(null);
      setItem(itemData);
    }

    // don't run due to 404 errors
    // if (log.medication_id) {
    //   load();
    // }
  }, [log.medication_id]);

  return (
    <Card className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm">
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium">
              {logCategory}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4 text-primary" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LogSection
            icon={Clipboard}
            title="General Notes"
            value={log.general_notes || 'No general notes were recorded for this entry.'}
          />
          <LogSection
            icon={Clipboard}
            title="Behavior Notes"
            value={log.behavior_notes || 'No behavior notes were recorded for this entry.'}
          />
        </div>

        <LogSection
          icon={Pill}
          title="Medication"
          value={
            item
              ? [
                  item.name,
                  log.dose ? `Dosage: ${log.dose} dose` : null,
                  log.prescription ? `Prescription: ${log.prescription}` : null,
                  item.medication?.administration_route
                    ? `Route: ${item.medication.administration_route}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' • ')
              : 'No medication details were recorded for this entry.'
          }
        />
      </CardContent>
    </Card>
  );
}

function LogSection({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-muted/20 px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        <span>{title}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
