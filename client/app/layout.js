import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SharePad",
  description: "Real-time collaborative workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster
            position="bottom-center"
            closeButton
            theme="system"
            toastOptions={{
              classNames: {
                toast:
                  "group toast relative flex items-center w-full group-[.toaster]:bg-zinc-900 group-[.toaster]:text-white group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-xl group-[.toaster]:rounded-full group-[.toaster]:px-6 group-[.toaster]:py-3 group-[.toaster]:font-medium group-[.toaster]:pr-12 dark:group-[.toaster]:bg-white dark:group-[.toaster]:text-zinc-900",

                description: "group-[.toast]:text-zinc-400",
                actionButton:
                  "group-[.toast]:bg-zinc-700 group-[.toast]:text-white",

                closeButton:
                  "absolute right-3 top-1/2 -translate-y-1/2 group-[.toast]:bg-transparent group-[.toast]:text-zinc-500 hover:group-[.toast]:text-zinc-300 dark:group-[.toast]:text-zinc-400 dark:hover:group-[.toast]:text-zinc-600 group-[.toast]:border-none shadow-none !static md:!absolute",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
