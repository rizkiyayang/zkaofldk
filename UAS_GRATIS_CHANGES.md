# Perubahan UAS Valorant Menjadi Gratis

## Yang diubah

- Form pembayaran/donasi tidak lagi ditampilkan.
- Peserta hanya mengisi nama dan email.
- `/api/uas-start` tidak lagi memanggil Midtrans.
- Data tetap masuk ke:
  - `uas_players`
  - `uas_orders`
  - `uas_attempts`
- Order gratis menggunakan:
  - `amount: 0`
  - `channel: free`
  - `payment_status: free`
- Status `free` diizinkan membuka dan mengirim kuis.
- Checkout lama di browser dibersihkan agar tidak membuka panel pembayaran lama.

## Wajib sebelum deploy

Jalankan ulang `supabase-uas.sql` di SQL Editor Supabase. Ini mengubah constraint `uas_orders.amount` supaya nilai `0` dapat disimpan.

Tanpa migrasi tersebut, pendaftaran akan gagal dengan error constraint database walaupun Midtrans sudah dilepas.

## Catatan kompatibilitas

Endpoint Midtrans lama tidak dihapus. Tujuannya agar transaksi/order lama tetap dapat dibaca dan tidak rusak. Flow baru tidak memanggil endpoint pembayaran tersebut.
