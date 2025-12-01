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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { platformSizes, type PlatformKey } from "@/lib/templates";

type MediaType = "image" | "video";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  provider?: string;
  taskId?: string;
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
  const [aspectRatio, setAspectRatio] = useState<string>("platform"); // default aligns to platform
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const { user } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const resolvedTasks = useRef<Set<string>>(new Set());
  const isPremium = user?.plan === "premium" || user?.plan === "pro";
  const activeModel = AI_MODELS.find((m) => m.id === selectedModel);
  const modeLabel =
    mode === "image"
      ? t("studio.mode.image", "Image")
      : t("studio.mode.video", "Video");
  const ModeIcon = mode === "image" ? ImageIcon : Film;
  const ratioPresets = [
    { label: t("studio.ratio.auto", "Auto (model)"), value: "auto" },
    { label: t("studio.ratio.platform", "Match platform"), value: "platform" },
    { label: "1:1", value: "1:1" },
    { label: "4:5", value: "4:5" },
    { label: "3:4", value: "3:4" },
    { label: "9:16", value: "9:16" },
    { label: "16:9", value: "16:9" },
    { label: "2:3", value: "2:3" },
  ];
  const platformRatios: Record<PlatformKey, string> = {
    tiktok: "9:16",
    "instagram-square": "1:1",
    "instagram-story": "9:16",
    twitter: "1:1",
    facebook: "1:1",
    linkedin: "1:1",
  };
  const displayRatio =
    aspectRatio === "platform"
      ? platformRatios[previewPlatform] || "9:16"
      : aspectRatio === "auto"
      ? t("studio.ratio.auto.short", "Model default")
      : aspectRatio;

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
        const data = (await res.json()) as { url: string; source?: string };

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("studio.imageReady", "Your image is ready."),
          mediaType: "image",
          mediaUrl: data.url,
          provider: data.source,
          modelUsed: AI_MODELS.find((m) => m.id === selectedModel)?.name,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        toast.success(t("studio.imageReady", "Your image is ready."));
      } else {
        const res = await fetch("/api/ai-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userMsg.content }),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as {
          url: string;
          source?: string;
          taskId?: string;
        };
        const videoUrl =
          data?.url ||
          `https://image.pollinations.ai/prompt/${encodeURIComponent(
            userMsg.content
          )}?width=720&height=1280&nologo=true`;
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("studio.videoReady", "Video concept ready to download."),
          mediaType: "video",
          mediaUrl: videoUrl,
          provider: data?.source,
          taskId: data?.taskId,
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

  // Poll Veo3 tasks to swap in final URL
  useEffect(() => {
    const pending = messages.filter(
      (m) =>
        m.mediaType === "video" &&
        m.provider === "veo3" &&
        m.taskId &&
        !resolvedTasks.current.has(m.taskId)
    );
    if (pending.length === 0) return;

    const interval = setInterval(async () => {
      for (const msg of pending) {
        if (!msg.taskId) continue;
        try {
          const res = await fetch("/api/ai-video/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: msg.taskId }),
          });
          if (!res.ok) continue;
          const data = (await res.json()) as {
            status?: string;
            url?: string;
            taskId?: string;
          };
          if (data.status === "completed" && data.url) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === msg.id
                  ? {
                      ...m,
                      mediaUrl: data.url,
                    }
                  : m
              )
            );
            resolvedTasks.current.add(msg.taskId);
            toast.success(
              t("studio.videoReady", "Video concept ready to download.")
            );
          }
        } catch {
          // swallow polling errors
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [messages, t]);

  return (
    <div className="relative flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground">
      {/* --- MAIN CHAT AREA --- */}
      <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {/* Header Configuration */}
        <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border/40 bg-background/80 px-4 py-4 backdrop-blur-md sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("viral.title", "Viral Studio")}
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {t("viral.beta", "Pro Grade")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <Badge variant="outline" className="border-border/60 bg-muted/40">
                {t("viral.images.note", "Images stay in chat")}
              </Badge>
              <Badge
                variant="secondary"
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                {t("viral.videos.note", "Videos download-only")}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("studio.platform", "Platform")}
              </Label>
              <Select
                value={previewPlatform}
                onValueChange={(v) => setPreviewPlatform(v as PlatformKey)}
              >
                <SelectTrigger className="h-9 w-[170px] border-border/60 bg-muted/30 text-xs font-medium focus:ring-0 focus:ring-offset-0 sm:w-[190px]">
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
              className="h-9 w-9 rounded-full border border-border/60 bg-muted/40"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t("nav.toggleTheme", "Toggle theme")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </header>

        {/* Experience Strip (always visible) */}
        <div className="sticky top-16 z-20 hidden px-3 pt-2 md:block md:px-10">
          <div className="mx-auto max-w-5xl space-y-3 rounded-2xl border border-border/40 bg-background/90 p-3 shadow-lg backdrop-blur md:p-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-card/80 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ModeIcon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {t("studio.mode", "Mode")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {modeLabel}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px]">
                  {mode === "video" ? "MP4" : "PNG"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-card/80 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {t("studio.model.title", "Viral models")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {activeModel?.name ||
                        t("studio.model.select", "Select model")}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[11px]">
                  {activeModel?.id?.toUpperCase?.() || "—"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-card/80 px-3 py-2">
                <div className="flex items-center gap-2">
                  <MonitorSmartphone className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {t("studio.platform", "Platform")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {platformSizes[previewPlatform].label}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[11px]">
                  {platformSizes[previewPlatform].width}×
                  {platformSizes[previewPlatform].height}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/80 px-3 py-2">
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {t("studio.ratio.title", "Output ratio")}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {displayRatio}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  {ratioPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={
                        aspectRatio === preset.value ? "default" : "outline"
                      }
                      size="sm"
                      className="h-8 min-w-[88px] justify-center text-[12px] font-medium"
                      onClick={() => setAspectRatio(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto overscroll-contain px-3 pb-44 pt-4 md:px-10 md:pt-8 md:pb-48"
          >
            <div className="mx-auto flex max-w-5xl flex-col space-y-8 rounded-3xl border border-border/40 bg-card/70 p-3 shadow-[0_20px_70px_-40px_rgba(0,0,0,0.6)] backdrop-blur-lg md:p-6">
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
                  <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                    {[
                      t(
                        "studio.suggestion1",
                        "Hyper-realistic cyberpunk street"
                      ),
                      t("studio.suggestion2", "Cinematic drone shot of ocean"),
                      t("studio.suggestion3", "POV vlog of a product launch"),
                      t(
                        "studio.suggestion4",
                        "Slow-motion sports highlight reel"
                      ),
                    ].map((suggestion) => (
                      <div
                        key={suggestion}
                        className="cursor-pointer rounded-xl border border-border/50 bg-gradient-to-br from-muted/40 via-muted/20 to-background/60 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
                      >
                        <p className="text-xs font-medium leading-5 text-foreground/90">
                          {suggestion}
                        </p>
                      </div>
                    ))}
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
                          "rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all",
                          msg.role === "user"
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-none"
                            : "bg-muted/60 border border-border/40 rounded-tl-none"
                        )}
                      >
                        {msg.content}
                      </div>

                      {/* Media Card (AI Only) */}
                      {msg.mediaUrl && (
                        <div className="mt-2 w-full max-w-[260px] md:max-w-[300px] overflow-hidden rounded-xl border border-border/60 bg-background shadow-md transition-all hover:-translate-y-0.5 hover:shadow-2xl">
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
                              {msg.provider?.toUpperCase?.() || "HD"}
                            </Badge>
                          </div>

                          {/* Media Content */}
                          <div className="relative aspect-[3/4] w-full bg-black/5">
                            {msg.mediaType === "video" ? (
                              <>
                                <video
                                  src={msg.mediaUrl}
                                  className="h-full w-full object-cover"
                                  controls
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                />
                                {msg.provider === "veo3" && msg.taskId && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[11px] font-medium text-white">
                                    {t(
                                      "studio.processing",
                                      "Processing video..."
                                    )}
                                  </div>
                                )}
                              </>
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
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-20 border-t border-border/50 bg-background/95 px-4 pb-4 pt-3 shadow-[0_-12px_40px_-24px_rgba(0,0,0,0.6)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-background/90 p-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
            <div className="relative flex items-end gap-2">
              <div className="flex pb-2 pl-1">
                {/* <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Settings2 className="h-5 w-5" />
                 </Button> */}

                <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="space-y-4 pb-8 max-h-[75vh] mx-auto container overflow-y-auto rounded-t-3xl border-border/50 bg-background/95 md:max-w-3xl md:rounded-3xl md:pb-10"
                  >
                    <SheetHeader>
                      <SheetTitle>
                        {t("studio.settings.title", "Output & framing")}
                      </SheetTitle>
                      <SheetDescription>
                        {t(
                          "studio.settings.desc",
                          "Adjust format, model, and platform without leaving the conversation."
                        )}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                          {t("studio.mode", "Mode")}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {(["image", "video"] as const).map((m) => (
                            <Button
                              key={m}
                              variant={mode === m ? "default" : "outline"}
                              size="sm"
                              className="justify-center gap-2 text-sm"
                              onClick={() => setMode(m)}
                            >
                              {m === "image" ? (
                                <ImageIcon className="h-4 w-4" />
                              ) : (
                                <Film className="h-4 w-4" />
                              )}
                              {m === "image"
                                ? t("studio.mode.image", "Image")
                                : t("studio.mode.video", "Video")}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                          {t("studio.platform", "Platform")}
                        </p>
                        <div className="mt-2">
                          <Select
                            value={previewPlatform}
                            onValueChange={(v) =>
                              setPreviewPlatform(v as PlatformKey)
                            }
                          >
                            <SelectTrigger className="h-10 w-full border-border/60 bg-muted/30 text-sm font-medium focus:ring-0 focus:ring-offset-0">
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
                                <SelectItem
                                  key={p}
                                  value={p}
                                  className="text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
                                    <span>{platformSizes[p].label}</span>
                                    <span className="text-[11px] text-muted-foreground">
                                      {platformSizes[p].width}×
                                      {platformSizes[p].height}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                              {t("studio.ratio.title", "Output ratio")}
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {displayRatio}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[11px]">
                          {mode === "video" ? "Video" : "Image"}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {ratioPresets.map((preset) => (
                          <Button
                            key={preset.value}
                            variant={
                              aspectRatio === preset.value
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="h-9 justify-center text-[12px] font-medium"
                            onClick={() => setAspectRatio(preset.value)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {t("studio.model.title", "Viral models")}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {AI_MODELS.map((model) => (
                          <Button
                            key={model.id}
                            variant={
                              selectedModel === model.id ? "default" : "outline"
                            }
                            size="sm"
                            className="justify-start gap-2 text-sm"
                            onClick={() => setSelectedModel(model.id)}
                          >
                            <model.icon className={`h-4 w-4 ${model.color}`} />
                            {model.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
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
