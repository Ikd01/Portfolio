import { Orb } from "@appletosolutions/reactbits";

export default function OrbBackground() {
  return (
    <div className="orb-background" aria-hidden="true">
      <div className="orb-reactbits-wrap">
        <Orb />
      </div>
      <div className="orb-noise" />
    </div>
  );
}