import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from './ui/dialog';

/**
 * ModalDialog - A reusable dialog component with form support and scrollable content area.
 *
 * Key features:
 * - Scrollable content area: Children are wrapped in a flex-1 overflow-y-auto div
 *   to prevent the entire modal from scrolling, keeping header/footer fixed.
 * - Customizable width via contentClassName prop (max-w-1/2 is default)
 * - Form submission support with loading state
 * - Note: Changed from max-w-125 to max-w-1/2 (50% of parent width) for better responsiveness
 */
export const ModalDialog = ({
  trigger,
  title,
  description,
  buttonVariant,
  formId,
  isSubmitting,
  submitHandler,
  open,
  setOpen,
  contentClassName,
  ...props
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent
            className={cn(
              'max-w-125 max-h-[85vh] min-w-75 sm:min-h-38',
              contentClassName,
            )}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              {props.children}
            </div>
            <DialogFooter className="mt-4">
              <div className="flex justify-between w-full gap-4">
                <DialogClose>
                  <Button variant={buttonVariant}>Cancel</Button>
                </DialogClose>
                <Button
                  variant={buttonVariant}
                  type="submit"
                  form={formId}
                  onClick={submitHandler}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting' : 'Submit'}
                  {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
};
