# KAJ AI untuk XAMPP

Folder ini berisi versi lokal yang bisa langsung dijalankan melalui XAMPP di Chrome tanpa Node.js dan tanpa FastAPI.

## Cara Pakai

### Cara paling mudah

Double-click file `open-kaj-ai-xampp.bat` di root repository. Script akan menyalin folder ini ke:

```text
[folder htdocs XAMPP]\kaj-ai
```

Lalu membuka:

```text
http://localhost/kaj-ai/
```

Pastikan Apache di XAMPP sudah berjalan.

Jika muncul `Not Found`, berarti folder `kaj-ai` belum berada di document root Apache. Jalankan ulang `open-kaj-ai-xampp.bat`, lalu masukkan lokasi `htdocs` XAMPP yang benar saat diminta.

### Cara manual

1. Salin folder `xampp` ini ke folder `htdocs` XAMPP.
2. Ubah nama folder jika ingin, misalnya `kaj-ai`.
3. Jalankan Apache dari XAMPP Control Panel.
4. Buka Chrome:

```text
http://localhost/kaj-ai/
```

Jika folder tetap bernama `xampp`, buka:

```text
http://localhost/xampp/
```

## Catatan

Versi ini berjalan sepenuhnya di browser. Seluruh analisis lokal memakai Naive Bayes sederhana berbasis JavaScript dengan dataset starter multilingual. Untuk produksi, gunakan backend FastAPI di folder `backend`.

## Data Pelatihan

Menu `Data Pelatihan` memungkinkan Anda menambah contoh data:

- `Human`
- `AI Generated`

Jenis data pelatihan:

- Teks / Konten
- Gambar
- Suara
- Video

Bahasa yang tersedia:

- Indonesia
- English
- Melayu
- Espanol
- Francais
- Auto / Lainnya

Data tambahan disimpan di `localStorage` browser dan dipakai untuk melatih ulang model Naive Bayes lokal.

Data pelatihan juga mendukung:

- Link sumber pelatihan
- Upload file pelatihan sesuai jenis data
- Pembacaan isi file teks seperti `.txt`, `.md`, `.csv`, dan `.json`
- Metadata file untuk gambar, suara, dan video

Panel `Uji Model` dapat dipakai untuk mencoba hasil latih sebelum memakai model pada menu analisis.

## Analisis Video dan Link

Menu `Video / Link` menerima:

- Link video atau konten
- Judul, caption, transkrip, atau deskripsi
- File video lokal opsional

Karena versi XAMPP berjalan murni di browser, analisis link memakai URL, metadata, teks halaman jika bisa diakses browser, dan dataset pelatihan video. Banyak platform video membatasi akses halaman melalui CORS, jadi untuk analisis isi video frame-by-frame atau audio transcript otomatis dibutuhkan backend khusus.
