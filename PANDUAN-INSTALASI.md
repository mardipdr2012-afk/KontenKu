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

## I. Statistik TikTok otomatis (TikTok Display API resmi)
KontenKu membaca views, likes, komentar, dan shares video **milik akun yang Anda hubungkan**, memakai ID video dari kolom *Tautan Publikasi*. Saves/klik/komisi tidak tersedia dari API ini: isi manual (nilai terakhir dipertahankan).

**A. Buat aplikasi TikTok**
1. Buka https://developers.tiktok.com → login → **Manage apps** → buat app baru (isi nama, ikon, kategori, deskripsi).
2. **Add products**: **Login Kit** dan **Display API**. Pastikan scope `user.info.basic` dan `video.list` aktif.
3. Di Login Kit → **Web** → **Redirect URI** (Sandbox *dan* Production, terpisah): isi `https://SITUS-ANDA/tiktok-callback.html` (halaman ini ada di ZIP frontend), persis sama dengan nilai `TIKTOK_REDIRECT_URI` di langkah C. Klik **Add a URI** lalu **Apply changes**.
4. Isi **Website URL**, **Privacy Policy URL**, **Terms of Service URL** dengan alamat situs Anda: `https://SITUS-ANDA/`, `https://SITUS-ANDA/privacy.html`, `https://SITUS-ANDA/terms.html`. Ganti `[GANTI: email kontak Anda]` di kedua halaman itu sebelum push.

**B. Mode Sandbox (tanpa review, cukup untuk dipakai sendiri)**
Di halaman app, ubah toggle ke **Sandbox** → buat sandbox → tambahkan produk yang sama → di *Target users* tambahkan akun TikTok Anda (maks. 10 akun). Hanya akun target yang bisa terhubung selama di Sandbox.

**C. Pasang kunci di Apps Script** (Project Settings → Script Properties)
| Nama | Isi |
|---|---|
| `TIKTOK_CLIENT_KEY` | Client key dari halaman app TikTok |
| `TIKTOK_CLIENT_SECRET` | Client secret (jangan dibagikan, jangan di GitHub) |
| `TIKTOK_REDIRECT_URI` | `https://SITUS-ANDA/tiktok-callback.html`, sama persis dengan langkah A3 |
| `FRONTEND_URL` | (opsional, hanya untuk jalur lama) alamat situs KontenKu |
Lalu **Deploy → Manage deployments → Edit → New version**, dan push frontend baru.

**D. Pemakaian**
1. KontenKu → **Pengaturan → Hubungkan TikTok** → login TikTok → setujui izin → klik *Kembali ke KontenKu*.
2. Isi **Tautan Publikasi** di detail konten → **Analitik → Sinkron dari TikTok**. Konten yang berhasil otomatis berstatus *Sudah Tayang*.
3. Opsional harian: jalankan `aktifkanSinkronHarian()` sekali dari editor (konten tayang 30 hari terakhir diperbarui tiap pagi).
Batas: satu konten disinkron maksimal tiap 15 menit.

**E. Dipakai pengguna lain (produksi)**
TikTok mewajibkan **App Review** (deskripsi, demo video tiap produk/scope, URL privasi & syarat). Menurut sumber komunitas, prosesnya beberapa hari sampai sekitar dua minggu. Setelah disetujui, pengguna mana pun bisa menghubungkan akunnya sendiri.

Keamanan: token TikTok tersimpan di sheet `TikTokToken` pada spreadsheet database (jangan dibagikan ke orang lain). Pengguna bisa memutus koneksi di Pengaturan (token dicabut dan dihapus).

## Troubleshooting
| Gejala | Solusi |
|---|---|
| 404 di GitHub Pages | `index.html` tidak di root repo → push ulang dari folder yang benar |
| Tampil tanpa styling | Folder `css/` dan `js/` tidak ikut → jangan upload lewat web GitHub, pakai git |
| "URL backend belum diisi" | Isi `GAS_URL` di `js/config.js`, lalu add/commit/push |
| "Tidak dapat terhubung ke server" | Deployment Apps Script harus *Anyone*, dan URL harus versi terbaru `/exec` |
| `setupAppEnvironment` dijalankan dua kali | Fungsi menolak otomatis (sudah ada ID di Script Properties); jika ada folder/sheet ganda, hapus manual |
| Perubahan `Kode.gs` tidak berlaku | Buat versi deployment baru (New version) |
