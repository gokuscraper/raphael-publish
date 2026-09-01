export interface PlatformMeta {
    type: string;
    name: string;
    icon: string;
    homepage: string;
    disabled?: boolean;
}

export const ALL_PLATFORMS: PlatformMeta[] = [
    { type: 'douyin', name: '抖音图文', icon: 'https://www.douyin.com/favicon.ico', homepage: 'https://www.douyin.com', disabled: true },
    { type: 'xiaohongshu', name: '小红书', icon: 'https://www.xiaohongshu.com/favicon.ico', homepage: 'https://www.xiaohongshu.com', disabled: true },
    { type: 'zhihu', name: '知乎', icon: 'https://static.zhihu.com/static/favicon.ico', homepage: 'https://www.zhihu.com' },
    { type: 'juejin', name: '掘金', icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png', homepage: 'https://juejin.cn' },
    { type: 'csdn', name: 'CSDN', icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico', homepage: 'https://editor.csdn.net/md/' },
    { type: 'jianshu', name: '简书', icon: 'https://www.jianshu.com/favicon.ico', homepage: 'https://www.jianshu.com' },
    { type: 'toutiao', name: '头条号', icon: 'https://mp.toutiao.com/favicon.ico', homepage: 'https://mp.toutiao.com' },
    { type: 'weibo', name: '微博', icon: 'https://weibo.com/favicon.ico', homepage: 'https://card.weibo.com/article/v5/editor' },
    { type: 'bilibili', name: '哔哩哔哩', icon: 'https://www.bilibili.com/favicon.ico', homepage: 'https://member.bilibili.com/platform/upload/text' },
    { type: 'baijiahao', name: '百家号', icon: 'https://baijiahao.baidu.com/favicon.ico', homepage: 'https://baijiahao.baidu.com/' },
    { type: 'yuque', name: '语雀', icon: 'https://gw.alipayobjects.com/zos/rmsportal/UTjFYEzMSYVwzxIGVhMu.png', homepage: 'https://www.yuque.com/dashboard', disabled: true },
    { type: 'douban', name: '豆瓣', icon: 'https://www.douban.com/favicon.ico', homepage: 'https://www.douban.com/note/create', disabled: true },
    { type: 'sohu', name: '搜狐号', icon: 'https://mp.sohu.com/favicon.ico', homepage: 'https://mp.sohu.com' },
    { type: 'xueqiu', name: '雪球', icon: 'https://xueqiu.com/favicon.ico', homepage: 'https://xueqiu.com', disabled: true },
    { type: 'woshipm', name: '人人都是产品经理', icon: 'https://www.woshipm.com/favicon.ico', homepage: 'https://www.woshipm.com', disabled: true },
    { type: '51cto', name: '51CTO', icon: 'https://www.51cto.com/favicon.ico', homepage: 'https://blog.51cto.com' },
    { type: 'imooc', name: '慕课手记', icon: 'https://www.imooc.com/favicon.ico', homepage: 'https://www.imooc.com/article' },
    { type: 'oschina', name: '开源中国', icon: 'https://www.oschina.net/favicon.ico', homepage: 'https://my.oschina.net' },
    { type: 'segmentfault', name: '思否', icon: 'https://static.segmentfault.com/v-5e501fa4/favicon.ico', homepage: 'https://segmentfault.com' },
    { type: 'cnblogs', name: '博客园', icon: 'https://www.cnblogs.com/favicon.ico', homepage: 'https://www.cnblogs.com' },
    { type: 'eastmoney', name: '东方财富', icon: 'https://mp.eastmoney.com/favicon.ico', homepage: 'https://mp.eastmoney.com', disabled: true },
    { type: 'dayu', name: '大鱼号', icon: 'https://mp.dayu.com/favicon.ico', homepage: 'https://mp.dayu.com', disabled: true },
    { type: 'yidian', name: '一点号', icon: 'https://www.yidianzixun.com/favicon.ico', homepage: 'https://www.yidianzixun.com', disabled: true },
    { type: 'sohufocus', name: '搜狐焦点', icon: 'https://m.focus.cn/favicon.ico', homepage: 'https://m.focus.cn', disabled: true },
    { type: 'smzdm', name: '什么值得买', icon: 'https://www.smzdm.com/favicon.ico', homepage: 'https://www.smzdm.com', disabled: true },
    { type: 'netease', name: '网易号', icon: 'https://mp.163.com/favicon.ico', homepage: 'https://mp.163.com', disabled: true },
    { type: 'x', name: 'Twitter/X', icon: 'https://abs.twimg.com/favicons/twitter.ico', homepage: 'https://x.com', disabled: true },
    { type: 'wordpress', name: 'WordPress', icon: 'https://s.w.org/images/favicon.ico', homepage: '', disabled: true },
    { type: 'typecho', name: 'Typecho', icon: '', homepage: '', disabled: true },
];
