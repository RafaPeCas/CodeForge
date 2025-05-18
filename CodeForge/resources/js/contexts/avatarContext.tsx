import { createContext, useContext, useState, ReactNode } from "react";
import type { Avatar } from "@/Components/avatar/AvatarPreview";

const defaultAvatar: Avatar = {
    face: "fair",
    eyes: "normal",
    mouth: "normalSmile",
    hair: "style01",
    accessory: "none",
    outfit: "none",
};

interface AvatarContextType {
    avatar: Avatar;
    setAvatar: (avatar: Avatar) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function useAvatar() {
    const context = useContext(AvatarContext);
    if (!context) throw new Error("useAvatar must be used within AvatarProvider");
    return context;
}

export function AvatarProvider({ children }: { children: ReactNode }) {
    const [avatar, setAvatar] = useState<Avatar>(defaultAvatar);
    return (
        <AvatarContext.Provider value={{ avatar, setAvatar }}>
            {children}
        </AvatarContext.Provider>
    );
}

