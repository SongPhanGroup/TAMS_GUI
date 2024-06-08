# Hệ thống phát hiện sao chép tài liệu - TAMSV3

### Công nghệ sử dụng

- [VueJS] Xây dựng web app
- Node version: 18.17.1

### Chạy dự án trên local

- Cài đặt dự án

```sh
// Bước 1: Di chuyển vào thư mục làm việc
cd TAMV3

// Bước 2: cài đặt package thư viện
npm install

// Bước 3: chạy ứng dụng
npm run dev
```

- local app: http://localhost:5173


### Các scripts 
```sh
"scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview --port 5050",
    "typecheck": "vue-tsc --noEmit",
    "lint": "eslint . -c .eslintrc.cjs --fix --ext .ts,.js,.cjs,.vue,.tsx,.jsx",
    "build:icons": "tsx src/plugins/iconify/build-icons.ts",
    "msw:init": "msw init public/ --save",
    "postinstall": "npm run build:icons && npm run msw:init"
  },
// Khởi chạy app
npm run dev
### Sửa lỗi

### Cấu trúc dự án
#### Thư mục gốc
- Chứa code frontend

### Quy tắc khi viết code
```
Sau đây là một số quy chuẩn đặt tên thường dùng trong dự án:
- Tên lớp đặt theo PascalCase, ví dụ: UserClass, CategoryClass…
- Tên hàm và phương thức sử dụng camelCase, ví dụ getUser, getCategory…
- Tên biến cũng sử dụng camelCase loginUser, categoryList…
- Tên hằng số thì đặc biệt, viết hoa hết và cách nhau bởi dấu gạch dưới LIST_SUBJECTS,...
```
#### Vuejs 
Gợi ý code vuejs: https://github.com/vuejs/awesome-vue

#### Copyright and license
 Code and Docs released under the MIT License.
