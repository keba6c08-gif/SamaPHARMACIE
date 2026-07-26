/**
 * Migration Script
 * Crée la structure de base de données PostgreSQL
 */

const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log('🚀 Créating database tables...\n');

    // 1. Table Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'pharmacien')),
        phone VARCHAR(20) NOT NULL,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "users" created');

    // 2. Table Pharmacies
    await client.query(`
      CREATE TABLE IF NOT EXISTS pharmacies (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(10) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        pharmacist_name VARCHAR(100),
        on_duty BOOLEAN DEFAULT false,
        average_rating DECIMAL(3, 1),
        review_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "pharmacies" created');

    // 3. Table Medicines
    await client.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        manufacturer VARCHAR(100),
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "medicines" created');

    // 4. Table PharmacyStock
    await client.query(`
      CREATE TABLE IF NOT EXISTS pharmacy_stock (
        id UUID PRIMARY KEY,
        pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
        medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
        quantity INT DEFAULT 0,
        min_stock INT DEFAULT 5,
        expiry_date DATE,
        last_restocked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(pharmacy_id, medicine_id)
      );
    `);
    console.log('✅ Table "pharmacy_stock" created');

    // 5. Table Reservations
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY,
        patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ready', 'picked_up', 'cancelled')),
        total_price DECIMAL(10, 2) NOT NULL,
        pickup_date DATE NOT NULL,
        pickup_time TIME NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      );
    `);
    console.log('✅ Table "reservations" created');

    // 6. Table ReservationItems
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservation_items (
        id UUID PRIMARY KEY,
        reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
        medicine_id UUID NOT NULL REFERENCES medicines(id),
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );
    `);
    console.log('✅ Table "reservation_items" created');

    // 7. Table DutySchedule
    await client.query(`
      CREATE TABLE IF NOT EXISTS duty_schedule (
        id UUID PRIMARY KEY,
        pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        duty_type VARCHAR(20) DEFAULT 'normal' CHECK (duty_type IN ('normal', 'morning', 'evening', 'night')),
        pharmacist_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "duty_schedule" created');

    // 8. Table Reviews
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY,
        pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
        patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "reviews" created');

    // 9. Table Notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "notifications" created');

    // Create indexes for performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_pharmacies_user_id ON pharmacies(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_pharmacy_stock_pharmacy_id ON pharmacy_stock(pharmacy_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reservations_patient_id ON reservations(patient_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reservations_pharmacy_id ON reservations(pharmacy_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reviews_pharmacy_id ON reviews(pharmacy_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);');

    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
};

createTables();
