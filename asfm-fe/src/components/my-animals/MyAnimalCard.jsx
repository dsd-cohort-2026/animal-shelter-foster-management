import getBirthdayYear from '@/utils/getBirthday';
import { Card } from '../ui/card';

export default function MyAnimalCard({ animal }) {
  const age = getBirthdayYear(animal.dob);

  return (
    <>
      <Card className="flex flex-row items-center gap-4 p-4">
        <img
          src={animal.picture}
          alt={`adoption picture of ${animal.species} ${animal.name}`}
          className="h-16 w-16 rounded-xl object-fit flex-shrink-0"
        />
        <div className="flex flex-wrap gap-5 justify-between w-full">
          <div className="flex flex-wrap gap-5">
            <AnimalStatPill label={'animal id'} data={animal.chip_id ?? 'No id'} />
            <AnimalStatPill label={'name'} data={animal.name ?? 'No name'} />
            <AnimalStatPill
              label={'age'}
              data={age ? `${age} ${age > 1 ? 'yrs' : 'yr'}` : 'No age'}
            />
            <AnimalStatPill label={'Species'} data={animal.species ?? 'Unknown'} />
            <AnimalStatPill label={'Sex'} data={animal.sex ?? 'Sex unknown'} />
            <AnimalStatPill label={'Fixed Status'} data={animal.altered ? 'Fixed' : 'Not Fixed'} />
          </div>
          <div className="flex justify-center w-full md:w-auto">
            <a
              href={`/single-animal/${animal.id}`}
              className="ring-1 ring-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 px-4 py-2 flex flex-col justify-center gap-y-0.5 w-full md:w-auto items-center hover:underline underline-offset-2"
            >
              Read More
            </a>
          </div>
        </div>
      </Card>
    </>
  );
}

function AnimalStatPill({ label, data }) {
  return (
    <div
      className="ring-1 ring-gray-200 rounded-xl bg-gray-50 px-4 py-1 flex flex-col gap-y-0.5
"
    >
      <span className="block text-gray-500 text-center">{label}</span>
      <span className="block text-center">{data}</span>
    </div>
  );
}
