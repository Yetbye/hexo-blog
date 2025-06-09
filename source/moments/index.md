---
top_img: "/image/media/moments.jpg"
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>发疯 | 日常</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .kuromi-container {
            --primary-dark: #1a535c;
            --primary-medium: #4ecdc4;
            --primary-light: #f7fff7;
            --accent-dark: #5a3d80;
            --accent-medium: #8a2be2;
            --accent-light: #e1c2ff;
            --text-dark: #000;
            --text-medium: #333;
            --text-light: #f7fff7;
            --border-dark: #000;
            --border-medium: #1a535c;
            --border-light: #4ecdc4;
            --shadow-color: rgba(26, 83, 92, 0.25);
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary-dark), var(--primary-medium));
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234ecdc4' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
            color: var(--text-dark);
            line-height: 1.6;
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        }
        /* 重置样式 */
        .kuromi-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        /* 头部样式 */
        .kuromi-container .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            padding: 20px 0;
        }
        .kuromi-container .title-box {
            background: var(--primary-light);
            border: 3px solid var(--border-dark);
            border-radius: 25px;
            padding: 20px;
            box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 2;
        }
        .kuromi-container .title {
            font-size: 2.8rem;
            margin-bottom: 5px;
            color: var(--accent-dark);
            font-weight: 800;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0 var(--primary-medium);
        }
        .kuromi-container .subtitle {
            color: var(--primary-dark);
            font-size: 1.3rem;
            font-weight: bold;
        }
        .kuromi-container .kuromi-decoration {
            position: absolute;
            z-index: 1;
        }
        .kuromi-container .decoration-1 {
            top: -20px;
            left: 20%;
            font-size: 4rem;
            color: var(--accent-dark);
        }
        .kuromi-container .decoration-2 {
            bottom: -30px;
            right: 20%;
            font-size: 5rem;
            color: var(--primary-medium);
            transform: rotate(20deg);
        }
        .kuromi-container .decoration-3 {
            top: 10px;
            right: 15%;
            font-size: 3rem;
            color: var(--text-dark);
        }
        /* 朋友圈项目样式 */
        .kuromi-container .moment-item {
            background: var(--primary-light);
            border-radius: 25px;
            padding: 30px 25px 25px;
            margin-bottom: 40px;
            box-shadow: 0 10px 20px var(--shadow-color);
            position: relative;
            transition: all 0.3s ease;
            border: 3px solid var(--border-dark);
            overflow: hidden;
        }
        .kuromi-container .moment-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px var(--shadow-color);
        }
        .kuromi-container .kuromi-corner {
            position: absolute;
            width: 70px;
            height: 70px;
            top: -10px;
            right: -10px;
            background: var(--accent-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-light);
            font-size: 2.5rem;
            box-shadow: 0 5px 0 rgba(0, 0, 0, 0.5);
        }
        .kuromi-container .moment-header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px dotted var(--border-light);
        }
        .kuromi-container .moment-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-right: 20px;
            object-fit: cover;
            border: 4px solid var(--border-dark);
            background: var(--accent-light);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3.5rem;
            color: var(--accent-dark);
            box-shadow: 0 5px 0 rgba(0, 0, 0, 0.3);
        }
        .kuromi-container .moment-info {
            flex: 1;
        }
        .kuromi-container .moment-author {
            font-weight: 800;
            font-size: 1.8rem;
            color: var(--accent-dark);
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        .kuromi-container .author-badge {
            background: linear-gradient(135deg, var(--primary-medium), var(--primary-dark));
            color: var(--text-light);
            font-size: 0.9rem;
            padding: 3px 12px;
            border-radius: 20px;
            margin-left: 12px;
            font-weight: 600;
        }
        .kuromi-container .moment-time {
            font-size: 1.1rem;
            color: var(--primary-dark);
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        .kuromi-container .moment-time i {
            margin-right: 10px;
            color: var(--accent-dark);
        }
        .kuromi-container .moment-content {
            font-size: 1.3rem;
            line-height: 1.7;
            margin-bottom: 25px;
            padding: 0 15px;
            position: relative;
            color: var(--text-medium);
        }
        .kuromi-container .moment-content::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 8px;
            height: 100%;
            background: linear-gradient(to bottom, var(--primary-medium), var(--primary-dark));
            border-radius: 10px;
        }
        .kuromi-container .moment-images {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .kuromi-container .moment-image {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid var(--border-dark);
            background: var(--accent-light);
            position: relative;
            overflow: hidden;
        }
        .kuromi-container .moment-image:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 15px var(--shadow-color);
        }
        .kuromi-container .image-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 3rem;
            color: var(--accent-dark);
        }
        .kuromi-container .moment-stats {
            display: flex;
            font-size: 1.1rem;
            padding-top: 15px;
            border-top: 3px dotted var(--border-light);
        }
        .kuromi-container .moment-stat {
            margin-right: 30px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: bold;
        }
        .kuromi-container .stat-icon {
            margin-right: 10px;
            font-size: 1.5rem;
            transition: all 0.3s;
        }
        .kuromi-container .like-btn:hover, 
        .kuromi-container .like-btn.liked {
            color: var(--primary-medium);
            transform: scale(1.1);
        }
        .kuromi-container .like-btn:hover .stat-icon, 
        .kuromi-container .like-btn.liked .stat-icon {
            color: var(--primary-medium);
            transform: scale(1.2);
        }
        .kuromi-container .location-tag {
            display: inline-flex;
            align-items: center;
            background: rgba(26, 83, 92, 0.15);
            color: var(--primary-dark);
            padding: 8px 15px;
            border-radius: 30px;
            font-size: 1.1rem;
            margin-top: 15px;
            font-weight: bold;
            border: 2px dashed var(--border-dark);
        }
        .kuromi-container .location-tag i {
            margin-right: 8px;
            color: var(--primary-dark);
        }
        .kuromi-container .empty-state {
            text-align: center;
            padding: 50px 20px;
            background: var(--primary-light);
            border-radius: 25px;
            box-shadow: 0 10px 20px var(--shadow-color);
            border: 3px solid var(--border-dark);
        }
        .kuromi-container .empty-state-icon {
            font-size: 5rem;
            margin-bottom: 25px;
            color: var(--border-light);
        }
        .kuromi-container .empty-state h3 {
            font-size: 2rem;
            margin-bottom: 15px;
            color: var(--accent-dark);
        }
        .kuromi-container .empty-state p {
            max-width: 500px;
            margin: 0 auto;
            font-size: 1.3rem;
            line-height: 1.6;
            color: var(--text-medium);
        }
        .kuromi-container .loading-container {
            text-align: center;
            padding: 50px 20px;
            background: var(--primary-light);
            border-radius: 25px;
            border: 3px solid var(--border-dark);
            box-shadow: 0 10px 20px var(--shadow-color);
        }
        .kuromi-container .loading-icon {
            font-size: 3.5rem;
            color: var(--primary-dark);
            margin-bottom: 20px;
            animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .kuromi-container .loading-text {
            font-size: 1.5rem;
            color: var(--accent-dark);
            font-weight: bold;
        }
        .kuromi-container .moment-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
        }
        .kuromi-container .moment-tag {
            background: rgba(78, 205, 196, 0.2);
            color: var(--primary-dark);
            padding: 6px 15px;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            border: 2px solid var(--border-dark);
        }
        .kuromi-container .kuromi-footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            font-size: 1.2rem;
            color: var(--accent-dark);
            font-weight: bold;
        }
        .kuromi-container .kuromi-footer i {
            margin: 0 10px;
            color: var(--primary-medium);
        }
        /* 对话气泡 */
        .kuromi-container .kuromi-bubble {
            position: absolute;
            background: var(--primary-light);
            border: 3px solid var(--border-dark);
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 0.9rem;
            max-width: 200px;
            z-index: 10;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            color: var(--text-medium);
            font-weight: bold;
        }
        .kuromi-container .bubble-1 {
            top: 120px;
            left: 5%;
            transform: rotate(-5deg);
        }
        .kuromi-container .bubble-2 {
            bottom: 150px;
            right: 5%;
            transform: rotate(5deg);
        }
        .kuromi-container .bubble-arrow {
            position: absolute;
            width: 20px;
            height: 20px;
            background: var(--primary-light);
            border: 3px solid var(--border-dark);
            transform: rotate(45deg);
        }
        .kuromi-container .bubble-1 .bubble-arrow {
            bottom: -10px;
            left: 30px;
            border-top: none;
            border-left: none;
        }
        .kuromi-container .bubble-2 .bubble-arrow {
            top: -10px;
            right: 30px;
            border-bottom: none;
            border-right: none;
        }
        /* 分页控件样式 */
        .kuromi-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 0;
            gap: 10px;
        }
        .pagination-btn, .pagination-page {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-light);
            border: 3px solid var(--border-dark);
            color: var(--text-medium);
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 0 rgba(0,0,0,0.3);
            transition: all 0.2s;
        }
        .pagination-btn:hover, .pagination-page:hover, .pagination-page.active {
            background: var(--accent-dark);
            color: var(--text-light);
            transform: translateY(2px);
            box-shadow: 0 2px 0 rgba(0,0,0,0.3);
        }
        .pagination-btn:active, .pagination-page:active {
            transform: translateY(4px);
            box-shadow: none;
        }
        .pagination-btn.disabled {
            opacity: 0.5;
            pointer-events: none;
        }
        /* 响应式设计 */
        @media (max-width: 768px) {
            .kuromi-container {
                padding: 10px;
            }
            .kuromi-container .title {
                font-size: 2.2rem;
            }
            .kuromi-container .moment-item {
                padding: 25px 20px;
            }
            .kuromi-container .moment-avatar {
                width: 70px;
                height: 70px;
                font-size: 2.5rem;
            }
            .kuromi-container .kuromi-corner {
                width: 60px;
                height: 60px;
                font-size: 2rem;
            }
        }
        @media (max-width: 480px) {
            .kuromi-container .moment-images {
                grid-template-columns: 1fr;
            }
            .kuromi-container .moment-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .kuromi-container .moment-avatar {
                margin-bottom: 15px;
            }
            .kuromi-container .moment-stats {
                flex-direction: column;
                gap: 15px;
            }
            .kuromi-container .moment-stat {
                margin-right: 0;
            }
            .kuromi-container .decoration-1, 
            .kuromi-container .decoration-2, 
            .kuromi-container .decoration-3 {
                display: none;
            }
            .kuromi-container .kuromi-bubble {
                position: static;
                margin: 20px auto;
                transform: none;
            }
            .kuromi-pagination {
                gap: 5px;
            }
            .pagination-btn, .pagination-page {
                width: 35px;
                height: 35px;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <div class="kuromi-container">
        <div class="header">
            <div class="kuromi-decoration decoration-1">☠</div>
            <div class="kuromi-decoration decoration-2">🖤</div>
            <div class="kuromi-decoration decoration-3">🕶</div>
            <div class="title-box">
                <h1 class="title">Yetbyeの朋友圈</h1>
                <div class="subtitle">哇哇哇哇</div>
            </div>
        </div>
        <!-- 对话气泡 -->
        <div class="kuromi-bubble bubble-1">
            今天也要保持酷酷的态度！
            <div class="bubble-arrow"></div>
        </div>
        <div class="kuromi-bubble bubble-2">
            活着太累了，抽象一点不好吗(●ˇ∀ˇ●)
            <div class="bubble-arrow"></div>
        </div>
        <!-- 朋友圈动态列表 -->
        <div id="moments-list">
            <div class="loading-container">
                <div class="loading-icon">
                    <i class="fas fa-skull"></i>
                </div>
                <p class="loading-text">小小牛马为您加载...</p>
            </div>
        </div>
        <!-- 分页控件 -->
        <div id="pagination" class="kuromi-pagination"></div>
        <div class="kuromi-footer">
            <span>Yetbyeの朋友圈</span>
            <i class="fas fa-skull"></i>
            <span>保持酷酷的态度</span>
        </div>
    </div>
    <script>
        // 全局变量
        let currentPage = 1;
        const itemsPerPage = 4;
        let totalPages = 1;
        let allMoments = [];
        // 从外部JSON文件加载数据
        function loadMoments() {
            fetch('/data/moments.json')
              .then(response => response.json())
              .then(data => {
                  allMoments = data;
                  totalPages = Math.ceil(data.length / itemsPerPage);
                  renderMoments(currentPage);
                  renderPagination(currentPage);
              })
              .catch(error => handleError(error));
        }
        // 错误处理
        function handleError(error) {
            console.error('加载朋友圈数据失败:', error);
            const container = document.getElementById('moments-list');
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-skull"></i>
                    </div>
                    <h3>动态加载失败</h3>
                    <p>Yetbye今天在思考黑暗哲学：我是谁？</p>
                </div>
            `;
        }
        // 渲染朋友圈动态
        function renderMoments(page) {
            const container = document.getElementById('moments-list');
            if (!allMoments || allMoments.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-skull"></i>
                        </div>
                        <h3>暂无动态</h3>
                        <p>Yetbye今天在思考黑暗哲学：我是谁？</p>
                    </div>
                `;
                return;
            }
            // 计算当前页的数据
            const startIndex = (page - 1) * itemsPerPage;
            const pageData = allMoments.slice(startIndex, startIndex + itemsPerPage);
            container.innerHTML = '';
            pageData.forEach((moment, index) => {
                const hasImages = moment.images && moment.images.length > 0;
                const hasTags = moment.tags && moment.tags.length > 0;
                let imagesHTML = '';
                if (hasImages) {
                    imagesHTML = `<div class="moment-images">`;
                    moment.images.forEach(img => {
                        imagesHTML += `<img src="${img}" class="moment-image" alt="动态图片">`;
                    });
                    imagesHTML += `</div>`;
                } else {
                    imagesHTML = `
                        <div class="moment-images">
                            <div class="moment-image">
                                <div class="image-placeholder">
                                    <i class="fas fa-skull"></i>
                                </div>
                            </div>
                        </div>
                    `;
                }
                let tagsHTML = '';
                if (hasTags) {
                    tagsHTML = `<div class="moment-tags">`;
                    moment.tags.forEach(tag => {
                        tagsHTML += `<span class="moment-tag">#${tag}</span>`;
                    });
                    tagsHTML += `</div>`;
                }
                let locationHTML = '';
                if (moment.location) {
                    locationHTML = `<div class="location-tag">
                        <i class="fas fa-map-marker-alt"></i> ${moment.location}
                    </div>`;
                }
                const momentHTML = `
                    <div class="moment-item" data-id="${moment.id}">
                        <div class="kuromi-corner">
                            <i class="fas fa-skull"></i>
                        </div>
                        <div class="moment-header">
                            <div class="moment-avatar">
                                <i class="fas fa-laugh-squint"></i>
                            </div>
                            <div class="moment-info">
                                <div class="moment-author">
                                    Yetbye
                                    <span class="author-badge">happy</span>
                                </div>
                                <div class="moment-time">
                                    <i class="fas fa-clock"></i> ${moment.date}
                                </div>
                            </div>
                        </div>
                        <div class="moment-content">
                            ${moment.content}
                            ${locationHTML}
                            ${tagsHTML}
                        </div>
                        ${imagesHTML}
                        <div class="moment-stats">
                            <div class="moment-stat like-btn ${moment.liked ? 'liked' : ''}">
                                <span class="stat-icon">🖤</span> 
                                <span class="like-count">${moment.likes}</span>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += momentHTML;
            });
            // 添加事件监听
            addEventListeners();
        }
        // 渲染分页控件
        function renderPagination(currentPage) {
            const container = document.getElementById('pagination');
            if (!container) return;
            container.innerHTML = '';
            // 上一页按钮
            const prevBtn = document.createElement('div');
            prevBtn.className = 'pagination-btn';
            if (currentPage === 1) prevBtn.classList.add('disabled');
            prevBtn.innerHTML = '&lt;';
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    renderMoments(currentPage - 1);
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
                        renderMoments(i);
                        renderPagination(i);
                    }
                });
                container.appendChild(pageBtn);
            }
            // 下一页按钮
            const nextBtn = document.createElement('div');
            nextBtn.className = 'pagination-btn';
            if (currentPage === totalPages) nextBtn.classList.add('disabled');
            nextBtn.innerHTML = '&gt;';
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    renderMoments(currentPage + 1);
                    renderPagination(currentPage + 1);
                }
            });
            container.appendChild(nextBtn);
        }
        // 添加事件监听器
        function addEventListeners() {
            // 点赞功能
            document.querySelectorAll('.like-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const likeCount = this.querySelector('.like-count');
                    const icon = this.querySelector('.stat-icon');
                    let count = parseInt(likeCount.textContent);
                    if (this.classList.contains('liked')) {
                        this.classList.remove('liked');
                        icon.style.transform = 'scale(1)';
                        count--;
                    } else {
                        this.classList.add('liked');
                        icon.style.transform = 'scale(1.2)';
                        count++;
                        // 添加动画效果
                        const heart = document.createElement('div');
                        heart.innerHTML = '🖤';
                        heart.style.position = 'absolute';
                        heart.style.color = 'var(--primary-medium)';
                        heart.style.fontSize = '25px';
                        heart.style.pointerEvents = 'none';
                        heart.style.left = `${icon.getBoundingClientRect().left}px`;
                        heart.style.top = `${icon.getBoundingClientRect().top}px`;
                        heart.style.opacity = '1';
                        heart.style.transition = 'all 0.8s';
                        heart.style.zIndex = '100';
                        document.body.appendChild(heart);
                        setTimeout(() => {
                            heart.style.transform = 'translateY(-40px)';
                            heart.style.opacity = '0';
                        }, 10);
                        setTimeout(() => {
                            document.body.removeChild(heart);
                        }, 800);
                        setTimeout(() => {
                            icon.style.transform = 'scale(1)';
                        }, 300);
                    }
                    likeCount.textContent = count;
                });
            });
        }
        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            loadMoments();
        });
    </script>
</body>
</html>