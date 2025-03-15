// 'use client'; // Add this line to mark this component as client-side
'use client';

import { useEffect } from "react";

export default function ClientComponent() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      // Initialize the WebApp
      window.Telegram.WebApp.init();
      window.Telegram.WebApp.expand();
      console.log("User data:", window.Telegram.WebApp.initDataUnsafe);
      if (window.Telegram.WebApp.themeParams) {
        document.body.style.backgroundColor = window.Telegram.WebApp.themeParams.bgColor;
      }
    }
  }, []);

  return null;
}
