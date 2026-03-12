import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ModalDialog } from '@/components/ModalDialog';
import ConfirmationDialog from '@/components/confirmationDialog';
import CustomBadge from '@/components/custom/CustomBadge';
import AnimalForm from '@/components/animals/AnimalForm';
import { useBoundStore } from '@/store';
import { STATUS_COLORS, formatStatus, formatSpecies, formatSex } from '@/constants/animalConstants';
import apiClient from '@/lib/axios';
import { supabase } from '@/lib/supabaseClient';

export const Route = createFileRoute('/_admin/animals/$animalId')({
  component: AnimalDetailPage,
});

function AnimalDetailPage() {
  const { animalId } = Route.useParams();
  const navigate = useNavigate();
  const animals = useBoundStore((state) => state.animals);
  const animalsLoading = useBoundStore((state) => state.animalsLoading);
  const animalsError = useBoundStore((state) => state.animalsError);
  const fetchAnimals = useBoundStore((state) => state.fetchAnimals);
  const updateAnimal = useBoundStore((state) => state.updateAnimal);

  const [editOpen, setEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const animal = animals.find((a) => a.id === animalId);

  const handleEditSubmit = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Exclude fields that shouldn't be sent to backend
      const { id, created_at, ...updateData } = formData;

      await apiClient.patch(`/animals/${animal.id}`, {
        ...updateData,
        last_modified: new Date().toISOString(),
        modified_by: userId,
      });
      updateAnimal({ ...animal, ...formData });
      setIsSubmitting(false);
      setEditOpen(false);
      setConfirmation({
        type: 'success',
        primaryText: 'Animal Updated',
        secondaryText: `${formData.name} has been updated successfully.`,
      });
    } catch {
      setIsSubmitting(false);
      setSubmitError('Failed to update animal. Please try again.');
    }
  };

  if (animalsLoading) {
    return (
      <>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-8 w-40" />
          <Card>
            <CardHeader className="pb-4 border-b">
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (animalsError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-xl text-red-500">{animalsError}</p>
        <Button variant="outline" onClick={() => fetchAnimals()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-xl text-muted-foreground">Animal not found.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/animals' })}>
          ← Back to Animals
        </Button>
      </div>
    );
  }

  const fields = [
    { label: 'Chip ID', value: animal.chip_id },
    { label: 'Species', value: formatSpecies(animal.species) },
    { label: 'Sex', value: formatSex(animal.sex) },
    { label: 'Date of Birth', value: animal.dob ? new Date(animal.dob).toLocaleDateString() : '—' },
    { label: 'Weight', value: animal.weight ? `${animal.weight} lbs` : '—' },
    { label: 'Kennel ID', value: animal.kennel_id || '—' },
    { label: 'Spayed/Neutered', value: animal.altered ? 'Yes' : 'No' },
    {
      label: 'Created',
      value: animal.created_at ? new Date(animal.created_at).toLocaleDateString() : '—',
    },
    {
      label: 'Last Modified',
      value: animal.last_modified ? new Date(animal.last_modified).toLocaleDateString() : '—',
    },
  ];

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Button variant="ghost" className="-ml-2" onClick={() => navigate({ to: '/animals' })}>
          ← Back to Animals
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4 border-b">
            <div className="flex flex-col items-start gap-3 w-1/2 ">
              <div className="flex gap-3 content-start">
                <CardTitle className="text-2xl">{animal.name}</CardTitle>
                <CustomBadge
                  text={formatStatus(animal.foster_status)}
                  badgeClassName={STATUS_COLORS[animal.foster_status]}
                />
              </div>
              <div className="relative overflow-hidden rounded-lg w-50">
                <img src={animal.picture} alt={`picture of ${animal.species} ${animal.name}`} />
              </div>
            </div>
            <Button
              onClick={() => {
                setSubmitError('');
                setEditOpen(true);
              }}
            >
              Edit Animal
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
              {fields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ModalDialog
        trigger={<span />}
        title="Edit Animal"
        description="Update the animal's information."
        buttonVariant="default"
        formId="edit-animal-form"
        isSubmitting={isSubmitting}
        open={editOpen}
        setOpen={setEditOpen}
        contentClassName="sm:max-w-3xl"
      >
        <AnimalForm
          formId="edit-animal-form"
          onSubmit={handleEditSubmit}
          initialValues={animal}
          error={submitError}
        />
      </ModalDialog>

      {confirmation && (
        <ConfirmationDialog {...confirmation} button="Done" onClose={() => setConfirmation(null)} />
      )}
    </>
  );
}
