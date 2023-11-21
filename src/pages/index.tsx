import supabase from "@/supabase";
import { useEffect } from "react";
import { useLoaderData, type Params, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { getPriorityBadge, getPriorityLabel } from "@/enums";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { Link } from "react-router-dom";

// import { useRevalidator } from "react-router-dom";



interface Task {
  id: string;
  title: string;
  priority: number;
  deadline: string;
  updated_at: string;
  is_active: boolean;
  parent_id: number | null;
  parent_task_name: string | null;
  project_name: string | null;
}

export const fetcher = async (id: string | undefined): Promise<Task> => {
  const { data, error } = await supabase
    .rpc("get_task_details", { task_id: id })
    .single();
  if (error) {
    console.log(error)
  }
  return data as Task;
  // if (id) {
  //   console.log('activate me')
  //   const data: Task = {
  //     id: id,
  //     // title: "This is a very very very very long title that can cause overflow",
  //     title: "This is a title",
  //     parent_id: 1,
  //     priority: 0,
  //     deadline: "2023-11-21",
  //     parent_task_name: "parent task",
  //     project_name: "Project 1",
  //     update_at: "2023-11-21 06:28:38.097395+00"
  //   }
  //   return data
  // }
};

// ⬇️ define your query
const contactDetailQuery = (id: string | undefined) => ({
  queryKey: ['contacts', id],
  queryFn: async () => fetcher(id),
  staleTime: 1000 * 60,
})

// ⬇️ needs access to queryClient
export const loader = (queryClient: QueryClient) =>
  async ({ params }: { params: Params }) => {
    const query = contactDetailQuery(params.id)
    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }


// export const mutation = () => {
//   async ({ request, params }) => {
//     const formData = await request.formData()
//     const updates = Object.fromEntries(formData)
//     await updateContact(params.contactId, updates)
//     await queryClient.invalidateQueries({ queryKey: ['contacts'] })
//     return redirect(`/contacts/${params.contactId}`)
//   }
// }

const App = () => {
  const params = useParams()
  const { data: task } = useQuery(contactDetailQuery(params.id))
  // const revalidator = useRevalidator();

  const queryClient = useQueryClient()

  useEffect(() => {
    console.log("task", task);
  }, [task]);


  const activateTask = async () => {
    console.log('revalidating')
    // revalidator.revalidate()
    const { error } = await supabase.from('task-list').update({ is_active: !task?.is_active}).eq('id', task?.id)
    if (error) {
      console.log('error')
      console.log(error)
    } else {
      console.log('success')
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  }

  if (task) {
    return (
      <>
        <div className="flex justify-center mt-10">
          <Card className="w-[400px] aspect-video">
            <CardHeader>
              <div className="grid grid-cols-[auto_50px]">
                <div>
                  <CardTitle className="">
                    <a href="" className="max-h-[62px] h-full py-1 leading-7 line-clamp-2 hover:underline underline-offset-4">{task.title}</a>
                  </CardTitle>
                  <div className="mt-3">
                    <Badge variant={getPriorityBadge(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={activateTask}
                  className="justify-self-end self-center w-[45px] aspect-square rounded-full bg-red-500 hover:bg-red-600 flex justify-center items-center pl-1">
                  <PlayIcon className="stroke-white fill-white" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                {task.parent_task_name && (
                  <Button variant={"link"} className="w-fit">
                    {task.parent_task_name}
                  </Button>
                )}
                {task.project_name && (
                  <Button variant={"link"} className="w-fit">
                    {task.project_name}
                  </Button>
                )}
                <div>{task.updated_at}</div>
                <div>{task.is_active ? "Active" : "Not active"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <div>hello world</div>
      <a href=""></a>
      <Link to={"/" + "1685"}>a</Link>
      <Link to={"/" + "1686"}>b</Link> */}
      </>
    )
  }

};

export default App;
