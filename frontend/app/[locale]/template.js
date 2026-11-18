/** Re-mounts on every navigation: a curtain lifts while the new page settles in. */
export default function Template({ children }) {
  return (
    <>
      <div className="page-curtain" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
