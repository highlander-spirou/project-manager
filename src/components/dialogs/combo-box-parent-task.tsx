import { useState, FC, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import supabase from "@/supabase";
import { useDebounce } from "@/hooks/useDebounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const fetcher = async (text: string, limit: number) => {
    const dbCall = supabase
        .from("task-list")
        .select("id, title, projects (id, name)")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });
    if (text.length > 0) {
        dbCall.textSearch("title", text);
    } else {
        dbCall.limit(limit);
    }

    const { data, error } = await dbCall;

    if (error) {
        throw new Error("Network error");
    }
    return data;
};

const ServerCommand: FC<CommandProps> = ({ eventDispatch, style }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setValue] = useState("");
    const [limit, setLimit] = useState(4);
    const [selected, setSelected] = useState<ParentTask | null>(null);
    const debounceInput = useDebounce(inputValue, 500);

    const { data: parentTasks } = useQuery({
        queryKey: ["parentTasks", debounceInput, limit],
        queryFn: async () => {
            const data = await fetcher(debounceInput, limit);
            return data;
        },
        placeholderData: keepPreviousData,
    });

    // useEffect(() => {
    //     console.log(selected);
    //     console.log("cond 1", Object.is(selected, null));
    //     console.log("cond 2", Object.is(selected?.projects, null));
    // }, [selected]);

    const handleClick = (target: ParentTask) => {
        // Trường hợp chọn 
        if (target.title !== selected?.title) {
            setSelected(target);
            console.log(target?.projects)
            if(target.projects == null) {
                eventDispatch(target.id, null)
            } else {
                eventDispatch(target.id, target.projects.id as number)
            }
            // if(Object.is(target.projects, null)) {
            //     eventDispatch(target.id, null);
            // } else {
            //     eventDispatch(target.id, target.projects?.id as number);
            // }
            setOpen(false);

        // Trường hợp bỏ chọn
        } else {
            setSelected(null);
            eventDispatch(null, null);
            setOpen(false);
        }
    };

    return (
        <>
            <Label className="text-right">Parent task</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-[200px] justify-between font-normal",
                            style?.width
                        )}
                    >
                        <span className="line-clamp-1 whitespace-break-spaces">
                            {!!selected ? selected.title : "Select task ..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={cn("w-[200px] p-0", style?.width, style?.content)}
                >
                    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                                placeholder="Search task"
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
                                value={inputValue}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                        {!!parentTasks && parentTasks!.length > 0 ? (
                            <ScrollArea className="h-[200px] overflow-y-auto">
                                {parentTasks?.map((x, index) => {
                                    return (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                handleClick(x as ParentTask);
                                            }}
                                            className="grid grid-cols-[20px_auto] gap-1 my-1"
                                        >
                                            {x.title === selected?.title && (
                                                <span className="flex justify-center items-center pl-1">
                                                    <Check className="w-3" />
                                                </span>
                                            )}
                                            <p className="col-start-2 h-11 w-[95%] hover:bg-gray-100 border-b-[1px] cursor-pointer flex items-center">
                                                <span className="ml-2 text-sm line-clamp-2 whitespace-break-spaces">
                                                    {x.title}
                                                </span>
                                            </p>
                                        </li>
                                    );
                                })}
                                <div className="flex justify-center">
                                    <Button
                                        variant={"link"}
                                        className="font-thin"
                                        onClick={() => {
                                            setLimit((old) => old + 4);
                                        }}
                                    >
                                        Find more
                                    </Button>
                                </div>
                            </ScrollArea>
                        ) : (
                            <p className="flex justify-center text-sm my-5">No task found</p>
                        )}
                    </div>
                </PopoverContent>
                {!Object.is(selected, null) && (
                    <p className="col-start-2 col-span-3 ml-1 text-sm">
                        {Object.is(selected?.projects, null)
                            ? "This task has no project"
                            : `Project: ${selected?.projects?.name}`}
                    </p>
                )}
            </Popover>
        </>
    );
};

interface ParentTask {
    id: number;
    title: string;
    projects: null | { id?: number, name?: string };
}

interface CommandProps {
    eventDispatch: (id: number | null, project: null | number) => void;
    style?: { width?: string; content?: string };
}

export { ServerCommand };
