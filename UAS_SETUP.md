# UAS Valorant Gratis — Setup

Halaman kuis ada di `/uas/`. Versi ini tidak membuat checkout atau transaksi Midtrans. Nama, email, order, token kuis, dan hasil ujian tetap disimpan di Supabase.

## 1. Supabase

1. Buka SQL Editor di project Supabase.
2. Jalankan seluruh isi `supabase-uas.sql`.
3. Untuk database lama, menjalankan ulang file tersebut penting karena constraint nominal diubah dari minimal `10000` menjadi minimal `0`.
4. Siapkan environment variable:

```text
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

`SUPABASE_URL` menggunakan root project URL, bukan URL yang berakhiran `/rest/v1/`.

Tabel tidak memiliki public policy karena seluruh akses database dilakukan lewat API server menggunakan service role.

## 2. Alur Data Gratis

Saat peserta menekan **Mulai Ujian Gratis**:

1. Data nama dan email masuk ke `uas_players`.
2. Satu order gratis masuk ke `uas_orders` dengan:
   - `amount = 0`
   - `channel = free`
   - `payment_status = free`
3. Token kuis langsung diberikan.
4. Setelah selesai, hasil masuk ke `uas_attempts` dan leaderboard tetap diperbarui.

## 3. Vercel

Environment variable minimum:

```text
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

Environment variable Midtrans dan Resend tidak diperlukan untuk flow gratis baru. Endpoint lama tetap ada agar data/transaksi lama tidak rusak, tetapi halaman gratis tidak memanggilnya.

## 4. Test Flow

1. Deploy ulang project.
2. Buka `/uas/`.
3. Klik **Mulai Ujian**.
4. Isi nama dan email.
5. Klik **Mulai Ujian Gratis**.
6. Pastikan kuis langsung terbuka tanpa checkout.
7. Submit kuis.
8. Pastikan tabel `uas_players`, `uas_orders`, dan `uas_attempts` bertambah.
9. Pastikan `uas_orders.amount` bernilai `0` dan `payment_status` bernilai `free`.

## 5. Edit Kuis

Pertanyaan frontend:

```text
uas/script.js
```

Kunci jawaban dan bobot server:

```text
server/uas-quiz.mjs
```

Kalau jawaban benar di frontend diubah, samakan juga di server.
