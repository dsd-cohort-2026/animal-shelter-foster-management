import { cn } from "@/lib/utils";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../ui/select";

export default function FilterSelect({selectClassName, selectTriggerClassName, selectContentClassName, selectItems}) {

    const selectItemsMapped = selectItems.map((item, index) => (
        <SelectItem key={index} value={item}>{item}</SelectItem>
    ))

    return (
        <Select className={cn(selectClassName)}>
            <SelectTrigger className={cn( selectTriggerClassName)}>
                <SelectValue placeholder="Pick a filter" />
            </SelectTrigger>
            <SelectContent className={cn( selectContentClassName)}>
                {selectItemsMapped}
            </SelectContent>
        </Select>
    )
}