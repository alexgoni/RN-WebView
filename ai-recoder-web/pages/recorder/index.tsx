import Header from "@/components/Header";
import { formatTime } from "@/modules/util";
import { useEffect, useRef, useState } from "react";

export default function RecoderPage() {
  const [state, setState] = useState<"recording" | "paused" | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [time, setTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const onStartRecord = () => {
    setTime(0);
    startTimer();
    setAudioUrl(null);
    setState("recording");
  };

  const onStopRecord = (url: string) => {
    stopTimer();
    setToastVisible(true);
    setAudioUrl(url);
    setState(null);
  };

  const onPressRecord = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const mimeType = "audio/webm";
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.onstart = () => {
          onStartRecord();
        };
        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: chunksRef.current[0].type,
          });
          chunksRef.current = [];
          const url = URL.createObjectURL(blob);
          onStopRecord(url);
          stream.getAudioTracks().forEach((track) => track.stop());
        };
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert(
          "녹음 장치를 사용할 수 없습니다. 마이크를 연결하거나 권한을 확인하세요."
        );
      });
  };

  const onPressPause = () => {
    if (state === "recording") {
      mediaRecorderRef.current?.pause();
      stopTimer();
      setState("paused");
    } else if (state === "paused") {
      mediaRecorderRef.current?.resume();
      startTimer();
      setState("recording");
    }
  };

  const onPressSave = () => {
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    if (toastVisible) {
      const id = setTimeout(() => {
        setToastVisible(false);
      }, 1000);
      return () => {
        clearTimeout(id);
      };
    }
  }, [toastVisible]);

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header title="녹음하기" />

      <div className="flex flex-1 flex-col items-center pt-[211px]">
        {state === "recording" && (
          <button
            className="w-[120px] h-[120px] rounded-[80px] bg-[#1A1A1A]"
            onClick={onPressPause}
          >
            <span className="material-icons text-white text-[70px]">mic</span>
          </button>
        )}
        {state === "paused" && (
          <button
            className="w-[120px] h-[120px] rounded-[80px] bg-[#1A1A1A]"
            onClick={onPressPause}
          >
            <span className="material-icons text-white text-[70px]">pause</span>
          </button>
        )}
        {state === null && (
          <button
            className="w-[120px] h-[120px] rounded-[80px] bg-[#1A1A1A]"
            onClick={onPressRecord}
          >
            <span className="material-icons text-[#09CC7F] text-[70px]">
              mic
            </span>
          </button>
        )}

        <span
          className={`mt-[42px] text-[20px] font-[600] ${
            state !== null ? "text-[#303030]" : "text-[#AEAEB2]"
          }`}
        >
          {formatTime(time)}
        </span>
        {state === "recording" && (
          <button
            className="mt-[42px] bg-[#1A1A1A] rounded-[27px] px-[42px] py-[16px] items-center flex"
            onClick={onPressPause}
          >
            <span className="material-icons text-white text-[20px]">pause</span>
            <span className="ml-[4px] text-[15px] text-white font-[600]">
              일시 정지
            </span>
          </button>
        )}
        {state !== null && (
          <button
            className={`${
              state === "paused" ? "mt-[42px]" : "mt-[16px]"
            } bg-[#09CC7F] rounded-[27px] px-[42px] py-[16px] items-center flex`}
            onClick={onPressSave}
          >
            <span className="material-icons text-white text-[20px]">check</span>
            <span className="ml-[4px] text-[15px] text-white font-[600]">
              저장 하기
            </span>
          </button>
        )}

        {audioUrl != null && (
          <audio controls>
            <source src={audioUrl} />
          </audio>
        )}

        {toastVisible && (
          <div className="absolute bottom-[21px] flex border-[1.5px] border-[#09CC7F] w-[358px] py-[13px] px-[17px] rounded-[6px] bg-[#F9FEFF]">
            <span className="material-icons text-[#00DDA8] text-[24px]">
              check
            </span>
            <p className="ml-[7px] text-[15px] font-[600] text-[#4A4A4A]">
              저장이 완료되었습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
