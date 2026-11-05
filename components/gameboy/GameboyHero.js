import Image from "next/image";
import GameboyHeroClient from "./GameboyHeroClient";
import GameboySvg from "./GameboySvg";
import { GEOMETRY } from "./gameboyArt";
import { PARTNER_BOX } from "./partnerArt";
// Imported rather than referenced by its /public URL so Next serves it from a
// content-hashed /_next/static/media URL (cached immutably). A stable URL could
// pair a stale cached base.svg with new GEOMETRY after scripts/split-gameboy.mjs
// reruns. SVGs bypass the optimizer, so the file is served as-is.
import baseSvg from "../../public/gameboy/base.svg";

// Only what the client half reads, so the RSC payload stays small.
// `mon` is the union of every stage's sprite box, so the poke target fits Charizard too.
const { width, height, viewBox, screen, panelTop } = GEOMETRY;
const CLIENT_GEOMETRY = {
  width,
  height,
  viewBox,
  screen,
  mon: PARTNER_BOX,
  panelTop,
};

/**
 * Game Boy hero (server component). Renders the static art here, so it ships as
 * HTML instead of client JS, and hands it to GameboyHeroClient, which adds the
 * little behaviour there is (intro hold/skip, idle loops, poke, "press A" menu).
 */
export default function GameboyHero({ className = "" }) {
  return (
    <GameboyHeroClient
      className={className}
      geometry={CLIENT_GEOMETRY}
      art={
        <>
          <Image
            src={baseSvg}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            preload
            fetchPriority="high"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none"
          />
          <GameboySvg />
        </>
      }
    />
  );
}
