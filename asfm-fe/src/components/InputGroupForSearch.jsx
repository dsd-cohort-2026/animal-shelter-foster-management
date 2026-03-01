import { InputGroup, InputGroupInput, InputGroupAddon } from './ui/input-group';
import { SearchIcon } from 'lucide-react';
function InputGroupForSearch({ placeholder_text, add_search_icon = false }) {
  return (
    <div>
      <InputGroup className="border-highlight">
        <InputGroupInput placeholder={placeholder_text} />
        <InputGroupAddon>{add_search_icon && <SearchIcon />}</InputGroupAddon>
      </InputGroup>
    </div>
  );
}
export default InputGroupForSearch;
