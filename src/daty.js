// Daty w interfejsie: termin zadania w polskim zapisie, np. 16.10.2026.

import dayjs from 'dayjs';

export function formatujTermin(dueDate) {
  return dayjs(dueDate).format('DD.MM.YYYY');
}
