# THU Cats

部署你的猫咪图鉴小程序

## 如何使用

### 账号准备

#### 微信小程序账号

* 注册微信小程序账号

* 记录AppID和Deploy Key，并**请勿泄露后者**，包括但不限于把后者存在公开的Git仓库里然后发布到网上。

  小程序appid是一个微信小程序的关键标识信息，可以在开发者后台的开发栏目里看到，如下图所示：
  ![img](https://main.qcloudimg.com/raw/61b1b135b6bc09b82b23d9bfae38d391.png)
  而小程序代码上传密钥，在appid的信息下方，点击生成按钮，经过微信验证下载密钥文件，另外，代码上传的IP白名单需要关闭。
  ![img](https://main.qcloudimg.com/raw/88dc82230f9b69e27f1d0579a3530b26.png)

#### 腾讯云Cloudbase账号

* 注册Cloudbase账号
* 创建一个新的按量付费环境
* 在访问管理/API密钥管理中，新建一对密钥，这会产生SecretId和SecretKey两个值，同样记录它们，并记住**切勿泄露后者**，拥有这对值的用户将拥有所有所有资源的访问权限

### 开始部署

#### CMS

* Cloudbase控制台，扩展能力-扩展应用-CMS内容管理系统

#### 小程序端

* [小程序部署密钥转换小工具](https://framework-1258016615.tcloudbaseapp.com/mp-key-tool/)

<a href="https://console.cloud.tencent.com/tcb/env/index?&action=CreateAndDeployCloudBaseProject&appUrl=https://github.com/BlackCloud37/thucats&branch=release" target="_blank" rel="noopener noreferrer"><img src="https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg"></a>

## 工程化

- [x] eslint
  - [x] 规则集优化
- [x] prettier
- [x] vscode settings
- [x] husky
- [x] lint in CI
- [x] rematch
- [x] typescript 云函数
- [x] UI库
  - [x] lin-ui
- [x] 数据库定义
  - [x] 添加schema验证

## 开发环境

- VS Code
  - `ESLint`，`Prettier - Code formatter`，`Prettier ESLint`插件
