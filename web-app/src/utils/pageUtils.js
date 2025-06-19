import { SETTINGS } from '../constants/appSettings';

export const getTotalPagesCount = (totalItemCount) => {
  return Math.max(1, Math.ceil(totalItemCount / SETTINGS.ITEMS_PER_PAGE));
};

