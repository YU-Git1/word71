# 专业词汇库

一个面向个人使用的专业词汇学习应用，首版聚焦 3 个核心页面：

- 快速录入页：只输入单词本身，回车即可提交
- 词卡学习页：统一查看、筛选、搜索和点开学习
- 数据展示页：统计已学词汇与按年、月、周的录入数量

## 当前能力

- 录入时只需要输入英文单词
- 服务端自动补全音标、词性、中文含义、例句
- 内置预设词卡数据，启动后可直接体验
- 支持分类、搜索、词卡详情学习
- 支持学习统计与录入统计展示

## 本地启动

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## GitHub Pages

- 仓库地址： [https://github.com/YU-Git1/word71](https://github.com/YU-Git1/word71)
- 发布地址： `https://yu-git1.github.io/word71/`
- 每次推送到 `master` 后，会通过 GitHub Actions 自动重新发布

## 可用脚本

```bash
npm run dev
npm run lint
npm run build
```

## 当前实现说明

- 前端框架：Next.js 16 App Router
- UI：React 19 + Tailwind CSS 4
- 数据存储：浏览器 `localStorage`
- 自动查词：前端直接请求公共词典与翻译接口

