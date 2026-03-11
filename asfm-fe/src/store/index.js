import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { userAnimalsSlice } from './slices/userAnimalsSlice';
import { createAuthSlice } from './slices/createAuthSlice';
import { devtools } from 'zustand/middleware';
import { animalsSlice } from './slices/animalsSlice';
import { medicalLogsSlice } from './slices/medicalLogsSlice';
import { transactionsSlice } from './slices/transactionsSlice';

export const useBoundStore = create(
  devtools(
    immer((...a) => ({
      ...userAnimalsSlice(...a),
      ...createAuthSlice(...a),
      ...animalsSlice(...a),
      ...medicalLogsSlice(...a),
      ...transactionsSlice(...a),
    })),
  ),
);
