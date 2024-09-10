"use server"

import { redis } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

type SendMessageActionArgs = {
	content: string
	receiverId: string
	messageType: "text" | "image"
}

export async function sendMessageAction({
	content,
	receiverId,
	messageType,
}: SendMessageActionArgs) {
	const { getUser } = getKindeServerSession()
	const user = await getUser()

	if (!user) return { success: false, message: "User not authenticated" }

	const senderId = user.id
	const conversationId = `conversation:${[senderId, receiverId]
		.sort()
		.join(":")}`

	const isConversationExists = await redis.exists(conversationId)

	if (!isConversationExists) {
		await redis.hset(conversationId, {
			participant1: senderId,
			participant2: receiverId,
		})

		await redis.sadd(`user:${senderId}:conversation`, conversationId)
		await redis.sadd(`user:${receiverId}:conversation`, conversationId)
	}

	// creating a unique id
	const messageId = `message:${Date.now()}${Math.random()
		.toString(36)
		.substring(2, 9)}`
	const timestamp = Date.now()

	// create the message
	await redis.hset(messageId, {
		senderId,
		content,
		timestamp,
		messageType,
	})

	await redis.zadd(`${conversationId}:messages`, {
		score: timestamp,
		member: JSON.stringify(messageId),
	})

	return { success: true, conversationId, messageId }
}
