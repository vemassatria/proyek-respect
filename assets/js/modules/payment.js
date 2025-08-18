/**
 * assets/js/modules/payment.js
 * Modul untuk menangani halaman pembayaran (payment.php) dan pendaftaran gratis (free-registration.php).
 */

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
        // Event listener untuk checkbox kategori lomba
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

        // Event listener untuk stepper merchandise
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
                if(quantityElement) {
                    const updatedItem = cart.find(ci => ci.id === itemId && ci.type === 'merchandise');
                    quantityElement.textContent = updatedItem ? updatedItem.quantity : 0;
                }
                updateTotal();
            }
        });
    }
    
    function showPaymentPopup(details) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        const totalFormatted = Number(details.total).toLocaleString('id-ID');
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <h2>Instruksi Pembayaran</h2>
                <div class="payment-info">
                    <p>Silakan transfer sejumlah: <strong class="total-payment">Rp ${totalFormatted}</strong></p>
                    <p>Jumlah tersebut sudah termasuk kode unik <strong>${details.kode_unik}</strong> untuk verifikasi.</p>
                    <hr style="margin: 1rem 0;">
                    <p>Ke nomor rekening berikut: <strong>${details.rekening}</strong></p>
                </div>
                <button id="confirm-and-close" class="btn-confirm-payment">Saya Mengerti, Lanjutkan</button>
            </div>`;
        document.body.appendChild(modalOverlay);
        setTimeout(() => modalOverlay.classList.add('active'), 10);
        document.getElementById('confirm-and-close').addEventListener('click', () => {
            window.location.href = 'transactions.php';
        });
    }

    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) return alert("Keranjang Anda kosong. Silakan pilih item terlebih dahulu.");
        
        const checkoutData = { competition_id: competitionId, items: cart };

        fetch('api/process_checkout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkoutData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showPaymentPopup(data.paymentDetails);
            } else {
                alert(data.message);
            }
        }).catch(error => console.error('Error saat checkout:', error));
    });

    function loadPaymentOptions() {
        if (!competitionId) return alert("ID Kompetisi tidak ditemukan.");
        
        fetch(`api/get_payment_options.php?id=${competitionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
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

    freeRegisForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const competitionId = urlParams.get('id');
        if (!competitionId) return alert("ID kompetisi tidak ditemukan.");

        const formData = new FormData(this);
        formData.append('competition_id', competitionId);

        fetch('api/submit_free_req.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                window.location.href = 'transactions.php';
            }
        })
        .catch(error => {
            console.error('Error saat submit pendaftaran gratis:', error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        });
    });
}

// Fungsi inisialisasi utama untuk modul ini
export function initPayment() {
    handlePaidRegistration();
    handleFreeRegistration();
}