const DELIVERY_URL = "https://deliverydireto.com.br/forneria-original";

/**
 * Floating delivery button ("#bolinha"): an orange circle that blinks between
 * orange and yellow with a glowing halo, linking to the external ordering site.
 * Uses the brand's original delivery icon (inverted to white, like the old
 * site). Styling lives in globals.css under the #bolinha selector.
 */
export default function DeliveryButton() {
  return (
    <a
      id="bolinha"
      href={DELIVERY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Peça pelo delivery"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/ico-delivery.png"
        alt="Delivery Forneria Original"
        style={{ filter: "invert(1)", opacity: 0.85 }}
      />
    </a>
  );
}
