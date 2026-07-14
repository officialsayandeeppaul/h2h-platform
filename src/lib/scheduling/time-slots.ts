/** 30-minute slots from 8:00 AM through 8:00 PM (12-hour labels). */
export function buildAmPmTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour24 = 8; hour24 <= 20; hour24++) {
    for (const minute of [0, 30]) {
      if (hour24 === 20 && minute === 30) break;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      slots.push(
        `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
      );
    }
  }
  return slots;
}

export const AM_PM_TIME_SLOTS = buildAmPmTimeSlots();

/** Homepage marketing preview slots (subset). */
export const HOMEPAGE_PREVIEW_SLOTS = ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'];
