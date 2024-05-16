import * as React from "react";
import { Label } from "./label";
import { Button } from "./button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover";
import { Calendar } from "./calendar";

const DatePickerInput = ({ label, date, onSelectDate }) => {
    return (
        <div className="flex-1 flex-col items-center gap-1.5">
            <Label>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd-MM-yyyy") : <span>Дата народження</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={onSelectDate} captionLayout="dropdown-buttons"
                              fromYear={1960}
                              toYear={2025} />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export function CustomForm({date, setDate}) {

    return (
        <div className="flex w-full max-w-lg gap-4">

            <DatePickerInput label="Дата народження" date={date} onSelectDate={setDate} />
        </div>
    );
}
