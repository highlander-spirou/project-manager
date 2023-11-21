import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateNew from './pages/create-new'
import App, { fetcher as AppFetcher, loader as AsyncAppLoader} from './pages';
import './index.css'
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/:id",
    element: <App />,
    loader: AsyncAppLoader(queryClient)
  },
  {
    path: "/create",
    element: <CreateNew />,
  },
]);



const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster />
  </QueryClientProvider>
)
