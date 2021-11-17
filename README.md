# hbb-moniter

监控有知有行第四期黑板报发车信息。

## 说明
- 本项目仅供学习交流使用。开发者对项目造成产生的后果不负任何责任，也不保证本方案一直有效。请使用者对自己负责。
- 使用前须将项目 Fork 至自己的仓库，此时密钥只有自己才知道，可以保证信息的安全，请放心使用。

## 使用方法

0. 首先需要在[Server酱](https://sct.ftqq.com/)中申请 sendKey，用于给微信的消息推送。
1. 将本项目 Fork 到自己的仓库。
2. 打开自己 Fork 之后的仓库，因为没有 sendKey 信息，此时若触发监控，一定会失败。
3. 进入 Settings 选项，点击 Secret，并选择 New Repository Secret。填写以下变量：
  SENDKEY: server 酱的 sendkey
  添加后展示如下：
  ![image](https://user-images.githubusercontent.com/49070692/142156233-861e5f37-dde1-499b-8916-702da857c7b4.png)
4. 回到 Action 选项卡，重新运行 Action，或者静待定时任务执行。
5. 项目默认是在 5:00, 5:30, 6:00, 6:30, 12:00 (UTC) 自动抓取黑板报信息，可以根据需要修改 .github/workflows/report.yml 中 cron 项。
6. 建议设置 GitHub Actions 通知为 Send notifications for failed workflows only 以接收构建失败的通知。这通常是默认设置项。
