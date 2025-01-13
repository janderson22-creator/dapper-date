import { cn } from "@/app/utils/cn";
import { ArrowDown } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";

interface EditHourOpeningProps {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  startTime?: string;
  pauseAt?: string;
  endTime?: string;
}

const EditHourOpening: React.FC<EditHourOpeningProps> = ({
  label,
  value,
  setValue,
  startTime,
  endTime,
  pauseAt,
}) => {
  const [openTimes, setOpenTimes] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenTimes(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTimes = useMemo(() => {
    if (label === "Termina") {
      return startTime ? times.filter((time) => time > startTime) : times;
    }

    if (label === "Volta") {
      return pauseAt && endTime
        ? times.filter((time) => time > pauseAt && time < endTime)
        : times;
    }

    if (label === "Pausa") {
      return startTime && endTime
        ? times.filter((time) => time > startTime && time < endTime)
        : times;
    }

    return times;
  }, [endTime, label, pauseAt, startTime]);

  const disabled = useMemo(() => {
    if (label === "Termina") {
      return startTime ? false : true;
    }

    if (label === "Volta") {
      return pauseAt ? false : true;
    }

    if (label === "Pausa") {
      return startTime && endTime ? false : true;
    }

    return false;
  }, [endTime, label, pauseAt, startTime]);

  return (
    <div className="w-full cursor-pointer" ref={ref}>
      <label className="text-xs text-gray-400" htmlFor="startAt">
        {label} ás:
      </label>
      <div
        onClick={() => !disabled && setOpenTimes(!openTimes)}
        className={cn(
          "relative border py-2 w-full rounded-lg border-secondary min-h-[38px]",
          disabled && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between pr-2">
          <p
            className={cn(
              "whitespace-nowrap text-sm font-medium px-2",
              !value && "text-xs"
            )}
          >
            {value ? value : "Selecione um horário"}
          </p>

          <div
            className={cn(
              "",
              openTimes && "scale-100 transition-all rotate-180"
            )}
          >
            <ArrowDown size={16} />
          </div>
        </div>

        {openTimes && (
          <div
            className={cn(
              "bg-secondary absolute top-11 border border-white border-opacity-30 px-5 rounded-lg w-full flex flex-col items-center gap-2 max-h-[150px] overflow-scroll z-10"
            )}
          >
            {filteredTimes.map((time, key) => (
              <p
                onClick={() => setValue(time)}
                className="text-sm text-center font-semibold border-b border-gray-500 w-full py-2 text-gray-300 last-of-type:border-none"
                key={key}
              >
                {time}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditHourOpening;

const times = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];
