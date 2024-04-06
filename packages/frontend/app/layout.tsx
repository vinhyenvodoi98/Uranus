import Header from "./components/Header";
import Providers from "./components/Provider";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "react-toastify/ReactToastify.min.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="nord">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <ToastContainer position="bottom-right" newestOnTop />
      </body>
    </html>
  );
}
