"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

type TanStackProviderProps = {
	children: React.ReactNode
}

const queryClient = new QueryClient()

const TanStackProvider = ({ children }: TanStackProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
}

export default TanStackProvider
