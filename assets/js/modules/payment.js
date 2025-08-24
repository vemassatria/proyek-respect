/**
 * assets/js/modules/payment.js
 * Modul untuk menangani halaman pembayaran (payment.php) dan pendaftaran gratis (free-registration.php).
 */

import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.2/src/sweetalert2.js';

// --- BAGIAN UNTUK HALAMAN PEMBAYARAN BERBAYAR (payment.php) ---
function handlePaidRegistration() {
    const paymentContainer = document.getElementById('payment-container');
    if (!paymentContainer) return;

    const competitionItemsContainer = document.getElementById('competition-items-container');
    const merchandiseContainer = document.getElementById('merchandise-items-container');
    const totalCostElement = document.getElementById('total-cost');
    const checkoutButton = document.getElementById('process-checkout-btn');
    const urlParams = new URLSearchParams(window.location.search);
    const competitionId = urlParams.get('id');
    let cart = [];

    function updateTotal() {
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalCostElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    function handleItemSelection() {
        competitionItemsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('checkout-checkbox')) {
                const itemData = e.target.dataset;
                const itemId = parseInt(itemData.id);
                cart = cart.filter(ci => !(ci.id === itemId && ci.type === 'competition'));
                if (e.target.checked) {
                    cart.push({ id: itemId, name: itemData.name, price: parseFloat(itemData.price), quantity: 1, type: itemData.type });
                }
                updateTotal();
            }
        });

        merchandiseContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('stepper-btn')) {
                const itemData = e.target.dataset;
                const itemId = parseInt(itemData.id);
                let itemInCart = cart.find(ci => ci.id === itemId && ci.type === 'merchandise');

                if (e.target.classList.contains('plus')) {
                    if (itemInCart) itemInCart.quantity++;
                    else cart.push({ id: itemId, name: itemData.name, price: parseFloat(itemData.price), quantity: 1, type: itemData.type });
                } else if (e.target.classList.contains('minus') && itemInCart) {
                    itemInCart.quantity--;
                }

                cart = cart.filter(ci => ci.quantity > 0);
                const quantityElement = document.getElementById(`quantity-${itemId}`);
                if (quantityElement) {
                    const updatedItem = cart.find(ci => ci.id === itemId && ci.type === 'merchandise');
                    quantityElement.textContent = updatedItem ? updatedItem.quantity : 0;
                }
                updateTotal();
            }
        });
    }

    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            return Swal.fire('Keranjang Kosong', 'Silakan pilih item lomba atau merchandise terlebih dahulu.', 'warning');
        }
        
        const checkoutData = { competition_id: competitionId, items: cart };
        this.disabled = true;
        this.textContent = 'Memproses...';

        fetch('api/process_checkout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkoutData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const totalFormatted = Number(data.paymentDetails.total).toLocaleString('id-ID');
                Swal.fire({
                    title: 'Instruksi Pembayaran',
                    html: `
                        <div style="text-align: left; padding: 0 1rem;">
                            <p>Silakan transfer sejumlah:</p>
                            <h3 style="color: var(--danger-color);">Rp ${totalFormatted}</h3>
                            <p>Jumlah tersebut sudah termasuk kode unik <strong>${data.paymentDetails.kode_unik}</strong> untuk verifikasi.</p>
                            <hr style="margin: 1rem 0;">
                            <p>Ke nomor rekening berikut:</p>
                            <strong>${data.paymentDetails.rekening}</strong>
                        </div>`,
                    icon: 'info',
                    confirmButtonText: 'Saya Mengerti, Lanjutkan'
                }).then(() => {
                    window.location.href = 'transactions.php';
                });
            } else {
                Swal.fire('Checkout Gagal', data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error saat checkout:', error);
            Swal.fire('Error', 'Tidak dapat terhubung ke server.', 'error');
        })
        .finally(() => {
            this.disabled = false;
            this.textContent = 'Selesaikan Pembayaran';
        });
    });

    function loadPaymentOptions() {
        if (!competitionId) return Swal.fire('Error', 'ID Kompetisi tidak ditemukan di URL.', 'error');
        
        fetch(`api/get_payment_options.php?id=${competitionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // ... (Kode untuk memuat item tetap sama)
                    data.data.competition_items.forEach(item => {
                        competitionItemsContainer.innerHTML += `
                            <div class="checkout-item">
                                <label class="checkout-label">
                                    <input type="checkbox" class="checkout-checkbox" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="competition"> ${item.item_name}
                                </label>
                                <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                            </div>`;
                    });
                    data.data.merchandise.forEach(item => {
                        merchandiseContainer.innerHTML += `
                            <div class="checkout-item merchandise">
                                <div class="item-info">
                                    <p>${item.item_name}</p>
                                    <span>Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                                </div>
                                <div class="quantity-stepper">
                                    <button class="stepper-btn minus" data-id="${item.id}" data-type="merchandise">-</button>
                                    <span id="quantity-${item.id}">0</span>
                                    <button class="stepper-btn plus" data-id="${item.id}" data-name="${item.item_name}" data-price="${item.price}" data-type="merchandise">+</button>
                                </div>
                            </div>`;
                    });
                    handleItemSelection();
                }
            }).catch(error => console.error('Error memuat opsi pembayaran:', error));
    }
    
    loadPaymentOptions();
}

// --- BAGIAN UNTUK HALAMAN PENDAFTARAN GRATIS (free-registration.php) ---
function handleFreeRegistration() {
    const freeRegisForm = document.getElementById('free-regis-form');
    if (!freeRegisForm) return;

    // Logika untuk pratinjau gambar
    freeRegisForm.querySelectorAll('.file-input-requirement').forEach(input => {
        input.addEventListener('change', function() {
            const previewTargetId = this.dataset.previewTarget;
            const previewContainer = document.getElementById(previewTargetId);
            const previewImage = previewContainer.querySelector('img');

            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewContainer.style.display = 'block';
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    });

    // Logika submit form
    freeRegisForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');
        if (!competitionId) return Swal.fire('Error', 'ID kompetisi tidak ditemukan.', 'error');

        const formData = new FormData(this);
        formData.append('competition_id', competitionId);
        
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Mengirim...';

        fetch('api/submit_free_req.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Pendaftaran Berhasil!',
                    text: 'Tim kami akan segera memvalidasi persyaratan Anda.',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = 'transactions.php';
                });
            } else {
                Swal.fire('Gagal!', data.message || 'Terjadi kesalahan.', 'error');
            }
        })
        .catch(error => {
            console.error('Error saat submit pendaftaran gratis:', error);
            Swal.fire('Error', 'Tidak dapat terhubung ke server.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Persyaratan';
        });
    });
}

// Fungsi inisialisasi utama untuk modul ini
export function initPayment() {
    handlePaidRegistration();
    handleFreeRegistration();
}