import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationDialog from '@/components/confirmationDialog';
import MedicalLogForm from '@/components/medical-logs/MedicalLogForm';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';
import { useBoundStore } from '@/store';

export const Route = createFileRoute('/_user/add-medical-log')({
  component: AddMedicalLogPage,
});

function AddMedicalLogPage() {
  const navigate = useNavigate();
  const user = useBoundStore((state) => state.user);

  const [animals, setAnimals] = useState([]);
  const [medications, setMedications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  const fetchAnimals = async () => {
    setLoadingAnimals(true);
    setSubmitError('');
    try {
      const [animalsResponse, itemsResponse] = await Promise.all([
        apiClient.get('/animals'),
        apiClient.get('/items'),
      ]);
      const rawAnimals = animalsResponse?.data || [];
      const rawItems = itemsResponse?.data || [];

      // Validate response is an array
      if (!Array.isArray(rawAnimals)) {
        throw new Error('Unexpected response format from server: expected array of animals');
      }
      if (!Array.isArray(rawItems)) {
        throw new Error('Unexpected response format from server: expected array of items');
      }

      // Filter to show only fostered animals
      // Note: The backend will validate the active assignment when creating the log
      const fosteredAnimals = rawAnimals.filter((animal) => animal.foster_status === 'FOSTERED');
      const medicationOptions = rawItems
        .filter((item) => item?.category === 'MEDICINE' && item?.medication_id)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((item) => ({
          id: item.medication_id,
          item_name: item.name,
          item_brand: item.brand,
          recommended_dose: item.medication?.recommended_dose || '',
          administration_route: item.medication?.administration_route || '',
          side_effects: item.medication?.side_effects || '',
        }));

      setAnimals(fosteredAnimals);
      setMedications(medicationOptions);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setSubmitError('Failed to load form options. Please try again.');
    } finally {
      setLoadingAnimals(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAnimals();
    }
  }, [user?.id]);

  const handleSubmit = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    const animal = animals.find((a) => a.id === formData.animal_id);

    try {
      // Build payload, excluding null/undefined values and logged_at (not in backend validator)
      const payload = {
        category: formData.category,
        animal_id: formData.animal_id,
        ...(formData.general_notes && { general_notes: formData.general_notes }),
        ...(formData.behavior_notes && { behavior_notes: formData.behavior_notes }),
        ...(formData.qty_administered != null && { qty_administered: formData.qty_administered }),
        ...(formData.dose && { dose: formData.dose }),
        ...(formData.administered_at && { 
          administered_at: new Date(formData.administered_at).toISOString() 
        }),
        ...(formData.prescription && { prescription: formData.prescription }),
        ...(formData.medication_id && { medication_id: formData.medication_id }),
        // For foster users, include their ID to link to their foster account
        ...(user?.id && { foster_user_id: user.id }),
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
      if (err.response?.status === 403) {
        setSubmitError('You are not authorized to create a medical log for this animal. Please ensure the animal is assigned to you.');
      } else if (err.response?.status === 404) {
        setSubmitError('Animal not found. Please try again.');
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => navigate({ to: '/foster-medical-logs' })}
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
          ) : animals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You don't have any active foster assignments.
              </p>
              <p className="text-sm text-muted-foreground">
                Medical logs can only be created for animals currently assigned to you.
              </p>
            </div>
          ) : (
            <div className="mx-auto w-full">
              <MedicalLogForm
                formId="add-medical-log-form"
                onSubmit={handleSubmit}
                animals={animals}
                medications={medications}
              />
              {submitError && <p className="text-sm text-red-500 mt-2">{submitError}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/foster-medical-logs' })}
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
          onClose={() => navigate({ to: '/foster-medical-logs' })}
        />
      )}
    </div>
  );
}
