# Back Navigation Hotfix

Perbaikan untuk Safari/WebKit yang kadang memulihkan halaman dari back-forward cache dalam keadaan tanpa stylesheet/layout lengkap.

- Menambahkan handler `pageshow` dan reload satu kali ketika halaman berasal dari BFCache.
- Membersihkan state animasi/modal saat `pagehide`.
- Menambahkan version query pada CSS dan JavaScript agar cache lama tidak tercampur setelah deploy.
- Menonaktifkan cache HTML homepage dan halaman setup melalui `vercel.json`.
