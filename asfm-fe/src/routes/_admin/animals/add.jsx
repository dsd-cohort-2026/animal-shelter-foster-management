import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationDialog from '@/components/confirmationDialog';
import AnimalForm from '@/components/animals/AnimalForm';
import { useBoundStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { createClientId } from '@/utils/idHelpers';

// TODO: Replace with actual API call to backend
const SIMULATED_API_DELAY = 600;

export const Route = createFileRoute('/_admin/animals/add')({
  component: AddAnimalPage,
});

function AddAnimalPage() {
  const navigate = useNavigate();
  const addAnimal = useBoundStore((state) => state.addAnimal);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const handleSubmit = (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    // Simulate async create — swap with real API call later
    setTimeout(() => {
      try {
        addAnimal({ ...formData, id: createClientId() });
        setIsSubmitting(false);
        setConfirmation({
          type: 'success',
          primaryText: 'Animal Added',
          secondaryText: `${formData.name} has been added successfully.`,
        });
      } catch {
        setIsSubmitting(false);
        setSubmitError('Something went wrong. Please try again.');
      }
    }, SIMULATED_API_DELAY);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <Button variant="ghost" className="-ml-2" onClick={() => navigate({ to: '/animals' })}>
          ← Back to Animals
        </Button>

        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-2xl">Add Animal</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mx-auto w-full">
              <AnimalForm
                formId="add-animal-form"
                onSubmit={handleSubmit}
                error={submitError}
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => navigate({ to: '/animals' })}>
                  Cancel
                </Button>
                <Button type="submit" form="add-animal-form" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Animal'}
                  {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {confirmation && (
        <ConfirmationDialog
          {...confirmation}
          button="Done"
          onClose={() => navigate({ to: '/animals' })}
        />
      )}
    </Layout>
  );
}
