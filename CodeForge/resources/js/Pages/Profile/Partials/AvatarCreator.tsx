
import { useState } from "react";
import { Undo, Redo } from "lucide-react";
import { Button } from "@/Components";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import Fair from "@/Components/svgs/face/Fair";
import Beard from "@/Components/svgs/face/Beard";
import Style01 from "@/Components/svgs/hair/Style01";
import Style02 from "@/Components/svgs/hair/Style02";
import Normal from "@/Components/svgs/eyes/Normal";
import NormalSmile from "@/Components/svgs/mouth/NormalSmile";
import Smiley from "@/Components/svgs/mouth/Smiley";
import Angry from "@/Components/svgs/eyes/Angry";
import Cap from "@/Components/svgs/accessories/Cap";
import Earphones from "@/Components/svgs/accessories/Earphones";
import CircleEarring from "@/Components/svgs/accessories/CircleEarring";
import Earring from "@/Components/svgs/accessories/Earring";
import FuturisticGlasses from "@/Components/svgs/accessories/FuturisticGlasses";
import Outfit01 from "@/Components/svgs/outfits/Outfit01";
import Outfit02 from "@/Components/svgs/outfits/Outfit02";
import { useAvatar } from "@/contexts/avatarContext";
import AvatarPreview from "@/Components/avatar/AvatarPreview";

interface Avatar {
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

export default function AvatarCreator() {
    // Avatar state
    // Inside AvatarCreator component
    const { avatar, setAvatar } = useAvatar();


    // History for undo/redo
    const [history, setHistory] = useState([avatar]);
    const [historyIndex, setHistoryIndex] = useState(0);



    // Replace updateAvatar
    const updateAvatar = <K extends keyof Avatar>(key: K, value: Avatar[K]) => {
    const newAvatar = { ...avatar, [key]: value };
    setAvatar(newAvatar);

        // Add to history, removing any future states if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1).concat(newAvatar);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Undo/Redo functions
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setAvatar(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setAvatar(history[historyIndex + 1]);
        }
    };
    return (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto p-4">
            {/* Avatar Preview */}
            <div className="flex-1 flex flex-col items-center gap-4">
                <div className="p-8 flex items-center justify-center bg-green-700/40 rounded-lg shadow-md">
                    <div className="w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
                        <AvatarPreview avatar={avatar}/>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={undo}
                        disabled={historyIndex === 0}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={redo}
                        disabled={historyIndex === history.length - 1}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Customization Controls */}
            <div className="flex-1">
                <Tabs defaultValue="face">
                    <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="face">Face</TabsTrigger>
                        <TabsTrigger value="hair">Hair</TabsTrigger>
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="accessories">
                            Accessories
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="face" className="space-y-4 select-none">
                        <div className="space-y-2">
                            <Label>Face Type</Label>
                            <RadioGroup
                                defaultValue={avatar.face}
                                onValueChange={(value: "fair" | "beard") =>
                                    updateAvatar("face", value)
                                }
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fair" id="fair" />
                                    <Label htmlFor="fair">Fair Skin</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="beard" id="beard" />
                                    <Label htmlFor="beard">Beard</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Eyes</Label>
                            <RadioGroup
                                defaultValue={avatar.eyes}
                                onValueChange={(value: "normal" | "angry") =>
                                    updateAvatar("eyes", value)
                                }
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="normal"
                                        id="normal-eyes"
                                    />
                                    <Label htmlFor="normal-eyes">Normal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="angry"
                                        id="angry-eyes"
                                    />
                                    <Label htmlFor="angry-eyes">Angry</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>Mouth</Label>
                            <RadioGroup
                                defaultValue={avatar.mouth}
                                onValueChange={(
                                    value: "normalSmile" | "smiley"
                                ) => updateAvatar("mouth", value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="normalSmile"
                                        id="normal-smile"
                                    />
                                    <Label htmlFor="normal-smile">
                                        Normal Smile
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="smiley"
                                        id="smiley"
                                    />
                                    <Label htmlFor="smiley">Smiley</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </TabsContent>

                    <TabsContent value="hair" className="space-y-4 select-none">
                        <div className="space-y-2">
                            <Label>Hair Style</Label>
                            <Select
                                value={avatar.hair}
                                onValueChange={(value: "style01" | "style02") =>
                                    updateAvatar("hair", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select hair style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="style01">
                                        Style 1
                                    </SelectItem>
                                    <SelectItem value="style02">
                                        Style 2
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    <TabsContent value="features" className="space-y-4 select-none">
                        <div className="space-y-2">
                            <Label>Outfit</Label>
                            <Select
                                value={avatar.outfit}
                                onValueChange={(
                                    value: "outfit01" | "outfit02"
                                ) => updateAvatar("outfit", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select outfit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="outfit01">
                                        Outfit 1
                                    </SelectItem>
                                    <SelectItem value="outfit02">
                                        Outfit 2
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    <TabsContent value="accessories" className="space-y-4 select-none">
                        <div className="space-y-2">
                            <Label>Accessory</Label>
                            <Select
                                value={avatar.accessory}
                                onValueChange={(
                                    value:
                                        | "none"
                                        | "cap"
                                        | "earphones"
                                        | "circleEarring"
                                        | "earring"
                                        | "futuristicGlasses"
                                ) => updateAvatar("accessory", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select accessory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="cap">Cap</SelectItem>
                                    <SelectItem value="earphones">
                                        Earphones
                                    </SelectItem>
                                    <SelectItem value="circleEarring">
                                        Circle Earring
                                    </SelectItem>
                                    <SelectItem value="earring">
                                        Earring
                                    </SelectItem>
                                    <SelectItem value="futuristicGlasses">
                                        Futuristic Glasses
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
