import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SPECIES_OPTIONS, SEX_OPTIONS, STATUS_OPTIONS } from '@/constants/animalConstants';

const EMPTY_FORM = {
  name: '',
  chip_id: '',
  dob: '',
  sex: '',
  species: '',
  foster_status: '',
  kennel_id: '',
  altered: false,
  weight: '',
  picture: '',
};

const REQUIRED_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'chip_id', label: 'Chip ID' },
  { key: 'species', label: 'Species' },
  { key: 'sex', label: 'Sex' },
  { key: 'foster_status', label: 'Status' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'weight', label: 'Weight' },
  { key: 'kennel_id', label: 'Kennel ID' },
];

function validate(form) {
  const errors = {};
  for (const { key, label } of REQUIRED_FIELDS) {
    if (!form[key] || !form[key].toString().trim()) {
      errors[key] = `${label} is required.`;
    }
  }
  if (form.chip_id && isNaN(form.chip_id)) {
    errors.chip_id = 'Chip ID must be a number.';
  }
  if (form.weight && isNaN(form.weight)) {
    errors.weight = 'Weight must be a number.';
  }
  if (form.kennel_id && isNaN(form.kennel_id)) {
    errors.kennel_id = 'Kennel ID must be a number.';
  }
  return errors;
}

export default function AnimalForm({ formId, onSubmit, initialValues = {}, error }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setInput = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // Convert string values to appropriate types
    const submitData = {
      ...form,
      chip_id: form.chip_id ? parseInt(form.chip_id, 10) : null,
      kennel_id: form.kennel_id ? parseInt(form.kennel_id, 10) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      altered: Boolean(form.altered),
    };

    onSubmit(submitData);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4 w-full min-w-0">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {Object.keys(fieldErrors).length > 0 && (
        <p className="text-sm text-red-500">Please fix the highlighted fields below.</p>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          className={`w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
          value={form.name}
          onChange={setInput('name')}
          placeholder="Animal name"
        />
        {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Chip ID <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            className={`w-full ${fieldErrors.chip_id ? 'border-red-500' : ''}`}
            value={form.chip_id}
            onChange={setInput('chip_id')}
            placeholder="Enter chip number"
          />
          {fieldErrors.chip_id && <p className="text-xs text-red-500">{fieldErrors.chip_id}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Species <span className="text-red-500">*</span>
          </label>
          <Select value={form.species} onValueChange={set('species')}>
            <SelectTrigger className={`w-full ${fieldErrors.species ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              {SPECIES_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.species && <p className="text-xs text-red-500">{fieldErrors.species}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Sex <span className="text-red-500">*</span>
          </label>
          <Select value={form.sex} onValueChange={set('sex')}>
            <SelectTrigger className={`w-full ${fieldErrors.sex ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              {SEX_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.sex && <p className="text-xs text-red-500">{fieldErrors.sex}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Status <span className="text-red-500">*</span>
          </label>
          <Select value={form.foster_status} onValueChange={set('foster_status')}>
            <SelectTrigger
              className={`w-full ${fieldErrors.foster_status ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.foster_status && (
            <p className="text-xs text-red-500">{fieldErrors.foster_status}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            className={`w-full ${fieldErrors.dob ? 'border-red-500' : ''}`}
            value={form.dob}
            onChange={setInput('dob')}
          />
          {fieldErrors.dob && <p className="text-xs text-red-500">{fieldErrors.dob}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Weight (lbs) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.1"
            className={`w-full ${fieldErrors.weight ? 'border-red-500' : ''}`}
            value={form.weight}
            onChange={setInput('weight')}
            placeholder="Enter weight"
          />
          {fieldErrors.weight && <p className="text-xs text-red-500">{fieldErrors.weight}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Kennel ID <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            className={`w-full ${fieldErrors.kennel_id ? 'border-red-500' : ''}`}
            value={form.kennel_id}
            onChange={setInput('kennel_id')}
            placeholder="Enter a number"
          />
          {fieldErrors.kennel_id && <p className="text-xs text-red-500">{fieldErrors.kennel_id}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Picture URL</label>
          <Input
            className="w-full"
            value={form.picture}
            onChange={setInput('picture')}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="altered"
          checked={form.altered}
          onChange={(e) => set('altered')(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="altered" className="text-sm font-medium">
          Spayed/Neutered
        </label>
      </div>
    </form>
  );
}
