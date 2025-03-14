'use client';

import { useEffect, useState } from 'react';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
    }>;
  }
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      console.log('beforeinstallprompt спрацював');
      setDeferredPrompt(e);
      setIsPromptVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('Промпт не доступний');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Вибір користувача:', outcome);
      setIsPromptVisible(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Помилка при виклику промпту:', error);
    }
  };

  return (
    <>
      {isPromptVisible && (
        <div className="install-prompt">
          <p>Встановіть наш додаток для кращого досвіду!</p>
          <button onClick={handleInstallClick}>Встановити</button>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;