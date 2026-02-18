import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export default function SearchInput({ className, ...props }) {
  return (
      <Input
        type="text"
        className={cn(
          `max-w-[600px] w-full focus-visible:ring-accent focus-visible:ring-[4px] ${className}`,
        )}
        placeholder="Enter your search term"
        {...props}
        required
      />
  );
}
