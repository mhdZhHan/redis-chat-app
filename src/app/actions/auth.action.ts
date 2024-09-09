"use server"

import { redis } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function checkAuthStatus() {
	const { getUser } = getKindeServerSession()

	const user = await getUser()

	if (!user) return { success: false }

	// namespaces are really important to understand in redis

	const userId = `user:${user.id}`

	const existingUser = await redis.hgetall(userId)

	// sign up
	if (!existingUser || Object.keys(existingUser).length === 0) {
		const isImgNull = user.picture?.includes("gravatar")
		const image = isImgNull ? "" : user.picture

		await redis.hset(userId, {
			id: userId,
			email: user.email,
			name: `${user.given_name} ${user.family_name}`,
			image: image,
		})
	}

	return { success: true }
}
