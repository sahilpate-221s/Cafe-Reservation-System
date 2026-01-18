import React from "react";

const ServerWarmingToast = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-72 rounded-lg glass-panel p-4 animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="text-[color:var(--color-primary)] text-xl">☕</div>
        <div className="text-sm text-[color:var(--color-text-light)] dark:text-[color:var(--color-text-dark)]">
          <p className="font-semibold mb-1">Server starting</p>
          <p className="text-stone-600 dark:text-stone-400">
            This app runs on a free server.
            First request may take up to 1 minute.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerWarmingToast;
