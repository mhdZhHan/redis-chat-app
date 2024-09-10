import { useRef, useState } from "react"
import { ImageIcon, Loader, SendHorizonal, ThumbsUp } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import useSound from "use-sound"

import { Textarea } from "../ui/textarea"
import EmojiPicker from "./EmojiPicker"
import { Button } from "../ui/button"

import { usePreferences } from "@/store/usePreferences"
import { useMutation } from "@tanstack/react-query"
import { sendMessageAction } from "@/app/actions/message.action"
import { useSelectedUser } from "@/store/useSelectedUser"

const ChatBottomBar = () => {
	const [message, setMessage] = useState("")
	const messageRef = useRef<HTMLTextAreaElement | null>(null)

	const { soundEnabled } = usePreferences()
	const { selectedUser } = useSelectedUser()

	const [playSound1] = useSound("/sounds/keystroke1.mp3")
	const [playSound2] = useSound("/sounds/keystroke2.mp3")
	const [playSound3] = useSound("/sounds/keystroke3.mp3")
	const [playSound4] = useSound("/sounds/keystroke4.mp3")

	const keyStrokeSoundsList = [playSound1, playSound2, playSound3, playSound4]

	const playRandomKeyStrokeSound = () => {
		const randomSound = Math.floor(
			Math.random() * keyStrokeSoundsList.length
		)

		soundEnabled && keyStrokeSoundsList[randomSound]()
	}

	const handleKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (evt.key === "Enter" && !evt.shiftKey) {
			evt.preventDefault()
			handleSendMessage()
		}

		if (evt.key === "Enter" && evt.shiftKey) {
			evt.preventDefault()
			setMessage(message + "\n")
		}
	}

	const handleSendMessage = () => {
		if (!message.trim()) return

		sendMessage({
			content: message,
			messageType: "text",
			receiverId: selectedUser?.id!,
		})

		setMessage("")
		messageRef.current?.focus()
	}

	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: sendMessageAction,
	})

	return (
		<div className="p-2 flex justify-between w-full items-center gap-2">
			{!message.trim() && (
				<ImageIcon
					className="cursor-pointer text-muted-foreground"
					size={20}
				/>
			)}

			<AnimatePresence>
				<motion.div
					layout
					initial={{ opacity: 0, scale: 1 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 1 }}
					transition={{
						opacity: { duration: 0.5 },
						layout: { type: "spring", bounce: 0.15 },
					}}
					className="w-full relative"
				>
					<Textarea
						ref={messageRef}
						className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background min-h-0"
						autoComplete="off"
						rows={1}
						placeholder="Aa"
						value={message}
						onKeyDown={handleKeyDown}
						onChange={(evt) => {
							setMessage(evt.target.value)
							playRandomKeyStrokeSound()
						}}
					/>
					<div className="absolute right-2 bottom-0.5">
						<EmojiPicker
							onChange={(emoji) => {
								setMessage((prev) => prev + emoji)
								if (messageRef.current) {
									messageRef.current.focus()
								}
							}}
						/>
					</div>
				</motion.div>

				{message.trim() ? (
					<Button
						className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
						variant={"ghost"}
						size={"icon"}
						onClick={handleSendMessage}
					>
						<SendHorizonal
							size={20}
							className="text-muted-foreground"
						/>
					</Button>
				) : (
					<Button
						className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
						variant={"ghost"}
						size={"icon"}
					>
						{!isPending ? (
							<ThumbsUp
								size={20}
								className="text-muted-foreground"
								onClick={() =>
									sendMessage({
										content: "👍",
										messageType: "text",
										receiverId: selectedUser?.id!,
									})
								}
							/>
						) : (
							<Loader
								size={20}
								className="text-muted-foreground animate-spin"
							/>
						)}
					</Button>
				)}
			</AnimatePresence>
		</div>
	)
}
export default ChatBottomBar
