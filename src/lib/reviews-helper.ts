import { supabase } from './supabase-client';

export async function getAverageRating(professionalId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('professional_id', professionalId);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
    return Math.round(average * 10) / 10;
  } catch (err) {
    console.error('Error calculating average rating:', err);
    return 0;
  }
}

export async function getReviewCount(professionalId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error('Error getting review count:', err);
    return 0;
  }
}
