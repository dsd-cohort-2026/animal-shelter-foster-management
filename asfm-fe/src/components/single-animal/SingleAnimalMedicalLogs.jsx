import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ClipboardList, Pill, ShieldPlus, Stethoscope } from 'lucide-react';

const SECTION_COPY = {
  locked: 'Medical records are only available to foster users assigned to this animal.',
  empty: 'Entries will appear here once care notes and treatments have been recorded.',
};

export default function SingleAnimalMedicalLogs({ animalLogs, canViewLogs }) {
  const latestLog = animalLogs[0] ?? null;

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="size-5 text-primary" />
              Medical Logs
            </CardTitle>
            <CardDescription>
              Review recent entries, medications, and notes for this animal.
            </CardDescription>
          </div>

          {canViewLogs && (
            <div className="flex flex-wrap gap-2">
              <SummaryChip label="Entries" value={String(animalLogs.length)} />
              <SummaryChip
                label="Latest Update"
                value={latestLog?.logged_at ? formatDistanceToNow(new Date(latestLog.logged_at), { addSuffix: true }) : 'None yet'}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!canViewLogs ? (
          <SectionState
            icon={ShieldPlus}
            title="Restricted medical history"
            description={SECTION_COPY.locked}
          />
        ) : animalLogs.length === 0 ? (
          <SectionState
            icon={ClipboardList}
            title="No medical logs yet"
            description={SECTION_COPY.empty}
          />
        ) : (
          <div className="space-y-4">
            {animalLogs.map((log) => (
              <LogEntryCard key={log.id ?? `${log.animal_id}-${log.logged_at}`} log={log} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LogEntryCard({ log }) {
  const medicationName = log?.medication?.item?.name;
  const administrationRoute = log?.medication?.administration_route;
  const recommendedDose = log?.medication?.recommended_dose;
  const sections = [
    {
      title: 'General Notes',
      content: log?.general_notes,
    },
    {
      title: 'Behavioral Notes',
      content: log?.behavior_notes,
    },
  ].filter((section) => Boolean(section.content));

  const medicationDetails = [
    medicationName,
    log?.dose ? `Dosage: ${log.dose}` : null,
    log?.qty_administered != null ? `Quantity administered: ${log.qty_administered}` : null,
    log?.prescription ? `Prescription: ${log.prescription}` : null,
    administrationRoute ? `Administration route: ${administrationRoute}` : null,
    recommendedDose ? `Recommended dose: ${recommendedDose}` : null,
  ].filter(Boolean);

  return (
    <article className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm">
      <div className="border-b border-border/70 bg-gradient-to-r from-muted/40 via-muted/10 to-transparent px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn('border-0 shadow-none', LOG_TYPE_COLORS[log?.category] || 'bg-slate-100 text-slate-700')}>
                {formatLogType(log?.category) || 'Unknown'}
              </Badge>
              {log?.logged_at && (
                <span className="text-sm font-medium text-foreground">
                  {format(new Date(log.logged_at), "EEE, MMM d, yyyy 'at' h:mm a")}
                </span>
              )}
            </div>
            {log?.logged_at && (
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Logged {formatDistanceToNow(new Date(log.logged_at), { addSuffix: true })}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Stethoscope className="size-3.5 text-primary" />
            Care update
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
        <div className="space-y-4">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.title} className="rounded-xl border bg-muted/15 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {section.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{section.content}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
              No notes were added to this entry.
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-muted/15 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-background shadow-sm">
              <Pill className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Medication Details</p>
              <p className="text-xs text-muted-foreground">Treatments and dosage information</p>
            </div>
          </div>

          {medicationDetails.length > 0 ? (
            <div className="mt-4 space-y-2">
              {medicationDetails.map((detail) => (
                <div key={detail} className="rounded-lg bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-1 ring-border/60">
                  {detail}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed bg-background/70 px-3 py-5 text-sm text-muted-foreground">
              No medications recorded for this entry.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SummaryChip({ label, value }) {
  return (
    <div className="rounded-xl border bg-background/90 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SectionState({ icon, title, description }) {
  const IconComponent = icon;

  return (
    <div className="rounded-xl border border-dashed bg-muted/10 px-4 py-10 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-secondary/30">
        <IconComponent className="size-5 text-primary" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
