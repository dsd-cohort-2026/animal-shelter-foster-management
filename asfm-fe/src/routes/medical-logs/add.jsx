import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationDialog from '@/components/confirmationDialog';
import MedicalLogForm from '@/components/medical-logs/MedicalLogForm';
import RoleGuard from '@/components/RoleGuard';
import { useBoundStore } from '@/store';
import { createClientId } from '@/utils/idHelpers';
import { Loader2 } from 'lucide-react';

// TODO: Replace with actual API call to backend
const SIMULATED_API_DELAY = 600;

export const Route = createFileRoute('/medical-logs/add')({
  component: AddMedicalLogPage,
});

function AddMedicalLogPage() {
  const navigate = useNavigate();
  const addMedicalLog = useBoundStore((state) => state.addMedicalLog);
  const animals = useBoundStore((state) => state.animals);
  const fetchAnimals = useBoundStore((state) => state.fetchAnimals);
  const userRole = useBoundStore((state) => state.userRole);
  const user = useBoundStore((state) => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  // Filter animals based on user role
  // For foster users (USER role), only show animals with foster_status = 'FOSTERED'
  // For staff users (STAFF role), show all animals
  const filteredAnimals = useMemo(() => {
    if (userRole === 'USER') {
      return animals.filter((a) => a.foster_status === 'FOSTERED');
    }
    return animals;
  }, [animals, userRole]);

  const handleSubmit = (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    const animal = animals.find((a) => a.id === formData.animal_id);

    setTimeout(() => {
      try {
        addMedicalLog({
          ...formData,
          id: createClientId(),
          animal_name: animal?.name || 'Unknown',
          logged_at: formData.logged_at
            ? new Date(formData.logged_at).toISOString()
            : new Date().toISOString(),
          administered_at: formData.administered_at
            ? new Date(formData.administered_at).toISOString()
            : null,
          // Set foster_user_id for foster users, null for staff
          foster_user_id: userRole === 'USER' ? user?.id : null,
          // assignment_id would be set from animal_assignments in real implementation
          assignment_id: null,
          medication_id: null,
          documents: null,
        });
        setIsSubmitting(false);
        setConfirmation({
          type: 'success',
          primaryText: 'Medical Log Added',
          secondaryText: `Log entry for ${animal?.name || 'animal'} has been created.`,
        });
      } catch {
        setIsSubmitting(false);
        setSubmitError('Something went wrong. Please try again.');
      }
    }, SIMULATED_API_DELAY);
  };

  return (
    <Layout>
      <RoleGuard allowedRoles={['STAFF', 'USER']}>
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <Button variant="ghost" className="-ml-2" onClick={() => navigate({ to: userRole === 'USER' ? '/medical-logs/foster' : '/medical-logs' })}>
            ← Back to Medical Logs
          </Button>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-2xl">Add Medical Log</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mx-auto w-full">
                <MedicalLogForm
                  formId="add-medical-log-form"
                  onSubmit={handleSubmit}
                  animals={filteredAnimals}
                />
                {submitError && (
                  <p className="text-sm text-red-500 mt-2">{submitError}</p>
                )}
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => navigate({ to: userRole === 'USER' ? '/medical-logs/foster' : '/medical-logs' })}>
                    Cancel
                  </Button>
                  <Button type="submit" form="add-medical-log-form" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Log'}
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
            onClose={() => navigate({ to: userRole === 'USER' ? '/medical-logs/foster' : '/medical-logs' })}
          />
        )}
      </RoleGuard>
    </Layout>
  );
}
