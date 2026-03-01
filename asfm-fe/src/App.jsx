import FilterSelect from './components/custom/FilterSelect';
import { Button } from './components/ui/button';
import TopNavBar from './components/NonMemberSignInNavBar';
import { ReusableTable } from './components/table_components';
import { mockLoanedItems } from './features/mockLoanedItems';
import DashboardCard from './components/custom/DashboardCard';
import { ModalDialog } from './components/ModalDialog';
import ConfirmationDialog from './components/confirmationDialog';
import { useState } from 'react';
import CustomBadge from './components/custom/CustomBadge';
import { useBoundStore } from './store';

function App() {
  // src/features/loaned-items/loanedItemsColumns.js
  const loanedItemsColumns = [
    {
      accessorKey: 'itemDescription',
      header: 'Item Description',
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
      textSize: 'sm',
      headClassName: 'w-[120px] text-center',
      cellClassName: 'text-center',
    },
  ];

  // For modal example
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const submitHandler = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 2000);
  };

  // For confirmation dialog example
  const [dialogConfig, setDialogConfig] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const openDialog = (type, primaryText, secondaryText, button = 'Done') => {
    setDialogConfig({ type, primaryText, secondaryText, button });
    setShowConfirmation(true);
  };

  return (
    <>
      <div id="examples" className="flex flex-col items-center h-auto gap-4 mt-17.5">
        <div>
          <div className='text-center'>Global State Test</div>
          <div>
            <div className='flex flex-col items-center'>
            {userAnimals.map((animal, index) => (
              <span key={index} className="pr-2">
                {animal.name}
              </span>
            ))}
            </div>
            <Button className="mt-2" onClick={() => addUserAnimal({ name: 'Chewy' })}>Update state and add dog to the list</Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <Button>Default button</Button>
          <Button disabled>Disabled button</Button>
          <Button variant="destructive">Destructive button</Button>
          <Button variant="outline">Outline button</Button>
          <Button variant="secondary">Secondary button</Button>
          <Button variant="ghost">Ghost button</Button>
          <Button variant="link">Link button</Button>
        </div>
        <FilterSelect
          selectTriggerClassName="w-[300px]"
          selectItems={['approved', 'pending', 'denied']}
        />
        <ModalDialog
          trigger={<Button>Open Modal</Button>}
          title={'Title'}
          description={'Description'}
          buttonVariant={'secondary'}
          formId={'my-form'}
          isSubmitting={loading}
          submitHandler={submitHandler}
          open={open}
          setOpen={setOpen}
        >
          {/* any content you need, below is just an example */}
          <form id="my-form" className="flex flex-col min-w-fit max-w-20">
            <label>Name:</label>
            <input type="text" className="border" />
            <label>Email:</label>
            <input type="text" className="border" />
          </form>
        </ModalDialog>
        <Button
          variant="secondary"
          onClick={() => openDialog('success', 'Success', 'Item has been added to inventory.')}
        >
          Open Success
        </Button>
        <Button
          variant="destructive"
          onClick={() => openDialog('error', 'Failed', 'Could not add item to inventory.')}
        >
          Open Error
        </Button>
        {showConfirmation && (
          <ConfirmationDialog {...dialogConfig} onClose={() => setShowConfirmation(false)} />
        )}
      </div>
      <div className="flex justify-center">Admin Dashboard Card</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5">
        <DashboardCard
          title={'Testing Title'}
          navLink={'admin-portal'}
          itemsArray={[
            { name: 'Chewy', species: 'dog', sex: 'male', dob: '09/15/16' },
            { name: 'Bailey', species: 'dog', sex: 'female', dob: '12/26/19' },
          ]}
        />
        <DashboardCard
          title={'Testing Title 2'}
          navLink={'admin-portal'}
          itemsArray={[
            { name: 'Chewy', species: 'dog', sex: 'male', dob: '09/15/16' },
            { name: 'Bailey', species: 'dog', sex: 'female', dob: '12/26/19' },
          ]}
        />
      </div>
      <ReusableTable
        columns={loanedItemsColumns}
        data={mockLoanedItems}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
      />
    </>
  );
}

export default App;
