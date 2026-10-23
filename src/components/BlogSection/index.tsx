import type { BlogCardProps } from "../../Types";
import { BlogCard } from "../BlogCard";
import monkey3 from "../../assets/monkey-3.png";
import monkey4 from "../../assets/monkey-4.png";
import monkey5 from "../../assets/monkey-5.png";
import monkey9 from "../../assets/monkey-9.png";

const posts = [
  {
    image: monkey5,
    date: "12 de setembro",
    readTime: "Leitura de 6 min",
    title: "Como funciona a propriedade de NFTs",
    excerpt: "Aprenda a colecionar, negociar e verificar ativos digitais.",
  },
  {
    image: monkey3,
    date: "13 de setembro",
    readTime: "Leitura de 2 min",
    title: "10 artistas digitais para acompanhar",
    excerpt: "Conheça criadores que moldam a cultura digital.",
  },
  {
    image: monkey4,
    date: "15 de setembro",
    readTime: "Leitura de 3 min",
    title: "Raridade, atributos e procedência",
    excerpt: "Entenda raridade, procedência, direitos autorais e utilidade.",
  },
  {
    image: monkey9,
    date: "15 de setembro",
    readTime: "Leitura de 2 min",
    title: "Como proteger sua carteira",
    excerpt: "Proteja sua carteira, seus ativos e sua identidade.",
  },
] as const satisfies readonly BlogCardProps[];

export function BlogSection() {
  return (
    <section aria-labelledby="blog-title" className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h2 id="blog-title" className="text-[28px] font-bold text-foreground">
          Diário da Cunhagem
        </h2>
        <p className="text-sm text-muted-200 font-normal">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <li key={post.title} className="flex">
            <BlogCard {...post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
