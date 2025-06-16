# AirCourier - Connect Globally, Ship Personally

A modern web application that connects people worldwide through trusted package delivery. Send packages internationally through verified travelers, creating a personal and affordable shipping network.

## 🌟 Features

- **Package Requests**: Post packages you need to send with compensation details
- **Trip Offers**: Travelers can offer to carry packages on their journeys
- **Smart Matching**: Connect senders with travelers going the same route
- **Secure Authentication**: User registration and login with Supabase
- **Profile Management**: Verified user profiles with ratings and reviews
- **Real-time Messaging**: Chat between matched users
- **Trust & Safety**: Comprehensive verification and insurance system

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Static export ready

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aircourier.git
cd aircourier
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
- Go to your Supabase dashboard
- Run the SQL migrations from `supabase/migrations/` to create the database schema

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
aircourier/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── Header.tsx        # Main navigation
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profiles with verification status and ratings
- **package_requests**: Package delivery requests from senders
- **trips**: Travel offers from couriers
- **matches**: Connections between packages and trips
- **messages**: Communication between matched users
- **reviews**: User ratings and feedback

## 🔐 Authentication

The app uses Supabase Auth with:
- Email/password authentication
- User profile creation on signup
- Row Level Security (RLS) policies
- Protected routes and data access

## 🎨 Design System

Built with a modern, clean design featuring:
- Gradient backgrounds and glass morphism effects
- Consistent color palette (sky/blue theme)
- Responsive design for all devices
- Smooth animations and micro-interactions
- Apple-level design aesthetics

## 🚀 Deployment

The app is configured for static export and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build for production:
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and auth by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**AirCourier** - Connecting people across borders through trusted package delivery 🌍✈️