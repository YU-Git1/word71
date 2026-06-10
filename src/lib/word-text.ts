export function cleanMeaningText(value: string) {
  return value
    .replace(/（优先行业：[^）]+）/g, "")
    .replace(/优先考虑[^，。；]*[，。；]?/g, "")
    .replace(/包括界面、可用性、流程、交互、可访问性、研究和视觉系统。?/g, "")
    .replace(/当前优先行业语境[:：][^，。；]*/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[：:，,。\s]+|[：:，,。\s]+$/g, "")
    .trim();
}
