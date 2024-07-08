# Personal Book Note Side Project

# 作品說明
這是一份個人書評紀錄的Side project，紀錄已閱讀的書目佳句及心得。使用者可以在本地註冊或登入，或使用第三方OAuth登入系統。

## 功能
* 畫面左上角的圖示和Personal Book Note可回到首頁。
* 右側為Nav bar選單。
* Login - 本地登入或Google登入。
* Sign up - 本地註冊，需要使用者的名稱、Email及密碼，成功註冊後導向登入頁面。
* Profile & My posts - 登入後的個人頁面和已撰寫書評，並進行書評修改和刪除。
* New post - 張貼新的書評，可撰寫書名、作者、內容、佳句。

## 畫面
![PersonalBookNote1](https://i.ibb.co/wgFBt6F/Personal-Book-Note4.png)
![PersonalBookNote2](https://i.ibb.co/drGN2j4/Personal-Book-Note5.png)
![PersonalBookNote3](https://i.ibb.co/n3hQdWL/Personal-Book-Note6.png)

## 安裝
- Node.js 版本建議為: v20.12.0 以上
- MongoDB 版本建議為: v7.0.9 以上
- Mongosh 版本建議為: v1.10.6 以上

### 安裝套件
npm install
- bcrypt@5.1.1
- connect-flash@0.1.1
- dotenv@16.4.5
- ejs@3.1.10
- express@4.19.2
- express-session@1.18.0
- method-override@3.0.0
- mongoose@8.4.4
- passport@0.7.0
- passport-google-oauth20@2.0.0
- passport-local@1.0.0
- session@0.1.0

### 環境變數設定
請在終端機輸入 `cp .env.example .env` 來複製 .env.example 檔案，並依據 `.env` 內容調整相關欄位。

### 運行專案
Terminal cmd personalNote> node index.js

### 開啟專案
專案運行後，在瀏覽器輸入以下網址，即可看到畫面。
http://localhost:8080/

### 環境變數說明

```env
GOOGLE_CLIENT_ID= #Google用戶端編號
GOOGLE_CLIENT_SECRET= #用戶端密鑰
SESSION_SECRET= #自定義session secret
```

### 資料夾說明
- config - 帳號驗證放置處
- modeles - 資料庫放置處
- modules - 模組放置處
- public - 靜態資源放置處
  - img - svg圖片放置處
  - js - 日期格式放置處
- routes - 網頁路徑放置處
- views - 畫面放置處

### 專案技術
- Node.js v20.12.0
- Bootstrap v5.3.3
- font-awesome v6.5.2

### 第三方服務
 - Google Cloud

## 聯絡作者
您可以透過以下的方式與我聯繫，
我的Gmail信箱: uuya153@gmail.com