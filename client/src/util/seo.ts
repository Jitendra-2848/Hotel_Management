/**
 * Dynamic SEO helper for Single Page Application route updates
 */
export function updateSEO(title: string, description?: string) {
  if (typeof document === "undefined") return;

  if (title) {
    document.title = title;
  }

  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }
}
