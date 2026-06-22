export function getAmazonLink(ingredient: string): string {
  const tag = process.env.AMAZON_TRACKING_ID ?? "joesmealmap-20";
  return `https://www.amazon.com/s?k=${encodeURIComponent(ingredient)}&tag=${tag}`;
}
