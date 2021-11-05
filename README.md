# THU Cats

部署你的猫咪图鉴小程序

## 如何使用

### 账号准备

#### 微信小程序账号

1. 注册微信小程序账号，[官网](https://mp.weixin.qq.com)，绑定身份信息等，随后进入小程序账号主页
2. 在图中入口处找到自己的AppID，并记录下来
   ![img](https://main.qcloudimg.com/raw/61b1b135b6bc09b82b23d9bfae38d391.png)

3. 再点击右下角IP白名单的按钮，将其关闭
   ![img](https://main.qcloudimg.com/raw/88dc82230f9b69e27f1d0579a3530b26.png)

4. 最后点击右下角小程序代码上传密钥的**生成**(也有可能是**重置**)按钮，生成完之后会有一个下载，将生成的文件下到本地，文件名通常是`private.appid.key`

#### 腾讯云Cloudbase账号

1. 注册Cloudbase账号，[官网](https://www.cloudbase.net)，并前往控制台

2. 创建一个新的按量付费环境

   <img src="https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105004658935.png" alt="image-20211105004658935" style="zoom: 33%;" />

   **应用模板**选择空模板；**环境信息**里地域随便选，计费方式选按量计费，环境名称随便填，同意规则然后下一步，开通。开通之后会进入这个环境的管理界面，之后称呼这个界面为**控制台**

3. 在访问管理/API密钥管理中，新建一对密钥，这会产生SecretId和SecretKey两个值，同样记录它们，并记住**切勿泄露后者**，拥有这对值的用户将拥有所有所有资源的访问权限。入口见下

   <img src="https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105004906631.png" alt="image-20211105004906631" style="zoom:33%;" />

   ![image-20211105005102543](https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105005102543.png)

### 开始部署

先去下载最新的[`schema.zip`](https://github.com/BlackCloud37/thucats/releases)（选版本号最新的版本，然后下载里面的`Assets/schema.zip`这个压缩包）

#### CMS

1. 回到刚才创建的环境的控制台，扩展能力-扩展应用-CMS内容管理系统，点安装。一直下一步到 `4.扩展程序配置` 这一步，然后设置管理员和运营者的账号密码

   管理员拥有后台管理的所有权限，运营者会拥有更少的权限。之后录入猫咪信息需要用到这里设置的账号密码，通常运营者账号会被社团内许多负责管理猫咪信息的同学共享，因此请你设置并牢记这两对账号密码![image-20211105005507593](https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105005507593.png)

   ![image-20211105005607444](https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105005607444.png)

2. 等待cms创建完成后，可以在我的应用里看到`cloudbase-extension-cms`这个应用，点击右侧的访问-网站入口按钮，用你刚才设置的账号登陆

3. 在我的项目里创建新项目，项目名和id随意

   <img src="https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105010518822.png" alt="image-20211105010518822" style="zoom:33%;" />

4. 将刚才下载的`schemas.zip`解压，里面会有若干个`.json`文件

5. 进入刚创建的项目，点左侧内容模型一栏，然后点右上角的导入模型，依次导入解压出来的几个`.json`文件，如果看到内容模型里出现了对应的模型则为成功

   ![image-20211105010937070](https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105010937070.png)

6. 之后就可以在内容集合里增加数据了，主要是录入猫咪信息

#### 小程序端

1. 打开这个工具，在上传文件的地方上传之前下载的`private.appid.key`文件[小程序部署密钥转换小工具](https://framework-1258016615.tcloudbaseapp.com/mp-key-tool/)，并复制下面文本框里的输出，这个输出记为UPLOAD_PRIVATE_KEY

2. 点击这个按钮<a href="https://console.cloud.tencent.com/tcb/env/index?&action=CreateAndDeployCloudBaseProject&appUrl=https://github.com/BlackCloud37/thucats&branch=v1.0.0" target="_blank" rel="noopener noreferrer"><img src="https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg"></a>打开网页，在应用导入里选择你的云环境，点下一步

3. 在这个配置里依次填入小程序的AppID，UPLOAD_PRIVATE_KEY，Cloudbase的SecretId和SecretKey四个值，然后点完成

   <img src="https://image-bed-blackcloud.oss-cn-beijing.aliyuncs.com/img/image-20211105005953763.png" alt="image-20211105005953763" style="zoom: 25%;" />

## TODO：文本配置

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
