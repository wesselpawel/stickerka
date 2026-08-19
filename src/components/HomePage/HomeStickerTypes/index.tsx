"use client";

import { useState } from "react";
import CreateStickerPopup from "@/components/CreateStickerPopup";
import { HOME_STICKER_TYPES } from "./config";

export default function HomeStickerTypes() {
  const [createStickerOpen, setCreateStickerOpen] = useState(false);

  return (
    <>
      <CreateStickerPopup
        open={createStickerOpen}
        onOpenChange={setCreateStickerOpen}
      />

    {/* <button 
    className="flex flex-col items-center justify-center border-chill-line/60 bg-gradient-to-r from-chill-sage via-chill-mist to-chill-sea p-3 block mt-24 md:mt-32 lg:mt-36 mx-auto w-max max-w-full"
                onClick={() => setCreateStickerOpen(true)}
                >
<div className="font-bold"> Zamów naklejkę ze zdjęcia</div><div className="text-white">(kliknij tutaj aby zacząć)</div>
                </button> */}

    </>
  );
}
