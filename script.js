// Konfigurasi Mata Uang
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
};

// Helper: Simpan & Ambil Data LocalStorage
const getDB = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- FUNGSI GLOBAL ---

// 1. Load Nasabah ke Dropdown (untuk halaman Tambah Pinjaman)
function loadNasabahSelect() {
    const nasabah = getDB('nasabahData');
    const select = document.getElementById('inputNamaNasabah');
    if(select) {
        select.innerHTML = '<option value="">Pilih Nasabah...</option>';
        nasabah.forEach(n => {
            const option = document.createElement('option');
            option.value = n.nama;
            option.text = n.nama + ' - ' + n.usaha;
            select.appendChild(option);
        });
    }
}

// 2. Logika Tambah Pinjaman (Kalkulasi Otomatis)
function initKalkulatorPinjaman() {
    const pokok = document.getElementById('pokok');
    const jasaPersen = document.getElementById('jasaPersen');
    const tenor = document.getElementById('tenor'); // Jumlah angsuran
    
    if(pokok) {
        const hitung = () => {
            let p = parseFloat(pokok.value) || 0;
            let j = parseFloat(jasaPersen.value) || 0;
            let t = parseFloat(tenor.value) || 1;
            
            // Jasa Nominal
            let jasaNominal = p * (j / 100);
            // Total Bayar
            let totalBayar = p + jasaNominal;
            // Cicilan per termin
            let cicilan = totalBayar / t;
            
            // Potongan awal
            let tabunganPersen = parseFloat(document.getElementById('tabunganPersen').value) || 0;
            let adminPersen = parseFloat(document.getElementById('adminPersen').value) || 0;
            
            let tabunganNominal = p * (tabunganPersen / 100);
            let adminNominal = p * (adminPersen / 100);
            let diterima = p - tabunganNominal - adminNominal;

            document.getElementById('totalBayar').value = totalBayar;
            document.getElementById('nominalCicilan').value = Math.round(cicilan);
            document.getElementById('uangDiterima').value = diterima;
            document.getElementById('inputTabunganNominal').value = tabunganNominal; // hidden store
        };

        ['pokok', 'jasaPersen', 'tenor', 'tabunganPersen', 'adminPersen'].forEach(id => {
            document.getElementById(id).addEventListener('input', hitung);
        });
    }
}

// 3. Export ke Excel
function exportExcel(tableId, filename) {
    let table = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(table, {sheet: "Sheet 1"});
    XLSX.writeFile(wb, filename + ".xlsx");
}

// 4. Export ke PDF
function exportPDF(elementId, filename) {
    const element = document.getElementById(elementId);
    html2pdf().from(element).save(filename + ".pdf");
}

// 5. Hapus Semua Data
function clearData(key) {
    if(confirm("Yakin ingin menghapus SEMUA data ini?")) {
        localStorage.removeItem(key);
        alert("Data berhasil dihapus");
        location.reload();
    }
}

// --- INIT PAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    loadNasabahSelect();
    initKalkulatorPinjaman();
});
