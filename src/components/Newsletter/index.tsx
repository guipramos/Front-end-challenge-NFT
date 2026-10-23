import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const features = [
  {
    letter: "W",
    title: "Segurança da carteira",
    description:
      "Proteja sua carteira e colecione arte digital verificada com confiança.",
  },
  {
    letter: "C",
    title: "Criadores em destaque",
    description:
      "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
  },
  {
    letter: "D",
    title: "Alertas de lançamentos",
    description:
      "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
  },
] as const;

export function Newsletter() {
  return (
    <section
      aria-label="Diferenciais e newsletter"
      className="grid gap-4 bg-surface-200 p-8 lg:grid-cols-4"
    >
      {features.map((feature) => (
        <article
          key={feature.title}
          className="flex flex-col gap-3 lg:border-r lg:border-primary-200/60 lg:pr-8"
        >
          <span
            aria-hidden="true"
            className="w-18 h-18 flex size-10 items-center justify-center rounded-full bg-primary text-[18px] font-bold text-primary-foreground"
          >
            {feature.letter}
          </span>
          <h3 className="text-[17px] text-foreground font-bold">
            {feature.title}
          </h3>
          <p className="text-sm font-normal text-muted-200">
            {feature.description}
          </p>
        </article>
      ))}

      <form className="flex flex-col gap-2">
        <div className="flex  flex-col gap-3">
          <h3 className="text-[18px] font-bold text-foreground leading-4">
            Antecipe-se ao próximo lançamento
          </h3>
          <div className="flex">
            <Label htmlFor="newsletter-email" className="sr-only">
              E-mail
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="digite seu e-mail..."
              className="h-10 flex-1 rounded-md rounded-r-none border-surface-alt-200 bg-surface-alt-200 px-3 text-sm placeholder:text-primary-300"
            />
            <Button
              type="submit"
              size="sm"
              className="h-10! w-21.25 font-bold text-[18px] pl-4 shrink-0 rounded-l-none!"
            >
              Enviar
            </Button>
          </div>
        </div>
        <div>
          <p className="text-[13px] leading-5.5 text-muted-200">
            Receba lançamentos selecionados, histórias de criadores e novidades
            do mercado.
          </p>
        </div>
      </form>
    </section>
  );
}
