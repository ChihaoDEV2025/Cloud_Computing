# Hướng dẫn triển khai Node.js Server với PM2 trên Ubuntu

Tài liệu này hướng dẫn tạo và chạy một Node.js HTTP server từ các file mẫu của bài tập. Mục tiêu là hiểu quy trình thủ công trước, sau đó mới tự động hóa bằng CI/CD.

## 1. Mục tiêu sau khi hoàn thành

Sau khi hoàn thành, server Ubuntu sẽ có:

- Ứng dụng Node.js trả về JSON tại port `3000`.
- PM2 quản lý ứng dụng, tự khởi động lại khi process lỗi.
- PM2 chạy ứng dụng ở **cluster mode**.
- Log ứng dụng có thể xem bằng PM2 hoặc file log.
- Ứng dụng được khôi phục sau khi server reboot.

Luồng hoạt động:

```text
Client / curl → port 3000 → PM2 cluster → app/server.js → JSON response
```

## 2. Các file mẫu và chức năng

| File | Vai trò |
| --- | --- |
| `web.js` | HTTP server Node.js. Đây là nội dung chương trình chính được giao. |
| `ecosystem.config.js` | Cấu hình PM2: tên app, cluster mode, port, log và tự restart. |
| `check-node.js` | Kiểm tra Node.js và npm đã cài hay chưa. |
| `check-port.js` | Kiểm tra các port 22, 80, 443 và 3000 trên localhost. |
| `setup-server.js` | Mẫu script tự động cài Node.js, PM2, UFW và tạo cấu trúc thư mục. |

## 3. Lưu ý quan trọng về file mẫu

Trong `setup-server.js`, code mẫu tìm file `server.js`:

```js
const serverCode = fs.readFileSync("server.js", "utf8");
```

Nhưng đề bài được giao file `web.js`. Vì vậy, trong hướng dẫn này ta dùng `web.js` làm nguồn và tự tạo file chạy thật tại `app/server.js`.

Tương tự, cấu hình PM2 phải trỏ đúng file này:

```js
script: "./app/server.js",
```

Không dùng `./server.js` vì file đó không tồn tại ở thư mục gốc dự án.

## 4. Kết nối tới Ubuntu server

Từ máy Windows, mở PowerShell và kết nối SSH:

```powershell
ssh <user>@<ip-server>
```

Ví dụ:

```powershell
ssh chihaomobilee@192.168.1.10
```

Sau khi kết nối, xác nhận hệ điều hành:

```bash
cat /etc/os-release
```

Cập nhật package list:

```bash
sudo apt update
sudo apt upgrade -y
```

## 5. Chép các file mẫu lên server

Trên Windows PowerShell, chạy lệnh sau tại thư mục chứa file mẫu:

```powershell
scp web.js ecosystem.config.js check-node.js check-port.js <user>@<ip-server>:~/
```

Ví dụ:

```powershell
scp web.js ecosystem.config.js check-node.js check-port.js chihaomobilee@192.168.1.10:~/
```

Trên Ubuntu, kiểm tra file đã đến nơi:

```bash
ls -la ~
```

## 6. Cài và kiểm tra Node.js

Chạy script kiểm tra được giao:

```bash
node check-node.js
```

Kiểm tra trực tiếp:

```bash
node --version
npm --version
```

Nếu chưa cài Node.js, cài Node.js 18:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Sau đó kiểm tra lại:

```bash
node --version
npm --version
```

## 7. Tạo cấu trúc dự án

Tạo thư mục dự án và các thư mục con:

```bash
mkdir -p ~/linux-server-devops/app/{logs,public,config}
mkdir -p ~/linux-server-devops/scripts
```

Chuyển các file mẫu vào thư mục dự án:

```bash
mv ~/web.js ~/ecosystem.config.js ~/check-node.js ~/check-port.js ~/linux-server-devops/
cd ~/linux-server-devops
```

Xem cấu trúc thư mục:

```bash
find . -maxdepth 3 -type d
```

Tạo file chương trình chính từ file mẫu:

```bash
cp web.js app/server.js
ls -la app/server.js
```

## 8. Khởi tạo dự án Node.js

Tại thư mục `~/linux-server-devops`, chạy:

```bash
npm init -y
```

Mở file cấu hình dự án:

```bash
nano package.json
```

Sửa trường `scripts` thành:

```json
"scripts": {
  "start": "node app/server.js",
  "test": "node check-node.js"
}
```

Lưu file trong Nano bằng `Ctrl + O`, `Enter`, rồi thoát bằng `Ctrl + X`.

> Ứng dụng hiện chỉ dùng module có sẵn của Node.js (`http` và `os`), nên chưa cần chạy `npm install`.

## 9. Chạy thử bằng Node.js

Chạy chương trình thủ công:

```bash
npm start
```

Kết quả mong đợi:

```text
🚀 Server is running at http://0.0.0.0:3000
```

Mở một terminal SSH thứ hai và kiểm tra endpoint:

```bash
curl -i http://localhost:3000
```

Kết quả cần có:

```text
HTTP/1.1 200 OK
Content-Type: application/json
```

Phần nội dung là JSON, có các trường `message`, `timestamp`, `server` và `request`.

Sau khi kiểm tra xong, quay về terminal đang chạy Node.js và bấm `Ctrl + C` để dừng server thử nghiệm.

## 10. Cài PM2

Cài PM2 toàn cục:

```bash
sudo npm install -g pm2
```

Kiểm tra phiên bản:

```bash
pm2 --version
```

## 11. Sửa cấu hình PM2

Mở file cấu hình:

```bash
nano ecosystem.config.js
```

Tìm dòng cũ:

```js
script: "./server.js",
```

Sửa thành:

```js
script: "./app/server.js",
```

Lý do: file chạy thật nằm ở `app/server.js`. Nếu để `./server.js`, PM2 báo:

```text
Error: Script not found: /home/<user>/linux-server-devops/server.js
```

Lưu bằng `Ctrl + O`, `Enter`, `Ctrl + X`.

## 12. Chạy ứng dụng với PM2

Tại thư mục gốc dự án:

```bash
cd ~/linux-server-devops
pm2 start ecosystem.config.js
pm2 status
```

Kết quả mong đợi là app `devops-server-app` có trạng thái `online`.

### Vì sao có 8 instances?

Trong cấu hình có:

```js
instances: "max",
exec_mode: "cluster",
```

`max` bảo PM2 tạo một process cho mỗi CPU core khả dụng. Server trong bài tập có 8 CPU cores, nên PM2 đã chạy 8 instances. Đây là hành vi đúng, không phải lỗi.

Cluster mode cho phép các process cùng chia sẻ port 3000; PM2 sẽ phân phối request đến các process đó.

## 13. Kiểm tra ứng dụng và log

Kiểm tra HTTP response:

```bash
curl -i http://localhost:3000
```

Xem log trực tiếp:

```bash
pm2 logs devops-server-app
```

Để thoát màn hình log, dùng:

```text
Ctrl + C
```

Không dùng `Ctrl + Z`: phím đó chỉ tạm dừng job xem log, không dừng ứng dụng. Nếu lỡ dùng `Ctrl + Z`, xem job bị tạm dừng:

```bash
jobs
```

Sau đó kết thúc job đó, ví dụ job số 1:

```bash
kill %1
```

### Vị trí file log thực tế

Trong `ecosystem.config.js`, log dùng đường dẫn `./logs/...`. Vì PM2 được khởi động tại `~/linux-server-devops`, log nằm ở:

```bash
ls -la ~/linux-server-devops/logs
tail -n 30 ~/linux-server-devops/logs/out-0.log
```

Thư mục `app/logs` trống là bình thường với cấu hình hiện tại. Nó chỉ là thư mục đã tạo trong cấu trúc ứng dụng, nhưng PM2 không được cấu hình để ghi vào đó.

## 14. Kiểm tra port

Chạy file mẫu:

```bash
node check-port.js
```

Kết quả mong đợi:

- Port `3000 (Node.js App)`: `Starting`.
- Port 22, 80 hoặc 443 có thể báo đóng nếu dịch vụ tương ứng chưa chạy. Điều đó bình thường.

## 15. Firewall UFW

Chỉ thực hiện nếu server dùng UFW và cần truy cập app từ máy khác.

Kiểm tra trạng thái firewall:

```bash
sudo ufw status
```

Luôn cho phép SSH trước khi bật firewall:

```bash
sudo ufw allow OpenSSH
```

Cho phép ứng dụng Node.js nhận request tại port 3000:

```bash
sudo ufw allow 3000/tcp
```

Nếu UFW chưa bật:

```bash
sudo ufw enable
```

Kiểm tra lại:

```bash
sudo ufw status numbered
```

Nếu dùng cloud provider, bạn cũng phải mở TCP port 3000 trong network firewall/security group của provider đó.

## 16. Kiểm tra từ máy khác

Trên máy Windows, mở PowerShell:

```powershell
curl http://<ip-server>:3000
```

Nếu nhận JSON thì ứng dụng đã truy cập được từ bên ngoài Ubuntu server.

## 17. Tự khởi động lại sau reboot

Lưu danh sách process PM2:

```bash
pm2 save
```

Tạo service khởi động PM2:

```bash
pm2 startup
```

PM2 sẽ in một lệnh `sudo env ...`. Copy **nguyên văn** lệnh đó và chạy nó. Cuối cùng lưu lại lần nữa:

```bash
pm2 save
pm2 status
```

Sau này có thể kiểm tra qua reboot:

```bash
sudo reboot
```

Sau khi server lên lại và SSH vào được:

```bash
pm2 status
curl -i http://localhost:3000
```

## 18. Các lệnh PM2 quan trọng

```bash
pm2 status
pm2 logs devops-server-app
pm2 restart devops-server-app
pm2 reload devops-server-app
pm2 stop devops-server-app
pm2 delete devops-server-app
pm2 save
```

- `restart`: dừng và khởi động lại process.
- `reload`: nạp lại app cluster theo cách hạn chế gián đoạn request; phù hợp khi deploy.
- `stop`: dừng app nhưng vẫn giữ cấu hình trong danh sách PM2.
- `delete`: xóa app khỏi danh sách PM2.

## 19. Dùng `setup-server.js` trong tương lai

Không nên chạy script này trên server đang hoạt động mà chưa đọc code, vì nó có thể cài lại Node.js/PM2 và tự bật UFW.

Trước khi dùng nó cho server mới, sửa tham chiếu file nguồn trong `setup-server.js`:

```js
const serverCode = fs.readFileSync("web.js", "utf8");
```

Và cần bảo đảm cấu hình PM2 sử dụng:

```js
script: "./app/server.js",
```

Khi đã hiểu các bước thủ công, script tự động hóa mới giúp tiết kiệm thời gian và giảm lỗi lặp lại.

## 20. Định hướng CI/CD tiếp theo

Phần hiện tại là **CD thủ công**: bạn tự đưa source lên server và PM2 chạy ứng dụng. Bước tiếp theo sẽ là chuyển thành CI/CD.

Luồng đề xuất:

```text
Git push
  → GitHub Actions chạy kiểm tra Node.js
  → GitHub Actions SSH vào Ubuntu
  → cập nhật source code
  → pm2 reload devops-server-app
  → curl kiểm tra endpoint
```

Các file sẽ cần tạo ở bài tiếp theo:

```text
.github/workflows/deploy.yml
.gitignore
package.json
```

Không đưa mật khẩu hoặc private SSH key trực tiếp vào repository. CI/CD cần lưu chúng trong GitHub Secrets.

## 21. Checklist hoàn thành

Chạy các lệnh sau để xác nhận bài thực hành thành công:

```bash
node --version
npm --version
pm2 status
curl -i http://localhost:3000
node check-port.js
sudo ufw status
pm2 save
```

Điều kiện hoàn thành:

- `pm2 status` hiển thị `devops-server-app` là `online`.
- `curl` trả HTTP `200 OK` và JSON.
- `check-port.js` báo port 3000 đang hoạt động.
- `pm2 save` hoàn tất không có lỗi.
