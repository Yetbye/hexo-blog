---
top_img: "/image/media/shuoshuo.png"
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>信条墙 | 阻止熵增</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* 使用容器类名限定样式作用域 */
        .mottos-container {
            --primary-color: #3e2723;
            --secondary-color: #5d4037;
            --light-bg: #f5f1e8;
            --paper-color: #fff9e6;
            --border-color: #d9c7a1;
            --shadow-color: rgba(93, 64, 55, 0.2);
            background: var(--light-bg) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><rect fill="none" width="100" height="100"/><path d="M0,50 L100,50" stroke="%233e2723" stroke-width="1"/><path d="M50,0 L50,100" stroke="%233e2723" stroke-width="1"/></svg>');
            background-size: 100px 100px;
            min-height: 100vh;
            padding: 20px;
            font-family: 'Noto Serif SC', 'Ma Shan Zheng', serif;
            color: var(--primary-color);
            position: relative;
            overflow-x: hidden;
            line-height: 1.6;
        }
        .mottos-container .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
        }
        .mottos-container header {
            text-align: center;
            margin: 40px 0;
            padding: 20px;
        }
        .mottos-container h1 {
            font-size: 3.5rem;
            font-weight: 700;
            letter-spacing: 3px;
            margin-bottom: 15px;
            position: relative;
            display: inline-block;
            color: var(--primary-color);
        }
        .mottos-container h1:after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 4px;
            background: linear-gradient(90deg, transparent, var(--secondary-color), transparent);
        }
        .mottos-container .subtitle {
            font-size: 1.4rem;
            color: var(--secondary-color);
            font-style: italic;
            margin-top: 25px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }
        .mottos-container .stats-box {
            background: rgba(255, 249, 230, 0.7);
            border: 2px dashed var(--border-color);
            border-radius: 10px;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto 40px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        .mottos-container .stats-box p {
            margin: 10px 0;
            line-height: 1.6;
            font-size: 1.1rem;
        }
        .mottos-container .count {
            font-weight: bold;
            color: var(--secondary-color);
            font-size: 1.4rem;
        }
        /* 座右铭网格布局 */
        .mottos-container .mottos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 35px;
            margin-bottom: 50px;
        }
        /* 座右铭卡片样式 */
        .mottos-container .motto-card {
            background: var(--paper-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 3px 3px 10px var(--shadow-color);
            padding: 30px 25px;
            position: relative;
            min-height: 220px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: center;
            cursor: pointer;
        }
        /* 随机旋转和位置 */
        .mottos-container .motto-card:nth-child(3n+1) { transform: rotate(-1deg); }
        .mottos-container .motto-card:nth-child(3n+2) { transform: rotate(0.5deg); }
        .mottos-container .motto-card:nth-child(3n+3) { transform: rotate(1.2deg); }
        /* 纸张纹理和毛边效果 */
        .mottos-container .motto-card:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.08"><rect fill="none" width="100" height="100"/><path d="M20,0 L0,20" stroke="%235d4037" stroke-width="0.5" stroke-dasharray="5,5"/><path d="M40,0 L0,40" stroke="%235d4037" stroke-width="0.5" stroke-dasharray="5,5"/></svg>');
            background-size: 30px 30px;
            pointer-events: none;
        }
        .mottos-container .motto-card:hover {
            transform: rotate(0) scale(1.02);
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 2;
        }
        .mottos-container .motto-content {
            font-size: 1.3rem;
            line-height: 1.8;
            color: var(--primary-color);
            margin-bottom: 15px;
            text-align: center;
            font-weight: 500;
            font-style: italic;
            position: relative;
            padding: 0 20px;
        }
        .mottos-container .motto-content:before,
        .mottos-container .motto-content:after {
            content: """;
            position: absolute;
            font-size: 3rem;
            color: var(--secondary-color);
            opacity: 0.3;
        }
        .mottos-container .motto-content:before {
            top: -20px;
            left: 0;
        }
        .mottos-container .motto-content:after {
            bottom: -35px;
            right: 0;
            transform: rotate(180deg);
        }
        .mottos-container .motto-date {
            font-size: 0.95rem;
            color: var(--secondary-color);
            text-align: right;
            font-style: italic;
            border-top: 1px dashed var(--border-color);
            padding-top: 15px;
            margin-top: 15px;
        }
        /* 分页样式 */
        .mottos-container .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin: 40px 0;
        }
        .mottos-container .page-btn {
            background: #d7ccc8;
            border: none;
            color: var(--primary-color);
            border-radius: 50%;
            width: 45px;
            height: 45px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.15);
            font-size: 1.1rem;
        }
        .mottos-container .page-btn:hover {
            background: var(--secondary-color);
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 5px 12px rgba(0,0,0,0.2);
        }
        .mottos-container .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .mottos-container .page-indicator {
            font-size: 1.2rem;
            color: var(--primary-color);
            min-width: 100px;
            text-align: center;
            font-weight: bold;
            background: rgba(255, 249, 230, 0.7);
            padding: 8px 20px;
            border-radius: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        /* 装饰元素 */
        .mottos-container .decoration {
            position: absolute;
            width: 200px;
            height: 200px;
            opacity: 0.05;
            z-index: 1;
            pointer-events: none;
        }
        .mottos-container .dec-1 {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,10 Q40,5 50,20 T80,10 Q95,30 85,50 T95,80 Q75,95 50,85 T10,80 Q5,60 20,50 T10,20 Q25,5 50,10 Z" fill="%233e2723"/></svg>');
            top: 10%;
            left: 5%;
        }
        .mottos-container .dec-2 {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%233e2723" stroke-width="2"/><circle cx="50" cy="50" r="30" fill="none" stroke="%233e2723" stroke-width="1"/></svg>');
            bottom: 10%;
            right: 5%;
        }
        /* 动画效果 */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px) rotate(2deg); }
            to { opacity: 1; transform: translateY(0) rotate(var(--rotation)); }
        }
        .mottos-container .motto-card {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
        }
        /* 图钉效果 */
        .mottos-container .pin {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%) rotate(15deg);
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #d1c4e9 30%, #7e57c2 100%);
            border-radius: 50% 50% 50% 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 1;
        }
        .mottos-container .pin:before {
            content: "";
            position: absolute;
            top: 3px;
            left: 3px;
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
        }
        /* 加载动画 */
        .mottos-container .loader {
            text-align: center;
            padding: 60px;
            font-size: 1.2rem;
            color: var(--secondary-color);
        }
        .mottos-container .loader .fa-spinner {
            animation: spin 1.5s linear infinite;
            margin-right: 10px;
            font-size: 2rem;
        }
        .mottos-container .error-box {
            background: rgba(255, 235, 238, 0.8);
            border: 1px solid #ffcdd2;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
        }
        .mottos-container .error-box i {
            font-size: 3rem;
            color: #d32f2f;
            margin-bottom: 20px;
        }
        .mottos-container .error-box p {
            font-size: 1.2rem;
            color: #b71c1c;
            line-height: 1.6;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        /* 响应式设计 */
        @media (max-width: 900px) {
            .mottos-container .mottos-grid {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 30px;
            }
            .mottos-container h1 {
                font-size: 3rem;
            }
            .mottos-container .motto-content {
                font-size: 1.25rem;
            }
        }
        @media (max-width: 768px) {
            .mottos-container .mottos-grid {
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 25px;
            }
            .mottos-container h1 {
                font-size: 2.5rem;
            }
            .mottos-container .subtitle {
                font-size: 1.2rem;
            }
            .mottos-container .motto-card {
                padding: 25px 20px;
                min-height: 200px;
            }
            .mottos-container .motto-content {
                font-size: 1.15rem;
            }
            .mottos-container .page-btn {
                width: 40px;
                height: 40px;
            }
            .mottos-container .page-indicator {
                min-width: 80px;
                font-size: 1.1rem;
            }
        }
        @media (max-width: 480px) {
            .mottos-container .mottos-grid {
                grid-template-columns: 1fr;
            }
            .mottos-container h1 {
                font-size: 2.2rem;
            }
            .mottos-container .motto-card {
                min-height: 180px;
            }
            .mottos-container .pagination {
                gap: 15px;
            }
            .mottos-container .page-indicator {
                padding: 6px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="mottos-container">
        <div class="decoration dec-1"></div>
        <div class="decoration dec-2"></div>
        <div class="container">
            <header>
                <h1>信条墙</h1>
                <p class="subtitle">Yetbyeの小纸条</p>
            </header>
            <div class="stats-box">
                <p>做好自己而不要迷失在时代洪流</p>
                <p>共 <span class="count" id="mottoCount">0</span> 条纸条</p>
            </div>
            <div class="mottos-grid" id="mottosContainer">
                <div class="loader">
                    <i class="fas fa-spinner"></i> 正在加载纸条数据...
                </div>
            </div>
            <div class="pagination">
                <button id="prevPage" class="page-btn" title="上一页"><i class="fas fa-chevron-left"></i></button>
                <span id="pageIndicator" class="page-indicator">1 / 1</span>
                <button id="nextPage" class="page-btn" title="下一页"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    </div>
    <script>
        // 页面元素
        const mottosContainer = document.getElementById('mottosContainer');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageIndicator = document.getElementById('pageIndicator');
        const mottoCount = document.getElementById('mottoCount');
        // 分页变量
        let allMottos = [];
        let currentPage = 1;
        const perPage = 12; // 每页12条信条
        let totalPages = 1;
        // 从服务器加载数据 - 使用JSON格式
        function loadMottos() {
            fetch('/data/shuoshuo.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常');
                    }
                    return response.json();
                })
                .then(data => {
                    // 确保数据是数组格式
                    if (Array.isArray(data)) {
                        allMottos = data;
                    } else {
                        // 如果返回的是对象，尝试提取数组
                        if (data.mottos) {
                            allMottos = data.mottos;
                        } else if (data.items) {
                            allMottos = data.items;
                        } else {
                            throw new Error('数据格式不正确');
                        }
                    }
                    // 更新信条总数
                    mottoCount.textContent = allMottos.length;
                    // 随机排序信条
                    shuffleArray(allMottos);
                    // 计算总页数
                    totalPages = Math.ceil(allMottos.length / perPage);
                    // 渲染第一页
                    renderPage(currentPage);
                    // 更新分页按钮状态
                    updatePaginationButtons();
                })
                .catch(error => {
                    console.error('加载纸条数据失败:', error);
                    mottosContainer.innerHTML = `
                        <div class="error-box">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>加载纸条数据失败</p>
                            <p>错误信息: ${error.message}</p>
                            <p>请检查数据文件路径和格式是否正确</p>
                            <p>推荐使用JSON格式：[{"content":"...", "date":"..."}, ...]</p>
                        </div>
                    `;
                });
        }
        // 数组随机排序
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        // 渲染指定页的信条
        function renderPage(page) {
            const start = (page - 1) * perPage;
            const end = Math.min(start + perPage, allMottos.length);
            const pageMottos = allMottos.slice(start, end);
            // 清空容器
            mottosContainer.innerHTML = '';
            // 如果没有纸条
            if (pageMottos.length === 0) {
                mottosContainer.innerHTML = '<div class="error-box"><p>暂时没有信条数据</p></div>';
                return;
            }
            // 添加纸条到页面
            pageMottos.forEach((motto, index) => {
                const mottoCard = document.createElement('div');
                mottoCard.className = 'motto-card';
                mottoCard.style.setProperty('--rotation', `${Math.random() * 4 - 2}deg`);
                mottoCard.style.animationDelay = `${index * 0.1}s`;
                mottoCard.innerHTML = `
                    <div class="pin"></div>
                    <div class="motto-content">${motto.content || ''}</div>
                    <div class="motto-date">${motto.date || ''}</div>
                `;
                mottosContainer.appendChild(mottoCard);
            });
            // 更新分页指示器
            pageIndicator.textContent = `${page} / ${totalPages}`;
            // 更新分页按钮状态
            updatePaginationButtons();
        }
        // 更新分页按钮状态
        function updatePaginationButtons() {
            prevPageBtn.disabled = (currentPage === 1);
            nextPageBtn.disabled = (currentPage === totalPages || totalPages === 0);
        }
        // 上一页
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        // 下一页
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
        // 页面加载完成后获取数据
        window.addEventListener('DOMContentLoaded', loadMottos);
    </script>
</body>
</html>