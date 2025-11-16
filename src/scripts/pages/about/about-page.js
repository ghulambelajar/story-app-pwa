export default class AboutPage {
  async render() {
    return `
      <div class="page-title container">
        <h1>Tentang My Story App</h1>
      </div>

      <div class="home-content container">
        
        <div class="stories-container">
          <div class="stories-header">
            <h2>Tentang Aplikasi Ini</h2>
          </div>
          <div class="about-content">
            <p>
              <strong>My Story App</strong> adalah sebuah Progressive Web App (PWA)
              yang dibangun sebagai Proyek Submission Kedua untuk kelas "Belajar Pengembangan Web Intermediate" di Dicoding.
            </p>
            <p>
              Aplikasi ini mengimplementasikan semua fitur PWA modern untuk memberikan
              pengalaman pengguna yang cepat, andal (bisa offline), dan menarik (installable).
            </p>
            
            <h3>Fitur Utama (Sesuai Kriteria Submission):</h3>
            <ul class="feature-list">
              <li><i class="fa-solid fa-mobile-screen"></i> Installable (Dapat dipasang di home screen).</li>
              <li><i class="fa-solid fa-wifi-slash"></i> Offline-First (App Shell & Data Caching).</li>
              <li><i class="fa-solid fa-bell"></i> Push Notifications (Berlangganan & Menerima).</li>
              <li><i class="fa-solid fa-bookmark"></i> Simpan Cerita (IndexedDB CRUD).</li>
              <li><i class="fa-solid fa-upload"></i> Background Sync (Upload cerita saat offline).</li>
            </ul>
          </div>
        </div>

        <div class="map-container">
          <h2>Teknologi yang Digunakan</h2>
          <ul class="tech-list">
            <li>Vite</li>
            <li>Workbox (via vite-plugin-pwa)</li>
            <li>IndexedDB (via 'idb' library)</li>
            <li>Leaflet.js</li>
            <li>SweetAlert2</li>
            <li>Font Awesome</li>
          </ul>
        </div>

      </div>
    `;
  }

  async afterRender() {
    // Tidak ada aksi JavaScript yang diperlukan untuk halaman statis ini.
  }
}
