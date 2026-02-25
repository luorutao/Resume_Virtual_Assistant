"use client";

import { useEffect } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

let appInsights: ApplicationInsights | null = null;

export default function Analytics() {
  useEffect(() => {
    const connectionString =
      process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;

    if (!connectionString || appInsights) return;

    appInsights = new ApplicationInsights({
      config: {
        connectionString,
        // Automatically track page views, load times, and JS errors
        enableAutoRouteTracking: true,
        autoTrackPageVisitTime: true,
        enableAjaxPerfTracking: true,
        // Do not sample — record every visit
        samplingPercentage: 100,
        // Include the full URL path in page view telemetry
        enableDebug: false,
      },
    });

    appInsights.loadAppInsights();

    // Track the initial page view with device-type hint
    appInsights.trackPageView({
      name: document.title,
      uri: window.location.href,
      properties: {
        deviceCategory: /Mobi|Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        )
          ? "Mobile"
          : "Desktop",
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      },
    });
  }, []);

  return null;
}
