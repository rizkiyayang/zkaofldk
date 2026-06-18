# Refactor Homepage dan Setup

Bagian UAS, API UAS, database UAS, serta file pembayaran lama tidak diubah.

## Struktur baru

```text
assets/
  css/
    base.css
    components.css
    home.css
    setup.css
  js/
    carousel.js
    common.js
    home.js
    modal.js
    render.js
    setup.js

data/
  agents.js
  maps.js
  products.js
  weapons.js
```

Homepage dan halaman setup sekarang berbagi CSS dan modul JavaScript yang sama. File CSS/JS lama di root dan folder setup sudah tidak diperlukan.

## Produk affiliate

Data kartu produk dipindahkan ke `data/products.js`. Semua kartu Shopee yang dibuat oleh JavaScript otomatis memakai:

```html
rel="noopener noreferrer sponsored"
```

Untuk mengubah nama, link, deskripsi, atau gambar produk, edit koleksi terkait di `data/products.js`.

## Status live

Status memakai zona waktu `Asia/Jakarta` dan hanya menampilkan **Live** pada pukul 22.00 sampai sebelum 05.00 WIB. Di luar jam tersebut status berubah menjadi **Offline** dan menampilkan keterangan `Live mulai 22.00 WIB`.

Logikanya ada di `assets/js/common.js`.

## Gambar dan performa

- Gambar utama memiliki sumber AVIF lebih dahulu, kemudian WebP.
- Atribut `width` dan `height` ditambahkan untuk mengurangi layout shift.
- File AVIF dibuat untuk gambar PNG/JPG yang dipakai homepage dan setup.
- WebP fallback dibuat untuk aset agent/senjata yang sebelumnya hanya memiliki AVIF.
- Sebanyak 16 file di `setup/img` yang benar-benar identik dengan file di `/img` dihapus. Referensinya sekarang memakai `/img`.
- Remix Icon dipasang dengan versi tetap `4.6.0`.
- Interval animasi avatar, status live, dan testimoni berhenti ketika tab tidak aktif.
- `prefers-reduced-motion` dihormati.

## File utama yang berubah

- `index.html`
- `setup/index.html`
- folder baru `assets/`
- folder baru `data/`
- aset gambar di `img/` dan `setup/img/`

## File yang sengaja tidak disentuh

- `uas/index.html`
- `uas/style.css`
- `uas/script.js`
- seluruh `api/uas-*.js`
- `server/uas-core.mjs`
- `server/uas-quiz.mjs`
- `supabase-uas.sql`
