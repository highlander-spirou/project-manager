/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";
import {
    useQuery,
    keepPreviousData,
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";
import supabase from "./supabase";

type SortKey = {
    column: "priority" | "status" | "created_at";
    order: "asc" | "desc" | null;
};

const fetcher = async (page: number, limit: number, sort: SortKey[]) => {
    const apiCall = supabase.rpc("get_date_diff", { days: 20 });


    // .order("priority", { ascending: false })
    // .order("date_diff", { ascending: true })
    // .range((page - 1) * limit, (page - 1) * limit + limit - 1);
    // .from("project-list")
    // .select()

    sort.forEach((crit) => {
        if (crit.order !== null) {
            apiCall.order(crit.column, { ascending: crit.order === "asc" });
        }
    });

    const { data } = await apiCall.range((page - 1) * limit, (page - 1) * limit + limit - 1);
    // const { data } = await apiCall;
    return data;
};

type Obj = {
    id: number;
    value: object;
};

const updater = async (obj: Obj) => {
    const { error } = await supabase
        .from("project-list")
        .update(obj.value)
        .eq("id", obj.id);

    if (error) {
        throw error;
    }
    return;
};

const ContextProvider = createContext<TableCtxInterface | null>(null);

interface TableCtxInterface {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    sort: SortKey[];
    changeSorting: (key: "priority" | "status" | "created_at", sortDirection: "asc" | "desc" | null) => void
    // setSorter: React.Dispatch<React.SetStateAction<SortKey[]>>;
    data: any;
    isLoading: boolean;
    error: Error | null;
    mutation: UseMutationResult<void, Error, Obj, unknown>;
    isFetching: boolean;
}

const TableCtx = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sort, setSorter] = useState<SortKey[]>([
        { column: "priority", order: "desc" },
        { column: "status", order: "desc" },
        { column: "created_at", order: "asc" },
    ]);

    const queryClient = useQueryClient();

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["projects", page, limit, sort],
        queryFn: () => fetcher(page, limit, sort),
        staleTime: 60 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const changeSorting = (
        key: "priority" | "status" | "created_at",
        sortDirection: "asc" | "desc" | null
    ) => {
        // In normal condition, sorting will be sort by created_date
        // Since these values are uniquely identified,
        // it is nonesense to combined with any filter criteria

        // To change sorting to criteria sort
        // We must first sort by criteria first, then proceed to sort by created_date

        setSorter((oldArr) => {
            return oldArr.map(item => {
                if (item.column === key) {
                    return { ...item, order: sortDirection };
                } else {
                    return item
                }
            })
        })
    };

    const mutation = useMutation({
        mutationFn: updater,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    return {
        page,
        setPage,
        limit,
        setLimit,
        sort,
        changeSorting,
        data,
        isLoading,
        error,
        mutation,
        isFetching
    };
};

export { TableCtx, ContextProvider };
