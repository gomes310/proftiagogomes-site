// true dentro do app Android (Capacitor): sem links de compra, por regra da Google Play
export const APP: boolean = import.meta.env.VITE_APP === '1' || !!(globalThis as { Capacitor?: unknown }).Capacitor;
