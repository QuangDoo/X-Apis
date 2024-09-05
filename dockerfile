# Sử dụng Node.js image chính thức
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chạy lệnh build (nếu bạn đang sử dụng TypeScript)
RUN npm run build

# Mở cổng ứng dụng (nếu cần)
EXPOSE 4000

# Khởi động ứng dụng
CMD ["npm", "start"]
