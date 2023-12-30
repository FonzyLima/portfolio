"use client"

import { createContext, useState ,useContext} from "react"

const DarkContext = createContext();

export const DarkContextProvider = ({children}) => {
    const [isDark, setisDark] = useState(false);
    
    return(
        <DarkContext.Provider value={[isDark,setisDark]}>
            <div className={`${isDark ? "dark": ""}`}>
            {children}
            </div>
            

            
        </DarkContext.Provider>
    )
}

export default DarkContext;