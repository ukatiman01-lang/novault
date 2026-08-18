# 🚀 DEPLOYMENT INSTRUCTIONS

## Satu-satunya yang perlu Anda lakukan:

### STEP 1: SSH ke VPS
```bash
ssh root@213.199.38.187
```
Password: `Namitaku911`

### STEP 2: Copy-Paste 1 Command Ini (semuanya otomatis)

**Pastikan Anda di luar VPS (local machine)**, jalankan:

```bash
cd d:\novault && scp -r --exclude node_modules --exclude .next --exclude .git . root@213.199.38.187:/opt/nextjs-app/ && ssh root@213.199.38.187 "bash /opt/nextjs-app/deploy-vps.sh"
```

**ATAU jika sudah SSH ke VPS, cukup jalankan:**

```bash
cd /opt/nextjs-app && bash deploy-vps.sh
```

### STEP 3: Tunggu ~10-15 menit

Script akan otomatis:
- ✅ Install Node.js
- ✅ Install Nginx & SSL
- ✅ npm install
- ✅ npm build
- ✅ Setup reverse proxy
- ✅ Setup SSL certificate
- ✅ Start aplikasi

### STEP 4: Buka Browser

```
https://usenovault.fun
```

**DONE! Aplikasi sudah running!** 🎉

---

## Jika ada error, jalankan di VPS:

```bash
tail -f /tmp/nextjs-app.log
```

## Untuk restart aplikasi:

```bash
ssh root@213.199.38.187 "pkill -f 'npm start' && cd /opt/nextjs-app && nohup npm start > /tmp/nextjs-app.log 2>&1 &"
```

---

**⚠️ PENTING: Ganti password VPS Anda setelah deployment selesai!**
