import Link from "next/link";

const cols = [
  { title: "매장 찾기", links: ["국가/지역 또는 도시 검색", "방문 예약하기", "매장 픽업 안내"] },
  { title: "고객 문의", links: ["클라이언트 서비스센터", "주문 내역 확인", "자주 묻는 질문(FAQ)", "배송 및 반품"] },
  { title: "회사 정보", links: ["브랜드 스토리", "지속가능성", "채용 정보", "개인정보처리방침"] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-canvas">
      <div className="px-5 pt-14 pb-28 lg:px-10 lg:pt-[72px] lg:pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title} className="flex flex-col gap-3.5">
              <p className="cta">{c.title}</p>
              <ul className="flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-[13px] text-ink-3 hover:text-canvas">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <form className="flex flex-col gap-3.5" action="#">
            <p className="cta">VELLANTI 소식 받기</p>
            <p className="text-[13px] text-ink-3">컬렉션 출시와 이벤트 소식을 가장 먼저 받아보세요.</p>
            <div className="flex items-center justify-between border-b border-canvas pb-2.5">
              <input type="email" required placeholder="이메일 주소" aria-label="이메일 주소" className="w-full bg-transparent text-[13px] placeholder:text-ink-3 outline-none" />
              <button className="cta shrink-0">구독하기</button>
            </div>
          </form>
        </div>
        <div className="mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="logo text-[56px] sm:text-[80px] lg:text-[96px]">VELLANTI</p>
          <p className="text-[12px] leading-relaxed text-ink-3 lg:text-right">
            © 2026 VELLANTI KOREA. 본 디자인은 가상 브랜드 시안입니다.
            <br />
            한국 / Korea · 이용약관 · 개인정보처리방침
          </p>
        </div>
      </div>
    </footer>
  );
}
