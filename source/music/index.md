---
top_img: "/image/media/12.jpeg"
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YetbyeのCD墙</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .cd-wall-container {
            --primary-color: #8a2be2;
            --accent-color: #1db954;
            --dark-bg: #0f0c29;
            --card-bg: rgba(30, 30, 46, 0.6);
            --text-light: #f8f9fa;
            --text-secondary: #d0d0ff;
            background: linear-gradient(135deg, var(--dark-bg) 0%, #302b63 50%, #24243e 100%);
            color: var(--text-light);
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.6;
            position: relative;
        }
        .cd-wall-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .cd-wall-container .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .cd-wall-container header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            padding: 20px;
        }
        .cd-wall-container h1 {
            font-size: 3.5rem;
            font-weight: 800;
            letter-spacing: 1px;
            margin-bottom: 15px;
            background: linear-gradient(45deg, #ff6ec4, #7873f5, #ff6ec4);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-size: 300% 300%;
            animation: gradient-shift 8s ease infinite;
        }
        .cd-wall-container .subtitle {
            font-size: 1.4rem;
            max-width: 700px;
            margin: 0 auto 30px;
            color: var(--text-secondary);
            font-weight: 300;
        }
        .cd-wall-container .notice {
            background: rgba(255, 107, 107, 0.15);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            padding: 15px 20px;
            max-width: 800px;
            margin: 0 auto 30px;
            text-align: center;
            backdrop-filter: blur(5px);
        }
        .cd-wall-container .notice i {
            color: #ff6b6b;
            margin-right: 8px;
        }
        .cd-wall-container .album-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        .cd-wall-container .album-card {
            background: var(--card-bg);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            border: 1px solid rgba(138, 43, 226, 0.2);
            transform-style: preserve-3d;
            perspective: 1000px;
            cursor: pointer;
        }
        .cd-wall-container .album-card:hover {
            transform: translateY(-15px);
            box-shadow: 0 15px 40px rgba(138, 43, 226, 0.4);
            border-color: rgba(138, 43, 226, 0.5);
        }
        .cd-wall-container .album-cover {
            position: relative;
            height: 220px;
            overflow: hidden;
        }
        .cd-wall-container .album-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .cd-wall-container .album-card:hover .album-cover img {
            transform: scale(1.1);
        }
        .cd-wall-container .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .cd-wall-container .album-card:hover .play-overlay {
            opacity: 1;
        }
        .cd-wall-container .play-overlay i {
            font-size: 3.5rem;
            color: var(--accent-color);
            text-shadow: 0 0 20px rgba(29, 185, 84, 0.7);
            transition: transform 0.3s ease;
        }
        .cd-wall-container .copyright-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ff6b6b;
            text-align: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .cd-wall-container .album-card:hover .copyright-overlay {
            opacity: 1;
        }
        .cd-wall-container .copyright-overlay i {
            font-size: 2.5rem;
            margin-bottom: 15px;
        }
        .cd-wall-container .copyright-overlay p {
            font-size: 1rem;
            line-height: 1.4;
        }
        .cd-wall-container .album-info {
            padding: 15px;
            background: rgba(18, 18, 18, 0.8);
            text-align: center;
        }
        .cd-wall-container .album-info h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .cd-wall-container .artist {
            color: var(--accent-color);
            font-size: 0.95rem;
            margin-bottom: 3px;
        }
        .cd-wall-container .year {
            color: #a0a0a0;
            font-size: 0.85rem;
        }
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .cd-wall-container .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 20px;
            margin-bottom: 40px;
        }
        .cd-wall-container .page-btn {
            background: var(--card-bg);
            border: 1px solid rgba(138, 43, 226, 0.2);
            color: var(--text-light);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .cd-wall-container .page-btn:hover {
            background: var(--primary-color);
            border-color: rgba(138, 43, 226, 0.5);
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 6px 12px rgba(138, 43, 226, 0.4);
        }
        .cd-wall-container .page-btn:active {
            transform: translateY(0) scale(1);
        }
        .cd-wall-container .page-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
        .cd-wall-container .page-indicator {
            font-size: 1rem;
            color: var(--text-secondary);
            min-width: 80px;
            text-align: center;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.2);
            padding: 5px 15px;
            border-radius: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .cd-wall-container .decoration {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.15;
            z-index: -1;
        }
        .cd-wall-container .dec-1 {
            background: #ff6ec4;
            top: 10%;
            left: 5%;
        }
        .cd-wall-container .dec-2 {
            background: #7873f5;
            bottom: 10%;
            right: 5%;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .cd-wall-container .album-card {
            animation: fadeIn 0.6s ease-out forwards;
            opacity: 0;
        }
        .cd-wall-container .copyright-info {
            background: rgba(30, 30, 46, 0.8);
            border-top: 1px solid rgba(138, 43, 226, 0.3);
            padding: 20px;
            text-align: center;
            margin-top: 30px;
            border-radius: 0 0 15px 15px;
            font-size: 0.9rem;
            color: #d0d0ff;
        }
        .cd-wall-container .copyright-info a {
            color: #8a2be2;
            text-decoration: none;
            transition: color 0.3s;
        }
        .cd-wall-container .copyright-info a:hover {
            color: #ff6ec4;
            text-decoration: underline;
        }
        @media (max-width: 768px) {
            .cd-wall-container .container {
                padding: 30px 15px;
            }
            .cd-wall-container h1 {
                font-size: 2.5rem;
            }
            .cd-wall-container .subtitle {
                font-size: 1.1rem;
            }
            .cd-wall-container .album-grid {
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 20px;
            }
            .cd-wall-container .album-cover {
                height: 160px;
            }
            .cd-wall-container .pagination {
                gap: 10px;
            }
            .cd-wall-container .page-btn {
                width: 35px;
                height: 35px;
            }
            .cd-wall-container .copyright-overlay p {
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <div class="cd-wall-container">
        <div class="decoration dec-1"></div>
        <div class="decoration dec-2"></div>
        <div class="container">
            <header>
                <h1>YetbyeのCD墙</h1>
                <p class="subtitle">放松一下吧，朋友</p>
            </header>
            <div class="notice">
                <i class="fas fa-info-circle"></i>
                本页面仅用于音乐专辑展示推荐，由于版权原因，所有音乐均不可播放。
            </div>
            <div class="album-grid" id="albumContainer">
                <!-- 专辑将通过JavaScript动态加载 -->
            </div>
            <!-- 分页控件 -->
            <div class="pagination">
                <button id="prevPage" class="page-btn"><i class="fas fa-chevron-left"></i></button>
                <span id="pageIndicator" class="page-indicator">1 / 1</span>
                <button id="nextPage" class="page-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="copyright-info">
                <p><i class="fas fa-exclamation-triangle"></i> 本页面展示的所有专辑仅供推荐，版权归原唱片公司及音乐人所有</p>
                <p>根据版权保护政策，本站不提供任何音乐播放功能</p>
            </div>
        </div>
    </div>
    <script>
        // 模拟专辑数据
        const albums = [
            {
                "title": "LADY",
                "artist": "米津玄师",
                "cover": "/image/albums/lady.jpg",
                "year": 2023
            },
            {
                "title": "カナタハルカ",
                "artist": "RADWIMPS",
                "cover": "/image/albums/遥远的彼方.jpg",
                "year": 2023
            },
            {
                "title": "BLUE",
                "artist": "Troye Sivan",
                "cover": "/image/albums/blue.jpg",
                "year": 2015
            },
            {
                "title": "Beautiful World",
                "artist": "宇多田光",
                "cover": "",
                "year": 2021
            },
            {
                "title": "Lonely",
                "artist": "Justin Bieber",
                "cover": "",
                "year": 2021
            },
            {
                "title": "Walk on Water",
                "artist": "Eminem",
                "cover": "",
                "year": 2015
            },
            {
                "title": "YOU",
                "artist": "Troye Sivan",
                "cover": "",
                "year": 2022
            }
        ];
        // DOM 元素
        const albumContainer = document.getElementById('albumContainer');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageIndicator = document.getElementById('pageIndicator');
        // 分页变量
        let currentPage = 1;
        const perPage = 6; // 每页6张专辑
        let totalPages = Math.ceil(albums.length / perPage);
        // 初始化页面
        renderPage(currentPage);
        updatePaginationButtons();
        // 渲染指定页的专辑
        function renderPage(page) {
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const pageAlbums = albums.slice(start, end);
            albumContainer.innerHTML = '';
            pageAlbums.forEach((album, index) => {
                const albumCard = document.createElement('div');
                albumCard.className = 'album-card';
                albumCard.style.animationDelay = `${index * 0.1}s`; // 添加延迟动画
                albumCard.innerHTML = `
                    <div class="album-cover">
                        <img src="${album.cover}" alt="${album.title}">
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="copyright-overlay">
                            <i class="fas fa-ban"></i>
                            <p>版权原因，不可播放<br>仅做推荐</p>
                        </div>
                    </div>
                    <div class="album-info">
                        <h3>${album.title}</h3>
                        <p class="artist">${album.artist}</p>
                        <p class="year">${album.year}</p>
                    </div>
                `;
                albumCard.addEventListener('click', () => {
                    // 显示版权提示
                    const overlay = albumCard.querySelector('.copyright-overlay');
                    overlay.style.opacity = '1';
                    setTimeout(() => {
                        overlay.style.opacity = '';
                    }, 2000);
                    // 添加视觉反馈
                    albumCard.style.transform = 'translateY(-15px) scale(1.05)';
                    albumCard.style.boxShadow = '0 20px 50px rgba(138, 43, 226, 0.6)';
                    setTimeout(() => {
                        albumCard.style.transform = '';
                        albumCard.style.boxShadow = '';
                    }, 500);
                });
                albumContainer.appendChild(albumCard);
            });
            // 更新分页指示器
            pageIndicator.textContent = `${page} / ${totalPages}`;
            updatePaginationButtons();
        }
        // 更新分页按钮状态
        function updatePaginationButtons() {
            prevPageBtn.disabled = (currentPage === 1);
            nextPageBtn.disabled = (currentPage === totalPages || totalPages === 0);
            // 添加/移除disabled类用于样式
            if (prevPageBtn.disabled) {
                prevPageBtn.classList.add('disabled');
            } else {
                prevPageBtn.classList.remove('disabled');
            }
            if (nextPageBtn.disabled) {
                nextPageBtn.classList.add('disabled');
            } else {
                nextPageBtn.classList.remove('disabled');
            }
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
    </script>
</body>
</html>