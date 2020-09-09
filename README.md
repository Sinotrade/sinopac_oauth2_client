
[![N|Solid](https://www.sinotrade.com.tw/img/theme/sino_logo.png)](https://www.sinotrade.com.tw/newweb)

<a id='top'></a>
## Table of Contents

1. [install](#install)
2. [整合Sinopac Login 與 Web app](#integration)
3. [要求授權](#requestAuth)
4. [取得 Access Token](#accessToken)
5. [透過 Access Token 取得 API Token](#getApiToken)

<a id='install'></a>
# Installation and Setup

1. install node > 12
2. Clone this Repo
3. `cd` into the project root folder, and run `npm install`
4. Run `npm run dev` to boot up the oauth client
4. open [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

[back](#top)

<a id='integration'></a>
## 整合Sinopac Login 與 Web app

使用Sinopac Login登入網站流程是以[OAuth 2.0 授權碼核發流程 (authorization code grant flow)](https://tools.ietf.org/html/rfc6749)為基礎。開發者需透過Server發出request，接收來自 Sinopac Platform 資料。

[back](#top)

<a id='requestAuth'></a>
## 要求授權

為進行使用者認證，並為 app 要求權限，請將 query parameter帶入，將使用者重新導向至授權 URL，如下:
```sh
https://webrd.sinotrade.com.tw/oauth2/login?response_type=code&grant_type=authorization_code&client_id=xxx&redirect_uri=xxx&state=xxx
```
URL 請包含下列所需的 query parameter：
| Parameter| 說明 |
| ------ | ------ |
| `response_type`| 指定永豐金證券回傳授權碼，此值必須是 `code`|
| `grant_type` | 連線應用程式要求的OAuth 2.0 授與類型，此值必須是 `authorization_code` |
| `client_id` |由永豐金證券提供廠商代號|
| `redirect_uri` | Callback URL。使用者於認證及授權後，將被重新導向至此 URL 頁面 |
| `state`|專屬的 alphanumeric string，用於防止跨站請求偽造 (cross-site request forgery)。此值應由開發者的應用隨機產生。URL 編碼字串不適用|

### 測試登入帳號及密碼
AUTHUSER01 / 2222

### 認證與授權流程

當使用者被導向至授權URL，Sinopac Platform 將自動檢視使用者是否於 NewWeb 有登入時效。

#### 當使用者未登入 NewWeb
![image](https://github.com/Sinotrade/sinopac_oauth2_client/blob/master/images/login.png)

#### 使用者已登入 NewWeb
![image](https://github.com/Sinotrade/sinopac_oauth2_client/blob/master/images/continue-login.png)

### 取得授權碼
![image](https://github.com/Sinotrade/sinopac_oauth2_client/blob/master/images/auth.png)

當完成使用者認證與授權，HTTP status code `302` 與回傳 callback URL ，將包含下列 query parameter：
| Parameter| 說明 |
| ------ | ------ |
| `code` |用以取得 access token 的授權碼，效期為 5 分鐘。此授權碼僅能使用一次。 |
| `state`| `state` parameter，包含於 original request authorization URL 中。開發者應確認此值與 original request 的值相符。 |

Response 範例：
```sh
HTTP/1.1 302 Found
https://client.example.com/callback?code=xxx&state=xxx
```
[back](#top)

<a id='accessToken'></a>
## 取得 Access Token
為取得 access token，請以授權碼提交 HTTP POST request。取得 access token 後，開發者便可將其用於呼叫 API。此 access token 是透過下列 endpoint 發佈：

[back](#top)

### Request
```
POST https://webrd.sinotrade.com.tw/oauth2/token
```
| Request header| 說明 |
| ------ | ------ |
| Content 類型|application/x-www-form-urlencoded |

### Request Body
| Request header| 說明 |
| ------ | ------ |
| `grant_type`|`authorization_code` 指定授權類型。 |
| `code`|授權碼 |
| `redirect_uri`|Callback URL|
| `client_id`|由永豐金證券提供 client_id |
| `client_secret`|由永豐金證券提供 client_secret  |

#### 範例 Request
HTTP POST request 取得 access token 的範例：
```
curl -X POST https://webrd.sinotrade.com.tw/oauth2/token \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'grant_type=authorization_code' \
-d 'code=xxx' \
-d 'redirect_uri=xxx' \
-d 'client_id=xxx' \
-d 'client_secret=xxx'
```
### Response
Sinopac Platform 驗證 request 並核發 access token 及下表中的資料。

| Property| 類型 | 說明 |
| ------ | ------ |------ |
| `access_token`|String|Access token。效期為 1 天。 |
| `expires_in`|Number|Access token 到期前的時間 (以秒為單位)。|
| `refresh_token`|String|用於取得新 access token 的 token。Access token 到期後 1 天內有效。|
| `token_type`|String|`Bearer` |

JSON response 範例：
```
{
	access_token: "b9b8944cf349372d595f8a8152914fddcdfb84da",
	token_type: "Bearer",
	expires_in: 86399,
	refresh_token: "c106731f869b05dced9972c6274f9890e1c49dd0"
}
```

<a id='getApiToken'></a>
## 透過 Access Token 取得 API Token
Sinopac Platform 將會依照權限設定提供各 API Token。

[back](#top)

