import { Lunar } from 'lunar-javascript';

export const BEIJING_TIMEZONE = 'Asia/Shanghai';

/**
 * Gets the current solar term (Jieqi)
 */
export const getSolarTerm = () => {
    const lunar = Lunar.fromDate(new Date());
    const jieqi = lunar.getJieQi();
    if (jieqi) return jieqi;

    const prevJieQi = lunar.getPrevJieQi();
    return prevJieQi ? prevJieQi.getName() : '';
};

/**
 * Gets the current date info in Beijing time
 */
export const getBeijingDate = () => {
    const formatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: BEIJING_TIMEZONE,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    const parts = formatter.formatToParts(new Date());

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find(p => p.type === type)?.value || '';

    const day = parseInt(getPart('day'), 10);
    const month = parseInt(getPart('month'), 10);
    const year = parseInt(getPart('year'), 10);
    const weekday = getPart('weekday');

    return { year, month, day, weekday };
};

/**
 * Gets the 7 days of the current week (Mon-Sun) in Beijing time
 */
export const getCurrentWeekDays = (language: 'zh' | 'en' = 'zh') => {
    const now = new Date();

    // Convert current time to Beijing time timestamp
    // We need to find the "current time" in Beijing to determine "today"
    const beijingNowStr = new Date().toLocaleString('en-US', { timeZone: BEIJING_TIMEZONE });
    const beijingNow = new Date(beijingNowStr);

    const currentDay = beijingNow.getDay(); // 0 is Sunday, 1 is Monday...

    // Calculate Monday date of the current week
    // If today is Sunday (0), we need to go back 6 days. If Monday (1), go back 0 days.
    // JavaScript getDay(): Sun=0, Mon=1, ..., Sat=6
    // We want Mon=0, ..., Sun=6 for calculation
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const mondayDate = new Date(beijingNow);
    mondayDate.setDate(beijingNow.getDate() - diffToMonday);
    mondayDate.setHours(0, 0, 0, 0);

    const weekDays = [];
    const weekDayNamesZh = ['一', '二', '三', '四', '五', '六', '日'];
    const weekDayNamesEn = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    for (let i = 0; i < 7; i++) {
        const d = new Date(mondayDate);
        d.setDate(mondayDate.getDate() + i);

        weekDays.push({
            day: language === 'zh' ? weekDayNamesZh[i] : weekDayNamesEn[i],
            date: d.getDate(), // Returns day of month (1-31)
            fullDate: d,
            isToday: d.getDate() === beijingNow.getDate() && d.getMonth() === beijingNow.getMonth(),
            // Planting days: Tue (index 1), Thu (index 3), Sat (index 5)
            isPlantingDay: i === 1 || i === 3 || i === 5
        });
    }

    return weekDays;
};
