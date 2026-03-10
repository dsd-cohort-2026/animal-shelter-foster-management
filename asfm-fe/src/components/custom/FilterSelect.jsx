import { cn } from '@/lib/utils';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select';

export default function FilterSelect({
  value,
  onChange,
  selectClassName,
  selectTriggerClassName,
  selectContentClassName,
  selectItems,
  selectItemsMap,
}) {
  const selectItemsMapped = selectItems.map((item, index) => {
    const displayText = selectItemsMap?.[item] || item;
    return (
      <SelectItem key={index} value={item}>
        {displayText}
      </SelectItem>
    );
  });

  return (
    <Select value={value} onValueChange={onChange} className={cn(selectClassName)}>
      <SelectTrigger className={cn(selectTriggerClassName)}>
        <SelectValue placeholder="Pick a filter" />
      </SelectTrigger>
      <SelectContent className={cn(selectContentClassName)}>{selectItemsMapped}</SelectContent>
    </Select>
  );
}
