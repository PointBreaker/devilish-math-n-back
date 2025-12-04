# 恶魔计算 - N步记忆挑战

一个极具挑战性的脑力训练游戏，测试你的工作记忆和心算能力！

## 游戏玩法

1. **记忆阶段**：记住屏幕上出现的数学题的答案
2. **回答阶段**：输入 N 步之前那道题的答案
3. **过关条件**：达到 65% 的准确率进入下一关
4. **难度递增**：每过一关，记忆步数增加

## 特性

- 🔥 极具挑战性的游戏玩法
- 📊 详细的游戏统计数据
- 🎨 恶魔主题的精美界面
- 📱 完全支持移动端
- 🚀 使用 React + TypeScript + Vite 构建

## 本地运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. Fork 这个仓库到你的 GitHub 账户
2. 在仓库设置中启用 GitHub Pages：
   - 进入 Settings → Pages
   - Source 选择 "GitHub Actions"
3. 推送代码到 main 分支，GitHub Actions 会自动部署

### 方法二：手动部署

```bash
# 安装 gh-pages
npm install -g gh-pages

# 或安装到项目
npm install --save-dev gh-pages

# 部署
npm run deploy
```

## 自定义配置

如果你修改了仓库名称，需要更新 `vite.config.ts` 中的 `base` 路径：

```typescript
base: mode === 'production' ? '/你的仓库名/' : '/',
```

## 游戏截图

[这里可以添加游戏截图]

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
- Recharts

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
