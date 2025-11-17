import "../../../styles/form.css";
import L from "leaflet";
import { addNewStory } from "../../data/api";
import Swal from "sweetalert2";

class AddStoryPage {
  async render() {
    return `
      <div class="page-title container">
        <h1>Tambah Cerita Baru</h1>
        <p class="page-subtitle">Bagikan momen spesialmu dengan dunia</p>
      </div>
      
      <div class="form-wrapper container">
        <div class="form-container-modern">
          <form id="addStoryForm">
            <div class="form-group">
              <label for="description">
                <i class="fa-solid fa-pen"></i> Deskripsi Cerita
              </label>
              <textarea 
                id="description" 
                name="description" 
                rows="5" 
                placeholder="Ceritakan pengalamanmu di sini..."
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="photo">
                <i class="fa-solid fa-image"></i> Unggah Foto
              </label>
              <div class="file-input-wrapper">
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  accept="image/*" 
                  required
                >
                <div class="file-input-display">
                  <i class="fa-solid fa-cloud-arrow-up fa-2x"></i>
                  <span id="file-name">Pilih foto (Max 1MB)</span>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>
                <i class="fa-solid fa-map-pin"></i> Pilih Lokasi di Peta (Opsional)
              </label>
              <div id="location-map" class="location-map-container"></div>
              <p id="coords-display" class="coords-display">
                <i class="fa-solid fa-location-dot"></i> 
                Klik peta untuk menandai lokasi
              </p>
            </div>
            
            <button type="submit" class="btn btn-submit" id="submitButton">
              <i class="fa-solid fa-paper-plane"></i> Kirim Cerita
            </button>
          </form>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Setup file input preview
    const photoInput = document.querySelector("#photo");
    const fileNameDisplay = document.querySelector("#file-name");

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        fileNameDisplay.textContent = file.name;
        fileNameDisplay.style.color = "#667eea";
      }
    });

    // Setup map
    const map = L.map("location-map").setView([-6.2088, 106.8456], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let selectedLat = null;
    let selectedLon = null;
    let marker = null;
    const coordsDisplay = document.querySelector("#coords-display");

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      selectedLat = lat;
      selectedLon = lng;

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);
      coordsDisplay.innerHTML = `
        <i class="fa-solid fa-location-dot"></i> 
        Lokasi dipilih: <strong>Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(
        4
      )}</strong>
      `;
      coordsDisplay.style.color = "#28a745";
    });

    // Form submission
    const addStoryForm = document.querySelector("#addStoryForm");
    const submitButton = document.querySelector("#submitButton");
    const loadingIndicator = document.querySelector("#loading-indicator");

    addStoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      loadingIndicator.classList.remove("hidden");
      submitButton.disabled = true;

      try {
        const description = event.target.description.value;
        const photo = event.target.photo.files[0];

        if (photo && photo.size > 1000000) {
          Swal.fire({
            title: "Oops...",
            text: "Ukuran file gambar tidak boleh lebih dari 1 MB!",
            icon: "error",
            confirmButtonColor: "#667eea",
          });
          return;
        }

        if (!description || !photo) {
          Swal.fire({
            title: "Oops...",
            text: "Deskripsi dan foto tidak boleh kosong!",
            icon: "error",
            confirmButtonColor: "#667eea",
          });
          return;
        }

        await addNewStory({
          description,
          photo,
          lat: selectedLat,
          lon: selectedLon,
        });

        Swal.fire({
          title: "Berhasil!",
          text: "Cerita berhasil ditambahkan!",
          icon: "success",
          confirmButtonColor: "#667eea",
        });

        window.location.hash = "#/home";
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          Swal.fire({
            title: "Berhasil (Offline)!",
            text: "Cerita berhasil disimpan dan akan diunggah otomatis saat Anda kembali online.",
            icon: "info",
            confirmButtonColor: "#667eea",
          });

          window.location.hash = "#/home";
        } else {
          Swal.fire({
            title: "Gagal Menambahkan Cerita",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#667eea",
          });
        }
      } finally {
        loadingIndicator.classList.add("hidden");
        submitButton.disabled = false;
      }
    });
  }
}
export default AddStoryPage;
