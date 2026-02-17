import { InputGroup , InputGroupInput , InputGroupAddon } from "./ui/input-group";
import {
    CheckIcon,
    CreditCardIcon,
    InfoIcon,
    MailIcon,
    SearchIcon,
    StarIcon,
  } from "lucide-react"
function SearchBar () {
   return  <div className="bg-secondary flex flex-row m-16 px-2 py-2 rounded-md">
     <div className="basis-1/5">
      <InputGroup className="border-highlight">
        <InputGroupInput placeholder="Search by Animal Id" />
        <InputGroupAddon>
        <SearchIcon/>
        </InputGroupAddon>
      </InputGroup>
    </div>
    </div>
}
export default SearchBar;