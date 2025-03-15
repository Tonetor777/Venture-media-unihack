
declare global {
    interface TelegramWebAppThemeParams {
      bgColor: string;
      textColor: string;
    }
  
    interface TelegramWebApp {
      init(): void;
      expand(): void;
      themeParams: TelegramWebAppThemeParams | null;
      initDataUnsafe: object;
      onEvent(event: string, callback: Function): void;
      headerColor: string;
    }
  
    interface Window {
      Telegram: {
        WebApp: TelegramWebApp;
      };
    }
  }
  
  export {};
  