import { useEffect } from "react";

export const useDisableScroll = (isDisabled: boolean) => {
  useEffect(() => {
    if (isDisabled) {
      const preventScroll = (event: Event) => event.preventDefault();
      const preventKeyboardScroll = (event: KeyboardEvent) => {
        const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
        if (keys.includes(event.key)) {
          event.preventDefault();
        }
      };
      
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("keydown", preventKeyboardScroll);

      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
        window.removeEventListener("keydown", preventKeyboardScroll);
      };
    }
  }, [isDisabled]);
};
