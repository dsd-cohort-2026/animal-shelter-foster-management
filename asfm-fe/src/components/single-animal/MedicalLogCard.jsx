import CustomBadge from '@/components/custom/CustomBadge';
import { useEffect } from 'react';
import { useState } from 'react';

export default function MedicalLogCard({log}) {

    const [medication, setMedication] = useState('');
    const [item, setItem] = useState('');

    const url = "http://localhost:3005"; // <-- placeholder

    async function fetchMedication() {
        try {
            const response = await fetch(`${url}/medication?id=${log.medication_id}`);
            if (!response.ok) {
                throw new Error(`Fetch request error status: ${response.status}`)
            }
            const data = await response.json();
            if (Object.keys(data).length === 0) {
                return null
            }
            setMedication(data)
            return data
        } catch (err) {
            console.error(`Failed to fetch medication ${err}`)
        }
    }

    async function fetchMedicationItem(itemId) {
        try {
            const response = await fetch(`${url}/items?id=${itemId}`);
            if (!response.ok) {
                throw new Error(`Fetch request error status: ${response.status}`)
            }
            const data = await response.json();
            setItem(data[0])
        } catch (err) {
            console.error(`Failed to fetch item from medication id ${err}`)
        }
    }

    async function fetchMedicationInfo() {
        const results = await fetchMedication()
        if (!results) {
            return setItem(null)
        }
        await fetchMedicationItem(results.item_id)
    }

    useEffect(() => {
        const load = async () => {
            await fetchMedicationInfo()
        }

        load()
    }, [log.medication_id])

    return (
        <div className='ring-1 p-2 rounded-lg'>
                <span className="text-lg font-semibold">[{log.logged_at}]</span>
                <CustomBadge text="BEHAVIORAL" badgeClassName="ml-5 px-2 py-1" />
                <div className='pt-5'>
                  <span className='text-lg font-semibold'>General Notes:</span>
                  <span className='block pt-2'>{log.general_notes ? log.general_notes : 'None'}</span>
                </div>
                <div className='pt-5'>
                  <span className='text-lg font-semibold'>Behavioral Notes:</span>
                  <span className='block pt-2'>{log.behavior_notes ? log.behavior_notes : 'None'}</span>
                </div>
                <div className='pt-5'>
                  <span className='text-lg font-semibold'>Medications:</span>
                  {item ?
                    <span className='block pt-2'>{item.name} {log.dose && `- Dosage: ${log.dose} dose`} {log.prescription && `- Prescription: ${log.prescription}`} {medication && `- Administration Route: ${medication.administration_route}`}</span>
                    :
                    <span className='block pt-2'> None</span>
                }
                </div>
              </div>
    )

}

