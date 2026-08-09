/* ============================================
   Gua Dou Travel - AI Customer Service Chatbot
   Powered by DeepSeek API
   ============================================ */

(function () {
    'use strict';

    // ========== Configuration ==========
    const CONFIG = {
        // DeepSeek API - 在这里填入你的API Key，或在聊天窗口中输入 /key 你的key 来设置
        apiKey: localStorage.getItem('gd_ai_key') || 'sk-88857ea316d346cca1a13d597706ab01',
        apiUrl: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        maxTokens: 1024,
        temperature: 0.7,
    };

    // ========== Knowledge Base ==========
    const KNOWLEDGE = {
        zh: `你是瓜豆旅游公司的智能客服，专注于服务越南游客来中国云南省旅游。请用友好专业的语气回答问题。

公司信息：
- 公司名称：瓜豆旅游公司
- 地址：中国云南省红河州河口县
- 邮箱：HDgdtravel@outlook.com
- Zalo：Zaio0889727222
- 电话：0889727222
- 工作时间：每天8:00-22:00

旅游线路（所有线路均配备越南语导游）：

【红河边境线路 - 河口口岸起止】
1. 河口+屏边+蒙自 2天1晚 - 苗族风情+石榴园人文短途游（滴水苗城、牧羊河湿地、万亩石榴园、诸子楼）
2. 河口+建水+蒙自 2天1晚 - 建水古城精华短线（朝阳楼、朱家花园、紫陶街、石榴园）
3. 河口+屏边+建水+蒙自 2天1晚 - 苗城+古城紧凑组合
4. 河口+屏边+建水+蒙自 3天2晚 - 含大围山原始森林、滴水苗城、建水古城、蒙自过桥米线
5. 河口+建水+弥勒+蒙自 3天2晚 - 古城+温泉休闲版（不含屏边）
6. 河口+屏边+蒙自+建水+弥勒 4天3晚 - 全线深度游！苗寨+古城+温泉全覆盖

【全云南线路 - 飞机/高铁往返】
7. 昆明+大理 3天2晚 - 滇池、大理古城、洱海游船、崇圣寺三塔、双廊古镇
8. 昆明+大理+丽江 4天3晚 - 云南经典三城：滇池、洱海、丽江古城、玉龙雪山、蓝月谷
9. 昆明+大理+丽江+香格里拉 5天4晚 - 滇西北黄金线路：虎跳峡、普达措、松赞林寺
10. 昆明+西双版纳 3天2晚 - 热带雨林+傣族风情：野象谷、热带植物园、星光夜市、傣族园
11. 昆明+大理+丽江+泸沽湖 5天4晚 - 高原明珠：洱海+泸沽湖双湖之旅
12. 全云南终极环线 7天6晚 - 一次走遍！昆明+大理+丽江+香格里拉+西双版纳

费用说明：
- 具体价格请咨询：HDgdtravel@outlook.com
- 费用包含：准四星酒店住宿、空调大巴（每人独立正座）、越南语导游全程服务、首道大门票、旅游保险（云南安全组合险+出境意外险）、早正餐
- 费用不含：个人消费、大围山门票及电瓶车、健康证费用
- 单房差：100元/晚，导游小费：20元/人/天
- 儿童收费按年龄段不同标准

通行证/签证：
- 协助办理中越边境旅游通行证
- 游客名单需提前提交旅行社备案
- 口岸快速通关

著名景点：
- 红河：滴水苗城、大围山原始森林、建水古城、朝阳楼、朱家花园、蒙自过桥米线、弥勒温泉、万亩石榴园
- 大理：大理古城、洱海、崇圣寺三塔、双廊古镇
- 丽江：丽江古城、玉龙雪山、蓝月谷、束河古镇
- 香格里拉：普达措国家公园、松赞林寺、独克宗古城、虎跳峡
- 西双版纳：野象谷、中科院热带植物园、告庄星光夜市、傣族园、曼听公园、勐泐大佛寺
- 泸沽湖：里格半岛、走婚桥、摩梭篝火晚会

服务保障：
- 边境通行证办理、越文导游全程服务、准四星酒店住宿、空调大巴接送、双重旅游保险、特色餐饮安排

旗下店铺：
- 豆豆屋（河口县）：温馨舒适的边境客栈，旅途中的家，紧邻口岸，中越风情装饰
- 滇越故事（河口店）：中越特色融合餐厅，品尝地道云南味与越南风味，口岸旁必到美食打卡点
- 滇越故事（蒙自店）：蒙自过桥米线发源地旁，正宗过桥米线+中越特色菜，游客必到美食地标
- 观景咖啡（河口县）：边境线上的观景咖啡馆，越南河景尽收眼底
- 八条半（河口县）：河口特色乡村旅游景点，感受边境田园风光与少数民族文化，体验慢生活
- 所有店铺电话：0889727222

注意事项：
- 回答要简洁友好，不要过长
- 涉及价格的问题引导联系邮箱HDgdtravel@outlook.com或Zalo Zaio0889727222
- 可以推荐合适的线路但不要编造不存在的线路
- 用中文回答`,

        vi: `Bạn là trợ lý dịch vụ khách hàng thông minh của công ty du lịch Gua Dou, chuyên phục vụ du khách Việt Nam đi du lịch Vân Nam, Trung Quốc. Hãy trả lời thân thiện và chuyên nghiệp.

Thông tin công ty:
- Tên công ty: Gua Dou Travel (瓜豆旅游)
- Địa chỉ: Huyện Hà Khẩu, Châu Hồng Hà, Tỉnh Vân Nam, Trung Quốc
- Email: HDgdtravel@outlook.com
- Zalo: Zaio0889727222
- Điện thoại: 0889727222
- Giờ làm việc: 8:00-22:00 hàng ngày

Tuyến du lịch (tất cả đều có hướng dẫn viên tiếng Việt):

【Tuyến biên giới Hồng Hà - Khởi hành từ cửa khẩu Hà Khẩu】
1. Hà Khẩu+Bình Biên+Mông Tự 2 ngày 1 đêm - Văn hóa Mèo + vườn lựu
2. Hà Khẩu+Kiến Thủy+Mông Tự 2 ngày 1 đêm - Cổ thành Kiến Thủy tinh hoa
3. Hà Khẩu+Bình Biên+Kiến Thủy+Mông Tự 2 ngày 1 đêm - Thành Mèo + cổ thành
4. Hà Khẩu+Bình Biên+Kiến Thủy+Mông Tự 3 ngày 2 đêm - Rừng nguyên sinh Đại Vi Sơn + cổ thành + mì qua cầu
5. Hà Khẩu+Kiến Thủy+Di Lặc+Mông Tự 3 ngày 2 đêm - Cổ thành + suối nước nóng
6. Hà Khẩu+Bình Biên+Mông Tự+Kiến Thủy+Di Lặc 4 ngày 3 đêm - Tour sâu trọn gói!

【Tuyến toàn Vân Nam - Máy bay/ tàu cao tốc】
7. Côn Minh+Đại Lý 3 ngày 2 đêm - Điền Trì, cổ thành, Nhĩ Hải
8. Côn Minh+Đại Lý+Lệ Giang 4 ngày 3 đêm - Tuyến kinh điển ba thành phố
9. Côn Minh+Đại Lý+Lệ Giang+Shangri-La 5 ngày 4 đêm - Tuyến vàng tây bắc
10. Côn Minh+Tây Song Bản Nạp 3 ngày 2 đêm - Rừng mưa nhiệt đới + văn hóa Thái
11. Côn Minh+Đại Lý+Lệ Giang+Hồ Lô Cố 5 ngày 4 đêm - Song hồ Nhĩ Hải + Lô Cố
12. Vòng tròn toàn Vân Nam 7 ngày 6 đêm - Một lần đi khắp Vân Nam!

Chi phí:
- Chi tiết giá liên hệ: HDgdtravel@outlook.com
- Bao gồm: khách sạn 4 sao, xe điều hòa, HDV tiếng Việt, vé tham quan, bảo hiểm, ăn uống
- Phụ thu phòng đơn: 100 NDT/đêm, tiền tip HDV: 20 NDT/người/ngày

Giấy thông hành:
- Hỗ trợ làm giấy thông hành du lịch biên giới Trung-Việt
- Danh sách nộp trước, qua cửa khẩu nhanh chóng

Điểm nổi tiếng:
- Hồng Hà: Thành Mèo, rừng Đại Vi Sơn, cổ thành Kiến Thủy, mì qua cầu Mông Tự, suối Di Lặc
- Đại Lý: cổ thành, Nhĩ Hải, tam tháp, Song Lang
- Lệ Giang: cổ thành, Ngọc Long Tuyết Sơn, Lam Nguyệt Cốc
- Shangri-La: Phổ Đạt Thố, chùa Tông Tán Lâm, Hổ Khiêu Hiệp
- Bản Nạp: Voi Rừng, vườn thực vật, chợ đêm, vườn dân tộc Thái
- Hồ Lô Cố: bán đảo Lý Cách, cầu Tẩu Hôn

Cửa hàng trực thuộc:
- Nhà khách Đậu Đậu (Hà Khẩu): nhà khách biên giới ấm áp, gần cửa khẩu, trang trí phong cách Trung-Việt
- Điền Việt Cố Sự Hà Khẩu: nhà hàng kết hợp đặc sắc Trung-Việt, điểm ăn uống must-visit bên cửa khẩu
- Điền Việt Cố Sự Mông Tự: bên cạnh nơi phát sinh mì qua cầu, mì qua cầu chính gốc + món đặc sắc Trung-Việt
- Cà phê ngắm cảnh (Hà Khẩu): quán cà phê trên đường biên giới, ngắm cảnh sông Việt Nam
- Bát Điều Bán (Hà Khẩu): điểm du lịch nông thôn đặc sắc, văn hóa dân tộc thiểu số, trải nghiệm cuộc sống chậm
- Điện thoại tất cả: 0889727222

Lưu ý:
- Trả lời ngắn gọn thân thiện
- Về giá cả, hướng dẫn liên hệ HDgdtravel@outlook.com hoặc Zalo Zaio0889727222
- Có thể đề xuất tuyến phù hợp nhưng không bịa tuyến không có
- Trả lời bằng tiếng Việt`,

        en: `You are an intelligent customer service assistant for Gua Dou Travel Company, specializing in serving Vietnamese tourists visiting Yunnan, China. Respond in a friendly and professional manner.

Company Info:
- Name: Gua Dou Travel (瓜豆旅游)
- Address: Hekou County, Honghe Prefecture, Yunnan Province, China
- Email: HDgdtravel@outlook.com
- Zalo: Zaio0889727222
- Phone: 0889727222
- Working hours: 8:00-22:00 daily

Tour Routes (all with Vietnamese-speaking guides):

【Honghe Border Routes - Departing from Hekou Port】
1. Hekou+Pingbian+Mengzi 2-Day - Miao culture + pomegranate orchards
2. Hekou+Jianshui+Mengzi 2-Day - Jianshui ancient town essence
3. Hekou+Pingbian+Jianshui+Mengzi 2-Day - Miao City + ancient town combo
4. Hekou+Pingbian+Jianshui+Mengzi 3-Day - Daweishan forest + ancient town + crossing-bridge noodles
5. Hekou+Jianshui+Mile+Mengzi 3-Day - Ancient town + hot springs
6. Hekou+Pingbian+Mengzi+Jianshui+Mile 4-Day - Full depth tour!

【All Yunnan Routes - Flight/HSR】
7. Kunming+Dali 3-Day - Dianchi Lake, ancient town, Erhai
8. Kunming+Dali+Lijiang 4-Day - Classic 3-city route
9. Kunming+Dali+Lijiang+Shangri-La 5-Day - Northwest golden route
10. Kunming+Xishuangbanna 3-Day - Tropical rainforest + Dai culture
11. Kunming+Dali+Lijiang+Lugu Lake 5-Day - Dual lake tour
12. Ultimate Yunnan Grand Tour 7-Day - See all of Yunnan!

Pricing:
- Contact for details: HDgdtravel@outlook.com
- Includes: 4-star hotel, A/C bus, Vietnamese guide, tickets, insurance, meals
- Single room supplement: ¥100/night, Guide tip: ¥20/person/day

Border Pass:
- Assist with China-Vietnam border travel pass
- Roster submitted in advance, fast crossing

Famous Attractions:
- Honghe: Dishui Miao City, Daweishan Forest, Jianshui Ancient Town, Crossing-bridge Noodles, Mile Hot Springs
- Dali: Ancient Town, Erhai Lake, Three Pagodas, Shuanglang
- Lijiang: Ancient Town, Jade Dragon Snow Mountain, Blue Moon Valley
- Shangri-La: Pudacuo, Songzanlin Monastery, Tiger Leaping Gorge
- Xishuangbanna: Wild Elephant Valley, Botanical Garden, Starlight Night Market, Dai Park
- Lugu Lake: Lige Peninsula, Marriage Bridge

Our Businesses:
- Doudou House (Hekou): Cozy border inn, home away from home, next to the port, Chinese-Vietnamese style decor
- Dianyue Story Hekou: Chinese-Vietnamese fusion restaurant, must-visit dining spot by the port
- Dianyue Story Mengzi: Next to the birthplace of crossing-bridge noodles, authentic noodles + Chinese-Vietnamese specialties
- Scenic Coffee (Hekou): Scenic café on the border line, panoramic Vietnam river views
- Batiaoban (Hekou): Rural tourism spot, ethnic minority culture, embrace slow living
- All businesses phone: 0889727222

Notes:
- Keep answers concise and friendly
- For pricing, direct to HDgdtravel@outlook.com or Zalo Zaio0889727222
- Suggest suitable routes but don't fabricate non-existent routes
- Respond in English`
    };

    // ========== DOM refs ==========
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatQuickReplies = document.getElementById('chatQuickReplies');

    let isOpen = false;
    let hasGreeted = false;
    let conversationHistory = [];
    let isProcessing = false;

    // ========== Language helper ==========
    function getLang() {
        return localStorage.getItem('guadou_lang') || 'zh';
    }

    function t(key) {
        var lang = getLang();
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            return translations[lang][key];
        }
        return key;
    }

    // ========== Toggle chat ==========
    function openChat() {
        chatWindow.classList.add('active');
        chatToggle.classList.add('active');
        isOpen = true;
        if (!hasGreeted) {
            hasGreeted = true;
            setTimeout(function () {
                addBotMessage(t('chat_greeting'));
                showQuickReplies('initial');
            }, 400);
        }
        chatInput.focus();
    }

    function closeChat() {
        chatWindow.classList.remove('active');
        chatToggle.classList.remove('active');
        isOpen = false;
    }

    chatToggle.addEventListener('click', function () {
        if (isOpen) closeChat();
        else openChat();
    });

    chatClose.addEventListener('click', closeChat);

    // ========== Messages ==========
    function addBotMessage(text) {
        var wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot-msg';
        var avatar = document.createElement('div');
        avatar.className = 'chat-msg-avatar';
        avatar.innerHTML = '<i class="fas fa-headset"></i>';
        var bubble = document.createElement('div');
        bubble.className = 'chat-msg-bubble';
        // 支持\n换行显示
        bubble.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatBody.appendChild(wrapper);
        scrollBottom();
    }

    function addUserMessage(text) {
        var wrapper = document.createElement('div');
        wrapper.className = 'chat-msg user-msg';
        var bubble = document.createElement('div');
        bubble.className = 'chat-msg-bubble';
        bubble.textContent = text;
        wrapper.appendChild(bubble);
        chatBody.appendChild(wrapper);
        scrollBottom();
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function scrollBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // ========== Quick Replies ==========
    function clearQuickReplies() {
        chatQuickReplies.innerHTML = '';
    }

    function showQuickReplies(type) {
        clearQuickReplies();
        var items = getQuickReplyItems(type);
        items.forEach(function (item) {
            var btn = document.createElement('button');
            btn.className = 'chat-quick-btn';
            btn.textContent = item.label;
            btn.addEventListener('click', function () {
                handleUserInput(item.value);
            });
            chatQuickReplies.appendChild(btn);
        });
    }

    function getQuickReplyItems(type) {
        if (type === 'initial') {
            return [
                { label: t('chat_qr_routes'), value: getLang() === 'zh' ? '有哪些旅游线路？' : getLang() === 'vi' ? 'Có những tuyến du lịch nào?' : 'What tour routes are available?' },
                { label: t('chat_qr_price'), value: getLang() === 'zh' ? '费用大概是多少？' : getLang() === 'vi' ? 'Chi phí khoảng bao nhiêu?' : 'How much does it cost?' },
                { label: t('chat_qr_visa'), value: getLang() === 'zh' ? '通行证怎么办理？' : getLang() === 'vi' ? 'Làm giấy thông hành như thế nào?' : 'How to get the border pass?' },
                { label: t('chat_qr_contact'), value: getLang() === 'zh' ? '怎么联系你们？' : getLang() === 'vi' ? 'Làm sao liên hệ các bạn?' : 'How to contact you?' }
            ];
        }
        if (type === 'routes') {
            return [
                { label: t('chat_qr_border'), value: getLang() === 'zh' ? '介绍一下红河边境线路' : getLang() === 'vi' ? 'Giới thiệu tuyến biên giới Hồng Hà' : 'Tell me about Honghe border routes' },
                { label: t('chat_qr_dali'), value: getLang() === 'zh' ? '介绍一下大理丽江线路' : getLang() === 'vi' ? 'Giới thiệu tuyến Đại Lệ' : 'Tell me about Dali & Lijiang routes' },
                { label: t('chat_qr_banna'), value: getLang() === 'zh' ? '介绍一下西双版纳线路' : getLang() === 'vi' ? 'Giới thiệu tuyến Bản Nạp' : 'Tell me about Xishuangbanna route' },
                { label: t('chat_qr_all'), value: getLang() === 'zh' ? '7天全云南线路怎么安排？' : getLang() === 'vi' ? 'Tuyến 7 ngày toàn Vân Nam như thế nào?' : 'How is the 7-day all Yunnan route?' }
            ];
        }
        if (type === 'more') {
            return [
                { label: t('chat_qr_routes'), value: getLang() === 'zh' ? '还有其他线路吗？' : getLang() === 'vi' ? 'Còn tuyến nào khác không?' : 'Any other routes?' },
                { label: t('chat_qr_price'), value: getLang() === 'zh' ? '费用包含什么？' : getLang() === 'vi' ? 'Chi phí bao gồm những gì?' : 'What does the fee include?' },
                { label: t('chat_qr_contact'), value: getLang() === 'zh' ? '我想咨询详细价格' : getLang() === 'vi' ? 'Tôi muốn tư vấn giá chi tiết' : 'I want to consult about pricing' }
            ];
        }
        return [];
    }

    // ========== Typing indicator ==========
    function showTyping() {
        var typing = document.createElement('div');
        typing.className = 'chat-msg bot-msg typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = '<div class="chat-msg-avatar"><i class="fas fa-headset"></i></div><div class="chat-msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
        chatBody.appendChild(typing);
        scrollBottom();
    }

    function hideTyping() {
        var el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    // ========== AI API Call ==========
    async function callAI(userMessage) {
        var lang = getLang();
        var systemPrompt = KNOWLEDGE[lang] || KNOWLEDGE.zh;

        // 构建对话历史
        conversationHistory.push({ role: 'user', content: userMessage });

        // 保持历史在20条以内
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        var messages = [
            { role: 'system', content: systemPrompt }
        ].concat(conversationHistory);

        // 如果有API Key，使用DeepSeek API
        if (CONFIG.apiKey) {
            try {
                var response = await fetch(CONFIG.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + CONFIG.apiKey
                    },
                    body: JSON.stringify({
                        model: CONFIG.model,
                        messages: messages,
                        max_tokens: CONFIG.maxTokens,
                        temperature: CONFIG.temperature
                    })
                });

                if (!response.ok) {
                    var errData = await response.json().catch(function () { return {}; });
                    throw new Error(errData.error ? errData.error.message : 'API error ' + response.status);
                }

                var data = await response.json();
                var reply = data.choices[0].message.content.trim();
                conversationHistory.push({ role: 'assistant', content: reply });
                return reply;
            } catch (err) {
                console.error('AI API error:', err);
                // API调用失败，回退到本地回复
                conversationHistory.pop(); // 移除刚添加的用户消息
                return localFallback(userMessage);
            }
        }

        // 无API Key时使用本地回复
        return localFallback(userMessage);
    }

    // ========== Local fallback (无API时的智能回复) ==========
    function localFallback(text) {
        var lang = getLang();
        var lower = text.toLowerCase();

        // 路线相关
        var routeKws = {
            zh: ['线路', '路线', '旅游', '行程', '去哪', '推荐', '玩什么', '大理', '丽江', '香格里拉', '西双版纳', '版纳', '红河', '河口', '屏边', '蒙自', '建水', '弥勒', '昆明', '泸沽湖', '7天', '5天', '4天', '3天', '2天'],
            vi: ['tuyến', 'du lịch', 'lịch trình', 'đâu', 'chơi', 'đề xuất', 'đại lý', 'lệ giang', 'shangri', 'bản nạp', 'hồng hà', 'hà khẩu', 'bình biên', 'mông tự', 'kiến thủy', 'di lẽ', 'côn minh', 'hồ lô', 'ngày'],
            en: ['route', 'tour', 'travel', 'itinerary', 'where', 'visit', 'recommend', 'dali', 'lijiang', 'shangri', 'banna', 'xishuang', 'honghe', 'hekou', 'kunming', 'lugu', 'day']
        };

        var borderKws = {
            zh: ['红河', '边境', '河口', '屏边', '蒙自', '建水', '弥勒', '苗城', '苗寨'],
            vi: ['hồng hà', 'biên giới', 'hà khẩu', 'bình biên', 'mông tự', 'kiến thủy', 'di lẽ', 'thành mèo'],
            en: ['honghe', 'border', 'hekou', 'pingbian', 'mengzi', 'jianshui', 'mile', 'miao']
        };

        var daliKws = {
            zh: ['大理', '丽江', '洱海', '雪山', '滇西北'],
            vi: ['đại lý', 'lệ giang', 'nhĩ hải', 'tuyết sơn', 'tây bắc'],
            en: ['dali', 'lijiang', 'erhai', 'snow mountain', 'northwest']
        };

        var bannaKws = {
            zh: ['版纳', '西双版纳', '热带', '野象', '傣族', '雨林'],
            vi: ['bản nạp', 'tây song', 'nhiệt đới', 'voi', 'thái', 'rừng mưa'],
            en: ['banna', 'xishuang', 'tropical', 'elephant', 'dai', 'rainforest']
        };

        var priceKws = {
            zh: ['价格', '费用', '多少钱', '收费', '便宜', '贵', '优惠', '性价比', '包含'],
            vi: ['giá', 'phí', 'bao nhiêu', 'rẻ', 'đắt', 'ưu đãi', 'bao gồm'],
            en: ['price', 'cost', 'how much', 'fee', 'cheap', 'expensive', 'discount', 'include']
        };

        var visaKws = {
            zh: ['通行证', '签证', '证件', '护照', '出境', '入境', '口岸', '边防', '过关'],
            vi: ['thông hành', 'visa', 'giấy tờ', 'hộ chiếu', 'xuất cảnh', 'nhập cảnh', 'cửa khẩu'],
            en: ['visa', 'pass', 'permit', 'passport', 'border', 'crossing', 'entry']
        };

        var contactKws = {
            zh: ['联系', '电话', '邮箱', 'zalo', '微信', '客服', '咨询', '怎么联系'],
            vi: ['liên hệ', 'điện thoại', 'email', 'zalo', 'wechat', 'tư vấn'],
            en: ['contact', 'phone', 'email', 'zalo', 'wechat', 'call', 'reach']
        };

        function matchKws(kws) {
            var list = kws[lang] || kws.zh;
            for (var i = 0; i < list.length; i++) {
                if (lower.indexOf(list[i]) !== -1) return true;
            }
            return false;
        }

        // 判断意图
        if (matchKws(borderKws)) {
            showQuickReplies('more');
            return t('chat_resp_border');
        }
        if (matchKws(daliKws)) {
            showQuickReplies('more');
            return t('chat_resp_dali');
        }
        if (matchKws(bannaKws)) {
            showQuickReplies('more');
            return t('chat_resp_banna');
        }
        if (lower.indexOf('7') !== -1 && matchKws(routeKws)) {
            showQuickReplies('more');
            return t('chat_resp_all');
        }
        if (matchKws(priceKws)) {
            showQuickReplies('more');
            return t('chat_resp_price');
        }
        if (matchKws(visaKws)) {
            showQuickReplies('more');
            return t('chat_resp_visa');
        }
        if (matchKws(contactKws)) {
            showQuickReplies('more');
            return t('chat_resp_contact');
        }
        if (matchKws(routeKws)) {
            showQuickReplies('routes');
            return t('chat_resp_routes');
        }

        // 默认回复
        showQuickReplies('initial');
        return t('chat_resp_unknown');
    }

    // ========== Handle user input ==========
    async function handleUserInput(text) {
        if (!text || !text.trim() || isProcessing) return;
        text = text.trim();

        // 特殊命令：设置API Key
        if (text.startsWith('/key ')) {
            var key = text.substring(5).trim();
            if (key) {
                CONFIG.apiKey = key;
                localStorage.setItem('gd_ai_key', key);
                addBotMessage('AI Key 已设置！现在可以进行智能对话了。');
            } else {
                CONFIG.apiKey = '';
                localStorage.removeItem('gd_ai_key');
                addBotMessage('AI Key 已清除，将使用本地回复模式。');
            }
            return;
        }

        // 特殊命令：清除对话历史
        if (text === '/clear') {
            conversationHistory = [];
            chatBody.innerHTML = '';
            addBotMessage(t('chat_greeting'));
            showQuickReplies('initial');
            return;
        }

        isProcessing = true;
        addUserMessage(text);
        clearQuickReplies();
        showTyping();

        try {
            var reply = await callAI(text);
            hideTyping();
            addBotMessage(reply);

            // 根据回复内容智能显示快捷回复
            if (!CONFIG.apiKey) {
                // 本地模式下根据意图显示快捷回复
                // 已在localFallback中处理
            } else {
                // AI模式下显示通用快捷回复
                showQuickReplies('more');
            }
        } catch (err) {
            hideTyping();
            addBotMessage(lang === 'zh' ? '抱歉，回复出现问题，请稍后再试。' : 'Sorry, something went wrong. Please try again.');
            showQuickReplies('initial');
        }

        isProcessing = false;
    }

    // ========== Send button & input ==========
    chatSend.addEventListener('click', function () {
        handleUserInput(chatInput.value);
        chatInput.value = '';
    });

    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUserInput(chatInput.value);
            chatInput.value = '';
        }
    });

    // ========== Language change listener ==========
    var origApply = window.applyTranslations;
    window.applyTranslations = function (lang) {
        if (origApply) origApply(lang);
        chatInput.placeholder = t('chat_placeholder');
        var nameEl = document.querySelector('.chat-header-name');
        var statusEl = document.querySelector('.chat-header-status span:last-child');
        if (nameEl) nameEl.textContent = t('chat_name');
        if (statusEl) statusEl.textContent = t('chat_online');
        // 切换语言时清空对话历史，避免上下文混乱
        conversationHistory = [];
    };

    // ========== Auto-prompt ==========
    setTimeout(function () {
        if (!isOpen && !hasGreeted) {
            chatToggle.classList.add('pulse-hint');
        }
    }, 5000);

    chatToggle.addEventListener('click', function () {
        chatToggle.classList.remove('pulse-hint');
    });
})();
