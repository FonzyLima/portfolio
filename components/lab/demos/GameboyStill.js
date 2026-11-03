import Image from "next/image";

// Static still of the homepage Game Boy. The live hero (components/gameboy)
// is heavy and plays its intro on view, so it isn't mounted a second time.
// Uses the small raster, not /gameboy.svg (~160 KB gzipped), per DESIGN_SYSTEM.md.
export default function GameboyStill() {
  return (
    <Image
      src="/gameboy-fallback.png"
      alt="Still of the homepage Game Boy Advance SP showing the finished battle screen"
      width={960}
      height={511}
      // 85% of the stage (card width minus the stage's 24px padding).
      sizes="(min-width: 1120px) 395px, (min-width: 768px) calc(42.5vw - 71px), calc(85vw - 82px)"
      // First card, above the fold: it's the page's LCP image.
      loading="eager"
      draggable={false}
      className="gameboy-lift h-auto w-[85%] select-none"
    />
  );
}
