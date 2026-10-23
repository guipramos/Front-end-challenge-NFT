import { Button } from "@/components/ui/button";
import Monkey from "../../assets/monkey-1.png";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid gap-10 md:grid-cols-2 mt-8"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-foreground tracking-widest mt-11 leading-4">
          Bem-vindo à Kurio
        </span>
        <h1
          id="hero-title"
          className="text-[43px] mt-2 mb-1 leading-17.5 font-bold uppercase"
        >
          Seja dono do futuro da arte digital
        </h1>
        <p className="max-w-139.25 font-regular text-sm leading-6 text-muted-200">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>
        <Button className="mt-8">Explorar</Button>
      </div>

      <div className="flex flex-col items-end gap-4">
        <div className="aspect-square w-full max-w-112.5 overflow-hidden rounded-3xl bg-nft-bg">
          <img
            src={Monkey}
            alt="Macaco de óculos escuros e jaqueta verde"
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
