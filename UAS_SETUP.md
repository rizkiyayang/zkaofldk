# UAS Valorant Sandbox Setup

Halaman kuis ada di `/uas/`. Untuk sekarang pakai Midtrans **Sandbox** dulu sampai alurnya benar-benar layak.

## 1. Supabase

1. Buat project Supabase baru.
2. Buka SQL Editor.
3. Jalankan isi file `supabase-uas.sql`.
4. Ambil nilai ini dari Project Settings:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_URL` pakai root project URL saja, contoh:

```text
https://xxxxx.supabase.co
```

Jangan pakai format yang berakhiran `/rest/v1/` untuk env ini.

Tabel sengaja tidak punya public policy karena semua akses database dilakukan lewat Vercel API dengan service role, bukan dari browser.

## 2. Midtrans Sandbox

1. Login ke Midtrans Dashboard.
2. Pastikan mode dashboard ada di **Sandbox**.
3. Buka Settings -> Access Keys.
4. Ambil **Server Key Sandbox**.
5. Masukkan ke env sebagai:

```text
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_IS_PRODUCTION=false
```

Notification URL Sandbox:

```text
https://nama-project-kamu.vercel.app/api/uas-midtrans-webhook
```

Backend juga mengirim `X-Override-Notification` memakai `SITE_URL`, jadi isi `SITE_URL` dengan domain Vercel production/preview yang sedang dites.

## 3. Resend

Resend dipakai untuk email struk setelah pembayaran sukses.

Env yang dibutuhkan:

```text
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=UAS Valorant <struk@domain-kamu.com>
```

`RESEND_FROM_EMAIL` harus pakai domain/sender yang sudah valid di Resend. Kalau belum siap, kosongkan dulu `RESEND_API_KEY`; pembayaran dan kuis tetap jalan, hanya struk email yang tidak dikirim.

## 4. Vercel Env Vars

Masukkan env ini di Vercel Project Settings -> Environment Variables:

```text
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_IS_PRODUCTION=false
SITE_URL=https://nama-project-kamu.vercel.app
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=UAS Valorant <struk@domain-kamu.com>
```

Set env untuk **Production**, **Preview**, dan **Development** kalau kamu ingin semua deployment bisa dites. Setelah env diubah, deploy ulang.

## 5. Test Flow

1. Buka `/uas/`.
2. Klik Mulai Ujian.
3. Isi nama, email, dan nominal minimal 10000.
4. Pilih QRIS atau VA.
5. Bayar pakai simulator/test payment Midtrans Sandbox.
6. Klik Cek Status.
7. Pastikan kuis terbuka.
8. Submit kuis.
9. Pastikan highscore bertambah di Supabase.

## 6. Ganti ke Production Nanti

Saat sudah siap live:

```text
MIDTRANS_SERVER_KEY=Mid-server-production-xxxxx
MIDTRANS_IS_PRODUCTION=true
SITE_URL=https://domain-production-kamu.com
```

Server Key Sandbox dan Production berbeda. Jangan campur.

## 7. Edit Kuis

Pertanyaan frontend:

```text
uas/script.js
```

Kunci jawaban dan bobot server:

```text
server/uas-quiz.mjs
```

Kalau mengganti jawaban benar di frontend, samakan juga di server.

## 8. kirim.email

Belum disambungkan karena API/list detail belum dimasukkan. Nanti setelah API key dan endpoint jelas, integrasinya ditaruh di backend Vercel, bukan frontend.
