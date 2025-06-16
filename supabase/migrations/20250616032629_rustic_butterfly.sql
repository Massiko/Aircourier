/*
  # AirCourier Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `phone` (text)
      - `country` (text)
      - `city` (text)
      - `avatar_url` (text)
      - `is_verified` (boolean)
      - `rating` (numeric)
      - `total_trips` (integer)
      - `total_packages` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `package_requests`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `from_country` (text)
      - `from_city` (text)
      - `to_country` (text)
      - `to_city` (text)
      - `weight` (numeric)
      - `dimensions` (text)
      - `compensation` (numeric)
      - `currency` (text)
      - `deadline` (date)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `trips`
      - `id` (uuid, primary key)
      - `traveler_id` (uuid, references profiles)
      - `from_country` (text)
      - `from_city` (text)
      - `to_country` (text)
      - `to_city` (text)
      - `departure_date` (date)
      - `arrival_date` (date)
      - `available_weight` (numeric)
      - `price_per_kg` (numeric)
      - `currency` (text)
      - `notes` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `matches`
      - `id` (uuid, primary key)
      - `package_id` (uuid, references package_requests)
      - `trip_id` (uuid, references trips)
      - `status` (text)
      - `created_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `match_id` (uuid, references matches)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `reviewer_id` (uuid, references profiles)
      - `reviewee_id` (uuid, references profiles)
      - `match_id` (uuid, references matches)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public profile information
    - Add policies for messaging between matched users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  country text NOT NULL,
  city text NOT NULL,
  avatar_url text,
  is_verified boolean DEFAULT false,
  rating numeric(3,2) DEFAULT 0,
  total_trips integer DEFAULT 0,
  total_packages integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create package_requests table
CREATE TABLE IF NOT EXISTS package_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  from_country text NOT NULL,
  from_city text NOT NULL,
  to_country text NOT NULL,
  to_city text NOT NULL,
  weight numeric(8,2) NOT NULL,
  dimensions text,
  compensation numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  deadline date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'matched', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  from_country text NOT NULL,
  from_city text NOT NULL,
  to_country text NOT NULL,
  to_city text NOT NULL,
  departure_date date NOT NULL,
  arrival_date date NOT NULL,
  available_weight numeric(8,2) NOT NULL,
  price_per_kg numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  notes text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'booked', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES package_requests(id) ON DELETE CASCADE NOT NULL,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read public profile data"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Package requests policies
CREATE POLICY "Users can read all package requests"
  ON package_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own package requests"
  ON package_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own package requests"
  ON package_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Trips policies
CREATE POLICY "Users can read all trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = traveler_id);

CREATE POLICY "Users can update own trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = traveler_id);

-- Matches policies
CREATE POLICY "Users can read matches for their packages or trips"
  ON matches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM package_requests 
      WHERE package_requests.id = matches.package_id 
      AND package_requests.sender_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = matches.trip_id 
      AND trips.traveler_id = auth.uid()
    )
  );

CREATE POLICY "Users can create matches for others' content"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM package_requests 
      WHERE package_requests.id = matches.package_id 
      AND package_requests.sender_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = matches.trip_id 
      AND trips.traveler_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Users can read messages for their matches"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      JOIN package_requests ON package_requests.id = matches.package_id
      JOIN trips ON trips.id = matches.trip_id
      WHERE matches.id = messages.match_id 
      AND (package_requests.sender_id = auth.uid() OR trips.traveler_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages for their matches"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND
    EXISTS (
      SELECT 1 FROM matches 
      JOIN package_requests ON package_requests.id = matches.package_id
      JOIN trips ON trips.id = matches.trip_id
      WHERE matches.id = messages.match_id 
      AND (package_requests.sender_id = auth.uid() OR trips.traveler_id = auth.uid())
    )
  );

-- Reviews policies
CREATE POLICY "Users can read all reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert reviews for completed matches"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id
    AND
    EXISTS (
      SELECT 1 FROM matches 
      JOIN package_requests ON package_requests.id = matches.package_id
      JOIN trips ON trips.id = matches.trip_id
      WHERE matches.id = reviews.match_id 
      AND matches.status = 'completed'
      AND (package_requests.sender_id = auth.uid() OR trips.traveler_id = auth.uid())
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_package_requests_sender ON package_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_package_requests_route ON package_requests(from_country, to_country);
CREATE INDEX IF NOT EXISTS idx_package_requests_status ON package_requests(status);
CREATE INDEX IF NOT EXISTS idx_trips_traveler ON trips(traveler_id);
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(from_country, to_country);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_matches_package ON matches(package_id);
CREATE INDEX IF NOT EXISTS idx_matches_trip ON matches(trip_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_requests_updated_at
    BEFORE UPDATE ON package_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();