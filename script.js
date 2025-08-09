document.addEventListener('DOMContentLoaded', () => {
    // Navigatsiya tugmalari
    const ballarBtn = document.getElementById('ballar-btn');
    const tahlilBtn = document.getElementById('tahlil-btn');
    const forumBtn = document.getElementById('forum-btn');

    // Bo'limlar
    const kirishBallariSection = document.getElementById('kirish-ballari');
    const ballTahlilSection = document.getElementById('ball-tahlil');
    const anonimForumSection = document.getElementById('anonim-forum');

    // Kirish ballari elementlari
    const yilSelect = document.getElementById('yil-select');
    const hududSelect = document.getElementById('hudud-select');
    const yonalishSelect = document.getElementById('yonalish-select');
    const ballarNatija = document.getElementById('ballar-natija');

    // Tahlil elementlari
    const ballInput = document.getElementById('ball-input');
    const tahlilQilishBtn = document.getElementById('tahlil-qilish-btn');
    const tahlilNatija = document.getElementById('tahlil-natija');


    // Navigatsiya logikasi
    ballarBtn.addEventListener('click', () => {
        kirishBallariSection.classList.remove('hidden');
        ballTahlilSection.classList.add('hidden');
        anonimForumSection.classList.add('hidden');
        setActiveButton(ballarBtn);
    });

    tahlilBtn.addEventListener('click', () => {
        kirishBallariSection.classList.add('hidden');
        ballTahlilSection.classList.remove('hidden');
        anonimForumSection.classList.add('hidden');
        setActiveButton(tahlilBtn);
    });

    forumBtn.addEventListener('click', () => {
        kirishBallariSection.classList.add('hidden');
        ballTahlilSection.classList.add('hidden');
        anonimForumSection.classList.remove('hidden');
        setActiveButton(forumBtn);
    });

    function setActiveButton(button) {
        [ballarBtn, tahlilBtn, forumBtn].forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }


    // Kirish ballari logikasi
    yilSelect.addEventListener('change', () => {
        const yil = yilSelect.value;
        hududSelect.innerHTML = '<option value="">Hududni tanlang</option>';
        yonalishSelect.innerHTML = '<option value="">Yo\'nalishni tanlang</option>';
        ballarNatija.innerHTML = '';
        hududSelect.disabled = true;
        yonalishSelect.disabled = true;

        if (yil && kirishBallari[yil]) {
            const hududlar = Object.keys(kirishBallari[yil]);
            hududlar.forEach(hudud => {
                const option = document.createElement('option');
                option.value = hudud;
                option.textContent = hudud;
                hududSelect.appendChild(option);
            });
            hududSelect.disabled = false;
        }
    });

    hududSelect.addEventListener('change', () => {
        const yil = yilSelect.value;
        const hudud = hududSelect.value;
        yonalishSelect.innerHTML = '<option value="">Yo\'nalishni tanlang</option>';
        ballarNatija.innerHTML = '';
        yonalishSelect.disabled = true;

        if (yil && hudud && kirishBallari[yil][hudud]) {
            const yonalishlar = Object.keys(kirishBallari[yil][hudud]);
            yonalishlar.forEach(yonalish => {
                const option = document.createElement('option');
                option.value = yonalish;
                option.textContent = yonalish;
                yonalishSelect.appendChild(option);
            });
            yonalishSelect.disabled = false;
        }
    });

    yonalishSelect.addEventListener('change', () => {
        const yil = yilSelect.value;
        const hudud = hududSelect.value;
        const yonalish = yonalishSelect.value;
        ballarNatija.innerHTML = '';

        if (yil && hudud && yonalish) {
            const ballar = kirishBallari[yil][hudud][yonalish];
            ballarNatija.innerHTML = `
                <h3>${yonalish} (${hudud}, ${yil})</h3>
                <p><strong>Grant:</strong> ${ballar.grant} ball</p>
                <p><strong>Kontrakt:</strong> ${ballar.kontrakt} ball</p>
            `;
        }
    });


    // "Ballim orqali" tahlil logikasi
    tahlilQilishBtn.addEventListener('click', () => {
        const kiritilganBall = parseFloat(ballInput.value);
        tahlilNatija.innerHTML = '';

        if (isNaN(kiritilganBall)) {
            tahlilNatija.innerHTML = '<p style="color: red;">Iltimos, balingizni to\'g\'ri kiriting.</p>';
            return;
        }

        let topilganYonalishlar = [];

        for (const yil in kirishBallari) {
            for (const hudud in kirishBallari[yil]) {
                for (const yonalish in kirishBallari[yil][hudud]) {
                    const ballar = kirishBallari[yil][hudud][yonalish];
                    if (kiritilganBall >= ballar.kontrakt) {
                        topilganYonalishlar.push({
                            yil, hudud, yonalish, ballar
                        });
                    }
                }
            }
        }

        if (topilganYonalishlar.length > 0) {
            let natijaHtml = `<h4>Siz ${kiritilganBall} ball bilan quyidagi sohalarga kontrakt asosida o'qishga kira olasiz:</h4><ul>`;
            topilganYonalishlar.forEach(item => {
                natijaHtml += `<li><strong>${item.yonalish}</strong> (${item.hudud}, ${item.yil}) - Kontrakt bali: ${item.ballar.kontrakt}</li>`;
            });
            natijaHtml += '</ul>';
            tahlilNatija.innerHTML = natijaHtml;
        } else {
            tahlilNatija.innerHTML = '<p>Afsuski, kiritilgan balingiz bilan mos keladigan yo\'nalish topilmadi.</p>';
        }
    });

    // Forum logikasi (soddalashtirilgan, backend talab qiladi)
    const sendMessageBtn = document.getElementById('send-message-btn');
    const messageInput = document.getElementById('forum-message-input');
    const messagesContainer = document.getElementById('forum-messages');

    sendMessageBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `Anonim: ${messageText}`;
            messagesContainer.appendChild(messageElement);
            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            // Bu yerda xabarni backendga yuborish kodi bo'lishi kerak
        }
    });
});
