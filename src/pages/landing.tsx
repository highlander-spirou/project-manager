/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getPriorityBadge, getPriorityLabel } from "@/enums";
import supabase from "@/supabase";
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react";


const fetcher = async () => {
    const { data } = await supabase.from('task-list')
        .select('id, title, priority, deadline, projects (name) ')
        .order('update_at', { ascending: false })
        .limit(5)
    
    return data
};

const App = () => {

    const { data } = useQuery({
        queryKey: ["fetch-recent-task"],
        queryFn: () => fetcher(),
    });

    const [latestTask, setLatestTask] = useState(null)

    // const latestTask = () => {
    //     return data ? data[0] : null
    // }

    useEffect(() => {
        const fetchTaskDetail = async () => {
            if(data) {
                const { data: latest } = await supabase.rpc('get_task_details', {'task_id': data[0].id})
                console.log('latest', latest)
            }
        }
        fetchTaskDetail()
    
    }, [data])
    

    return (
        <>
            <div className="container">

                <div>Welcome back, Shyn 😍</div>
                <p>Pick up where you left</p>
                {latestTask && (<>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>{latestTask()?.title}</CardTitle>
                            <CardDescription className="flex gap-1">
                                <Badge variant={getPriorityBadge(latestTask?.priority)}>
                                    {getPriorityLabel(latestTask?.priority)}
                                </Badge>
                            </CardDescription>

                        </CardHeader>
                        <CardContent>
                            <Button variant={"link"}>{ latestTask?.projects.name }</Button>
                            <Button variant={"link"}>{ latestTask?.parent_task }</Button>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                        </CardFooter>
                    </Card>
                </>
                )
                }
            </div>
        </>
    )
}

export default App