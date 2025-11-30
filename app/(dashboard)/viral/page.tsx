"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Image as ImageIcon,
  Film,
  Download,
  Bot,
  Sparkles,
  Settings2,
  MonitorSmartphone,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { platformSizes, type PlatformKey } from "@/lib/templates";

// --- Types & Mock Data ---

type ModelType = "gemini-v3" | "gpt-5" | "nano-banana" | "flux-ultra";
type MediaType = "image" | "video";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  timestamp: Date;
  modelUsed?: string;
}

const AI_MODELS = [
  {
    id: "gemini-v3",
    name: "Gemini v3 Flash",
    icon: Sparkles,
    color: "text-indigo-400",
  },
  { id: "gpt-5", name: "GPT-5 Omni", icon: Bot, color: "text-green-400" },
  {
    id: "flux-ultra",
    name: "Flux Ultra Realism",
    icon: ImageIcon,
    color: "text-blue-400",
  },
  {
    id: "nano-banana",
    name: "Nano Banana v1",
    icon: Film,
    color: "text-yellow-400",
  },
];

export default function ViralStudioChat() {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-v3");
  const [mode, setMode] = useState<MediaType>("image");
  const [previewPlatform, setPreviewPlatform] = useState<PlatformKey>("tiktok");
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [modePopoverOpen, setModePopoverOpen] = useState(false);
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const { user } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPremium = user?.plan === "premium" || user?.plan === "pro";

  // --- Auto-scroll to bottom ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // --- Handlers ---

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!isPremium) {
      toast.error(t("studio.locked", "Premium or Pro required for generation"));
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    try {
      if (mode === "image") {
        const res = await fetch("/api/ai-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userMsg.content }),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { url: string };

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("studio.imageReady", "Your image is ready."),
          mediaType: "image",
          mediaUrl: data.url,
          modelUsed: AI_MODELS.find((m) => m.id === selectedModel)?.name,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        toast.success(t("studio.imageReady", "Your image is ready."));
      } else {
        const videoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          userMsg.content
        )}?width=720&height=1280&nologo=true`;
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("studio.videoReady", "Video concept ready to download."),
          mediaType: "video",
          mediaUrl: videoUrl,
          modelUsed: AI_MODELS.find((m) => m.id === selectedModel)?.name,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        toast.success(
          t("studio.videoReady", "Video concept ready to download.")
        );
      }
    } catch {
      toast.error(t("studio.error", "Generation failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, type: MediaType) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `viral-studio-${Date.now()}.${
      type === "video" ? "mp4" : "png"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t("studio.downloadStart", "Download started"));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* --- MAIN CHAT AREA --- */}
      <main className="flex flex-1 flex-col">
        {/* Header Configuration */}
        <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-md sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:py-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <Badge variant="outline">
              {t("viral.images.note", "Images stay in chat")}
            </Badge>
            <Badge
              variant="secondary"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              {t("viral.videos.note", "Videos download-only")}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("studio.platform", "Platform")}
              </Label>
              <Select
                value={previewPlatform}
                onValueChange={(v) => setPreviewPlatform(v as PlatformKey)}
              >
                <SelectTrigger className="h-8 w-[150px] border-border/60 bg-muted/20 text-xs font-medium focus:ring-0 focus:ring-offset-0 sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "tiktok",
                      "instagram-square",
                      "instagram-story",
                    ] as PlatformKey[]
                  ).map((p) => (
                    <SelectItem key={p} value={p} className="text-xs">
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{platformSizes[p].label}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {platformSizes[p].width}×{platformSizes[p].height}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t("nav.toggleTheme", "Toggle theme")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-hidden relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-10">
          <div
            ref={scrollRef}
            className="h-[calc(100vh-13rem)] overflow-y-auto px-3 py-4 pb-32 space-y-8 md:px-10 md:py-10"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center opacity-80 select-none">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {t("studio.ready", "Ready to create?")}
                </h3>
                <p className="max-w-md text-sm text-secondary-foreground/90 mt-2">
                  {t(
                    "studio.readyHint",
                    "Select a model and describe your viral idea. We'll handle the rest."
                  )}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-2 text-left">
                  <div className="cursor-pointer rounded-lg border border-border/50 bg-background/50 p-3 hover:bg-muted/50 transition-colors">
                    <p className="text-xs font-medium">
                      {t(
                        "studio.suggestion1",
                        "Hyper-realistic cyberpunk street"
                      )}
                    </p>
                  </div>
                  <div className="cursor-pointer rounded-lg border border-border/50 bg-background/50 p-3 hover:bg-muted/50 transition-colors">
                    <p className="text-xs font-medium">
                      {t("studio.suggestion2", "Cinematic drone shot of ocean")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full gap-3 sm:gap-4 max-w-4xl mx-auto px-1",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "flex flex-col gap-2 max-w-[92%] sm:max-w-[85%]",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    {/* Text Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted/50 border border-border/40 rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </div>

                    {/* Media Card (AI Only) */}
                    {msg.mediaUrl && (
                      <div className="mt-2 w-full max-w-[260px] md:max-w-[300px] overflow-hidden rounded-xl border border-border/60 bg-background shadow-md transition-all hover:shadow-xl">
                        {/* Header of card */}
                        <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            {msg.mediaType === "video" ? (
                              <Film className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span className="text-[10px] font-medium text-muted-foreground uppercase">
                              {msg.modelUsed}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="h-5 px-1.5 text-[10px] font-normal"
                          >
                            HD
                          </Badge>
                        </div>

                        {/* Media Content */}
                        <div className="relative aspect-[3/4] w-full bg-black/5">
                          {msg.mediaType === "video" ? (
                            <video
                              src={msg.mediaUrl}
                              className="h-full w-full object-cover"
                              controls
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={msg.mediaUrl}
                              alt="Generated"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between p-3">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full gap-2 text-xs font-medium"
                            onClick={() =>
                              msg.mediaUrl &&
                              msg.mediaType &&
                              handleDownload(msg.mediaUrl, msg.mediaType)
                            }
                          >
                            <Download className="h-3.5 w-3.5" />
                            {t("studio.download", "Download")}{" "}
                            {msg.mediaType === "video" ? "MP4" : "PNG"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="px-1 text-[10px] text-muted-foreground/60">
                      {msg.role === "user"
                        ? t("studio.timestamp.you", "You")
                        : t("studio.timestamp.ai", "Studio AI")}{" "}
                      •{" "}
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        Me
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isGenerating && (
              <div className="flex w-full max-w-4xl mx-auto gap-4 justify-start">
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className="bg-primary/10">
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-muted/30 border border-border/40 px-4 py-3">
                  <span className="flex gap-1">
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                    {t("studio.loading", "Generating your masterpiece with")}{" "}
                    {AI_MODELS.find((m) => m.id === selectedModel)?.name}...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-6 left-0 right-0 px-4 md:left-[260px]">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-background/80 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
            <div className="relative flex items-end gap-2">
              <div className="flex pb-2 pl-1">
                {/* <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Settings2 className="h-5 w-5" />
                 </Button> */}

                <Popover
                  open={modePopoverOpen}
                  onOpenChange={setModePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-2" align="start">
                    <div className="text-[11px] font-semibold text-muted-foreground mb-2">
                      {t("studio.mode", "Mode")}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant={mode === "image" ? "default" : "ghost"}
                        size="sm"
                        className="justify-start gap-2 text-xs"
                        onClick={() => {
                          setMode("image");
                          setModePopoverOpen(false);
                        }}
                      >
                        <ImageIcon className="h-4 w-4" />{" "}
                        {t("studio.mode.image", "Image")}
                      </Button>
                      <Button
                        variant={mode === "video" ? "default" : "ghost"}
                        size="sm"
                        className="justify-start gap-2 text-xs"
                        onClick={() => {
                          setMode("video");
                          setModePopoverOpen(false);
                        }}
                      >
                        <Film className="h-4 w-4" />{" "}
                        {t("studio.mode.video", "Video")}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === "image"
                    ? t(
                        "studio.placeholder.image",
                        "Describe the image you want to see..."
                      )
                    : t(
                        "studio.placeholder.video",
                        "Describe the video scene..."
                      )
                }
                className="min-h-[50px] max-h-[200px] w-full resize-none border-0 bg-transparent px-3 py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-hide placeholder:text-muted-foreground/50"
                rows={1}
              />
              <div className="pb-2 pr-1">
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isGenerating}
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full transition-all duration-300",
                    input.trim()
                      ? "bg-primary text-primary-foreground hover:scale-105"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isGenerating ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                  ) : (
                    <Send className="h-4 w-4 ml-0.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Footer hints inside Input */}
            <div className="flex items-center justify-between px-4 pb-2 pt-1">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                {/* <Badge variant="outline" className="h-5 border-border/40 bg-muted/20 font-normal">
                    {AI_MODELS.find(m => m.id === selectedModel)?.name}
                 </Badge> */}
                <Popover
                  open={modelPopoverOpen}
                  onOpenChange={setModelPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Badge
                      variant="outline"
                      className="h-8 cursor-pointer border-border/60 bg-muted/20 px-3 text-xs font-medium"
                    >
                      {AI_MODELS.find((m) => m.id === selectedModel)?.name ||
                        t("studio.model.select", "Select model")}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="start">
                    <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                      {t("studio.model.title", "Viral models")}
                    </div>
                    <div className="space-y-1">
                      {AI_MODELS.map((model) => (
                        <Button
                          key={model.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start gap-2 text-xs",
                            selectedModel === model.id &&
                              "bg-primary/10 text-foreground"
                          )}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setModelPopoverOpen(false);
                          }}
                        >
                          <model.icon
                            className={`h-3.5 w-3.5 ${model.color}`}
                          />
                          {model.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-[10px] text-muted-foreground/60">
                <strong>Shift + Enter</strong>{" "}
                {t("studio.inputHint", "for new line")}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-secondary-foreground/90">
            {t(
              "studio.disclaimer",
              "AI can make mistakes. Please verify generated content."
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
