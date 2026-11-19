import { ArrowLeft } from "lucide-react";

export default function CreateEntry() {
  return (
    <div className="w-full h-full p-5">
      <div className="w-full h-full grid grid-rows-[5vh_auto] p-4 bg-white/5 rounded-lg">
        <div>
          <button className="flex gap-1 py-2 px-3 w-[5.5%] h-full bg-white rounded-lg text-black items-center transition-colors hover:bg-prod-pink hover:text-white">
            <ArrowLeft />
            <div className="text-lg">Back</div>
          </button>
        </div>
        <div className="grid grid-cols-[60%_40%] pt-4">
          <div className="bg-amber-200"></div>
          <div className="flex flex-col bg-red-200 p-2">
            <div className="bg-white/50 h-[40%] rounded-lg">
              <input type="file" name="" value="" />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
