import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { userAnimalsSlice } from './slices/userAnimalsSlice';

export const useBoundStore = create(
  immer((...a) => ({
    ...userAnimalsSlice(...a),
  })),
);
