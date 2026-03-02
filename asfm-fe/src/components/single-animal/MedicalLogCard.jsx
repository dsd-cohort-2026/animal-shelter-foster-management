import CustomBadge from '@/components/custom/CustomBadge';

export default function MedicalLogCard({log}) {

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
                  <span className='block pt-2'>Amoxicillin - 50mg - 7 days</span>
                </div>
              </div>
    )

}


// export default function MedicalLogCard() {

//     return (
//         <div className='ring-1 p-2 rounded-lg'>
//                 <span className="text-lg font-semibold">[January 20, 2025 01:34:48] </span>
//                 <CustomBadge text="BEHAVIORAL" badgeClassName="ml-5 px-2 py-1" />
//                 <div className='pt-5'>
//                   <span className='text-lg font-semibold'>General Notes:</span>
//                   <span className='block pt-2'>he's a good boy</span>
//                 </div>
//                 <div className='pt-5'>
//                   <span className='text-lg font-semibold'>Behavioral Notes:</span>
//                   <span className='block pt-2'>refer to the general notes</span>
//                 </div>
//                 <div className='pt-5'>
//                   <span className='text-lg font-semibold'>Medications:</span>
//                   <span className='block pt-2'>Amoxicillin - 50mg - 7 days</span>
//                 </div>
//               </div>
//     )

// }