import { supabase } from './supabase-client';

export interface Consultation {
  id: string;
  nutritionist_id: string;
  client_name: string;
  client_email: string;
  notes?: string;
  price: number;
  status: 'paid' | 'scheduled' | 'completed' | 'cancelled';
  payment_id?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionistProfile {
  id: string;
  name: string;
  consultation_price: number;
  service_type: 'presencial' | 'online' | 'ambos';
  service_regions?: string[];
  whatsapp?: string;
  email?: string;
}

/**
 * Create a new consultation
 */
export async function createConsultation(
  nutritionistId: string,
  clientName: string,
  clientEmail: string,
  price: number,
  notes?: string,
  paymentId?: string
): Promise<Consultation | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .insert([
        {
          nutritionist_id: nutritionistId,
          client_name: clientName,
          client_email: clientEmail,
          price,
          notes: notes || null,
          payment_id: paymentId || null,
          status: 'paid',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating consultation:', err);
    return null;
  }
}

/**
 * Get consultation by ID
 */
export async function getConsultationById(consultationId: string): Promise<Consultation | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', consultationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (err) {
    console.error('Error fetching consultation:', err);
    return null;
  }
}

/**
 * Get consultations by nutritionist ID
 */
export async function getConsultationsByNutritionistId(
  nutritionistId: string
): Promise<Consultation[]> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('nutritionist_id', nutritionistId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching consultations:', err);
    return [];
  }
}

/**
 * Update consultation status
 */
export async function updateConsultationStatus(
  consultationId: string,
  status: 'paid' | 'scheduled' | 'completed' | 'cancelled'
): Promise<Consultation | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', consultationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating consultation status:', err);
    return null;
  }
}

/**
 * Schedule consultation
 */
export async function scheduleConsultation(
  consultationId: string,
  date: string,
  time: string
): Promise<Consultation | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .update({
        scheduled_date: date,
        scheduled_time: time,
        status: 'scheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', consultationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error scheduling consultation:', err);
    return null;
  }
}

/**
 * Get nutritionist profile
 */
export async function getNutritionistProfile(
  nutritionistId: string
): Promise<NutritionistProfile | null> {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select(
        'id, name, consultation_price, service_type, service_regions, whatsapp, email'
      )
      .eq('id', nutritionistId)
      .eq('professional_type', 'nutritionist')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (data && data.service_regions) {
      return {
        ...data,
        service_regions: JSON.parse(data.service_regions),
      };
    }
    
    return data || null;
  } catch (err) {
    console.error('Error fetching nutritionist profile:', err);
    return null;
  }
}

/**
 * Update nutritionist consultation settings
 */
export async function updateNutritionistSettings(
  nutritionistId: string,
  consultationPrice: number,
  serviceType: 'presencial' | 'online' | 'ambos',
  serviceRegions?: string[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('professionals')
      .update({
        consultation_price: consultationPrice,
        service_type: serviceType,
        service_regions: serviceRegions ? JSON.stringify(serviceRegions) : null,
      })
      .eq('id', nutritionistId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating nutritionist settings:', err);
    return false;
  }
}

/**
 * Format consultation price
 */
export function formatConsultationPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Get service type label
 */
export function getServiceTypeLabel(serviceType: string): string {
  switch (serviceType) {
    case 'presencial':
      return '📍 Presencial';
    case 'online':
      return '💻 Online';
    case 'ambos':
      return '📍 Presencial + 💻 Online';
    default:
      return serviceType;
  }
}
