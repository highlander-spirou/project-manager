import { useState, FC, useContext } from 'react'
import supabase from '@/supabase'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DialogContextProvider } from '@/contexts/dialog'

import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Check, RotateCcwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from "@/components/ui/scroll-area"


interface ComboBoxProps {
    state: number | null
    handleChange: (id: string, value: string | Date | number | null) => void
}


const fetcher = async () => {
    const { data } = await supabase.from('projects')
        .select('id, name')
        .order('created_at', { ascending: false })

    return data
};

const ComboBox: FC<ComboBoxProps> = ({ state, handleChange }) => {
    const [openProjectSelection, setOpenProject] = useState(false)
    const dialogCtx = useContext(DialogContextProvider)


    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ["fetch-projects"],
        queryFn: () => fetcher(),
    });


    const refreshProjects = () => {
        queryClient.invalidateQueries({queryKey: ['fetch-projects']})
    }

    return (
        <>
            <Label className="text-right">
                Project
            </Label>
            <Popover open={openProjectSelection} onOpenChange={setOpenProject}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "col-span-3 font-normal",
                            state === null && "text-muted-foreground"
                        )}
                    >
                        {state ? (
                            <span className='max-w-[300px] overflow-hidden text-ellipsis'>
                                {data?.filter(x => x.id === state)[0].name}
                            </span>
                        ) : (
                            <span>Search project</span>
                        )}
                        <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[500px]">
                    <Command>
                        <CommandInput placeholder="Search project" />
                        <div className='grid grid-cols-[auto_50px] gap-1'>
                            <Button variant={'link'} onClick={dialogCtx?.openProject}>
                                Create project
                            </Button>
                            <Button variant={'ghost'} onClick={refreshProjects}>
                                <RotateCcwIcon />
                            </Button>
                        </div>
                        <CommandEmpty><span className='font-semibold'>Project not found</span></CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-[200px] overflow-y-auto">
                                {data?.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        className='h-11'
                                        onSelect={() => {
                                            if (state !== item.id) {
                                                handleChange("project", item.id)
                                            } else {
                                                handleChange("project", null)
                                            }
                                            setOpenProject(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                state === item.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item.name}
                                    </CommandItem>
                                ))}
                            </ScrollArea>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}

export { ComboBox }