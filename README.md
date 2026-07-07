# 🐵 悟空排版 — 公众号 Markdown 排版 & 多平台同步

将三款工具整合为一体的公众号内容创作工作台：

| 组件 | 作用 |
|------|------|
| **悟空排版** | Markdown 渲染、主题样式、手机壳预览、一键复制到公众号 |
| **Wechatsync（文章同步助手）** | 同步到 CSDN、掘金、知乎、头条号等主流中文平台 |
| **COSE（Create Once, Sync Everywhere）** | 同步到 InfoQ、Medium、火山引擎等平台 |

## 功能

- **📱 手机壳预览** — 520px 手机壳模拟，所见即所得
- **📋 智能粘贴** — 从飞书、Notion、Word 等复制富文本，自动净化为 Markdown
- **🎨 30 套主题** — Mac、Claude、微信原生、Stripe、Linear 等多种风格一键切换
- **📸 图片缩放** — 超过 450px 的图片自动等比缩放，阅读体验更舒适
- **📋 一键复制** — 复制 HTML / 复制 Markdown / 复制到公众号（Base64 打包 + 微信兼容）
- **🔄 滚动同步** — 编辑区与预览区双向滚动同步
- **🔁 多平台同步** — 内置主同步（Wechatsync）与副同步（COSE）两条通道，覆盖 40+ 内容平台

## 使用方式

编辑 Markdown → 预览渲染效果 → 选择同步通道 → 一键同步到多个平台

需要安装对应的 Chrome 扩展：
- **主同步**：安装 [Wechatsync（文章同步助手）](https://wechatsync.com)
- **副同步**：安装 [COSE（多平台文章同步）](https://github.com/doocs/cose)

## 快速开始

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 致谢

- 排版引擎基于 [Raphael Publish](https://github.com/liuxiaopai-ai/raphael-publish) 二次开发
- 主同步集成 [Wechatsync](https://wechatsync.com) 浏览器扩展
- 副同步集成 [COSE](https://github.com/doocs/cose) 浏览器扩展

## 许可

MIT License
