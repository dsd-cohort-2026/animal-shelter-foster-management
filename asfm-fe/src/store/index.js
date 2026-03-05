import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { userAnimalsSlice } from './slices/userAnimalsSlice';
import { animalsSlice } from './slices/animalsSlice';
import { medicalLogsSlice } from './slices/medicalLogsSlice';

export const useBoundStore = create(
  immer((...a) => ({
    ...userAnimalsSlice(...a),
    ...animalsSlice(...a),
    ...medicalLogsSlice(...a),
  })),
);
