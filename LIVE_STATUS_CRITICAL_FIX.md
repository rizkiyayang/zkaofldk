# Critical live status fix

Penyebab halaman berubah menjadi hanya teks "Offline":

1. updateLiveStatus() memilih semua elemen [data-live-status].
2. Fungsi yang sama menulis document.documentElement.dataset.liveStatus.
3. Ini menambahkan data-live-status pada elemen <html>.
4. Pada pemanggilan berikutnya, <html> ikut terseleksi.
5. html.textContent = "Offline" menghapus seluruh DOM halaman.

Perbaikan:
- Selector dibatasi menjadi .live-pill[data-live-status].
- Status global dipindah ke data-stream-status agar tidak bertabrakan.
- Versi modul diganti menjadi 20260619-livefix3 untuk melewati cache lama.
