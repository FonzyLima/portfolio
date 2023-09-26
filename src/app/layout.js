import "./globals.css";
import styles from "../custom-font.css";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Alfonso Lima",
  description: "Developer Portfolio of Alfonso Lima",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-primary font-custom">{children}</body>
      <Footer/>
    </html>
  );
}
