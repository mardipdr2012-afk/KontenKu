# Panduan Instalasi KontenKu (GitHub Pages + Google Apps Script)

## A. Backend (Apps Script) — lakukan dulu
1. Buka proyek Apps Script KontenKu, ganti isi `Kode` dengan `Kode.gs` versi terbaru (REST API). **Hapus** file HTML lama (`Index`, `Stylesheet`, `JavaScript`) — tidak dipakai lagi.
2. Jalankan `setupAppEnvironment()` — **hanya sekali**: pilih fungsi di dropdown → ▶ Run → *Review permissions* → izinkan akses Drive, Sheets, Gmail. Buka Execution Log, pastikan ✅ muncul, lalu catat **email & kata sandi admin**. Cek Google Drive (folder 📁 KontenKu berisi Uploads, Exports, dan database) dan sheet `AppConfig` sudah terisi.
3. **Deploy → Manage deployments → Edit → New version** (atau New deployment): Execute as **Me**, Who has access **Anyone**.
4. Salin URL Web App yang berakhiran `/exec`.

## B. Isi konfigurasi frontend
Buka `js/config.js`, ganti `ISI_URL_EXEC_DI_SINI` dengan URL `/exec` tadi (tetap di dalam tanda kutip).

## C. Folder kerja Git
Folder hasil ekstrak ZIP (`kontenku-frontend`) **adalah** folder yang di-`git init`.
Di dalamnya harus langsung terlihat: `index.html`, `css\`, `js\`, `README.md`. Jangan masuk lebih dalam, jangan naik satu level.

## D. Perintah Git (dari folder tersebut)
```
git --version
git config --global user.name "Nama Anda"
git config --global user.email "email-akun-github@contoh.com"
dir
git init
git add .
git commit -m "Upload pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/kontenku.git
git push -u origin main
```
- Repository GitHub: **Public**, jangan centang README/.gitignore/license.
- Saat diminta password, tempel **Personal Access Token** (github.com/settings/tokens → classic → centang `repo`). Layar tampak kosong saat paste; itu normal.

## E. Aktifkan Pages
Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch **main** / **(root)** → Save, centang **Enforce HTTPS**. Situs: `https://USERNAME.github.io/kontenku/`

## F. Update berikutnya
```
git add .
git commit -m "Deskripsi perubahan"
git push
```
Jika tampilan lama masih muncul: Ctrl+Shift+R.

## G. Uji akhir
1. Buka situs GitHub Pages → daftar akun → cek email kode OTP → verifikasi → masuk.
2. Tambah satu ide, lalu cek sheet `Ide` di spreadsheet.
3. Tekan F12 → tab Network: pastikan tidak ada error CORS.

## H. Fitur Gemini AI (dua mode)
Fitur: *Ide dengan AI*, *Perbaiki hook*, *Buat Naskah*, *Caption & Hashtag*, dan *Insight AI* (Analitik).

**Mode manual (tanpa API key — langsung bisa dipakai).** Klik tombol AI → KontenKu menampilkan prompt → klik *Salin prompt & buka Gemini* → tempel di gemini.google.com (memakai langganan Gemini Pro Anda) → salin jawabannya → tempel di kotak KontenKu → *Gunakan Hasil*.

**Mode otomatis (opsional).** Jika `GEMINI_API_KEY` diisi, hasil langsung muncul tanpa salin-tempel.
1. Buat API key gratis di https://aistudio.google.com/apikey (tanpa billing = tetap jalur gratis dengan batas ketat). Langganan Gemini Pro tidak termasuk kuota API.
2. Apps Script → **Project Settings** → **Script Properties** → *Add script property*: `GEMINI_API_KEY` = key Anda → Save. **Jangan** menaruh key di kode atau di GitHub.
3. Opsional: `GEMINI_MODEL` (default `gemini-2.5-flash`) dan `AI_LIMIT` (default 20 permintaan per pengguna per 6 jam).
4. Deploy → Manage deployments → Edit → **New version**.

Jika key kosong, kuota habis, atau Gemini gagal, KontenKu otomatis beralih ke mode manual. Teks yang diproses AI dikirim ke Google Gemini.

## Troubleshooting
| Gejala | Solusi |
|---|---|
| 404 di GitHub Pages | `index.html` tidak di root repo → push ulang dari folder yang benar |
| Tampil tanpa styling | Folder `css/` dan `js/` tidak ikut → jangan upload lewat web GitHub, pakai git |
| "URL backend belum diisi" | Isi `GAS_URL` di `js/config.js`, lalu add/commit/push |
| "Tidak dapat terhubung ke server" | Deployment Apps Script harus *Anyone*, dan URL harus versi terbaru `/exec` |
| `setupAppEnvironment` dijalankan dua kali | Fungsi menolak otomatis (sudah ada ID di Script Properties); jika ada folder/sheet ganda, hapus manual |
| Perubahan `Kode.gs` tidak berlaku | Buat versi deployment baru (New version) |
