import { useEffect } from 'react';
import { DataTable } from './components/data-table'
import { TableCtx, ContextProvider } from './ctx'
import { Loader2 } from "lucide-react"
import { CheckIcon } from '@radix-ui/react-icons'

const App = () => {

  const ctx = TableCtx()

  useEffect(() => {
    console.log('isLoading', ctx.isLoading)
    console.log('data', ctx.data)
    console.log('sort', ctx.sort)
    console.log('fetching', ctx.isFetching)
  }, [ctx])

  if (ctx.isLoading) {
    return <p className='flex justify-center items-center text-5xl font-bold'>Fetching data ...</p>
  }

  if (ctx.data) {
    return (
      <>
        <ContextProvider.Provider value={ctx}>
          <div className="container mx-auto py-10">
            {ctx.isFetching ? (<>
              <Loader2 className="h-4 w-4 animate-spin" />
            </>) : (<>
              <CheckIcon />
            </>)}
            <DataTable />
          </div>
        </ContextProvider.Provider>
      </>
    )
  }
  if (!ctx.data || ctx.error) {
    return (<div>Error occur</div>)
  }
}

export default App