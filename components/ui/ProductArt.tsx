import type { ArtKey } from "@/lib/data";

// Figma "Product Art" 컴포넌트와 동일한 라인 일러스트 (실제 상품 사진 대체용)
const art: Record<ArtKey, React.ReactNode> = {
  bag: (
    <>
      <path d="M110 170h180l18 160H92z" fill="#E4E1DC" />
      <path d="M150 170v-30a50 50 0 0 1 100 0v30" />
      <path d="M92 250h216" opacity=".45" />
      <rect x="180" y="198" width="40" height="22" rx="11" />
      <path d="M110 170l40 40M290 170l-40 40" opacity=".45" />
    </>
  ),
  loafer: (
    <>
      <path d="M70 280c40-5 70-30 95-70 10 0 25 10 35 25 30 40 90 45 130 50 10 2 15 10 15 20v10H70z" fill="#DCD8D2" />
      <path d="M70 315h275" opacity=".5" />
      <path d="M175 238c8-8 22-8 30 0" />
      <circle cx="172" cy="240" r="5" />
      <circle cx="208" cy="240" r="5" />
    </>
  ),
  wallet: (
    <>
      <rect x="100" y="140" width="200" height="130" rx="6" fill="#E2DED8" />
      <path d="M100 190h200" opacity=".5" />
      <path d="M240 190v45h60" />
      <circle cx="268" cy="212" r="7" />
    </>
  ),
  jewelry: (
    <>
      <circle cx="200" cy="225" r="80" />
      <circle cx="200" cy="225" r="66" opacity=".4" />
      <circle cx="200" cy="145" r="16" fill="#E3D7BE" />
      <path d="M184 145h32" opacity=".5" />
    </>
  ),
  scarf: (
    <>
      <path d="M110 110h180v180H110z" fill="#E6E2DB" />
      <path d="M130 130h140v140H130z" opacity=".45" />
      <circle cx="200" cy="200" r="35" opacity=".55" />
      <path d="M110 290l-15 25M130 290l-10 25M270 290l10 25M290 290l15 25" opacity=".55" />
    </>
  ),
  sunglasses: (
    <>
      <path d="M90 190h220" />
      <path d="M100 190c0 40 15 60 45 60s45-20 45-60z" fill="#D9D5CF" />
      <path d="M210 190c0 40 15 60 45 60s45-20 45-60z" fill="#D9D5CF" />
      <path d="M190 200c5-6 15-6 20 0" />
    </>
  ),
  belt: (
    <>
      <path d="M60 200h280" strokeWidth="22" stroke="#D6D2CC" />
      <rect x="170" y="180" width="60" height="40" rx="6" fill="#E3D7BE" />
      <circle cx="290" cy="200" r="3" />
      <circle cx="310" cy="200" r="3" />
    </>
  ),
};

export function ProductArt({ name, className = "", style }: { name: ArtKey; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {art[name]}
    </svg>
  );
}

/** 회색 배경 위에 일러스트를 얹은 상품 이미지 박스. 비율은 className(aspect-*)으로 지정 */
export function ArtBox({ name, className = "", scale = 0.8, tone = "subtle" }: { name: ArtKey; className?: string; scale?: number; tone?: "subtle" | "canvas" }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${tone === "subtle" ? "bg-subtle" : "bg-canvas"} ${className}`}>
      <ProductArt name={name} className="text-ink" style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }} />
    </div>
  );
}
