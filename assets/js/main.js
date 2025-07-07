// Menunggu hingga seluruh konten halaman siap sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {

    // Fungsi untuk Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            if (passwordInput) {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                
                // Update ikon mata
                const svg = this.querySelector('svg');
                if (svg) {
                    if (isPassword) {
                        // Ikon untuk mata tercoret (password terlihat)
                        svg.innerHTML = `
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1 1l22 22" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        `;
                    } else {
                        // Ikon untuk mata normal (password tersembunyi)
                        svg.innerHTML = `
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        `;
                    }
                }
            }
        });
    });

    // Validasi form pendaftaran
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah form dikirim secara default
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Password dan konfirmasi password tidak cocok!');
                return;
            }
            
            if (password.length < 8) {
                alert('Password harus minimal 8 karakter!');
                return;
            }
            
            alert('Pendaftaran berhasil! Email verifikasi telah dikirim ke ' + email);
        });
    }
    
    // --- BAGIAN YANG DIPERBAIKI ---
    // Logika navigasi yang lebih spesifik menggunakan ID

    // Cari tombol untuk ke halaman Login (hanya ada di register.html)
    const goToLoginButton = document.getElementById('goToLogin');
    if (goToLoginButton) {
        goToLoginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    // Cari tombol untuk ke halaman Register (hanya ada di login.html)
    const goToRegisterButton = document.getElementById('goToRegister');
    if (goToRegisterButton) {
        goToRegisterButton.addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
});