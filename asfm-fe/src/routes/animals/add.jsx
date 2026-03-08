import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import BasicNavBar from '@/components/basicNavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationDialog from '@/components/confirmationDialog';
import AnimalForm from '@/components/animals/AnimalForm';
import { useBoundStore } from '@/store';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';

export const Route = createFileRoute('/animals/add')({
  component: AddAnimalPage,
});

function AddAnimalPage() {
  const navigate = useNavigate();
  const addAnimal = useBoundStore((state) => state.addAnimal);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const handleSubmit = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/animals', formData);
      addAnimal(response.data);
      setIsSubmitting(false);
      setConfirmation({
        type: 'success',
        primaryText: 'Animal Added',
        secondaryText: `${formData.name} has been added successfully.`,
      });
    } catch {
      setIsSubmitting(false);
      setSubmitError('Failed to add animal. Please try again.');
    }
  };

  return (
    <Layout navBar={<BasicNavBar />}>
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
