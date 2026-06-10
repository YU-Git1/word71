import { IndustryOption } from "@/types/word";

export const industryOptions: Array<{
  value: IndustryOption;
  label: string;
  hint: string;
}> = [
  { value: "general", label: "通用学习", hint: "优先展示常见释义" },
  { value: "uiux", label: "UI/UX 设计", hint: "优先展示设计与体验语境" },
  { value: "frontend", label: "前端开发", hint: "优先展示界面开发语境" },
  { value: "product", label: "产品设计", hint: "优先展示需求与流程语境" },
  { value: "marketing", label: "市场营销", hint: "优先展示增长与传播语境" },
  { value: "business", label: "商业沟通", hint: "优先展示会议与协作语境" },
];

export const industryPromptMap: Record<
  IndustryOption,
  { label: string; guidance: string }
> = {
  general: {
    label: "通用学习",
    guidance: "Use the most common everyday meaning and a natural general-learning example.",
  },
  uiux: {
    label: "UI/UX 设计",
    guidance:
      "Prioritize UI/UX design meanings involving interface, usability, flows, interaction, accessibility, research, and visual systems.",
  },
  frontend: {
    label: "前端开发",
    guidance:
      "Prioritize frontend development meanings involving components, browser behavior, rendering, state, layout, and user interface implementation.",
  },
  product: {
    label: "产品设计",
    guidance:
      "Prioritize product and feature strategy meanings involving roadmap, requirements, delivery, user problems, and collaboration.",
  },
  marketing: {
    label: "市场营销",
    guidance:
      "Prioritize marketing meanings involving campaigns, messaging, conversion, audience, and growth.",
  },
  business: {
    label: "商业沟通",
    guidance:
      "Prioritize business collaboration meanings involving meetings, negotiation, planning, teamwork, and execution.",
  },
};

export function getIndustryLabel(value: IndustryOption) {
  return industryPromptMap[value]?.label ?? industryPromptMap.general.label;
}
