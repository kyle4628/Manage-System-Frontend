export default {
  common: {
    idDescending: '按ID降冪排列',
    idAscending: '按ID升冪排列'
  },
  route: {
    dashboard: '首頁',
    members: '管理會員',
    tags: '標籤管理',
    places: '地點管理',
    placelists: '地圖清單',
    permission: '登入者權限',
    rolePermission: '角色权限',
    pagePermission: '页面权限',
    directivePermission: '指令权限',
    icons: '图标',
    components: '组件',
    tinymce: '富文本编辑器',
    markdown: 'Markdown',
    jsonEditor: 'JSON 编辑器',
    dndList: '列表拖拽',
    splitPane: 'Splitpane',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: '小组件',
    backToTop: '返回顶部',
    dragDialog: '拖拽 Dialog',
    dragSelect: '拖拽 Select',
    dragKanban: '可拖拽看板',
    charts: '統計圖表',
    keyboardChart: '方塊圖',
    lineChart: '折線圖',
    mixChart: '綜合圖表',
    example: '文章管理',
    nested: '路由嵌套',
    menu1: '菜单1',
    'menu1-1': '菜单 1-1',
    'menu1-2': '菜单 1-2',
    'menu1-2-1': '菜单 1-2-1',
    'menu1-2-2': '菜单 1-2-2',
    'menu1-3': '菜单 1-3',
    menu2: '菜单 2',
    Table: 'Table',
    dragTable: '拖拽 Table',
    inlineEditTable: 'Table 内编辑',
    complexTable: '综合 Table',
    tab: 'Tab',
    form: '表单',
    createArticle: '新增文章',
    editArticle: '編輯文章',
    articleList: '文章列表',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    excel: 'Excel',
    exportExcel: '导出 Excel',
    selectExcel: '导出 已选择项',
    mergeHeader: '导出 多级表头',
    uploadExcel: '上传 Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: '换肤',
    clipboardDemo: 'Clipboard',
    i18n: '国际化',
    externalLink: '外链',
    profile: '个人中心'
  },
  navbar: {
    dashboard: '首頁',
    logOut: '使用者登出',
    size: '布局大小'
  },
  login: {
    title: '系統登入',
    logIn: '登入',
    username: '帳號',
    password: '密碼'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '確定',
    cancel: '取消'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  member: {
    searchTitle: '請輸入搜尋項目',
    searchItem: '搜尋項目',
    memberStatus: '會員身分',
    id: '序號',
    name: '姓名',
    email: 'E-mail',
    authority: '權限',
    password: '密碼',
    created: '建立時間',
    updated: '更新時間',
    reviewer: '管理員',
    search: '搜尋',
    add: '新增',
    actions: '操作',
    edit: '編輯',
    delete: '刪除',
    administrator: '管理員',
    normal: '一般身分',
    blackList: '黑名單',
    nameRule: '此項目必填',
    emailRule: '此項目必填',
    passwordRule: '此項目必填',
    authorityRule: '此項目必填'
  },
  tag: {
    searchTitle: '請輸入項目',
    searchItem: '搜尋項目',
    search: '搜尋',
    id: '清單 ID',
    placeName: '地點名稱',
    tagName: '標籤名稱',
    userName: '清單作者',
    type: '種類',
    actions: '操作',
    add: '新增',
    edit: '編輯',
    delete: '刪除'
  },
  place: {
    searchTitle: '請輸入項目',
    searchItem: '搜尋項目',
    search: '搜尋',
    id: '地點 ID',
    name: '地點名稱',
    type: '種類',
    phone: '電話',
    address: '地址',
    longitude: '經度',
    latitude: '緯度',
    actions: '操作',
    add: '新增',
    edit: '編輯',
    delete: '刪除'
  },
  placeList: {
    searchTitle: '請輸入項目',
    searchItem: '搜尋項目',
    search: '搜尋',
    id: '清單 ID',
    userId: '使用者 ID',
    userName: '作者名稱',
    privacy: '開放權限',
    public: '公開',
    private: '非公開',
    personal: '私人',
    name: '清單名稱',
    description: '描述',
    coverImageURL: '封面圖片網址',
    createdTime: '建立時間',
    updatedTime: '更新時間',
    addPlace: '加入地點',
    add: '新增',
    edit: '編輯',
    delete: '刪除'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '編輯',
    publish: '发布',
    draft: '草稿',
    delete: '刪除',
    cancel: '取消',
    confirm: '確定'
  },
  example: {
    warning: '创建和编辑页面是不能被 keep-alive 缓存的，因为keep-alive 的 include 目前不支持根据路由来缓存，所以目前都是基于 component name 来进行缓存的。如果你想类似的实现缓存效果，可以使用 localStorage 等浏览器缓存方案。或者不要使用 keep-alive 的 include，直接缓存所有页面。详情见'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '匯出',
    selectedExport: '匯出已選項目',
    placeholder: '請輸入文件名'
  },
  pdf: {
    tips: '这里使用   window.print() 来实现下载pdf的功能'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '版面配置設定',
    theme: '主題色',
    tagsView: '開啟 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '顯示LOGO'
  }
}
