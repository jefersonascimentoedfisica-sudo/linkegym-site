import { db } from './db'
import * as schema from './schema'
import { eq, sql } from 'drizzle-orm'

export async function getAverageRating(professionalId: string): Promise<number> {
  try {
    const rows = await db
      .select({ rating: schema.reviews.rating })
      .from(schema.reviews)
      .where(eq(schema.reviews.professionalId, professionalId))

    if (!rows || rows.length === 0) return 0

    const average = rows.reduce((sum, review) => sum + (review.rating || 0), 0) / rows.length
    return Math.round(average * 10) / 10
  } catch (err) {
    console.error('Error calculating average rating:', err)
    return 0
  }
}

export async function getReviewCount(professionalId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.reviews)
      .where(eq(schema.reviews.professionalId, professionalId))
    return Number(result?.[0]?.count) || 0
  } catch (err) {
    console.error('Error getting review count:', err)
    return 0
  }
}
