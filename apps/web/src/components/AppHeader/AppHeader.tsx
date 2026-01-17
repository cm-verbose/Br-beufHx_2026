import "./styles.scss";
import Image from "next/image";

/** Represents the top header for the website */
export default function AppHeader() {
  return (
    <header className="AppHeader">
      <div id="main-search">
        <Image src="/svg/search.svg" loading="eager" width={32} height={32} alt="Search Icon" />
        <input placeholder="Search" autoComplete="off" spellCheck="false" />
      </div>
    </header>
  );
}
