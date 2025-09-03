# Template Website Statis (3 Section)

Template sederhana dengan:

- Header sticky + navigasi responsif (hamburger di mobile)
- 3 section: Hero, Fitur, Kontak
- Footer dengan tautan ulang & tahun dinamis
- Desain dark mode modern + font Inter
- Validasi form front-end dasar

## Struktur

```
index.html
assets/
  css/style.css
  js/main.js
  img/ (letakkan gambar di sini)
```

## Cara Pakai

Buka langsung `index.html` di browser atau gunakan server lokal sederhana.

### Jalankan Server Lokal (Opsional)

PowerShell:

```
# Jika punya Python
python -m http.server 8000
# Lalu buka http://localhost:8000
```

## Kustomisasi Cepat

- Ganti teks brand di `<div class="logo">`.
- Ubah warna di variabel CSS (`:root`).
- Tambah/kurangi fitur dengan menduplikasi elemen `.card`.
- Form saat ini hanya simulasi; hubungkan ke backend / service (misal Formspree) untuk produksi.

## Aksesibilitas

- Gunakan `aria-label` pada tombol hamburger
- Navigasi dapat ditutup otomatis saat klik di luar
- Status form memakai `aria-live` pada elemen status

## Lisensi

Bebas digunakan & dimodifikasi. 👍
