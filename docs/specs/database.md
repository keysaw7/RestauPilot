# Spécifications Base de données RestauPilot

## Modèle de données

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Restaurants
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tables
```sql
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### MenuItems
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(50) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  user_id UUID REFERENCES users(id),
  table_id UUID REFERENCES tables(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### OrderItems
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  order_id UUID REFERENCES orders(id),
  menu_item_id UUID REFERENCES menu_items(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  party_size INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  table_id UUID REFERENCES tables(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Shifts
```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

### Users
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Orders
```sql
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### Reservations
```sql
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_table_id ON reservations(table_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
```

### Shifts
```sql
CREATE INDEX idx_shifts_user_id ON shifts(user_id);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
CREATE INDEX idx_shifts_end_time ON shifts(end_time);
```

## Contraintes

### Users
```sql
ALTER TABLE users ADD CONSTRAINT chk_users_role 
CHECK (role IN ('ADMIN', 'MANAGER', 'WAITER', 'CHEF'));
```

### Tables
```sql
ALTER TABLE tables ADD CONSTRAINT chk_tables_status 
CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'));
```

### Orders
```sql
ALTER TABLE orders ADD CONSTRAINT chk_orders_status 
CHECK (status IN ('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'PAID', 'CANCELLED'));
```

### Reservations
```sql
ALTER TABLE reservations ADD CONSTRAINT chk_reservations_status 
CHECK (status IN ('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'));
```

### Shifts
```sql
ALTER TABLE shifts ADD CONSTRAINT chk_shifts_status 
CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'));
```

## Triggers

### Updated At
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Répéter pour toutes les tables avec updated_at
```

## Vues

### Daily Sales
```sql
CREATE VIEW daily_sales AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as order_count,
  SUM(total) as total_sales,
  AVG(total) as average_order
FROM orders
WHERE status = 'PAID'
GROUP BY DATE(created_at);
```

### Table Occupancy
```sql
CREATE VIEW table_occupancy AS
SELECT 
  t.id as table_id,
  t.number as table_number,
  t.status as current_status,
  COUNT(DISTINCT o.id) as order_count,
  COUNT(DISTINCT r.id) as reservation_count
FROM tables t
LEFT JOIN orders o ON t.id = o.table_id
LEFT JOIN reservations r ON t.id = r.table_id
GROUP BY t.id, t.number, t.status;
``` 