import CustomBadge from '@/components/custom/CustomBadge';
import { fetchMedication, fetchMedicationItem } from '@/services/medicalLogCardService';
import { useEffect } from 'react';
import { useState } from 'react';

export default function MedicalLogCard({ log }) {
  const [medication, setMedication] = useState('');
  const [item, setItem] = useState('');

  useEffect(() => {
    async function load() {
      const result = await fetchMedication(log.medication_id);
      if (!result) return setMedication(null);
      setMedication(result);
      const itemData = await fetchMedicationItem(result.item_id);
      if (!itemData) return setItem(null);
      setItem(itemData[0]);
    }

    load();
  }, [log.medication_id]);

  return (
    <div className="ring-1 p-2 rounded-lg">
      <span className="text-lg font-semibold">[{log.logged_at}]</span>
      <CustomBadge text="BEHAVIORAL" badgeClassName="ml-5 px-2 py-1" />
      <div className="pt-5">
        <span className="text-lg font-semibold">General Notes:</span>
        <span className="block pt-2">{log.general_notes ? log.general_notes : 'None'}</span>
      </div>
      <div className="pt-5">
        <span className="text-lg font-semibold">Behavioral Notes:</span>
        <span className="block pt-2">{log.behavior_notes ? log.behavior_notes : 'None'}</span>
      </div>
      <div className="pt-5">
        <span className="text-lg font-semibold">Medications:</span>
        {item ? (
          <span className="block pt-2">
            {item.name} {log.dose && `- Dosage: ${log.dose} dose`}{' '}
            {log.prescription && `- Prescription: ${log.prescription}`}{' '}
            {medication && `- Administration Route: ${medication.administration_route}`}
          </span>
        ) : (
          <span className="block pt-2"> None</span>
        )}
      </div>
    </div>
  );
}
