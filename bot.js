const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const token = '8500360693:AAFVx4CobmRyTvA_Nbe5-iM9LzrH3yJbTK4'; // GANTI TOKEN
/*
const bot = new TelegramBot(token, { polling: true });*/
const bot = new TelegramBot(token, {
    polling: true
});

bot.on('polling_error', (err) => {
    console.log('POLL ERROR =>');
    console.log(err);
});

bot.on('webhook_error', (err) => {
    console.log('WEBHOOK ERROR =>');
    console.log(err);
});

console.log("🔥 BOT IVAS AKTIF...");

// ================= DATABASE =================
if (!fs.existsSync('./groups.json')) {
    fs.writeFileSync('./groups.json', JSON.stringify([]));
}

let allowedGroups = JSON.parse(fs.readFileSync('./groups.json', 'utf8'));

// ================= PLATFORM =================

const onlyws = { 
    ivas_whatsapp: "whatsapp",
    }

const platforms = {
    ivas_whatsapp: "whatsapp",
    ivas_facebook: "facebook",
    ivas_tiktok: "tiktok",
    ivas_viber: "viber",
    ivas_apple: "apple",
    ivas_yango: "yango",
    ivas_amazon: "amazon",
    ivas_tinder: "tinder",
    ivas_telegram: "telegram",
    ivas_shein: "shein",
    ivas_shopee: "shopee",
    ivas_imo: "imo",
    ivas_microsoft: "microsoft",
    ivas_verify: "verify"
};

// ================= CEK ADMIN =================
async function isAdmin(chatId, userId) {
    try {
        const member = await bot.getChatMember(chatId, userId);
        return member.status === "administrator" || member.status === "creator";
    } catch {
        return false;
    }
}

// ================= CONTROL PANEL =================
function startMenu(chatId) {
    const isRegistered = allowedGroups.includes(chatId);

    return {
caption: `「 BOT WS WAYSS 」

( 🕊️) - Telegram || が作ったボットです。ボットを賢く責任を持って使用してください。ありがとうございます。 

┌───「 Users°Bot 」─────⬡
│⬡  📌 Status : ${isRegistered ? "✅ terdaftar" : "🔴 not registered yet"}
└────────────────────────⬡

┌───「 Informasi°Bot   」─────⬡
│ 🤖 Bot dapat dimasukkan ke grup pribadi
│ 👑 Jadikan bot sebagai admin
│ ⚙️ Semua fitur akan berjalan optimal
│ 🔗 Support berbagai platform otomatis
└────────────────────────⬡

┌───「 Feature°Bot   」─────⬡
│ • /cekivas
└────────────────────────⬡

┌───「 Customer 」─────⬡
│ 📩 Bantuan Owner
│ 👤 @qkanjutt
└────────────────────────⬡

\`\`\`© BOT WS WAYSS\`\`\``,
        options: {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "➕ Add Bot", callback_data: "btn_addbot" },
                        { text: "🗑 Remove Bot", callback_data: "btn_removebot" }
                    ],
                    [
                        
                    ]
                ]
            }
        }
    };
}

// ================= MENU PLATFORM =================
function platformMenu() {
    return {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "📱 WhatsApp", callback_data: "ivas_whatsapp" },
                    { text: "📘 Facebook", callback_data: "ivas_facebook" }
                ],
                [
                    { text: "🎵 TikTok", callback_data: "ivas_tiktok" },
                    { text: "📞 Viber", callback_data: "ivas_viber" }
                ],
                [
                    { text: "🍎 Apple", callback_data: "ivas_apple" },
                    { text: "🛒 Amazon", callback_data: "ivas_amazon" }
                ],
                [
                    { text: "🔥 Tinder", callback_data: "ivas_tinder" },
                    { text: "🛍 Shopee", callback_data: "ivas_shopee" }
                ],
                [
                    { text: "💄 Shein", callback_data: "ivas_shein" },
                    { text: "💬 IMO", callback_data: "ivas_imo" }
                ],
                [
                    { text: "🪟 Microsoft", callback_data: "ivas_microsoft" },
                    { text: "✈️ Telegram", callback_data: "ivas_telegram" }
                ],
                [
                    { text: "🚕 Yango", callback_data: "ivas_yango" },
                    { text: "✅ Verify", callback_data: "ivas_verify" }
                ],
                [
                    { text: "🔙 Kembali", callback_data: "back_start" }
                ]
            ]
        }
    };
}

// ================= STATS =================
bot.onText(/\/stats/, async (msg) => {

    const chatId = msg.chat.id;

    try {

        // loading
        const loading = await bot.sendMessage(
            chatId,
            "⏳ Mengambil leaderboard..."
        );

        // ================= API =================
        const response = await axios.get(
            "http://ws.websocket.web.id/api/cekivas?platform=whatsapp"
        );

        // ================= DATA =================
        const totalSms = response.data.total_found;
        let results = response.data.results || [];

        // ================= SORT TRAFFIC =================
        // dari paling banyak -> paling kecil
        results.sort((a, b) => b.count - a.count);

        // ================= WIB =================
        const now = new Date();

        const tanggal = now.toLocaleDateString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );

        const jam = now.toLocaleTimeString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        // ================= TEXT =================
        let text = `🏆 *LEADERBOARD NEGARA*\n`;
        text += `Kategori: Standart Meta Business\n`;
        text += `Tanggal: ${tanggal}\n\n`;

        // ================= TOP 10 =================
        results.slice(0, 10).forEach((item, index) => {

    const persen = (
        (item.count / totalSms) * 100
    ).toFixed(2);

    // kategori otomatis
    let kategori = "LOW";

    if (persen >= 5)
        kategori = "STD";

    if (persen >= 15)
        kategori = "HIGH";

    text += `${index + 1}. ${item.country} - ${persen}% [${kategori}]\n`;

});

        // ================= FOOTER =================
        text += `\n${totalSms}`;
        text += `\nTerakhir diperbarui: ${jam} WIB`;

        // ================= SEND =================
        await bot.editMessageText(text, {
            chat_id: chatId,
            message_id: loading.message_id,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🔄 Refresh",
                            callback_data: "refresh_stats"
                        }
                    ]
                ]
            }
        });

    } catch (err) {

        console.log(err);

        bot.sendMessage(
            chatId,
            "❌ Gagal mengambil leaderboard."
        );
    }
});


 /*query) => {

    const data = query.data;

    // ================= ONLY CALLBACK =================
    if (
        data !== "stats_exclusive" &&
        data !== "stats_standard" &&
        data !== "stats_low"
    ) return;

    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {

        await bot.answerCallbackQuery(query.id, {
            text: "⏳ Mengambil leaderboard..."
        });

        // ================= API =================
        const response = await axios.get(
            "http://ws.websocket.web.id/api/cekivas?platform=whatsapp"
        );

        // ================= DATA =================
        const totalSms = response.data.total_found;
        let results = response.data.results || [];

        // ================= SORT TRAFFIC =================
        results.sort((a, b) => b.count - a.count);

        // ================= FILTER KATEGORI =================
        let kategori = "";
        let filtered = [];

        // 🔥 HIGH TRAFFIC
        if (data === "stats_exclusive") {

            kategori = "Eksklusif Meta Business";

            // negara dengan traffic tertinggi
            filtered = results.filter(x => x.count >= 20);

        }

        // 📊 MID TRAFFIC
        else if (data === "stats_standard") {

            kategori = "Standart Meta Business";

            // traffic sedang
            filtered = results.filter(
                x => x.count >= 5 && x.count < 20
            );

        }

        // 📉 LOW TRAFFIC
        else if (data === "stats_low") {

            kategori = "Low Meta Business";

            // traffic kecil
            filtered = results.filter(x => x.count < 5);

        }

        // ================= TOTAL KATEGORI =================
        const totalKategori = filtered.reduce(
            (sum, item) => sum + item.count,
            0
        );

        // ================= WAKTU WIB =================
        const now = new Date();

        const tanggal = now.toLocaleDateString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );

        const jam = now.toLocaleTimeString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        // ================= TEXT =================
        let text = `🏆 *LEADERBOARD NEGARA*\n`;
        text += `Kategori: ${kategori}\n`;
        text += `Tanggal: ${tanggal}\n\n`;

        // ================= TOP 10 =================
        filtered.slice(0, 10).forEach((item, index) => {

            // persen dari total kategori
            const persen = (
                (item.count / totalKategori) * 100
            ).toFixed(2);

            text += `${index + 1}. ${item.country} - ${persen}%\n`;

        });

        // ================= FOOTER =================
        text += `\n${totalKategori}`;
        text += `\nTerakhir diperbarui: ${jam} WIB`;

        // ================= EDIT MESSAGE =================
        await bot.editMessageText(text, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [

                    [
                        {
                            text: "🔥 Eksklusif",
                            callback_data: "stats_exclusive"
                        },
                        {
                            text: "📊 Standart",
                            callback_data: "stats_standard"
                        }
                    ],

                    [
                        {
                            text: "📉 Low",
                            callback_data: "stats_low"
                        }
                    ],

                    [
                        {
                            text: "🔄 Refresh",
                            callback_data: data
                        }
                    ]

                ]
            }
        });

    } catch (err) {

        console.log(err);

        bot.answerCallbackQuery(query.id, {
            text: "❌ Gagal mengambil leaderboard",
            show_alert: true
        });
    }
});           */
/*
bot.on("callback_query", async (query) => {

    const data = query.data;

    if (
        data !== "stats_exclusive" &&
        data !== "stats_standard" &&
        data !== "stats_low"
    ) return;

    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {

        await bot.answerCallbackQuery(query.id, {
            text: "⏳ Mengambil leaderboard..."
        });

        // ================= AMBIL CACHE/API =================
        const apiData = await getStatsData();

        let results = apiData.results || [];

        if (!results.length) {

            return bot.editMessageText(
                "❌ Tidak ada data traffic.",
                {
                    chat_id: chatId,
                    message_id: messageId
                }
            );
        }

        // ================= FILTER =================
        let filtered = [];
        let kategori = "";

        // 🔥 EKSKLUSIF
        if (data === "stats_exclusive") {

            filtered = results.filter(
                x => x.count >= 20
            );

            kategori = "Eksklusif Meta Business";
        }

        // 📊 STANDART
        else if (data === "stats_standard") {

            filtered = results.filter(
                x => x.count >= 5 && x.count < 20
            );

            kategori = "Standart Meta Business";
        }

        // 📉 LOW
        else if (data === "stats_low") {

            filtered = results.filter(
                x => x.count < 5
            );

            kategori = "Low Meta Business";
        }

        // ================= TOTAL =================
        const totalKategori = filtered.reduce(
            (sum, item) => sum + item.count,
            0
        );

        // ================= SORT =================
        filtered.sort((a, b) => b.count - a.count);

        // ================= WIB =================
        const now = new Date();

        const tanggal = now.toLocaleDateString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );

        const jam = now.toLocaleTimeString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        // ================= TEXT =================
        let text = `🏆 *LEADERBOARD NEGARA*\n`;
        text += `Kategori: ${kategori}\n`;
        text += `Tanggal: ${tanggal}\n\n`;

        // ================= TOP 10 =================
        filtered.slice(0, 10).forEach((item, index) => {

            const persen = (
                (item.count / totalKategori) * 100
            ).toFixed(2);

            text += `${index + 1}. ${item.country} - ${persen}%\n`;

        });

        // ================= FOOTER =================
        text += `\n${totalKategori}`;
        text += `\nTerakhir diperbarui: ${jam} WIB`;
        text += `\n\n♻️ Update setiap 1 menit`;

        // ================= SEND =================
        await bot.editMessageText(text, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🔥 Eksklusif",
                            callback_data: "stats_exclusive"
                        },
                        {
                            text: "📊 Standart",
                            callback_data: "stats_standard"
                        }
                    ],
                    [
                        {
                            text: "📉 Low",
                            callback_data: "stats_low"
                        }
                    ],
                    [
                        {
                            text: "🔄 Refresh",
                            callback_data: data
                        }
                    ]
                ]
            }
        });

    } catch (err) {

        console.log(err);

        bot.answerCallbackQuery(query.id, {
            text: "❌ Gagal mengambil leaderboard",
            show_alert: true
        });
    }
});
*/
        

/*
// ================= CALLBACK =================
bot.on("callback_query", async (query) => {

    const data = query.data;

    if (
        data !== "stats_exclusive" &&
        data !== "stats_standard" &&
        data !== "stats_low"
    ) return;

    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {

        await bot.answerCallbackQuery(query.id, {
            text: "⏳ Mengambil leaderboard..."
        });

        // ================= API =================
        const response = await axios.get(
            "http://ws.websocket.web.id/api/cekivas?platform=whatsapp"
        );

        let results = response.data.results || [];
        let totalSms = response.data.total_found || 0;

        // sort terbesar
        results.sort((a, b) => b.count - a.count);

        // ================= FILTER =================
        let filtered = [];
        let kategori = "";

        // HIGH TRAFFIC
        if (data === "stats_exclusive") {

            filtered = results.filter(x => x.count >= 20);
            kategori = "Eksklusif Meta Business";

        }

        // MEDIUM TRAFFIC
        else if (data === "stats_standard") {

            filtered = results.filter(
                x => x.count >= 5 && x.count < 20
            );

            kategori = "Standart Meta Business";

        }

        // LOW TRAFFIC
        else if (data === "stats_low") {

            filtered = results.filter(x => x.count < 5);
            kategori = "Low Meta Business";
        }

        // kosong
        if (filtered.length === 0) {

            return bot.editMessageText(
                "❌ Tidak ada data traffic.",
                {
                    chat_id: chatId,
                    message_id: messageId
                }
            );
        }

        // ================= DATE =================
        const now = new Date();

        const tanggal =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");

        const jam =
            String(now.getHours()).padStart(2, "0") + ":" +
            String(now.getMinutes()).padStart(2, "0");

        // ================= TEXT =================
        let text = `🏆 *LEADERBOARD NEGARA*\n`;
        text += `Kategori: ${kategori}\n`;
        text += `Tanggal: ${tanggal}\n\n`;

        filtered.slice(0, 10).forEach((item, index) => {

            // ================= PERSEN =================
            const persen = (
                (item.count / totalSms) * 100
            ).toFixed(2);

            text += `${index + 1}. ${item.country} - ${persen}%\n`;

        });

        text += `\n📨 TOTAL SMS: ${totalSms}`;
        text += `\n⏰ Terakhir diperbarui: ${jam} WIB`;

        // ================= EDIT =================
        await bot.editMessageText(text, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🔥 Eksklusif",
                            callback_data: "stats_exclusive"
                        },
                        {
                            text: "📊 Standart",
                            callback_data: "stats_standard"
                        }
                    ],
                    [
                        {
                            text: "📉 Low",
                            callback_data: "stats_low"
                        }
                    ],
                    [
                        {
                            text: "🔄 Refresh",
                            callback_data: data
                        }
                    ]
                ]
            }
        });

    } catch (err) {

        console.log(err);

        bot.answerCallbackQuery(query.id, {
            text: "❌ Gagal mengambil data",
            show_alert: true
        });
    }
});
*/
// ================= START =================
bot.onText(/\/start/, (msg) => {

    const chatId = msg.chat.id;

    if (msg.chat.type !== "group" && msg.chat.type !== "supergroup")
        return bot.sendMessage(chatId, "❌ Bot hanya bisa digunakan di grup!");

    const menu = startMenu(chatId);

    bot.sendPhoto(chatId, "./banner.png", {
        caption: menu.caption,
        ...menu.options
    });
});

// ================= TRAFFIC WHATSAPP =================
bot.onText(/\/cekivas/, async (msg) => {

    const chatId = msg.chat.id;

    try {

        // loading
        const loading = await bot.sendMessage(
            chatId,
            "⏳ Mengambil data..."
        );

        // fetch api
        const response = await axios.get(
            `http://ws.websocket.web.id/api/cekivas?platform=whatsapp`
        );

        // data
        const totalFound = response.data.total_found || 0;
        const results = response.data.results || [];

        // sort terbesar
        results.sort((a, b) => b.count - a.count);

        // hasil text
        let text = `┌─「 𖣂 CEK TRAFFIC IVASMS 」\n│\n`;

        text += `│ TOTAL SMS : ${totalFound} SMS\n│ PLATFORM : WHATSAPP OTP ⏆\n│──────────⬡\n`;

        results.slice(0, 40).forEach((item, index) => {

            text += `│ ${index + 1}. ${item.country} : ${item.count} SMS\n`;

        });

        text += `│──────────⬡\n`;
        text += `\n© BOT WS BY WAYSS`;

        // edit message
        const sent = await bot.editMessageText(text, {
    chat_id: chatId,
    message_id: loading.message_id
});

// auto delete 10 detik
setTimeout(async () => {

    try {

        await bot.deleteMessage(
            chatId,
            sent.message_id || loading.message_id
        );

    } catch (e) {
        console.log("Gagal hapus pesan");
    }

}, 10000);

    } catch (err) {

        console.log(err);

        bot.sendMessage(
            chatId,
            "❌ Gagal mengambil data"
        );
    }
});


            
// ================= CALLBACK =================
bot.on('callback_query', async (query) => {

    const chatId = query.message.chat.id;
    const data = query.data;

    // ===== ADD BOT =====
    if (data === "btn_addbot") {

        if (!allowedGroups.includes(chatId)) {
            allowedGroups.push(chatId);
            fs.writeFileSync('./groups.json', JSON.stringify(allowedGroups, null, 2));
        }

        const menu = startMenu(chatId);

        return bot.editMessageCaption(menu.caption, {
            chat_id: chatId,
            message_id: query.message.message_id,
            ...menu.options
        });
    }

    // ===== REMOVE BOT (ADMIN ONLY) =====
    if (data === "btn_removebot") {

        const admin = await isAdmin(chatId, query.from.id);

        if (!admin) {
            return bot.answerCallbackQuery(query.id, {
                text: "❌ Hanya ADMIN yang bisa remove bot!",
                show_alert: true
            });
        }

        allowedGroups = allowedGroups.filter(id => id !== chatId);
        fs.writeFileSync('./groups.json', JSON.stringify(allowedGroups, null, 2));

        const menu = startMenu(chatId);

        return bot.editMessageCaption(menu.caption, {
            chat_id: chatId,
            message_id: query.message.message_id,
            ...menu.options
        });
    }

    // ===== BACK TO START =====
    if (data === "back_start") {
        const menu = startMenu(chatId);

        return bot.editMessageCaption(menu.caption, {
            chat_id: chatId,
            message_id: query.message.message_id,
            ...menu.options
        });
    }

    // ===== MENU IVAS =====
    if (data === "menu_cektopivas") {

        if (!allowedGroups.includes(chatId)) {
            return bot.answerCallbackQuery(query.id, {
                text: "❌ Grup belum terdaftar!",
                show_alert: true
            });
        }

        return bot.editMessageCaption("🔥 *PILIH PLATFORM CEK IVAS* 🔥", {
            chat_id: chatId,
            message_id: query.message.message_id,
            ...platformMenu()
        });
    }

    // ===== BACK MENU =====
    if (data === "back_menu") {
        return bot.editMessageCaption("🔥 *PILIH PLATFORM CEK IVAS* 🔥", {
            chat_id: chatId,
            message_id: query.message.message_id,
            ...platformMenu()
        });
    }

    // ===== REFRESH =====
    if (data.startsWith("refresh_")) {
        const platform = data.replace("refresh_", "");
        return fetchData(platform, query);
    }

    // ===== PLATFORM =====
    const platform = platforms[data];
    if (platform) {
        return fetchData(platform, query);
    }

});

// ================= FETCH DATA =================
async function fetchData(platform, query) {

    const chatId = query.message.chat.id;

    try {

        await bot.answerCallbackQuery(query.id, { text: "⏳ Mengambil data..." });

        const response = await axios.get(
            `http://ws.websocket.web.id/api/cekivas?platform=${platform}`
        );

        const totalFound = response.data.total_found;
        const results = response.data.results;

        results.sort((a, b) => b.count - a.count);

        let text = `*TRAFFIC SMS ${platform.toUpperCase()} IVASMS ANALYSIS*\n`;
        text += `TOTAL SMS : ${totalFound} SMS\n\n`;

        results.slice(0, 40).forEach((item, index) => {
            text += `${index + 1}. *${item.country}* : ${item.count} SMS\n`;
        });

        text += `\n━━━━━━━━━━━━━━━━━━\n*BOT BY DEVIOR CODEXYS*`;

        await bot.editMessageCaption(text, {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🔄 Refresh", callback_data: `refresh_${platform}` },
                        { text: "🔙 Kembali", callback_data: "back_menu" }
                    ]
                ]
            }
        });

    } catch (err) {
        bot.answerCallbackQuery(query.id, {
            text: "❌ Gagal mengambil data",
            show_alert: true
        });
    }
}