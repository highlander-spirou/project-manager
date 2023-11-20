import { useEffect, useState } from "react";
import moment from "moment";
import supabase from "@/supabase";
import { useDebounce } from "@/hooks/useDebounce";

import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useQueryClient } from "@tanstack/react-query";
const fetcher = async (name: string) => {
    const { data } = await supabase
        .from("projects")
        .select("id")
        .eq("name", name);
    return data;
};

type Status = "success" | "error" | "pending"


const CreateProject = () => {
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState<undefined | Date>(undefined);
    const [status, setStatus] = useState<Status>("pending");
    const [calenderOpen, setCalenderOpen] = useState(false);
    const debounceValue = useDebounce(name, 500);
    const queryClient = useQueryClient()
    const { toast } = useToast()

    useEffect(() => {
        if (debounceValue === "") {
            setStatus("pending");
        } else {
            fetcher(debounceValue).then((val) => {
                if (val === null || val?.length > 0) {
                    setStatus("error");
                } else {
                    setStatus("success");
                }
            });
        }
    }, [debounceValue]);


    const clearState = () => {
        setName("")
        setDeadline(undefined)
        setStatus("pending")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { error } = await supabase
            .from("projects")
            .insert({ name, deadline: deadline === undefined ? null : deadline });
        if (error) {
            toast({
                description: <p className="flex justify-center items-center gap-5">
                    <XCircleIcon className="stroke-red-600" />
                    <span className="font-semibold">
                        Error create new project
                    </span>
                </p>
            })
        } else {
            toast({
                description: (<p className="flex justify-center items-center gap-5">
                    <CheckCircle2Icon className="stroke-green-600" />
                    <span className="font-semibold">
                        Successfully create new project
                    </span>
                </p>)
            })
            clearState()
            queryClient.invalidateQueries({ queryKey: ['fetch-projects'] })
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-center">Create new task</CardTitle>
                </CardHeader>
                <form onSubmit={e => handleSubmit(e)}>
                    <CardContent className="grid gap-4 py-4 space-y-2">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="title"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                            />
                            {status === "error" && (
                                <div className="col-start-2 col-span-4 text-sm text-red-700">
                                    Duplicated project name
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Deadline</Label>
                            <Popover open={calenderOpen} onOpenChange={setCalenderOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "col-span-3 font-normal",
                                            deadline === null && "text-muted-foreground"
                                        )}
                                    >
                                        {deadline ? (
                                            <span>{moment(deadline).format("DD/MM/YYYY")}</span>
                                        ) : (
                                            <span>Pick a deadline date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        variant="default"
                                        selected={deadline}
                                        onSelect={(e) => {
                                            setDeadline(e);
                                            setCalenderOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={status !== "success"}
                        >
                            Create
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default CreateProject
