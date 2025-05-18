import Fair from "@/Components/svgs/face/Fair";
import Beard from "@/Components/svgs/face/Beard";
import Style01 from "@/Components/svgs/hair/Style01";
import Style02 from "@/Components/svgs/hair/Style02";
import Normal from "@/Components/svgs/eyes/Normal";
import Angry from "@/Components/svgs/eyes/Angry";
import NormalSmile from "@/Components/svgs/mouth/NormalSmile";
import Smiley from "@/Components/svgs/mouth/Smiley";
import Cap from "@/Components/svgs/accessories/Cap";
import Earphones from "@/Components/svgs/accessories/Earphones";
import CircleEarring from "@/Components/svgs/accessories/CircleEarring";
import Earring from "@/Components/svgs/accessories/Earring";
import FuturisticGlasses from "@/Components/svgs/accessories/FuturisticGlasses";
import Outfit01 from "@/Components/svgs/outfits/Outfit01";
import Outfit02 from "@/Components/svgs/outfits/Outfit02";

export interface Avatar {
    face: "fair" | "beard";
    eyes: "normal" | "angry";
    mouth: "normalSmile" | "smiley";
    hair: "style01" | "style02";
    accessory:
        | "none"
        | "cap"
        | "earphones"
        | "circleEarring"
        | "earring"
        | "futuristicGlasses";
    outfit: "none" | "outfit01" | "outfit02";
}

export default function AvatarPreview({ avatar,classname }: { avatar: Avatar, classname?: string }) {
    return (
        <div
            id="avatar-svg"
            className={`relative w-full h-full flex items-center justify-center ${classname}`}
        >
            {/* Base Face */}
            <div className="absolute">
            {avatar.face === "fair" ? <Fair /> : <Beard />}
            </div>
            {/* Eyes */}
            <div className="absolute translate-x-11.5 -translate-y-12.5 ">
                {avatar.eyes === "normal" ? <Normal /> : <Angry />}
            </div>

            {/* Mouth */}
            <div className="absolute translate-x-6 translate-y-3 ">
                {avatar.mouth === "normalSmile" ? <NormalSmile /> : <Smiley />}
            </div>

            {/* Outfit */}
            <div className="absolute translate-x-4.5 translate-y-25 ">
                {avatar.outfit === "outfit01" ? (
                    <Outfit01 />
                ) : avatar.outfit === "outfit02" ? (
                    <Outfit02 />
                ) : null}
            </div>

            {/* Hair */}
            <div className="absolute translate-x-3 -translate-y-10 ">
                {avatar.hair === "style01" ? (
                    <Style01 />
                ) : avatar.hair === "style02" ? (
                    <Style02 />
                ) : null}
            </div>

            {/* Accessories */}
            {avatar.accessory === "cap" ? (
                <div className="absolute translate-x-4.75 -translate-y-10.5 ">
                    <Cap />
                </div>
            ) : avatar.accessory === "earphones" ? (
                <div className="absolute translate-x-5.5 translate-y-15 ">
                    <Earphones />
                </div>
            ) : avatar.accessory === "circleEarring" ? (
                <div className="absolute translate-x-4.75 translate-y-1.75 -rotate-3 ">
                    <CircleEarring />
                </div>
            ) : avatar.accessory === "earring" ? (
                <div className="absolute translate-x-5.5 translate-y-1 ">
                    <Earring />
                </div>
            ) : avatar.accessory === "futuristicGlasses" ? (
                <div className="absolute translate-x-5.5 translate-y-0.5 ">
                    <FuturisticGlasses />
                </div>
            ) : null}
        </div>
    );
}
