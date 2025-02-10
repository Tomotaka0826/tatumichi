// XSS対策のためのエスケープ関数
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // XSS対策：画像のsrcを検証
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img && !img.src.startsWith(window.location.origin)) {
            console.error('Invalid image source');
            img.remove();
        }
    });

    // 最初のスライドを表示
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }

    setInterval(() => {
        if (slides.length > 0) {
            // 現在のスライドを非表示
            slides[currentSlide].classList.remove('active');
            
            // 次のスライドのインデックスを計算
            currentSlide = (currentSlide + 1) % slides.length;
            
            // 次のスライドを表示
            slides[currentSlide].classList.add('active');
        }
    }, 5000);
}

// イベントリスナーの追加時にエラーハンドリング
try {
    document.addEventListener('DOMContentLoaded', startSlideshow);
} catch (error) {
    console.error('Slideshow initialization failed:', error);
}

// クリックイベントのセキュリティ対策
document.addEventListener('click', function(event) {
    // 外部リンクの処理
    if (event.target.tagName === 'A' && event.target.href) {
        const link = event.target;
        // 外部リンクの場合、確認を表示
        if (!link.href.startsWith(window.location.origin)) {
            event.preventDefault();
            if (confirm('外部サイトに移動しますか？')) {
                window.open(link.href, '_blank', 'noopener,noreferrer');
            }
        }
    }
}); 