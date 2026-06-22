     #!/usr/bin/env python3
"""
同步脚本：从源仓库 README.md 提取数据，并更新 index.html。

用法：
    python sync_data.py

功能：
    1. 从 D:\Data\Code\AI\AIProductHome\README.md 提取 "# 搜索引擎" 之后的内容
    2. 保存到 data/tools.md
    3. 更新 index.html，将硬编码的 markdownContent 替换为 fetch() 动态加载
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOURCE_README = r"D:\Data\Code\AI\AIProductHome\README.md"
DATA_DIR = os.path.join(BASE_DIR, "data")
TOOLS_MD = os.path.join(DATA_DIR, "tools.md")
INDEX_HTML = os.path.join(BASE_DIR, "index.html")


def extract_markdown():
    """从源 README.md 提取 '# 搜索引擎' 之后的内容，写入 data/tools.md"""
    if not os.path.exists(SOURCE_README):
        print(f"[错误] 源文件不存在: {SOURCE_README}")
        return False

    with open(SOURCE_README, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # 找到 "# 搜索引擎" 的起始行
    start_idx = None
    for i, line in enumerate(lines):
        if line.startswith("# 搜索引擎"):
            start_idx = i
            break

    if start_idx is None:
        print("[错误] 未找到 '# 搜索引擎' 标记")
        return False

    content = "".join(lines[start_idx:])
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(TOOLS_MD, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"[成功] 已提取 {len(lines) - start_idx} 行 -> {TOOLS_MD}")
    return True


def update_index_html():
    """将 index.html 中的硬编码 markdownContent 替换为 fetch() 动态加载"""
    if not os.path.exists(INDEX_HTML):
        print(f"[错误] 文件不存在: {INDEX_HTML}")
        return False

    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()

    # 标记：旧代码的起始和结束
    start_marker = "            // 获取Markdown内容（这里使用示例内容，实际应用中可以从文件或API获取）"
    end_marker = (
        "            parser.parseMarkdown(markdownContent);\n"
        "            \n"
        "            // 渲染UI\n"
        "            parser.render();"
    )

    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("[信息] index.html 已经使用 fetch() 加载，无需更新")
        return True

    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        print("[错误] 未找到结束标记")
        return False

    end_idx += len(end_marker)

    replacement = (
        "            // 从外部文件动态加载Markdown内容（数据源: data/tools.md）\n"
        "            fetch('data/tools.md')\n"
        "                .then(response => {\n"
        "                    if (!response.ok) throw new Error('HTTP ' + response.status);\n"
        "                    return response.text();\n"
        "                })\n"
        "                .then(markdownContent => {\n"
        "                    parser.parseMarkdown(markdownContent);\n"
        "                    parser.render();\n"
        "                })\n"
        "                .catch(error => {\n"
        "                    console.error('加载工具数据失败:', error);\n"
        "                    document.getElementById('toolsContainer').innerHTML = `\n"
        '                        <div class="empty-state">\n'
        '                            <i class="fas fa-exclamation-triangle"></i>\n'
        "                            <h3>数据加载失败</h3>\n"
        "                            <p>请检查 data/tools.md 文件是否存在</p>\n"
        "                        </div>\n"
        "                    `;\n"
        "                });"
    )

    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"[成功] index.html 已更新：移除硬编码数据，改为 fetch() 动态加载")
    return True


def main():
    print("=" * 50)
    print("AIProductHome 数据同步脚本")
    print("=" * 50)

    if extract_markdown():
        update_index_html()

    print("\n完成！现在可以:")
    print("  1. 直接打开 index.html（需要 HTTP 服务器，因为 fetch 不支持 file:// 协议）")
    print("  2. 使用 npx serve . 或 python -m http.server 启动本地服务器")
    print("  3. 部署到 GitHub Pages 后自动生效")


if __name__ == "__main__":
    main()