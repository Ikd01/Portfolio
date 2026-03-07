import { useEffect, useRef } from "react";

export default function MagneticButton({ href, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const tx = ((x / rect.width) - 0.5) * 10;
      const ty = ((y / rect.height) - 0.5) * 10;
      node.style.transform = `translate(${tx}px, ${ty}px)`;
    };

    const onLeave = () => {
      node.style.transform = "translate(0px, 0px)";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <a ref={ref} className={`${className} magnetic-btn`} href={href}>
      {children}
    </a>
  );
}