import InputGroupForSearch from './InputGroupForSearch';
import { InputGroup, InputGroupInput, InputGroupAddon } from './ui/input-group';
import { SearchIcon } from 'lucide-react';
function SearchBar() {
  return (
    <div className="bg-secondary flex flex-row m-16 px-2 py-2 rounded-md">
      <InputGroupForSearch placeholder_text="Search by Animal Id" add_search_icon={true} />
    </div>
  );
}
export default SearchBar;
