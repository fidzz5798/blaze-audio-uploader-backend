<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roblox Audio Uploader - Powered by BLAZE SQUAD</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        body {
            background-color: #0F0F0F;
            color: #F5F5F5;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .text-gold-gradient {
            background: -webkit-linear-gradient(45deg, #D4AF37, #F2D06B, #D4AF37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
</head>
<body class="min-h-screen p-4 sm:p-8 flex flex-col justify-between">

    <!-- HEADER -->
    <header class="max-w-4xl w-full mx-auto flex justify-between items-center pb-6 border-b border-red-950/40">
        <div class="text-xl font-extrabold tracking-wider text-gold-gradient">BLAZE SQUAD <span class="text-xs text-amber-500 font-semibold uppercase tracking-widest block sm:inline sm:ml-2">/// DEV TOOLS</span></div>
        <span class="text-xs text-gray-500 font-mono">v1.0.0 Stable</span>
    </header>

    <!-- MAIN DASHBOARD -->
    <main class="max-w-2xl w-full mx-auto bg-[#161616] my-6 p-6 sm:p-8 rounded-2xl border border-red-950/40 shadow-2xl">
        <h2 class="text-2xl font-bold mb-2 text-white">Roblox Audio <span class="text-gold-gradient">Uploader</span></h2>
        <p class="text-sm text-gray-400 mb-6">Alat bantu upload file musik (.mp3 / .ogg) langsung ke Akun atau Group Roblox Anda sendiri secara aman via Open Cloud API.</p>

        <!-- FORM UPLOAD -->
        <form id="uploadForm" class="space-y-4">
            
            <!-- KREDENSIAL USER -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Roblox API Key Anda</label>
                    <input type="password" id="apiKey" placeholder="Paste x-api-key Anda di sini" required
                        class="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-xl focus:outline-none focus:border-red-600 text-white transition text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Target ID (User / Group)</label>
                    <input type="text" id="targetId" placeholder="Contoh: 752563033" required
                        class="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-xl focus:outline-none focus:border-red-600 text-white transition text-sm">
                </div>
            </div>

            <!-- PILIHAN TARGET TYPE -->
            <div>
                <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Jenis Pemilik Tujuan</label>
                <select id="targetType" class="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-xl focus:outline-none focus:border-red-600 text-white transition text-sm cursor-pointer">
                    <option value="group">Group Roblox (Group ID)</option>
                    <option value="user">Akun Personal (User ID)</option>
                </select>
            </div>

            <!-- NAMA ASET -->
            <div>
                <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nama Aset / Judul Lagu</label>
                <input type="text" id="audioTitle" placeholder="Contoh: BLAZE SQUAD Theme Song V1" required
                    class="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-800 rounded-xl focus:outline-none focus:border-red-600 text-white transition text-sm">
            </div>

            <!-- AREA DROP FILE -->
            <div>
                <label class="block text-xs font-bold uppercase text-gray-400 mb-2">File Audio (.mp3 / .ogg)</label>
                <div class="border-2 border-dashed border-gray-800 hover:border-red-600/50 rounded-xl p-6 text-center bg-[#0F0F0F] cursor-pointer transition relative group">
                    <input type="file" id="audioFile" accept=".mp3,.ogg" required
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <div class="space-y-2">
                        <span class="text-2xl block group-hover:scale-110 transition duration-200">🎙️</span>
                        <p id="fileNameDisplay" class="text-sm text-gray-400 font-medium">Klik atau seret file audio ke sini</p>
                        <p class="text-xs text-gray-600">Maks. 20 MB / Kuota gratis akun Anda berlaku</p>
                    </div>
                </div>
            </div>

            <!-- TOMBOL SUBMIT -->
            <button type="submit" id="submitBtn"
                class="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-900/40 transition duration-200 text-sm flex justify-center items-center gap-2">
                🚀 Upload ke Roblox
            </button>
        </form>

        <!-- STATUS BOX & PREVIEW -->
        <div id="statusBox" class="mt-4 p-4 rounded-xl text-sm hidden"></div>
    </main>

    <!-- FOOTER -->
    <footer class="text-center text-gray-600 text-xs py-2">
        &copy; 2026 Powered by <span class="text-gray-400 font-bold">BLAZE SQUAD Developer Tools</span>. Secured via Client-Side Request.
    </footer>

    <!-- LOGIKA JAVASCRIPT FIXED -->
    <script>
        const audioFileInput = document.getElementById('audioFile');
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        const uploadForm = document.getElementById('uploadForm');
        const submitBtn = document.getElementById('submitBtn');
        const statusBox = document.getElementById('statusBox');

        audioFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) fileNameDisplay.textContent = file.name;
        });

        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const apiKey = document.getElementById('apiKey').value.trim();
            const targetId = document.getElementById('targetId').value.trim();
            const targetType = document.getElementById('targetType').value;
            const title = document.getElementById('audioTitle').value;
            const file = audioFileInput.files[0];

            if (!file || !apiKey || !targetId) return;

            const formData = new FormData();
            formData.append('audio', file);
            formData.append('apiKey', apiKey);
            formData.append('targetId', targetId);
            formData.append('targetType', targetType);
            formData.append('title', title);

            submitBtn.disabled = true;
            submitBtn.innerHTML = `⏳ Sedang Mengupload...`;
            statusBox.className = "mt-4 p-4 rounded-xl text-sm bg-amber-950/40 text-amber-400 block";
            statusBox.textContent = "Lagu sedang diproses oleh backend laptop Anda. Jangan tutup halaman ini...";

            try {
                // FETCH UTAMA YANG SUDAH DIPERBAIKI SINTAKSISNYA
                const response = await fetch("http://localhost:5000/api/upload-audio", {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    statusBox.className = "mt-4 p-4 rounded-xl text-sm bg-green-950/40 text-green-400 block";
                    statusBox.innerHTML = `<strong>✅ BERHASIL DIUPLOAD!</strong><br>Aset telah masuk ke antrean Roblox.<br>Asset ID: ${result.assetId || "-"}`;
                } else {
                    throw new Error(result.message || JSON.stringify(result));
                }

            } catch (error) {
                statusBox.className = "mt-4 p-4 rounded-xl text-sm bg-red-950/40 text-red-400 block";
                statusBox.innerHTML = `<strong>❌ UPLOAD GAGAL!</strong><br>Penyebab: ${error.message}`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `🚀 Upload ke Roblox`;
            }
        });
    </script>
</body>
</html>