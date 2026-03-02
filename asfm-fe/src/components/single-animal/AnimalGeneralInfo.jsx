import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import AnimalInputGroup from './AnimalInputGroup';

export function AnimalGeneralInfo({ isEditing, viewAnimal }) {
    return (
      <>
        <h1>This is Regular View</h1>
        <div className="pt-10 grid grid-cols-[60%_1fr] gap-x-5">
          <Card className={'p-4'}>
            <CardDescription>
              <div className="grid md:grid-cols-3 gap-x-4 gap-y-10">
                <AnimalInputGroup
                  isEditing={isEditing}
                  viewAnimal={viewAnimal}
                  htmlForLabel="name"
                  labelTitle="Name"
                  prop="name"
                />
  
                <AnimalInputGroup
                  isEditing={isEditing}
                  viewAnimal={viewAnimal}
                  htmlForLabel="sex"
                  labelTitle="Sex"
                  prop="sex"
                />
                <AnimalInputGroup
                  isEditing={isEditing}
                  viewAnimal={viewAnimal}
                  htmlForLabel="species"
                  labelTitle="Species"
                  prop="species"
                />
                <AnimalInputGroup
                  isEditing={isEditing}
                  viewAnimal={viewAnimal}
                  htmlForLabel="age"
                  labelTitle="Age"
                  prop="dob"
                  unit="yrs"
                />
                <AnimalInputGroup
                  isEditing={isEditing}
                  viewAnimal={viewAnimal}
                  htmlForLabel="weight"
                  labelTitle="weight"
                  prop="weight"
                  unit="lbs"
                />
                <AnimalInputGroup
                  isEditing={isEditing}
                  viewAnimal={viewAnimal}
                  htmlForLabel="fixed-status"
                  labelTitle="Fixed Status"
                  prop="altered"
                />
              </div>
            </CardDescription>
          </Card>
          <Card className="p-0 w-full ">
            <div className={`relative w-full h-full bg-cover bg-center rounded-xl`} style={{ backgroundImage: `url(${viewAnimal.picture})` }}>
              <div className="absolute backdrop-blur-sm inset-0 rounded-xl"></div>
              <img
                src={viewAnimal.picture}
                className="absolute w-full h-full object-cover max-w-[200px] blur-none top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </Card>
        </div>
      </>
    );
  }