import { FC } from "react"
// import * as ProgressBar from '@radix-ui/react-progress';
import { Progress as ProgressBar } from "./ui/progress";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";

interface ProgressProps {
    tracking: number
}

const Progress: FC<ProgressProps> = ({ tracking }) => {
    return (
        <>
            <Popover>
                <PopoverTrigger className="w-[70px]">
                    <ProgressBar
                        className="h-1"
                        value={(tracking / 4) * 100} />
                </PopoverTrigger>
                <PopoverContent>
                    <p className="font-semibold text-lg">{`${Math.round((tracking / 4) * 100)}%`}</p>
                    <p className="mt-3">{tracking} / 4 minutes</p>
                    <ProgressBar
                        className="h-1 w-3/4 mt-3"
                        value={(tracking / 4) * 100} />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"destructive"} className="mt-3">Start project</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                hello world
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default Progress