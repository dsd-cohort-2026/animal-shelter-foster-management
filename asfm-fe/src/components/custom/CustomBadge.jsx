import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function CustomBadge({ text, isChecked, badgeClassName, badgeCheckClassName }) {
  return (
    <Badge className={cn(badgeClassName)}>
      {isChecked && <BadgeCheck className={cn(badgeCheckClassName)} />}
      <span>{text}</span>
    </Badge>
  );
}
