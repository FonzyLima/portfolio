// Private sandbox like /lab: kept out of search results and not linked publicly.
export const metadata = {
  title: "Experiments | Alfonso Lima",
  robots: { index: false, follow: false },
  description:
    "Small interface experiments from Alfonso Lima's portfolio, with live demos: a Game Boy battle intro, a morphing menu icon, a sliding nav indicator and a theme icon crossfade.",
};

export default function ExperimentsLayout({ children }) {
  return children;
}
