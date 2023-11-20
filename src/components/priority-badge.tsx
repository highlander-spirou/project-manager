/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from "./ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPriorityLabel, getPriorityBadge, priorities } from "../enums";
import { useContext } from "react";
import { ContextProvider } from '../ctx'
export const PriorityBadge = ({ priority, rowID }: { priority: number, rowID: number }) => {

    const ctx = useContext(ContextProvider)

    const handleClick = (e: number) => {
        const updateData = {id: rowID, value: {priority: e}}
        ctx?.mutation.mutate(updateData)
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Badge variant={getPriorityBadge(priority)}>
                        {getPriorityLabel(priority)}
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={String(priority)}>
                        {Object.entries(priorities).map(([k, v]) => {
                            return (
                                <DropdownMenuRadioItem
                                    key={k}
                                    value={String(v)}
                                    onClick={() => handleClick(v)}
                                >
                                    {k}
                                </DropdownMenuRadioItem>
                            );
                        })}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};