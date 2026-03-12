import { create } from 'zustand';

interface AnimationState {
  dishCardAnimating: boolean;
  pageTransitioning: boolean;
  setDishCardAnimating: (animating: boolean) => void;
  setPageTransitioning: (transitioning: boolean) => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  dishCardAnimating: false,
  pageTransitioning: false,

  setDishCardAnimating: (animating) => set({ dishCardAnimating: animating }),
  setPageTransitioning: (transitioning) => set({ pageTransitioning: transitioning }),
}));
