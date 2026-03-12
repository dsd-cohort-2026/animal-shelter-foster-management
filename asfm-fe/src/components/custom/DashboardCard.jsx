import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftRight, Package, PawPrint, Timer, Users } from 'lucide-react';

export default function DashboardCard({
  title,
  itemsArray,
  navLink,
  CardClassName,
  cardHeaderClassName,
  cardDescriptionClassName,
}) {
  const navigate = useNavigate();
  const itemCount = itemsArray[0]?.info ? 0 : itemsArray.length;
  const { eyebrow, Icon } = getCardMeta(title);
  const rowMapped = itemsArray.map((item, index) => <DescriptionCardRow items={item} key={index} />);

  return (
    <Card
      className={cn(
        'w-full gap-0 overflow-hidden border-border/70 bg-card/95 py-0 shadow-sm transition-shadow hover:shadow-md',
        CardClassName,
      )}
    >
      <CardHeader
        className={cn(
          'gap-5 border-b border-border/70 bg-linear-to-b from-primary/12 via-card to-card px-5 pb-6 pt-5 sm:px-6',
          cardHeaderClassName,
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Icon className="size-5" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex w-fit rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </span>
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {itemCount
                  ? `${itemCount} record${itemCount === 1 ? '' : 's'} ready to review`
                  : 'No records available yet'}
              </p>
            </div>
          </div>
        </div>
        <CardAction className={cn('min-w-37.5 self-center rounded-xl sm:self-start')}>
          <Button
            className={cn(
              'h-11 w-full rounded-xl border border-primary/10 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 cursor-pointer',
            )}
            onClick={() => navigate({ to: `/${navLink}` })}
          >
            Open Page
          </Button>
        </CardAction>
      </CardHeader>
      <CardDescription className={cn('px-5 pb-5 pt-5 sm:px-6', cardDescriptionClassName)}>
        <div className="space-y-3.5">{rowMapped}</div>
      </CardDescription>
    </Card>
  );
}

function getCardMeta(title) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes('user')) {
    return { eyebrow: 'People', Icon: Users };
  }

  if (normalizedTitle.includes('animal')) {
    return { eyebrow: 'Care Roster', Icon: PawPrint };
  }

  if (normalizedTitle.includes('inventory')) {
    return { eyebrow: 'Supplies', Icon: Package };
  }

  if (normalizedTitle.includes('transaction')) {
    return { eyebrow: 'Activity', Icon: ArrowLeftRight };
  }

  if (normalizedTitle.includes('loan')) {
    return { eyebrow: 'Borrowed Items', Icon: Timer };
  }

  return { eyebrow: 'Overview', Icon: Package };
}

function DescriptionCardRow({ items }) {
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const rowMapped = Object.keys(items).map((key) => (
    <div className="rounded-lg border border-border/70 bg-card/80 px-3.5 py-3.5" key={key}>
      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {capitalize(key)}
      </span>
      <span className="mt-1 block text-sm font-medium leading-snug text-foreground">
        {items[key]}
      </span>
    </div>
  ));

  return (
    <div
      className="grid gap-2.5 rounded-xl border border-border/60 bg-muted/25 p-3"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
    >
      {rowMapped}
    </div>
  );
}
