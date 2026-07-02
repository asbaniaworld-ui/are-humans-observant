# 人类是否足够敏锐？ — 认知校准计划 #402-B

一款 1968 年档案风格的找不同叙事游戏（React + Vite）。

> **说明：** 本项目最初由 Google AI Studio 导出脚手架生成，但**游戏本体不依赖 AI Studio**，也**不需要 Gemini API** 即可完整游玩。

## 为什么以前会接到 AI Studio？

仓库里仍保留 AI Studio 模板痕迹（`metadata.json`、旧版 README 文案），原因是：

- 项目用 AI Studio 的 React 模板一键导出
- `vite.config.ts` 里有 `DISABLE_HMR` 注释（给 AI Studio 编辑环境用）
- `package.json` 里留有未使用的 `@google/genai` 依赖

**实际玩法、插图、对话、档案系统都在本地前端运行**，与 AI Studio 无运行时绑定。

## 本地独立运行（推荐）

**环境：** Node.js 18+

```powershell
cd "e:\SZU\大二下\智能体产品设计\are-humans-observant_"
npm install
npm run dev
```

浏览器打开：**http://localhost:3000/**

## 在线游玩（GitHub Pages）

代码推送到 GitHub 后，Actions 会自动构建并发布静态站点：

**https://asbaniaworld-ui.github.io/are-humans-observant/**

> 若首次打开 404，请到仓库 **Settings → Pages → Build and deployment** 确认 Source 为 **GitHub Actions**，并等待 1–2 分钟让部署完成。

## 为什么 GitHub 仓库页面不能直接玩？

[GitHub 仓库](https://github.com/asbaniaworld-ui/are-humans-observant) 只存放**源代码**，不是已部署的网站。需要：

| 方式 | 地址 |
|------|------|
| 本地开发 | http://localhost:3000/ |
| 在线静态站 | https://asbaniaworld-ui.github.io/are-humans-observant/ |

## 构建与预览

```powershell
npm run build
npm run preview
```

## 仓库

https://github.com/asbaniaworld-ui/are-humans-observant
