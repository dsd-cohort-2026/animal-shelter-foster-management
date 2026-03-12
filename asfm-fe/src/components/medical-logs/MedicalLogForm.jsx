import { useForm } from '@tanstack/react-form';
import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOG_TYPE_OPTIONS } from '@/constants/medicalLogConstants';

const EMPTY_DEFAULTS = {
  animal_id: '',
  medication_id: '',
  category: '',
  logged_at: new Date().toISOString().slice(0, 16),
  general_notes: '',
  behavior_notes: '',
  qty_administered: '',
  dose: '',
  administered_at: '',
  prescription: '',
};
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxList,
  ComboboxCollection,
} from '@/components/ui/combobox';
import { useBoundStore } from '@/store';

const required =
  (label) =>
  ({ value }) =>
    !value || !value.toString().trim() ? `${label} is required.` : undefined;

const notInFuture =
  (label) =>
  ({ value }) => {
    if (!value) return undefined;
    const selectedDate = new Date(value);
    const now = new Date();
    if (selectedDate > now) {
      return `${label} cannot be in the future.`;
    }
    return undefined;
  };

export default function MedicalLogForm({
  formId,
  onSubmit,
  initialValues = {},
  animals = [],
  medications = [],
}) {
  const medicalLogs = useBoundStore((state) => state.medicalLogs) || [];

  // Get unique animal names from medical logs (fallback if no animals prop)
  const animalNamesFromLogs = useMemo(() => {
    const names = [...new Set(medicalLogs.map((log) => log.animal_name).filter(Boolean))];
    return names.sort();
  }, [medicalLogs]);

  // Create animal name to ID map for form submission
  const animalNameToIdMap = useMemo(() => {
    const map = new Map();
    animals.forEach(animal => {
      map.set(animal.name, animal.id);
    });
    return map;
  }, [animals]);

  // Prepare animal options for combobox
  // Prefer animals prop if available, otherwise fallback to names from logs
  const animalOptions = useMemo(() => {
    if (animals.length > 0) {
      // Return array of animal objects with id and name
      return animals;
    }
    // Fallback: convert names to simple strings
    return animalNamesFromLogs;
  }, [animals, animalNamesFromLogs]);

  const form = useForm({
    defaultValues: { ...EMPTY_DEFAULTS, ...initialValues },
    onSubmit: async ({ value }) => {
      // Convert animal name to animal ID for submission
      const animalId = animalNameToIdMap.get(value.animal_id);
      
      onSubmit({
        ...value,
        animal_id: animalId || value.animal_id, // Use ID if found, otherwise keep original value
        qty_administered: value.qty_administered ? parseFloat(value.qty_administered) : null,
      });
    },
  });

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4 w-full min-w-0"
    >
      {/* Animal */}
      <form.Field name="animal_id" validators={{ onChange: required('Animal') }}>
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Animal <span className="text-red-500">*</span>
            </label>
            {animalOptions.length > 0 ? (
              <Combobox
                items={animalOptions}
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <ComboboxInput placeholder="Select an animal..." />
                <ComboboxContent>
                  <ComboboxEmpty>No animals available.</ComboboxEmpty>
                  <ComboboxList>
                    <ComboboxCollection>
                      {(item) => (
                        <ComboboxItem key={item.id || item} value={item.name || item}>
                          {item.name || item}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            ) : (
              <Textarea
                className={`w-full ${field.state.meta.errors.length ? 'border-red-500' : ''}`}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="No animals available - type animal name..."
                rows={1}
              />
            )}
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Log type select */}
        <form.Field name="category" validators={{ onChange: required('Log Type') }}>
          {(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Log Type <span className="text-red-500">*</span>
              </label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val)}>
                <SelectTrigger
                  className={`w-full ${field.state.meta.errors.length ? 'border-red-500' : ''}`}
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {LOG_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Date */}
        <form.Field name="logged_at" validators={{ onChange: required('Date') }}>
          {(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                className={`w-full ${field.state.meta.errors.length ? 'border-red-500' : ''}`}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* General notes */}
      <form.Field name="general_notes">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">General Notes</label>
            <Textarea
              className="w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Describe the medical log entry..."
              rows={3}
            />
          </div>
        )}
      </form.Field>

      {/* Behavior notes */}
      <form.Field name="behavior_notes">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Behavior Notes</label>
            <Textarea
              className="w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Any behavioral observations..."
              rows={2}
            />
          </div>
        )}
      </form.Field>

      {/* Medication */}
      <form.Field name="medication_id">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Medication</label>
            <Select
              value={field.state.value || 'none'}
              onValueChange={(value) => field.handleChange(value === 'none' ? '' : value)}
            >
              <SelectTrigger className="w-full" onBlur={field.handleBlur}>
                <SelectValue placeholder="Select medication (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked medication</SelectItem>
                {medications.map((medication) => (
                  <SelectItem key={medication.id} value={medication.id}>
                    {medication.item_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dose */}
        <form.Field name="dose">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Dose</label>
              <Input
                className="w-full"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. 1 mL"
              />
            </div>
          )}
        </form.Field>

        {/* Qty administered */}
        <form.Field name="qty_administered">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Qty Administered</label>
              <Input
                type="number"
                step="0.1"
                className="w-full"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. 1.0"
              />
            </div>
          )}
        </form.Field>

        {/* Administered at */}
        <form.Field name="administered_at" validators={{ onChange: notInFuture('Administered At') }}>
          {(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Administered At</label>
              <Input
                type="datetime-local"
                className={`w-full ${field.state.meta.errors.length ? 'border-red-500' : ''}`}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                max={new Date().toISOString().slice(0, 16)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Prescription */}
      <form.Field name="prescription">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Prescription</label>
            <Input
              className="w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Amoxicillin 50mg twice daily"
            />
          </div>
        )}
      </form.Field>
    </form>
  );
}
