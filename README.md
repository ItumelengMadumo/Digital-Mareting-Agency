# SocialSync - Digital Marketing Agency Platform

> An all-in-one social media management and CRM platform designed to help individuals, brands, and businesses grow their digital presence.

## 📋 Overview

SocialSync is a comprehensive digital marketing tool that combines **social media management** with **customer relationship management (CRM)** capabilities. Whether you're an individual building your personal brand, a marketing agency managing multiple clients, or a business looking to expand your digital footprint, this platform provides the tools you need to succeed.

This project is designed to be monetizable as a **SaaS (Software as a Service)** product.

---

## ✨ Features

### 🚀 Social Media Management

- **Multi-Platform Publishing** - Publish content to multiple social media platforms (Facebook, Instagram, Twitter/X, LinkedIn, TikTok, YouTube) simultaneously with a single click
- **Content Calendar** - Plan and visualize your content strategy with an intuitive drag-and-drop calendar interface
- **Scheduled Posts** - Schedule posts ahead of time to maintain a consistent social media presence
- **Content Creation Wizard** - Step-by-step post creation workflow supporting:
  - Short-form videos
  - Images
  - Text posts
  - Long-form videos
  - Link sharing
- **Platform-Specific Customization** - Customize captions and content for each platform individually
- **Content Library** - Store and organize all your media assets in one centralized location

### 👥 CRM & Lead Management

- **Lead Tracking** - Track and manage all your sales leads in one place
- **Lead Pipeline** - Visual pipeline with stages: New → Contacted → Qualified → Proposal
- **Lead Details** - Store comprehensive contact information, company details, and deal values
- **Communication History** - Full history of all interactions with each lead

### 💬 Communications Hub

- **Multi-Channel Logging** - Log communications across multiple channels:
  - Phone calls
  - Emails
  - SMS
  - WhatsApp
  - Video calls
- **Communication Tracking** - Track outcomes, duration, and notes for each interaction
- **Lead Conversion** - Convert promising communications directly into leads

### 📊 Analytics & Reporting

- **Dashboard Overview** - Real-time metrics including:
  - Total followers
  - Posts published
  - Total engagements
  - Comments
- **Team Overview Reports** - Comprehensive team performance analytics
- **Employee Reports** - Individual performance tracking
- **Lead Performance** - Lead conversion rates and pipeline analysis
- **Communication Metrics** - Track communication effectiveness

### 🏢 Team Management & Oversight

- **Role-Based Access** - Support for Executive and Employee roles with different permissions
- **Team Leads Overview** - Monitor lead assignments across team members
- **Lead Analytics** - Team-wide lead performance insights
- **Communication Analytics** - Track team communication volumes and outcomes
- **Pipeline Value Tracking** - Monitor total potential revenue across all deals

### 📦 Products & Services Management

- **Product Catalog** - Manage your product and service offerings
- **Product Statistics** - Track product performance
- **Role-Based Editing** - Executives can add/edit products; employees can browse

### 🔗 Platform Integrations

- **Connected Platforms** - View and manage connected social media accounts
- **Available Platforms** - Connect new platforms to expand your reach
- **Platform Analytics** - Track performance per platform

### 🎨 User Experience

- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Modern UI** - Built with a clean, intuitive interface using Tailwind CSS and Radix UI components

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI, shadcn/ui |
| **State Management** | React Context |
| **Forms** | React Hook Form + Zod validation |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Package Manager** | pnpm |

---

## 📁 Project Structure

```
Digital-Mareting-Agency/
├── CRM/                          # Main Next.js application
│   ├── app/                      # App router pages
│   │   ├── dashboard/            # Protected dashboard routes
│   │   │   ├── activity/         # Activity tracking
│   │   │   ├── calendar/         # Content calendar
│   │   │   ├── communications/   # Communication hub
│   │   │   ├── create-post/      # Post creation wizard
│   │   │   ├── leads/            # Lead management
│   │   │   ├── oversight/        # Team oversight (Executive)
│   │   │   ├── platforms/        # Platform connections
│   │   │   ├── products/         # Products & services
│   │   │   ├── reports/          # Analytics & reports
│   │   │   └── settings/         # User settings
│   │   ├── about/                # About page
│   │   ├── auth/                 # Authentication (login/register)
│   │   ├── contact/              # Contact page
│   │   └── pricing/              # Pricing plans
│   ├── components/               # Reusable React components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── landing/              # Landing page components
│   │   ├── layout/               # Layout components (header, footer)
│   │   └── ui/                   # Base UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions & context
│   └── public/                   # Static assets
└── Digital marketing Website/    # Static marketing website
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ItumelengMadumo/Digital-Mareting-Agency.git
   cd Digital-Mareting-Agency/CRM
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Please check the issues page for current tasks.

---

## 📞 Contact

For questions or support, please reach out through the repository's issues section.
