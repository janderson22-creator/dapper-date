import { times } from "../admin/utils/hoursOfDay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  value: string;
  setValue: (value: string) => void;
  options: string[];
  placeHolder: string;
};

export const SelectOptions = ({
  value,
  setValue,
  options,
  placeHolder,
}: Props) => (
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger>
      <SelectValue placeholder={placeHolder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((time, index) => (
        <SelectItem value={time} key={index}>
          {time}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
