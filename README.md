# THU Cats

部署你的猫咪图鉴小程序

## 如何使用

### 账号准备

* 注册微信小程序账号，并记录AppID和Deploy Key，可以把AppID理解为小程序环境的账号，把AppSecretKey理解为密码，请把它们记录下来，并**请勿泄露后者**，包括但不限于把后者存在公开的Git仓库里然后发布到网上
* 注册腾讯云Cloudbase账号，创建一个云开发环境，并记录其环境ID(envID)
  * 设置计费模式为按量计费，之后的云资源会产生计费，请知悉。具体计费规则参考官方文档
  * 在访问管理/API密钥管理中，新建一对密钥，这会产生SecretId和SecretKey两个值，同样记录它们，并记住**切勿泄露后者**，拥有这对值的用户将拥有所有所有资源的访问权限

### 开始部署

#### CMS

* 一键部署CMS，选择已有环境，设置管理员账号密码
* 登录CMS，导入模型

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
