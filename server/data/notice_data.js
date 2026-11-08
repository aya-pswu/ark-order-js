// 本地服「公告」数据 —— 游戏内主城「公告」按钮打开的本地公告页内容源。
// PCJS：改完本文件即生效（页面每次请求现读数据，重开公告面板即可看到，无需重启服务端）；
// 安卓单机包：内容打进 APK，需下次出包（prepare_assets → build_standalone_apk）生效。
//
// 页面由 server/data/notice_site.js 渲染，HTTP 路由挂在 /notice/**（server/http_router.js）。
// 游戏内公告面板（UniWebViewPanel）的 5 个页签按官方 CfgNotice 配置跳转：
//   tab = 'activity'      → 页签「活动」  http://<服>/notice/activity/1.html
//   tab = 'update'        → 页签「更新」  http://<服>/notice/update/1.html
//   tab = 'announcement'  → 页签「公告」  http://<服>/notice/announcement/1.html
//   tab = 'introduce'     → 页签「誓灵」  http://<服>/notice/introduce/1.html
//   tab = 'comics'        → 页签「漫画」  http://<服>/notice/comics/1.html
// 公告主页（按钮打开的默认页）= http://<服>/notice
//
// 字段说明：
//   tab   归属页签（上面 5 个之一；不填只出现在主页）
//   type  便签底色分类，用客户端官方配色：maintain=维护(金) / activity=活动(粉) / upgrade=更新(绿)
//   title 标题（纯文本，会做 HTML 转义）
//   date  显示用日期字符串（自由格式）
//   top   true = 在页内置顶
//   body  正文，HTML 片段（<p>/<b>/<ul>/<li>/<br> 等均可；链接如需跳外部浏览器，
//         用 uniwebview://open_url?url=<URL编码后的地址>，客户端 UniWebView 会转调外部浏览器）

// 测试贡献者名单（单一数据源，与信①致谢段共用，见 contributor_names.js）
const CONTRIBUTORS = require('./contributor_names');

module.exports = {
  siteName: '方舟指令JS',

  // 每页页脚（notice_site.js 的 .foot；不填回落默认"方舟指令JS · 本页面内容与官方无关"）
  footer: '方舟指令JS · 免费开源的公益学习项目 · 本页面内容与官方无关',

  notices: [
    {
      tab: 'announcement',
      type: 'maintain',
      title: '欢迎来到方舟指令JS',
      date: '2026-11-01',
      top: true,
      body: [
        '<p>本项目为本地服，仅供交流学习使用，且不以任何形式牟利或变相牟利。</p>',
        '<p><b>方舟指令JS是免费开源的公益学习项目，如果御灵士通过付费渠道获得了资源，请立即申请退款并向平台投诉。</b></p>',
        '<p>能力有限，bug或反馈可能会修复缓慢或无法修复。</p>',
        '<p>感谢Let The Bullets Fly等御灵士的全力开发。</p>',
        '<p>由衷感谢各位测试者的反馈和工作。</p>',
        '<p><b>参与测试的贡献者：</b></p>',
        `<p style="margin-top:4px">${CONTRIBUTORS.join('<br>')}</p>`,
        '<p>特别感谢热爱方舟指令的各位御灵士。</p>',
        '<p>联系我们：<br>博客：haruhisuzumiya.top<br>防走丢：<a href="uniwebview://open_url?url=https%3A%2F%2Fsway.cloud.microsoft%2Fy3OyDshx6wib9ENe">https://sway.cloud.microsoft/y3OyDshx6wib9ENe</a><br>邮箱：7586380@qq.com</p>',
        '<p style="text-align:right;margin-top:18px"><b>Funky社</b></p>',
      ].join('\n'),
    },
  ],
};
