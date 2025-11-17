export default class AboutPage {
  async render() {
    return `
      <div class="page-title container">
        <h1>My Story App</h1>
        <p class="page-subtitle">Progressive Web Application untuk berbagi cerita</p>
      </div>

      <div class="home-content container">
        
        <div class="stories-container about-section">
          <div class="stories-header">
            <h2><i class="fa-solid fa-circle-info"></i> Tentang Aplikasi Ini</h2>
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
            
            <h3><i class="fa-solid fa-star"></i> Fitur Utama (Sesuai Kriteria Submission):</h3>
            <ul class="feature-list">
              <li><i class="fa-solid fa-mobile-screen"></i> <strong>Installable</strong> - Dapat dipasang di home screen</li>
              <li><i class="fa-solid fa-wifi-slash"></i> <strong>Offline-First</strong> - App Shell & Data Caching</li>
              <li><i class="fa-solid fa-bell"></i> <strong>Push Notifications</strong> - Berlangganan & Menerima notifikasi</li>
              <li><i class="fa-solid fa-bookmark"></i> <strong>Simpan Cerita</strong> - IndexedDB CRUD operations</li>
              <li><i class="fa-solid fa-upload"></i> <strong>Background Sync</strong> - Upload cerita saat offline</li>
            </ul>
          </div>
        </div>

        <div class="map-container about-section">
          <h2><i class="fa-solid fa-code"></i> Teknologi yang Digunakan</h2>
          <ul class="tech-list">
            <li><i class="fa-brands fa-js"></i> Vite</li>
            <li><i class="fa-solid fa-gear"></i> Workbox</li>
            <li><i class="fa-solid fa-database"></i> IndexedDB</li>
            <li><i class="fa-solid fa-map"></i> Leaflet.js</li>
            <li><i class="fa-solid fa-bell"></i> SweetAlert2</li>
            <li><i class="fa-brands fa-font-awesome"></i> Font Awesome</li>
          </ul>
        </div>

      </div>
    `;
  }

  async afterRender() {
    // Tidak ada aksi JavaScript yang diperlukan untuk halaman statis ini.
  }
}
