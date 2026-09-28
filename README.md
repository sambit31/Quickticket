# 🎬 QuickTicket

A full-stack movie ticket booking platform built with **React, Node.js, Express, MongoDB, Clerk, Stripe, and Socket.IO**.

QuickTicket lets users browse movies and shows, select seats, pay securely online, receive booking confirmations with downloadable PDF tickets, and see seat availability update in real time.

---

## 🚀 Features

### 🎥 Movie & Show Browsing
- Browse available movies and shows
- View show timings and ticket prices
- Select a preferred show

### 💺 Seat Booking
- Interactive seat selection
- Maximum seat selection limit
- Real-time seat availability
- Already occupied seats cannot be selected
- Temporary seat locking during checkout

### ⚡ Real-Time Seat Updates
Implemented using **Socket.IO**. When one user locks or releases seats, other users viewing the same show receive the update instantly, without refreshing the page.

```text
User A ──(selects seats)──▶ Backend ──(Socket.IO)──▶ User B
                                                    └── Seats updated instantly
```

### ⏱️ Temporary Seat Locking
- Selected seats are temporarily locked
- Bookings stay pending for 10 minutes
- Expired bookings automatically release their seats
- Released seats are broadcast to other connected users

### 💳 Stripe Payments
- Stripe Checkout integration
- Secure online payment processing
- Stripe webhook handles successful payments
- Booking status changes to `paid` only after payment confirmation

### 📩 Booking Confirmation Email
After a successful payment, users receive an email containing:
- Movie details
- Date and time
- Selected seats
- Booking ID
- Ticket amount
- PDF ticket attachment

### 🎫 PDF Movie Ticket
A PDF ticket is generated automatically, containing:
- QuickTicket branding
- Booking ID
- Movie name, date, and time
- Seats
- Amount and payment status
- QR code

### 📥 Ticket Download
Users can download their confirmed ticket directly from the application.

### ❌ Booking Cancellation
Pending bookings can be cancelled before payment. On cancellation:
- Seats are released
- The database is updated
- Other connected users receive the seat-release event

### 🔐 Authentication
Authentication is handled by **Clerk**.

### 🗄️ Database
**MongoDB Atlas** stores users, movies, shows, bookings, and seat availability.

---

## 🏗️ Tech Stack

| Layer      | Technologies |
| ---------- | ------------ |
| Frontend   | React, Vite, Tailwind CSS, Axios, React Router, Clerk, Socket.IO Client |
| Backend    | Node.js, Express.js, MongoDB, Mongoose, Clerk, Stripe, Socket.IO, node-cron, Nodemailer, PDFKit, QRCode |
| Database   | MongoDB Atlas |
| Payments   | Stripe Checkout + Webhooks |
| Deployment | Vercel (frontend), Node.js host with persistent server support (backend) |

---

## 🧩 System Architecture

```text
                    ┌─────────────────┐
                    │ React Frontend  │
                    └────────┬────────┘
                             │
                  REST API + Socket.IO
                             │
                             ▼
                    ┌─────────────────┐
                    │ Node.js +       │
                    │ Express         │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │  MongoDB   │ │   Stripe   │ │   Clerk    │
       │   Atlas    │ │  Checkout  │ │    Auth    │
       └────────────┘ └─────┬──────┘ └────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │ Stripe Webhook  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Email + PDF     │
                    │ Ticket + QR     │
                    └─────────────────┘
```

---

## 🔄 Booking Flow

```text
 1. User logs in
 2. Selects a movie
 3. Selects a show
 4. Selects seats
 5. Backend checks seat availability
 6. Seats are temporarily locked
 7. Booking created as "pending"
 8. Stripe Checkout session created
 9. User completes payment
10. Stripe sends a webhook
11. Booking becomes "paid"
12. PDF ticket generated
13. Confirmation email sent
14. User can download the ticket
```

---

## 💺 Real-Time Seat Booking

Each show has its own Socket.IO room:

```text
show:<showId>
```

| Action                 | Event            | Recipients               |
| ---------------------- | ---------------- | ------------------------ |
| User opens a show      | `join-show`      | Joins the show's room    |
| Seats are locked       | `seat-locked`    | All users in the room    |
| Seats are released     | `seat-released`  | All users in the room    |

This keeps the seat layout synchronized across all users viewing the same show.

---

## 🗃️ Booking States

```text
pending
   │
   ├── Payment successful ──▶ paid
   │
   └── Timeout / cancellation ──▶ removed
```

Relevant booking fields: `isPaid`, `expiresAt`, `paymentLink`, `bookedSeats`.

---

## ⏰ Booking Expiry System

Pending bookings expire after 10 minutes. A `node-cron` job runs every minute:

```text
Every minute
     ↓
Find expired pending bookings
     ↓
Release seats
     ↓
Notify Socket.IO users
     ↓
Delete expired booking
```

This prevents seats from staying locked when a user abandons the payment process.

---

## 💳 Payment Architecture

```text
Frontend → Create Booking → Backend → Stripe Checkout → User Payment
   → Stripe → Webhook → Backend → Booking PAID → Generate Ticket → Send Email
```

A booking is marked as paid **only** after the Stripe webhook event is received and its signature is verified.

---

## 📄 Ticket Generation

```text
Booking Data ──▶ PDFKit + QRCode ──▶ Movie Ticket PDF ──▶ Email attachment + Download
```

---

## 🔌 API Endpoints

| Method | Endpoint                              | Purpose                |
| ------ | ------------------------------------- | ---------------------- |
| `GET`  | `/`                                   | Check server status    |
| `POST` | `/api/booking/create`                 | Create booking         |
| `GET`  | `/api/booking/occupied-seats/:showId` | Get occupied seats     |
| `POST` | `/api/booking/cancel`                 | Cancel pending booking |
| `GET`  | `/api/booking/:bookingId/ticket`      | Download ticket        |
| `POST` | `/api/stripe`                         | Stripe webhook         |

---

## 📁 Project Structure

```text
QuickTicket/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── jobs/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173

CLERK_SECRET_KEY=your_clerk_secret_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_KEY=your_stripe_webhook_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

> ⚠️ Never commit `.env` files or secret keys to GitHub.

---

## 🛠️ Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/sambit31/QuickTicket.git
cd QuickTicket
```

**2. Install dependencies**

```bash
cd frontend && npm install
cd ../backend && npm install
```

**3. Configure environment variables**

Create the `.env` files shown above in both `frontend/` and `backend/`.

**4. Start the backend**

```bash
cd backend
npm run dev
```

**5. Start the frontend** (in a second terminal)

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:3000`.

---

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend:** A Node.js host that supports a persistent server (required for Socket.IO connections)
- **Database:** MongoDB Atlas
- **Payments:** Stripe

Production environment variables must be configured separately from local development.

---

## 🔒 Security Considerations

- Authentication handled through Clerk
- Payments handled through Stripe Checkout
- Stripe webhook signature verification
- Sensitive credentials stored in environment variables
- Backend validates seat availability before creating bookings
- MongoDB is the source of truth for seat availability; Socket.IO is used only for synchronization

---

## 🎯 Technical Highlights

- Full-stack JavaScript development and REST API design
- Authentication with Clerk
- MongoDB schema design
- Payment gateway integration with Stripe webhooks
- Real-time communication with WebSockets
- Temporary resource locking and scheduled background jobs
- Email automation, PDF generation, and QR codes
- Environment configuration and production deployment

---

## 👨‍💻 Author

**Sambit Ghosh**

- GitHub: [@sambit31](https://github.com/sambit31)
- LinkedIn: *add your LinkedIn profile*

---

⭐ If you find this project useful or interesting, consider giving the repository a star!
