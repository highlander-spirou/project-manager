import { useState } from "react";
import moment from "moment";
import { priorities, getPriorityLabel } from "@/enums";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CalendarIcon,
    LibraryIcon,
    FileUpIcon,
    CircleDashedIcon,
    XCircleIcon,
    CheckCircle2Icon
} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast";

import { ServerCommand as ComboBoxTask } from "./combo-box-parent-task";
import { ComboBox as ComboBoxProject } from "./combo-box-project";
import supabase from "@/supabase";

interface FormDataType {
    title: string,
    project: null | number,
    deadline: undefined | Date,
    parent_task: null | number,
}

const CreateTask = () => {
    const [extraPanel, setExtraPanel] = useState<
        "project" | "parent_task" | "projectless"
    >("projectless");
    const [calenderOpen, setCalenderOpen] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
        title: "",
        project: null,
        deadline: undefined,
        parent_task: null,
    });
    const { toast } = useToast()

    const handleChange = (id: string, value: string | Date | number | null) => {
        setFormData((oldValue) => {
            return {
                ...oldValue,
                [id]: value,
            };
        });
    };

    const clearFormField = () => {
        setFormData({
            title: "",
            deadline: undefined,
            project: null,
            parent_task: null,
        });
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        const { error } = await supabase.from("task-list").insert(formData);
        if (error) {
            toast({
                description: <p className="flex justify-center items-center gap-5">
                    <XCircleIcon className="stroke-red-600" />
                    <span className="font-semibold">
                        Error create new project
                    </span>
                </p>,
                duration: 3000,
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
            clearFormField()
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-center">Create new task</CardTitle>
            </CardHeader>
            <form onSubmit={(e) => handleSubmit(e)}>
                <CardContent className="grid gap-4 py-4 space-y-2">
                    {/* Title */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    {/* Priority */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Priority</Label>
                        <Select onValueChange={(e) => handleChange("priority", Number(e))}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(priorities).map((el) => {
                                    return (
                                        <SelectItem key={el[0]} value={String(el[1])}>
                                            {getPriorityLabel(el[1])}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Deadline */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Deadline</Label>
                        <Popover open={calenderOpen} onOpenChange={setCalenderOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "col-span-3 font-normal",
                                        formData.deadline === null && "text-muted-foreground"
                                    )}
                                >
                                    {formData.deadline ? (
                                        <span>{moment(formData.deadline).format("DD/MM/YYYY")}</span>
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.deadline}
                                    variant="default"
                                    onSelect={(e) => {
                                        handleChange("deadline", e!);
                                        setCalenderOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Button group */}
                    <div className="flex justify-center ">
                        <div className="inline-flex rounded-full shadow-sm" role="group">
                            <button
                                type="button"
                                onClick={() => { setExtraPanel("project") }}
                                className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-900 hover:text-blue-700 hover:bg-gray-100 border border-gray-200 rounded-s-full focus:ring-[1px] focus:ring-blue-700 focus:text-blue-700 ${extraPanel === "project" ? "text-blue-700" : ""}`}
                            >
                                <LibraryIcon className="w-4 h-4" />
                                Project
                            </button>
                            <button
                                type="button"
                                onClick={() => { setExtraPanel("parent_task") }}
                                className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-900 border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-[1px] focus:ring-blue-700 focus:text-blue-700 ${extraPanel === "parent_task" ? "text-blue-700" : ""}`}
                            >
                                <FileUpIcon className="w-4 h-4" />
                                Parent task
                            </button>
                            <button
                                type="button"
                                onClick={() => { setExtraPanel("projectless") }}
                                className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-e-full hover:bg-gray-100 hover:text-blue-700 focus:ring-[1px] focus:ring-blue-700 focus:text-blue-700 ${extraPanel === "projectless" ? "text-blue-700" : ""}`}
                            >
                                <CircleDashedIcon className="w-4 h-4" />
                                Projectless
                            </button>
                        </div>
                    </div>
                    {extraPanel === "project" ? (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <ComboBoxProject state={formData.project} handleChange={handleChange} />
                            </div>
                        </>
                    ) : extraPanel === "parent_task" && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <ComboBoxTask
                                    eventDispatch={(id, project) => {
                                        handleChange('parent_task', id)
                                        handleChange('project', project)
                                    }}
                                    style={{ width: 'w-full col-span-3', content: 'w-[250px]' }}
                                />
                            </div>
                        </>
                    )}
                </CardContent >
                <CardFooter className="flex justify-end">
                    <Button type="submit">Save changes</Button>
                </CardFooter>
            </form >
        </Card >
    );
};

export default CreateTask;
