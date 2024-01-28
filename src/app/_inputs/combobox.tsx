"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps<T extends ComboboxTypes> {
    options: T[];
    placeholder: string;
    value?: T;
    onChange?: (value: string | undefined) => void;
}

interface ComboboxTypes {
    toString: () => string;
}

export function Combobox<T extends ComboboxTypes>(props: ComboboxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string>(
        (props.value ?? "").toString(),
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value ? value : props.placeholder ?? "Select a value"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No values found.</CommandEmpty>
                    <CommandGroup>
                        {props.options.map((option) => (
                            <CommandItem
                                key={option.toString()}
                                value={option.toString()}
                                className={cn(
                                    "justify-between",
                                    value === option.toString()
                                        ? "bg-slate-500"
                                        : "bg-slate-50",
                                    value === option.toString()
                                        ? "text-white"
                                        : "text-slate-900",
                                )}
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? ""
                                            : currentValue,
                                    );
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.toString()
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                {option.toString()}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
