// Animal status colors matching server schema Animal_Status enum
export const STATUS_COLORS = {
  SHELTERED: 'bg-emerald-100 text-emerald-800',
  FOSTERED: 'bg-blue-100 text-blue-800',
  ADOPTED: 'bg-purple-100 text-purple-800',
};

// Species options matching server schema Species enum
export const SPECIES_OPTIONS = [
  { value: 'DOG', label: 'Dog' },
  { value: 'CAT', label: 'Cat' },
];

// Sex options matching server schema Sex enum
export const SEX_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

// Status options matching server schema Animal_Status enum
export const STATUS_OPTIONS = [
  { value: 'SHELTERED', label: 'Sheltered' },
  { value: 'FOSTERED', label: 'Fostered' },
  { value: 'ADOPTED', label: 'Adopted' },
];

// Helper to format foster_status for display
export const formatStatus = (status) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
};

// Helper to format species for display
export const formatSpecies = (species) => {
  return species ? species.charAt(0).toUpperCase() + species.slice(1).toLowerCase() : '';
};

// Helper to format sex for display
export const formatSex = (sex) => {
  return sex ? sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase() : '';
};