import {
  ActivityIcon,
  DownloadsIcon,
  HeartIcon,
  LocationIcon,
  OffersIcon,
  SupportIcon,
  UserIcon,
} from "../components/icones/ProfileMenu/ProfileMenu";
import type { ProfileMenuItem } from "../Types";

export const accentIcon = "text-[#d2936c]";
const mutedIcon = "text-muted-200";

export const profileMenuItems = [
  {
    label: "Dados do perfil",
    Icon: UserIcon,
    active: true,
    indent: true,
    iconClassName: accentIcon,
  },
  {
    label: "Carteiras",
    Icon: LocationIcon,
    indent: true,
    iconClassName: `${mutedIcon} translate-x-[1.5px]`,
  },
  { label: "Atividade", Icon: ActivityIcon, iconClassName: mutedIcon },
  {
    label: "Lista de interesse",
    Icon: HeartIcon,
    iconClassName: `${mutedIcon} -translate-x-px`,
  },
  { label: "Ofertas", Icon: OffersIcon, iconClassName: mutedIcon },
  { label: "Arquivos baixados", Icon: DownloadsIcon, iconClassName: mutedIcon },
  { label: "Suporte", Icon: SupportIcon, iconClassName: mutedIcon },
] as const satisfies readonly ProfileMenuItem[];
