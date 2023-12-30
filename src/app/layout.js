
import "./globals.css";
import styles from "../custom-font.css";
import Footer from "../../components/Footer";
import { DarkContextProvider } from "./context/darkContext";
export const metadata = {
  title: "Alfonso Lima",
  description: "Developer Portfolio of Alfonso Lima",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" >

      <body className=" font-custom">
      <DarkContextProvider>
        <div className="h-inherit w-inherit bg-[#EBEBEB] dark:bg-primary">
        {children}
        <Footer />
        </div>
        </DarkContextProvider>
        
      </body>
      

    </html>
  );
}
