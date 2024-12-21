import { useRouter } from "next/router";
import { useCallback } from "react";

interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  const router = useRouter();

  const onPressBackButton = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <header className="flex h-[44px] items-center">
      <div className="flex flex-1">
        <button type="button" className="ml-[20px]" onClick={onPressBackButton}>
          <span className="material-icons text-[24px] text-[#4a4a4a]">
            arrow_back_ios
          </span>
        </button>
      </div>
      <div className="flex flex-1 justify-center text-[#4a4a4a]">{title}</div>
      <div className="flex flex-1">
        <button type="button" className="ml-[20px]" onClick={onPressBackButton}>
          <span className="material-icons text-[24px] text-[#4a4a4a]">
            camera
          </span>
        </button>
      </div>
    </header>
  );
}
