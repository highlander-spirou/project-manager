import { createContext, useState } from "react";

interface DialogContextInterface {
    dialogOpen: boolean
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    openProject: () => void
}

const DialogContextProvider = createContext<DialogContextInterface | null>(null);

const DialogCtx = () => {
    const [dialogOpen, setDialogOpen] = useState(false);


    const openProject = () => {
        setDialogOpen(true)
    }



    return {
        dialogOpen,
        setDialogOpen,
        openProject,
    };
};

export { DialogCtx, DialogContextProvider };
