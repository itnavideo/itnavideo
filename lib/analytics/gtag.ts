// Google Analytics 4 (GA4) Event Tracking Helper

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackVideoTypeSelect = (mode: string) => {
  event({ action: "select_video_type", category: "editor", label: mode });
};

export const trackFileUpload = (type: string, size?: number) => {
  event({ action: "file_upload", category: "editor", label: type, value: size });
};

export const trackRenderInitiate = (mode: string) => {
  event({ action: "render_initiate", category: "render", label: mode });
};

export const trackRenderSuccess = (mode: string, duration?: number) => {
  event({ action: "render_success", category: "render", label: mode, value: duration });
};

export const trackRenderFailed = (mode: string, error?: string) => {
  event({ action: "render_failed", category: "render", label: `${mode}: ${error}` });
};

export const trackVideoDownload = (mode: string) => {
  event({ action: "video_download", category: "render", label: mode });
};
