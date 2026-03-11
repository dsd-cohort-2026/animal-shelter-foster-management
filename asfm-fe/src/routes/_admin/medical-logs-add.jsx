import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationDialog from '@/components/confirmationDialog';
import MedicalLogForm from '@/components/medical-logs/MedicalLogForm';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useBoundStore } from '@/store';
import { formatDateTime } from '@/utils/medicalLogUtils';

export const Route = createFileRoute('/_admin/medical-logs-add')({
  id: '/admin-medical-logs-add',
  component: AddMedicalLogPage,
});

function AddMedicalLogPage() {
  const navigate = useNavigate();
  const user = useBoundStore((state) => state.user);
  const [animals, setAnimals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  const fetchAnimals = async () => {
    setLoadingAnimals(true);
    try {
      const response = await apiClient.get('/animals', { params: { limit: 10000 } });
      const rawAnimals = response?.data || [];

      // Validate response is an array
      if (!Array.isArray(rawAnimals)) {
        throw new Error('Unexpected response format from server: expected array of animals');
      }

      setAnimals(rawAnimals);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setSubmitError('Failed to load animals. Please try again.');
    } finally {
      setLoadingAnimals(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filteredAnimals = (animals || [])

  const handleSubmit = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    const animal = animals.find((a) => a.id === formData.animal_id);

    try {
      // Build payload, excluding null/undefined values and logged_at (not in backend validator)
      const payload = {
        category: formData.category,
        animal_id: formData.animal_id,
        ...formData.general_notes && { general_notes: formData.general_notes },
        ...formData.behavior_notes && { behavior_notes: formData.behavior_notes },
        ...formData.qty_administered && { qty_administered: formData.qty_administered },
        ...formData.dose && { dose: formData.dose },
        ...formData.administered_at && { administered_at: new Date(formData.administered_at).toISOString() },
        ...formData.prescription && { prescription: formData.prescription },
        ...formData.documents && { documents: formData.documents },
        foster_user_id:  user.id,
        ...formData.medication_id && { medication_id: formData.medication_id },
      };
      const response = await apiClient.post('/medical-logs', payload);

      setIsSubmitting(false);
      setConfirmation({
        type: 'success',
        primaryText: 'Medical Log Added',
        secondaryText: `Log entry for ${animal?.name || 'animal'} has been created.`,
      });
    } catch (err) {
      setIsSubmitting(false);
      console.error('Error adding medical log:', err);
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => navigate({ to: '/admin-medical-logs' })}
      >
        ← Back to Medical Logs
      </Button>

      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-2xl">Add Medical Log</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingAnimals ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mx-auto w-full">
              <MedicalLogForm
                formId="add-medical-log-form"
                onSubmit={handleSubmit}
                animals={filteredAnimals}
              />
              {submitError && <p className="text-sm text-red-500 mt-2">{submitError}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/admin-medical-logs' })}
                >
                  Cancel
                </Button>
                <Button type="submit" form="add-medical-log-form" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Log'}
                  {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {confirmation && (
        <ConfirmationDialog
          {...confirmation}
          button="Done"
          onClose={() => navigate({ to: '/admin-medical-logs' })}
        />
      )}
    </div>
  );
}