"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { statusTextPath, statusTextWidth } from "./statusFont";

/**
 * The live "NAME♂ Lv##" in the battle status box. The box's baked text says
 * "CHARMANDER♂ Lv5"; once the partner differs (a nickname, a level, an
 * evolution: html[data-partner-custom], see src/app/lib/partner.js) that text
 * is hidden by CSS and this draws the current one in the same font
 * (./statusFont.js, the baked glyphs pre-scaled) at the same spot, with the
 * same drop shadow. Portaled into the server-rendered art's
 * <g data-gb="status-custom"> so it slides and bobs with the box.
 */

// Where the baked text sits (viewBox units): name from x=533 on the baseline
// y=104.5; the ♂ 2.7 units after the name; "Lv" right-aligned to x=723.3.
const NAME_X = 533.04;
const BASELINE = 104.49;
const GENDER_GAP = 2.7;
const GENDER_W = 12.2;
const LEVEL_RIGHT = 723.27;
const SHADOW = "#D2C9A1"; // the baked drop shadow's colour (rgb .82 .79 .63)
const SHADOW_DX = 3.52;

// The baked ♂, as drawn in gameboyArt.js, relative to its own left edge (x=654.8).
function GenderMark({ x }) {
  const t = `translate(${(x - 654.8).toFixed(2)} 0)`;
  return (
    <g transform={t} fill="#48ABD7">
      <rect x="662.02" y="88.3003" width="2.48999" height="2.48999" />
      <rect x="657.289" y="88.3003" width="2.48999" height="2.48999" />
      <rect x="664.511" y="90.7902" width="2.48999" height="2.48999" />
      <rect x="654.799" y="90.7902" width="2.48999" height="2.48999" />
      <rect x="657.538" y="103.24" width="4.48198" height="2.48999" />
      <rect x="657.538" y="94.7743" width="4.48198" height="2.48999" />
      <rect x="655.048" y="97.2642" width="2.48999" height="5.97597" />
      <rect x="662.021" y="97.2642" width="2.48999" height="5.97597" />
      <rect x="659.779" y="86.0593" width="2.24099" height="8.71496" />
    </g>
  );
}

function Shadowed({ d }) {
  return (
    <>
      <path
        d={d}
        fill={SHADOW}
        transform={`translate(${SHADOW_DX} ${SHADOW_DX})`}
      />
      <path d={d} fill="#000" />
    </>
  );
}

export default function StatusName({ figureRef, name, level, show }) {
  const [slot, setSlot] = useState(null);
  useEffect(() => {
    setSlot(
      figureRef.current?.querySelector('[data-gb="status-custom"]') ?? null,
    );
  }, [figureRef]);
  if (!slot || !show) return null;
  const nameD = statusTextPath(name, NAME_X, BASELINE);
  const genderX = NAME_X + statusTextWidth(name) + GENDER_GAP;
  const levelText = `Lv${level}`;
  const levelD = statusTextPath(
    levelText,
    LEVEL_RIGHT - statusTextWidth(levelText),
    BASELINE,
  );
  return createPortal(
    <g aria-hidden="true">
      <Shadowed d={nameD} />
      <g transform={`translate(${SHADOW_DX} ${SHADOW_DX})`} opacity="0.35">
        <GenderMark x={genderX} />
      </g>
      <GenderMark
        x={Math.min(
          genderX,
          LEVEL_RIGHT - statusTextWidth(levelText) - GENDER_W - 6,
        )}
      />
      <Shadowed d={levelD} />
    </g>,
    slot,
  );
}
