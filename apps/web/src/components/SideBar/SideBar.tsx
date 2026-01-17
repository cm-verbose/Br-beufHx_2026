"use client";

import Link from "next/link";
import "./styles.scss";
import { usePathname } from "next/navigation";

/**
 * The application's side bar.
 * @returns
 */
export default function SideBar() {
  const pathName = usePathname();
  const links: Array<[string, string]> = [
    ["/", "Dashboard"],
    ["/projects", "Projects"],
  ];

  return (
    <div className="SideBar">
      <ul>
        {links.map((link) => {
          const [href, name] = link;
          const isActive: boolean = href === "/" ? pathName === href : pathName.startsWith(href);
          return (
            <li key={name} className={isActive ? "active" : ""}>
              {isActive ? <>{name}</> : <Link href={href}>{name}</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
