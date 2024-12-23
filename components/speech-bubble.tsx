export function SpeechBubble() {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl px-3 py-1.5 shadow-lg">
        <p className="text-primary text-sm font-medium whitespace-nowrap">
          Fill the form for a special surprise! 🎄
        </p>
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 
            border-l-[6px] border-l-transparent
            border-t-[8px] border-t-white
            border-r-[6px] border-r-transparent"
        ></div>
      </div>
    </div>
  );
}
