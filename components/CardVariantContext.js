"use client";

import { createContext } from "react";

// Card variant props ({ layout, hover, click }) for the /portfolio grid.
// Empty everywhere except /lab/cards, which wraps the real portfolio page in a
// provider, so production cards get Project's defaults.
const CardVariantContext = createContext({});

export default CardVariantContext;
