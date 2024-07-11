# Menggunakan base image node dengan versi Alpine untuk ukuran yang lebih kecil
FROM node:20.11.0-alpine

# Menetapkan direktori kerja di dalam container
WORKDIR /express-docker

# Menyalin package.json dan package-lock.json untuk instalasi dependencies
COPY package*.json ./

# Menginstal dependencies
RUN npm install --production

# Menyalin semua file proyek ke direktori kerja
COPY . .

# Menetapkan environment variable NODE_ENV sebagai production
ENV NODE_ENV=production

# Mengekspos port aplikasi
EXPOSE 5000

# Menjalankan aplikasi
CMD ["node", "index.js"]