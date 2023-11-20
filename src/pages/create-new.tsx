import { DialogCtx, DialogContextProvider } from "../contexts/dialog"
import CreateTask from "../components/dialogs/create-task"
import CreateProject from "../components/dialogs/create-project"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Undo2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
const CreateNew = () => {

  const dialogCtx = DialogCtx()
  return (
    <>
      <DialogContextProvider.Provider value={dialogCtx}>
        <Button variant={'link'}>
          <Undo2Icon className="mr-1 w-5 h-5" />
          Go back
        </Button>


        <div className="flex justify-center mt-20">
          <Tabs defaultValue="task" className="w-[450px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="task">New Task</TabsTrigger>
              <TabsTrigger value="project">New Project</TabsTrigger>
            </TabsList>
            <TabsContent value="task">
              <CreateTask />
            </TabsContent>
            <TabsContent value="project">
              <CreateProject />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={dialogCtx.dialogOpen} onOpenChange={dialogCtx.setDialogOpen}>
          <DialogContent>
            <div className="m-5">
              <CreateProject />
            </div>
          </DialogContent>
        </Dialog>

      </DialogContextProvider.Provider>
    </>
  )
}

export default CreateNew