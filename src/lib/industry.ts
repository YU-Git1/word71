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

const INDUSTRY_KEYWORDS: Record<IndustryOption, string[]> = {
  general: ["常用", "通用", "一般", "日常", "常见"],
  uiux: ["界面", "交互", "体验", "设计", "可用性", "视觉", "用户", "产品界面"],
  frontend: ["前端", "组件", "浏览器", "渲染", "状态", "布局", "页面", "界面开发"],
  product: ["产品", "需求", "流程", "路线图", "交付", "功能", "协作", "策略"],
  marketing: ["营销", "传播", "增长", "转化", "受众", "活动", "品牌", "投放"],
  business: ["商务", "会议", "谈判", "协商", "合作", "执行", "团队", "沟通"],
};

export function scoreMeaningForIndustry(value: string, industry: IndustryOption) {
  const keywords = INDUSTRY_KEYWORDS[industry] ?? [];
  if (industry === "general") {
    return 0;
  }

  return keywords.reduce((score, keyword) => {
    return value.includes(keyword) ? score + 1 : score;
  }, 0);
}
