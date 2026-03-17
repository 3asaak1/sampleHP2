// ==============================
// 桜吹雪エフェクト
// ==============================
const sakuraContainer = document.querySelector(".sakura-container");

function createSakuraPetal() {
    if (!sakuraContainer) return;

    const petal = document.createElement("span");
    petal.classList.add("sakura");

    // サイズバリエーション
    const randomType = Math.random();
    if (randomType < 0.3) {
        petal.classList.add("sakura--small");
    } else if (randomType > 0.8) {
        petal.classList.add("sakura--large");
    }

    // 右上から少しランダムな位置で出す
    const startRight = Math.random() * 180;
    const startTop = Math.random() * 120;

    petal.style.right = `${startRight}px`;
    petal.style.top = `${-40 + startTop}px`;

    // アニメーション時間をランダム化
    const duration = 6 + Math.random() * 5;
    petal.style.animationDuration = `${duration}s`;

    // 少しずつタイミングをずらす
    const delay = Math.random() * 2;
    petal.style.animationDelay = `${delay}s`;

    // 回転の初期角度もランダム化
    const rotate = Math.random() * 80 - 40;
    petal.style.transform = `rotate(${rotate}deg)`;

    sakuraContainer.appendChild(petal);

    // アニメーション終了後に削除
    setTimeout(() => {
        petal.remove();
    }, (duration + delay) * 1000);
}

// 一定間隔で花びらを追加
setInterval(() => {
    createSakuraPetal();
}, 400);

// 最初に少しだけ出しておく
for (let i = 0; i < 8; i++) {
    setTimeout(createSakuraPetal, i * 300);
}


// ==============================
// 予約フォーム：カレンダー / スライダー連動
// ==============================
const calendarGrid = document.querySelector("#calendarGrid");
const calendarTitle = document.querySelector("#calendarTitle");
const prevMonthBtn = document.querySelector("#prevMonth");
const nextMonthBtn = document.querySelector("#nextMonth");

const monthRange = document.querySelector("#monthRange");
const dayRange = document.querySelector("#dayRange");
const timeRange = document.querySelector("#timeRange");

const monthRangeValue = document.querySelector("#monthRangeValue");
const dayRangeValue = document.querySelector("#dayRangeValue");
const timeRangeValue = document.querySelector("#timeRangeValue");

const summaryMonth = document.querySelector("#summaryMonth");
const summaryDay = document.querySelector("#summaryDay");
const summaryTime = document.querySelector("#summaryTime");
const summaryWorkshop = document.querySelector("#summaryWorkshop");
const summaryPeople = document.querySelector("#summaryPeople");

const workshopSelect = document.querySelector("#workshop");
const peopleSelect = document.querySelector("#people");

if (
    calendarGrid &&
    calendarTitle &&
    prevMonthBtn &&
    nextMonthBtn &&
    monthRange &&
    dayRange &&
    timeRange
) {
    const monthNames = [
        "1月", "2月", "3月", "4月", "5月", "6月",
        "7月", "8月", "9月", "10月", "11月", "12月"
    ];

    const timeOptions = [
        "10時〜12時",
        "14時〜16時",
        "18時〜19時"
    ];

    const baseYear = 2026;
    let currentMonth = Number(monthRange.value);
    let selectedDay = Number(dayRange.value);

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function updateDayRangeMax() {
        const daysInMonth = getDaysInMonth(baseYear, currentMonth);
        dayRange.max = String(daysInMonth);

        if (selectedDay > daysInMonth) {
            selectedDay = daysInMonth;
            dayRange.value = String(daysInMonth);
        }
    }

    function updateTexts() {
        monthRangeValue.textContent = monthNames[currentMonth];
        dayRangeValue.textContent = `${selectedDay}日`;
        timeRangeValue.textContent = timeOptions[Number(timeRange.value)];

        summaryMonth.textContent = monthNames[currentMonth];
        summaryDay.textContent = `${selectedDay}日`;
        summaryTime.textContent = timeOptions[Number(timeRange.value)];

        if (workshopSelect) {
            summaryWorkshop.textContent = workshopSelect.value;
        }

        if (peopleSelect) {
            summaryPeople.textContent = peopleSelect.value;
        }
    }

    function renderCalendar() {
        const firstDay = new Date(baseYear, currentMonth, 1).getDay();
        const daysInMonth = getDaysInMonth(baseYear, currentMonth);

        calendarTitle.textContent = `${baseYear}年${currentMonth + 1}月`;
        calendarGrid.innerHTML = "";

        for (let i = 0; i < firstDay; i += 1) {
            const emptyCell = document.createElement("button");
            emptyCell.type = "button";
            emptyCell.className = "calendar-day is-muted";
            emptyCell.disabled = true;
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "calendar-day";
            dayButton.textContent = String(day);

            if (day === selectedDay) {
                dayButton.classList.add("is-selected");
            }

            dayButton.addEventListener("click", () => {
                selectedDay = day;
                dayRange.value = String(day);
                renderCalendar();
                updateTexts();
            });

            calendarGrid.appendChild(dayButton);
        }
    }

    prevMonthBtn.addEventListener("click", () => {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        monthRange.value = String(currentMonth);
        updateDayRangeMax();
        renderCalendar();
        updateTexts();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        monthRange.value = String(currentMonth);
        updateDayRangeMax();
        renderCalendar();
        updateTexts();
    });

    monthRange.addEventListener("input", () => {
        currentMonth = Number(monthRange.value);
        updateDayRangeMax();
        renderCalendar();
        updateTexts();
    });

    dayRange.addEventListener("input", () => {
        selectedDay = Number(dayRange.value);
        renderCalendar();
        updateTexts();
    });

    timeRange.addEventListener("input", () => {
        updateTexts();
    });

    if (workshopSelect) {
        workshopSelect.addEventListener("change", updateTexts);
    }

    if (peopleSelect) {
        peopleSelect.addEventListener("change", updateTexts);
    }

    updateDayRangeMax();
    renderCalendar();
    updateTexts();
}