Perbaikan halaman yang hanya menampilkan "Offline":
- Memulihkan index.html homepage lengkap.
- Menghapus reload paksa pada event pageshow/BFCache di assets/js/common.js.
- Mengganti pemulihan halaman dengan re-enable stylesheet + reflow aman.
- Mengganti versi URL CSS/JS agar browser tidak memakai cache campuran.
- Membuat CSS/JS must-revalidate sementara melalui vercel.json.
- Halaman Jajan dan Setup ikut memakai versi aset yang sama.
