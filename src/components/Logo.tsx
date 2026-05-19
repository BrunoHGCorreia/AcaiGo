"use client";

export function Logo() {
  return (
    <div className="flex items-center justify-center w-full py-1 select-none overflow-visible">
      <div
        className="relative w-full flex justify-center items-center"
        style={{
          transition: "transform 0.25s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        }}
      >
        {/* Using standard img tag to bypass Next.js sizing/caching constraints.
            Scale allows it to grow larger without being restricted by the container padding. */}
        <img
          src={`/images/logo.png?v=3`}
          alt="AçaíGO"
          className="w-full h-auto object-contain max-w-[200px] scale-[1.5] origin-center"
          style={{
            display: "block",
            filter: "drop-shadow(0 2px 10px rgba(124,58,237,0.4))",
          }}
        />
      </div>
    </div>
  );
}
