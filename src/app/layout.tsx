import type { Metadata } from "next";
import { FeedbackToast } from "@/components/feedback-toast";
import { GlobalCaptureBar } from "@/components/global-capture-bar";
import { MobileSwipeNav } from "@/components/mobile-swipe-nav";
import { JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { ThemeSync } from "@/components/theme-sync";
import { FeedbackProvider } from "@/hooks/use-feedback";
import { UserSettingsProvider } from "@/hooks/use-user-settings";
import { WordLibraryProvider } from "@/hooks/use-word-library";
import "./globals.css";

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的单词本",
  description: "一个用于快速录入、卡片学习和数据追踪的个人专业词汇库。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSansSc.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <UserSettingsProvider>
          <WordLibraryProvider>
            <FeedbackProvider>
              <ThemeSync />
              <div className="app-shell">
                <MobileSwipeNav />
                <SiteNav />
                <GlobalCaptureBar />
                <FeedbackToast />
                <main>{children}</main>
              </div>
            </FeedbackProvider>
          </WordLibraryProvider>
        </UserSettingsProvider>
      </body>
    </html>
  );
}
