import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-[#f6f6f9] relative">
      <Link
        href="/recorder"
        className="flex bg-black text-white py-[10px] px-[18px] rounded-[25px] items-center absolute gap-[3px] bottom-[29px] right-[16px]"
      >
        <span className="material-icons text-[24px]">mic</span>
        <span className="text-[14px]">녹음하기</span>
      </Link>
    </div>
  );
}
