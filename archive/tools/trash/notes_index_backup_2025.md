---
top_img: /image/media/notes.jpg
---
<div class="notes-container">
  <div class="container">
    <header>
      <h1>无尽迭代，拟合完美</h1>
      <p class="description">整理做过的一些笔记和随笔记录，便于复习与分享</p>
      <div class="category">NOTES COLLECTION</div>
    </header>
    <div class="notebooks-grid" id="notebooks-grid"></div>
    <div id="pagination" class="notes-pagination"></div>
  </div>
</div>
<style>
    /* 完全使用容器类名限定样式作用域 */
    .notes-container {
        color: #e2e8f0;
        min-height: 100vh;
        padding: 40px 20px;
        overflow-x: hidden;
        position: relative;
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
    }
    .notes-container * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .notes-container .container {
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
    }
    .notes-container header {
        text-align: center;
        margin-bottom: 60px;
        padding: 20px;
    }
    .notes-container h1 {
        font-size: 3.5rem;
        background: linear-gradient(45deg, #22d3ee, #818cf8, #c084fc);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        background-size: 300% 300%;
        animation: gradient-shift 8s ease infinite;
        margin-bottom: 15px;
        font-weight: 800;
        letter-spacing: 1px;
    }
    .notes-container .description {
        font-size: 1.25rem;
        max-width: 800px;
        margin: 0 auto 25px;
        color: #94a3b8;
        line-height: 1.7;
    }
    .notes-container .category {
        display: inline-block;
        background: rgba(30, 41, 59, 0.6);
        backdrop-filter: blur(10px);
        padding: 10px 30px;
        border-radius: 50px;
        font-size: 1rem;
        color: #67e8f9;
        border: 1px solid rgba(103, 232, 249, 0.3);
        font-weight: 500;
        letter-spacing: 1px;
    }
    /* 笔记本网格布局 */
    .notes-container .notebooks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 35px;
        margin-top: 30px;
    }
    /* 玻璃拟态卡片 */
    .notes-container .notebook-card {
        background: rgba(30, 41, 59, 0.3);
        backdrop-filter: blur(12px);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 35px rgba(2, 6, 23, 0.5);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        min-height: 420px;
    }
    .notes-container .notebook-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #67e8f9, #a5b4fc, #c084fc);
        opacity: 0.7;
        transition: opacity 0.3s;
    }
    .notes-container .notebook-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(2, 6, 23, 0.7);
        border-color: rgba(255, 255, 255, 0.15);
    }
    .notes-container .notebook-card:hover::before {
        opacity: 1;
    }
    /* 卡片顶部区域 */
    .notes-container .card-header {
        padding: 25px 25px 20px;
        position: relative;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .notes-container .notebook-icon {
        font-size: 2.8rem;
        margin-bottom: 15px;
        display: inline-block;
        background: rgba(15, 23, 42, 0.4);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(2, 6, 23, 0.3);
    }
    .notes-container .notebook-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 10px;
    }
    .notes-container .card-subtitle {
        font-size: 1rem;
        color: #94a3b8;
        line-height: 1.6;
    }
    /* 笔记本内容 */
    .notes-container .notebook-content {
        padding: 25px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .notes-container .notebook-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 0.95rem;
        color: #67e8f9;
        background: rgba(15, 23, 42, 0.3);
        padding: 12px 15px;
        border-radius: 12px;
    }
    .notes-container .notebook-stats span {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .notes-container .articles-list {
        flex-grow: 1;
        overflow: hidden;
        margin-bottom: 20px;
    }
    .notes-container .article-item {
        padding: 12px 0;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.07);
        display: flex;
        align-items: center;
        transition: all 0.3s;
    }
    .notes-container .article-item:hover {
        background: rgba(15, 23, 42, 0.2);
        border-radius: 8px;
        padding: 12px 10px;
        transform: translateX(5px);
    }
    .notes-container .article-item:last-child {
        border-bottom: none;
    }
    .notes-container .article-icon {
        margin-right: 12px;
        color: #67e8f9;
        font-size: 0.95rem;
        min-width: 20px;
    }
    .notes-container .article-title {
        flex-grow: 1;
        font-size: 1.05rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.3s;
        /* 添加链接样式 */
        text-decoration: none;
        color: #e2e8f0;
        cursor: pointer;
        display: block;
    }
    .notes-container .article-title:hover {
        color: #67e8f9;
    }
    .notes-container .article-date {
        font-size: 0.85rem;
        color: #94a3b8;
        min-width: 80px;
        text-align: right;
    }
    .notes-container .view-notebook {
        display: block;
        padding: 14px 20px;
        background: rgba(30, 41, 59, 0.6);
        color: #f1f5f9;
        text-align: center;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s;
        border: 1px solid rgba(103, 232, 249, 0.3);
        font-weight: 500;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: auto;
    }
    .notes-container .view-notebook:hover {
        background: rgba(56, 71, 97, 0.6);
        transform: translateY(-3px);
        border-color: rgba(103, 232, 249, 0.5);
        box-shadow: 0 5px 15px rgba(6, 78, 118, 0.2);
    }
    /* 动画效果 */
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    /* 卡片颜色主题 */
    .notes-container .dl-card .notebook-icon {
        color: #67e8f9;
        background: linear-gradient(135deg, rgba(6, 78, 118, 0.3), rgba(8, 145, 178, 0.3));
    }
    .notes-container .poetry-card .notebook-icon {
        color: #c084fc;
        background: linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(147, 51, 234, 0.3));
    }
    .notes-container .economics-card .notebook-icon {
        color: #f0abfc;
        background: linear-gradient(135deg, rgba(134, 25, 143, 0.3), rgba(192, 132, 252, 0.3));
    }
    .notes-container .dl-card::before {
        background: linear-gradient(90deg, #67e8f9, #22d3ee);
    }
    .notes-container .poetry-card::before {
        background: linear-gradient(90deg, #c084fc, #a855f7);
    }
    .notes-container .economics-card::before {
        background: linear-gradient(90deg, #f0abfc, #e879f9);
    }
    /* 响应式设计 */
    @media (max-width: 900px) {
        .notes-container .notebooks-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
        }
        .notes-container h1 {
            font-size: 2.8rem;
        }
    }
    @media (max-width: 768px) {
        .notes-container .notebooks-grid {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin: 0 auto;
        }
        .notes-container h1 {
            font-size: 2.4rem;
        }
        .notes-container .description {
            font-size: 1.1rem;
        }
    }
    @media (max-width: 480px) {
        .notes-container {
            padding: 30px 15px;
        }
        .notes-container h1 {
            font-size: 2rem;
        }
        .notes-container .card-header {
            padding: 20px;
        }
        .notes-container .notebook-content {
            padding: 20px;
        }
        .notes-container .notebook-stats {
            flex-direction: column;
            gap: 8px;
        }
    }
    /* 在原有样式基础上添加分页样式 */
    .notes-pagination {
      display: flex;
      justify-content: center;
      margin-top: 50px;
      gap: 15px;
    }
    .pagination-btn, .pagination-page {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(12px);
      color: #e2e8f0;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(2, 6, 23, 0.5);
      transition: all 0.3s ease;
      border: 1px solid rgba(103, 232, 249, 0.3);
    }
    .pagination-btn:hover, .pagination-page:hover, .pagination-page.active {
      background: rgba(56, 71, 97, 0.6);
      transform: translateY(-3px);
      border-color: rgba(103, 232, 249, 0.5);
    }
    .pagination-btn.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
</style>
<script>
  // 全局变量
  let currentPage = 1;
  const notebooksPerPage = 4;
  let totalPages = 1;
  let allNotebooks = [];
  // 更新后的generateArticleUrl函数（方案1）
  function generateArticleUrl(notebookSlug, article) {
    // 优先使用文章自带的slug
    if (article.slug) {
      return `/categories/${notebookSlug}/${article.slug}/`;
    }
    // 回退处理（英文标题）
    return `/categories/${notebookSlug}/${article.title
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()}/`;
  }
  // 加载笔记本数据
  function loadNotebooks() {
    fetch('notebooks.json')
      .then(response => response.json())
      .then(data => {
        allNotebooks = data;
        totalPages = Math.ceil(data.length / notebooksPerPage);
        renderNotebooks(currentPage);
        renderPagination(currentPage);
      })
      .catch(error => {
        console.error('加载笔记本数据失败:', error);
        document.getElementById('notebooks-grid').innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>笔记本数据加载失败，请刷新重试</p>
          </div>
        `;
      });
  }
  // 渲染笔记本
  function renderNotebooks(page) {
    const container = document.getElementById('notebooks-grid');
    if (!allNotebooks || allNotebooks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book-open"></i>
          <p>暂无笔记本数据</p>
        </div>
      `;
      return;
    }
    // 计算当前页的数据
    const startIndex = (page - 1) * notebooksPerPage;
    const pageData = allNotebooks.slice(startIndex, startIndex + notebooksPerPage);
    container.innerHTML = '';
    pageData.forEach(notebook => {
      // 根据笔记本名称设置不同的样式
      const themes = {
        "DL-cards": "dl-card",
        "诗词格律": "poetry-card",
        "quant-cards": "economics-card",
        "NLP": "dl-card",
        "YOLO-od": "poetry-card"
      };
      const theme = themes[notebook.name] || "dl-card";
      // 构建文章列表HTML
      let articlesHTML = '';
      if (notebook.articles && notebook.articles.length > 0) {
        notebook.articles.slice(0, 4).forEach(article => {
          // 生成文章URL
          const articleUrl = `/articles/${article.slug}/`;
          articlesHTML += `
            <div class="article-item">
              <i class="article-icon ${article.icon}"></i>
              <a href="${articleUrl}" class="article-title">${article.title}</a>
              <div class="article-date">${article.date}</div>
            </div>
          `;
        });
      } else {
        articlesHTML = '<div class="article-item">暂无文章</div>';
      }
      // 构建笔记本卡片HTML
      const notebookHTML = `
        <div class="notebook-card ${theme}">
          <div class="card-header">
            <div class="notebook-icon">
              <i class="${notebook.icon}"></i>
            </div>
            <h2 class="notebook-title">${notebook.name}</h2>
            <p class="card-subtitle">${notebook.subtitle}</p>
          </div>
          <div class="notebook-content">
            <div class="notebook-stats">
              <span><i class="fas fa-file-alt"></i> ${notebook.articles.length}篇文章</span>
              <span><i class="fas fa-calendar"></i> 最近更新: ${getLatestUpdate(notebook)}</span>
            </div>
            <div class="articles-list">
              ${articlesHTML}
            </div>
            <a href="/categories/${notebook.slug}/" class="view-notebook">
              <i class="fas fa-book-open"></i>
              打开笔记本
            </a>
          </div>
        </div>
      `;
      container.innerHTML += notebookHTML;
    });
  }
  // 获取最近更新时间
  function getLatestUpdate(notebook) {
    if (!notebook.articles || notebook.articles.length === 0) return '暂无';
    return notebook.articles[0].date;
  }
  // 渲染分页
  function renderPagination(currentPage) {
    const container = document.getElementById('pagination');
    if (!container) return;
    container.innerHTML = '';
    // 上一页按钮
    const prevBtn = document.createElement('div');
    prevBtn.className = 'pagination-btn';
    if (currentPage === 1) prevBtn.classList.add('disabled');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        renderNotebooks(currentPage - 1);
        renderPagination(currentPage - 1);
      }
    });
    container.appendChild(prevBtn);
    // 页码
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('div');
      pageBtn.className = 'pagination-page';
      if (i === currentPage) pageBtn.classList.add('active');
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        if (i !== currentPage) {
          renderNotebooks(i);
          renderPagination(i);
        }
      });
      container.appendChild(pageBtn);
    }
    // 下一页按钮
    const nextBtn = document.createElement('div');
    nextBtn.className = 'pagination-btn';
    if (currentPage === totalPages) nextBtn.classList.add('disabled');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        renderNotebooks(currentPage + 1);
        renderPagination(currentPage + 1);
      }
    });
    container.appendChild(nextBtn);
  }
  // 初始化
  document.addEventListener('DOMContentLoaded', function() {
    loadNotebooks();
  });
</script>