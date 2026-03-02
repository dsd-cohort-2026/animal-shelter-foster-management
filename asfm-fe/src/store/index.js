import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { userAnimalsSlice } from './slices/userAnimalsSlice';
import { createAuthSlice } from './slices/createAuthSlice';
import { devtools } from 'zustand/middleware';

export const useBoundStore = create(devtools(
  immer((...a) => ({
    ...userAnimalsSlice(...a),
    ...createAuthSlice(...a),
  })),
));
