import CustomBadge from '@/components/custom/CustomBadge';

export default function MedicalLogCard({ log }) {
  const logCategory =
    typeof log?.category === 'string'
      ? log.category[0] + log.category.slice(1).toLowerCase()
      : 'Unknown';
  const formattedDate = new Date(log.logged_at).toUTCString();
  const medicationName = log?.medication?.item?.name;
  const administrationRoute = log?.medication?.administration_route;
  const recommendedDose = log?.medication?.recommended_dose;
  const hasMedicationData = Boolean(
    medicationName ||
      administrationRoute ||
      recommendedDose ||
      log?.dose ||
      log?.prescription ||
      log?.qty_administered != null,
  );

  return (
    <div className="ring-1 p-2 rounded-lg">
      <span className="text-lg font-semibold">Logged at: [ {formattedDate} ]</span>
      <CustomBadge text={logCategory} badgeClassName="ml-5 px-2 py-1" />
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
        {hasMedicationData ? (
          <div className="block pt-2 space-y-1">
            {medicationName && <p>{medicationName}</p>}
            {log.dose && <p>Dosage: {log.dose}</p>}
            {log.qty_administered != null && <p>Quantity Administered: {log.qty_administered}</p>}
            {log.prescription && <p>Prescription: {log.prescription}</p>}
            {administrationRoute && <p>Administration Route: {administrationRoute}</p>}
            {recommendedDose && <p>Recommended Dose: {recommendedDose}</p>}
          </div>
        ) : (
          <span className="block pt-2">None</span>
        )}
      </div>
    </div>
  );
}
