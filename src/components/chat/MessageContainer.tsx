import { useEffect } from "react"
import ChatBottomBar from "./ChatBottomBar"
import ChatTopBar from "./ChatTopBar"
import MessageList from "./MessageList"
import { useSelectedUser } from "@/store/useSelectedUser"

const MessageContainer = () => {
	const { setSelectedUser } = useSelectedUser()

	useEffect(() => {
		const handleEscape = (evt: KeyboardEvent) => {
			if (evt.key === "Escape") setSelectedUser(null)
		}

		document.addEventListener("keydown", handleEscape)

		return () => document.removeEventListener("keydown", handleEscape)
	}, [])
	return (
		<div className="flex flex-col justify-between w-full h-full">
			<ChatTopBar />

			<div className="flex overflow-y-auto overflow-x-hidden h-full w-full flex-col">
				<MessageList />
				<ChatBottomBar />
			</div>
		</div>
	)
}
export default MessageContainer
