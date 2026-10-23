import { cn } from "@/lib/utils";
import { accentIcon, profileMenuItems } from "../../data/profile";
import { SignOutIcon } from "../icones/ProfileMenu/ProfileMenu";

const itemClass =
  "relative flex w-full items-center gap-2 pl-[13px] text-left text-[15px] leading-6 text-primary-200 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-200";

export function ProfileSidebar() {
  return (
    <aside
      aria-labelledby="profile-menu-title"
      className="flex h-[407px] w-77.5 shrink-0 flex-col bg-surface pt-[14px]"
    >
      <h2
        id="profile-menu-title"
        className="px-2.5 text-lg leading-6 font-medium text-foreground"
      >
        Meu perfil
      </h2>

      <nav aria-label="Menu do perfil" className="flex flex-1 flex-col">
        <ul className="mt-[5px]">
          {profileMenuItems.map((item) => {
            const { label, Icon } = item;
            const active = "active" in item && item.active;
            const indent = "indent" in item && item.indent;
            const iconClassName = "iconClassName" in item ? item.iconClassName : undefined;

            return (
              <li key={label}>
                <button
                  type="button"
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    itemClass,
                    "h-[45px]",
                    active &&
                      "before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-primary-200 before:content-['']",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn("size-6 shrink-0 p-[3px]", iconClassName)}
                  />
                  <span className={cn(indent && "ml-1")}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-muted-200/20">
          <button
            type="button"
            className={cn(itemClass, "h-[41px] font-bold")}
          >
            <SignOutIcon
              aria-hidden="true"
              className={cn("size-6 shrink-0 p-[3px]", accentIcon)}
            />
            Sair
          </button>
        </div>
      </nav>
    </aside>
  );
}
