export type PromoBannerProps = {
  image: string;
  title: string;
  description: string;
  cta: string;
};

export type BlogCardProps = {
  image: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
};

export type FooterLinkGroup = {
  title: string;
  links: readonly string[];
};
