import defaultSettings from "@/settings";

const title = defaultSettings.title || "南京旅游助手";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
