# Hướng dẫn chạy CI/CD buổi 1

Tài liệu này ghi lại cách chạy project Node.js mẫu theo một pipeline CI/CD đơn giản, đồng thời giải thích các lỗi đã gặp trong lúc thực hành.

## 1. Mục tiêu bài tập

Project mô phỏng các bước cơ bản trong CI/CD:

```text
Source code
  -> Lint
  -> Unit test
  -> Build
  -> Deploy development / staging / production
```

- **CI (Continuous Integration)**: tự động kiểm tra code mỗi khi có thay đổi, thường gồm lint, test và build.
- **CD (Continuous Delivery/Deployment)**: sau khi CI pass, đưa phiên bản build lên các môi trường như development, staging và production.

> Các deploy script trong bài này chỉ mô phỏng bằng thông báo trên terminal; chúng chưa triển khai ứng dụng lên server hoặc cloud thật.

## 2. Cài đặt dependencies

Tại thư mục gốc của project, chạy:

```bash
npm install
```

Lệnh này đọc `package.json` và tải các thư viện mà project cần vào `node_modules`.

Các thông báo như sau không phải lỗi:

```text
packages are looking for funding
found 0 vulnerabilities
```

Nếu Webpack báo thiếu `webpack-cli`, hãy đồng ý cài đặt hoặc chạy:

```bash
npm install -D webpack-cli
```

`webpack-cli` là chương trình dòng lệnh để chạy Webpack qua `npm run build`.

## 3. Xem các lệnh mà project hỗ trợ

Để liệt kê scripts trong `package.json`, dùng:

```bash
npm run
```

Không dùng `npm run list`, vì project không định nghĩa script tên `list`. Khi chạy lệnh đó, npm sẽ báo `Missing script: "list"`.

Các scripts hiện có:

| Lệnh | Vai trò |
| --- | --- |
| `npm test` | Chạy unit test và tạo báo cáo coverage |
| `npm run lint` | Kiểm tra quy tắc/style của JavaScript |
| `npm run build` | Build source code bằng Webpack |
| `npm run deploy:dev` | Mô phỏng deploy lên development |
| `npm run deploy:staging` | Mô phỏng deploy lên staging |
| `npm run deploy:prod` | Mô phỏng deploy lên production |

## 4. Unit test với Jest

Chạy:

```bash
npm test
```

Test trong `src/server.test.js` kiểm tra hàm `greet` trong `src/server.js`.

Ví dụ test yêu cầu kết quả chính xác là:

```js
expect(greet("CI/CD")).toBe("Hello, CI/CD!");
```

Nếu source code trả về `Hello CI/CD` thay vì `Hello, CI/CD!`, test fail. Jest đang giúp phát hiện khác biệt nhỏ trong hành vi ứng dụng trước khi code được build hoặc deploy.

Khi thành công, kết quả cần chứa:

```text
PASS src/server.test.js
Tests: 1 passed
```

Bảng coverage `100%` cho biết toàn bộ câu lệnh và hàm trong `server.js` đã được test chạy qua. Coverage cao không tự động chứng minh ứng dụng không có lỗi, nhưng nó cho biết mức độ code được test.

## 5. Lint với ESLint

Chạy:

```bash
npm run lint
```

ESLint phân tích mã nguồn để phát hiện lỗi phổ biến và các quy tắc code không thống nhất.

Nếu xuất hiện lỗi:

```text
ecmaVersion must be a number or "latest"
```

mở `.eslintrc.cjs` và đặt cấu hình như sau:

```js
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
  },
};
```

Điểm quan trọng: `ecmaVersion` phải là số `2021`, không phải chuỗi `"2021"`.

Sau khi sửa, chạy lại:

```bash
npm run lint
```

Pipeline CI chỉ đi tiếp nếu lệnh này kết thúc mà không có `error`.

## 6. Build với Webpack

Chạy:

```bash
npm run build
```

Webpack lấy entry point `src/index.js`, đóng gói các module liên quan, và tạo artifact build trong thư mục `dist/`.

Kết quả thành công thường có dạng:

```text
asset main.js ... [emitted]
webpack ... compiled successfully
```

Artifact là đầu ra được tạo bởi build. Trong pipeline thật, CI có thể lưu artifact này và CD dùng chính artifact đó để deploy, thay vì build lại một lần nữa.

## 7. Deploy mô phỏng theo môi trường

Sau khi lint, test và build đều pass, chạy:

```bash
npm run deploy:dev
npm run deploy:staging
npm run deploy:prod
```

Đường dẫn đúng trong `package.json` phải bắt đầu bằng `src/` vì các script nằm trong `src/deploy-scripts/`:

```json
"deploy:prod": "node src/deploy-scripts/prod-deploy.js"
```

Nếu thiếu `src/`, Node.js tìm `deploy-scripts/prod-deploy.js` ngay ở thư mục gốc và báo:

```text
Error: Cannot find module ... deploy-scripts/prod-deploy.js
```

Sửa đường dẫn, lưu `package.json`, rồi chạy lại `npm run deploy:prod`.

## 8. Thứ tự chạy chuẩn của pipeline

Trong bài tập này, hãy luôn chạy theo thứ tự:

```bash
npm run lint
npm test
npm run build
npm run deploy:dev
npm run deploy:staging
npm run deploy:prod
```

Lý do: không nên deploy một phiên bản chưa qua kiểm tra. Trong CI/CD thật, nếu lint hoặc test fail, pipeline dừng ở đó và các bước build/deploy phía sau không được phép chạy.

## 9. Checklist hoàn thành

- [ ] `npm install` hoàn tất.
- [ ] `npm run lint` không có error.
- [ ] `npm test` có `PASS`.
- [ ] `npm run build` có `compiled successfully`.
- [ ] Cả ba deploy script chạy được.
- [ ] Hiểu rằng các deploy hiện tại là mô phỏng, chưa có server/cloud thật.
