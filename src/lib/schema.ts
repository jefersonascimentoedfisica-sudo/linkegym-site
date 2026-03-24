import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  serial,
  date,
  time,
} from 'drizzle-orm/pg-core'

// ============================================
// USERS TABLE (better-auth compatible: id is text)
// ============================================
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  userType: text('user_type').default('student'),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// BETTER-AUTH REQUIRED TABLES
// ============================================
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull(),
})

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// ============================================
// NEIGHBORHOODS TABLE
// ============================================
export const neighborhoods = pgTable('neighborhoods', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  city: text('city').default('Guarulhos'),
  state: text('state').default('SP'),
})

// ============================================
// PROFESSIONALS TABLE
// ============================================
export const professionals = pgTable('professionals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  professionalType: text('professional_type').notNull(),
  bio: text('bio'),
  specialties: text('specialties').array(),
  yearsOfExperience: integer('years_of_experience'),
  yearsExperience: integer('years_experience'),
  registrationNumber: text('registration_number'),
  registrationState: text('registration_state'),
  isVerified: boolean('is_verified').default(false),
  verified: boolean('verified').default(false),
  whatsapp: text('whatsapp'),
  instagram: text('instagram'),
  pricePerSession: decimal('price_per_session', { precision: 10, scale: 2 }),
  lessonPrice: decimal('lesson_price', { precision: 10, scale: 2 }),
  consultationPrice: decimal('consultation_price', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  serviceModality: text('service_modality'),
  serviceType: text('service_type'),
  serviceRegions: text('service_regions'),
  residenceNeighborhood: text('residence_neighborhood'),
  serviceNeighborhoods: text('service_neighborhoods').array(),
  planType: text('plan_type').default('basic'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  email: text('email'),
  name: text('name'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// SERVICE AREAS TABLE
// ============================================
export const serviceAreas = pgTable('service_areas', {
  id: serial('id').primaryKey(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  neighborhoodId: integer('neighborhood_id').references(() => neighborhoods.id),
  neighborhood: text('neighborhood'),
  priority: integer('priority'),
  serviceType: text('service_type').default('both'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============================================
// SERVICES TABLE
// ============================================
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  durationMinutes: integer('duration_minutes'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  serviceType: text('service_type').default('presencial'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============================================
// AVAILABILITY TABLE
// ============================================
export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week'),
  startTime: text('start_time'),
  endTime: text('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============================================
// BOOKINGS TABLE
// ============================================
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  studentId: text('student_id').references(() => users.id, { onDelete: 'cascade' }),
  clientId: text('client_id').references(() => users.id, { onDelete: 'cascade' }),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  serviceId: integer('service_id').references(() => services.id),
  scheduledDate: date('scheduled_date'),
  scheduledTime: time('scheduled_time'),
  bookingDate: text('booking_date'),
  bookingTime: text('booking_time'),
  durationMinutes: integer('duration_minutes'),
  status: text('status').default('pending'),
  price: decimal('price', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  commissionPercentage: decimal('commission_percentage', { precision: 5, scale: 2 }).default('20.00'),
  platformCommission: decimal('platform_commission', { precision: 10, scale: 2 }),
  professionalEarnings: decimal('professional_earnings', { precision: 10, scale: 2 }),
  paymentStatus: text('payment_status').default('pending'),
  notes: text('notes'),
  studentName: text('student_name'),
  studentEmail: text('student_email'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// REVIEWS TABLE
// ============================================
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  clientId: text('client_id').references(() => users.id, { onDelete: 'cascade' }),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============================================
// CONSULTATIONS TABLE
// ============================================
export const consultations = pgTable('consultations', {
  id: uuid('id').primaryKey().defaultRandom(),
  nutritionistId: uuid('nutritionist_id').references(() => professionals.id, { onDelete: 'cascade' }),
  studentId: text('student_id').references(() => users.id, { onDelete: 'cascade' }),
  clientName: text('client_name'),
  clientEmail: text('client_email'),
  notes: text('notes'),
  price: decimal('price', { precision: 10, scale: 2 }),
  status: text('status').default('paid'),
  paymentId: text('payment_id'),
  scheduledDate: text('scheduled_date'),
  scheduledTime: text('scheduled_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// PAYMENTS TABLE
// ============================================
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'cascade' }),
  professionalId: uuid('professional_id').references(() => professionals.id, { onDelete: 'cascade' }),
  studentEmail: text('student_email'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('BRL'),
  status: text('status').default('pending'),
  paymentMethod: text('payment_method').default('stripe'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeChargeId: text('stripe_charge_id'),
  mercadoPagoPaymentId: text('mercado_pago_payment_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// PERSONAL REQUESTS TABLE
// ============================================
export const personalRequests = pgTable('personal_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').references(() => professionals.id, { onDelete: 'cascade' }),
  studentName: text('student_name'),
  studentEmail: text('student_email'),
  studentPhone: text('student_phone'),
  studentNeighborhood: text('student_neighborhood'),
  objective: text('objective'),
  availability: text('availability'),
  notes: text('notes'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// PROFESSIONAL PLANS TABLE
// ============================================
export const professionalPlans = pgTable('professional_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  professionalId: uuid('professional_id').notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  planType: text('plan_type').default('basic'),
  isActive: boolean('is_active').default(true),
  maxPhotos: integer('max_photos').default(3),
  maxRegions: integer('max_regions').default(5),
  hasVerifiedBadge: boolean('has_verified_badge').default(false),
  unlimitedLeads: boolean('unlimited_leads').default(false),
  hasStatistics: boolean('has_statistics').default(false),
  prioritySearch: boolean('priority_search').default(false),
  startedAt: timestamp('started_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// STUDENTS TABLE
// ============================================
export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  dateOfBirth: text('date_of_birth'),
  city: text('city'),
  neighborhood: text('neighborhood'),
  bio: text('bio'),
  profileImageUrl: text('profile_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================
// FAVORITES TABLE
// ============================================
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
  professionalId: uuid('professional_id').references(() => professionals.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
})
