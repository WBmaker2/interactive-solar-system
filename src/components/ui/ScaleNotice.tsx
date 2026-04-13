import { scaleNotice } from "../../data/planets";

export default function ScaleNotice() {
  return (
    <aside className="scale-notice" aria-label="축척 안내" role="note">
      <p className="scale-notice__label">축척 안내</p>
      <p className="scale-notice__text">{scaleNotice}</p>
    </aside>
  );
}
