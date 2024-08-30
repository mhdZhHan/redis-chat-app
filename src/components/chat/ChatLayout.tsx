"use client"

import { useEffect, useState } from "react"
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../ui/resizable"
import { cn } from "@/lib/utils"
import Sidebar from "./Sidebar"
import MessageContainer from "./MessageContainer"

type ChatLayoutProps = {
	defaultLayout: number[] | undefined
}

const ChatLayout = ({ defaultLayout = [320, 480] }: ChatLayoutProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkScreenWidth = () => {
			setIsMobile(window.innerWidth <= 768)
		}

		// initial check
		checkScreenWidth()

		// evt listener for screen with change
		window.addEventListener("resize", checkScreenWidth)

		// cleanup the event listener on unmount
		return () => {
			window.removeEventListener("resize", checkScreenWidth)
		}
	}, [])

	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="h-full items-stretch bg-background rounded-lg"
			onLayout={(sizes: number[]) => {
				document.cookie = `react-resizable-panels:layout=${JSON.stringify(
					sizes
				)}`
			}}
		>
			<ResizablePanel
				defaultSize={defaultLayout[0]}
				collapsedSize={8}
				collapsible={true}
				minSize={isMobile ? 0 : 24}
				maxSize={isMobile ? 8 : 30}
				onCollapse={() => {
					setIsCollapsed(true)
					document.cookie = `react-resizable-panels:collapsed=true`
				}}
				onExpand={() => {
					setIsCollapsed(false)
					document.cookie = `react-resizable-panels:collapsed=true`
				}}
				className={cn(
					isCollapsed &&
						"min-w-[88px] transition-all duration-300 ease-in-out"
				)}
			>
				<Sidebar isCollapsed={isCollapsed} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel>
				{/* <div className="flex justify-center items-center h-full w-full px-10">
					<div className="flex flex-col justify-center items-center gap-4">
						<img
							src="/logo.png"
							alt="Logo"
							className="w-full md:w-2/3 lg:w-1/2"
						/>
						<p className="text-muted-foreground text-center">
							Click on a chat to view the messages
						</p>
					</div>
				</div> */}

				<MessageContainer />
			</ResizablePanel>
		</ResizablePanelGroup>
	)
}
export default ChatLayout