# D.E.R.F. Frontend (Next.js Application)

Frontend application for the official D.E.R.F. website.

Built with a modern React-based stack, optimized for performance, scalability, and internationalization.

---

## 🚀 Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React Query
* Zustand

---

## 📁 Project Structure

```
src/
  app/          # routing and pages
  components/   # reusable UI components
  features/     # domain-specific modules
  entities/     # core data structures
  shared/       # utilities and helpers
  styles/       # global styles
```

---

## ⚙️ Installation

```bash
cd derf-frontend
npm install
```

---

## 🔧 Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## ▶️ Development

```bash
npm run dev
```

---

## 🧩 Core Features

### Homepage

* latest news
* upcoming events
* featured releases

### Music

* release catalog
* audio player

### Events

* upcoming concerts
* past performances

### Media Gallery

* photos
* videos

### Forum

* threads
* replies

### Chat

* real-time messaging via WebSocket

---

## 🌍 Internationalization

* Language handled via API + client state
* Stored in localStorage
* Default fallback: English

---

## 🔌 API Integration

Example request:

```ts
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news`)
```

---

## 💬 WebSocket Chat

```
ws://localhost:8000/ws/chat
```

---

## 🎨 UI/UX

* Tailwind CSS
* Fully responsive layout
* Dark mode by default

---

## ⚡ Performance

* SSR + ISR support
* Lazy loading
* Optimized image delivery

---

## 🛠 Scripts

```bash
npm run dev
npm run build
npm run start
```

---

## 🔐 Authentication

* JWT stored client-side
* Token refresh handled via API

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 🧠 Best Practices

* Use React Query for caching
* Avoid unnecessary re-renders
* Prefer server components when possible

---

## 🛠 Roadmap

* PWA support
* Offline mode
* Push notifications
* SEO improvements

---

## 📄 License

Private / Internal Use
