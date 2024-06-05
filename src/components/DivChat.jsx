export function DivChat({ receiverUserName, receiverEmail }) {
  return (
    <div className="flex flex-col items-center bg-[#000015] border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
      {/* <div className="h-20 w-20 rounded-full border overflow-hidden">
      <img
        src="https://avatars3.githubusercontent.com/u/2763884?s=128"
        alt="Avatar"
        className="h-full w-full"
      />
    </div> */}
      <div className="text-sm font-semibold mt-2">{receiverUserName}</div>
      <div className="text-xs text-gray-500">{receiverEmail}</div>
    </div>
  );
}
