import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";


import { ContextProvider } from "../ctx";
import { FC, useContext } from "react";

interface ColumnHeaderProps {
    column: "priority" | "status" | "created_at";
    title: string
}

export const DataTableColumnHeader: FC<ColumnHeaderProps> = ({ column, title }) => {

    const ctx = useContext(ContextProvider);

    const getSortedDirection = () => {
        const findKeyInSortArray = ctx?.sort.filter((x) => x.column === column);
        if (findKeyInSortArray?.length! > 0) {
            return findKeyInSortArray![0].order;
        } else {
            return null;
        }
    };

    const handleChangeSort = () => {
        if (getSortedDirection() === "asc") {
            return ctx?.changeSorting(column, "desc")

        } else if (getSortedDirection() === "desc") {
            return ctx?.changeSorting(column, null)
        } else {
            ctx?.changeSorting(column, "asc")

        }
    }

    return (
        <div className={"flex items-center space-x-2"}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => handleChangeSort()}
            >
                <span>{title}</span>
                {getSortedDirection() !== null ? (
                    getSortedDirection() === "asc" ? (
                        <ArrowUpIcon className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDownIcon className="ml-2 h-4 w-4" />
                    )
                ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
            </Button>

        </div>
    );
}


