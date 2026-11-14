# 新功能

1. 【v】 增加一键回滚按钮
2. 【v】增加分享者展示标签
3. 【v】更新记录展示页
4. 【v】新增“编辑推荐”广告位
5. 【】1114 固定导航栏
6. 【】1114 新增风险提示
7. 【】对比竞品进行功能补全

# 优化

1. 【】点击分类标签实现滑动，而非筛选
2. 【】css 样式，js 代码和 html 解耦
3. 【】**完全没有键盘焦点样式(`:focus-visible`)** 全站搜索 `focus-visible` = 0 命中。搜索框 `.search-input:focus { outline: none }` 后只靠一圈很淡的 box-shadow;而 `.category-tag`(可点击的 `<div>`)和 `.tool-link` 连焦点样式都没有。建议补:

```css
:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.45);
  outline-offset: 2px;
}
```

4. *【】*分类标签语义不正确** `.category-tag` 是 `<div>` + `addEventListener('click')`(第 761–778 行),**无法用 Tab 聚焦、无法回车触发\_\_,屏幕阅读器也不识别为按钮。应改成 `<button type="button">`(或补 `role="button" tabindex="0" aria-pressed`),这会同时解决键盘操作和 a11y。
5. *【】*动画未尊重 `prefers-reduced-motion`\_\_ `.spinner` 旋转、卡片/标签 `translateY` 悬停位移,对晕动症用户不友好。加一段统一兜底:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

6. 【】产品图标方案
7. 【】使用 skill 优化设计效果
   1. [使用 skill 优化设计效果](https://www.xiaohongshu.com/explore/6ad8bd140000000033035aa9?xsec_token=ABwHvFrUMXN66n5sDDujiIEJpPsDF6rh17GsLdL09Sgz8=&xsec_source=pc_user&source=web_user_page)
   2. [直观展现了如何去除 UI 设计中的 ai 味](https://www.xiaohongshu.com/explore/6ae1340f0000000034025bfa?xsec_token=AB-HTrNes3NTZldjOwqzrCYd2XS2hlR1qEc_hzs1ovov0=&xsec_source=pc_user&source=web_user_page)
   3. [这个神级Skill，做的网页超好看！](https://www.xiaohongshu.com/explore/6adf00960000000017034a67?xsec_token=ABoJnPvXiTCpnZP0SRciVh3VI9xkXtc82af5zFaBJjxP4=&xsec_source=pc_user&source=web_user_page)
8. 对比竞品进行功能优化
