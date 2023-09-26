
import "./globals.css";
import styles from "../custom-font.css";
import Footer from "../../components/Footer";
import { ButtonProvider } from "../../components/LightButtonContext";
import { useButton } from "../../components/LightButtonContext";
export const metadata = {
  title: "Alfonso Lima",
  description: "Developer Portfolio of Alfonso Lima",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="bg-primary font-custom">
        <ButtonProvider>{children}</ButtonProvider>
        <Footer />
      </body>

      {/* <Footer /> */}
    </html>
  );
}
