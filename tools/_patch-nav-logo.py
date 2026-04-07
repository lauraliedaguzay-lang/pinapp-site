# one-off: SVG+texte -> pinapp-logo.png
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent

OLD = """        <svg width=\"30\" height=\"36\" viewBox=\"0 0 32 38\" fill=\"none\" aria-hidden=\"true\" style=\"flex-shrink:0;\"><defs><linearGradient id=\"pg-n\" x1=\"16\" y1=\"36\" x2=\"16\" y2=\"2\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0%\" stop-color=\"#7B4FE8\"/><stop offset=\"100%\" stop-color=\"#00E5CC\"/></linearGradient></defs><path d=\"M16 2 C13 5 10 6 11 9\" stroke=\"url(#pg-n)\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M16 2 L16 9\" stroke=\"url(#pg-n)\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M16 2 C19 5 22 6 21 9\" stroke=\"url(#pg-n)\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/><ellipse cx=\"16\" cy=\"24\" rx=\"9\" ry=\"12\" fill=\"url(#pg-n)\"/><path d=\"M7 20 L16 15 L25 20 L16 25 Z\" stroke=\"rgba(255,255,255,0.45)\" stroke-width=\"0.7\" fill=\"none\"/><path d=\"M7 26 L16 21 L25 26 L16 31 Z\" stroke=\"rgba(255,255,255,0.45)\" stroke-width=\"0.7\" fill=\"none\"/></svg>
        <span style=\"font-size:16px;font-weight:600;letter-spacing:-0.02em;background:linear-gradient(90deg,#7B4FE8,#00E5CC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;\">Pinapp</span>"""


def rel_src(html_path: pathlib.Path) -> tuple[str, bool]:
    p = html_path.relative_to(root)
    depth = len(p.parts) - 1
    if depth == 0:
        return "assets/images/pinapp-logo.png", True
    if depth == 1:
        return "../assets/images/pinapp-logo.png", False
    return "../../assets/images/pinapp-logo.png", False


def main() -> None:
    n = 0
    for f in root.rglob("*.html"):
        t = f.read_text(encoding="utf-8")
        if OLD not in t:
            continue
        src, high = rel_src(f)
        extra = ' fetchpriority="high"' if high else ""
        new = f'        <img class="nav-logo-img" src="{src}" alt="" width="132" height="36" decoding="async"{extra} />'
        f.write_text(t.replace(OLD, new, 1), encoding="utf-8")
        n += 1
    print("replaced", n, "files")


if __name__ == "__main__":
    main()
