"use client";

import { useEffect } from "react";
import { useCart } from "./cart";

export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => clear(), [clear]);
  return null;
}
